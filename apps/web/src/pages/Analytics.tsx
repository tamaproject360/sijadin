import { motion } from 'framer-motion'
import { ChartBar, TrendUp, FileText, Clock, Users, MapPin } from 'phosphor-react'
import Card from '../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'

interface AnalyticsData {
  totalReports: number
  completedReports: number
  inProgressReports: number
  totalFiles: number
  averageProcessingTime: number
  reportsByStatus: {
    drafting: number
    processing: number
    finalized: number
  }
  reportsByMonth: Array<{
    month: string
    count: number
  }>
  topLocations: Array<{
    location: string
    count: number
  }>
}

export default function Analytics() {
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get<AnalyticsData>('/analytics')
      return response.data
    },
  })

  const stats = [
    {
      icon: FileText,
      label: 'Total Reports',
      value: analytics?.totalReports || 0,
      change: '+12%',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: TrendUp,
      label: 'Completed',
      value: analytics?.completedReports || 0,
      change: '+8%',
      color: 'from-success to-green-600',
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: analytics?.inProgressReports || 0,
      change: '+5%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      label: 'Avg. Processing Time',
      value: `${analytics?.averageProcessingTime || 0}m`,
      change: '-3%',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-6">
          <h1 className="text-5xl font-light tracking-tighter text-sapphire-900 mb-2">
            Analytics
          </h1>
          <p className="text-lg text-sapphire-500">
            Insights and statistics for your reports
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="relative overflow-hidden" padding="md">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={20} weight="bold" className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-success">{stat.change}</span>
                  </div>
                  <p className="text-sm text-sapphire-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-light tracking-tighter text-sapphire-900">
                    {stat.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <ChartBar size={20} weight="bold" className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-light tracking-tighter text-sapphire-900">
                  Reports by Status
                </h3>
                <p className="text-sm text-sapphire-500">Current distribution</p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {analytics?.reportsByStatus && Object.entries(analytics.reportsByStatus).map(([status, count]) => {
                  const total = Object.values(analytics.reportsByStatus).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  const colors = {
                    drafting: 'bg-blue-500',
                    processing: 'bg-yellow-500',
                    finalized: 'bg-success',
                  }

                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-sapphire-700 capitalize">
                          {status}
                        </span>
                        <span className="text-sm text-sapphire-500">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-vapor rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${colors[status as keyof typeof colors]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <MapPin size={20} weight="bold" className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-light tracking-tighter text-sapphire-900">
                  Top Locations
                </h3>
                <p className="text-sm text-sapphire-500">Most reported areas</p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton h-10 rounded-lg" />
                ))}
              </div>
            ) : analytics?.topLocations && analytics.topLocations.length > 0 ? (
              <div className="space-y-3">
                {analytics.topLocations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-vapor hover:bg-sapphire-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-sapphire-700">
                        {location.location}
                      </span>
                    </div>
                    <span className="text-sm text-sapphire-500">{location.count} reports</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin size={40} weight="light" className="text-sapphire-300 mx-auto mb-2" />
                <p className="text-sm text-sapphire-500">No location data yet</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Reports Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendUp size={20} weight="bold" className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-light tracking-tighter text-sapphire-900">
                Reports Timeline
              </h3>
              <p className="text-sm text-sapphire-500">Monthly report creation</p>
            </div>
          </div>

          {isLoading ? (
            <div className="skeleton h-64 rounded-lg" />
          ) : analytics?.reportsByMonth && analytics.reportsByMonth.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-64">
              {analytics.reportsByMonth.map((item, index) => {
                const maxCount = Math.max(...analytics.reportsByMonth.map(m => m.count))
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg relative group cursor-pointer"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-sapphire-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {item.count} reports
                      </div>
                    </motion.div>
                    <span className="text-xs text-sapphire-500">{item.month}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <TrendUp size={40} weight="light" className="text-sapphire-300 mx-auto mb-2" />
              <p className="text-sm text-sapphire-500">No timeline data yet</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
