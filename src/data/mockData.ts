import { Asset, Technician } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'vc-ladle-turret',
    tag: 'TOR-PAN-01',
    name: 'Torre Giratória de Panela (Ladle Turret 140t)',
    sector: 'Vazamento Contínuo • Área de Vazamento',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.4',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqy2Igz1OblRiib5zBxQUVl_b7CmtGj_eZpRxU3Ll51xwiSlj6AnTlk0P3wI4XgyPYSBI8KdEtEv98gi4WtVf-Bkpq1B2a3cKfZvYwxTP5ffADy3UR5Xo6A3v-hcTCEo-c3JbjNpeaM_cXs77W3oxuJazhb90KkVNedXlN6tx9jGpU1hEH2NWL_OEIzohSLNh04pn5BqceXTpcCM0tpjPROSaFEt8Jf1E-UAKnkKZdDtq1OwIpndWF',
    manufacturer: 'SMS Concast AG / SMS Siemag',
    serialNumber: 'SMS-CONC-LT140-01',
    lastInterventionDate: '28/Mai/2026',
    nextIntervention: {
      frequencyLabel: 'Semestral (180 Dias)',
      frequencyDays: 180,
      title: 'Inspeção por Ultrassons do Rolamento de Giro (Slewing Ring) e Células de Carga',
      dueDate: '24/Nov/2026',
      daysRemaining: 57,
      assignedTech: 'Engª Mariana Silva Sequeira'
    },
    routines: [
      {
        id: 'r-tur-01',
        code: 'NDT-01',
        type: 'Inspeção',
        title: 'Ensaios Não Destrutivos por Ultrassons (Slewing Ring)',
        description: 'Varrimento volumétrico dos dentes da coroa e parafusos pré-tensionados M36 de fixação à base civil',
        periodicityLabel: 'Semestral (180 Dias)',
        periodicityDays: 180,
        toleranceOrSpec: 'Norma ISO 9712 Nível 2 / Ausência de microtrincas',
        standardInstrumentOrPart: 'Aparelho de Ultrassons Olympus Epoch 650',
        instructions: [
          'Limpeza desengordurante do anel periférico e dentes de engrenamento.',
          'Calibração de ganho sobre bloco de referência V1/V2.',
          'Varrimento a 45° e 70° nos dentes da coroa e furos roscados.'
        ]
      },
      {
        id: 'r-tur-02',
        code: 'CAL-05',
        type: 'Calibração',
        title: 'Calibração de Células de Carga da Panela',
        description: 'Verificação dos sensores de pesagem contínua para controlo de tonelagem no vazamento',
        periodicityLabel: 'Trimestral (90 Dias)',
        periodicityDays: 90,
        toleranceOrSpec: 'Erro máximo admissível ± 0.15% FE',
        standardInstrumentOrPart: 'Calibrador HBM Digital e pesos-padrão certificados',
        instructions: [
          'Verificar desvio de zero com braços da torre descarregados.',
          'Aplicar carga de teste calibrada e ajustar linearidade no PLC Siemens S7-1500.'
        ]
      },
      {
        id: 'r-tur-03',
        code: 'LUB-01',
        type: 'Lubrificação',
        title: 'Engraxamento Centralizado dos Rolamentos e Acionamento de Giro',
        description: 'Injeção de massa de extrema pressão com bissulfeto de molibdénio no rolamento de rotação',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Graxa de Complexo de Lítio NLGI 2 com MoS2',
        standardInstrumentOrPart: 'Mobilgrease XHP 222 Special',
        instructions: [
          'Fazer rotação lenta da torre de 360° durante o ciclo de engraxamento.',
          'Confirmar purga limpa pelos vedantes labiais de contenção.'
        ]
      }
    ],
    history: [
      {
        id: 'h-tur-01',
        title: 'Inspeção NDT Semestral do Anel de Giro Concluída',
        date: '28/Mai/2026',
        notes: 'Varrimento volumétrico efetuado a 100% da coroa. Ausência de descontinuidades superficiais ou fadiga nos parafusos M36 classe 10.9.',
        technicianName: 'Engª Mariana Silva Sequeira',
        technicianRole: 'Engenheira de Manutenção e Confiabilidade',
        technicianReg: 'ENG-8841',
        verified: true
      }
    ]
  },
  {
    id: 'vc-tundish-car',
    tag: 'CAR-REP-01',
    name: 'Carro de Transporte do Repartidor (Tundish Car 1)',
    sector: 'Vazamento Contínuo • Distribuição',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwKgKS98I9S82uaXJ9ShC6qTa_4nt3-FWEf-i1l0wqgoRbL8ptrLdVGBiQsD_gJ1HRpHaT1R_KOvy5FKv5Zjsk0gRM4QNHNA1S1sQgFKUJ-TssSxssOfuboN3nGbfhkK1r-42N9l2gugDTuYEcJ8pLrDeeItVE-jfMaVonGgAOxYHqjIHZTUgr00E4RbBYyP_VvuNm07krWHtx1pg9SwHgsRhXK-tdgUEvukjiCS6tZkiqLjCH3_w',
    manufacturer: 'SMS Concast Standard',
    serialNumber: 'CONC-CAR-TUND-441',
    lastInterventionDate: '12/Ago/2026',
    nextIntervention: {
      frequencyLabel: 'Trimestral (90 Dias)',
      frequencyDays: 90,
      title: 'Revisão dos Cilindros Hidráulicos de Elevação e Freios de Translação',
      dueDate: '10/Nov/2026',
      daysRemaining: 43,
      assignedTech: 'Rui Miguel Baptista'
    },
    routines: [
      {
        id: 'r-car-01',
        code: 'FIL-02',
        type: 'Substituição',
        title: 'Revisão de Vedações dos Cilindros de Elevação',
        description: 'Substituição dos anéis raspadores e vedantes Viton resistentes ao calor radiante do distribuidor',
        periodicityLabel: 'Trimestral (90 Dias)',
        periodicityDays: 90,
        toleranceOrSpec: 'Kit de Vedações FKM Viton DIN ISO 1629',
        standardInstrumentOrPart: 'Kit Parker Seals FKM-CIL125',
        instructions: [
          'Despressurizar linha piloto do bloco de comando hidráulico.',
          'Extrair hastes sob calços mecânicos de segurança certificados.',
          'Substituir guarnições e testar pressurização estática a 210 bar.'
        ]
      },
      {
        id: 'r-car-02',
        code: 'ALN-03',
        type: 'Alinhamento',
        title: 'Alinhamento de Eixos e Rodas de Translação sobre Carris',
        description: 'Controlo de bitola, paralelismo e desgaste das pestanas das rodas do carro do repartidor',
        periodicityLabel: 'Semestral (180 Dias)',
        periodicityDays: 180,
        toleranceOrSpec: 'Desvio máximo de bitola ± 1.5 mm',
        standardInstrumentOrPart: 'Calibre de Linha e Nível Ótico Leica Geosystems',
        instructions: [
          'Medir bitola nos 4 pontos extremos da via de rolamento.',
          'Inspecionar ausência de desgaste assimétrico nas rodas motrizes.'
        ]
      }
    ],
    history: [
      {
        id: 'h-car-01',
        title: 'Troca de pastilhas de travão do motor de translação',
        date: '12/Ago/2026',
        notes: 'Substituídas as sapatas de travão eletromecânico e regulado o entreferro para 0.40 mm.',
        technicianName: 'Rui Miguel Baptista',
        technicianRole: 'Técnico de Manutenção Hidráulica',
        technicianReg: 'TR-3920',
        verified: true
      }
    ]
  },
  {
    id: 'vc-tundish-body',
    tag: 'REP-DIS-01',
    name: 'Repartidor de Aço Líquido e Sistema de Válvula Gaveta',
    sector: 'Vazamento Contínuo • Distribuição',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Em Alerta',
    statusLabel: 'Alerta 4d',
    revCode: 'REV: 2024.3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmqagdctK-N4TjSeN6Cz_DEs6Rwgcf9K99OdDHIiyqb3gF3wepexqbMef4lBFuhCWdaWKdFKQh_SYSnWCXwvvHR_EweSy8J9Nbhk0yCTbFXPTyYOi5YnOmSZlMGL0qDUj1qvZncMl5V7hcDrA9ygezNg4uefjeRkd_s6UPENRVQdrbOWXBq4RTfsKi2eHP5zuUC-gSTqLe6AD_2QvrTiUsCfnDH55zYGAMbydQ_UtcNdb9UOjG7zHf',
    manufacturer: 'SMS Concast / Vesuvius Industrial',
    serialNumber: 'TUND-VES-882',
    lastInterventionDate: '25/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Semanal (7 Dias)',
      frequencyDays: 7,
      title: 'Substituição das Placas Refratárias da Gaveta e Verificação do Tampão Monobloco',
      dueDate: '02/Out/2026',
      daysRemaining: 4,
      assignedTech: 'Carlos Fernandes'
    },
    routines: [
      {
        id: 'r-rep-01',
        code: 'MEC-01',
        type: 'Substituição',
        title: 'Substituição de Placas Refratárias da Gaveta',
        description: 'Desmontagem e montagem de placas cerâmicas de zircónia/alumina com graxa refratária de grafite',
        periodicityLabel: 'Semanal (7 Dias)',
        periodicityDays: 7,
        toleranceOrSpec: 'Pré-carga das molas da gaveta: 35 kN',
        standardInstrumentOrPart: 'Kit Refratário Vesuvius 2-Plate System',
        instructions: [
          'Verificar estanquicidade ótica da abertura dos orifícios.',
          'Aplicar torque de aperto calibrado nos parafusos de fecho rápido.'
        ]
      },
      {
        id: 'r-rep-02',
        code: 'CAL-02',
        type: 'Calibração',
        title: 'Aferição do Mecanismo de Controlo do Tampão Monobloco',
        description: 'Teste de curso e histerese do atuador eletromecânico de dosagem de caudal de aço',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Curso nominal 65 mm / Resposta linear < 150 ms',
        standardInstrumentOrPart: 'Transdutor LVDT e Indicador Digital',
        instructions: [
          'Comandar curso completo manual no painel de comando local.',
          'Verificar ausência de folgas nos tirantes articulados de fixação.'
        ]
      }
    ],
    history: [
      {
        id: 'h-rep-01',
        title: 'Substituição de tubeira submersa e anéis refratários',
        date: '25/Set/2026',
        notes: 'Troca preventiva concluída antes do início da nova campanha de vazamento contínuo.',
        technicianName: 'Carlos Fernandes',
        technicianRole: 'Especialista Mecânico SMS Concast',
        technicianReg: 'TR-4891',
        verified: true
      }
    ]
  },
  {
    id: 'vc-convex-mould',
    tag: 'MOL-CON-01',
    name: 'Tubo de Molde de Cobre com Cristalizador CONVEX (Linha 1)',
    sector: 'Vazamento Contínuo • Cristalização',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYFEvdUS5Hk3Cx2FigTGxq7tTLyZPyJzXqXq52kVnxrwGQ6XtR4KLpIKn80C8iR0YwX4-fo2kmVgj05LK-dX460JpoUfN89G91_62ncrn6VfUZ2t1eNJB-kugAcMki0OfeeyBrfMfLA-6STacoaFIyDIv3j4zFz_d8AzPYTuccccmETdzZX8GtYeMRq0lC2Eh5M9nTiNc1XJcPHW2OuYvCTV8awLnvzXP6raPK1i4aUzyj2k7Zo_S',
    manufacturer: 'SMS Concast CONVEX Technology',
    serialNumber: 'MOLD-CVX-150-01',
    lastInterventionDate: '01/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Mensal (30 Dias)',
      frequencyDays: 30,
      title: 'Medição de Desgaste e Conicidade do Tubo de Cobre com Relógio Comparador',
      dueDate: '01/Out/2026',
      daysRemaining: 3,
      assignedTech: 'Carlos Fernandes'
    },
    routines: [
      {
        id: 'r-mol-01',
        code: 'INS-01',
        type: 'Inspeção',
        title: 'Medição Dimensional de Conicidade e Desgaste Interno',
        description: 'Mapeamento tridimensional das quatro faces internas do tubo de cobre CuCrZr cromado',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Conicidade teórica 0.85%/m, desgaste máximo 0.35 mm',
        standardInstrumentOrPart: 'Gabarito Micrométrico Especial SMS CONVEX',
        instructions: [
          'Efetuar medições nas cotas 100mm, 350mm e 650mm a contar do bordo superior.',
          'Registar valores na ficha de vida útil do molde antes de libertar para produção.'
        ]
      },
      {
        id: 'r-mol-02',
        code: 'INS-02',
        type: 'Inspeção',
        title: 'Inspeção do Canal de Água de Refrigeração Primária',
        description: 'Controlo de caudal de água desmineralizada (mínimo 1850 L/min) e diferencial de pressão',
        periodicityLabel: 'Semanal (7 Dias)',
        periodicityDays: 7,
        toleranceOrSpec: 'Delta-P entre 6.5 e 7.2 bar / Ausência de incrustações',
        standardInstrumentOrPart: 'Caudalímetro Eletromagnético Krohne',
        instructions: [
          'Inspecionar filtros de rede na entrada da camisa de refrigeração primária.',
          'Confirmar delta-T de temperatura inferior a 5.0°C com simulação de fluxo nominal.'
        ]
      }
    ],
    history: [
      {
        id: 'h-mol-01',
        title: 'Verificação dimensional de conicidade pós-campanha',
        date: '01/Set/2026',
        notes: 'Desgaste médio na zona de menisco de 0.12 mm. Conformidade mantida para mais 250 corridas.',
        technicianName: 'Carlos Fernandes',
        technicianRole: 'Especialista Mecânico SMS Concast',
        technicianReg: 'TR-4891',
        verified: true
      }
    ]
  },
  {
    id: 'vc-hydraulic-oscillator',
    tag: 'OSC-HYD-01',
    name: 'Oscilador Hidráulico de Molde com Servoválvula Moog',
    sector: 'Vazamento Contínuo • Oscilação',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'PLANO EM DIA (14 DIAS)',
    revCode: 'REV: 2024.3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiMQOYcOiYZ3zOIUd16s5DpiZnepp2AWEHjFz2Ot86Sn4gIoCr9zMGKeKTOoby2Zvr1FjUO_mqHrO8SXfTKfoM9VgFeiJXAhInQOdHjv5su7yf6EYpa9fGfCeplqJJtV8vkvH3D80BlbYgLKxC6YG5hFndoo-bAfFLtY4JLhE4Z60WRVy7l0QBzEXnyKTBCuBoiWU92ZkNDcnQJ6poq2_E1wOn8caQzXdoC5b_h-KQmqokEUgjZEOm',
    manufacturer: 'SMS Group / Concast AG / Moog',
    serialNumber: 'SMS-CONC-OSC-892',
    lastInterventionDate: '15/Out/2026',
    nextIntervention: {
      frequencyLabel: 'A cada 30 dias',
      frequencyDays: 30,
      title: 'Verificação de Servoválvula Moog e Folgas de Guiamento por Lâminas',
      dueDate: '15/Nov/2026',
      daysRemaining: 14,
      assignedTech: 'Carlos Fernandes'
    },
    routines: [
      {
        id: 'r-cal-01',
        code: 'CAL-01',
        type: 'Calibração',
        title: 'Calibração de Servoválvulas Moog D661',
        description: 'Válvula proporcional de alta dinâmica e transdutor LVDT de curso e aceleração da mesa oscilante',
        periodicityLabel: '90 dias',
        periodicityDays: 90,
        toleranceOrSpec: 'Folga mecânica de guiamento ± 0.03 mm / Histerese < 0.8%',
        standardInstrumentOrPart: 'Transdutor Padrão Heidenhain e Caixa de Teste Moog',
        instructions: [
          'Verificar curva senoidal e resposta em frequência de 0 a 400 cpm com analisador.',
          'Confirmar estanquicidade estática nos blocos hidráulicos sob 210 bar.'
        ]
      },
      {
        id: 'r-mec-04',
        code: 'MEC-04',
        type: 'Substituição',
        title: 'Substituição de Molas de Lâmina e Anéis Raspadores',
        description: 'Pacote de lâminas de guiamento transversal e retentores de alta temperatura',
        periodicityLabel: 'Bienal (730 Dias)',
        periodicityDays: 730,
        toleranceOrSpec: 'Kit de lâminas DIN 17222 sob pré-tensão calibrada',
        standardInstrumentOrPart: 'Almoxarifado Geral SMS Concast',
        instructions: [
          'Limpeza profunda dos apoios com desengordurante biodegradável.',
          'Montar e aplicar aperto cruzado com torquímetro calibrado a 420 Nm.'
        ]
      }
    ],
    history: [
      {
        id: 'h-osc-01',
        title: 'Calibração de Curso e Alinhamento Concluída',
        date: '15/Out/2026',
        notes: 'Verificado curso oscilatório de 6.0 mm a 180 cpm. Folga de guiamento mantida em 0.025 mm.',
        technicianName: 'Carlos Fernandes',
        technicianRole: 'Especialista Mecânico SMS Concast',
        technicianReg: 'TR-4891',
        verified: true
      }
    ]
  },
  {
    id: 'vc-constir-ems',
    tag: 'EMS-CST-01',
    name: 'Agitador Eletromagnético de Molde (CONSTIR EMS)',
    sector: 'Vazamento Contínuo • Metalurgia de Molde',
    plantArea: 'SN Seixal',
    criticality: 'B',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmqagdctK-N4TjSeN6Cz_DEs6Rwgcf9K99OdDHIiyqb3gF3wepexqbMef4lBFuhCWdaWKdFKQh_SYSnWCXwvvHR_EweSy8J9Nbhk0yCTbFXPTyYOi5YnOmSZlMGL0qDUj1qvZncMl5V7hcDrA9ygezNg4uefjeRkd_s6UPENRVQdrbOWXBq4RTfsKi2eHP5zuUC-gSTqLe6AD_2QvrTiUsCfnDH55zYGAMbydQ_UtcNdb9UOjG7zHf',
    manufacturer: 'SMS Concast CONSTIR',
    serialNumber: 'CONSTIR-EMS-400A',
    lastInterventionDate: '06/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Trimestral (90 Dias)',
      frequencyDays: 90,
      title: 'Medição de Isolamento Ôhmico das Bobinas e Caudal de Refrigeração',
      dueDate: '05/Dez/2026',
      daysRemaining: 68,
      assignedTech: 'Manuel Silveira'
    },
    routines: [
      {
        id: 'r-ems-01',
        code: 'ELE-01',
        type: 'Inspeção',
        title: 'Ensaio de Resistência de Isolamento (Megger)',
        description: 'Medição da resistência de isolamento das bobinas magnéticas contra massa sob 1000V DC',
        periodicityLabel: 'Trimestral (90 Dias)',
        periodicityDays: 90,
        toleranceOrSpec: 'Resistência mínima admissível > 50 MΩ',
        standardInstrumentOrPart: 'Megóhmetro Fluke 1507',
        instructions: [
          'Desligar e bloquear disjuntor de força no CCM do vazamento contínuo.',
          'Aplicar 1000V DC durante 60 segundos em cada uma das 3 fases.'
        ]
      }
    ],
    history: [
      {
        id: 'h-ems-01',
        title: 'Medição de isolamento e caudal de água desmineralizada',
        date: '06/Set/2026',
        notes: 'Resistência de isolamento medida em 180 MΩ. Caudal de água estável a 120 L/min por fase.',
        technicianName: 'Manuel Silveira',
        technicianRole: 'Inspetor de Alinhamento e Vibrações',
        technicianReg: 'TR-5012',
        verified: true
      }
    ]
  },
  {
    id: 'vc-congauge-sensor',
    tag: 'RAD-NIV-01',
    name: 'Sensor Radiométrico de Nível de Aço CONGAUGE LB 6755',
    sector: 'Vazamento Contínuo • Automação & Instrumentação',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqy2Igz1OblRiib5zBxQUVl_b7CmtGj_eZpRxU3Ll51xwiSlj6AnTlk0P3wI4XgyPYSBI8KdEtEv98gi4WtVf-Bkpq1B2a3cKfZvYwxTP5ffADy3UR5Xo6A3v-hcTCEo-c3JbjNpeaM_cXs77W3oxuJazhb90KkVNedXlN6tx9jGpU1hEH2NWL_OEIzohSLNh04pn5BqceXTpcCM0tpjPROSaFEt8Jf1E-UAKnkKZdDtq1OwIpndWF',
    manufacturer: 'Berthold Technologies / SMS Concast',
    serialNumber: 'BER-LB6755-901',
    lastInterventionDate: '20/Jun/2026',
    nextIntervention: {
      frequencyLabel: 'Semestral (180 Dias)',
      frequencyDays: 180,
      title: 'Aferição e Teste Radiológico da Fonte Co-60 e Cintilador CsI',
      dueDate: '17/Dez/2026',
      daysRemaining: 80,
      assignedTech: 'Engª Mariana Silva Sequeira'
    },
    routines: [
      {
        id: 'r-rad-01',
        code: 'CAL-03',
        type: 'Calibração',
        title: 'Verificação Radiológica e Calibração de Nível de Menisco',
        description: 'Teste do obturador pneumático de segurança da fonte e calibração de zero/span do detetor',
        periodicityLabel: 'Semestral (180 Dias)',
        periodicityDays: 180,
        toleranceOrSpec: 'Precisão de leitura de menisco ± 1.0 mm sob vazamento',
        standardInstrumentOrPart: 'Radiômetro Certificado Berthold LB 123',
        instructions: [
          'Verificar fechamento automático do obturador por perda de ar ou corte de emergência.',
          'Executar curva de contagens com haste calibrada de absorção.'
        ]
      }
    ],
    history: [
      {
        id: 'h-rad-01',
        title: 'Certificação radiológica periódica',
        date: '20/Jun/2026',
        notes: 'Obturador de segurança e detector certificados sem anomalias de dosimetria.',
        technicianName: 'Engª Mariana Silva Sequeira',
        technicianRole: 'Engenheira de Manutenção e Confiabilidade',
        technicianReg: 'ENG-8841',
        verified: true
      }
    ]
  },
  {
    id: 'vc-spray-segment-0',
    tag: 'SEG-GUI-01',
    name: 'Segmento 0 de Guiamento de Rolos de Pé e Aspersão Secundária',
    sector: 'Vazamento Contínuo • Arrefecimento Secundário',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Pendente',
    statusLabel: 'Pendente (-1d)',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmqagdctK-N4TjSeN6Cz_DEs6Rwgcf9K99OdDHIiyqb3gF3wepexqbMef4lBFuhCWdaWKdFKQh_SYSnWCXwvvHR_EweSy8J9Nbhk0yCTbFXPTyYOi5YnOmSZlMGL0qDUj1qvZncMl5V7hcDrA9ygezNg4uefjeRkd_s6UPENRVQdrbOWXBq4RTfsKi2eHP5zuUC-gSTqLe6AD_2QvrTiUsCfnDH55zYGAMbydQ_UtcNdb9UOjG7zHf',
    manufacturer: 'SMS Concast AG',
    serialNumber: 'SEG0-FOOT-992',
    lastInterventionDate: '20/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Semanal (7 Dias)',
      frequencyDays: 7,
      title: 'Desobstrução e Alinhamento dos Bicos de Spray Lechler e Medição de Folgas',
      dueDate: '27/Set/2026',
      daysRemaining: -1,
      assignedTech: 'Rui Miguel Baptista'
    },
    routines: [
      {
        id: 'r-seg0-01',
        code: 'INS-04',
        type: 'Inspeção',
        title: 'Inspeção de Spray de Arrefecimento Secundário',
        description: 'Desobstrução mecânica de bicos Lechler e verificação do padrão de leque de água/ar',
        periodicityLabel: 'Semanal (7 Dias)',
        periodicityDays: 7,
        toleranceOrSpec: 'Pressão de água 3.5 bar / Pressão de ar 2.0 bar',
        standardInstrumentOrPart: 'Manómetro Aferido e Agulhas de Calibração Lechler',
        instructions: [
          'Ligar bomba de spray em modo manual de purga.',
          'Substituir bicos desgastados ou com leque deformado por cascarilha.'
        ]
      },
      {
        id: 'r-seg0-02',
        code: 'ALN-02',
        type: 'Alinhamento',
        title: 'Alinhamento dos Rolos de Pé com a Saída do Molde',
        description: 'Controlo do gap de abertura e alinhamento do raio de curvatura R=8.0m',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Desvio admissível de alinhamento < 0.15 mm',
        standardInstrumentOrPart: 'Gabarito de Raio SMS Concast R=8.0m',
        instructions: [
          'Fixar gabarito de alinhamento magnético na face inferior do molde.',
          'Ajustar calços dos mancais dos rolos de pé com relógio apalpador.'
        ]
      }
    ],
    history: [
      {
        id: 'h-seg0-01',
        title: 'Substituição preventiva de 6 bicos de aspersão',
        date: '20/Set/2026',
        notes: 'Detectada perda de cone de aspersão na rampa superior. Bicos substituídos por novos modelo Lechler 460.608.',
        technicianName: 'Rui Miguel Baptista',
        technicianRole: 'Técnico de Manutenção Hidráulica',
        technicianReg: 'TR-3920',
        verified: true
      }
    ]
  },
  {
    id: 'vc-guide-segment-1',
    tag: 'SEG-CUR-01',
    name: 'Segmento 1 de Curvatura e Guiamento de Tarugos (Raio 8.0m)',
    sector: 'Vazamento Contínuo • Linha 1',
    plantArea: 'SN Seixal',
    criticality: 'B',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmqagdctK-N4TjSeN6Cz_DEs6Rwgcf9K99OdDHIiyqb3gF3wepexqbMef4lBFuhCWdaWKdFKQh_SYSnWCXwvvHR_EweSy8J9Nbhk0yCTbFXPTyYOi5YnOmSZlMGL0qDUj1qvZncMl5V7hcDrA9ygezNg4uefjeRkd_s6UPENRVQdrbOWXBq4RTfsKi2eHP5zuUC-gSTqLe6AD_2QvrTiUsCfnDH55zYGAMbydQ_UtcNdb9UOjG7zHf',
    manufacturer: 'SMS Concast AG',
    serialNumber: 'SEG1-CURV-331',
    lastInterventionDate: '14/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Mensal (30 Dias)',
      frequencyDays: 30,
      title: 'Verificação de Desgaste dos Rolos Intermédios e Circuito de Lubrificação',
      dueDate: '14/Out/2026',
      daysRemaining: 16,
      assignedTech: 'Carlos Fernandes'
    },
    routines: [
      {
        id: 'r-cur-01',
        code: 'LUB-03',
        type: 'Lubrificação',
        title: 'Inspeção do Distribuidor Progressivo de Graxa dos Rolos',
        description: 'Comprovação de fluxo nos blocos doseadores de graxa para os mancais internos refrigerados',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Pressão da linha principal 120 bar',
        standardInstrumentOrPart: 'Manómetro Lincolnlube',
        instructions: [
          'Acionar ciclo manual de bombeamento de graxa sintética de poliureia.',
          'Confirmar que os pinos indicadores de cada elemento doseador operam livremente.'
        ]
      }
    ],
    history: [
      {
        id: 'h-cur-01',
        title: 'Verificação do sistema de lubrificação e folgas',
        date: '14/Set/2026',
        notes: 'Doseadores operacionais. Folgas radiais dos rolamentos dentro da tolerância de fábrica.',
        technicianName: 'Carlos Fernandes',
        technicianRole: 'Especialista Mecânico SMS Concast',
        technicianReg: 'TR-4891',
        verified: true
      }
    ]
  },
  {
    id: 'vc-extractor-straightener',
    tag: 'EXT-END-01',
    name: 'Extrator-Endireitador de Tarugos (WSU - Linha 1)',
    sector: 'Vazamento Contínuo • Descurvatura',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmqagdctK-N4TjSeN6Cz_DEs6Rwgcf9K99OdDHIiyqb3gF3wepexqbMef4lBFuhCWdaWKdFKQh_SYSnWCXwvvHR_EweSy8J9Nbhk0yCTbFXPTyYOi5YnOmSZlMGL0qDUj1qvZncMl5V7hcDrA9ygezNg4uefjeRkd_s6UPENRVQdrbOWXBq4RTfsKi2eHP5zuUC-gSTqLe6AD_2QvrTiUsCfnDH55zYGAMbydQ_UtcNdb9UOjG7zHf',
    manufacturer: 'SMS Concast AG',
    serialNumber: 'WSU-EXT-END-5502',
    lastInterventionDate: '29/Jul/2026',
    nextIntervention: {
      frequencyLabel: 'Trimestral (90 Dias)',
      frequencyDays: 90,
      title: 'Alinhamento a Laser dos Redutores e Troca de Chumaceiras dos Rolos',
      dueDate: '29/Out/2026',
      daysRemaining: 31,
      assignedTech: 'Manuel Silveira'
    },
    routines: [
      {
        id: 'r-ext-01',
        code: 'ALN-01',
        type: 'Alinhamento',
        title: 'Alinhamento a Laser dos Redutores Planetários e Veios',
        description: 'Alinhamento ótico do eixo do motor elétrico ao redutor com acoplamento elástico',
        periodicityLabel: 'Trimestral (90 Dias)',
        periodicityDays: 90,
        toleranceOrSpec: 'Desalinhamento paralelo < 0.04 mm, angular < 0.03 mm/100mm',
        standardInstrumentOrPart: 'EasyLaser E710 / Relógio Comparador Mitutoyo',
        instructions: [
          'Remover proteções mecânicas de segurança e desengatar acoplamento.',
          'Posicionar sensores laser e registar leitura antes e após o reaperto dos parafusos.'
        ]
      },
      {
        id: 'r-ext-02',
        code: 'CAL-04',
        type: 'Calibração',
        title: 'Calibração de Pressão Hidráulica de Aperto dos Rolos de Tração',
        description: 'Ajuste das válvulas proporcionais de comando da força de esmagamento do tarugo',
        periodicityLabel: 'Semestral (180 Dias)',
        periodicityDays: 180,
        toleranceOrSpec: 'Força de aperto 180 kN ± 5 kN',
        standardInstrumentOrPart: 'Célula de Pressão Hidráulica com mostrador digital',
        instructions: [
          'Inserir gabarito de carga entre os rolos superior e inferior.',
          'Verificar se a pressão hidráulica atinge o valor de set-point programado no PLC.'
        ]
      }
    ],
    history: [
      {
        id: 'h-ext-01',
        title: 'Alinhamento a laser e troca de óleo do redutor',
        date: '29/Jul/2026',
        notes: 'Óleo sintético ISO VG 320 substituído. Alinhamento laser dentro dos 0.02 mm.',
        technicianName: 'Manuel Silveira',
        technicianRole: 'Inspetor de Alinhamento e Vibrações',
        technicianReg: 'TR-5012',
        verified: true
      }
    ]
  },
  {
    id: 'vc-dummy-bar',
    tag: 'BAR-FAL-01',
    name: 'Sistema de Falsa Barra Flexível e Carro de Introdução',
    sector: 'Vazamento Contínuo • Arranque de Corrida',
    plantArea: 'SN Seixal',
    criticality: 'B',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwKgKS98I9S82uaXJ9ShC6qTa_4nt3-FWEf-i1l0wqgoRbL8ptrLdVGBiQsD_gJ1HRpHaT1R_KOvy5FKv5Zjsk0gRM4QNHNA1S1sQgFKUJ-TssSxssOfuboN3nGbfhkK1r-42N9l2gugDTuYEcJ8pLrDeeItVE-jfMaVonGgAOxYHqjIHZTUgr00E4RbBYyP_VvuNm07krWHtx1pg9SwHgsRhXK-tdgUEvukjiCS6tZkiqLjCH3_w',
    manufacturer: 'SMS Concast AG',
    serialNumber: 'DUMMY-BAR-FX120',
    lastInterventionDate: '08/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Mensal (30 Dias)',
      frequencyDays: 30,
      title: 'Inspeção dos Elos Articulados, Cavilhas de Tração e Cabeça de Engate',
      dueDate: '08/Out/2026',
      daysRemaining: 10,
      assignedTech: 'Rui Miguel Baptista'
    },
    routines: [
      {
        id: 'r-bar-01',
        code: 'INS-03',
        type: 'Inspeção',
        title: 'Inspeção Dimensional dos Elos e Cavilhas de Articulação',
        description: 'Medição de folga nos pinos de articulação da cadeia flexível de inserção',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Folga máxima acumulada por metro < 2.0 mm',
        standardInstrumentOrPart: 'Paquímetro Digital de 300mm Mitutoyo',
        instructions: [
          'Estender a falsa barra sobre os rolos guia de suporte.',
          'Inspecionar ausência de trincas na cabeça de desengate rápido do tarugo.'
        ]
      }
    ],
    history: [
      {
        id: 'h-bar-01',
        title: 'Revisão das cavilhas de engate da falsa barra',
        date: '08/Set/2026',
        notes: 'Cavilhas lubrificadas com spray de grafite. Engate verificado no teste em vazio.',
        technicianName: 'Rui Miguel Baptista',
        technicianRole: 'Técnico de Manutenção Hidráulica',
        technicianReg: 'TR-3920',
        verified: true
      }
    ]
  },
  {
    id: 'vc-hydraulic-shear',
    tag: 'TES-COR-01',
    name: 'Tesoura Hidráulica de Corte a Quente (Capacidade 450t)',
    sector: 'Vazamento Contínuo • Corte & Dimensionamento',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYFEvdUS5Hk3Cx2FigTGxq7tTLyZPyJzXqXq52kVnxrwGQ6XtR4KLpIKn80C8iR0YwX4-fo2kmVgj05LK-dX460JpoUfN89G91_62ncrn6VfUZ2t1eNJB-kugAcMki0OfeeyBrfMfLA-6STacoaFIyDIv3j4zFz_d8AzPYTuccccmETdzZX8GtYeMRq0lC2Eh5M9nTiNc1XJcPHW2OuYvCTV8awLnvzXP6raPK1i4aUzyj2k7Zo_S',
    manufacturer: 'SMS Concast Hydraulic Shear Unit',
    serialNumber: 'SMS-SHEAR-450T',
    lastInterventionDate: '12/Ago/2026',
    nextIntervention: {
      frequencyLabel: 'Trimestral (90 Dias)',
      frequencyDays: 90,
      title: 'Inversão/Substituição de Facas de Corte em Aço W.Nr 1.2344 e Verificação de Lâminas',
      dueDate: '12/Nov/2026',
      daysRemaining: 45,
      assignedTech: 'João Pinto Alentejano'
    },
    routines: [
      {
        id: 'r-tes-01',
        code: 'MEC-08',
        type: 'Substituição',
        title: 'Substituição e Regulação das Facas Superior e Inferior',
        description: 'Montagem de lâminas temperadas de corte a quente com calços de precisão',
        periodicityLabel: 'Trimestral (90 Dias)',
        periodicityDays: 90,
        toleranceOrSpec: 'Folga de corte entre facas: 0.8 mm ± 0.05 mm',
        standardInstrumentOrPart: 'Aço Ferramenta W.Nr 1.2344 / Chave Dinamométrica Stahlwille',
        instructions: [
          'Bloquear mecanicamente o cilindro de corte no ponto morto superior.',
          'Limpar os assentos das facas e aplicar torque de 650 Nm nos parafusos de fixação.'
        ]
      }
    ],
    history: [
      {
        id: 'h-tes-01',
        title: 'Inversão das arestas de corte das facas',
        date: '12/Ago/2026',
        notes: 'Facas invertidas para a face 2. Folga de corte calibrada em 0.8 mm com lâminas de teste.',
        technicianName: 'João Pinto Alentejano',
        technicianRole: 'Técnico de Operações e Corte',
        technicianReg: 'TR-2911',
        verified: true
      }
    ]
  },
  {
    id: 'vc-runout-table',
    tag: 'MES-SAI-01',
    name: 'Mesa de Rolos de Saída e Enleirador de Tarugos',
    sector: 'Vazamento Contínuo • Evacuação',
    plantArea: 'SN Seixal',
    criticality: 'C',
    status: 'Operacional',
    statusLabel: 'Em Dia (+20d)',
    revCode: 'REV: 2024.1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYFEvdUS5Hk3Cx2FigTGxq7tTLyZPyJzXqXq52kVnxrwGQ6XtR4KLpIKn80C8iR0YwX4-fo2kmVgj05LK-dX460JpoUfN89G91_62ncrn6VfUZ2t1eNJB-kugAcMki0OfeeyBrfMfLA-6STacoaFIyDIv3j4zFz_d8AzPYTuccccmETdzZX8GtYeMRq0lC2Eh5M9nTiNc1XJcPHW2OuYvCTV8awLnvzXP6raPK1i4aUzyj2k7Zo_S',
    manufacturer: 'SMS Concast Standard',
    serialNumber: 'RUNOUT-ROL-771',
    lastInterventionDate: '18/Set/2026',
    nextIntervention: {
      frequencyLabel: 'Mensal (30 Dias)',
      frequencyDays: 30,
      title: 'Alinhamento dos Rolos Motorizados e Lubrificação dos Mancais',
      dueDate: '18/Out/2026',
      daysRemaining: 20,
      assignedTech: 'Abílio Duarte'
    },
    routines: [
      {
        id: 'r-sai-01',
        code: 'LUB-04',
        type: 'Lubrificação',
        title: 'Lubrificação e Limpeza de Cascarilha dos Rolos de Saída',
        description: 'Reabastecimento de graxa nos mancais SKF SNL e purga de depósitos de óxidos de laminação',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Graxa sintética NLGI 2 para alta temperatura',
        standardInstrumentOrPart: 'SKF LGHB 2',
        instructions: [
          'Remover chapas de proteção e raspar acúmulo de cascarilha quente.',
          'Bombear 30g de graxa por mancal até notar saída pelo labirinto de vedação.'
        ]
      }
    ],
    history: [
      {
        id: 'h-sai-01',
        title: 'Manutenção periódica da mesa de rolos',
        date: '18/Set/2026',
        notes: 'Mancais lubrificados e correntes de transmissão verificadas com folga correta.',
        technicianName: 'Abílio Duarte',
        technicianRole: 'Eletromecânico de Vazamento Contínuo',
        technicianReg: 'TR-6140',
        verified: true
      }
    ]
  },
  {
    id: 'vc-cooling-bed',
    tag: 'LEI-ARF-01',
    name: 'Leito de Arrefecimento de Vigas Móveis e Empurrador de Tarugos',
    sector: 'Vazamento Contínuo • Arrefecimento Final',
    plantArea: 'SN Seixal',
    criticality: 'B',
    status: 'Operacional',
    statusLabel: 'Em Dia (+52d)',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqy2Igz1OblRiib5zBxQUVl_b7CmtGj_eZpRxU3Ll51xwiSlj6AnTlk0P3wI4XgyPYSBI8KdEtEv98gi4WtVf-Bkpq1B2a3cKfZvYwxTP5ffADy3UR5Xo6A3v-hcTCEo-c3JbjNpeaM_cXs77W3oxuJazhb90KkVNedXlN6tx9jGpU1hEH2NWL_OEIzohSLNh04pn5BqceXTpcCM0tpjPROSaFEt8Jf1E-UAKnkKZdDtq1OwIpndWF',
    manufacturer: 'SMS Group / Concast',
    serialNumber: 'WBEAM-BED-140',
    lastInterventionDate: '23/Mai/2026',
    nextIntervention: {
      frequencyLabel: 'Semestral (180 Dias)',
      frequencyDays: 180,
      title: 'Verificação de Desgaste dos Dentes das Vigas Móveis e Guias de Deslizamento',
      dueDate: '19/Nov/2026',
      daysRemaining: 52,
      assignedTech: 'Abílio Duarte'
    },
    routines: [
      {
        id: 'r-lei-01',
        code: 'INS-05',
        type: 'Inspeção',
        title: 'Verificação de Nivelamento e Passo das Vigas Móveis',
        description: 'Controlo de retilineidade dos dentes entalhados para garantir que os tarugos arrefecem sem empeno',
        periodicityLabel: 'Semestral (180 Dias)',
        periodicityDays: 180,
        toleranceOrSpec: 'Nivelamento entre dentes adjacentes < 1.0 mm',
        standardInstrumentOrPart: 'Nível Ótico e Régua Retificada de 3m',
        instructions: [
          'Ciclar as vigas móveis em modo passo-a-passo manual.',
          'Verificar se os tarugos assentam uniformemente em todo o comprimento de 12 metros.'
        ]
      }
    ],
    history: [
      {
        id: 'h-lei-01',
        title: 'Nivelamento e ajuste dos excêntricos de elevação',
        date: '23/Mai/2026',
        notes: 'Nivelamento corrigido com calços de latão nos suportes de articulação.',
        technicianName: 'Abílio Duarte',
        technicianRole: 'Eletromecânico de Vazamento Contínuo',
        technicianReg: 'TR-6140',
        verified: true
      }
    ]
  },
  {
    id: 'vc-main-hpu',
    tag: 'HPU-CON-01',
    name: 'Central Hidráulica Principal 210 bar (Fluido HFC Incombustível)',
    sector: 'Vazamento Contínuo • Potência de Fluidos',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Operacional',
    revCode: 'REV: 2024.3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiMQOYcOiYZ3zOIUd16s5DpiZnepp2AWEHjFz2Ot86Sn4gIoCr9zMGKeKTOoby2Zvr1FjUO_mqHrO8SXfTKfoM9VgFeiJXAhInQOdHjv5su7yf6EYpa9fGfCeplqJJtV8vkvH3D80BlbYgLKxC6YG5hFndoo-bAfFLtY4JLhE4Z60WRVy7l0QBzEXnyKTBCuBoiWU92ZkNDcnQJ6poq2_E1wOn8caQzXdoC5b_h-KQmqokEUgjZEOm',
    manufacturer: 'SMS Concast / Bosch Rexroth / Hydac',
    serialNumber: 'HPU-210BAR-HFC-03',
    lastInterventionDate: '12/Jul/2026',
    nextIntervention: {
      frequencyLabel: 'Trimestral (90 Dias)',
      frequencyDays: 90,
      title: 'Análise Espectrométrica de Fluido HFC, Troca de Filtros 3µm e Purga de Acumuladores',
      dueDate: '10/Out/2026',
      daysRemaining: 12,
      assignedTech: 'Rui Miguel Baptista'
    },
    routines: [
      {
        id: 'r-hpu-01',
        code: 'FIL-01',
        type: 'Substituição',
        title: 'Substituição dos Elementos Filtrantes de Pressão e Retorno',
        description: 'Troca de cartuchos absolutos de microfibra de vidro inorgânica beta >= 200',
        periodicityLabel: 'Trimestral (90 Dias)',
        periodicityDays: 90,
        toleranceOrSpec: 'Grau de filtração 3 µm absoluto / Classe ISO 4406: 16/14/11',
        standardInstrumentOrPart: 'Cartuchos Hydac 0330D003BN4HC',
        instructions: [
          'Comutar para o filtro duplo de reserva antes da substituição.',
          'Sangrar o ar do corpo do filtro após a montagem do novo elemento.'
        ]
      },
      {
        id: 'r-hpu-02',
        code: 'INS-06',
        type: 'Inspeção',
        title: 'Verificação da Pré-Carga de Azoto dos Acumuladores de Bexiga',
        description: 'Medição da pressão de N2 nos 6 acumuladores de 50L da linha de corte e oscilação',
        periodicityLabel: 'Semestral (180 Dias)',
        periodicityDays: 180,
        toleranceOrSpec: 'Pressão nominal de pré-carga: 140 bar ± 5 bar',
        standardInstrumentOrPart: 'Kit de Carga e Teste Hydac FPU-1-250',
        instructions: [
          'Despressurizar o lado hidráulico até zero bar comprovado no manômetro.',
          'Acoplar kit FPU e calibrar se necessário com garrafa de azoto a 200 bar.'
        ]
      }
    ],
    history: [
      {
        id: 'h-hpu-01',
        title: 'Análise laboratorial de fluido HFC-46 aprovada',
        date: '12/Jul/2026',
        notes: 'Viscosidade cinemática a 40°C de 45.2 cSt. Contaminação por partículas dentro da norma ISO 16/14/11.',
        technicianName: 'Rui Miguel Baptista',
        technicianRole: 'Técnico de Manutenção Hidráulica',
        technicianReg: 'TR-3920',
        verified: true
      }
    ]
  },
  {
    id: 'vc-mould-pump-station',
    tag: 'BOM-REF-01',
    name: 'Estação de Bombagem de Água do Molde (Circuito Primário Desmineralizado)',
    sector: 'Tratamento de Águas • Refrigeração Primária',
    plantArea: 'SN Seixal',
    criticality: 'A',
    status: 'Operacional',
    statusLabel: 'Em Dia (+27d)',
    revCode: 'REV: 2024.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqy2Igz1OblRiib5zBxQUVl_b7CmtGj_eZpRxU3Ll51xwiSlj6AnTlk0P3wI4XgyPYSBI8KdEtEv98gi4WtVf-Bkpq1B2a3cKfZvYwxTP5ffADy3UR5Xo6A3v-hcTCEo-c3JbjNpeaM_cXs77W3oxuJazhb90KkVNedXlN6tx9jGpU1hEH2NWL_OEIzohSLNh04pn5BqceXTpcCM0tpjPROSaFEt8Jf1E-UAKnkKZdDtq1OwIpndWF',
    manufacturer: 'KSB / SMS Concast Integration',
    serialNumber: 'KSB-ETA-200-400',
    lastInterventionDate: '27/Jul/2026',
    nextIntervention: {
      frequencyLabel: 'Trimestral (90 Dias)',
      frequencyDays: 90,
      title: 'Inspeção de Empanques Mecânicos, Teste de Bomba Reserva e Caudalímetro',
      dueDate: '25/Out/2026',
      daysRemaining: 27,
      assignedTech: 'Manuel Silveira'
    },
    routines: [
      {
        id: 'r-bom-01',
        code: 'VIB-01',
        type: 'Inspeção',
        title: 'Análise de Espectro de Vibração e Temperatura dos Mancais',
        description: 'Medição em 3 eixos (horizontal, vertical, axial) nos mancais da bomba e motor de 160 kW',
        periodicityLabel: 'Mensal (30 Dias)',
        periodicityDays: 30,
        toleranceOrSpec: 'Velocidade RMS global < 2.3 mm/s (Zona A da ISO 10816-3)',
        standardInstrumentOrPart: 'Coletor de Vibrações SKF Microlog dBX',
        instructions: [
          'Fixar acelerómetro com base magnética nos pontos normalizados.',
          'Descarregar espetros FFT no software de monitorização de condição.'
        ]
      }
    ],
    history: [
      {
        id: 'h-bom-01',
        title: 'Ensaio de comutação automática para bomba B',
        date: '27/Jul/2026',
        notes: 'Simulada paragem da bomba principal; comutação automática completada em 1.4s sem queda de pressão no molde.',
        technicianName: 'Manuel Silveira',
        technicianRole: 'Inspetor de Alinhamento e Vibrações',
        technicianReg: 'TR-5012',
        verified: true
      }
    ]
  }
];

export const TECHNICIANS_LIST: Technician[] = [
  { id: 't1', name: 'Carlos Fernandes', role: 'Especialista Mecânico SMS Concast', reg: 'TR-4891' },
  { id: 't2', name: 'Rui Miguel Baptista', role: 'Técnico de Manutenção Hidráulica', reg: 'TR-3920' },
  { id: 't3', name: 'Manuel Silveira', role: 'Inspetor de Alinhamento e Vibrações', reg: 'TR-5012' },
  { id: 't4', name: 'Engª Mariana Silva Sequeira', role: 'Engenheira de Manutenção e Confiabilidade', reg: 'ENG-8841' },
  { id: 't5', name: 'João Pinto Alentejano', role: 'Técnico de Operações e Corte', reg: 'TR-2911' },
  { id: 't6', name: 'Abílio Duarte', role: 'Eletromecânico de Vazamento Contínuo', reg: 'TR-6140' }
];
