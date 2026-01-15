import { motion } from 'framer-motion'
import { CheckCircleIcon } from 'lucide-react'

const CalculationSteps = ({ steps }) => {
  if (!steps || steps.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Calculation Steps
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Detailed breakdown of thermodynamic calculations using A-side %NCO content, B-side optional Cp values, and C-side gas contributions (C_gas = (m/MW) × R × T)
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 bg-success/10 rounded-full flex-shrink-0 mt-1">
                <CheckCircleIcon className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Step {index + 1}: {step.title}
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-dark-bg rounded border border-gray-200 dark:border-dark-border">
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {step.equation}
                    </p>
                  </div>
                  {step.values && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {Object.entries(step.values).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-medium">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 dark:border-dark-border">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Result: {step.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default CalculationSteps