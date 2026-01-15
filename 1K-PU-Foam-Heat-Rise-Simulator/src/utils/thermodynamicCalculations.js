const calculateCRM = (catalystType, concentration) => {
  if (!catalystType || catalystType === 'None' || !concentration || concentration <= 0) {
    return 1.0
  }

  switch (catalystType) {
    case 'DMDEE':
      return 1 + 0.1 * Math.pow(concentration, 1.25)
    case 'SnOct2':
    case 'DBTDL':
      return 1.8 + 0.4 * Math.pow(concentration, 1.5)
    default:
      return 1.0
  }
}

const calculateTotalCRM = (catalysts) => {
  if (!catalysts || catalysts.length === 0) {
    return 1.0
  }

  const validCatalysts = catalysts.filter(
    (cat) => cat.mass && parseFloat(cat.mass) > 0 && cat.concentration && parseFloat(cat.concentration) > 0
  )

  if (validCatalysts.length === 0) {
    return 1.0
  }

  const totalMass = validCatalysts.reduce((sum, cat) => sum + parseFloat(cat.mass), 0)

  if (totalMass === 0) {
    return 1.0
  }

  const weightedCRM = validCatalysts.reduce((sum, cat) => {
    const mass = parseFloat(cat.mass)
    const weight = mass / totalMass
    const crm = calculateCRM(cat.catalystType, parseFloat(cat.concentration))
    return sum + weight * crm
  }, 0)

  return weightedCRM
}

const calculateGasHeatCapacity = (gasComponents) => {
  if (!gasComponents || gasComponents.length === 0) {
    return 0
  }

  const R = 8.314

  let totalGasHeatCapacity = 0

  gasComponents.forEach((gas) => {
    const mass = parseFloat(gas.mass) || 0
    const molecularWeight = parseFloat(gas.properties?.molecularWeight) || 0

    if (mass > 0 && molecularWeight > 0) {
      const moles = mass / molecularWeight
      const C_gas = moles * R
      totalGasHeatCapacity += C_gas
    }
  })

  return totalGasHeatCapacity
}

