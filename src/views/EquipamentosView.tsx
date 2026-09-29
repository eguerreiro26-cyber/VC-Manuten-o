import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Asset } from '../types';
import { EditAssetModal } from '../components/EditAssetModal';

export const EquipamentosView: React.FC = () => {
  const { assets, setActiveTab, viewAssetDetail, openQrModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'crit-a' | 'pending' | 'oper'>('all');
  const [selectedPlantArea, setSelectedPlantArea] = useState<string>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Statistics calculation
  const totalCount = assets.length;
  const critACount = assets.filter(a => a.criticality === 'A').length;
  const pendingCount = assets.filter(a => a.status === 'Pendente' || a.nextIntervention.daysRemaining <= 0).length;
  const operCount = assets.filter(a => a.status === 'Operacional').length;
  const monthInterventionsCount = 5 + assets.reduce((acc, a) => acc + (a.history?.length || 0), 0);

  // Filter logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        asset.tag.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.sector.toLowerCase().includes(q) ||
        (asset.plantArea && asset.plantArea.toLowerCase().includes(q));

      let matchesPill = true;
      if (filterType === 'crit-a') {
        matchesPill = asset.criticality === 'A';
      } else if (filterType === 'pending') {
        matchesPill = asset.status === 'Pendente' || asset.nextIntervention.daysRemaining <= 0;
      } else if (filterType === 'oper') {
        matchesPill = asset.status === 'Operacional';
      }

      let matchesArea = true;
      if (selectedPlantArea !== 'all') {
        matchesArea = asset.plantArea === selectedPlantArea;
      }

      return matchesSearch && matchesPill && matchesArea;
    });
  }, [assets, searchQuery, filterType, selectedPlantArea]);

  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl mx-auto pb-28 pt-1">
      {/* Micro Feedback Banner / Offline Ready status */}
      <div className="flex items-center justify-between px-4 py-1.5 rounded-xl bg-[#222a3d] text-[#c3c6d7] border border-[#2d3449]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#4edea3]">check_circle</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wide">
            Base de Ativos Local Sincronizada
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-[#8d90a0]">v4.8-PROD</span>
      </div>

      {/* Industrial Stat Summary Cards */}
      <section className="grid grid-cols-3 gap-2">
        <div className="flex flex-col p-2.5 rounded-xl bg-[#131b2e] border border-[#222a3d] shadow-sm justify-between min-h-[76px]">
          <span className="font-label-sm text-label-sm text-[#8d90a0] uppercase tracking-wider">
            Total
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-md text-headline-md text-[#dae2fd] font-bold">
              {totalCount}
            </span>
            <span className="font-label-sm text-label-sm text-[#c3c6d7]">eq.</span>
          </div>
          <div className="w-full bg-[#171f33] h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#b4c5ff] h-full w-full"></div>
          </div>
        </div>

        <div className="flex flex-col p-2.5 rounded-xl bg-[#131b2e] border border-[#222a3d] shadow-sm justify-between min-h-[76px]">
          <span className="font-label-sm text-label-sm text-[#ffb4ab] uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
            Crítica A
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-md text-headline-md text-[#ffb4ab] font-bold">
              {critACount}
            </span>
            <span className="font-label-sm text-label-sm text-[#c3c6d7]">ativos</span>
          </div>
          <div className="w-full bg-[#171f33] h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#ffb4ab] h-full"
              style={{ width: `${Math.round((critACount / (totalCount || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col p-2.5 rounded-xl bg-[#131b2e] border border-[#222a3d] shadow-sm justify-between min-h-[76px]">
          <span className="font-label-sm text-label-sm text-[#ffb95f] uppercase tracking-wider">
            No Mês
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-md text-headline-md text-[#ffb95f] font-bold">
              {monthInterventionsCount.toString().padStart(2, '0')}
            </span>
            <span className="font-label-sm text-label-sm text-[#c3c6d7]">interv.</span>
          </div>
          <div className="w-full bg-[#171f33] h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#ffb95f] h-full w-[40%]"></div>
          </div>
        </div>
      </section>

      {/* Search & Rugged Filter Bar */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center min-h-[48px] bg-[#060e20] border border-[#222a3d] rounded-xl shadow-sm px-3 focus-within:border-[#2563eb]">
            <span className="material-symbols-outlined text-[20px] text-[#8d90a0] mr-2">search</span>
            <input
              type="text"
              id="asset-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar Tag, Nome, Linha..."
              className="w-full bg-transparent text-[#dae2fd] placeholder:text-[#8d90a0] font-body-md text-body-md focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-8 h-8 flex items-center justify-center text-[#8d90a0] active:text-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilterDrawer(prev => !prev)}
            aria-label="Abrir filtros"
            className={`h-12 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#2d3449] active:bg-[#2d3449] transition-colors shrink-0 ${
              showFilterDrawer || selectedPlantArea !== 'all'
                ? 'bg-[#2563eb] text-[#eeefff]'
                : 'bg-[#222a3d] text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="font-label-md text-label-md">Filtros</span>
          </button>
        </div>

        {/* Collapsible Area Filter Options */}
        {showFilterDrawer && (
          <div className="p-3 bg-[#171f33] rounded-xl border border-[#2d3449] flex flex-wrap gap-1.5 animate-in slide-in-from-top-2 duration-150">
            <span className="w-full font-label-sm text-label-sm text-[#8d90a0] uppercase mb-1">
              Filtrar por Área / Setor Fabril:
            </span>
            {['all', 'Linha 1', 'Linha 2', 'Utilidades', 'Estampagem', 'Usinagem'].map(area => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedPlantArea(area)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                  selectedPlantArea === area
                    ? 'bg-[#2563eb] text-[#eeefff] font-semibold'
                    : 'bg-[#222a3d] text-[#c3c6d7] hover:text-white'
                }`}
              >
                {area === 'all' ? 'Todas as Áreas' : area}
              </button>
            ))}
          </div>
        )}

        {/* Quick Pill Horizon Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-[#c3c6d7]">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`filter-pill h-9 px-3.5 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 ${
              filterType === 'all'
                ? 'bg-[#b4c5ff] text-[#002a78] shadow-sm'
                : 'bg-[#222a3d] text-[#dae2fd]'
            }`}
          >
            <span>Todos ({totalCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('crit-a')}
            className={`filter-pill h-9 px-3.5 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 ${
              filterType === 'crit-a'
                ? 'bg-[#ffb4ab] text-[#690005] font-semibold shadow-sm'
                : 'bg-[#222a3d] text-[#dae2fd]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
            <span>Crítica A ({critACount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('pending')}
            className={`filter-pill h-9 px-3.5 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 ${
              filterType === 'pending'
                ? 'bg-[#ffb95f] text-[#472a00] font-semibold shadow-sm'
                : 'bg-[#222a3d] text-[#dae2fd]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
            <span>Pendente ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('oper')}
            className={`filter-pill h-9 px-3.5 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 ${
              filterType === 'oper'
                ? 'bg-[#4edea3] text-[#003824] font-semibold shadow-sm'
                : 'bg-[#222a3d] text-[#dae2fd]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span>Operacional ({operCount})</span>
          </button>
        </div>
      </section>

      {/* Sticky / High Visibility Create Primary Button */}
      <button
        onClick={() => {
          setActiveTab('novo-registo');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        type="button"
        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] text-[#eeefff] font-headline-sm text-headline-sm tracking-tight active:brightness-90 hover:bg-[#1d4ed8] transition-all shadow-lg shadow-[#2563eb]/25"
      >
        <span className="material-symbols-outlined text-[22px]">add_circle</span>
        <span>+ Registar Novo Ativo - Vazamento Contínuo</span>
      </button>

      {/* Machinery Asset List */}
      <section className="flex flex-col gap-4 mt-1" id="asset-list">
        {filteredAssets.map((asset: Asset) => {
          const isCritA = asset.criticality === 'A';
          const isCritB = asset.criticality === 'B';
          const isPending = asset.status === 'Pendente' || asset.nextIntervention?.daysRemaining <= 0;

          const totalDays = asset.nextIntervention.frequencyDays || 30;
          const remainingDays = asset.nextIntervention.daysRemaining;
          const vidaUtilPct = Math.max(0, Math.min(100, Math.round((remainingDays / totalDays) * 100)));

          return (
            <article
              key={asset.id}
              className="flex flex-col rounded-xl bg-[#131b2e] border border-[#222a3d] shadow-md overflow-hidden relative transition-all hover:border-[#2d3449]"
            >
              {/* Criticality Top Ribbon */}
              <div
                className={`h-1.5 w-full ${
                  isCritA ? 'bg-[#ffb4ab]' : isCritB ? 'bg-[#ffb95f]' : 'bg-[#8d90a0]'
                }`}
              />

              <div className="p-4 flex flex-col gap-3">
                {/* Header: Tag + Badge + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#2d3449] font-label-md text-label-md text-[#b4c5ff] font-bold tracking-wider">
                        {asset.tag}
                      </span>

                      {isCritA && (
                        <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-label-sm text-label-sm uppercase font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">warning</span>
                          Crítica A
                        </span>
                      )}
                      {isCritB && (
                        <span className="px-2 py-0.5 rounded bg-[#ee9800]/30 text-[#ffddb8] font-label-sm text-label-sm uppercase font-semibold">
                          Média B
                        </span>
                      )}
                      {!isCritA && !isCritB && (
                        <span className="px-2 py-0.5 rounded bg-[#2d3449] text-[#c3c6d7] font-label-sm text-label-sm uppercase font-semibold">
                          Baixa C
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => viewAssetDetail(asset.id)}
                      className="font-headline-sm text-headline-sm text-[#dae2fd] mt-1 cursor-pointer hover:text-[#b4c5ff] transition-colors"
                    >
                      {asset.name}
                    </h2>

                    <div className="flex items-center gap-1 text-[#c3c6d7] font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[15px] text-[#8d90a0]">
                        factory
                      </span>
                      <span className="truncate">{asset.sector}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {isPending ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ee9800]/20 text-[#ffb95f] shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#ffb95f] animate-pulse"></span>
                      <span className="font-label-sm text-label-sm font-semibold">Pendente</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#007d55]/30 text-[#4edea3] shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                      <span className="font-label-sm text-label-sm font-semibold">Operacional</span>
                    </div>
                  )}
                </div>

                {/* Visual Machinery Snapshot & Vida Útil Restante */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#060e20] border border-[#171f33]">
                  <img
                    alt={asset.name}
                    src={asset.imageUrl}
                    className="w-16 h-16 rounded object-cover shrink-0 bg-[#171f33] border border-[#222a3d]"
                  />

                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[#c3c6d7] font-label-sm text-label-sm">
                      <span className="uppercase tracking-wider">Vida Útil Restante</span>
                      <span
                        className={`font-label-md text-label-md font-bold ${
                          vidaUtilPct > 50
                            ? 'text-[#4edea3]'
                            : vidaUtilPct > 15
                            ? 'text-[#ffb95f]'
                            : 'text-[#ffb4ab]'
                        }`}
                      >
                        {vidaUtilPct}%
                      </span>
                    </div>

                    <div className="w-full bg-[#171f33] h-2 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          vidaUtilPct > 50
                            ? 'bg-[#4edea3]'
                            : vidaUtilPct > 15
                            ? 'bg-[#ffb95f]'
                            : 'bg-[#ffb4ab]'
                        }`}
                        style={{ width: `${vidaUtilPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[#8d90a0] font-label-sm text-label-sm mt-1.5">
                      <span>Dias Restantes:</span>
                      <span
                        className={`font-mono font-semibold ${
                          remainingDays < 0
                            ? 'text-[#ffb4ab]'
                            : remainingDays <= 5
                            ? 'text-[#ffb95f]'
                            : 'text-[#dae2fd]'
                        }`}
                      >
                        {remainingDays < 0
                          ? `${Math.abs(remainingDays)}d vencido`
                          : `${remainingDays} de ${totalDays} dias`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descritivo da Tarefa */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-[#171f33] border border-[#222a3d]">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-[#8d90a0] uppercase tracking-wider font-semibold">
                      Descritivo da Tarefa
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#222a3d] text-[#b4c5ff] font-label-sm text-label-sm font-medium">
                      {asset.nextIntervention.frequencyLabel}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#dae2fd] font-semibold">
                    {asset.nextIntervention.title}
                  </p>
                  <p className="text-xs text-[#c3c6d7] leading-relaxed line-clamp-2">
                    {asset.routines.find(r => r.title === asset.nextIntervention.title)?.description || asset.routines[0]?.description || 'Inspeção técnica e manutenção preventiva operacional.'}
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#222a3d] text-[#c3c6d7]">
                    <span className="flex items-center gap-1 text-[#8d90a0]">
                      <span className="material-symbols-outlined text-[13px] text-[#ffb95f]">history</span>
                      Última: <strong className="text-[#dae2fd] font-mono">{asset.lastInterventionDate || 'Não registada'}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#4edea3]">
                      <span className="material-symbols-outlined text-[13px]">event</span>
                      Prevista: <strong className="font-mono">{asset.nextIntervention.dueDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Glove-friendly Touch Targets */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setEditingAsset(asset)}
                    className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#222a3d] text-[#dae2fd] active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors border border-[#2d3449]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">edit</span>
                    <span className="font-label-sm text-label-sm">Editar</span>
                  </button>

                  <button
                    onClick={() => {
                      viewAssetDetail(asset.id);
                    }}
                    className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#222a3d] text-[#dae2fd] active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors border border-[#2d3449]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#8d90a0]">edit_calendar</span>
                    <span className="font-label-sm text-label-sm">Plano</span>
                  </button>

                  <button
                    onClick={() => openQrModal(asset)}
                    className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#222a3d] text-[#dae2fd] active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors border border-[#2d3449]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#4edea3]">qr_code_2</span>
                    <span className="font-label-sm text-label-sm">QR Code</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-[#131b2e] border border-[#222a3d] rounded-xl my-4">
          <div className="w-16 h-16 rounded-full bg-[#222a3d] flex items-center justify-center text-[#8d90a0] mb-3">
            <span className="material-symbols-outlined text-[32px]">inventory_2</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-[#dae2fd]">Nenhum Ativo Encontrado</h3>
          <p className="font-body-sm text-body-sm text-[#c3c6d7] max-w-xs mt-1">
            Tente ajustar os termos de pesquisa ou remover os filtros aplicados para visualizar outros equipamentos.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setSelectedPlantArea('all');
            }}
            className="mt-4 h-11 px-4 rounded-xl bg-[#2d3449] text-[#b4c5ff] font-label-md text-label-md font-semibold hover:bg-[#31394d] active:scale-95 transition-all"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      )}

      {/* Modal de Edição Completa do Ativo com opção de Excluir */}
      <EditAssetModal
        asset={editingAsset}
        isOpen={Boolean(editingAsset)}
        onClose={() => setEditingAsset(null)}
      />
    </div>
  );
};
