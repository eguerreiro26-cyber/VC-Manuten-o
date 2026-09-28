export type Criticality = 'A' | 'B' | 'C';

export type AssetStatus = 'Operacional' | 'Pendente' | 'Em Alerta' | 'Parado';

export interface MaintenanceRoutine {
  id: string;
  code: string;
  type: 'Calibração' | 'Substituição' | 'Lubrificação' | 'Inspeção' | 'Alinhamento';
  title: string;
  description: string;
  periodicityLabel: string; // e.g. "90 dias", "Bienal (730 Dias)", "30 dias"
  periodicityDays: number;
  toleranceOrSpec: string; // e.g. "± 0.2 bar", "Kit KSB-40", "20g por graxeira"
  standardInstrumentOrPart?: string; // e.g. "MAN-CAL-04", "Estoque Almox. Central: 3 un."
  instructions?: string[];
}

export interface MaintenanceRecord {
  id: string;
  title: string;
  date: string;
  notes: string;
  technicianName: string;
  technicianRole?: string;
  technicianReg?: string;
  technicianAvatar?: string;
  verified: boolean;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  sector: string; // e.g. Vazamento Contínuo • Linha 1
  plantArea?: string; // SN Seixal / Concast
  criticality: Criticality;
  status: AssetStatus;
  statusLabel?: string;
  revCode?: string;
  imageUrl: string;
  manufacturer?: string;
  serialNumber?: string;
  commissioningDate?: string;
  horimeter?: number;

  // Next intervention
  nextIntervention: {
    frequencyLabel: string;
    frequencyDays: number;
    title: string;
    dueDate: string;
    daysRemaining: number;
    assignedTech?: string;
  };

  lastInterventionDate?: string;

  // Routines and logs
  routines: MaintenanceRoutine[];
  history: MaintenanceRecord[];
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  reg: string;
}

export type TabType = 
  | 'equipamentos' 
  | 'novo-registo' 
  | 'planos-manutencao' 
  | 'relatorios-exportacao' 
  | 'configuracoes';

