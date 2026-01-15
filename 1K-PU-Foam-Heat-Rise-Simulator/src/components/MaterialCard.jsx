import { useState } from 'react'
import { motion } from 'framer-motion'
import { EditIcon, TrashIcon, SaveIcon, XIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const MaterialCard = ({ material, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(material)

  const handleSave = () => {
    if (!editData.name || !editData.type) {
      toast.error('Name and type are required')
      return
    }
    onEdit(material.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(material)
    setIsEditing(false)
  }

  const getTypeColor = (type) => {
    const colors = {
      polyol: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      catalyst: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'flame-retardant': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      isocyanate: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="input-field text-sm"
            placeholder="Material name"
          />
          <select
            value={editData.type}
            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
            className="input-field text-sm"
          >
            <option value="polyol">Polyol</option>
            <option value="catalyst">Catalyst</option>
            <option value="flame-retardant">Flame Retardant</option>
            <option value="isocyanate">Isocyanate</option>
          </select>
          <input
            type="number"
            value={editData.molecularWeight}
            onChange={(e) => setEditData({ ...editData, molecularWeight: parseFloat(e.target.value) })}
            className="input-field text-sm"
            placeholder="Molecular weight"
          />
          <input
            type="number"
            step="0.01"
            value={editData.heatCapacity}
            onChange={(e) => setEditData({ ...editData, heatCapacity: parseFloat(e.target.value) })}
            className="input-field text-sm"
            placeholder="Heat capacity"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1">
              <SaveIcon className="w-4 h-4" />
              Save
            </button>
            <button onClick={handleCancel} className="btn-outline flex-1 text-sm flex items-center justify-center gap-1">
              <XIcon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{material.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(material.type)}`}>
            {material.type}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
            title="Edit"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(material.id)}
            className="p-1.5 text-danger hover:bg-danger/10 rounded transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {material.molecularWeight && (
          <div className="flex justify-between">
            <span>Molecular Weight:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {material.molecularWeight} g/mol
            </span>
          </div>
        )}
        {material.heatCapacity && (
          <div className="flex justify-between">
            <span>Heat Capacity:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {material.heatCapacity} J/g·K
            </span>
          </div>
        )}
        {material.ncoContent && (
          <div className="flex justify-between">
            <span>NCO Content:</span>
            <span className="font-medium text-gray-900 dark:text-white">{material.ncoContent}%</span>
          </div>
        )}
        {material.supplier && (
          <div className="flex justify-between">
            <span>Supplier:</span>
            <span className="font-medium text-gray-900 dark:text-white">{material.supplier}</span>
          </div>
        )}
      </div>

      {material.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-600 dark:text-gray-400">{material.notes}</p>
        </div>
      )}
    </motion.div>
  )
}

export default MaterialCard