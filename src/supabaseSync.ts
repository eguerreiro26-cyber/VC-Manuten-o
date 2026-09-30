import { createClient } from '@supabase/supabase-js';
import { Asset } from './types';
import { toInputDateFormat } from './utils/dateUtils';

const SUPABASE_URL = 'https://nvhtpyeevtfwcyqapejg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aHRweWVldnRmd2N5cWFwZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODQzMjIsImV4cCI6MjEwNjI2MDMyMn0.p72pK2r4647OyqA8ZwGhU9rrErX2D4BRYvc7IPeWdCg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseEquipamento {
  id: string; // algum-id-unico-e-estavel
  nome: string;
  tag?: string;
  area: string;
  criticidade: 'Alta' | 'Média' | 'Baixa' | string;
  tipo_intervencao?: string;
  periodicidade_dias: number;
  ultima_intervencao: string | null; // AAAA-MM-DD ou null
  notas?: string;
  [key: string]: any;
}

/**
 * Converte um ativo interno da IndusMaint no modelo de equipamento esperado pelo Supabase.
 */
export function mapAssetToSupabaseEquipamento(asset: Asset): SupabaseEquipamento {
  // Converte criticidade A -> Alta, B -> Média, C -> Baixa
  let criticidadeStr = 'Alta';
  if (asset.criticality === 'B') criticidadeStr = 'Média';
  else if (asset.criticality === 'C') criticidadeStr = 'Baixa';

  // Área / Setor
  const area = asset.plantArea || asset.sector || 'Vazamento Contínuo';

  // Tipo de intervenção
  const tipo_intervencao =
    asset.nextIntervention?.title ||
    asset.routines?.[0]?.type ||
    'Manutenção Preventiva';

  // Periodicidade em dias
  const periodicidade_dias =
    asset.nextIntervention?.frequencyDays ||
    asset.routines?.[0]?.periodicityDays ||
    30;

  // Data da última intervenção (AAAA-MM-DD ou null)
  let ultima_intervencao: string | null = null;
  if (asset.lastInterventionDate && asset.lastInterventionDate.trim() !== '') {
    ultima_intervencao = toInputDateFormat(asset.lastInterventionDate);
  }

  // Notas / Informação técnica adicional
  const notas =
    asset.history?.[0]?.notes ||
    (asset.manufacturer ? `Fabricante: ${asset.manufacturer} | Serial: ${asset.serialNumber || 'N/A'}` : '');

  return {
    id: asset.id,
    nome: asset.name,
    tag: asset.tag || undefined,
    area,
    criticidade: criticidadeStr,
    tipo_intervencao,
    periodicidade_dias,
    ultima_intervencao,
    notas
  };
}

/**
 * Chamar esta função sempre que um equipamento for criado ou atualizado.
 */
export async function syncEquipamento(equipamento: SupabaseEquipamento | Record<string, any>) {
  try {
    const { error } = await supabase
      .from('equipamentos')
      .upsert({ ...equipamento, updated_at: new Date().toISOString() });
    if (error) {
      console.error('Erro ao sincronizar com o Supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Exceção ao sincronizar com o Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Atalho para mapear e sincronizar um ativo IndusMaint diretamente.
 */
export async function syncAssetToSupabase(asset: Asset) {
  const equipamento = mapAssetToSupabaseEquipamento(asset);
  return await syncEquipamento(equipamento);
}

/**
 * Sincroniza em lote todos os ativos atuais com o Supabase.
 */
export async function syncAllAssetsToSupabase(assets: Asset[]) {
  const promises = assets.map(a => syncAssetToSupabase(a));
  return await Promise.allSettled(promises);
}

/**
 * Para apagar um equipamento da base partilhada quando o apagares localmente.
 */
export async function removerEquipamento(id: string) {
  try {
    const { error } = await supabase.from('equipamentos').delete().eq('id', id);
    if (error) {
      console.error('Erro ao remover do Supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Exceção ao remover do Supabase:', err);
    return { success: false, error: err };
  }
}
