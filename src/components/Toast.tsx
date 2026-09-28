import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#171f33] text-[#dae2fd] border border-[#2563eb] p-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-lg">
        <span className="material-symbols-outlined text-[#4edea3] text-[22px] shrink-0">
          task_alt
        </span>
        <span className="font-body-sm text-body-sm font-medium leading-snug">{toastMessage}</span>
      </div>
    </div>
  );
};
