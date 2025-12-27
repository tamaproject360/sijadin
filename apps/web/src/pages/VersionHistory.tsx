import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ClockCounterClockwise, ArrowCounterClockwise } from 'phosphor-react'
import { format } from 'date-fns'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import api from '../lib/axios'

interface DraftVersion {
  id: number
  report_id: number
  version_no: number
  draft_json: any
  created_by: number
  created_at: string
}

export default function VersionHistory() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch versions
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['reports', id, 'versions'],
    queryFn: async () => {
      const response = await api.get<DraftVersion[]>(`/reports/${id}/draft/versions`)
      return response.data
    },
    enabled: !!id,
  })

  // Restore version mutation
  const restoreMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const response = await api.post(`/reports/${id}/draft/restore`, {
        version_id: versionId,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', id, 'draft'] })
      queryClient.invalidateQueries({ queryKey: ['reports', id, 'versions'] })
      navigate(`/reports/${id}/draft`)
    },
  })

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
          onClick={() => navigate(`/reports/${id}/draft`)}
          className="mb-4"
        >
          Back to Editor
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <ClockCounterClockwise size={32} weight="light" className="text-teal" />
          <h1 className="text-5xl font-light tracking-tighter text-sapphire-900">
            Version History
          </h1>
        </div>
        <p className="text-sapphire-500">
          View and restore previous versions of your draft
        </p>
      </motion.div>

      {/* Versions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-24 rounded-xl" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <ClockCounterClockwise
                size={48}
                weight="light"
                className="text-sapphire-400 mx-auto mb-4"
              />
              <p className="text-sapphire-500">No version history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-vapor hover:bg-vapor/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-teal/80 flex items-center justify-center text-white font-medium">
                      v{version.version_no}
                    </div>
                    <div>
                      <p className="font-medium text-sapphire-900">
                        Version {version.version_no}
                        {index === 0 && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-sapphire-500">
                        {format(new Date(version.created_at), 'PPpp')}
                      </p>
                    </div>
                  </div>

                  {index !== 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<ArrowCounterClockwise size={18} weight="bold" />}
                      onClick={() => restoreMutation.mutate(version.id)}
                      loading={restoreMutation.isPending}
                    >
                      Restore
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
