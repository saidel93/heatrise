export const sampleSimulations = [
  {
    id: 'sample-1',
    name: 'Standard Flexible Foam',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    formulation: {
      partA: [
        {
          id: 'comp-1',
          materialId: '1',
          materialName: 'PEG-400',
          mass: 100,
          type: 'polyol',
          properties: {
            molecularWeight: 400,
            heatCapacity: 2.1,
          },
        },
        {
          id: 'comp-2',
          materialId: '5',
          materialName: 'DABCO 33-LV',
          mass: 2,
          type: 'catalyst',
          properties: {
            molecularWeight: 112.2,
            heatCapacity: 2.5,
          },
        },
      ],
      partB: [
        {
          id: 'comp-3',
          materialId: '12',
          materialName: 'TDI 80/20',
          mass: 45,
          type: 'isocyanate',
          properties: {
            molecularWeight: 174.2,
            heatCapacity: 1.9,
            ncoContent: 48.3,
            reactionEnthalpy: -105,
          },
        },
      ],
    },
    results: {
      temperatureRise: 42.5,
      heatRelease: 285.3,
      ncoMoles: 0.1248,
      heatCapacity: 312.5,
      steps: [
        {
          title: 'Calculate NCO Moles',
          equation: 'n_NCO = (mass_iso × NCO_content) / 42',
          values: {
            mass_iso: '45 g',
            NCO_content: '48.3%',
          },
          result: '0.1248 mol',
        },
        {
          title: 'Calculate Heat Release',
          equation: 'Q = n_NCO × ΔH_rxn',
          values: {
            n_NCO: '0.1248 mol',
            ΔH_rxn: '-105 kJ/mol',
          },
          result: '285.3 kJ',
        },
        {
          title: 'Calculate Total Heat Capacity',
          equation: 'Cp_total = Σ(mass_i × Cp_i)',
          values: {
            'Part A': '(100 × 2.1) + (2 × 2.5) = 215 J/K',
            'Part B': '45 × 1.9 = 85.5 J/K',
          },
          result: '312.5 J/K',
        },
        {
          title: 'Calculate Temperature Rise',
          equation: 'ΔT = Q / Cp_total',
          values: {
            Q: '285.3 kJ',
            Cp_total: '312.5 J/K',
          },
          result: '42.5°C',
        },
      ],
    },
  },
  {
    id: 'sample-2',
    name: 'Flame Retardant Rigid Foam',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    formulation: {
      partA: [
        {
          id: 'comp-4',
          materialId: '3',
          materialName: 'PPG-1000',
          mass: 80,
          type: 'polyol',
          properties: {
            molecularWeight: 1000,
            heatCapacity: 2.0,
          },
        },
        {
          id: 'comp-5',
          materialId: '8',
          materialName: 'TCPP',
          mass: 15,
          type: 'flame-retardant',
          properties: {
            molecularWeight: 327.6,
            heatCapacity: 1.5,
          },
        },
        {
          id: 'comp-6',
          materialId: '7',
          materialName: 'DABCO T-12',
          mass: 1.5,
          type: 'catalyst',
          properties: {
            molecularWeight: 232.4,
            heatCapacity: 2.4,
          },
        },
      ],
      partB: [
        {
          id: 'comp-7',
          materialId: '11',
          materialName: 'MDI',
          mass: 55,
          type: 'isocyanate',
          properties: {
            molecularWeight: 250,
            heatCapacity: 1.8,
            ncoContent: 31.5,
            reactionEnthalpy: -100,
          },
        },
      ],
    },
    results: {
      temperatureRise: 38.7,
      heatRelease: 412.5,
      ncoMoles: 0.4125,
      heatCapacity: 285.85,
      steps: [
        {
          title: 'Calculate NCO Moles',
          equation: 'n_NCO = (mass_iso × NCO_content) / 42',
          values: {
            mass_iso: '55 g',
            NCO_content: '31.5%',
          },
          result: '0.4125 mol',
        },
        {
          title: 'Calculate Heat Release',
          equation: 'Q = n_NCO × ΔH_rxn',
          values: {
            n_NCO: '0.4125 mol',
            ΔH_rxn: '-100 kJ/mol',
          },
          result: '412.5 kJ',
        },
        {
          title: 'Calculate Total Heat Capacity',
          equation: 'Cp_total = Σ(mass_i × Cp_i)',
          values: {
            'Part A': '(80 × 2.0) + (15 × 1.5) + (1.5 × 2.4) = 186.1 J/K',
            'Part B': '55 × 1.8 = 99.0 J/K',
          },
          result: '285.85 J/K',
        },
        {
          title: 'Calculate Temperature Rise',
          equation: 'ΔT = Q / Cp_total',
          values: {
            Q: '412.5 kJ',
            Cp_total: '285.85 J/K',
          },
          result: '38.7°C',
        },
      ],
    },
  },
]