import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Asset } from '../types';
import { generateAssetDossierPdf } from '../utils/pdfGenerator';
import { EditAssetModal } from '../components/EditAssetModal';

interface DetalheProps {
  assetId: string;
}

export const DetalheEquipamentoView: React.FC<DetalheProps> = ({ assetId }) => {
  const { assets, setSelectedAssetId, openExecuteModal, openQrModal, showToast } = useApp();

  const asset = assets.find(a => a.id === assetId) || assets[0];

  const [showDossierModal, setShowDossierModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!asset) {
    return (
      <div className="p-8 text-center">
        <p>Equipamento não encontrado.</p>
        <button
          onClick={() => setSelectedAssetId(null)}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white rounded-lg"
        >
          Voltar
        </button>
      </div>
    );
  }

  const handlePrintDossier = () => {
    showToast(`Dossiê Técnico de ${asset.tag} pronto para impressão / exportação.`);
    setShowDossierModal(true);
  };

  const isCritA = asset.criticality === 'A';
  const isCritB = asset.criticality === 'B';

  const totalDays = asset.nextIntervention.frequencyDays || 30;
  const remainingDays = asset.nextIntervention.daysRemaining;
  const vidaUtilPct = Math.max(0, Math.min(100, Math.round((Math.max(0, remainingDays) / totalDays) * 100)));

  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl mx-auto pb-32 pt-1 animate-in fade-in duration-200">
      {/* Asset Quick Hero Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#222a3d] border border-[#2d3449] shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            alt={asset.name}
            src={asset.imageUrl}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#222a3d] via-[#222a3d]/60 to-transparent"></div>

          {/* Top Floating Tech Tags */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span
              onClick={() => openQrModal(asset)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#060e20]/90 backdrop-blur-md text-[#b4c5ff] font-label-sm text-label-sm uppercase tracking-wider border border-[#2d3449] cursor-pointer hover:border-[#b4c5ff]"
            >
              <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
              {asset.tag}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded backdrop-blur-md font-label-sm text-label-sm font-semibold uppercase tracking-wider ${
                isCritA
                  ? 'bg-[#93000a]/90 text-[#ffdad6]'
                  : isCritB
                  ? 'bg-[#ee9800]/90 text-[#ffddb8]'
                  : 'bg-[#2d3449]/90 text-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">warning</span>
              Criticidade {asset.criticality}
            </span>
          </div>

          {/* Quick Health Ping */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060e20]/80 backdrop-blur-md text-[#4edea3] border border-[#171f33]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
              </span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wide">
                {asset.statusLabel || 'PLANO EM DIA'}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-[#c3c6d7] font-medium bg-[#060e20]/70 backdrop-blur px-2 py-0.5 rounded border border-[#2d3449]">
              {asset.revCode || 'REV: 2024.3'}
            </span>
          </div>
        </div>

        {/* Machine Metadata Overview */}
        <div className="p-4 flex flex-col gap-2.5">
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-[#dae2fd] leading-tight">
              {asset.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-label-lg text-label-lg text-[#b4c5ff] tracking-wide font-mono">
                {asset.tag}
              </span>
              <span className="text-[#434655]">•</span>
              <span className="font-body-sm text-body-sm text-[#c3c6d7] flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[15px] text-[#8d90a0]">factory</span>
                {asset.sector}
              </span>
            </div>
          </div>

          {/* Quick Overview Chips */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#171f33] rounded-lg p-2.5 flex flex-col justify-between border border-[#2d3449]">
              <span className="font-label-sm text-label-sm text-[#8d90a0] flex items-center gap-1 uppercase">
                <span className="material-symbols-outlined text-[13px] text-[#4edea3]">battery_charging_full</span> VIDA ÚTIL
              </span>
              <span className={`font-label-md text-label-md font-bold mt-1 ${vidaUtilPct > 50 ? 'text-[#4edea3]' : vidaUtilPct > 15 ? 'text-[#ffb95f]' : 'text-[#ffb4ab]'}`}>
                {vidaUtilPct}%
              </span>
            </div>
            <div className="bg-[#171f33] rounded-lg p-2.5 flex flex-col justify-between border border-[#2d3449]">
              <span className="font-label-sm text-label-sm text-[#8d90a0] flex items-center gap-1 uppercase">
                <span className="material-symbols-outlined text-[13px]">history</span> ÚLTIMA
              </span>
              <span className="font-label-md text-label-md text-[#c3c6d7] font-medium mt-1 truncate">
                {asset.lastInterventionDate || 'Não registada'}
              </span>
            </div>
            <div className="bg-[#171f33] rounded-lg p-2.5 flex flex-col justify-between border border-[#2d3449]">
              <span className="font-label-sm text-label-sm text-[#4edea3] flex items-center gap-1 uppercase">
                <span className="material-symbols-outlined text-[13px]">event_upcoming</span> PRÓXIMA
              </span>
              <span className="font-label-md text-label-md text-[#4edea3] font-semibold mt-1 truncate">
                {asset.nextIntervention.dueDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vida Útil Progress Indicator */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-3.5 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#4edea3]">av_timer</span>
            <span className="font-label-md text-label-md text-[#dae2fd] uppercase font-semibold">
              Vida Útil Restante do Ativo
            </span>
          </div>
          <span className={`font-headline-sm text-headline-sm font-bold font-mono ${vidaUtilPct > 50 ? 'text-[#4edea3]' : vidaUtilPct > 15 ? 'text-[#ffb95f]' : 'text-[#ffb4ab]'}`}>
            {vidaUtilPct}%
          </span>
        </div>

        <div className="w-full bg-[#060e20] h-2.5 rounded-full overflow-hidden border border-[#222a3d]">
          <div
            className={`h-full transition-all duration-300 ${vidaUtilPct > 50 ? 'bg-[#4edea3]' : vidaUtilPct > 15 ? 'bg-[#ffb95f]' : 'bg-[#ffb4ab]'}`}
            style={{ width: `${vidaUtilPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#8d90a0]">
          <span>Ciclo: {totalDays} dias ({asset.nextIntervention.frequencyLabel})</span>
          <span className="font-mono text-[#dae2fd]">
            {remainingDays < 0 ? `${Math.abs(remainingDays)} dias de atraso` : `${remainingDays} dias restantes`}
          </span>
        </div>
      </div>

      {/* Interactive Section: Plano de Manutenção Cadastrado */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#2563eb]"></span>
            <h3 className="font-headline-sm text-headline-sm text-[#dae2fd]">
              Plano de Manutenção Preventiva
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-[#8d90a0] uppercase bg-[#171f33] px-2 py-0.5 rounded border border-[#2d3449]">
            {asset.routines.length} Rotinas
          </span>
        </div>

        {/* Routines list */}
        <div className="flex flex-col gap-2.5">
          {asset.routines.length === 0 ? (
            <div className="p-4 bg-[#131b2e] rounded-xl text-center text-[#c3c6d7] text-sm">
              Sem rotinas cadastradas para este ativo.
            </div>
          ) : (
            asset.routines.map(routine => {
              const isCal = routine.type === 'Calibração';
              const isSub = routine.type === 'Substituição';
              const isLub = routine.type === 'Lubrificação';

              const icon = isCal
                ? 'tune'
                : isSub
                ? 'swap_horizontal_circle'
                : isLub
                ? 'oil_barrel'
                : 'checklist';
              const accentColor = isCal
                ? 'text-[#b4c5ff]'
                : isSub
                ? 'text-[#ffb95f]'
                : 'text-[#4edea3]';

              return (
                <div
                  key={routine.id}
                  className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-3.5 shadow-sm space-y-2.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#222a3d] flex items-center justify-center shrink-0">
                        <span className={`material-symbols-outlined text-[20px] ${accentColor}`}>
                          {icon}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-label-lg text-label-lg text-[#dae2fd] font-semibold">
                            {routine.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#171f33] text-[#b4c5ff] font-label-sm text-label-sm uppercase font-mono border border-[#2d3449]">
                            {routine.code}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#222a3d] text-[#c3c6d7] font-label-sm text-label-sm">
                            {routine.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descritivo da Tarefa */}
                  <div className="bg-[#060e20]/80 border border-[#171f33] rounded-lg p-2.5 text-[#dae2fd] space-y-1.5">
                    <span className="font-label-sm text-label-sm text-[#8d90a0] uppercase block">
                      Descritivo da Tarefa
                    </span>
                    <p className="font-body-sm text-body-sm text-[#dae2fd] leading-relaxed">
                      {routine.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-body-sm pt-0.5 text-xs text-[#c3c6d7]">
                    <span className="font-label-sm text-[#8d90a0] uppercase">
                      Periodicidade:
                    </span>
                    <span className="font-mono font-semibold text-[#b4c5ff]">
                      {routine.periodicityLabel}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Histórico Recente de Intervenções (Timeline) */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#ffb95f]"></span>
            <h3 className="font-headline-sm text-headline-sm text-[#dae2fd]">
              Histórico Recente de Intervenções
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-[#8d90a0]">
            {asset.history?.length || 0} Registos
          </span>
        </div>

        {/* Timeline Container */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 space-y-4">
          {(!asset.history || asset.history.length === 0) ? (
            <p className="text-sm text-[#c3c6d7] text-center py-2">
              Nenhuma intervenção registrada ainda para este equipamento.
            </p>
          ) : (
            asset.history.map((record, idx) => (
              <div key={record.id} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3] z-10 border border-[#4edea3]/40">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  {idx < asset.history.length - 1 && (
                    <div className="w-0.5 grow bg-[#222a3d] mt-1"></div>
                  )}
                </div>

                <div className="grow flex flex-col pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-semibold text-[#dae2fd]">
                      {record.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-[#8d90a0]">
                      {record.date}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#c3c6d7] mt-1">
                    "{record.notes}"
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <img
                      alt={record.technicianName}
                      className="w-5 h-5 rounded-full object-cover border border-[#2d3449]"
                      src={record.technicianAvatar}
                    />
                    <span className="font-label-sm text-label-sm text-[#b4c5ff]">
                      {record.technicianName} ({record.technicianReg})
                    </span>
                    <span className="font-label-sm text-label-sm text-[#4edea3] ml-auto flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      Rubricado
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Industrial Sticky Bottom Action Bar */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => openExecuteModal(asset)}
          className="w-full h-12 rounded-xl bg-[#2563eb] text-[#eeefff] font-headline-sm text-headline-sm flex items-center justify-center gap-2 active:bg-[#1d4ed8] hover:bg-[#1d4ed8] transition-all shadow-lg shadow-[#2563eb]/25 font-bold"
        >
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
          <span>Executar Manutenção Agora</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="h-11 rounded-lg bg-[#222a3d] text-[#dae2fd] font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-all border border-[#2d3449]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">edit_note</span>
            <span>Editar Parâmetros</span>
          </button>

          <button
            type="button"
            onClick={handlePrintDossier}
            className="h-11 rounded-lg bg-[#222a3d] text-[#dae2fd] font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-all border border-[#2d3449]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">picture_as_pdf</span>
            <span>Dossiê & Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* Modal de Edição de Ativo (permite alterar data de última intervenção) */}
      <EditAssetModal
        asset={asset}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />

      {/* Printable Technical Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-[100] bg-[#060e20]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl w-full max-w-lg p-5 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb95f] text-[24px]">
                  picture_as_pdf
                </span>
                <span className="font-headline-sm text-headline-sm text-[#dae2fd]">
                  Dossiê Técnico • {asset.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#c3c6d7] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Simulated PDF Paper */}
            <div className="bg-white text-black p-4 rounded-lg my-4 font-mono text-xs shadow-inner space-y-2">
              <div className="border-b border-black pb-2 flex justify-between">
                <div>
                  <div className="font-bold text-sm">INDUSMAINT - RELATÓRIO DO ATIVO</div>
                  <div className="text-[10px] text-gray-600">FICHA TÉCNICA DE MANUTENÇÃO</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{asset.tag}</div>
                  <div className="text-[10px]">{new Date().toLocaleDateString('pt-PT')}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <strong>Equipamento:</strong> {asset.name}
                </div>
                <div>
                  <strong>Setor:</strong> {asset.sector}
                </div>
                <div>
                  <strong>Criticidade:</strong> Classe {asset.criticality}
                </div>
                <div>
                  <strong>Vida Útil:</strong> {vidaUtilPct}% ({remainingDays} dias restantes)
                </div>
                <div>
                  <strong>Última Intervenção:</strong> {asset.lastInterventionDate || 'Não registada'}
                </div>
                <div>
                  <strong>Próxima Intervenção:</strong> {asset.nextIntervention.dueDate}
                </div>
                <div>
                  <strong>Fabricante:</strong> {asset.manufacturer || 'N/A'}
                </div>
                <div>
                  <strong>Série:</strong> {asset.serialNumber || 'N/A'}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <div className="font-bold mb-1">Rotinas de Manutenção Registadas:</div>
                {asset.routines.map(r => (
                  <div key={r.id} className="text-[10px] py-0.5">
                    • [{r.code}] {r.title} - Período: {r.periodicityLabel}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-300">
                <div className="font-bold mb-1">Histórico de Intervenções Recentes:</div>
                {asset.history?.slice(0, 3).map(h => (
                  <div key={h.id} className="text-[10px] py-0.5">
                    • {h.date} - {h.title} (Resp: {h.technicianName} - {h.technicianReg})
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-black flex justify-between items-center text-[10px]">
                <span>Status de Conformidade: Homologado</span>
                <span className="font-bold">Rubrica Eletrônica: #SHA-256-{asset.tag}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  generateAssetDossierPdf(asset);
                  showToast(`Dossiê PDF de ${asset.tag} gerado e transferido com sucesso!`);
                  setShowDossierModal(false);
                }}
                className="h-11 rounded-xl bg-[#2563eb] text-[#eeefff] font-semibold flex items-center justify-center gap-1.5 shadow hover:bg-[#1d4ed8] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Descarregar PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className="h-11 rounded-xl bg-[#222a3d] text-[#dae2fd] font-semibold hover:bg-[#2d3449] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
