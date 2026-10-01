import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Technician } from '../types';

export const ConfigView: React.FC = () => {
  const {
    plantName,
    setPlantName,
    plantLine,
    setPlantLine,
    isOfflineMode,
    setIsOfflineMode,
    triggerManualSync,
    syncAllToSupabase,
    showToast,
    assets,
    technicians,
    addTechnician,
    updateTechnician,
    deleteTechnician
  } = useApp();

  // Technician modal state
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [techName, setTechName] = useState('');
  const [techRole, setTechRole] = useState('');
  const [techReg, setTechReg] = useState('');

  // Technician deletion confirmation modal state
  const [techToDelete, setTechToDelete] = useState<Technician | null>(null);

  const openAddTechModal = () => {
    setEditingTechId(null);
    setTechName('');
    setTechRole('');
    setTechReg('');
    setTechModalOpen(true);
  };

  const openEditTechModal = (tech: Technician) => {
    setEditingTechId(tech.id);
    setTechName(tech.name);
    setTechRole(tech.role);
    setTechReg(tech.reg);
    setTechModalOpen(true);
  };

  const handleSaveTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName.trim()) {
      showToast('O nome do técnico é obrigatório.');
      return;
    }

    if (editingTechId) {
      updateTechnician(editingTechId, {
        name: techName.trim(),
        role: techRole.trim() || 'Técnico Especialista',
        reg: techReg.trim() || 'TR-' + Math.floor(1000 + Math.random() * 9000)
      });
    } else {
      addTechnician({
        name: techName.trim(),
        role: techRole.trim() || 'Técnico Especialista',
        reg: techReg.trim() || 'TR-' + Math.floor(1000 + Math.random() * 9000)
      });
    }

    setTechModalOpen(false);
  };

  const handleDeleteTech = (tech: Technician) => {
    setTechToDelete(tech);
  };

  const handleConfirmDeleteTech = () => {
    if (techToDelete) {
      deleteTechnician(techToDelete.id);
      setTechToDelete(null);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl mx-auto pb-32 pt-1 animate-in fade-in duration-150">
      {/* Configuration Header Card */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-[#dae2fd]">
              Configurações do Sistema
            </h2>
            <p className="font-label-sm text-label-sm text-[#c3c6d7]">
              Unidade Industrial, Técnicos e Sincronização Local
            </p>
          </div>
        </div>
      </div>

      {/* 1. Unidade Fabril & Linha Operacional */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-1 border-b border-[#222a3d]">
          <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">factory</span>
          <span className="font-headline-sm text-headline-sm text-[#dae2fd] text-base">
            Identificação da Planta
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
              Nome da Fábrica
            </label>
            <input
              type="text"
              value={plantName}
              onChange={e => setPlantName(e.target.value)}
              className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] font-body-sm text-body-sm focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
              Linha de Atuação
            </label>
            <input
              type="text"
              value={plantLine}
              onChange={e => setPlantLine(e.target.value)}
              className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] font-body-sm text-body-sm focus:outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>
      </div>

      {/* 2. Quadro de Técnicos Homologados (CRUD) */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">engineering</span>
            <div>
              <span className="font-headline-sm text-headline-sm text-[#dae2fd] text-base">
                Quadro de Técnicos Homologados
              </span>
              <span className="block text-xs text-[#8d90a0]">
                Gestão da equipa de manutenção e executantes de O.S.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openAddTechModal}
            className="px-3 py-1.5 rounded-lg bg-[#2563eb] text-[#eeefff] font-label-sm text-label-sm font-bold flex items-center gap-1.5 active:scale-95 hover:bg-[#1d4ed8] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Adicionar Técnico</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          {technicians.length === 0 ? (
            <div className="col-span-2 p-6 text-center text-[#8d90a0] bg-[#060e20] rounded-lg">
              Nenhum técnico registado. Clique em &quot;Adicionar Técnico&quot; para registar.
            </div>
          ) : (
            technicians.map(tech => (
              <div
                key={tech.id}
                className="p-3 rounded-lg bg-[#060e20] border border-[#222a3d] flex items-center justify-between gap-2 hover:border-[#2d3449] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#222a3d] text-[#b4c5ff] flex items-center justify-center shrink-0 font-bold font-mono text-sm border border-[#2d3449]">
                    {tech.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-label-md text-label-md text-[#dae2fd] font-semibold truncate">
                      {tech.name}
                    </div>
                    <div className="text-[11px] text-[#8d90a0] truncate">{tech.role}</div>
                    <div className="font-mono text-[10px] text-[#b4c5ff] mt-0.5">{tech.reg}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditTechModal(tech)}
                    title="Editar Técnico"
                    aria-label={`Editar técnico ${tech.name}`}
                    className="w-9 h-9 rounded-lg bg-[#171f33] text-[#dae2fd] hover:text-[#b4c5ff] hover:bg-[#222a3d] flex items-center justify-center border border-[#2d3449] transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTech(tech)}
                    title="Remover Técnico"
                    aria-label={`Remover técnico ${tech.name}`}
                    className="w-9 h-9 rounded-lg bg-[#171f33] text-[#ffb4ab] hover:text-[#ffffff] hover:bg-[#ba1a1a] flex items-center justify-center border border-[#ffb4ab]/30 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Acesso Multiplataforma & Nuvem em Tempo Real */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">devices</span>
            <span className="font-headline-sm text-headline-sm text-[#dae2fd] text-base">
              Acesso Multiplataforma (Windows & Android)
            </span>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            Nuvem Ativa
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#060e20] border border-[#222a3d] space-y-2">
          <p className="text-xs text-[#c3c6d7] leading-relaxed">
            Esta aplicação está ligada à base de dados em nuvem <strong>Firebase Firestore</strong>. Qualquer consulta ou edição efetuada a partir de <strong>qualquer browser no Windows, tablet ou telemóvel Android</strong> é guardada e sincronizada instantaneamente em tempo real.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-[#131b2e] border border-[#1e273a]">
              <span className="material-symbols-outlined text-[#b4c5ff] text-[18px]">desktop_windows</span>
              <div>
                <span className="font-bold text-[#dae2fd] block">Windows / PC</span>
                <span className="text-[10px] text-[#8d90a0]">Chrome, Edge, Firefox</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-[#131b2e] border border-[#1e273a]">
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">smartphone</span>
              <div>
                <span className="font-bold text-[#dae2fd] block">Android / Mobile</span>
                <span className="text-[10px] text-[#8d90a0]">Chrome, Samsung Internet, PWA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard?.writeText(url);
              showToast('Link de acesso copiado! Abra em qualquer browser Windows ou Android.');
            }}
            className="flex-1 min-h-[42px] px-3 rounded-lg bg-[#2563eb] text-[#eeefff] font-label-md text-label-md font-semibold hover:bg-[#1d4ed8] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#2563eb]/25"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Copiar Link de Acesso</span>
          </button>
          <button
            type="button"
            onClick={triggerManualSync}
            className="min-h-[42px] px-3.5 rounded-lg bg-[#222a3d] text-[#dae2fd] font-label-md text-label-md font-semibold hover:bg-[#2d3449] active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-[#2d3449]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">cloud_sync</span>
            <span>Verificar Sincronização</span>
          </button>
        </div>
      </div>

      {/* 4. Sincronização & Modo Offline */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">offline_bolt</span>
            <span className="font-headline-sm text-headline-sm text-[#dae2fd] text-base">
              Modo Industrial Desconectado (Offline)
            </span>
          </div>
          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#222a3d] text-[#4edea3] font-mono">
            {assets.length} Ativos Conectados
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-[#060e20] border border-[#222a3d]">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-[#dae2fd] font-semibold">
              Ativar Armazenamento Local sem Internet
            </span>
            <span className="text-xs text-[#8d90a0]">
              Permite aos operadores preencher fichas em áreas fabris sem sinal. As alterações sincronizam automaticamente quando a ligação for retomada.
            </span>
          </div>
          <input
            type="checkbox"
            checked={isOfflineMode}
            onChange={e => setIsOfflineMode(e.target.checked)}
            className="w-6 h-6 rounded accent-[#2563eb] cursor-pointer"
          />
        </div>
      </div>

      {/* 5. Base Partilhada Supabase */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">database</span>
            <div>
              <span className="font-headline-sm text-headline-sm text-[#dae2fd] text-base">
                Base Partilhada Supabase
              </span>
              <span className="block text-xs text-[#8d90a0]">
                Tabela `equipamentos` sincronizada via API em tempo real
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-[#060e20] text-[#4edea3] font-mono border border-[#222a3d] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            nvhtpyeevtfwcyqapejg
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#060e20] border border-[#222a3d] flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-1">
            <span className="text-[#8d90a0]">Endpoint Supabase:</span>
            <span className="font-mono text-[#b4c5ff]">https://nvhtpyeevtfwcyqapejg.supabase.co</span>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs gap-1">
            <span className="text-[#8d90a0]">Modo de sincronização:</span>
            <span className="text-[#4edea3] font-medium">Automático ao criar, editar ou apagar ativos</span>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs gap-1">
            <span className="text-[#8d90a0]">Função de integração:</span>
            <span className="font-mono text-[#ffb95f]">syncEquipamento(...) & removerEquipamento(...)</span>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={syncAllToSupabase}
            className="min-h-[42px] px-4 rounded-lg bg-[#2563eb] text-[#eeefff] font-label-md text-label-md font-bold hover:bg-[#1d4ed8] active:scale-95 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Sincronizar Todos os Equipamentos com Supabase</span>
          </button>
        </div>
      </div>

      {/* 4. Modal Adicionar / Editar Técnico */}
      {techModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl w-full max-w-md p-5 flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    {editingTechId ? 'manage_accounts' : 'person_add'}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-[#dae2fd]">
                  {editingTechId ? 'Editar Técnico' : 'Registar Novo Técnico'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTechModalOpen(false)}
                className="w-8 h-8 rounded-lg text-[#c3c6d7] hover:text-[#dae2fd] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveTech} className="flex flex-col gap-3.5 mt-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                  Nome Completo (por extenso) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Fernandes"
                  value={techName}
                  onChange={e => setTechName(e.target.value)}
                  className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] font-body-sm text-body-sm focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                  Função / Especialidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: Especialista Mecânico SMS Concast"
                  value={techRole}
                  onChange={e => setTechRole(e.target.value)}
                  className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] font-body-sm text-body-sm focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#c3c6d7] uppercase">
                  Matrícula / Cód. Registro
                </label>
                <input
                  type="text"
                  placeholder="Ex: TR-4891"
                  value={techReg}
                  onChange={e => setTechReg(e.target.value)}
                  className="min-h-[44px] px-3 bg-[#060e20] text-[#dae2fd] rounded-lg border border-[#2d3449] font-body-sm text-body-sm font-mono focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTechModalOpen(false)}
                  className="h-11 rounded-xl bg-[#222a3d] text-[#c3c6d7] font-semibold hover:bg-[#2d3449] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-[#2563eb] text-[#eeefff] font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{editingTechId ? 'Guardar' : 'Registar'}</span>
                </button>
              </div>

              {editingTechId && (
                <button
                  type="button"
                  onClick={() => {
                    const currentTech = technicians.find(t => t.id === editingTechId);
                    setTechModalOpen(false);
                    if (currentTech) {
                      setTechToDelete(currentTech);
                    }
                  }}
                  className="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 font-semibold hover:bg-[#ba1a1a] hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Remover Este Técnico do Quadro Homologado</span>
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 5b. Modal de Confirmação de Eliminação de Técnico Homologado */}
      {techToDelete && (
        <div className="fixed inset-0 z-[110] bg-[#060e20]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#171f33] border border-[#ffb4ab]/40 rounded-2xl w-full max-w-md p-5 flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2d3449]">
              <div className="w-10 h-10 rounded-xl bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">person_remove</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-[#dae2fd] text-base font-bold">
                  Remover Técnico Homologado
                </h3>
                <p className="text-xs text-[#8d90a0]">
                  Confirmação de eliminação de registo
                </p>
              </div>
            </div>

            <div className="my-4 p-3.5 rounded-xl bg-[#060e20] border border-[#222a3d] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#222a3d] text-[#b4c5ff] flex items-center justify-center font-bold font-mono text-base border border-[#2d3449] shrink-0">
                  {techToDelete.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-label-md text-label-md text-[#dae2fd] font-bold truncate">
                    {techToDelete.name}
                  </div>
                  <div className="text-xs text-[#8d90a0] truncate">{techToDelete.role}</div>
                  <div className="font-mono text-[11px] text-[#b4c5ff] font-semibold mt-0.5">{techToDelete.reg}</div>
                </div>
              </div>

              <div className="text-xs text-[#c3c6d7] bg-[#171f33]/80 p-3 rounded-lg border border-[#2d3449] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] shrink-0 mt-0.5">warning</span>
                <span className="leading-relaxed">
                  Tem a certeza que deseja eliminar o técnico <strong>{techToDelete.name}</strong>? Este profissional deixará de constar no quadro homologado e a alteração será sincronizada em tempo real com a base de dados.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTechToDelete(null)}
                className="h-11 rounded-xl bg-[#222a3d] text-[#c3c6d7] font-semibold hover:bg-[#2d3449] hover:text-[#dae2fd] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTech}
                className="h-11 rounded-xl bg-[#ba1a1a] text-[#ffffff] font-semibold hover:bg-[#93000a] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#ba1a1a]/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                <span>Eliminar Técnico</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Normas & Certificação */}
      <div className="p-3 bg-[#060e20] border border-[#171f33] rounded-xl text-center text-xs text-[#8d90a0]">
        <p className="font-mono font-semibold text-[#b4c5ff]">
          IndusMaint • Versão 4.8-PROD
        </p>
        <p className="mt-0.5">
          Sistema Industrial de Gestão e Manutenção de Ativos Fabris.
        </p>
      </div>
    </div>
  );
};
