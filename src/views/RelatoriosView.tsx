import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Asset } from '../types';
import {
  buildTechnicalReportPdf,
  generateTechnicalReportPdf,
  generateAssetDossierPdf,
  downloadPdf
} from '../utils/pdfGenerator';

export const RelatoriosView: React.FC = () => {
  const { assets, showToast } = useApp();

  // Filters state (sector and type removed as requested)
  const [selectedCrit, setSelectedCrit] = useState<string>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Este Mês');
  const [viewMode, setViewMode] = useState<'tabela' | 'cartoes'>('tabela');
  const [showExportToast, setShowExportToast] = useState(false);
  const [exportToastMessage, setExportToastMessage] = useState('Ficheiro CSV gerado e pronto a abrir no Excel!');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharingPdf, setIsSharingPdf] = useState(false);
  const [dossierAsset, setDossierAsset] = useState<Asset | null>(null);
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  const toggleRowExpand = (id: string) => {
    setExpandedRowIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter application
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Criticality filter
      if (selectedCrit !== 'Todas') {
        const targetCrit = selectedCrit.includes('A') ? 'A' : selectedCrit.includes('B') ? 'B' : 'C';
        if (asset.criticality !== targetCrit) return false;
      }

      // Status filter
      if (selectedStatus !== 'Todos') {
        if (selectedStatus === 'Vencidas') {
          if (asset.nextIntervention.daysRemaining > 0 && asset.status !== 'Pendente') return false;
        } else if (selectedStatus === 'Expira em 5d') {
          if (asset.nextIntervention.daysRemaining < 0 || asset.nextIntervention.daysRemaining > 5) return false;
        } else if (selectedStatus === 'No Prazo') {
          if (asset.nextIntervention.daysRemaining <= 5) return false;
        }
      }

      return true;
    });
  }, [assets, selectedCrit, selectedStatus]);

  // Statistics
  const totalFiltered = filteredAssets.length;
  const critAFiltered = filteredAssets.filter(a => a.criticality === 'A').length;
  const scheduledCount = filteredAssets.reduce((acc, a) => acc + (a.routines.length || 1), 0);

  // Clear filters
  const handleResetFilters = () => {
    setSelectedCrit('Todas');
    setSelectedStatus('Todos');
    setSelectedTimeframe('Este Mês');
    showToast('Filtros repostos.');
  };

  // Real CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Tag',
      'Equipamento',
      'Setor',
      'Área',
      'Criticidade',
      'Próxima Intervenção',
      'Periodicidade',
      'Data Limite',
      'Dias Restantes até Intervenção',
      'Vida Útil até Intervenção (%)',
      'Status Operacional'
    ];

    const rows = filteredAssets.map(a => {
      const freqDays = a.nextIntervention.frequencyDays || 30;
      const remDays = a.nextIntervention.daysRemaining;
      const vidaUtilPct = Math.max(0, Math.min(100, Math.round((Math.max(0, remDays) / freqDays) * 100)));

      return [
        `"${a.tag}"`,
        `"${a.name.replace(/"/g, '""')}"`,
        `"${a.sector.replace(/"/g, '""')}"`,
        `"${a.plantArea}"`,
        `"${a.criticality}"`,
        `"${a.nextIntervention.title.replace(/"/g, '""')}"`,
        `"${a.nextIntervention.frequencyLabel}"`,
        `"${a.nextIntervention.dueDate}"`,
        `"${remDays}"`,
        `"${vidaUtilPct}%"`,
        `"${a.status}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_Manutencao_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setExportToastMessage('Ficheiro CSV gerado e pronto a abrir no Excel!');
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 5000);
    showToast('Ficheiro CSV gerado e descarregado com sucesso!');
  };

  const handleExportPdf = () => {
    try {
      setIsGeneratingPdf(true);
      showToast('A compilar e gerar Relatório Técnico em PDF...');

      setTimeout(() => {
        try {
          generateTechnicalReportPdf(filteredAssets, {
            criticality: selectedCrit,
            status: selectedStatus,
            timeframe: selectedTimeframe
          });
          setIsGeneratingPdf(false);
          setExportToastMessage('Relatório Técnico em PDF gerado e transferido com sucesso!');
          setShowExportToast(true);
          setTimeout(() => setShowExportToast(false), 5000);
          showToast('Relatório PDF oficial descarregado!');
        } catch (err) {
          console.error('Erro ao gerar PDF:', err);
          setIsGeneratingPdf(false);
          showToast('Erro ao processar relatório PDF. Tente novamente.');
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setIsGeneratingPdf(false);
      showToast('Erro ao processar PDF.');
    }
  };

  const handleShare = () => {
    try {
      setIsSharingPdf(true);
      showToast('A compilar relatório PDF para partilha...');

      setTimeout(async () => {
        try {
          const { doc, filename, file } = buildTechnicalReportPdf(filteredAssets, {
            criticality: selectedCrit,
            status: selectedStatus,
            timeframe: selectedTimeframe
          });

          const shareData = {
            title: 'Relatório Técnico IndusMaint CMMS',
            text: `Relatório Técnico de Manutenção: ${totalFiltered} ativos monitorizados (${critAFiltered} Crítica A, ${scheduledCount} rotinas). Em anexo relatório PDF oficial.`
          };

          // Try native file sharing (supported on mobile/browsers)
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                ...shareData,
                files: [file]
              });
              setIsSharingPdf(false);
              showToast('Relatório PDF partilhado com sucesso!');
              return;
            } catch (shareErr: any) {
              if (shareErr.name === 'AbortError') {
                setIsSharingPdf(false);
                return;
              }
              console.warn('Partilha direta de ficheiro cancelada ou sem suporte:', shareErr);
            }
          }

          // Fallback: download PDF and share text/clipboard
          downloadPdf(doc, filename);

          if (navigator.share) {
            try {
              await navigator.share(shareData);
            } catch {
              // Ignore abort
            }
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.text);
          }

          setIsSharingPdf(false);
          setExportToastMessage(`Relatório PDF (${filename}) gerado e pronto a partilhar!`);
          setShowExportToast(true);
          setTimeout(() => setShowExportToast(false), 5000);
          showToast('Relatório PDF descarregado para envio nos diversos meios!');
        } catch (err) {
          console.error('Erro ao preparar relatório PDF para partilha:', err);
          setIsSharingPdf(false);
          showToast('Erro ao gerar PDF para partilha.');
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setIsSharingPdf(false);
      showToast('Erro ao processar partilha.');
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl mx-auto pb-32 pt-1">
      {/* Top Hero Visual Card */}
      <div className="relative w-full rounded-xl overflow-hidden bg-[#171f33] border border-[#222a3d] shadow-md">
        <div
          className="h-28 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD30pbf9BOYll2hEoYldlx7VldUrUHaLGDsAE472ao0JoCXnfuj4iVW0Cr3BEJ2-oURL80KPkqVP5o-IDYtMgYT8IeVR__se8GnINSG8KYGoMNOCfCcOqSP50rClcSSQNf9ADKcWGySDkOiHQCknFAqszFXLqXD6uLFEHY6sOIgFBKQbAdRCvlJ-eBDHkwIgQw4hmNxkISi_YxdQ_OXzI1zUeAn3AwMtc2zcjCZ6IRVfZZjRqjLwzU3')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] via-[#171f33]/70 to-transparent flex items-end p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase tracking-widest">
                Motor de Dados & Auditoria
              </span>
              <h1 className="font-headline-sm text-headline-sm text-[#dae2fd] font-semibold tracking-tight">
                Exportação & Relatórios
              </h1>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222a3d] text-[#4edea3] border border-[#2d3449]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-label-sm text-label-sm tracking-tight font-semibold">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Painel de Configuração do Relatório */}
      <section className="flex flex-col gap-2.5 bg-[#131b2e] border border-[#222a3d] p-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">tune</span>
            <span className="font-headline-sm text-headline-sm text-[#dae2fd] text-base">
              Filtros Operacionais
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 font-label-sm text-label-sm text-[#c3c6d7] hover:text-[#b4c5ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Limpar</span>
          </button>
        </div>

        {/* Nível de Criticidade */}
        <div className="flex flex-col gap-1.5">
          <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">Criticidade</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'Todas', label: 'Todas', color: 'bg-[#2563eb] text-[#eeefff]' },
              { id: 'Crit. A', label: 'Crit. A', dot: 'bg-[#ffb4ab]', text: 'text-[#ffb4ab]' },
              { id: 'Média B', label: 'Média B', dot: 'bg-[#ffb95f]', text: 'text-[#ffb95f]' },
              { id: 'Baixa C', label: 'Baixa C', dot: 'bg-[#4edea3]', text: 'text-[#4edea3]' }
            ].map(c => {
              const active = selectedCrit === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCrit(c.id)}
                  className={`min-h-[42px] flex items-center justify-center gap-1 rounded-lg font-label-sm text-label-sm transition-all ${
                    active
                      ? 'bg-[#2563eb] text-[#eeefff] font-bold shadow-sm'
                      : `bg-[#222a3d] ${c.text || 'text-[#c3c6d7]'} hover:bg-[#2d3449]`
                  }`}
                >
                  {c.dot && <span className={`w-2 h-2 rounded-full ${c.dot}`} />}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estado do Agendamento */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
            Estado do Agendamento
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-0.5">
            {[
              { id: 'Todos', label: 'Todos' },
              { id: 'No Prazo', label: 'No Prazo', text: 'text-[#4edea3]' },
              { id: 'Expira em 5d', label: 'Expira em 5d', text: 'text-[#ffb95f]' },
              { id: 'Vencidas', label: 'Vencidas', text: 'text-[#ffb4ab]' }
            ].map(st => {
              const active = selectedStatus === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-3 py-2 rounded-lg font-label-sm text-label-sm min-h-[42px] flex items-center justify-center transition-all ${
                    active
                      ? 'bg-[#2563eb] text-[#eeefff] font-semibold'
                      : `bg-[#222a3d] ${st.text || 'text-[#c3c6d7]'}`
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Janela Temporal */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">Janela Temporal</span>
          <div className="grid grid-cols-3 gap-1.5">
            {['Este Mês', '30 Dias', 'Histórico'].map(tf => {
              const active = selectedTimeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`min-h-[42px] flex items-center justify-center rounded-lg font-label-sm text-label-sm transition-all ${
                    active
                      ? 'bg-[#2d3449] text-[#b4c5ff] font-semibold border border-[#b4c5ff]/40'
                      : 'bg-[#222a3d] text-[#c3c6d7]'
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Barra de Ações de Exportação em Destaque */}
      <section className="flex flex-col gap-2.5 bg-[#171f33] border border-[#222a3d] p-4 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">dataset</span>
            <span className="font-label-md text-label-md text-[#dae2fd] font-semibold">
              Ações de Exportação
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#222a3d] border border-[#2d3449]">
            <span className="font-label-sm text-label-sm text-[#b4c5ff] font-semibold tracking-wide">
              {totalFiltered}
            </span>
            <span className="font-label-sm text-label-sm text-[#c3c6d7]">ativos</span>
          </div>
        </div>

        {/* Download/Export Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* CSV / Excel */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#2563eb] text-[#eeefff] min-h-[48px] active:scale-95 transition-all shadow-md shadow-[#2563eb]/20 hover:bg-[#1d4ed8]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">table_view</span>
              <span className="font-label-md text-label-md font-semibold">Exportar CSV/XLS</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>

          {/* PDF Técnico */}
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleExportPdf}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#222a3d] text-[#dae2fd] min-h-[48px] active:scale-95 hover:bg-[#2d3449] hover:border-[#ffb95f]/50 transition-all border border-[#2d3449] disabled:opacity-60"
            title="Descarregar Relatório Técnico Completo em PDF"
          >
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[#ffb95f] text-[20px] ${isGeneratingPdf ? 'animate-spin' : ''}`}>
                {isGeneratingPdf ? 'progress_activity' : 'picture_as_pdf'}
              </span>
              <span className="font-label-md text-label-md font-semibold">
                {isGeneratingPdf ? 'A Gerar PDF...' : 'Descarregar PDF'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px]">
              {isGeneratingPdf ? 'hourglass_top' : 'download'}
            </span>
          </button>

          {/* Partilhar / Enviar PDF */}
          <button
            type="button"
            disabled={isSharingPdf}
            onClick={handleShare}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#222a3d] text-[#dae2fd] min-h-[48px] active:scale-95 hover:bg-[#2d3449] hover:border-[#4edea3]/50 transition-all border border-[#2d3449] disabled:opacity-60"
            title="Gerar e partilhar Relatório PDF através de WhatsApp, Email ou outras aplicações"
          >
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[#4edea3] text-[20px] ${isSharingPdf ? 'animate-spin' : ''}`}>
                {isSharingPdf ? 'progress_activity' : 'share'}
              </span>
              <span className="font-label-md text-label-md font-semibold">
                {isSharingPdf ? 'A Gerar PDF...' : 'Partilhar Resumo (PDF)'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px]">
              {isSharingPdf ? 'hourglass_top' : 'send'}
            </span>
          </button>
        </div>

        {/* Feedback toast inline */}
        {showExportToast && (
          <div className="flex items-center justify-between p-2.5 bg-[#007d55] text-[#bdffdb] rounded-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="font-label-sm text-label-sm font-semibold">
                {exportToastMessage}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowExportToast(false)}
              className="w-6 h-6 flex items-center justify-center text-[#bdffdb] hover:opacity-80"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}
      </section>

      {/* Modo de Consulta Toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-[#dae2fd]">
          <span className="font-label-md text-label-md font-semibold uppercase tracking-wider">
            Modo de Consulta
          </span>
        </div>
        <div className="flex items-center p-1 bg-[#222a3d] rounded-lg border border-[#2d3449]">
          <button
            type="button"
            onClick={() => setViewMode('tabela')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded font-label-sm text-label-sm min-h-[34px] transition-all ${
              viewMode === 'tabela'
                ? 'bg-[#2563eb] text-[#eeefff] font-semibold'
                : 'text-[#c3c6d7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_column</span>
            <span>Tabela</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cartoes')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded font-label-sm text-label-sm min-h-[34px] transition-all ${
              viewMode === 'cartoes'
                ? 'bg-[#2563eb] text-[#eeefff] font-semibold'
                : 'text-[#c3c6d7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_agenda</span>
            <span>Cartões</span>
          </button>
        </div>
      </div>

      {/* 3. Modo Tabela com colunas fixas e 9 colunas totais */}
      {viewMode === 'tabela' && (
        <section className="flex flex-col gap-2">
          {/* Scroll Hint */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#131b2e] rounded-lg text-[#c3c6d7] border border-[#222a3d]">
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-[#b4c5ff]">swipe</span>
              <span>Role horizontalmente para inspecionar parâmetros</span>
            </div>
            <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase font-mono">
              9 Colunas
            </span>
          </div>

          <div className="relative w-full rounded-xl bg-[#060e20] border border-[#222a3d] overflow-hidden shadow-md">
            <div className="overflow-x-auto w-full scroll-smooth">
              <table className="w-full text-left border-separate border-spacing-0 min-w-[1260px]">
                <thead>
                  <tr className="bg-[#1e273a] font-label-sm text-label-sm text-[#c3c6d7] uppercase tracking-wider h-12 border-b border-[#2d3449]">
                    <th className="sticky left-0 z-30 bg-[#1e273a] px-3 py-2.5 w-[90px] min-w-[90px] max-w-[90px] border-b border-[#2d3449]">
                      Tag
                    </th>
                    <th className="sticky left-[90px] z-30 bg-[#1e273a] px-3 py-2.5 w-[260px] min-w-[260px] max-w-[260px] border-b border-[#2d3449] border-r border-[#2d3449] shadow-[4px_0_12px_rgba(0,0,0,0.55)]">
                      Equipamento
                    </th>
                    <th className="px-2 py-2 w-[75px] min-w-[75px] max-w-[75px] text-center bg-[#293247]/60 border-b border-[#2d3449]">
                      Crit.
                    </th>
                    <th className="px-3 py-2 min-w-[200px] border-b border-[#2d3449]">Intervenção</th>
                    <th className="px-3 py-2 min-w-[95px] border-b border-[#2d3449]">Período</th>
                    <th className="px-3 py-2 min-w-[95px] border-b border-[#2d3449]">Última</th>
                    <th className="px-3 py-2 min-w-[105px] border-b border-[#2d3449]">Próxima</th>
                    <th className="px-3 py-2 min-w-[120px] text-center border-b border-[#2d3449]">Dias Restantes</th>
                    <th className="px-3 py-2 min-w-[130px] text-center border-b border-[#2d3449]">Vida Útil (%)</th>
                    <th className="px-3 py-2 min-w-[100px] text-right pr-4 border-b border-[#2d3449]">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171f33] font-body-sm text-body-sm text-[#dae2fd]">
                  {filteredAssets.map(asset => {
                    const isCritA = asset.criticality === 'A';
                    const isOverdue = asset.nextIntervention.daysRemaining < 0;
                    const isAlert = asset.nextIntervention.daysRemaining <= 5 && !isOverdue;
                    const freqDays = asset.nextIntervention.frequencyDays || 30;
                    const remDays = asset.nextIntervention.daysRemaining;
                    const vidaUtilPct = Math.max(0, Math.min(100, Math.round((Math.max(0, remDays) / freqDays) * 100)));
                    const isExpanded = !!expandedRowIds[asset.id];

                    return (
                      <React.Fragment key={asset.id}>
                        <tr className="group bg-[#060e20] hover:bg-[#131b2e] transition-colors border-b border-[#171f33]">
                          <td className="sticky left-0 z-20 bg-[#060e20] group-hover:bg-[#131b2e] px-3 py-3 w-[90px] min-w-[90px] max-w-[90px] font-label-sm text-label-sm font-bold font-mono border-b border-[#171f33] transition-colors">
                            <span
                              className={
                                isOverdue
                                  ? 'text-[#ffb4ab]'
                                  : isAlert
                                  ? 'text-[#ffb95f]'
                                  : 'text-[#4edea3]'
                              }
                            >
                              {asset.tag}
                            </span>
                          </td>
                          <td className="sticky left-[90px] z-20 bg-[#060e20] group-hover:bg-[#131b2e] px-3 py-3 w-[260px] min-w-[260px] max-w-[260px] border-r border-[#2d3449] border-b border-[#171f33] shadow-[4px_0_12px_rgba(0,0,0,0.55)] transition-colors">
                            <div className="font-headline-sm text-headline-sm text-xs font-semibold text-[#dae2fd] whitespace-normal break-words leading-snug">
                              {asset.name}
                            </div>
                            <div className="font-label-sm text-label-sm text-[#8d90a0] whitespace-normal break-words leading-tight mt-0.5">
                              {asset.sector}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setDossierAsset(asset)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2563eb]/25 hover:bg-[#2563eb]/40 text-[#b4c5ff] font-label-sm text-[11px] font-medium transition-colors"
                                title="Ler descrição completa e especificações do equipamento"
                              >
                                <span className="material-symbols-outlined text-[13px]">description</span>
                                <span>Descrição</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleRowExpand(asset.id)}
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#222a3d] hover:bg-[#2d3449] text-[#c3c6d7] hover:text-[#dae2fd] font-label-sm text-[11px] transition-colors"
                                title={isExpanded ? 'Ocultar detalhes na tabela' : 'Expandir ficha técnica na tabela'}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                                <span>{isExpanded ? 'Menos' : 'Ficha'}</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-2 py-3 w-[75px] min-w-[75px] max-w-[75px] text-center bg-[#131b2e]/50 border-b border-[#171f33]">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded font-label-sm text-label-sm font-bold shadow-sm ${
                                isCritA
                                  ? 'bg-[#93000a] text-[#ffdad6]'
                                  : asset.criticality === 'B'
                                  ? 'bg-[#2d3449] text-[#ffddb8]'
                                  : 'bg-[#2d3449] text-[#4edea3]'
                              }`}
                            >
                              {asset.criticality}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-label-sm text-label-sm text-[#dae2fd] whitespace-normal break-words leading-snug min-w-[200px] border-b border-[#171f33]">
                            {asset.nextIntervention.title}
                          </td>
                          <td className="px-3 py-3 font-label-sm text-label-sm text-[#c3c6d7] border-b border-[#171f33]">
                            {asset.nextIntervention.frequencyLabel.split(' ')[0]}
                          </td>
                          <td className="px-3 py-3 font-label-sm text-label-sm text-[#c3c6d7] border-b border-[#171f33]">
                            {asset.lastInterventionDate || '12/03/24'}
                          </td>
                          <td className="px-3 py-3 border-b border-[#171f33]">
                            <div
                              className={`font-label-sm text-label-sm font-semibold ${
                                isOverdue
                                  ? 'text-[#ffb4ab]'
                                  : isAlert
                                  ? 'text-[#ffb95f]'
                                  : 'text-[#4edea3]'
                              }`}
                            >
                              {asset.nextIntervention.dueDate}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center font-mono border-b border-[#171f33]">
                            <span
                              className={`font-semibold text-xs ${
                                isOverdue
                                  ? 'text-[#ffb4ab]'
                                  : isAlert
                                  ? 'text-[#ffb95f]'
                                  : 'text-[#dae2fd]'
                              }`}
                            >
                              {isOverdue ? `${remDays}d (vencido)` : `${remDays} dias`}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center border-b border-[#171f33]">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                                  vidaUtilPct > 50
                                    ? 'bg-[#4edea3]/20 text-[#4edea3]'
                                    : vidaUtilPct > 15
                                    ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                                    : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                                }`}
                              >
                                {vidaUtilPct}%
                              </span>
                              <div className="w-16 bg-[#171f33] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    vidaUtilPct > 50
                                      ? 'bg-[#4edea3]'
                                      : vidaUtilPct > 15
                                      ? 'bg-[#ffb95f]'
                                      : 'bg-[#ffb4ab]'
                                  }`}
                                  style={{ width: `${vidaUtilPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right pr-4 border-b border-[#171f33]">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${
                                isOverdue
                                  ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                                  : isAlert
                                  ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                                  : 'bg-[#4edea3]/20 text-[#4edea3]'
                              }`}
                            >
                              {isOverdue ? 'Vencido' : isAlert ? 'Alerta' : 'Em Dia'}
                            </span>
                          </td>
                        </tr>

                        {/* Inline Detailed Expansion for complete description reading */}
                        {isExpanded && (
                          <tr className="bg-[#111828] border-b border-[#2d3449]">
                            <td colSpan={10} className="p-4">
                              <div className="flex flex-col gap-3 bg-[#060e20] p-4 rounded-xl border border-[#222a3d]">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e273a] pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-[#2563eb]/20 text-[#b4c5ff] font-mono text-xs font-bold">
                                      {asset.tag}
                                    </span>
                                    <span className="font-semibold text-sm text-[#dae2fd]">
                                      {asset.name}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setDossierAsset(asset)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2563eb] text-[#eeefff] text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                                    <span>Ver Ficha Técnica Completa</span>
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <span className="text-[#8d90a0] block uppercase font-mono text-[10px]">Fabricante & Série</span>
                                    <span className="text-[#dae2fd] font-medium">{asset.manufacturer || 'SMS Concast AG'} ({asset.serialNumber || 'N/A'})</span>
                                  </div>
                                  <div>
                                    <span className="text-[#8d90a0] block uppercase font-mono text-[10px]">Subsistema / Área</span>
                                    <span className="text-[#dae2fd] font-medium">{asset.sector} • {asset.plantArea || 'SN Seixal'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#8d90a0] block uppercase font-mono text-[10px]">Revisão de Engenharia</span>
                                    <span className="text-[#dae2fd] font-medium">{asset.revCode || 'REV: 2024'}</span>
                                  </div>
                                </div>

                                {asset.routines && asset.routines.length > 0 && (
                                  <div className="flex flex-col gap-1.5 pt-1">
                                    <span className="text-[#b4c5ff] font-label-sm text-[11px] uppercase font-semibold">
                                      Rotinas de Manutenção Preventiva em Vigor:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {asset.routines.map(r => (
                                        <div key={r.id} className="p-2.5 rounded-lg bg-[#171f33] border border-[#2d3449] flex flex-col gap-1">
                                          <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-[#dae2fd]">{r.title} ({r.code})</span>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#222a3d] text-[#4edea3] font-mono">{r.periodicityLabel}</span>
                                          </div>
                                          <p className="text-[11px] text-[#c3c6d7] leading-relaxed">{r.description}</p>
                                          <span className="text-[10px] text-[#8d90a0] font-mono">Tolerância: {r.toleranceOrSpec}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 4. Modo Cartões (Leitura Vertical Rápida) */}
      {viewMode === 'cartoes' && (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase tracking-wider">
              Leitura Vertical de Alta Prioridade
            </span>
            <span className="font-label-sm text-label-sm text-[#b4c5ff] font-mono font-semibold">
              {totalFiltered} Registos
            </span>
          </div>

          {filteredAssets.map(asset => {
            const isOverdue = asset.nextIntervention.daysRemaining < 0;
            const isAlert = asset.nextIntervention.daysRemaining <= 5 && !isOverdue;

            return (
              <div
                key={asset.id}
                className="flex flex-col p-4 rounded-xl bg-[#171f33] border border-[#222a3d] gap-2 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                        isOverdue
                          ? 'bg-[#93000a] text-[#ffdad6]'
                          : isAlert
                          ? 'bg-[#2d3449] text-[#ffb95f]'
                          : 'bg-[#2d3449] text-[#4edea3]'
                      }`}
                    >
                      {asset.tag}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-base text-[#dae2fd] font-semibold">
                      {asset.name}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${
                      isOverdue
                        ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                        : isAlert
                        ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                        : 'bg-[#4edea3]/20 text-[#4edea3]'
                    }`}
                  >
                    {isOverdue
                      ? `Vencido (${asset.nextIntervention.daysRemaining}d)`
                      : isAlert
                      ? `Alerta (+${asset.nextIntervention.daysRemaining}d)`
                      : 'Em Dia'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 bg-[#222a3d]/50 p-2.5 rounded-lg border border-[#2d3449]">
                  <div>
                    <span className="font-label-sm text-label-sm text-[#c3c6d7] block uppercase">
                      Ação / Setor
                    </span>
                    <span className="font-body-sm text-body-sm text-[#dae2fd] font-medium truncate block">
                      {asset.nextIntervention.title}
                    </span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-[#c3c6d7] block uppercase">
                      Responsável
                    </span>
                    <span className="font-body-sm text-body-sm text-[#dae2fd] font-medium truncate block">
                      {asset.nextIntervention.assignedTech || 'M. Silveira'}
                    </span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-[#c3c6d7] block uppercase">
                      Periodicidade
                    </span>
                    <span className="font-label-sm text-label-sm text-[#dae2fd]">
                      {asset.nextIntervention.frequencyLabel}
                    </span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-[#c3c6d7] block uppercase">
                      Prazo Limite
                    </span>
                    <span
                      className={`font-label-sm text-label-sm font-bold ${
                        isOverdue
                          ? 'text-[#ffb4ab]'
                          : isAlert
                          ? 'text-[#ffb95f]'
                          : 'text-[#4edea3]'
                      }`}
                    >
                      {asset.nextIntervention.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#222a3d]">
                  <span className="text-xs text-[#8d90a0] font-mono truncate max-w-[200px]">{asset.sector}</span>
                  <button
                    type="button"
                    onClick={() => setDossierAsset(asset)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb]/25 hover:bg-[#2563eb]/40 text-[#b4c5ff] text-xs font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">description</span>
                    <span>Ver Descrição & Ficha</span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 5. Rodapé Informativo / Barra de Totalizadores */}
      <section className="mt-2 p-4 rounded-xl bg-[#222a3d] border border-[#2d3449] text-[#dae2fd] shadow-md">
        <div className="flex items-center justify-between pb-2">
          <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase font-bold tracking-wider">
            Métricas da Seleção
          </span>
          <span className="font-label-sm text-label-sm text-[#c3c6d7] font-mono">
            Status: Consolidado
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#060e20] border border-[#171f33]">
            <span className="font-headline-sm text-headline-sm text-[#dae2fd] font-bold">
              {totalFiltered}
            </span>
            <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase mt-0.5">
              Total Ativos
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#060e20] border border-[#171f33]">
            <span className="font-headline-sm text-headline-sm text-[#ffb4ab] font-bold">
              {critAFiltered.toString().padStart(2, '0')}
            </span>
            <span className="font-label-sm text-label-sm text-[#ffb4ab] uppercase mt-0.5">
              Crítica A
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#060e20] border border-[#171f33]">
            <span className="font-headline-sm text-headline-sm text-[#4edea3] font-bold">
              {scheduledCount.toString().padStart(2, '0')}
            </span>
            <span className="font-label-sm text-label-sm text-[#4edea3] uppercase mt-0.5">
              Agendadas
            </span>
          </div>
        </div>
      </section>

      {/* Modal de Leitura Integral da Descrição e Ficha Técnica do Equipamento */}
      {dossierAsset && (
        <div className="fixed inset-0 z-[100] bg-[#060e20]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl relative my-auto max-h-[92vh] sm:max-h-[86vh] h-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2d3449] shrink-0 bg-[#171f33] z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#222a3d] text-[#b4c5ff]">
                      {dossierAsset.tag}
                    </span>
                    <span className="text-xs text-[#4edea3] font-semibold">{dossierAsset.status}</span>
                    <span className={`text-xs px-1.5 py-0.2 rounded font-bold ${
                      dossierAsset.criticality === 'A'
                        ? 'bg-[#93000a] text-[#ffdad6]'
                        : dossierAsset.criticality === 'B'
                        ? 'bg-[#2d3449] text-[#ffddb8]'
                        : 'bg-[#2d3449] text-[#4edea3]'
                    }`}>
                      Classe {dossierAsset.criticality}
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-sm sm:text-base text-[#dae2fd] font-semibold mt-0.5">
                    {dossierAsset.name}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDossierAsset(null)}
                aria-label="Fechar"
                className="w-9 h-9 flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] active:bg-[#222a3d] rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
              {/* Equipment Image & Subsystem Details */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-[#060e20] border border-[#222a3d]">
                <img
                  src={dossierAsset.imageUrl}
                  alt={dossierAsset.name}
                  className="w-full sm:w-44 h-36 object-cover rounded-lg border border-[#2d3449] shrink-0"
                />
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <span className="text-[#8d90a0] uppercase text-[10px] font-mono tracking-wider">
                      Função no Vazamento Contínuo SMS Concast
                    </span>
                    <h3 className="text-sm font-bold text-[#dae2fd] mt-0.5">
                      {dossierAsset.name}
                    </h3>
                    <p className="text-xs text-[#c3c6d7] leading-relaxed mt-1">
                      Equipamento industrial de operação contínua na linha de lingotamento ({dossierAsset.sector}). Projetado segundo especificações SMS Concast para a unidade siderúrgica SN Seixal, com monitorização preventiva e inspeção periódica rigorosa.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1e273a]">
                    <div>
                      <span className="text-[#8d90a0] block text-[10px]">Fabricante</span>
                      <span className="text-[#dae2fd] font-medium">{dossierAsset.manufacturer || 'SMS Concast AG'}</span>
                    </div>
                    <div>
                      <span className="text-[#8d90a0] block text-[10px]">Nº de Série</span>
                      <span className="text-[#dae2fd] font-mono">{dossierAsset.serialNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Intervention Card */}
              <div className="p-4 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase font-bold tracking-wider">
                    Próxima Intervenção Programada
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#222a3d] text-[#ffb95f] font-semibold">
                    {dossierAsset.nextIntervention.frequencyLabel}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#dae2fd]">
                  {dossierAsset.nextIntervention.title}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222a3d] text-center">
                  <div className="p-2 rounded bg-[#060e20]">
                    <span className="text-[10px] text-[#8d90a0] block uppercase">Data Limite</span>
                    <span className="text-xs font-bold text-[#dae2fd]">{dossierAsset.nextIntervention.dueDate}</span>
                  </div>
                  <div className="p-2 rounded bg-[#060e20]">
                    <span className="text-[10px] text-[#8d90a0] block uppercase">Dias Restantes</span>
                    <span className={`text-xs font-bold font-mono ${dossierAsset.nextIntervention.daysRemaining < 0 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
                      {dossierAsset.nextIntervention.daysRemaining} dias
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#060e20]">
                    <span className="text-[10px] text-[#8d90a0] block uppercase">Responsável</span>
                    <span className="text-xs font-medium text-[#dae2fd] truncate block">
                      {dossierAsset.nextIntervention.assignedTech || 'Equipa de Turno'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance Routines */}
              {dossierAsset.routines && dossierAsset.routines.length > 0 && (
                <div className="space-y-2">
                  <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase font-bold tracking-wider block">
                    Procedimentos & Rotinas de Inspeção ({dossierAsset.routines.length})
                  </span>
                  <div className="space-y-2">
                    {dossierAsset.routines.map(routine => (
                      <div key={routine.id} className="p-3.5 rounded-xl bg-[#060e20] border border-[#222a3d] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#dae2fd]">
                            {routine.code} • {routine.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222a3d] text-[#b4c5ff]">
                            {routine.type} • {routine.periodicityLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[#c3c6d7] leading-relaxed">
                          {routine.description}
                        </p>
                        <div className="text-[11px] text-[#8d90a0] flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-[#171f33]">
                          <span><strong>Tolerância:</strong> {routine.toleranceOrSpec}</span>
                          {routine.standardInstrumentOrPart && (
                            <span><strong>Instrumento/Peça:</strong> {routine.standardInstrumentOrPart}</span>
                          )}
                        </div>
                        {routine.instructions && routine.instructions.length > 0 && (
                          <ul className="list-disc list-inside text-[11px] text-[#a4a7b7] space-y-0.5 pt-1 pl-1">
                            {routine.instructions.map((inst, idx) => (
                              <li key={idx}>{inst}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              {dossierAsset.history && dossierAsset.history.length > 0 && (
                <div className="space-y-2">
                  <span className="font-label-sm text-label-sm text-[#c3c6d7] uppercase font-bold tracking-wider block">
                    Histórico Recente de Intervenções
                  </span>
                  <div className="space-y-2">
                    {dossierAsset.history.map(hist => (
                      <div key={hist.id} className="p-3 rounded-xl bg-[#060e20] border border-[#222a3d] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#dae2fd]">{hist.title}</span>
                          <span className="font-mono text-[#8d90a0]">{hist.date}</span>
                        </div>
                        <p className="text-[#c3c6d7] leading-relaxed">{hist.notes}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-[#171f33] text-[#8d90a0] text-[11px]">
                          <span>Técnico: {hist.technicianName} ({hist.technicianReg || 'Reg.'})</span>
                          {hist.verified && (
                            <span className="text-[#4edea3] flex items-center gap-1 font-semibold">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Auditado
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 sm:p-4 bg-[#131b2e] border-t border-[#2d3449] shrink-0 flex items-center justify-between gap-2 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.6)]">
              <button
                type="button"
                onClick={() => {
                  if (dossierAsset) {
                    generateAssetDossierPdf(dossierAsset);
                    showToast(`Dossiê Técnico em PDF (${dossierAsset.tag}) gerado com sucesso!`);
                  }
                }}
                className="h-10 px-4 rounded-xl bg-[#2563eb] text-white font-semibold text-xs sm:text-sm hover:bg-[#1d4ed8] flex items-center gap-1.5 transition-colors shadow-md shadow-[#2563eb]/20"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Descarregar PDF Oficial</span>
              </button>
              <button
                type="button"
                onClick={() => setDossierAsset(null)}
                className="h-10 px-5 rounded-xl bg-[#222a3d] text-[#dae2fd] font-bold text-xs sm:text-sm hover:bg-[#2d3449] transition-colors"
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
