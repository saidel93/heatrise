import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generatePDF = async (simulation) => {
  const doc = new jsPDF()

  const primaryColor = [26, 83, 92]
  const secondaryColor = [78, 205, 196]
  const textColor = [51, 51, 51]

  doc.setTextColor(...textColor)

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('1K PU Foam Heat-Rise Simulation Report', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)

  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(14, 32, 196, 32)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Simulation Details', 14, 42)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name: ${simulation.name}`, 14, 50)
  doc.text(`Date: ${new Date(simulation.createdAt).toLocaleDateString()}`, 14, 56)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Results Summary', 14, 68)

  const resultsData = [
    ['Temperature Rise', `${simulation.results?.temperatureRise?.toFixed(2) || 'N/A'}°C`],
    ['Heat Release', `${simulation.results?.heatRelease?.toFixed(2) || 'N/A'} kJ`],
    ['NCO Moles', `${simulation.results?.ncoMoles?.toFixed(4) || 'N/A'} mol`],
    ['Heat Capacity', `${simulation.results?.heatCapacity?.toFixed(2) || 'N/A'} J/K`],
  ]

  if (simulation.results?.gasHeatCapacity && simulation.results.gasHeatCapacity > 0) {
    resultsData.push(['Gas Heat Capacity (C_gas)', `${simulation.results.gasHeatCapacity.toFixed(2)} J/K`])
  }

  if (simulation.results?.crmTotal) {
    resultsData.push(['CRM Total', `${simulation.results.crmTotal.toFixed(4)}`])
  }

  doc.autoTable({
    startY: 72,
    head: [['Metric', 'Value']],
    body: resultsData,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10 },
    margin: { left: 14 },
  })

  let yPos = doc.lastAutoTable.finalY + 10

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Formulation Details', 14, yPos)
  yPos += 6

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Part A (Isocyanate)', 14, yPos)
  yPos += 4

  const partAData = simulation.formulation?.partA?.map((comp) => [
    comp.materialName || 'N/A',
    comp.type || 'N/A',
    `${comp.mass || 'N/A'} g`,
    `${comp.properties?.molecularWeight || 'N/A'} g/mol`,
    `${comp.ncoContent ? comp.ncoContent + '%' : 'N/A'}`,
    `${comp.properties?.heatCapacity || 'N/A'} J/g·K`,
  ]) || []

  doc.autoTable({
    startY: yPos,
    head: [['Material', 'Type', 'Mass', 'MW', '%NCO', 'Cp']],
    body: partAData,
    theme: 'grid',
    headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    margin: { left: 14 },
  })

  yPos = doc.lastAutoTable.finalY + 8

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Part B (Polyol & Additives)', 14, yPos)
  yPos += 4

  const partBData = simulation.formulation?.partB?.map((comp) => [
    comp.materialName || 'N/A',
    comp.type || 'N/A',
    `${comp.mass || 'N/A'} g`,
    `${comp.properties?.molecularWeight || 'N/A'} g/mol`,
    ['catalyst', 'surfactant', 'flame-retardant'].includes(comp.type)
      ? `${comp.heatCapacity || 'Not specified'} J/g·K`
      : `${comp.properties?.heatCapacity || 'N/A'} J/g·K`,
  ]) || []

  doc.autoTable({
    startY: yPos,
    head: [['Material', 'Type', 'Mass', 'MW', 'Cp']],
    body: partBData,
    theme: 'grid',
    headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    margin: { left: 14 },
  })

  yPos = doc.lastAutoTable.finalY + 8

  if (simulation.formulation?.partC && simulation.formulation.partC.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Part C (Gas/Blowing Agent)', 14, yPos)
    yPos += 4

    const partCData = simulation.formulation.partC.map((comp) => {
      const mass = parseFloat(comp.mass) || 0
      const mw = parseFloat(comp.properties?.molecularWeight) || 0
      const R = 8.314
      const heatCap = mw > 0 ? ((mass / mw) * R).toFixed(2) : 'N/A'
      return [
        comp.materialName || 'N/A',
        comp.gasType || 'N/A',
        `${comp.mass || 'N/A'} g`,
        `${comp.properties?.molecularWeight || 'N/A'} g/mol`,
        `${comp.properties?.heatCapacity || 'N/A'} J/g·K`,
        `${heatCap} J/K`,
      ]
    })

    doc.autoTable({
      startY: yPos,
      head: [['Material', 'Gas Type', 'Mass', 'MW', 'Cp', 'Heat Capacity']],
      body: partCData,
      theme: 'grid',
      headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9 },
      margin: { left: 14 },
    })

    yPos = doc.lastAutoTable.finalY + 8
  }

  if (simulation.results?.steps && simulation.results.steps.length > 0) {
    doc.addPage()
    yPos = 20

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Calculation Steps', 14, yPos)
    yPos += 8

    simulation.results.steps.forEach((step, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Step ${index + 1}: ${step.title}`, 14, yPos)
      yPos += 6

      doc.setFontSize(10)
      doc.setFont('courier', 'normal')
      doc.text(step.equation, 14, yPos)
      yPos += 6

      if (step.values) {
        doc.setFont('helvetica', 'normal')
        Object.entries(step.values).forEach(([key, value]) => {
          const text = `${key}: ${value}`
          doc.text(text, 14, yPos)
          yPos += 5
        })
      }

      doc.setFont('helvetica', 'bold')
      doc.text(`Result: ${step.result}`, 14, yPos)
      yPos += 10
    })
  }

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Page ${i} of ${pageCount} | Generated by 1K PU Foam Heat-Rise Simulator`,
      14,
      doc.internal.pageSize.height - 10
    )
  }

  doc.save(`${simulation.name.replace(/\s+/g, '_')}_Report.pdf`)
}