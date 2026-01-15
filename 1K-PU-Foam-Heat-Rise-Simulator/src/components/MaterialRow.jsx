import { TrashIcon } from 'lucide-react'

const MaterialRow = ({ component, onUpdate, onRemove, partType }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  const handlePropertiesChange = (propertyField, value) => {
    onUpdate({
      properties: {
        ...component.properties,
        [propertyField]: value,
      },
    })
  }

  const getTypeOptions = () => {
    if (partType === 'partA') {
      return [
        { value: 'isocyanate', label: 'Isocyanate' },
      ]
    } else if (partType === 'partB') {
      return [
        { value: 'polyol', label: 'Polyol' },
        { value: 'catalyst', label: 'Catalyst' },
        { value: 'surfactant', label: 'Surfactant' },
        { value: 'flame-retardant', label: 'Flame Retardant' },
        { value: 'additive', label: 'Additive' },
      ]
    } else if (partType === 'partC') {
      return [
        { value: 'gas', label: 'Gas/Blowing Agent' },
      ]
    }
    return []
  }

  const handleGasTypeChange = (gasType) => {
    handleChange('gasType', gasType)
    if (gasType === 'HFO-1233zd') {
      handlePropertiesChange('molecularWeight', 132.03)
      handlePropertiesChange('heatCapacity', 0.85)
    }
  }

  const isHFOGas = component.gasType === 'HFO-1233zd'

  return (
    <div className="p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            Material Name *
          </label>
          <input
            type="text"
            value={component.materialName || ''}
            onChange={(e) => handleChange('materialName', e.target.value)}
            placeholder="e.g., PEG-400"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            Type *
          </label>
          <select
            value={component.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="input-field text-sm"
          >
            {getTypeOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            Mass (g) *
          </label>
          <input
            type="number"
            step="0.01"
            value={component.mass || ''}
            onChange={(e) => handleChange('mass', e.target.value)}
            placeholder="0.00"
            className="input-field text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {component.type !== 'gas' && (
          <>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Molecular Weight (g/mol)
              </label>
              <input
                type="number"
                step="0.01"
                value={component.properties?.molecularWeight || ''}
                onChange={(e) => handlePropertiesChange('molecularWeight', parseFloat(e.target.value) || 0)}
                placeholder="400"
                className="input-field text-sm"
              />
            </div>

            {partType === 'partA' && component.type === 'isocyanate' && (
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  %NCO Content (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={component.ncoContent || ''}
                  onChange={(e) => handleChange('ncoContent', parseFloat(e.target.value) || 0)}
                  placeholder="31.5"
                  className="input-field text-sm"
                />
              </div>
            )}

            {partType === 'partB' && ['catalyst', 'surfactant', 'flame-retardant'].includes(component.type) && (
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Cp (J/g·K) - Optional
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={component.heatCapacity || ''}
                  onChange={(e) => handleChange('heatCapacity', parseFloat(e.target.value) || 0)}
                  placeholder="2.1"
                  className="input-field text-sm"
                />
              </div>
            )}

            {partType === 'partB' && !['catalyst', 'surfactant', 'flame-retardant'].includes(component.type) && (
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Heat Capacity (J/g·K)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={component.properties?.heatCapacity || ''}
                  onChange={(e) => handlePropertiesChange('heatCapacity', parseFloat(e.target.value) || 2.0)}
                  placeholder="2.1"
                  className="input-field text-sm"
                />
              </div>
            )}
          </>
        )}

        {component.type === 'catalyst' && (
          <>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Catalyst Type *
              </label>
              <select
                value={component.catalystType || 'None'}
                onChange={(e) => handleChange('catalystType', e.target.value)}
                className="input-field text-sm"
              >
                <option value="None">None</option>
                <option value="DMDEE">DMDEE</option>
                <option value="SnOct2">SnOct₂</option>
                <option value="DBTDL">DBTDL</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Concentration (% by weight) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={component.concentration || ''}
                onChange={(e) => handleChange('concentration', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="input-field text-sm"
              />
            </div>
          </>
        )}

        {component.type === 'gas' && (
          <>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Gas Type *
              </label>
              <select
                value={component.gasType || ''}
                onChange={(e) => handleGasTypeChange(e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Select Gas Type</option>
                <option value="CO2">CO₂ (Carbon Dioxide)</option>
                <option value="N2">N₂ (Nitrogen)</option>
                <option value="HFC-245fa">HFC-245fa</option>
                <option value="HFC-365mfc">HFC-365mfc</option>
                <option value="Pentane">Pentane</option>
                <option value="Cyclopentane">Cyclopentane</option>
                <option value="HFO-1233zd">HFO-1233zd</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Molecular Weight (g/mol) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={component.properties?.molecularWeight || ''}
                onChange={(e) => handlePropertiesChange('molecularWeight', parseFloat(e.target.value) || 0)}
                placeholder="44.01"
                className="input-field text-sm"
                readOnly={isHFOGas}
                disabled={isHFOGas}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Heat Capacity (J/g·K)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={component.properties?.heatCapacity || ''}
                onChange={(e) => handlePropertiesChange('heatCapacity', parseFloat(e.target.value) || 0)}
                placeholder="0.85"
                className="input-field text-sm"
                readOnly={isHFOGas}
                disabled={isHFOGas}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={onRemove}
          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors flex items-center gap-1 text-sm"
          title="Remove component"
        >
          <TrashIcon className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  )
}

export default MaterialRow