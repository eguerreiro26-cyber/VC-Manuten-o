import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Asset, Criticality, AssetStatus } from '../types';
import { toInputDateFormat, formatDateToPt, calculateNextCycle } from '../utils/dateUtils';

interface EditAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Oscilador de Molde', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYFEvdUS5Hk3Cx2FigTGxq7tTLyZPyJzXqXq52kVnxrwGQ6XtR4KLpIKn80C8iR0YwX4-fo2kmVgj05LK-dX460JpoUfN89G91_62ncrn6VfUZ2t1eNJB-kugAcMki0OfeeyBrfMfLA-6STacoaFIyDIv3j4zFz_d8AzPYTuccccmETdzZX8GtYeMRq0lC2Eh5M9nTiNc1XJcPHW2OuYvCTV8awLnvzXP6raPK1i4aUzyj2k7Zo_S' },
  { label: 'Distribuidor / Tundish', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD02yE8sT0s83QcM9B2G2o3r14z1M-p_wL6eL_9kY2uCq1n4A6Vb5GfE-pX2YvH9c' },
  { label: 'Laminador / Rolos', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYFEvdUS5Hk3Cx2FigTGxq7tTLyZPyJzXqXq52kVnxrwGQ6XtR4KLpIKn80C8iR0YwX4-fo2kmVgj05LK-dX460JpoUfN89G91_62ncrn6VfUZ2t1eNJB-kugAcMki0OfeeyBrfMfLA-6STacoaFIyDIv3j4zFz_d8AzPYTuccccmETdzZX8GtYeMRq0lC2Eh5M9nTiNc1XJcPHW2OuYvCTV8awLnvzXP6raPK1i4aUzyj2k7Zo_S' },
  { label: 'Mesa de Rolos / Corte', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD30pbf9BOYll2hEoYldlx7VldUrUHaLGDsAE472ao0JoCXnfuj4iVW0Cr3BEJ2-oURL80KPkqVP5o-IDYtMgYT8IeVR__se8GnINSG8KYGoMNOCfCcOqSP50rClcSSQNf9ADKcWGySDkOiHQCknFAqszFXLqXD6uLFEHY6sOIgFBKQbAdRCvlJ-eBDHkwIgQw4hmNxkISi_YxdQ_OXzI1zUeAn3AwMtc2zcjCZ6IRVfZZjRqjLwzU3' }
];

export const EditAssetModal: React.FC<EditAssetModalProps> = ({ asset, isOpen, onClose }) => {
  const { updateAsset, deleteAsset, showToast } = useApp();

  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [plantArea, setPlantArea] = useState('');
  const [criticality, setCriticality] = useState<Criticality>('A');
  const [status, setStatus] = useState<AssetStatus>('Operacional');
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [revCode, setRevCode] = useState('');

  // Last intervention
  const [lastIntervDate, setLastIntervDate] = useState('');

  // Next intervention
  const [intervTitle, setIntervTitle] = useState('');
  const [intervFreqLabel, setIntervFreqLabel] = useState('Bienal (730 Dias)');
  const [intervFreqDays, setIntervFreqDays] = useState(730);
  const [intervDueDate, setIntervDueDate] = useState('');
  const [intervDaysRemaining, setIntervDaysRemaining] = useState(30);
  const [intervTech, setIntervTech] = useState('');

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (asset) {
      setTag(asset.tag);
      setName(asset.name);
      setSector(asset.sector);
      setPlantArea(asset.plantArea || 'SMS Concast');
      setCriticality(asset.criticality);
      setStatus(asset.status);
      setManufacturer(asset.manufacturer || '');
      setSerialNumber(asset.serialNumber || '');
      setImageUrl(asset.imageUrl || PRESET_IMAGES[0].url);
      setRevCode(asset.revCode || 'REV: 2024.1');

      setLastIntervDate(toInputDateFormat(asset.lastInterventionDate));

      setIntervTitle(asset.nextIntervention.title);
      setIntervFreqLabel(asset.nextIntervention.frequencyLabel);
      setIntervFreqDays(asset.nextIntervention.frequencyDays || 30);
      setIntervDueDate(asset.nextIntervention.dueDate);
      setIntervDaysRemaining(asset.nextIntervention.daysRemaining);
      setIntervTech(asset.nextIntervention.assignedTech || '');
      setShowConfirmDelete(false);
    }
  }, [asset, isOpen]);

  if (!isOpen || !asset) return null;

  const handlePeriodicityChange = (val: string) => {
    setIntervFreqLabel(val);
    let days = 30;
    if (val.includes('1460') || val.includes('48')) days = 1460;
    else if (val.includes('1095') || val.includes('36')) days = 1095;
    else if (val.includes('730') || val.includes('Bienal')) days = 730;
    else if (val.includes('540') || val.includes('18')) days = 540;
    else if (val.includes('365') || val.includes('Anual')) days = 365;
    else if (val.includes('180') || val.includes('Semestral')) days = 180;
    else if (val.includes('90') || val.includes('Trimestral')) days = 90;
    else if (val.includes('30') || val.includes('Mensal')) days = 30;
    else if (val.includes('7') || val.includes('Semanal')) days = 7;
    setIntervFreqDays(days);

    // Auto-update next due date if last intervention date is present
    if (lastIntervDate) {
      const cycle = calculateNextCycle(lastIntervDate, days);
      setIntervDueDate(cycle.dueDate);
      setIntervDaysRemaining(cycle.daysRemaining);
    }
  };

  const handleRecalculateCycle = (baseDate: string, days: number = intervFreqDays) => {
    if (!baseDate) return;
    const cycle = calculateNextCycle(baseDate, days);
    setIntervDueDate(cycle.dueDate);
    setIntervDaysRemaining(cycle.daysRemaining);
    showToast(`Próxima data recalculada: ${cycle.dueDate} (${cycle.daysRemaining} dias)`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tag.trim() || !name.trim()) {
      showToast('Tag e Nome do equipamento são obrigatórios.');
      return;
    }

    const formattedLastDate = formatDateToPt(lastIntervDate);

    updateAsset(asset.id, {
      tag: tag.trim(),
      name: name.trim(),
      sector: sector.trim(),
      plantArea: plantArea.trim(),
      criticality,
      status,
      statusLabel: status === 'Operacional' ? 'Operacional' : status,
      manufacturer: manufacturer.trim(),
      serialNumber: serialNumber.trim(),
      imageUrl: imageUrl.trim() || asset.imageUrl,
      revCode: revCode.trim(),
      lastInterventionDate: formattedLastDate,
      nextIntervention: {
        title: intervTitle.trim() || 'Alinhamento e Equilibragem',
        frequencyLabel: intervFreqLabel,
        frequencyDays: intervFreqDays,
        dueDate: intervDueDate,
        daysRemaining: Number(intervDaysRemaining),
        assignedTech: intervTech.trim() || 'Equipa de Turno'
      }
    });

    showToast(`Equipamento ${tag} atualizado com sucesso! Data de última intervenção: ${formattedLastDate}`);
    onClose();
  };

  const handleDelete = () => {
    deleteAsset(asset.id);
    showToast(`Equipamento ${asset.tag} (${asset.name}) foi excluído.`);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#060e20]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Modal Dialog Container with Fixed Height and Flex Column */}
      <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] sm:max-h-[86vh] h-full overflow-hidden">
        
        {/* 1. Header Fixo Superior */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-[#2d3449] shrink-0 bg-[#171f33] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">edit_note</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#222a3d] text-[#b4c5ff]">
                  {asset.tag}
                </span>
                <span className="text-xs text-[#8d90a0]">SMS Concast</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-[#dae2fd]">
                Editar Equipamento
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] active:bg-[#222a3d] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* 2. Corpo Scrollável do Formulário */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {/* Alerta de Confirmação de Exclusão */}
          {showConfirmDelete && (
            <div className="p-4 rounded-xl bg-[#93000a]/20 border border-[#93000a] flex flex-col gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#ffb4ab]">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <span className="font-bold text-sm">Confirmar Exclusão de Ativo</span>
              </div>
              <p className="text-xs text-[#dae2fd]">
                Tem a certeza de que deseja excluir permanentemente o equipamento <strong className="text-white">{asset.tag} - {asset.name}</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#222a3d] text-[#c3c6d7] text-xs font-semibold hover:bg-[#2d3449]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-lg bg-[#93000a] text-white text-xs font-bold hover:bg-[#ba1a1a] flex items-center gap-1 shadow"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                  <span>Confirmar Exclusão</span>
                </button>
              </div>
            </div>
          )}

          <form id="edit-asset-form" onSubmit={handleSave} className="flex flex-col gap-4">
            {/* Secção 1: Identificação Principal */}
            <div className="bg-[#131b2e] p-3.5 sm:p-4 rounded-xl border border-[#222a3d] flex flex-col gap-3">
              <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">badge</span>
                Identificação do Equipamento
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex flex-col gap-1 sm:col-span-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Tag do Ativo *
                  </label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    className="min-h-[42px] px-3 bg-[#060e20] text-[#b4c5ff] font-mono font-bold rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Nome do Equipamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] font-semibold rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Sector / Linha
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    placeholder="Ex: Vazamento Contínuo • SMS Concast"
                    className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Área Fabril
                  </label>
                  <input
                    type="text"
                    value={plantArea}
                    onChange={e => setPlantArea(e.target.value)}
                    className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Criticidade
                  </label>
                  <select
                    value={criticality}
                    onChange={e => setCriticality(e.target.value as Criticality)}
                    className="min-h-[42px] px-2 bg-[#060e20] text-[#dae2fd] font-bold rounded-lg border border-[#2d3449] focus:outline-none"
                  >
                    <option value="A">Classe A (Crítica)</option>
                    <option value="B">Classe B (Média)</option>
                    <option value="C">Classe C (Baixa)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Estado
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as AssetStatus)}
                    className="min-h-[42px] px-2 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] focus:outline-none"
                  >
                    <option value="Operacional">Operacional</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Alerta">Em Alerta</option>
                    <option value="Parado">Parado</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Fabricante
                  </label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={e => setManufacturer(e.target.value)}
                    placeholder="SMS Concast"
                    className="min-h-[42px] px-2.5 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Nº de Série
                  </label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={e => setSerialNumber(e.target.value)}
                    placeholder="Série / ID"
                    className="min-h-[42px] px-2.5 bg-[#060e20] text-[#dae2fd] font-mono rounded-lg border border-[#2d3449] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Secção 2: Imagem do Equipamento */}
            <div className="bg-[#131b2e] p-3.5 sm:p-4 rounded-xl border border-[#222a3d] flex flex-col gap-2.5">
              <span className="font-label-sm text-label-sm text-[#b4c5ff] uppercase font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                Imagem do Equipamento
              </span>

              <div className="flex items-center gap-3">
                <img
                  src={imageUrl || PRESET_IMAGES[0].url}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover bg-[#060e20] border border-[#2d3449] shrink-0"
                />
                <div className="flex-1 flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="min-h-[40px] px-3 bg-[#060e20] text-xs text-[#dae2fd] font-mono rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[11px] text-[#8d90a0] shrink-0">Galeria Rápida:</span>
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="px-2 py-1 rounded bg-[#222a3d] text-xs text-[#c3c6d7] hover:text-[#b4c5ff] shrink-0 border border-[#2d3449]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Secção 3: Plano e Intervenções */}
            <div className="bg-[#131b2e] p-3.5 sm:p-4 rounded-xl border border-[#222a3d] flex flex-col gap-3">
              <span className="font-label-sm text-label-sm text-[#4edea3] uppercase font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">event_repeat</span>
                Plano de Manutenção & Intervenções
              </span>

              {/* Data da Última Intervenção (Pedido do Utilizador) */}
              <div className="p-3 rounded-lg bg-[#060e20] border border-[#2d3449] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-[#dae2fd] uppercase font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">history</span>
                    Data da Última Intervenção
                  </label>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#222a3d] text-[#b4c5ff] font-bold">
                    {lastIntervDate ? formatDateToPt(lastIntervDate) : 'Não registada'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <div className="sm:col-span-2">
                    <input
                      type="date"
                      value={lastIntervDate}
                      onChange={e => {
                        const newDate = e.target.value;
                        setLastIntervDate(newDate);
                        if (newDate) {
                          const cycle = calculateNextCycle(newDate, intervFreqDays);
                          setIntervDueDate(cycle.dueDate);
                          setIntervDaysRemaining(cycle.daysRemaining);
                        }
                      }}
                      className="w-full min-h-[42px] px-3 bg-[#171f33] text-[#4edea3] font-mono font-bold text-sm rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        setLastIntervDate(todayStr);
                        handleRecalculateCycle(todayStr, intervFreqDays);
                      }}
                      className="flex-1 min-h-[42px] px-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#c3c6d7] text-xs font-semibold flex items-center justify-center gap-1 border border-[#2d3449]"
                    >
                      <span className="material-symbols-outlined text-[15px]">today</span>
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRecalculateCycle(lastIntervDate, intervFreqDays)}
                      title="Recalcular Próxima Intervenção a partir desta data"
                      className="min-h-[42px] px-2.5 rounded-lg bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#b4c5ff] text-xs font-semibold flex items-center justify-center gap-1 border border-[#2563eb]/40"
                    >
                      <span className="material-symbols-outlined text-[16px]">sync</span>
                      Recalcular
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#8d90a0]">
                  Ao alterar a data da última intervenção, a data prevista e os dias restantes da próxima intervenção são atualizados com base no ciclo.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                  Descritivo da Tarefa (Título) *
                </label>
                <input
                  type="text"
                  required
                  value={intervTitle}
                  onChange={e => setIntervTitle(e.target.value)}
                  placeholder="Ex: Alinhamento e Equilibragem do Sistema Oscilante"
                  className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] font-medium rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Periodicidade
                  </label>
                  <select
                    value={intervFreqLabel}
                    onChange={e => handlePeriodicityChange(e.target.value)}
                    className="min-h-[42px] px-2 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] focus:outline-none"
                  >
                    <option value="Semanal (7 Dias)">Semanal (7 Dias)</option>
                    <option value="Mensal (30 Dias)">Mensal (30 Dias)</option>
                    <option value="Trimestral (90 Dias)">Trimestral (90 Dias)</option>
                    <option value="Semestral (180 Dias)">Semestral (180 Dias)</option>
                    <option value="Anual (365 Dias)">Anual (365 Dias)</option>
                    <option value="18 Meses (540 Dias)">18 Meses (540 Dias)</option>
                    <option value="Bienal (730 Dias)">Bienal (730 Dias)</option>
                    <option value="36 Meses (1095 Dias)">36 Meses (1095 Dias)</option>
                    <option value="48 Meses (1460 Dias)">48 Meses (1460 Dias)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Data Prevista (Próxima)
                  </label>
                  <input
                    type="text"
                    value={intervDueDate}
                    onChange={e => setIntervDueDate(e.target.value)}
                    placeholder="Ex: 15/Nov/2026"
                    className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] font-mono rounded-lg border border-[#2d3449] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                    Dias Restantes
                  </label>
                  <input
                    type="number"
                    value={intervDaysRemaining}
                    onChange={e => setIntervDaysRemaining(Number(e.target.value))}
                    className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] font-mono font-bold rounded-lg border border-[#2d3449] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                  Técnico Responsável (Nome por extenso)
                </label>
                <input
                  type="text"
                  value={intervTech}
                  onChange={e => setIntervTech(e.target.value)}
                  placeholder="Ex: Carlos Fernandes"
                  className="min-h-[42px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>
          </form>
        </div>

        {/* 3. Rodapé Fixo Inferior - NUNCA FICA TRAPADO */}
        <div className="p-3 sm:p-4 bg-[#131b2e] border-t border-[#2d3449] shrink-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.65)]">
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="h-11 px-3.5 sm:px-4 rounded-xl bg-[#93000a]/25 text-[#ffb4ab] border border-[#93000a]/50 hover:bg-[#93000a]/40 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Excluir Ativo</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-3.5 sm:px-4 rounded-xl bg-[#222a3d] text-[#c3c6d7] font-semibold text-xs sm:text-sm hover:bg-[#2d3449] active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-asset-form"
              className="h-11 px-4 sm:px-5 rounded-xl bg-[#2563eb] text-[#eeefff] font-bold text-xs sm:text-sm hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md shadow-[#2563eb]/25"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Guardar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
