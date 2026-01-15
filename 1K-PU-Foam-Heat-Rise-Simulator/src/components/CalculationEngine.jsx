import { PlayIcon, LoaderIcon } from 'lucide-react'
import { calculateThermodynamics } from '../utils/thermodynamicCalculations'

const CalculationEngine = ({ formulation, onCalculate, isCalculating, setResults }) => {
  const handleCalculate = () => {
    try {
      const calculationResults = calculateThermodynamics(formulation)
      
      if (calculationResults && typeof calculationResults === 'object') {
        setResults(calculationResults)
        onCalculate()
      } else {
        console.error('Invalid calculation results:', calculationResults)
        setResults({
          temperatureRise: 0,
          heatRelease: 0,
          ncoMoles: 0,
          heatCapacity: 0,
          steps: [],
        })
        onCalculate()
      }
    } catch (error) {
      console.error('Calculation error:', error)
      setResults({
        temperatureRise: 0,
        heatRelease: 0,
        ncoMoles: 0,
        heatCapacity: 0,
        steps: [],
      })
      onCalculate()
    }
  }

  const isFormulationValid = () => {
    const allComponents = [...formulation.partA, ...formulation.partB]
    
    if (allComponents.length === 0) return false

    const hasValidComponents = allComponents.every((comp) => {
      const hasName = comp.materialName && comp.materialName.trim() !== ''
      const hasMass = comp.mass && parseFloat(comp.mass) > 0
      return hasName && hasMass
    })

    const hasPartA = formulation.partA.length > 0 && formulation.partA.some((c) => parseFloat(c.mass) > 0)
    const hasPartB = formulation.partB.length > 0 && formulation.partB.some((c) => parseFloat(c.mass) > 0)

    const hasValidNCO = formulation.partA.every((comp) => {
      if (comp.type === 'isocyanate') {
        const ncoContent = parseFloat(comp.ncoContent)
        return !isNaN(ncoContent) && ncoContent >= 1 && ncoContent <= 100
      }
      return true
    })
    
    return hasValidComponents && hasPartA && hasPartB && hasValidNCO
  }

  const getValidationMessage = () => {
    if (formulation.partA.length === 0 || formulation.partB.length === 0) {
      return 'Please add components to both Part A and Part B before running the calculation.'
    }

    const hasInvalidNCO = formulation.partA.some((comp) => {
      if (comp.type === 'isocyanate') {
        const ncoContent = parseFloat(comp.ncoContent)
        return isNaN(ncoContent) || ncoContent < 1 || ncoContent > 100
      }
      return false
    })

    if (hasInvalidNCO) {
      return 'Please enter %NCO content (1-100%) for all A-side isocyanate components.'
    }

    const hasInvalidComponents = [...formulation.partA, ...formulation.partB].some(
      (comp) => !comp.materialName || !comp.mass || parseFloat(comp.mass) <= 0
    )

    if (hasInvalidComponents) {
      return 'Please fill in all required fields (name and mass) for each component.'
    }

    return 'Please add valid components to both Part A and Part B.'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Run Calculation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Calculate temperature rise using thermodynamic equations with A-side %NCO content
          </p>
        </div>
        <button
          onClick={handleCalculate}
          disabled={!isFormulationValid() || isCalculating}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? (
            <>
              <LoaderIcon className="w-5 h-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <PlayIcon className="w-5 h-5" />
              Run Simulation
            </>
          )}
        </button>
      </div>

      {!isFormulationValid() && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            {getValidationMessage()}
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Calculation Method</h4>
        <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <p>1. Calculate NCO moles: n_NCO = (mass_iso × %NCO/100) / MW_iso</p>
          <p>2. Calculate heat release: Q = n_NCO × ΔH_rxn</p>
          <p>3. Calculate total heat capacity: Cp_total = Σ(mass_i × Cp_i) + Cp_gas</p>
          <p>4. Calculate temperature rise: ΔT = Q / Cp_total</p>
          <p className="text-xs mt-2 italic">Note: %NCO content required for A-side isocyanates</p>
        </div>
      </div>
    </div>
  )
}

export default CalculationEngine