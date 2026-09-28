import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QrModal } from './components/QrModal';
import { ExecuteMaintenanceModal } from './components/ExecuteMaintenanceModal';
import { Toast } from './components/Toast';

import { EquipamentosView } from './views/EquipamentosView';
import { NovoRegistoView } from './views/NovoRegistoView';
import { DetalheEquipamentoView } from './views/DetalheEquipamentoView';
import { PlanosView } from './views/PlanosView';
import { RelatoriosView } from './views/RelatoriosView';
import { ConfigView } from './views/ConfigView';

const MainContent: React.FC = () => {
  const { activeTab, selectedAssetId, setSelectedAssetId } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1326] text-[#dae2fd]">
      <Header
        showBack={Boolean(selectedAssetId)}
        onBack={selectedAssetId ? () => setSelectedAssetId(null) : undefined}
      />

      <main className="flex-1 w-full pt-16 px-4">
        {selectedAssetId ? (
          <DetalheEquipamentoView assetId={selectedAssetId} />
        ) : (
          <>
            {activeTab === 'equipamentos' && <EquipamentosView />}
            {activeTab === 'novo-registo' && <NovoRegistoView />}
            {activeTab === 'planos-manutencao' && <PlanosView />}
            {activeTab === 'relatorios-exportacao' && <RelatoriosView />}
            {activeTab === 'configuracoes' && <ConfigView />}
          </>
        )}
      </main>

      <BottomNav />
      <QrModal />
      <ExecuteMaintenanceModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
