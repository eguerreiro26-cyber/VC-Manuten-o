import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ExecuteMaintenanceModal: React.FC = () => {
  const { executeModalAsset, closeExecuteModal, completeMaintenance } = useApp();

  const [routineTitle, setRoutineTitle] = useState('');
  const [techName, setTechName] = useState('Carlos Fernandes');
  const [techReg, setTechReg] = useState('TR-4891');
  const [executionDate, setExecutionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [signatureChecked, setSignatureChecked] = useState(true);

  // Initialize defaults when modal opens
  React.useEffect(() => {
    if (executeModalAsset) {
      const defaultTitle = executeModalAsset.routines[0]?.title || executeModalAsset.nextIntervention.title || 'Manutenção Preventiva Periódica';
      setRoutineTitle(defaultTitle);
      setExecutionDate(new Date().toISOString().split('T')[0]);
      setNotes(`Procedimento de alinhamento e inspeção executado no Vazamento Contínuo. Parâmetros verificados e aprovados para operação.`);
    }
  }, [executeModalAsset]);

  if (!executeModalAsset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeMaintenance(
      executeModalAsset.id,
      routineTitle,
      techName || 'Técnico de Turno',
      techReg || 'Rubrica Manual',
      notes,
      executionDate
    );
    closeExecuteModal();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="flex flex-col w-full max-w-md bg-[#171f33] border border-[#2d3449] rounded-2xl p-5 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-[#2d3449]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">engineering</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md px-1.5 py-0.5 rounded bg-[#222a3d] text-[#b4c5ff] font-bold">
                  {executeModalAsset.tag}
                </span>
                <span className="font-label-sm text-label-sm text-[#4edea3] uppercase font-semibold">
                  Execução O.T.
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-[#dae2fd] truncate max-w-[220px]">
                {executeModalAsset.name}
              </h2>
            </div>
          </div>
          <button
            onClick={closeExecuteModal}
            className="w-9 h-9 flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] active:bg-[#222a3d] rounded-lg transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-3">
          {/* Tarefa / Rotina */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
              Tipo de Tarefa Executada
            </label>
            <input
              type="text"
              value={routineTitle}
              onChange={e => setRoutineTitle(e.target.value)}
              className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg font-body-sm text-body-sm border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
              required
            />
          </div>

          {/* Data de Execução e Responsável */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">calendar_today</span>
                Data de Execução
              </label>
              <input
                type="date"
                value={executionDate}
                onChange={e => setExecutionDate(e.target.value)}
                required
                className="min-h-[44px] px-3 bg-[#060e20] text-[#4edea3] font-mono font-bold text-sm rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#b4c5ff]">badge</span>
                Matrícula / Cód.
              </label>
              <input
                type="text"
                value={techReg}
                onChange={e => setTechReg(e.target.value)}
                placeholder="Ex: TR-4891"
                className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg font-body-sm text-body-sm border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          {/* Nome do Técnico por Extenso */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#b4c5ff]">person</span>
              Técnico Responsável (Nome por extenso)
            </label>
            <input
              type="text"
              value={techName}
              onChange={e => setTechName(e.target.value)}
              placeholder="Escreva o nome completo do técnico"
              required
              className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg font-body-sm text-body-sm border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* Notas Técnicas */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
              Observações & Ações Realizadas
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Descreva as verificações, alinhamento e peças inspecionadas..."
              className="p-2.5 bg-[#060e20] text-[#dae2fd] rounded-lg font-body-sm text-body-sm border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* Rubrica Digital / Conformidade */}
          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#131b2e] border border-[#222a3d] cursor-pointer">
            <input
              type="checkbox"
              checked={signatureChecked}
              onChange={e => setSignatureChecked(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded accent-[#4edea3] cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-[#dae2fd] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#4edea3]">verified</span>
                Rubricar Digitalmente ({techName || 'Técnico Responsável'})
              </span>
              <span className="text-[11px] text-[#8d90a0]">
                Declaro que a intervenção no Vazamento Contínuo cumpre os requisitos de conformidade e segurança SMS Concast.
              </span>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={closeExecuteModal}
              className="h-11 rounded-xl bg-[#222a3d] text-[#c3c6d7] font-label-md text-label-md font-semibold active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!signatureChecked}
              className="h-11 rounded-xl bg-[#2563eb] text-[#eeefff] font-label-md text-label-md font-bold active:scale-[0.98] hover:bg-[#1d4ed8] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#2563eb]/25"
            >
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>Guardar & Concluir O.T.</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
