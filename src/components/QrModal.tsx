import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const QrModal: React.FC = () => {
  const { qrModalAsset, closeQrModal, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!qrModalAsset) return null;

  const handlePrint = () => {
    showToast(`Comando enviado para impressora térmica industrial Zebra (Linha 2). Tag: ${qrModalAsset.tag}`);
    closeQrModal();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(qrModalAsset.tag);
    setCopied(true);
    showToast(`Código ${qrModalAsset.tag} copiado para a área de transferência!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-xs bg-[#222a3d] border border-[#2d3449] rounded-xl p-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#4edea3]">qr_code_scanner</span>
            <span className="font-label-md text-label-md text-[#dae2fd] uppercase font-bold tracking-wider">
              {qrModalAsset.tag}
            </span>
          </div>
          <button
            onClick={closeQrModal}
            className="w-9 h-9 flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] active:bg-[#2d3449] rounded-lg transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Industrial Label Pattern Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg my-2 shadow-inner">
          <div className="text-[10px] font-mono text-black font-bold uppercase tracking-wider mb-1">
            INDUSMAINT • ISO-14224
          </div>
          <svg className="w-40 h-40" fill="#0b1326" viewBox="0 0 100 100">
            <rect fill="#0b1326" height="25" rx="3" width="25" x="5" y="5"></rect>
            <rect fill="#ffffff" height="15" width="15" x="10" y="10"></rect>
            <rect fill="#0b1326" height="9" width="9" x="13" y="13"></rect>
            <rect fill="#0b1326" height="25" rx="3" width="25" x="70" y="5"></rect>
            <rect fill="#ffffff" height="15" width="15" x="75" y="10"></rect>
            <rect fill="#0b1326" height="9" width="9" x="78" y="13"></rect>
            <rect fill="#0b1326" height="25" rx="3" width="25" x="5" y="70"></rect>
            <rect fill="#ffffff" height="15" width="15" x="10" y="75"></rect>
            <rect fill="#0b1326" height="9" width="9" x="13" y="78"></rect>
            <rect height="8" width="8" x="35" y="10"></rect>
            <rect height="16" width="6" x="48" y="12"></rect>
            <rect height="7" width="7" x="35" y="24"></rect>
            <rect height="6" width="12" x="46" y="36"></rect>
            <rect height="18" width="10" x="15" y="42"></rect>
            <rect height="8" width="8" x="30" y="45"></rect>
            <rect height="12" width="8" x="42" y="52"></rect>
            <rect height="8" width="16" x="62" y="40"></rect>
            <rect height="14" width="8" x="70" y="54"></rect>
            <rect height="6" width="10" x="84" y="48"></rect>
            <rect height="12" width="12" x="38" y="72"></rect>
            <rect height="6" width="14" x="56" y="70"></rect>
            <rect height="12" width="12" x="60" y="82"></rect>
            <rect height="18" width="14" x="80" y="75"></rect>
          </svg>
          <div className="text-[11px] font-mono text-black font-semibold mt-1">
            {qrModalAsset.tag}
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-[#c3c6d7] text-center font-medium truncate">
          {qrModalAsset.name}
        </p>
        <span className="text-[11px] text-[#8d90a0] text-center truncate mb-1">
          {qrModalAsset.sector}
        </span>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={handlePrint}
            className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#171f33] text-[#dae2fd] font-label-sm text-label-sm active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors border border-[#2d3449]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimir</span>
          </button>
          <button
            onClick={handleCopy}
            className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] text-[#eeefff] font-label-sm text-label-sm font-semibold active:brightness-95 hover:bg-[#1d4ed8] transition-all shadow-md shadow-[#2563eb]/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copiado' : 'Copiar Tag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
