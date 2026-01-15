import { motion } from 'framer-motion'
import { BookOpenIcon, BeakerIcon, CalculatorIcon, DatabaseIcon, SparklesIcon, FileTextIcon } from 'lucide-react'

const Help = () => {
  const sections = [
    {
      icon: BeakerIcon,
      title: 'Getting Started',
      content: [
        'Create a new simulation from the Dashboard',
        'Enter a descriptive name for your formulation',
        'Add components to A Side (Isocyanate), B Side (Polyol & Additives), and C Side (Gas/Blowing Agent)',
        'A Side: NCO-containing isocyanate components - %NCO content is required for accurate calculations',
        'B Side: Polyols, catalysts, surfactants, flame retardants, and other additives - optional Cp values improve accuracy',
        'C Side: Expansion gases and blowing agents (CO₂, N₂, HFC-245fa, HFC-365mfc, Pentane, Cyclopentane, HFO-1233zd)',
        'Run the calculation to see temperature rise predictions',
        'Save your simulation for future reference',
      ],
    },
    {
      icon: CalculatorIcon,
      title: 'Calculation Methodology',
      content: [
        'NCO Moles: n_NCO = (mass_iso × %NCO/100) / MW_iso (uses A-side %NCO content)',
        'Heat Release: Q = n_NCO × ΔH_rxn',
        'Total Heat Capacity: Cp_total = Σ(mass_i × Cp_i) + Cp_gas',
        'B-side additives (catalyst, surfactant, flame-retardant) can have optional Cp values for improved accuracy',
        'Gas Heat Capacity: C_gas = (m/MW) × R × T',
        'Temperature Rise: ΔT = Q / Cp_total',
        'CRM Correction: ΔT_corrected = ΔT_base × CRM_total',
        'All calculations use SI units (kg, kJ, K)',
      ],
    },
    {
      icon: DatabaseIcon,
      title: 'Material Library',
      content: [
        'Browse pre-loaded materials (polyols, catalysts, flame retardants, isocyanates)',
        'Add custom materials with properties',
        'Search and filter by material type',
        'Edit or delete materials as needed',
        'Material properties are stored locally',
      ],
    },
    {
      icon: SparklesIcon,
      title: 'Gas Options',
      content: [
        'CO₂ (Carbon Dioxide): Common blowing agent',
        'N₂ (Nitrogen): Inert gas for foam expansion',
        'HFC-245fa: Hydrofluorocarbon blowing agent',
        'HFC-365mfc: Low GWP blowing agent',
        'Pentane: Hydrocarbon blowing agent',
        'Cyclopentane: Cyclic hydrocarbon blowing agent',
        'HFO-1233zd: Low GWP hydrofluoroolefin (MW=132.03 g/mol, Cp=0.85 J/g·K - auto-populated)',
      ],
    },
    {
      icon: FileTextIcon,
      title: 'Reports & PDF Generation',
      content: [
        'View all completed simulations',
        'Filter by date range',
        'Download detailed PDF reports',
        'Reports include calculation steps',
        'Safety assessments with color-coded badges',
      ],
    },
  ]

  const safetyGuidelines = [
    {
      level: 'Low Risk',
      color: 'success',
      range: '< 30°C',
      description: 'Safe for most applications. Normal processing conditions.',
    },
    {
      level: 'Moderate Risk',
      color: 'warning',
      range: '30-50°C',
      description: 'Caution advised. Monitor processing temperature closely.',
    },
    {
      level: 'High Risk',
      color: 'danger',
      range: '> 50°C',
      description: 'High risk of thermal runaway. Review formulation and processing conditions.',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Help & Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Learn how to use the PU Foam Heat-Rise Simulator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-danger/10 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-danger" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Safety Guidelines
            </h2>
          </div>

          <div className="space-y-4">
            {safetyGuidelines.map((guideline, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {guideline.level}
                  </h3>
                  <span className={`badge badge-${guideline.color}`}>{guideline.range}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {guideline.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-2">Important Notes</p>
              <ul className="space-y-1">
                <li>• All calculations are estimates based on input data accuracy</li>
                <li>• Always verify critical properties with supplier data sheets</li>
                <li>• Temperature rise predictions assume adiabatic conditions</li>
                <li>• Actual processing conditions may vary</li>
                <li>• Use appropriate safety equipment when handling reactive materials</li>
                <li>• %NCO content is required for A-side isocyanates</li>
                <li>• Optional Cp values for B-side additives improve calculation accuracy</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Help