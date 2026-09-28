import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, selectedAssetId, setSelectedAssetId } = useApp();

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'equipamentos', label: 'Vaz. Cont.', icon: 'precision_manufacturing' },
    { id: 'novo-registo', label: '+ Novo', icon: 'add_circle' },
    { id: 'planos-manutencao', label: 'Planos', icon: 'event_repeat' },
    { id: 'relatorios-exportacao', label: 'Relatórios', icon: 'analytics' },
    { id: 'configuracoes', label: 'Config', icon: 'tune' }
  ];

  const handleTabClick = (tabId: TabType) => {
    setSelectedAssetId(null);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#060e20]/95 backdrop-blur-xl border-t border-[#171f33] shadow-[0_-4px_24px_rgba(0,0,0,0.45)]">
      <div className="flex justify-around items-center h-20 px-2 max-w-4xl mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id && !selectedAssetId;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center min-w-[58px] h-14 rounded-lg px-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#b4c5ff] bg-[#222a3d]/60 font-semibold shadow-sm'
                  : 'text-[#c3c6d7] hover:text-[#dae2fd]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-sm text-label-sm tracking-tight mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
