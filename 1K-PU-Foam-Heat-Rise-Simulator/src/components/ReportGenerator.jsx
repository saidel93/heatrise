import { useState } from 'react'
import { motion } from 'framer-motion'
import { DownloadIcon, XIcon, LoaderIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { generatePDF } from '../utils/pdfGenerator'

const ReportGenerator = ({ simulation, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await generatePDF(simulation)
      toast.success('PDF report generated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Report Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-dark-border pb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {simulation.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generated: {new Date(simulation.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-dark-card rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temperature Rise</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {simulation.results?.temperatureRise?.toFixed(2) || 'N/A'}°C
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-card rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Heat Release</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {simulation.results?.heatRelease?.toFixed(2) || 'N/A'} kJ
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Formulation</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Part A (Polyol)
                </p>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Type</th>
                        <th>Mass (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulation.formulation?.partA?.map((comp, index) => (
                        <tr key={index}>
                          <td>{comp.materialName || 'N/A'}</td>
                          <td>{comp.type || 'N/A'}</td>
                          <td>{comp.mass || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Part B (Isocyanate)
                </p>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Type</th>
                        <th>Mass (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulation.formulation?.partB?.map((comp, index) => (
                        <tr key={index}>
                          <td>{comp.materialName || 'N/A'}</td>
                          <td>{comp.type || 'N/A'}</td>
                          <td>{comp.mass || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {simulation.results?.steps && simulation.results.steps.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Calculation Steps
              </h4>
              <div className="space-y-3">
                {simulation.results.steps.map((step, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border"
                  >
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {step.title}
                    </p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 mb-1">
                      {step.equation}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Result: {step.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
          <button onClick={onClose} className="btn-outline">
            Close
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <LoaderIcon className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ReportGenerator