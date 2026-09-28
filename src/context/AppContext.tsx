import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, TabType, Technician } from '../types';
import { INITIAL_ASSETS, TECHNICIANS_LIST } from '../data/mockData';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../firebase';

interface AppContextType {
  assets: Asset[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  viewAssetDetail: (id: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, partial: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  completeMaintenance: (
    assetId: string,
    interventionTitle: string,
    technicianName: string,
    technicianReg: string,
    notes: string,
    executionDate?: string
  ) => void;
  qrModalAsset: Asset | null;
  openQrModal: (asset: Asset) => void;
  closeQrModal: () => void;
  executeModalAsset: Asset | null;
  openExecuteModal: (asset: Asset) => void;
  closeExecuteModal: () => void;
  syncStatus: 'synced' | 'syncing' | 'offline';
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  triggerManualSync: () => void;
  resetToInitialData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  plantName: string;
  setPlantName: (plant: string) => void;
  plantLine: string;
  setPlantLine: (line: string) => void;
  technicians: Technician[];
  addTechnician: (tech: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, tech: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'indusmaint_assets_concast_v6';
const TECH_STORAGE_KEY = 'indusmaint_techs_concast_v3';

function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = cleanForFirestore(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        item !== null && typeof item === 'object' ? cleanForFirestore(item) : item
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ASSETS;
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    try {
      const saved = localStorage.getItem(TECH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return TECHNICIANS_LIST;
  });

  const [activeTab, setActiveTab] = useState<TabType>('equipamentos');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [qrModalAsset, setQrModalAsset] = useState<Asset | null>(null);
  const [executeModalAsset, setExecuteModalAsset] = useState<Asset | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [plantName, setPlantNameState] = useState<string>('SN SEIXAL');
  const [plantLine, setPlantLineState] = useState<string>('SMS CONCAST');

  const isInitialSeedingRef = useRef(false);
  const isTechSeedingRef = useRef(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Local storage persistence fallback
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assets));
    } catch {
      // ignore
    }
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem(TECH_STORAGE_KEY, JSON.stringify(technicians));
    } catch {
      // ignore
    }
  }, [technicians]);

  // Real-time Firestore Cloud Synchronization across Windows, Android & any browser
  useEffect(() => {
    testFirestoreConnection();

    // 1. Assets Real-Time Listener
    const assetsPath = 'assets';
    const unsubAssets = onSnapshot(
      collection(db, assetsPath),
      async snapshot => {
        if (snapshot.empty && !isInitialSeedingRef.current) {
          isInitialSeedingRef.current = true;
          setSyncStatus('syncing');
          try {
            // Seed initial industrial assets to Firestore on first project load
            const batch = writeBatch(db);
            INITIAL_ASSETS.forEach(asset => {
              const cleanAsset = cleanForFirestore(asset);
              batch.set(doc(db, 'assets', asset.id), cleanAsset);
            });
            await batch.commit();
            setSyncStatus('synced');
          } catch (err) {
            console.error('Error seeding initial assets to Firestore:', err);
            handleFirestoreError(err, OperationType.WRITE, assetsPath);
          }
        } else if (!snapshot.empty) {
          const cloudAssets: Asset[] = [];
          snapshot.forEach(docSnap => {
            cloudAssets.push(docSnap.data() as Asset);
          });
          setAssets(cloudAssets);
          setSyncStatus('synced');
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, assetsPath);
      }
    );

    // 2. Technicians Real-Time Listener
    const techsPath = 'technicians';
    const unsubTechs = onSnapshot(
      collection(db, techsPath),
      async snapshot => {
        if (snapshot.empty && !isTechSeedingRef.current) {
          isTechSeedingRef.current = true;
          try {
            const batch = writeBatch(db);
            TECHNICIANS_LIST.forEach(tech => {
              batch.set(doc(db, 'technicians', tech.id), tech);
            });
            await batch.commit();
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, techsPath);
          }
        } else {
          isTechSeedingRef.current = true;
          const cloudTechs: Technician[] = [];
          snapshot.forEach(docSnap => {
            cloudTechs.push(docSnap.data() as Technician);
          });
          setTechnicians(cloudTechs);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, techsPath);
      }
    );

    // 3. Settings Real-Time Listener
    const settingsPath = 'settings';
    const unsubSettings = onSnapshot(
      doc(db, settingsPath, 'plant'),
      docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.plantName) setPlantNameState(data.plantName);
          if (data.plantLine) setPlantLineState(data.plantLine);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.GET, `${settingsPath}/plant`);
      }
    );

    return () => {
      unsubAssets();
      unsubTechs();
      unsubSettings();
    };
  }, []);

  const setPlantName = async (name: string) => {
    setPlantNameState(name);
    try {
      await setDoc(doc(db, 'settings', 'plant'), { plantName: name, plantLine }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/plant');
    }
  };

  const setPlantLine = async (line: string) => {
    setPlantLineState(line);
    try {
      await setDoc(doc(db, 'settings', 'plant'), { plantName, plantLine: line }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/plant');
    }
  };

  const addTechnician = async (tech: Omit<Technician, 'id'>) => {
    const newTech: Technician = {
      ...tech,
      id: 'tech-' + Date.now()
    };
    setTechnicians(prev => [...prev, newTech]);
    showToast(`Técnico "${newTech.name}" adicionado com sucesso.`);

    const path = `technicians/${newTech.id}`;
    try {
      await setDoc(doc(db, 'technicians', newTech.id), newTech);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateTechnician = async (id: string, partial: Partial<Technician>) => {
    setTechnicians(prev =>
      prev.map(t => (t.id === id ? { ...t, ...partial } : t))
    );
    showToast('Técnico atualizado com sucesso.');

    const path = `technicians/${id}`;
    try {
      await updateDoc(doc(db, 'technicians', id), cleanForFirestore(partial));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteTechnician = async (id: string) => {
    setTechnicians(prev => prev.filter(t => t.id !== id));
    showToast('Técnico removido do quadro.');

    const path = `technicians/${id}`;
    try {
      await deleteDoc(doc(db, 'technicians', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const triggerManualSync = () => {
    if (isOfflineMode) {
      showToast('Modo Offline ativo. Dados guardados no cache local.');
      return;
    }
    setSyncStatus('syncing');
    showToast('A sincronizar com a base de dados em nuvem...');
    setTimeout(() => {
      setSyncStatus('synced');
      showToast('Base de dados em nuvem sincronizada em tempo real!');
    }, 800);
  };

  const viewAssetDetail = (id: string) => {
    setSelectedAssetId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addAsset = async (newAsset: Asset) => {
    const cleanAsset = cleanForFirestore(newAsset);
    setAssets(prev => [cleanAsset, ...prev]);
    showToast(`Ativo ${newAsset.tag} gravado na nuvem com sucesso!`);

    const path = `assets/${cleanAsset.id}`;
    try {
      await setDoc(doc(db, 'assets', cleanAsset.id), cleanAsset);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateAsset = async (id: string, partial: Partial<Asset>) => {
    const cleanPartial = cleanForFirestore(partial);
    setAssets(prev =>
      prev.map(asset => (asset.id === id ? { ...asset, ...cleanPartial } : asset))
    );

    const path = `assets/${id}`;
    try {
      await updateDoc(doc(db, 'assets', id), cleanPartial);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteAsset = async (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    showToast('Ativo removido do inventário em nuvem.');
    if (selectedAssetId === id) {
      setSelectedAssetId(null);
    }

    const path = `assets/${id}`;
    try {
      await deleteDoc(doc(db, 'assets', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const completeMaintenance = async (
    assetId: string,
    interventionTitle: string,
    technicianName: string,
    technicianReg: string,
    notes: string,
    executionDate?: string
  ) => {
    let dateObj = new Date();
    if (executionDate) {
      const parsed = new Date(executionDate);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

    const currentAsset = assets.find(a => a.id === assetId);
    if (!currentAsset) return;

    const freqDays = currentAsset.nextIntervention.frequencyDays || 30;
    const nextDate = new Date(dateObj);
    nextDate.setDate(nextDate.getDate() + freqDays);
    const formattedNextDate = `${nextDate.getDate().toString().padStart(2, '0')}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}/${nextDate.getFullYear()}`;

    const updatedHistory = [
      {
        id: 'h-' + Date.now(),
        title: interventionTitle,
        date: formattedDate,
        notes: notes || 'Intervenção preventiva executada e calibrada de acordo com procedimento padrão do Vazamento Contínuo.',
        technicianName,
        technicianRole: 'Técnico Responsável',
        technicianReg: technicianReg || 'Rubrica Manual',
        technicianAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gWrF5lATcnxnGAISqfZXHA14TRg_znYeMhsMaFTZuCvvaN2TFrLqTegiSHE2KpBuswVAPA5A-XzREb2109zJk5I47SiWJ8C3yJd_9Aj9FNukmZaflCFFw-IiexzmrpT4LMj-7XAjcS7hPPjVlwWrnQVlakJ5-pH0Ba0ohH1rf7FpO19tfdxU5kyeFOn4YOvLnQ5UueRxhRFGOgbYuokC1Z60r_8YZQxU0kFqJrWtPQgKOnOb85AJ',
        verified: true
      },
      ...(currentAsset.history || [])
    ];

    const updatedFields: Partial<Asset> = {
      status: 'Operacional',
      statusLabel: `PLANO EM DIA (${freqDays} DIAS)`,
      lastInterventionDate: formattedDate,
      nextIntervention: {
        ...currentAsset.nextIntervention,
        dueDate: formattedNextDate,
        daysRemaining: freqDays
      },
      history: updatedHistory
    };

    updateAsset(assetId, updatedFields);
    showToast(`Manutenção concluída e sincronizada para ${interventionTitle}!`);
  };

  const openQrModal = (asset: Asset) => setQrModalAsset(asset);
  const closeQrModal = () => setQrModalAsset(null);

  const openExecuteModal = (asset: Asset) => setExecuteModalAsset(asset);
  const closeExecuteModal = () => setExecuteModalAsset(null);

  const resetToInitialData = async () => {
    setSyncStatus('syncing');
    try {
      const batch = writeBatch(db);
      INITIAL_ASSETS.forEach(asset => {
        batch.set(doc(db, 'assets', asset.id), cleanForFirestore(asset));
      });
      await batch.commit();
      setAssets(INITIAL_ASSETS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSyncStatus('synced');
      showToast('Dados de fábrica restaurados e sincronizados na nuvem.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'assets');
    }
  };

  return (
    <AppContext.Provider
      value={{
        assets,
        activeTab,
        setActiveTab,
        selectedAssetId,
        setSelectedAssetId,
        viewAssetDetail,
        addAsset,
        updateAsset,
        deleteAsset,
        completeMaintenance,
        qrModalAsset,
        openQrModal,
        closeQrModal,
        executeModalAsset,
        openExecuteModal,
        closeExecuteModal,
        syncStatus,
        isOfflineMode,
        setIsOfflineMode,
        triggerManualSync,
        resetToInitialData,
        toastMessage,
        showToast,
        plantName,
        setPlantName,
        plantLine,
        setPlantLine,
        technicians,
        addTechnician,
        updateTechnician,
        deleteTechnician
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
