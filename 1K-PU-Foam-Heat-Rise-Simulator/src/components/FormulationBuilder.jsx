import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircleIcon } from 'lucide-react'
import MaterialRow from './MaterialRow'

const FormulationBuilder = ({ formulation, setFormulation }) => {
  const [activeTab, setActiveTab] = useState('partA')

  const addComponent = (part) => {
    const newComponent = {
      id: Date.now().toString(),
      materialName: '',
      mass: '',
      type: part === 'partA' ? 'isocyanate' : part === 'partB' ? 'polyol' : 'gas',
      catalystType: 'None',
      concentration: '',
      gasType: '',
      volume: '',
      pressure: '',
      properties: {
        molecularWeight: '',
        heatCapacity: '',
        ncoContent: '',
      },
    }
    setFormulation({
      ...formulation,
      [part]: [...formulation[part], newComponent],
    })
  }

  const updateComponent = (part, id, updates) => {
    setFormulation({
      ...formulation,
      [part]: formulation[part].map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    })
  }

  const removeComponent = (part, id) => {
    setFormulation({
      ...formulation,
      [part]: formulation[part].filter((comp) => comp.id !== id),
    })
  }

  const getTotalMass = (part) => {
    return formulation[part].reduce((sum, comp) => sum + (parseFloat(comp.mass) || 0), 0)
  }

  const tabs = [
    { key: 'partA', label: 'A Side (Isocyanate)' },
    { key: 'partB', label: 'B Side (Polyol & Additives)' },
    { key: 'partC', label: 'C Side (Gas/Blowing Agent)' },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formulation Builder</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: A Side = {getTotalMass('partA').toFixed(2)}g | B Side = {getTotalMass('partB').toFixed(2)}g | C Side = {getTotalMass('partC').toFixed(2)}g
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Manual Input Mode:</strong> Enter all material properties directly. For catalysts, specify type and concentration for CRM calculations. For gases, specify type, volume, and pressure.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-dark-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {formulation[activeTab].length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No components added yet. Click "Add Component" to start.
          </div>
        ) : (
          formulation[activeTab].map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <MaterialRow
                component={component}
                onUpdate={(updates) => updateComponent(activeTab, component.id, updates)}
                onRemove={() => removeComponent(activeTab, component.id)}
                partType={activeTab}
              />
            </motion.div>
          ))
        )}
      </div>

      <button
        onClick={() => addComponent(activeTab)}
        className="btn-outline w-full mt-4 flex items-center justify-center gap-2"
      >
        <PlusCircleIcon className="w-5 h-5" />
        Add Component
      </button>
    </div>
  )
}

export default FormulationBuilder