import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SaveIcon, PlayIcon, TrashIcon, XCircleIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import FormulationBuilder from '../components/FormulationBuilder'
import CalculationEngine from '../components/CalculationEngine'
import ResultsDisplay from '../components/ResultsDisplay'
import useSimulationStore from '../store/simulationStore'

const NewSimulation = () => {
  const navigate = useNavigate()
  const { addSimulation, saveDraft, loadDraft, clearDraft } = useSimulationStore()

  const [simulationName, setSimulationName] = useState('')
  const [formulation, setFormulation] = useState({
    partA: [],
    partB: [],
    partC: [],
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setSimulationName(draft.name || '')
      setFormulation(draft.formulation || { partA: [], partB: [], partC: [] })
      if (draft.results) {
        setResults(draft.results)
      }
      toast.success('Draft simulation loaded')
    }
  }, [])

  const handleSaveDraft = () => {
    const draft = {
      name: simulationName,
      formulation,
      results,
      savedAt: new Date().toISOString(),
    }
    saveDraft(draft)
    toast.success('Draft saved successfully')
  }

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear the draft?')) {
      clearDraft()
      setSimulationName('')
      setFormulation({ partA: [], partB: [], partC: [] })
      setResults(null)
      toast.success('Draft cleared')
    }
  }

  const handleClearResults = () => {
    if (window.confirm('Are you sure you want to clear the results?')) {
      setResults(null)
      toast.success('Results cleared')
    }
  }

  const handleRunSimulation = () => {
    if (!simulationName.trim()) {
      toast.error('Please enter a simulation name')
      return
    }

    if (formulation.partA.length === 0 && formulation.partB.length === 0) {
      toast.error('Please add at least one component to A Side or B Side')
      return
    }

    const allComponents = [...formulation.partA, ...formulation.partB, ...formulation.partC]
    const hasInvalidComponents = allComponents.some(
      (comp) => !comp.materialName || !comp.mass || parseFloat(comp.mass) <= 0
    )

    if (hasInvalidComponents) {
      toast.error('Please fill in all required fields (name and mass) for each component')
      return
    }

    setIsCalculating(true)

    setTimeout(() => {
      setIsCalculating(false)
    }, 1000)
  }

  const handleSaveSimulation = () => {
    if (!results) {
      toast.error('Please run the simulation first')
      return
    }

    const simulation = {
      name: simulationName,
      formulation,
      results,
    }

    addSimulation(simulation)
    clearDraft()
    toast.success('Simulation saved successfully')
    navigate('/dashboard')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              New Simulation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Build your 3-part formulation and calculate heat rise
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleClearDraft} className="btn-outline flex items-center gap-2">
              <TrashIcon className="w-4 h-4" />
              Clear
            </button>
            <button onClick={handleSaveDraft} className="btn-secondary flex items-center gap-2">
              <SaveIcon className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Simulation Name
          </label>
          <input
            type="text"
            value={simulationName}
            onChange={(e) => setSimulationName(e.target.value)}
            placeholder="e.g., PU Foam Formulation #1"
            className="input-field"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FormulationBuilder formulation={formulation} setFormulation={setFormulation} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <CalculationEngine
          formulation={formulation}
          onCalculate={handleRunSimulation}
          isCalculating={isCalculating}
          setResults={setResults}
        />
      </motion.div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ResultsDisplay results={results} formulation={formulation} />
          <div className="flex justify-between items-center gap-3 mt-6">
            <button onClick={handleClearResults} className="btn-outline flex items-center gap-2">
              <XCircleIcon className="w-4 h-4" />
              Clear Results
            </button>
            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-outline">
                Cancel
              </button>
              <button onClick={handleSaveSimulation} className="btn-primary flex items-center gap-2">
                <SaveIcon className="w-4 h-4" />
                Save Simulation
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default NewSimulation