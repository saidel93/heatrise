import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoonIcon, SunIcon, SaveIcon, AlertCircleIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    defaultReactionEnthalpy: -100,
    defaultHeatCapacity: 2.1,
    temperatureUnit: 'celsius',
    autoSaveDrafts: true,
    showCalculationSteps: true,
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setSettings((prev) => ({ ...prev, theme: savedTheme }))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings))
    localStorage.setItem('theme', settings.theme)

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    toast.success('Settings saved successfully')
  }

  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    setSettings({ ...settings, theme: newTheme })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure application preferences and defaults
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
            <div className="flex items-center gap-3">
              {settings.theme === 'dark' ? (
                <MoonIcon className="w-6 h-6 text-primary" />
              ) : (
                <SunIcon className="w-6 h-6 text-warning" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {settings.theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={handleThemeToggle}
              className="btn-outline flex items-center gap-2"
            >
              {settings.theme === 'dark' ? (
                <>
                  <SunIcon className="w-4 h-4" />
                  Switch to Light
                </>
              ) : (
                <>
                  <MoonIcon className="w-4 h-4" />
                  Switch to Dark
                </>
              )}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Default Values
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Reaction Enthalpy (kJ/mol)
              </label>
              <input
                type="number"
                value={settings.defaultReactionEnthalpy}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultReactionEnthalpy: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used when material data is unavailable
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Heat Capacity (J/g·K)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.defaultHeatCapacity}
                onChange={(e) =>
                  setSettings({ ...settings, defaultHeatCapacity: parseFloat(e.target.value) })
                }
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used when material data is unavailable
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Temperature Unit
              </label>
              <select
                value={settings.temperatureUnit}
                onChange={(e) => setSettings({ ...settings, temperatureUnit: e.target.value })}
                className="input-field"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="kelvin">Kelvin (K)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Behavior
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-save Drafts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically save simulation progress
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSaveDrafts}
                  onChange={(e) =>
                    setSettings({ ...settings, autoSaveDrafts: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Show Calculation Steps
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Display detailed calculation breakdown
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCalculationSteps}
                  onChange={(e) =>
                    setSettings({ ...settings, showCalculationSteps: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Settings Storage</p>
              <p>
                Settings are stored locally in your browser. Clearing browser data will reset all
                preferences to defaults.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <SaveIcon className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings