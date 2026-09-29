import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Asset } from '../types';

export const PlanosView: React.FC = () => {
  const { assets, openExecuteModal, viewAssetDetail } = useApp();

  const [filterCrit, setFilterCrit] = useState<string>('all');
  const [activeWindow, setActiveWindow] = useState<'semana' | 'mes' | 'todos'>('todos');

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    if (filterCrit !== 'all' && asset.criticality !== filterCrit) return false;
    if (activeWindow === 'semana' && asset.nextIntervention.daysRemaining > 7) return false;
    if (activeWindow === 'mes' && asset.nextIntervention.daysRemaining > 30) return false;
    return true;
  });

  // Calculate statistics
  const overdueTasks = assets.filter(a => a.nextIntervention.daysRemaining < 0);
  const urgentTasks = assets.filter(a => a.nextIntervention.daysRemaining >= 0 && a.nextIntervention.daysRemaining <= 5);
  const scheduledTasks = assets.filter(a => a.nextIntervention.daysRemaining > 5);

  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl mx-auto pb-32 pt-1 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">event_repeat</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-[#dae2fd]">
                Planos de Manutenção Preventiva
              </h2>
              <p className="font-label-sm text-label-sm text-[#c3c6d7]">
                Agenda Cíclica & Monitorização de Paragens
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#222a3d] text-[#b4c5ff] font-mono font-bold text-xs border border-[#2d3449]">
            {filteredAssets.length} Planos
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2.5 rounded-lg bg-[#060e20] border border-[#222a3d]">
            <span className="font-headline-sm text-headline-sm text-[#ffb4ab] font-bold">
              {overdueTasks.length}
            </span>
            <span className="block font-label-sm text-label-sm text-[#ffb4ab] uppercase mt-0.5">
              Vencidas
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060e20] border border-[#222a3d]">
            <span className="font-headline-sm text-headline-sm text-[#ffb95f] font-bold">
              {urgentTasks.length}
            </span>
            <span className="block font-label-sm text-label-sm text-[#ffb95f] uppercase mt-0.5">
              Próximos 5 Dias
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060e20] border border-[#222a3d]">
            <span className="font-headline-sm text-headline-sm text-[#4edea3] font-bold">
              {scheduledTasks.length}
            </span>
            <span className="block font-label-sm text-label-sm text-[#4edea3] uppercase mt-0.5">
              Em Dia
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips - Janela Temporal */}
      <div className="flex items-center justify-between bg-[#131b2e] border border-[#222a3d] p-3 rounded-xl">
        <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase font-semibold">
          Janela Temporal
        </span>
        <div className="flex gap-1.5">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'semana', label: 'Esta Semana' },
            { id: 'mes', label: 'Este Mês' }
          ].map(w => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWindow(w.id as any)}
              className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                activeWindow === w.id
                  ? 'bg-[#2563eb] text-[#eeefff] font-semibold shadow-sm'
                  : 'bg-[#222a3d] text-[#c3c6d7] hover:text-white'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance Plan Cards List */}
      <div className="flex flex-col gap-3">
        {filteredAssets.map(asset => {
          const isOverdue = asset.nextIntervention.daysRemaining < 0;
          const isUrgent = asset.nextIntervention.daysRemaining >= 0 && asset.nextIntervention.daysRemaining <= 5;
          const freqDays = asset.nextIntervention.frequencyDays || 30;
          const remDays = asset.nextIntervention.daysRemaining;
          const vidaUtilPct = Math.max(0, Math.min(100, Math.round((Math.max(0, remDays) / freqDays) * 100)));

          return (
            <div
              key={asset.id}
              className="flex flex-col bg-[#171f33] border border-[#222a3d] rounded-xl p-4 shadow-sm gap-3 hover:border-[#2d3449] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <img
                    alt={asset.name}
                    src={asset.imageUrl}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#060e20] border border-[#2d3449]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-label-md text-label-md font-bold px-1.5 py-0.5 rounded bg-[#222a3d] text-[#b4c5ff] font-mono">
                        {asset.tag}
                      </span>
                      <span
                        className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded font-bold ${
                          asset.criticality === 'A'
                            ? 'bg-[#93000a] text-[#ffdad6]'
                            : asset.criticality === 'B'
                            ? 'bg-[#2d3449] text-[#ffddb8]'
                            : 'bg-[#2d3449] text-[#4edea3]'
                        }`}
                      >
                        Crit. {asset.criticality}
                      </span>
                      <span className="text-[11px] text-[#8d90a0]">{asset.plantArea}</span>
                    </div>

                    <h3
                      onClick={() => viewAssetDetail(asset.id)}
                      className="font-headline-sm text-headline-sm text-[#dae2fd] text-base mt-1 cursor-pointer hover:text-[#b4c5ff] transition-colors"
                    >
                      {asset.name}
                    </h3>
                  </div>
                </div>

                <span
                  className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                    isOverdue
                      ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                      : isUrgent
                      ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                      : 'bg-[#4edea3]/20 text-[#4edea3]'
                  }`}
                >
                  {isOverdue
                    ? `Vencido (${asset.nextIntervention.daysRemaining}d)`
                    : isUrgent
                    ? `Expira em ${asset.nextIntervention.daysRemaining}d`
                    : 'No Prazo'}
                </span>
              </div>

              {/* Vida Útil Progress Bar */}
              <div className="bg-[#060e20] border border-[#222a3d] p-2.5 rounded-lg flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-label-sm text-[#8d90a0] uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#4edea3]">battery_charging_full</span>
                    Vida Útil Restante
                  </span>
                  <span className={`font-mono font-bold ${vidaUtilPct > 50 ? 'text-[#4edea3]' : vidaUtilPct > 15 ? 'text-[#ffb95f]' : 'text-[#ffb4ab]'}`}>
                    {vidaUtilPct}% {isOverdue ? '(Vencida)' : `(${remDays} dias)`}
                  </span>
                </div>
                <div className="w-full bg-[#171f33] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${vidaUtilPct > 50 ? 'bg-[#4edea3]' : vidaUtilPct > 15 ? 'bg-[#ffb95f]' : 'bg-[#ffb4ab]'}`}
                    style={{ width: `${vidaUtilPct}%` }}
                  />
                </div>
              </div>

              {/* Descritivo da Tarefa Box */}
              <div className="bg-[#060e20] border border-[#222a3d] p-3 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-label-sm text-[#8d90a0] uppercase font-semibold">Descritivo da Tarefa</span>
                  <span className="font-label-sm text-[#b4c5ff]">
                    {asset.nextIntervention.frequencyLabel}
                  </span>
                </div>
                <div className="font-body-md text-body-md text-[#dae2fd] font-semibold">
                  {asset.nextIntervention.title}
                </div>
                <p className="text-xs text-[#c3c6d7] leading-relaxed bg-[#131b2e] p-2 rounded-md border border-[#1d263b]">
                  {asset.routines.find(r => r.title === asset.nextIntervention.title)?.description || asset.routines[0]?.description || 'Inspeção técnica e manutenção preventiva operacional.'}
                </p>

                <div className="flex flex-col gap-1 pt-1 border-t border-[#171f33] text-xs text-[#c3c6d7]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#8d90a0]">
                      <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">history</span>
                      Última: <strong className="text-[#dae2fd] font-mono">{asset.lastInterventionDate || 'Não registada'}</strong>
                    </span>
                    <span className="font-mono font-bold text-[#4edea3]">
                      Próxima: {asset.nextIntervention.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#8d90a0]">
                    <span className="material-symbols-outlined text-[13px] text-[#4edea3]">person</span>
                    <span>Resp: {asset.nextIntervention.assignedTech || 'Equipa de Turno'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => viewAssetDetail(asset.id)}
                  className="h-10 rounded-lg bg-[#222a3d] text-[#dae2fd] font-label-sm text-label-sm font-semibold active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors border border-[#2d3449] flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Ver Ficha Técnica</span>
                </button>
                <button
                  type="button"
                  onClick={() => openExecuteModal(asset)}
                  className="h-10 rounded-lg bg-[#2563eb] text-[#eeefff] font-label-sm text-label-sm font-bold active:scale-[0.98] hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#2563eb]/20"
                >
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Executar & Rubricar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