export const calculateThermodynamics = (formulation) => {
  const allComponents = [...formulation.partA, ...formulation.partB]
  const gasComponents = formulation.partC || []

  const isocyanates = formulation.partA.filter((comp) => comp.type === 'isocyanate')
  const catalysts = allComponents.filter((comp) => comp.type === 'catalyst')

  let totalNcoMoles = 0
  let totalHeatRelease = 0
  const reactionEnthalpy = -80

  isocyanates.forEach((iso) => {
    const mass = parseFloat(iso.mass) || 0
    const ncoContent = parseFloat(iso.ncoContent) || 0
    const molecularWeight = parseFloat(iso.properties?.molecularWeight) || 250

    if (ncoContent > 0) {
      const ncoMoles = (mass * (ncoContent / 100)) / molecularWeight
      totalNcoMoles += ncoMoles

      const heatRelease = ncoMoles * Math.abs(reactionEnthalpy)
      totalHeatRelease += heatRelease
    }
  })

  let totalHeatCapacity = 0

  formulation.partA.forEach((comp) => {
    const mass = parseFloat(comp.mass) || 0
    const heatCapacity = comp.properties?.heatCapacity || 2.0
    totalHeatCapacity += mass * heatCapacity
  })

  formulation.partB.forEach((comp) => {
    const mass = parseFloat(comp.mass) || 0
    let heatCapacity = 2.0

    if (['catalyst', 'surfactant', 'flame-retardant'].includes(comp.type)) {
      if (comp.heatCapacity && parseFloat(comp.heatCapacity) > 0) {
        heatCapacity = parseFloat(comp.heatCapacity)
      }
      const concentration = parseFloat(comp.concentration) || 100
      const effectiveMass = mass * (concentration / 100)
      totalHeatCapacity += effectiveMass * heatCapacity
    } else {
      heatCapacity = comp.properties?.heatCapacity || 2.0
      totalHeatCapacity += mass * heatCapacity
    }
  })

  const gasHeatCapacity = calculateGasHeatCapacity(gasComponents)
  totalHeatCapacity += gasHeatCapacity

  const uncorrectedDeltaT = totalHeatCapacity > 0 ? (totalHeatRelease * 1000) / totalHeatCapacity : 0

  const crmBreakdown = catalysts.map((cat) => ({
    catalyst: cat.materialName || 'Unknown',
    concentration: parseFloat(cat.concentration) || 0,
    crm: calculateCRM(cat.catalystType, parseFloat(cat.concentration)),
  }))

  const crmTotal = calculateTotalCRM(catalysts)
  const temperatureRise = uncorrectedDeltaT * crmTotal

  const steps = [
    {
      title: 'Calculate NCO Moles',
      equation: 'n_NCO = (mass_iso × %NCO/100) / MW_iso',
      values: {
        mass_iso: `${isocyanates.map((iso) => parseFloat(iso.mass) || 0).reduce((a, b) => a + b, 0).toFixed(2)} g`,
        '%NCO_content': `${isocyanates.map((iso) => `${iso.materialName}: ${iso.ncoContent || 0}%`).join(', ')}`,
        'MW_iso': `${isocyanates.map((iso) => `${iso.materialName}: ${iso.properties?.molecularWeight || 250} g/mol`).join(', ')}`,
      },
      result: `${totalNcoMoles.toFixed(4)} mol`,
    },
    {
      title: 'Calculate Heat Release',
      equation: 'Q = n_NCO × ΔH_rxn',
      values: {
        n_NCO: `${totalNcoMoles.toFixed(4)} mol`,
        'ΔH_rxn': '-80 kJ/mol (standard for all isocyanate reactions)',
      },
      result: `${totalHeatRelease.toFixed(2)} kJ`,
    },
    {
      title: 'Calculate Total Heat Capacity',
      equation: 'Cp_total = Σ(mass_i × Cp_i) + Cp_gas',
      values: {
        'A Side': `${formulation.partA.reduce((sum, comp) => {
          const mass = parseFloat(comp.mass) || 0
          const cp = comp.properties?.heatCapacity || 2.0
          return sum + mass * cp
        }, 0).toFixed(2)} J/K`,
        'B Side': `${formulation.partB.reduce((sum, comp) => {
          const mass = parseFloat(comp.mass) || 0
          let cp = 2.0
          if (['catalyst', 'surfactant', 'flame-retardant'].includes(comp.type)) {
            cp = parseFloat(comp.heatCapacity) || 2.0
            const conc = parseFloat(comp.concentration) || 100
            return sum + (mass * conc / 100) * cp
          }
          cp = comp.properties?.heatCapacity || 2.0
          return sum + mass * cp
        }, 0).toFixed(2)} J/K (includes optional Cp for catalysts/surfactants/flame-retardants)`,
        'C Side (Gas)': `${gasHeatCapacity.toFixed(2)} J/K (calculated via C_gas = (m/MW) × R × T)`,
      },
      result: `${totalHeatCapacity.toFixed(2)} J/K`,
    },
  ]

  if (gasHeatCapacity > 0) {
    const R = 8.314
    const T = 298.15
    const totalGasMass = gasComponents.reduce((sum, gas) => sum + (parseFloat(gas.mass) || 0), 0)
    const avgMW = gasComponents.length > 0 
      ? gasComponents.reduce((sum, gas) => sum + (parseFloat(gas.properties?.molecularWeight) || 0), 0) / gasComponents.length
      : 0

    steps.push({
      title: 'Calculate Gas Heat Capacity',
      equation: 'C_gas = (m/MW) × R × T',
      values: {
        'm (total gas mass)': `${totalGasMass.toFixed(2)} g`,
        'MW (molecular weight)': `${avgMW.toFixed(2)} g/mol`,
        'R (gas constant)': '8.314 J/mol·K',
        'T (temperature)': '298.15 K',
      },
      result: `${gasHeatCapacity.toFixed(2)} J/K`,
    })
  }

  steps.push({
    title: 'Calculate Base Temperature Rise (Uncorrected)',
    equation: 'ΔT_base = Q / Cp_total',
    values: {
      Q: `${totalHeatRelease.toFixed(2)} kJ`,
      Cp_total: `${totalHeatCapacity.toFixed(2)} J/K`,
    },
    result: `${uncorrectedDeltaT.toFixed(2)}°C`,
  })

  if (crmBreakdown.length > 0) {
    crmBreakdown.forEach((item, index) => {
      steps.push({
        title: `Calculate CRM for ${item.catalyst}`,
        equation:
          item.crm === 1.0
            ? 'CRM = 1.0 (No catalytic effect)'
            : item.concentration > 0
            ? `CRM = f(type, concentration)`
            : 'CRM = 1.0',
        values: {
          Catalyst: item.catalyst,
          Concentration: `${item.concentration.toFixed(2)}%`,
        },
        result: `CRM = ${item.crm.toFixed(4)}`,
      })
    })

    steps.push({
      title: 'Calculate Total CRM (Weighted Average)',
      equation: 'CRM_total = Σ(w_i × CRM_i)',
      values: {
        'Catalyst Count': `${crmBreakdown.length}`,
        'Weighting Method': 'Mass-based',
      },
      result: `CRM_total = ${crmTotal.toFixed(4)}`,
    })

    steps.push({
      title: 'Apply CRM Correction',
      equation: 'ΔT_corrected = ΔT_base × CRM_total',
      values: {
        'ΔT_base': `${uncorrectedDeltaT.toFixed(2)}°C`,
        CRM_total: `${crmTotal.toFixed(4)}`,
      },
      result: `${temperatureRise.toFixed(2)}°C`,
    })
  }

  return {
    temperatureRise,
    uncorrectedDeltaT,
    heatRelease: totalHeatRelease,
    ncoMoles: totalNcoMoles,
    heatCapacity: totalHeatCapacity,
    gasHeatCapacity,
    crmTotal,
    crmBreakdown,
    steps,
  }
}