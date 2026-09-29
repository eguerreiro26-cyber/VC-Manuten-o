import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Asset, Criticality, MaintenanceRoutine } from '../types';
import { toInputDateFormat, formatDateToPt, calculateNextCycle } from '../utils/dateUtils';

export const NovoRegistoView: React.FC = () => {
  const { addAsset, setActiveTab, showToast } = useApp();

  // Active accordion section: 1, 2, 3, 4
  const [activeSection, setActiveSection] = useState<number>(1);

  // Form states - Step 1: Identificação & Origem (sem área fabril, sem entrada em serviço, sem horímetro)
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  // Step 2: Criticidade FMEA
  const [criticality, setCriticality] = useState<Criticality>('A');

  // Step 3: Periodicidade & Tarefas
  const [frequencyDays, setFrequencyDays] = useState<number>(30);
  const [frequencyLabel, setFrequencyLabel] = useState<string>('Mensal (30 Dias)');
  const [lastInterventionDate, setLastInterventionDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Tasks checkboxes & details
  const [taskParts, setTaskParts] = useState(true);
  const [taskPartsDetail, setTaskPartsDetail] = useState('Rolamentos de alta temperatura, vedações viton, molas de retorno');
  
  const [taskValves, setTaskValves] = useState(false);
  const [taskValvesDetail, setTaskValvesDetail] = useState('Válvulas reguladoras de caudal e pressostatos de refrigeração');

  const [taskLube, setTaskLube] = useState(true);
  const [taskLubeDetail, setTaskLubeDetail] = useState('Graxa sintética de poliureia de alta temperatura (purgar linhas)');

  const [taskThermo, setTaskThermo] = useState(true);
  const [taskThermoDetail, setTaskThermoDetail] = useState('Inspeção termográfica de mancais e ensaio não destrutivo');

  // Task 5: Alinhamento e Equilibragem
  const [taskAlignment, setTaskAlignment] = useState(false);
  const [taskAlignmentDetail, setTaskAlignmentDetail] = useState('Alinhamento a laser de rolos/eixos e equilibragem dinâmica de conjuntos rotativos');

  // Step 4: Alertas & Responsável (escrito por extenso)
  const [antecedenceDays, setAntecedenceDays] = useState<number>(5);
  const [assignedTech, setAssignedTech] = useState<string>('');

  const toggleSection = (step: number) => {
    setActiveSection(prev => (prev === step ? 0 : step));
  };

  const generateAutoTag = () => {
    const prefixes = ['OSC-HYD', 'REP-CAR', 'EXT-END', 'TOR-PAN', 'TES-COR', 'SEG-GUI', 'BOM-REF'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    const newTag = `${prefix}-${randomNum}`;
    setTag(newTag);
    if (!name) {
      setName(`Conjunto Mecânico SMS Concast ${randomNum}`);
    }
    showToast(`Tag gerada: ${newTag}`);
  };

  const handleSelectFrequency = (days: number, label: string) => {
    setFrequencyDays(days);
    setFrequencyLabel(label);
  };

  const handleSaveDraft = () => {
    showToast('Rascunho gravado localmente. Pode prosseguir a qualquer momento.');
  };

  const handleCancel = () => {
    setActiveTab('equipamentos');
  };

  const handleSubmit = () => {
    if (!tag.trim() || !name.trim()) {
      setActiveSection(1);
      showToast('Por favor preencha os campos obrigatórios (Tag e Nome do Ativo).');
      return;
    }

    const constructedRoutines: MaintenanceRoutine[] = [];
    if (taskParts) {
      constructedRoutines.push({
        id: 'r-' + Date.now() + '-1',
        code: 'SUB-01',
        type: 'Substituição',
        title: 'Substituição de Componentes',
        description: taskPartsDetail,
        periodicityLabel: frequencyLabel,
        periodicityDays: frequencyDays,
        toleranceOrSpec: 'Conforme catálogo de peças SMS'
      });
    }
    if (taskValves) {
      constructedRoutines.push({
        id: 'r-' + Date.now() + '-2',
        code: 'CAL-02',
        type: 'Calibração',
        title: 'Calibração de Válvulas / Sensores',
        description: taskValvesDetail,
        periodicityLabel: frequencyLabel,
        periodicityDays: frequencyDays,
        toleranceOrSpec: '± 0.05 bar'
      });
    }
    if (taskLube) {
      constructedRoutines.push({
        id: 'r-' + Date.now() + '-3',
        code: 'LUB-01',
        type: 'Lubrificação',
        title: 'Lubrificação & Engraxamento',
        description: taskLubeDetail,
        periodicityLabel: frequencyLabel,
        periodicityDays: frequencyDays,
        toleranceOrSpec: 'Graxa Poliureia NLGI 2'
      });
    }
    if (taskThermo) {
      constructedRoutines.push({
        id: 'r-' + Date.now() + '-4',
        code: 'INS-01',
        type: 'Inspeção',
        title: 'Inspeção Visual & Termográfica',
        description: taskThermoDetail,
        periodicityLabel: frequencyLabel,
        periodicityDays: frequencyDays,
        toleranceOrSpec: '< 75°C'
      });
    }
    if (taskAlignment) {
      constructedRoutines.push({
        id: 'r-' + Date.now() + '-5',
        code: 'ALN-01',
        type: 'Alinhamento',
        title: 'Alinhamento e Equilibragem',
        description: taskAlignmentDetail,
        periodicityLabel: frequencyLabel,
        periodicityDays: frequencyDays,
        toleranceOrSpec: '< 0.05 mm'
      });
    }

    const cycle = calculateNextCycle(lastInterventionDate, frequencyDays);
    const formattedLastDate = formatDateToPt(lastInterventionDate);
    const formattedNextDate = cycle.dueDate;
    const remainingDays = cycle.daysRemaining;
    const isOverdue = remainingDays < 0;

    const sampleImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiMQOYcOiYZ3zOIUd16s5DpiZnepp2AWEHjFz2Ot86Sn4gIoCr9zMGKeKTOoby2Zvr1FjUO_mqHrO8SXfTKfoM9VgFeiJXAhInQOdHjv5su7yf6EYpa9fGfCeplqJJtV8vkvH3D80BlbYgLKxC6YG5hFndoo-bAfFLtY4JLhE4Z60WRVy7l0QBzEXnyKTBCuBoiWU92ZkNDcnQJ6poq2_E1wOn8caQzXdoC5b_h-KQmqokEUgjZEOm',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwKgKS98I9S82uaXJ9ShC6qTa_4nt3-FWEf-i1l0wqgoRbL8ptrLdVGBiQsD_gJ1HRpHaT1R_KOvy5FKv5Zjsk0gRM4QNHNA1S1sQgFKUJ-TssSxssOfuboN3nGbfhkK1r-42N9l2gugDTuYEcJ8pLrDeeItVE-jfMaVonGgAOxYHqjIHZTUgr00E4RbBYyP_VvuNm07krWHtx1pg9SwHgsRhXK-tdgUEvukjiCS6tZkiqLjCH3_w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmqagdctK-N4TjSeN6Cz_DEs6Rwgcf9K99OdDHIiyqb3gF3wepexqbMef4lBFuhCWdaWKdFKQh_SYSnWCXwvvHR_EweSy8J9Nbhk0yCTbFXPTyYOi5YnOmSZlMGL0qDUj1qvZncMl5V7hcDrA9ygezNg4uefjeRkd_s6UPENRVQdrbOWXBq4RTfsKi2eHP5zuUC-gSTqLe6AD_2QvrTiUsCfnDH55zYGAMbydQ_UtcNdb9UOjG7zHf',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYFEvdUS5Hk3Cx2FigTGxq7tTLyZPyJzXqXq52kVnxrwGQ6XtR4KLpIKn80C8iR0YwX4-fo2kmVgj05LK-dX460JpoUfN89G91_62ncrn6VfUZ2t1eNJB-kugAcMki0OfeeyBrfMfLA-6STacoaFIyDIv3j4zFz_d8AzPYTuccccmETdzZX8GtYeMRq0lC2Eh5M9nTiNc1XJcPHW2OuYvCTV8awLnvzXP6raPK1i4aUzyj2k7Zo_S'
    ];
    const chosenImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const newAsset: Asset = {
      id: 'vc-' + Date.now(),
      tag: tag.toUpperCase(),
      name,
      sector: sector ? `Vazamento Contínuo • ${sector}` : 'Vazamento Contínuo • SMS Concast',
      plantArea: 'SMS Concast',
      criticality,
      status: isOverdue ? 'Pendente' : 'Operacional',
      statusLabel: isOverdue ? `MANUTENÇÃO VENCIDA (${Math.abs(remainingDays)}d)` : `PLANO EM DIA (${frequencyDays} DIAS)`,
      revCode: 'REV: 2024.1',
      imageUrl: chosenImage,
      manufacturer: manufacturer || 'SMS Concast / OEM',
      serialNumber: serialNumber || 'SN-' + Math.floor(100000 + Math.random() * 900000),
      lastInterventionDate: formattedLastDate,
      nextIntervention: {
        frequencyLabel,
        frequencyDays,
        title: constructedRoutines[0]?.title || 'Revisão Preventiva Periódica',
        dueDate: formattedNextDate,
        daysRemaining: remainingDays,
        assignedTech: assignedTech.trim() || 'Equipa de Manutenção Mecânica'
      },
      routines: constructedRoutines,
      history: lastInterventionDate ? [
        {
          id: 'h-' + Date.now(),
          title: constructedRoutines[0]?.title || 'Manutenção Preventiva Periódica',
          date: formattedLastDate,
          notes: 'Registo de última intervenção homologado no cadastro inicial do ativo.',
          technicianName: assignedTech.trim() || 'Equipa de Manutenção SMS Concast',
          technicianRole: 'Técnico Responsável',
          technicianReg: 'RUB-CONCAST',
          verified: true
        }
      ] : []
    };

    addAsset(newAsset);
    showToast(`Ativo ${newAsset.tag} registado com sucesso! Última intervenção: ${formattedLastDate}`);
    setActiveTab('equipamentos');
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl mx-auto pb-32 pt-1">
      {/* Progress Header Summary */}
      <div className="flex flex-col bg-[#222a3d] border border-[#2d3449] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#b4c5ff] text-[24px]">
              app_registration
            </span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-[#dae2fd]">Cadastro de Ativo</h2>
              <p className="font-label-sm text-label-sm text-[#c3c6d7] uppercase tracking-wider">
                Vazamento Continuo • SN Seixal - SMS Concast
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              id="completion-badge"
              className="font-label-md text-label-md px-2 py-0.5 rounded-full bg-[#2d3449] text-[#b4c5ff] font-semibold"
            >
              Passo {activeSection || 1} de 4
            </span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#060e20] h-1.5 rounded-full mt-3 overflow-hidden flex">
          <div
            id="progress-bar-fill"
            className="h-full bg-[#2563eb] transition-all duration-300 ease-out"
            style={{ width: `${(activeSection || 1) * 25}%` }}
          />
        </div>
      </div>

      <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3">
        {/* ACCORDION SECTION 1: Identificação & Origem (Sem Área Fabril, Sem Entrada em Serviço, Sem Horímetro) */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl overflow-hidden shadow-sm transition-all">
          <button
            type="button"
            onClick={() => toggleSection(1)}
            className="w-full flex items-center justify-between p-4 text-left active:bg-[#222a3d] transition-colors min-h-[56px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg font-label-md text-label-md font-bold shrink-0 ${
                  activeSection === 1
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'bg-[#222a3d] text-[#dae2fd]'
                }`}
              >
                1
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-[#dae2fd] truncate">
                  Identificação & Origem
                </span>
                <span className="font-label-sm text-label-sm text-[#c3c6d7]">
                  Tag, designação, fabricante e setor
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[#c3c6d7] transform transition-transform duration-200 ${
                activeSection === 1 ? 'rotate-180' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </button>

          {activeSection === 1 && (
            <div className="p-4 pt-0 space-y-3.5 border-t border-[#222a3d]/50 animate-in fade-in duration-150">
              {/* Tag & Auto generator */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide flex items-center justify-between">
                  <span>
                    Tag / Código do Ativo <span className="text-[#ffb4ab]">*</span>
                  </span>
                  <span className="text-[#c3c6d7] font-label-sm">ISO-14224</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    placeholder="ex: OSC-HYD-01"
                    required
                    className="w-full min-h-[52px] px-3 bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] font-label-md text-label-md rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb] uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={generateAutoTag}
                    className="absolute right-2 px-2.5 min-h-[38px] flex items-center justify-center rounded-lg bg-[#222a3d] text-[#b4c5ff] hover:bg-[#2d3449] text-label-sm font-label-sm border border-[#2d3449]"
                  >
                    <span className="material-symbols-outlined text-[18px] mr-1">auto_mode</span>
                    Auto
                  </button>
                </div>
              </div>

              {/* Nome do Equipamento */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                  Nome do Equipamento / Ativo <span className="text-[#ffb4ab]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Oscilador Hidráulico de Molde (Linha 1)"
                  required
                  className="w-full min-h-[52px] px-3 bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] font-body-md text-body-md rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Setor Específico (Vazamento Continuo) */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                  Setor / Seção do Vazamento Contínuo
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  placeholder="ex: Linha 1 • Curvatura e Aspersão Secundária"
                  className="w-full min-h-[52px] px-3 bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] font-body-md text-body-md rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Fabricante & Nº de Série */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                    Fabricante
                  </label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={e => setManufacturer(e.target.value)}
                    placeholder="ex: SMS Concast / OEM"
                    className="w-full min-h-[52px] px-3 bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] font-body-md text-body-md rounded-lg border border-[#2d3449] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                    Nº de Série
                  </label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={e => setSerialNumber(e.target.value)}
                    placeholder="ex: SMS-CONC-892"
                    className="w-full min-h-[52px] px-3 bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] font-label-md text-label-md rounded-lg border border-[#2d3449] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION SECTION 2: Criticidade FMEA */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl overflow-hidden shadow-sm transition-all">
          <button
            type="button"
            onClick={() => toggleSection(2)}
            className="w-full flex items-center justify-between p-4 text-left active:bg-[#222a3d] transition-colors min-h-[56px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg font-label-md text-label-md font-bold shrink-0 ${
                  activeSection === 2
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'bg-[#222a3d] text-[#dae2fd]'
                }`}
              >
                2
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-[#dae2fd] truncate">
                  Classificação de Risco (FMEA)
                </span>
                <span className="font-label-sm text-label-sm text-[#c3c6d7]">
                  Matriz de severidade operacional no vazamento
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[#c3c6d7] transform transition-transform duration-200 ${
                activeSection === 2 ? 'rotate-180' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </button>

          {activeSection === 2 && (
            <div className="p-4 pt-0 space-y-2.5 border-t border-[#222a3d]/50 animate-in fade-in duration-150">
              <p className="font-body-sm text-body-sm text-[#c3c6d7] mb-2">
                Selecione o nível de criticidade operacional na máquina Concast:
              </p>

              {/* Radio Card Criticidade A */}
              <label
                onClick={() => setCriticality('A')}
                className={`group relative flex items-start p-3.5 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99] ${
                  criticality === 'A'
                    ? 'bg-[#222a3d] border-[#ffb4ab]'
                    : 'bg-[#060e20] border-[#222a3d]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 mr-3 transition-colors ${
                    criticality === 'A' ? 'bg-[#ffb4ab] text-[#690005]' : 'bg-[#2d3449] text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-[#ffb4ab] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      Criticidade A (Alta / Paragem de Vazamento)
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-bold">
                      SLA: 15 min
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#c3c6d7] mt-1">
                    Interrupção imediata da sequência de vazamento de aço líquido ou risco térmico severo.
                  </p>
                </div>
              </label>

              {/* Radio Card Criticidade B */}
              <label
                onClick={() => setCriticality('B')}
                className={`group relative flex items-start p-3.5 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99] ${
                  criticality === 'B'
                    ? 'bg-[#222a3d] border-[#ffb95f]'
                    : 'bg-[#060e20] border-[#222a3d]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 mr-3 transition-colors ${
                    criticality === 'B' ? 'bg-[#ffb95f] text-[#472a00]' : 'bg-[#2d3449] text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-[#ffb95f] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">alt_route</span>
                      Criticidade B (Média / Redundância)
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#2d3449] text-[#ffddb8] font-bold">
                      SLA: 2 Horas
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#c3c6d7] mt-1">
                    Impacto mitigável na linha ou existência de bypass/reserva disponível.
                  </p>
                </div>
              </label>

              {/* Radio Card Criticidade C */}
              <label
                onClick={() => setCriticality('C')}
                className={`group relative flex items-start p-3.5 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99] ${
                  criticality === 'C'
                    ? 'bg-[#222a3d] border-[#4edea3]'
                    : 'bg-[#060e20] border-[#222a3d]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 mr-3 transition-colors ${
                    criticality === 'C' ? 'bg-[#4edea3] text-[#003824]' : 'bg-[#2d3449] text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-[#4edea3] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Criticidade C (Baixa / Auxiliar)
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#2d3449] text-[#4edea3] font-bold">
                      SLA: Programado
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#c3c6d7] mt-1">
                    Equipamento secundário de transporte ou acabamento sem paragem do fluxo principal.
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* ACCORDION SECTION 3: Periodicidade & Tarefas (Sem quinzenal, com bienal, sem horímetro) */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl overflow-hidden shadow-sm transition-all">
          <button
            type="button"
            onClick={() => toggleSection(3)}
            className="w-full flex items-center justify-between p-4 text-left active:bg-[#222a3d] transition-colors min-h-[56px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg font-label-md text-label-md font-bold shrink-0 ${
                  activeSection === 3
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'bg-[#222a3d] text-[#dae2fd]'
                }`}
              >
                3
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-[#dae2fd] truncate">
                  Periodicidade & Tarefas
                </span>
                <span className="font-label-sm text-label-sm text-[#c3c6d7]">
                  Frequência cíclica e procedimentos de manutenção
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[#c3c6d7] transform transition-transform duration-200 ${
                activeSection === 3 ? 'rotate-180' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </button>

          {activeSection === 3 && (
            <div className="p-4 pt-0 space-y-4 border-t border-[#222a3d]/50 animate-in fade-in duration-150">
              {/* Periodicidade Grid Buttons: Semanal, Mensal, Trimestral, Semestral, Anual, Bienal */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                  Frequência de Manutenção Preventiva
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Semanal', days: 7, desc: '7 Dias' },
                    { label: 'Mensal', days: 30, desc: '30 Dias' },
                    { label: 'Trimestral', days: 90, desc: '90 Dias' },
                    { label: 'Semestral', days: 180, desc: '180 Dias' },
                    { label: 'Anual', days: 365, desc: '365 Dias' },
                    { label: 'Bienal', days: 730, desc: '730 Dias' }
                  ].map(f => {
                    const isSelected = frequencyDays === f.days;
                    return (
                      <button
                        key={f.days}
                        type="button"
                        onClick={() => handleSelectFrequency(f.days, `${f.label} (${f.desc})`)}
                        className={`min-h-[48px] px-2 rounded-lg font-label-md text-label-md active:scale-95 transition-all text-center flex flex-col items-center justify-center border ${
                          isSelected
                            ? 'bg-[#2563eb] text-[#eeefff] font-bold border-[#2563eb] shadow-md'
                            : 'bg-[#060e20] text-[#c3c6d7] border-[#222a3d] hover:bg-[#222a3d]'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className="text-[10px] opacity-80 font-label-sm font-mono">{f.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campo: Data da Última Intervenção (Pedido do Utilizador) */}
              <div className="p-3.5 rounded-xl bg-[#060e20] border border-[#2d3449] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide flex items-center gap-1.5 font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">history</span>
                    <span>Data da Última Intervenção</span>
                    <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#222a3d] text-[#b4c5ff] font-bold border border-[#2d3449]">
                    {formatDateToPt(lastInterventionDate)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <div className="sm:col-span-2">
                    <input
                      type="date"
                      value={lastInterventionDate}
                      onChange={e => setLastInterventionDate(e.target.value)}
                      required
                      className="w-full min-h-[48px] px-3 bg-[#131b2e] text-[#4edea3] font-mono font-bold text-base rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <div className="flex items-center gap-1 sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => setLastInterventionDate(new Date().toISOString().split('T')[0])}
                      className="flex-1 min-h-[48px] px-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#c3c6d7] text-xs font-semibold flex items-center justify-center gap-1 border border-[#2d3449]"
                    >
                      <span className="material-symbols-outlined text-[16px]">today</span>
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 30);
                        setLastInterventionDate(d.toISOString().split('T')[0]);
                      }}
                      className="flex-1 min-h-[48px] px-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#c3c6d7] text-xs font-semibold flex items-center justify-center border border-[#2d3449]"
                    >
                      -30d
                    </button>
                  </div>
                </div>

                {/* Ciclo Dinâmico Calculado em Tempo Real */}
                {(() => {
                  const cycle = calculateNextCycle(lastInterventionDate, frequencyDays);
                  const isOver = cycle.daysRemaining < 0;
                  const isWarn = cycle.daysRemaining >= 0 && cycle.daysRemaining <= 5;
                  return (
                    <div className="p-2.5 rounded-lg bg-[#131b2e] border border-[#222a3d] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#c3c6d7]">
                        <span className="material-symbols-outlined text-[16px] text-[#4edea3]">event_upcoming</span>
                        <span>Próxima Manutenção Prevista:</span>
                        <strong className="text-[#dae2fd] font-mono">{cycle.dueDate}</strong>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold ${
                          isOver
                            ? 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]'
                            : isWarn
                            ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40'
                            : 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                        }`}
                      >
                        {isOver
                          ? `Vencida (${Math.abs(cycle.daysRemaining)}d)`
                          : isWarn
                          ? `Expira em ${cycle.daysRemaining} dias`
                          : `${cycle.daysRemaining} dias restantes`}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Tasks package */}
              <div className="flex flex-col gap-2.5 pt-1">
                <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                  Tarefas do Pacote de Manutenção
                </label>

                {/* Intervenção 1: Componentes */}
                <div className="rounded-xl bg-[#060e20] border border-[#222a3d] p-3 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taskParts}
                      onChange={e => setTaskParts(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#222a3d] accent-[#4edea3] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-[#dae2fd] font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">
                          swap_driving_apps
                        </span>
                        Substituição de Componentes
                      </span>
                    </div>
                  </label>
                  {taskParts && (
                    <div className="pl-7">
                      <input
                        type="text"
                        value={taskPartsDetail}
                        onChange={e => setTaskPartsDetail(e.target.value)}
                        placeholder="Especifique peças, rolamentos, vedações..."
                        className="w-full min-h-[42px] px-3 bg-[#222a3d] text-[#dae2fd] font-body-sm text-body-sm rounded-lg border border-[#2d3449] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Intervenção 2: Calibração */}
                <div className="rounded-xl bg-[#060e20] border border-[#222a3d] p-3 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taskValves}
                      onChange={e => setTaskValves(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#222a3d] accent-[#4edea3] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-[#dae2fd] font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                          tune
                        </span>
                        Calibração de Válvulas / Sensores
                      </span>
                    </div>
                  </label>
                  {taskValves && (
                    <div className="pl-7">
                      <input
                        type="text"
                        value={taskValvesDetail}
                        onChange={e => setTaskValvesDetail(e.target.value)}
                        placeholder="Tolerância admissível (+/- 0.05 bar, LVDT)..."
                        className="w-full min-h-[42px] px-3 bg-[#222a3d] text-[#dae2fd] font-body-sm text-body-sm rounded-lg border border-[#2d3449] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Intervenção 3: Lubrificação */}
                <div className="rounded-xl bg-[#060e20] border border-[#222a3d] p-3 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taskLube}
                      onChange={e => setTaskLube(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#222a3d] accent-[#4edea3] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-[#dae2fd] font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">
                          oil_barrel
                        </span>
                        Lubrificação & Engraxamento
                      </span>
                    </div>
                  </label>
                  {taskLube && (
                    <div className="pl-7">
                      <input
                        type="text"
                        value={taskLubeDetail}
                        onChange={e => setTaskLubeDetail(e.target.value)}
                        placeholder="Especificação de graxa ou óleo sintético de alta temperatura..."
                        className="w-full min-h-[42px] px-3 bg-[#222a3d] text-[#dae2fd] font-body-sm text-body-sm rounded-lg border border-[#2d3449] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Intervenção 4: Inspeção Termográfica */}
                <div className="rounded-xl bg-[#060e20] border border-[#222a3d] p-3 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taskThermo}
                      onChange={e => setTaskThermo(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#222a3d] accent-[#4edea3] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-[#dae2fd] font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">
                          nest_heat_link_gen_3
                        </span>
                        Inspeção Visual & Termográfica
                      </span>
                    </div>
                  </label>
                  {taskThermo && (
                    <div className="pl-7">
                      <input
                        type="text"
                        value={taskThermoDetail}
                        onChange={e => setTaskThermoDetail(e.target.value)}
                        className="w-full min-h-[42px] px-3 bg-[#222a3d] text-[#dae2fd] font-body-sm text-body-sm rounded-lg border border-[#2d3449] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Intervenção 5: Alinhamento e Equilibragem */}
                <div className="rounded-xl bg-[#060e20] border border-[#222a3d] p-3 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taskAlignment}
                      onChange={e => setTaskAlignment(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#222a3d] accent-[#4edea3] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-[#dae2fd] font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                          align_horizontal_center
                        </span>
                        Alinhamento e Equilibragem
                      </span>
                    </div>
                  </label>
                  {taskAlignment && (
                    <div className="pl-7">
                      <input
                        type="text"
                        value={taskAlignmentDetail}
                        onChange={e => setTaskAlignmentDetail(e.target.value)}
                        placeholder="Alinhamento laser de eixos/rolos e equilibragem dinâmica..."
                        className="w-full min-h-[42px] px-3 bg-[#222a3d] text-[#dae2fd] font-body-sm text-body-sm rounded-lg border border-[#2d3449] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION SECTION 4: Alertas & Responsável (escrito por extenso) */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl overflow-hidden shadow-sm transition-all">
          <button
            type="button"
            onClick={() => toggleSection(4)}
            className="w-full flex items-center justify-between p-4 text-left active:bg-[#222a3d] transition-colors min-h-[56px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg font-label-md text-label-md font-bold shrink-0 ${
                  activeSection === 4
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'bg-[#222a3d] text-[#dae2fd]'
                }`}
              >
                4
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-[#dae2fd] truncate">
                  Alertas & Responsável
                </span>
                <span className="font-label-sm text-label-sm text-[#c3c6d7]">
                  Sinalização prévia e delegação técnica por extenso
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[#c3c6d7] transform transition-transform duration-200 ${
                activeSection === 4 ? 'rotate-180' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </button>

          {activeSection === 4 && (
            <div className="p-4 pt-0 space-y-3.5 border-t border-[#222a3d]/50 animate-in fade-in duration-150">
              {/* Slider de Antecedência */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                    Antecedência de Notificação
                  </label>
                  <span
                    id="days-badge"
                    className="font-label-md text-label-md px-2 py-0.5 rounded-lg bg-[#2563eb] text-[#eeefff] font-bold font-mono"
                  >
                    {antecedenceDays} dia{antecedenceDays > 1 ? 's' : ''} antes
                  </span>
                </div>
                <div className="p-3 bg-[#060e20] border border-[#222a3d] rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">
                    notifications_active
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={antecedenceDays}
                    onChange={e => setAntecedenceDays(Number(e.target.value))}
                    className="w-full accent-[#2563eb] h-2 bg-[#2d3449] rounded-lg cursor-pointer"
                  />
                  <span className="font-label-sm text-label-sm text-[#c3c6d7] whitespace-nowrap font-mono">
                    15d máx
                  </span>
                </div>
              </div>

              {/* Responsável Técnico Escrito por Extenso */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-[#dae2fd] uppercase tracking-wide">
                  Nome do Técnico Responsável (Escrito por Extenso) <span className="text-[#ffb4ab]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#8d90a0] text-[20px] pointer-events-none">
                    person
                  </span>
                  <input
                    type="text"
                    value={assignedTech}
                    onChange={e => setAssignedTech(e.target.value)}
                    placeholder="ex: Carlos Eduardo Santos (Técnico Mecânico Especialista)"
                    required
                    className="w-full min-h-[52px] pl-10 pr-3 bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] font-body-md text-body-md rounded-lg border border-[#2d3449] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <span className="text-[11px] text-[#8d90a0]">
                  Permite indicar qualquer técnico da equipa própria ou prestador externo.
                </span>
              </div>

              {/* Notificação Auditoria */}
              <div className="flex items-center gap-2.5 p-3 bg-[#060e20] border border-[#222a3d] rounded-lg">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                  verified_user
                </span>
                <span className="font-body-sm text-body-sm text-[#c3c6d7]">
                  Disparo de sinalização preventiva e backup local do plano no sistema Concast.
                </span>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-20 z-40 bg-[#060e20]/95 backdrop-blur-md -mx-4 px-4 py-3 border-t border-[#222a3d] flex flex-col gap-2 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="min-h-[46px] px-4 flex-1 rounded-xl bg-[#222a3d] text-[#dae2fd] font-label-md text-label-md font-semibold active:bg-[#2d3449] hover:bg-[#2d3449]/80 transition-colors flex items-center justify-center border border-[#2d3449]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="min-h-[46px] px-4 flex-1 rounded-xl bg-[#2d3449] text-[#ffb95f] font-label-md text-label-md font-semibold active:bg-[#31394d] hover:bg-[#31394d]/80 transition-colors flex items-center justify-center gap-1.5 border border-[#434655]"
          >
            <span className="material-symbols-outlined text-[18px]">drafts</span>
            Rascunho
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full min-h-[52px] px-4 rounded-xl bg-[#2563eb] text-[#eeefff] font-headline-sm text-headline-sm font-bold active:scale-[0.98] hover:bg-[#1d4ed8] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#2563eb]/25"
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span>Guardar e Ativar Plano</span>
        </button>
      </div>
    </div>
  );
};
