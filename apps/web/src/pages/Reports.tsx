import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MagnifyingGlass, Funnel, FileText, Clock, CheckCircle } from 'phosphor-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import CreateReportModal from '../components/reports/CreateReportModal'
import ReportCard from '../components/reports/ReportCard'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import { Report } from '../types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Reports() {
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Fetch reports
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports', searchQuery, filterStatus],
    queryFn: async () => {
      const response = await api.get<{ reports: Report[]; total: number; page: number; page_size: number }>('/reports', {
        params: {
          search: searchQuery || undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
        },
      })
      return response.data
    },
  })

  const reports = reportsData?.reports || []

  const stats = [
    {
      icon: FileText,
      label: 'Total Reports',
      value: reports?.length || 0,
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: reports?.filter((r) => r.status === 'processing').length || 0,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: reports?.filter((r) => r.status === 'finalized').length || 0,
      color: 'from-success to-green-600',
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-light tracking-tighter text-sapphire-900 mb-2">
              Reports
            </h1>
            <p className="text-lg text-sapphire-500">
              Manage your travel reports seamlessly
            </p>
          </div>

          <Button
            variant="teal"
            size="lg"
            icon={<Plus size={24} weight="bold" />}
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-lift"
          >
            New Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="relative overflow-hidden" padding="md">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
                <div className="relative flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sapphire-500">{stat.label}</p>
                    <p className="text-3xl font-light tracking-tighter text-sapphire-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card padding="md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<MagnifyingGlass size={20} weight="light" />}
                className="!py-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'teal' : 'secondary'}
                size="md"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'drafting' ? 'teal' : 'secondary'}
                size="md"
                onClick={() => setFilterStatus('drafting')}
              >
                Draft
              </Button>
              <Button
                variant={filterStatus === 'processing' ? 'teal' : 'secondary'}
                size="md"
                onClick={() => setFilterStatus('processing')}
              >
                Processing
              </Button>
              <Button
                variant={filterStatus === 'finalized' ? 'teal' : 'secondary'}
                size="md"
                onClick={() => setFilterStatus('finalized')}
              >
                Completed
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-64">
              <div className="skeleton h-full" />
            </Card>
          ))}
        </div>
      ) : reports && reports.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reports.map((report) => (
            <motion.div key={report.id} variants={itemVariants}>
              <ReportCard
                report={report}
                onClick={() => navigate(`/reports/${report.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-vapor mx-auto mb-4 flex items-center justify-center">
              <FileText size={40} weight="light" className="text-sapphire-400" />
            </div>
            <h3 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-2">
              No reports yet
            </h3>
            <p className="text-sapphire-500 mb-6">
              Create your first report to get started
            </p>
            <Button
              variant="teal"
              icon={<Plus size={20} weight="bold" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Report
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Create Report Modal */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
