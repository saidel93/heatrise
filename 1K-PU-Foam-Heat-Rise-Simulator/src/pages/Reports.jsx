import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, DownloadIcon, TrashIcon, CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import useSimulationStore from '../store/simulationStore'
import SafetyBadge from '../components/SafetyBadge'
import ReportGenerator from '../components/ReportGenerator'

const Reports = () => {
  const { simulations, deleteSimulation } = useSimulationStore()
  const [selectedSimulation, setSelectedSimulation] = useState(null)
  const [dateFilter, setDateFilter] = useState('all')

  const filteredSimulations = simulations.filter((sim) => {
    if (dateFilter === 'all') return true
    const simDate = new Date(sim.createdAt)
    const now = new Date()
    if (dateFilter === 'today') {
      return simDate.toDateString() === now.toDateString()
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return simDate >= weekAgo
    }
    if (dateFilter === 'month') {
      return (
        simDate.getMonth() === now.getMonth() && simDate.getFullYear() === now.getFullYear()
      )
    }
    return true
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this simulation?')) {
      deleteSimulation(id)
      toast.success('Simulation deleted')
    }
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and download simulation reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="card">
          {filteredSimulations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No simulations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Temperature Rise</th>
                    <th>Heat Release</th>
                    <th>Safety Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSimulations.map((sim, index) => (
                    <motion.tr
                      key={sim.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <td className="font-medium">{sim.name}</td>
                      <td>{new Date(sim.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className="font-semibold">
                          {sim.results?.temperatureRise?.toFixed(1) || 'N/A'}°C
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold">
                          {sim.results?.heatRelease?.toFixed(1) || 'N/A'} kJ
                        </span>
                      </td>
                      <td>
                        <SafetyBadge temperatureRise={sim.results?.temperatureRise || 0} />
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSimulation(sim)}
                            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                          >
                            <DownloadIcon className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => handleDelete(sim.id)}
                            className="text-danger hover:text-danger/80 text-sm font-medium flex items-center gap-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {selectedSimulation && (
        <ReportGenerator
          simulation={selectedSimulation}
          onClose={() => setSelectedSimulation(null)}
        />
      )}
    </div>
  )
}

export default Reports