import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { Asset } from '../types';

/**
 * Triggers resilient download of a generated jsPDF document.
 * Works seamlessly across web browsers, iframes, mobile devices, and desktop.
 */
export function downloadPdf(doc: jsPDF, filename: string): void {
  try {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  } catch {
    // Fallback directly to jsPDF save
    doc.save(filename);
  }
}

interface ReportFilterInfo {
  sector: string;
  criticality: string;
  type: string;
  status: string;
  timeframe: string;
}

/**
 * Generates and downloads the comprehensive Industrial Maintenance Technical Report (PDF).
 */
export function generateTechnicalReportPdf(
  assets: Asset[],
  filters?: ReportFilterInfo
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate statistics
  const totalAssets = assets.length;
  const critACount = assets.filter(a => a.criticality === 'A').length;
  const critBCount = assets.filter(a => a.criticality === 'B').length;
  const critCCount = assets.filter(a => a.criticality === 'C').length;

  const expiredCount = assets.filter(
    a => a.nextIntervention.daysRemaining < 0 || a.status === 'Pendente' || a.status === 'Parado'
  ).length;
  const warningCount = assets.filter(
    a => a.nextIntervention.daysRemaining >= 0 && a.nextIntervention.daysRemaining <= 5
  ).length;
  const normalCount = assets.filter(
    a => a.nextIntervention.daysRemaining > 5 && a.status === 'Operacional'
  ).length;

  const totalRoutines = assets.reduce(
    (acc, a) => acc + (a.routines ? a.routines.length : 1),
    0
  );

  // 1. Header Banner (Dark Navy Industrial Theme)
  doc.setFillColor(15, 23, 42); // slate-900 / #0f172a
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent line
  doc.setFillColor(37, 99, 235); // blue-600 / #2563eb
  doc.rect(0, 26, pageWidth, 2, 'F');

  // Title & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('INDUSMAINT CMMS • RELATÓRIO TÉCNICO DE GESTÃO DE ATIVOS', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(195, 205, 235);
  doc.text(
    'SISTEMA INTEGRADO DE MANUTENÇÃO INDUSTRIAL • AUDITORIA ISO 55001 / EN 13306 / NR-12',
    14,
    18
  );

  // Date & Badge on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`EMISSÃO: ${dateStr} ${timeStr}`, pageWidth - 14, 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(147, 197, 253);
  doc.text(`REGISTO OFICIAL DE AUDITORIA`, pageWidth - 14, 18, { align: 'right' });

  // 2. Filter & Parameter Summary Row
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(14, 32, pageWidth - 28, 14, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 32, pageWidth - 28, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('FILTROS APLICADOS:', 18, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const filterText = `Setor: ${filters?.sector || 'Todos'}  |  Criticidade: ${
    filters?.criticality || 'Todas'
  }  |  Tipo de Plano: ${filters?.type || 'Todas'}  |  Status: ${
    filters?.status || 'Todos'
  }  |  Janela: ${filters?.timeframe || 'Geral'}`;
  doc.text(filterText, 52, 38);

  const kpiSummary = `Ativos Selecionados: ${totalAssets}   |   Rotinas Monitorizadas: ${totalRoutines}   |   Emitido por: Operação CMMS`;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(kpiSummary, 18, 43);

  // 3. KPI Metric Badges
  const kpiY = 49;
  const kpiBoxWidth = (pageWidth - 28 - 12) / 5;
  const kpis = [
    { label: 'TOTAL ATIVOS', val: `${totalAssets}`, color: [30, 58, 138], bg: [239, 246, 255] },
    { label: 'CRÍTICOS CLASSE A', val: `${critACount}`, color: [185, 28, 28], bg: [254, 242, 242] },
    { label: 'VENCIDAS / PENDENTES', val: `${expiredCount}`, color: [180, 83, 9], bg: [254, 243, 199] },
    { label: 'EXPIRAM EM < 5 DIAS', val: `${warningCount}`, color: [217, 119, 6], bg: [255, 251, 235] },
    { label: 'CONFORMES / NO PRAZO', val: `${normalCount}`, color: [21, 128, 61], bg: [240, 253, 244] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (kpiBoxWidth + 3);
    doc.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    doc.roundedRect(x, kpiY, kpiBoxWidth, 13, 1.5, 1.5, 'F');
    doc.setDrawColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiY, kpiBoxWidth, 13, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.label, x + kpiBoxWidth / 2, kpiY + 4.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(kpi.val, x + kpiBoxWidth / 2, kpiY + 10.5, { align: 'center' });
  });

  // 4. Main Assets Table
  const tableData = assets.map(a => {
    const rem = a.nextIntervention.daysRemaining;
    let remStr = `${rem} dias`;
    if (rem < 0) {
      remStr = `VENCIDO (${Math.abs(rem)}d)`;
    } else if (rem === 0) {
      remStr = `HOJE`;
    }

    const freqDays = a.nextIntervention.frequencyDays || 30;
    const vidaUtilPct = Math.max(0, Math.min(100, Math.round((Math.max(0, rem) / freqDays) * 100)));

    return [
      a.tag,
      a.name,
      a.sector,
      a.criticality,
      a.nextIntervention.title,
      a.nextIntervention.frequencyLabel,
      a.nextIntervention.dueDate,
      remStr,
      `${vidaUtilPct}%`,
      a.status
    ];
  });

  const tableOptions: UserOptions = {
    startY: 65,
    margin: { left: 14, right: 14, bottom: 20 },
    head: [[
      'TAG',
      'EQUIPAMENTO',
      'SETOR / LOCALIZAÇÃO',
      'CRIT.',
      'PRÓXIMA INTERVENÇÃO',
      'PERIODICIDADE',
      'DATA LIMITE',
      'PRAZO',
      'VIDA ÚTIL',
      'STATUS'
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 22 },
      1: { cellWidth: 42 },
      2: { cellWidth: 38 },
      3: { halign: 'center', fontStyle: 'bold', cellWidth: 12 },
      4: { cellWidth: 45 },
      5: { halign: 'center', cellWidth: 26 },
      6: { halign: 'center', cellWidth: 20 },
      7: { halign: 'center', fontStyle: 'bold', cellWidth: 24 },
      8: { halign: 'center', cellWidth: 16 },
      9: { halign: 'center', fontStyle: 'bold', cellWidth: 24 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      // Highlight critical A
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'A') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fillColor = [254, 242, 242];
        } else if (data.cell.raw === 'B') {
          data.cell.styles.textColor = [217, 119, 6];
        } else {
          data.cell.styles.textColor = [71, 85, 105];
        }
      }

      // Highlight expired or urgent deadlines
      if (data.section === 'body' && data.column.index === 7) {
        const val = String(data.cell.raw);
        if (val.includes('VENCIDO')) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fillColor = [254, 226, 226];
        } else if (val.includes('HOJE') || val.startsWith('1 ') || val.startsWith('2 ') || val.startsWith('3 ') || val.startsWith('4 ') || val.startsWith('5 ')) {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fillColor = [254, 243, 199];
        } else {
          data.cell.styles.textColor = [22, 101, 52];
        }
      }

      // Highlight Status
      if (data.section === 'body' && data.column.index === 9) {
        const status = String(data.cell.raw);
        if (status === 'Operacional') {
          data.cell.styles.textColor = [22, 101, 52];
        } else if (status === 'Pendente') {
          data.cell.styles.textColor = [194, 65, 12];
        } else if (status === 'Em Alerta' || status === 'Parado') {
          data.cell.styles.textColor = [185, 28, 28];
          data.cell.styles.fillColor = [254, 226, 226];
        }
      }
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);

      // Line above footer
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

      doc.text(
        'INDUSMAINT CMMS • Relatório Técnico de Manutenção Preventiva e Preditiva • Em conformidade com ISO 55001',
        14,
        pageHeight - 7
      );

      doc.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        pageWidth - 14,
        pageHeight - 7,
        { align: 'right' }
      );
    }
  };

  autoTable(doc, tableOptions);

  // Download the generated PDF directly
  const safeDate = now.toISOString().slice(0, 10);
  const filename = `Relatorio_Tecnico_IndusMaint_${safeDate}.pdf`;
  downloadPdf(doc, filename);
}

