import React from 'react';
import { useApp } from '../context/AppContext';
import { MmaLogo } from './MmaLogo';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, showBack }) => {
  const { plantName, plantLine, syncStatus, isOfflineMode, triggerManualSync, activeTab, selectedAssetId, setSelectedAssetId } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (selectedAssetId) {
      setSelectedAssetId(null);
    }
  };

  const getHeaderTitle = () => {
    if (title) return title;
    if (selectedAssetId) return 'Detalhe Do Equipamento';
    switch (activeTab) {
      case 'equipamentos':
        return 'Vazamento Contínuo';
      case 'novo-registo':
        return 'Novo Registo';
      case 'planos-manutencao':
        return 'Planos de Manutenção';
      case 'relatorios-exportacao':
        return 'Relatórios Exportação';
      case 'configuracoes':
        return 'Configurações';
      default:
        return 'IndusMaint';
    }
  };

  const isDetail = Boolean(selectedAssetId || showBack);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0b1326]/90 backdrop-blur-xl pt-safe shadow-[0_4px_20px_rgba(0,0,0,0.35)] border-b border-[#171f33]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isDetail ? (
            <button
              onClick={handleBack}
              aria-label="Voltar"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#dae2fd] active:bg-[#222a3d] transition-colors shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          {/* MMA Emblem Logo */}
          <MmaLogo className="h-9 w-9" size={36} />

          <div className="flex flex-col min-w-0 pl-1">
            <div className="flex items-center gap-1">
              <span className="font-headline-sm text-headline-sm text-[#dae2fd] truncate tracking-tight">
                {getHeaderTitle()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#c3c6d7]">
              <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase tracking-wider truncate">
                {plantName} - {plantLine}
              </span>
              <span className="text-[10px] text-[#8d90a0]">•</span>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOfflineMode
                      ? 'bg-[#ffb95f]'
                      : syncStatus === 'syncing'
                      ? 'bg-[#b4c5ff] animate-ping'
                      : 'bg-[#4edea3] animate-pulse'
                  }`}
                />
                <span
                  className={`font-label-sm text-label-sm uppercase font-semibold ${
                    isOfflineMode ? 'text-[#ffb95f]' : syncStatus === 'syncing' ? 'text-[#b4c5ff]' : 'text-[#4edea3]'
                  }`}
                >
                  {isOfflineMode ? 'OFFLINE' : syncStatus === 'syncing' ? 'A GRAVAR...' : 'NUVEM ATIVA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerManualSync}
            title={isOfflineMode ? 'Modo Offline Ativo' : 'Base de dados em nuvem ativa (sincronização em tempo real)'}
            aria-label="Estado da Ligação em Nuvem"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#222a3d] text-[#4edea3] active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                syncStatus === 'syncing' ? 'animate-spin text-[#b4c5ff]' : ''
              }`}
            >
              {isOfflineMode ? 'cloud_off' : syncStatus === 'syncing' ? 'sync' : 'cloud_done'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
