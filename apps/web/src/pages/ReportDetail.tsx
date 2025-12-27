import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarBlank,
  Upload,
  Play,
  FileText,
  FilePdf,
} from 'phosphor-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import FileUploadZone from '../components/reports/FileUploadZone'
import FileList from '../components/reports/FileList'
import JobStatus from '../components/reports/JobStatus'
import api from '../lib/axios'
import { Report, ReportFile, JobRun } from '../types'

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch report
  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ['reports', id],
    queryFn: async () => {
      const response = await api.get<Report>(`/reports/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  // Fetch files
  const { data: filesData, isLoading: filesLoading } = useQuery({
    queryKey: ['reports', id, 'files'],
    queryFn: async () => {
      const response = await api.get<{ files: ReportFile[], total: number }>(`/reports/${id}/files`)
      return response.data
    },
    enabled: !!id,
  })

  const files = filesData?.files || []

  // Fetch job status
  const { data: job } = useQuery({
    queryKey: ['reports', id, 'job'],
    queryFn: async () => {
      const response = await api.get<JobRun>(`/reports/${id}/job`)
      return response.data
    },
    enabled: !!id && report?.status === 'processing',
    refetchInterval: report?.status === 'processing' ? 2000 : false,
  })

  // Process report mutation
  const processMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/reports/${id}/process`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', id] })
      queryClient.invalidateQueries({ queryKey: ['reports', id, 'job'] })
    },
  })

  if (reportLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="h-96">
          <div className="skeleton h-full" />
        </Card>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="text-center py-16">
          <h3 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-2">
            Report not found
          </h3>
          <Button variant="teal" onClick={() => navigate('/reports')}>
            Back to Reports
          </Button>
        </Card>
      </div>
    )
  }

  const canProcess = files.length > 0 && report.status === 'drafting'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={20} weight="bold" />}
          onClick={() => navigate('/reports')}
          className="mb-4"
        >
          Back to Reports
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-light tracking-tighter text-sapphire-900 mb-2">
              {report.title}
            </h1>
            <div className="flex items-center gap-4 text-sapphire-500">
              <div className="flex items-center gap-2">
                <CalendarBlank size={18} weight="light" />
                <span>{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-sapphire-300" />
              <span className="capitalize">{report.status.replace('_', ' ')}</span>
            </div>
          </div>

          {canProcess && (
            <Button
              variant="teal"
              size="lg"
              icon={<Play size={24} weight="fill" />}
              onClick={() => processMutation.mutate()}
              loading={processMutation.isPending}
              className="shadow-lift"
            >
              Process with AI
            </Button>
          )}
        </div>
      </motion.div>

      {/* Job Status */}
      {(report.status === 'processing' || job) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <JobStatus job={job} />
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload & Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          {report.status === 'drafting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileUploadZone reportId={report.id} />
            </motion.div>
          )}

          {/* Files List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light tracking-tighter text-sapphire-900">
                  Uploaded Files
                </h2>
                <span className="text-sm text-sapphire-500">
                  {files.length} files
                </span>
              </div>

              {filesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                  ))}
                </div>
              ) : files.length > 0 ? (
                <FileList files={files} reportId={report.id} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-vapor mx-auto mb-4 flex items-center justify-center">
                    <Upload size={32} weight="light" className="text-sapphire-400" />
                  </div>
                  <p className="text-sapphire-500">No files uploaded yet</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Metadata & Info */}
        <div className="space-y-6">
          {/* Report Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h3 className="text-lg font-medium text-sapphire-900 mb-4">
                Report Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-sapphire-500 block mb-1">Status</label>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal/10 text-teal capitalize">
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-sapphire-500 block mb-1">Created</label>
                  <p className="text-sapphire-900">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-sapphire-500 block mb-1">Last Updated</label>
                  <p className="text-sapphire-900">
                    {new Date(report.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 className="text-lg font-medium text-sapphire-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<FileText size={20} weight="light" />}
                  disabled={report.status !== 'ready_to_review'}
                  onClick={() => navigate(`/reports/${id}/draft`)}
                >
                  Edit Draft
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<FilePdf size={20} weight="light" />}
                  disabled={report.status !== 'ready_to_review' && report.status !== 'finalized'}
                  onClick={() => navigate(`/reports/${id}/export`)}
                >
                  Export Options
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <h3 className="text-lg font-medium text-sapphire-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-sapphire-600 mb-4">
                  Upload your documents and let AI do the heavy lifting
                </p>
                <Button variant="teal" size="sm" fullWidth>
                  View Guide
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
