import { useState } from 'react'
import { motion } from 'framer-motion'
import { SearchIcon, SparklesIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { lookupMaterialProperties } from '../services/aiClient'

const AIPropertyLookup = () => {
  const [materialName, setMaterialName] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState(null)

  const handleSearch = async () => {
    if (!materialName.trim()) {
      toast.error('Please enter a material name')
      return
    }

    setIsSearching(true)
    try {
      const data = await lookupMaterialProperties(materialName)
      setResults(data)
      toast.success('Properties retrieved successfully')
    } catch (error) {
      toast.error('Failed to retrieve properties')
    } finally {
      setIsSearching(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success'
    if (confidence >= 0.6) return 'text-warning'
    return 'text-danger'
  }

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.8) return 'badge-success'
    if (confidence >= 0.6) return 'badge-warning'
    return 'badge-error'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Property Lookup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for material properties using AI-powered predictions
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Material Search
            </h2>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter material name (e.g., PEG-400, TCPP, MDI)"
                className="input-field pl-10"
                disabled={isSearching}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-primary flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <AlertCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">AI-Powered Predictions</p>
                <p>
                  Results are generated using machine learning models trained on material databases.
                  Confidence scores indicate prediction reliability. Always verify critical properties
                  with supplier data sheets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Results for "{results.materialName}"
            </h2>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-success" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Retrieved</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {results.properties.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{prop.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{prop.unit}</p>
                  </div>
                  <span className={`badge ${getConfidenceBadge(prop.confidence)}`}>
                    {(prop.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {prop.value}
                </p>
                {prop.range && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Typical range: {prop.range}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {results.sources && results.sources.length > 0 && (
            <div className="border-t border-gray-200 dark:border-dark-border pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sources</h3>
              <div className="space-y-2">
                {results.sources.map((source, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {source}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.notes && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <AlertCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <p className="font-medium mb-1">Notes</p>
                  <p>{results.notes}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default AIPropertyLookup