import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  ArrowLeft,
  FilePdf,
  FileDoc,
  Download,
  Spinner,
} from 'phosphor-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import api from '../lib/axios'
import { Export } from '../types'

export default function ExportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [exportingFormat, setExportingFormat] = useState<'docx' | 'pdf' | null>(null)

  // Fetch recent exports
  const { data: exports = [], isLoading } = useQuery({
    queryKey: ['reports', id, 'exports'],
    queryFn: async () => {
      const response = await api.get<Export[]>(`/reports/${id}/exports`)
      return response.data
    },
    enabled: !!id,
  })

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (format: 'docx' | 'pdf') => {
      setExportingFormat(format)
      const response = await api.post<Export>(`/reports/${id}/export`, null, {
        params: { format },
      })
      return response.data
    },
    onSuccess: (data) => {
      // Download the file
      window.open(`${api.defaults.baseURL}/exports/${data.id}/download`, '_blank')
      setExportingFormat(null)
    },
    onError: () => {
      setExportingFormat(null)
    },
  })

  const handleDownload = (exportId: number) => {
    window.open(`${api.defaults.baseURL}/exports/${exportId}/download`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          onClick={() => navigate(`/reports/${id}`)}
          className="mb-4"
        >
          Back to Report
        </Button>

        <h1 className="text-5xl font-light tracking-tighter text-sapphire-900 mb-2">
          Export Report
        </h1>
        <p className="text-sapphire-500">
          Download your report in DOCX or PDF format
        </p>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h2 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-6">
            Choose Format
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* DOCX Export */}
            <motion.button
              onClick={() => exportMutation.mutate('docx')}
              disabled={exportMutation.isPending}
              className="relative p-6 rounded-2xl border-2 border-sapphire-200 hover:border-teal hover:shadow-lift transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-4 right-4">
                {exportingFormat === 'docx' ? (
                  <Spinner size={24} className="text-teal animate-spin" />
                ) : (
                  <FileDoc size={32} weight="light" className="text-sapphire-400 group-hover:text-teal transition-colors" />
                )}
              </div>
              <div className="pr-12">
                <h3 className="text-xl font-medium text-sapphire-900 mb-2">
                  Microsoft Word
                </h3>
                <p className="text-sm text-sapphire-600 mb-4">
                  Editable DOCX format with template styling
                </p>
                <div className="flex items-center gap-2 text-teal font-medium">
                  <Download size={18} weight="bold" />
                  <span>Export as DOCX</span>
                </div>
              </div>
            </motion.button>

            {/* PDF Export */}
            <motion.button
              onClick={() => exportMutation.mutate('pdf')}
              disabled={exportMutation.isPending}
              className="relative p-6 rounded-2xl border-2 border-sapphire-200 hover:border-teal hover:shadow-lift transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-4 right-4">
                {exportingFormat === 'pdf' ? (
                  <Spinner size={24} className="text-teal animate-spin" />
                ) : (
                  <FilePdf size={32} weight="light" className="text-sapphire-400 group-hover:text-teal transition-colors" />
                )}
              </div>
              <div className="pr-12">
                <h3 className="text-xl font-medium text-sapphire-900 mb-2">
                  PDF Document
                </h3>
                <p className="text-sm text-sapphire-600 mb-4">
                  Print-ready PDF with preserved formatting
                </p>
                <div className="flex items-center gap-2 text-teal font-medium">
                  <Download size={18} weight="bold" />
                  <span>Export as PDF</span>
                </div>
              </div>
            </motion.button>
          </div>
        </Card>
      </motion.div>

      {/* Recent Exports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h2 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-6">
            Recent Exports
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : exports.length === 0 ? (
            <div className="text-center py-12">
              <Download size={48} weight="light" className="text-sapphire-400 mx-auto mb-4" />
              <p className="text-sapphire-500">No exports yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exports.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-vapor hover:bg-vapor/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      {exp.format === 'pdf' ? (
                        <FilePdf size={24} weight="light" className="text-red-500" />
                      ) : (
                        <FileDoc size={24} weight="light" className="text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sapphire-900">
                        {exp.format.toUpperCase()} Export
                      </p>
                      <p className="text-sm text-sapphire-500">
                        {new Date(exp.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download size={18} weight="bold" />}
                    onClick={() => handleDownload(exp.id)}
                  >
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
