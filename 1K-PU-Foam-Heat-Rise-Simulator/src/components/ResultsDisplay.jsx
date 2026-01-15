import { motion } from 'framer-motion'
import { ThermometerIcon, FlameIcon, ActivityIcon, AlertTriangleIcon, TrendingUpIcon, WindIcon } from 'lucide-react'
import SafetyBadge from './SafetyBadge'
import CalculationSteps from './CalculationSteps'

const ResultsDisplay = ({ results, formulation }) => {
  if (!results) {
    return null
  }

  const metrics = [
    {
      icon: ThermometerIcon,
      label: 'CRM-Corrected ΔT',
      value: `${results.temperatureRise?.toFixed(2) || '0.00'}°C`,
      color: 'primary',
    },
    {
      icon: ThermometerIcon,
      label: 'Base ΔT (Uncorrected)',
      value: `${results.uncorrectedDeltaT?.toFixed(2) || '0.00'}°C`,
      color: 'secondary',
    },
    {
      icon: FlameIcon,
      label: 'Heat Release',
      value: `${results.heatRelease?.toFixed(2) || '0.00'} kJ`,
      color: 'danger',
    },
    {
      icon: ActivityIcon,
      label: 'NCO Moles',
      value: results.ncoMoles?.toFixed(4) || '0.0000',
      color: 'secondary',
    },
    {
      icon: ActivityIcon,
      label: 'Heat Capacity',
      value: `${results.heatCapacity?.toFixed(2) || '0.00'} J/K`,
      color: 'success',
    },
    {
      icon: TrendingUpIcon,
      label: 'Total CRM',
      value: results.crmTotal?.toFixed(4) || '1.0000',
      color: 'warning',
    },
  ]

  if (results.gasHeatCapacity !== undefined && results.gasHeatCapacity > 0) {
    metrics.push({
      icon: WindIcon,
      label: 'Gas Heat Capacity (C_gas)',
      value: `${results.gasHeatCapacity?.toFixed(2) || '0.00'} J/K`,
      color: 'primary',
      equation: 'C_gas = (m/MW) × R × T',
    })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calculation Results</h2>
          <SafetyBadge temperatureRise={results.temperatureRise || 0} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 bg-${metric.color}/10 rounded-lg`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}`} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              {metric.equation && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">{metric.equation}</p>
              )}
            </motion.div>
          ))}
        </div>

        {results.temperatureRise > 50 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-danger/10 rounded-lg border border-danger/30 flex items-start gap-3"
          >
            <AlertTriangleIcon className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
            <div className="text-sm text-danger">
              <p className="font-medium mb-1">High Temperature Rise Detected</p>
              <p>
                The predicted temperature rise exceeds 50°C, indicating potential risk of thermal
                runaway. Review formulation composition and processing conditions.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {results.crmBreakdown && results.crmBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            CRM Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Chemical Risk Modifier accounts for catalytic effects on reaction kinetics
          </p>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Catalyst Name</th>
                  <th>Concentration (%)</th>
                  <th>Individual CRM</th>
                </tr>
              </thead>
              <tbody>
                {results.crmBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="font-medium">{item.catalyst}</td>
                    <td>{item.concentration.toFixed(2)}%</td>
                    <td className="font-semibold">{item.crm.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Weighted Average CRM_total:
              </span>
              <span className="text-xl font-bold text-warning">
                {results.crmTotal?.toFixed(4) || '1.0000'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Formulation Details
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">A Side (Isocyanate)</h4>
            {formulation?.partA?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Type</th>
                      <th>Mass (g)</th>
                      <th>MW (g/mol)</th>
                      <th>%NCO</th>
                      <th>Cp (J/g·K)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulation.partA.map((comp, index) => (
                      <tr key={index}>
                        <td className="font-medium">{comp.materialName || 'N/A'}</td>
                        <td>{comp.type || 'N/A'}</td>
                        <td>{comp.mass || 'N/A'}</td>
                        <td>{comp.properties?.molecularWeight || 'N/A'}</td>
                        <td>{comp.ncoContent ? `${comp.ncoContent}%` : 'N/A'}</td>
                        <td>{comp.properties?.heatCapacity || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No components added</p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">B Side (Polyol & Additives)</h4>
            {formulation?.partB?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Type</th>
                      <th>Mass (g)</th>
                      <th>MW (g/mol)</th>
                      <th>Cp (J/g·K)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulation.partB.map((comp, index) => (
                      <tr key={index}>
                        <td className="font-medium">{comp.materialName || 'N/A'}</td>
                        <td>{comp.type || 'N/A'}</td>
                        <td>{comp.mass || 'N/A'}</td>
                        <td>{comp.properties?.molecularWeight || 'N/A'}</td>
                        <td>
                          {['catalyst', 'surfactant', 'flame-retardant'].includes(comp.type)
                            ? comp.heatCapacity || 'Not specified'
                            : comp.properties?.heatCapacity || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No components added</p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">C Side (Gas/Blowing Agent)</h4>
            {formulation?.partC?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Gas Type</th>
                      <th>Mass (g)</th>
                      <th>MW (g/mol)</th>
                      <th>Cp (J/g·K)</th>
                      <th>Heat Capacity (J/K)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulation.partC.map((comp, index) => {
                      const mass = parseFloat(comp.mass) || 0
                      const mw = parseFloat(comp.properties?.molecularWeight) || 0
                      const R = 8.314
                      const heatCap = mw > 0 ? ((mass / mw) * R).toFixed(2) : 'N/A'
                      return (
                        <tr key={index}>
                          <td className="font-medium">{comp.materialName || 'N/A'}</td>
                          <td>{comp.gasType || 'N/A'}</td>
                          <td>{comp.mass || 'N/A'}</td>
                          <td>{comp.properties?.molecularWeight || 'N/A'}</td>
                          <td>{comp.properties?.heatCapacity || 'N/A'}</td>
                          <td>{heatCap}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No components added</p>
            )}
          </div>
        </div>
      </motion.div>

      <CalculationSteps steps={results.steps || []} />
    </div>
  )
}

export default ResultsDisplay