/**
 * Generates and downloads the comprehensive individual Asset Dossier (PDF).
 */
export function generateAssetDossierPdf(asset: Asset): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(37, 99, 235); // blue accent
  doc.rect(0, 26, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('INDUSMAINT CMMS • DOSSIÊ TÉCNICO DE EQUIPAMENTO', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(195, 205, 235);
  doc.text(
    'FICHA TÉCNICA INDIVIDUAL • HOMOLOGAÇÃO DE MANUTENÇÃO ISO 55001 / NR-12',
    14,
    18
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(asset.tag, pageWidth - 14, 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(147, 197, 253);
  doc.text(`EMITIDO: ${dateStr} ${timeStr}`, pageWidth - 14, 18, { align: 'right' });

  // 2. Equipment Summary Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 32, pageWidth - 28, 44, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 32, pageWidth - 28, 44, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${asset.name} (${asset.tag})`, 18, 39);

  // Operational status badge
  const statusColor =
    asset.status === 'Operacional'
      ? [22, 101, 52]
      : asset.status === 'Pendente'
      ? [180, 83, 9]
      : [185, 28, 28];
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth - 52, 34, 34, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(asset.status.toUpperCase(), pageWidth - 35, 38.5, { align: 'center' });

  // Grid of Specifications
  doc.setFontSize(8);
  const specFields = [
    { label: 'Setor:', val: asset.sector },
    { label: 'Área / Planta:', val: asset.plantArea || 'SN Seixal' },
    { label: 'Criticidade:', val: `Classe ${asset.criticality} (Matriz RCM)` },
    { label: 'Fabricante:', val: asset.manufacturer || 'Não especificado' },
    { label: 'Nº de Série:', val: asset.serialNumber || 'N/A' },
    { label: 'Última Intervenção:', val: asset.lastInterventionDate || 'Não registada' },
    { label: 'Próxima Intervenção:', val: asset.nextIntervention.title },
    { label: 'Data Limite:', val: `${asset.nextIntervention.dueDate} (${asset.nextIntervention.daysRemaining} dias)` },
    { label: 'Periodicidade:', val: asset.nextIntervention.frequencyLabel },
    { label: 'Técnico Responsável:', val: asset.nextIntervention.assignedTech || 'Engenharia de Manutenção' },
    { label: 'Horímetro:', val: asset.horimeter ? `${asset.horimeter} h` : 'Contínuo' }
  ];

  const col1X = 18;
  const col2X = 108;
  let currY = 46;

  specFields.forEach((f, idx) => {
    const isCol2 = idx % 2 === 1;
    const x = isCol2 ? col2X : col1X;
    if (idx > 0 && !isCol2) currY += 5.5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(f.label, x, currY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(f.val, x + 34, currY);
  });

  let currentY = 82;

  // 3. Maintenance Routines Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('PLANO DE ROTINAS DE MANUTENÇÃO PROGRAMADA', 14, currentY);

  const routinesData = (asset.routines || []).map(r => [
    r.code,
    r.type,
    r.title,
    r.periodicityLabel,
    r.toleranceOrSpec,
    r.standardInstrumentOrPart || '-'
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    margin: { left: 14, right: 14 },
    head: [['CÓDIGO', 'TIPO', 'DESCRIÇÃO DA ROTINA', 'PERIODICIDADE', 'TOLERÂNCIA / SPEC', 'INSTRUMENTO / PEÇA']],
    body: routinesData.length > 0 ? routinesData : [['-', '-', 'Nenhuma rotina cadastrada', '-', '-', '-']],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 20 },
      1: { halign: 'center', cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { halign: 'center', cellWidth: 26 },
      4: { cellWidth: 32 },
      5: { cellWidth: 29 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Get table end Y position
  const lastTableDoc = doc as unknown as { lastAutoTable: { finalY: number } };
  currentY = (lastTableDoc.lastAutoTable?.finalY || 130) + 10;

  // If near page bottom, add new page
  if (currentY > pageHeight - 75) {
    doc.addPage();
    currentY = 20;
  }

  // 4. Maintenance History Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('HISTÓRICO RECENTE DE INTERVENÇÕES E AUDITORIA', 14, currentY);

  const historyData = (asset.history || []).map(h => [
    h.date,
    h.title,
    `${h.technicianName} (${h.technicianReg || 'Reg.'})`,
    h.notes || 'Intervenção executada conforme normas operacionais.',
    h.verified ? 'AUDITADO' : 'REGISTADO'
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    margin: { left: 14, right: 14 },
    head: [['DATA', 'INTERVENÇÃO REALIZADA', 'TÉCNICO RESPONSÁVEL', 'OBSERVAÇÕES TÉCNICAS', 'CONFORMIDADE']],
    body: historyData.length > 0 ? historyData : [['-', 'Sem histórico registrado', '-', '-', '-']],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
      1: { cellWidth: 45 },
      2: { cellWidth: 42 },
      3: { cellWidth: 50 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 23 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'AUDITADO') {
          data.cell.styles.textColor = [22, 101, 52];
          data.cell.styles.fillColor = [240, 253, 244];
        } else {
          data.cell.styles.textColor = [71, 85, 105];
        }
      }
    }
  });

  const historyFinalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || currentY + 30;
  let signY = historyFinalY + 12;

  // Ensure enough room for signatures
  if (signY > pageHeight - 38) {
    doc.addPage();
    signY = 25;
  }

  // 5. Technical Signature Block
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);

  // Left signature
  doc.line(18, signY + 14, 88, signY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('TÉCNICO RESPONSÁVEL HOMOLOGADO', 53, signY + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Rubrica Digital • Reg. CMMS-${asset.tag}`, 53, signY + 22, { align: 'center' });

  // Right signature
  doc.line(pageWidth - 88, signY + 14, pageWidth - 18, signY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('COORDENAÇÃO DE ENGENHARIA E AUDITORIA', pageWidth - 53, signY + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Conformidade ISO 55001 / EN 13306', pageWidth - 53, signY + 22, { align: 'center' });

  // Page numbering and footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setDrawColor(203, 213, 225);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.text(
      `INDUSMAINT CMMS • Dossiê Técnico [${asset.tag}] • Autenticação: SHA256-${asset.id.slice(0, 8)}`,
      14,
      pageHeight - 7
    );
    doc.text(`Página ${p} de ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }

  // Trigger download
  const safeDate = now.toISOString().slice(0, 10);
  const filename = `Dossie_Tecnico_${asset.tag}_${safeDate}.pdf`;
  downloadPdf(doc, filename);
}
