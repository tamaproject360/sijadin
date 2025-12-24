import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Sparkle } from 'phosphor-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import api from '../../lib/axios'
import { Report } from '../../types'

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CreateReportData {
  title: string
  org_id: number
  template_id?: number
}

export default function CreateReportModal({ isOpen, onClose }: CreateReportModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')

  const createMutation = useMutation({
    mutationFn: async (data: CreateReportData) => {
      const response = await api.post<Report>('/reports', data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      onClose()
      setTitle('')
      navigate(`/reports/${data.id}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    createMutation.mutate({
      title: title.trim(),
      org_id: 1, // TODO: Get from user context
    })
  }

  const handleClose = () => {
    if (!createMutation.isPending) {
      onClose()
      setTitle('')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Report" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-teal-600 flex items-center justify-center mx-auto mb-4">
            <Sparkle size={32} weight="fill" className="text-white" />
          </div>
          <h3 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-2">
            Start Your Journey
          </h3>
          <p className="text-sapphire-500">
            Create a new travel report with AI assistance
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            label="Report Title"
            placeholder="e.g., Perjalanan Dinas ke Jakarta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </motion.div>

        {/* Info Box */}
        <motion.div
          className="p-4 rounded-xl bg-teal/5 border border-teal/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-sapphire-600">
            <span className="font-medium text-teal">💡 Pro Tip:</span> After creating the report,
            you can upload documents and let AI extract information automatically.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="teal"
            size="lg"
            fullWidth
            loading={createMutation.isPending}
          >
            Create Report
          </Button>
        </motion.div>

        {/* Error Message */}
        {createMutation.error && (
          <motion.div
            className="p-4 rounded-xl bg-error/10 border border-error/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-error">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : 'Failed to create report'}
            </p>
          </motion.div>
        )}
      </form>
    </Modal>
  )
}
