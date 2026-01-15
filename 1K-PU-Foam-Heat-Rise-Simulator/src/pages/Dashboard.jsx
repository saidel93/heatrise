import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BeakerIcon, PlusCircleIcon, FileText, ChartBarIcon } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'
import SafetyBadge from '../components/SafetyBadge'

const Dashboard = () => {
  const navigate = useNavigate()
  const { simulations, draftSimulation } = useSimulationStore()

  const recentSimulations = simulations.slice(0, 5)

  const stats = {
    total: simulations.length,
    thisMonth: simulations.filter((sim) => {
      const simDate = new Date(sim.createdAt)
      const now = new Date()
      return (
        simDate.getMonth() === now.getMonth() &&
        simDate.getFullYear() === now.getFullYear()
      )
    }).length,
    avgTempRise:
      simulations.length > 0
        ? (
            simulations.reduce((sum, sim) => sum + (sim.results?.temperatureRise || 0), 0) /
            simulations.length
          ).toFixed(1)
        : 0,
    highRisk: simulations.filter((sim) => (sim.results?.temperatureRise || 0) > 50).length,
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              1K PU Foam Heat-Rise Simulator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Professional thermodynamic analysis for polyurethane foam systems
            </p>
          </div>
          <button
            onClick={() => navigate('/new-simulation')}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            New Simulation
          </button>
        </div>

        {draftSimulation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-warning/10 border-warning/30 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BeakerIcon className="w-6 h-6 text-warning" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Draft Simulation Available
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have an unsaved simulation in progress
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/new-simulation')}
                className="btn-outline"
              >
                Resume Draft
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BeakerIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Simulations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisMonth}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Temp Rise</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.avgTempRise}°C
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-danger/10 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-danger" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Risk</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highRisk}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Simulations</h2>
          <button onClick={() => navigate('/reports')} className="btn-outline text-sm">
            View All Reports
          </button>
        </div>

        {recentSimulations.length === 0 ? (
          <div className="text-center py-12">
            <BeakerIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No simulations yet. Create your first simulation to get started.
            </p>
            <button onClick={() => navigate('/new-simulation')} className="btn-primary">
              Create Simulation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Temperature Rise</th>
                  <th>Safety Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentSimulations.map((sim, index) => (
                  <motion.tr
                    key={sim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="font-medium">{sim.name}</td>
                    <td>{new Date(sim.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="font-semibold">
                        {sim.results?.temperatureRise?.toFixed(1) || 'N/A'}°C
                      </span>
                    </td>
                    <td>
                      <SafetyBadge temperatureRise={sim.results?.temperatureRise || 0} />
                    </td>
                    <td>
                      <button
                        onClick={() => navigate('/reports')}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        View Report
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard