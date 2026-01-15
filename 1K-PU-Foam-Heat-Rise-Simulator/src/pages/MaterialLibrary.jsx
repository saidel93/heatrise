import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PlusCircleIcon, SearchIcon, FilterIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import MaterialCard from '../components/MaterialCard'
import { mockMaterials } from '../data/mockMaterials'

const MaterialLibrary = () => {
  const [materials, setMaterials] = useState(mockMaterials)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    type: 'polyol',
    molecularWeight: '',
    heatCapacity: '',
    ncoContent: '',
    reactionEnthalpy: '',
    supplier: '',
    notes: '',
  })

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || material.type === filterType
      return matchesSearch && matchesType
    })
  }, [materials, searchTerm, filterType])

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.type) {
      toast.error('Please fill in required fields')
      return
    }

    const material = {
      ...newMaterial,
      id: Date.now().toString(),
      molecularWeight: parseFloat(newMaterial.molecularWeight) || 0,
      heatCapacity: parseFloat(newMaterial.heatCapacity) || 0,
      ncoContent: parseFloat(newMaterial.ncoContent) || 0,
      reactionEnthalpy: parseFloat(newMaterial.reactionEnthalpy) || 0,
    }

    setMaterials([material, ...materials])
    setShowAddModal(false)
    setNewMaterial({
      name: '',
      type: 'polyol',
      molecularWeight: '',
      heatCapacity: '',
      ncoContent: '',
      reactionEnthalpy: '',
      supplier: '',
      notes: '',
    })
    toast.success('Material added successfully')
  }

  const handleDeleteMaterial = (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter((m) => m.id !== id))
      toast.success('Material deleted')
    }
  }

  const handleEditMaterial = (id, updates) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, ...updates } : m)))
    toast.success('Material updated')
  }

  const materialTypes = [
    { value: 'all', label: 'All Materials' },
    { value: 'polyol', label: 'Polyols' },
    { value: 'catalyst', label: 'Catalysts' },
    { value: 'flame-retardant', label: 'Flame Retardants' },
    { value: 'isocyanate', label: 'Isocyanates' },
  ]

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
              Material Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your database of PU foam materials
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add Material
          </button>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search materials..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                {materialTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <MaterialCard
                  material={material}
                  onDelete={handleDeleteMaterial}
                  onEdit={handleEditMaterial}
                />
              </motion.div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No materials found</p>
            </div>
          )}
        </div>
      </motion.div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add New Material
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Material Name *
                </label>
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., PEG-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Material Type *
                </label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  className="input-field"
                >
                  <option value="polyol">Polyol</option>
                  <option value="catalyst">Catalyst</option>
                  <option value="flame-retardant">Flame Retardant</option>
                  <option value="isocyanate">Isocyanate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Molecular Weight (g/mol)
                  </label>
                  <input
                    type="number"
                    value={newMaterial.molecularWeight}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, molecularWeight: e.target.value })
                    }
                    className="input-field"
                    placeholder="400"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Heat Capacity (J/g·K)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMaterial.heatCapacity}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, heatCapacity: e.target.value })
                    }
                    className="input-field"
                    placeholder="2.1"
                  />
                </div>
              </div>

              {newMaterial.type === 'isocyanate' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      NCO Content (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newMaterial.ncoContent}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, ncoContent: e.target.value })
                      }
                      className="input-field"
                      placeholder="31.5"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reaction Enthalpy (kJ/mol)
                    </label>
                    <input
                      type="number"
                      value={newMaterial.reactionEnthalpy}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, reactionEnthalpy: e.target.value })
                      }
                      className="input-field"
                      placeholder="-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Supplier
                </label>
                <input
                  type="text"
                  value={newMaterial.supplier}
                  onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Dow Chemical"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={newMaterial.notes}
                  onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Additional information..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-outline">
                Cancel
              </button>
              <button onClick={handleAddMaterial} className="btn-primary">
                Add Material
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MaterialLibrary