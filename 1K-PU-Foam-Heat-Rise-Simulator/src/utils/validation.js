export const validateFormulation = (formulation) => {
  const errors = []

  if (!formulation.partA || formulation.partA.length === 0) {
    errors.push('A Side (Isocyanate) must contain at least one component')
  }

  if (!formulation.partB || formulation.partB.length === 0) {
    errors.push('B Side (Polyol & Additives) must contain at least one component')
  }

  const allComponents = [...(formulation.partA || []), ...(formulation.partB || []), ...(formulation.partC || [])]

  allComponents.forEach((comp, index) => {
    if (!comp.materialName || comp.materialName.trim() === '') {
      errors.push(`Component ${index + 1}: Material name is required`)
    }

    const mass = parseFloat(comp.mass)
    if (isNaN(mass) || mass <= 0) {
      errors.push(`Component ${index + 1}: Mass must be a positive number`)
    }

    if (comp.type === 'isocyanate') {
      const ncoContent = parseFloat(comp.ncoContent)
      if (isNaN(ncoContent) || ncoContent < 1 || ncoContent > 100) {
        errors.push(`Component ${index + 1}: %NCO content must be between 1 and 100`)
      }
    }

    if (comp.type === 'catalyst') {
      if (!comp.catalystType || comp.catalystType === '' || comp.catalystType === 'None') {
        errors.push(`Component ${index + 1}: Catalyst type must be specified`)
      }

      const concentration = parseFloat(comp.concentration)
      if (isNaN(concentration) || concentration < 0 || concentration > 100) {
        errors.push(`Component ${index + 1}: Catalyst concentration must be between 0 and 100%`)
      }
    }

    if (comp.type === 'gas') {
      if (!comp.gasType || comp.gasType === '') {
        errors.push(`Component ${index + 1}: Gas type must be specified`)
      }

      const molecularWeight = parseFloat(comp.properties?.molecularWeight)
      if (isNaN(molecularWeight) || molecularWeight <= 0) {
        errors.push(`Component ${index + 1}: Molecular weight must be a positive number`)
      }

      if (comp.gasType === 'HFO-1233zd') {
        const mw = parseFloat(comp.properties?.molecularWeight)
        const cp = parseFloat(comp.properties?.heatCapacity)
        if (Math.abs(mw - 132.03) > 0.01) {
          errors.push(`Component ${index + 1}: HFO-1233zd molecular weight must be 132.03 g/mol`)
        }
        if (Math.abs(cp - 0.85) > 0.01) {
          errors.push(`Component ${index + 1}: HFO-1233zd heat capacity must be 0.85 J/g·K`)
        }
      }
    }
  })

  const hasIsocyanate = allComponents.some((comp) => comp.type === 'isocyanate')
  if (!hasIsocyanate) {
    errors.push('Formulation must contain at least one isocyanate')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateMaterial = (material) => {
  const errors = []

  if (!material.name || material.name.trim() === '') {
    errors.push('Material name is required')
  }

  if (!material.type) {
    errors.push('Material type is required')
  }

  const validTypes = ['polyol', 'catalyst', 'surfactant', 'flame-retardant', 'isocyanate', 'gas', 'additive']
  if (material.type && !validTypes.includes(material.type)) {
    errors.push('Invalid material type')
  }

  if (material.type !== 'gas') {
    if (material.molecularWeight !== undefined && material.molecularWeight !== null) {
      const mw = parseFloat(material.molecularWeight)
      if (isNaN(mw) || mw <= 0) {
        errors.push('Molecular weight must be a positive number')
      }
    }

    if (['catalyst', 'surfactant', 'flame-retardant'].includes(material.type)) {
      if (material.heatCapacity !== undefined && material.heatCapacity !== null && material.heatCapacity !== '') {
        const cp = parseFloat(material.heatCapacity)
        if (isNaN(cp) || cp <= 0) {
          errors.push('Heat capacity must be a positive number')
        }
      }
    } else {
      if (material.heatCapacity !== undefined && material.heatCapacity !== null) {
        const cp = parseFloat(material.heatCapacity)
        if (isNaN(cp) || cp <= 0) {
          errors.push('Heat capacity must be a positive number')
        }
      }
    }
  }

  if (material.type === 'isocyanate') {
    if (material.ncoContent !== undefined && material.ncoContent !== null) {
      const nco = parseFloat(material.ncoContent)
      if (isNaN(nco) || nco <= 0 || nco > 100) {
        errors.push('NCO content must be between 0 and 100')
      }
    }
  }

  if (material.type === 'catalyst') {
    if (!material.catalystType || material.catalystType === '') {
      errors.push('Catalyst type is required')
    }

    if (material.concentration !== undefined && material.concentration !== null) {
      const conc = parseFloat(material.concentration)
      if (isNaN(conc) || conc < 0 || conc > 100) {
        errors.push('Catalyst concentration must be between 0 and 100%')
      }
    }
  }

  if (material.type === 'gas') {
    if (!material.gasType || material.gasType === '') {
      errors.push('Gas type is required')
    }

    if (material.molecularWeight !== undefined && material.molecularWeight !== null) {
      const mw = parseFloat(material.molecularWeight)
      if (isNaN(mw) || mw <= 0) {
        errors.push('Molecular weight must be a positive number')
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateSimulationName = (name) => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Simulation name is required',
    }
  }

  if (name.length > 100) {
    return {
      isValid: false,
      error: 'Simulation name must be less than 100 characters',
    }
  }

  return {
    isValid: true,
    error: null,
  }
}