export const lookupMaterialProperties = async (materialName) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const mockDatabase = {
    'peg-400': {
      materialName: 'PEG-400',
      properties: [
        {
          name: 'Molecular Weight',
          value: '400',
          unit: 'g/mol',
          confidence: 0.95,
          range: '380-420',
        },
        {
          name: 'Heat Capacity',
          value: '2.1',
          unit: 'J/g·K',
          confidence: 0.88,
          range: '2.0-2.3',
        },
        {
          name: 'Density',
          value: '1.13',
          unit: 'g/cm³',
          confidence: 0.92,
          range: '1.12-1.14',
        },
        {
          name: 'Viscosity',
          value: '90',
          unit: 'mPa·s',
          confidence: 0.85,
          range: '80-110',
        },
      ],
      sources: [
        'Dow Chemical Technical Data Sheet',
        'BASF Polyurethane Handbook',
        'Scientific Literature Database',
      ],
      notes: 'PEG-400 is a commonly used polyol in flexible PU foam formulations.',
    },
    'tcpp': {
      materialName: 'TCPP',
      properties: [
        {
          name: 'Molecular Weight',
          value: '327.6',
          unit: 'g/mol',
          confidence: 0.98,
          range: '327-328',
        },
        {
          name: 'Heat Capacity',
          value: '1.5',
          unit: 'J/g·K',
          confidence: 0.75,
          range: '1.4-1.7',
        },
        {
          name: 'Density',
          value: '1.29',
          unit: 'g/cm³',
          confidence: 0.93,
          range: '1.28-1.30',
        },
        {
          name: 'Phosphorus Content',
          value: '9.5',
          unit: '%',
          confidence: 0.96,
          range: '9.3-9.7',
        },
      ],
      sources: [
        'ICL Industrial Products Technical Data',
        'Flame Retardants Database',
        'Polymer Additives Handbook',
      ],
      notes: 'TCPP is a chlorinated organophosphate flame retardant commonly used in PU foams.',
    },
    'mdi': {
      materialName: 'MDI',
      properties: [
        {
          name: 'Molecular Weight',
          value: '250',
          unit: 'g/mol',
          confidence: 0.97,
          range: '250-260',
        },
        {
          name: 'NCO Content',
          value: '31.5',
          unit: '%',
          confidence: 0.94,
          range: '30.5-32.5',
        },
        {
          name: 'Heat Capacity',
          value: '1.8',
          unit: 'J/g·K',
          confidence: 0.82,
          range: '1.7-2.0',
        },
        {
          name: 'Reaction Enthalpy',
          value: '-100',
          unit: 'kJ/mol',
          confidence: 0.89,
          range: '-95 to -105',
        },
      ],
      sources: [
        'Huntsman Polyurethanes Technical Library',
        'Covestro Isocyanate Database',
        'Industrial Chemistry Reference',
      ],
      notes: 'MDI is the most common isocyanate used in rigid PU foam applications.',
    },
  }

  const normalizedName = materialName.toLowerCase().trim().replace(/\s+/g, '-')
  const result = mockDatabase[normalizedName]

  if (result) {
    return result
  }

  return {
    materialName: materialName,
    properties: [
      {
        name: 'Molecular Weight',
        value: 'Unknown',
        unit: 'g/mol',
        confidence: 0.3,
        range: 'N/A',
      },
      {
        name: 'Heat Capacity',
        value: 'Unknown',
        unit: 'J/g·K',
        confidence: 0.3,
        range: 'N/A',
      },
    ],
    sources: ['No reliable sources found'],
    notes: 'Material not found in database. Please verify material name or add manually to library.',
  }
}