import { motion } from 'framer-motion'
import { CalendarBlank, MapPin, User, ArrowRight } from 'phosphor-react'
import { Report } from '../../types'
import { formatDate } from '../../lib/utils'
import clsx from 'clsx'

interface ReportCardProps {
  report: Report
  onClick: () => void
}

const statusConfig = {
  drafting: {
    label: 'Draft',
    color: 'bg-sapphire-100 text-sapphire-600',
  },
  processing: {
    label: 'Processing',
    color: 'bg-teal/10 text-teal',
  },
  ready_to_review: {
    label: 'Ready to Review',
    color: 'bg-blue-100 text-blue-600',
  },
  finalized: {
    label: 'Completed',
    color: 'bg-success/10 text-success',
  },
  exported: {
    label: 'Exported',
    color: 'bg-purple-100 text-purple-600',
  },
}

export default function ReportCard({ report, onClick }: ReportCardProps) {
  const status = statusConfig[report.status] || statusConfig.drafting

  return (
    <motion.div
      className="glass rounded-2xl p-6 cursor-pointer group"
      whileHover={{ y: -4, boxShadow: '0px 20px 60px rgba(6, 182, 212, 0.12)' }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', status.color)}>
          {status.label}
        </span>
        <motion.div
          className="w-8 h-8 rounded-lg bg-vapor flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
        >
          <ArrowRight size={16} weight="bold" className="text-teal" />
        </motion.div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-medium text-sapphire-900 mb-3 line-clamp-2">
        {report.title}
      </h3>

      {/* Meta Info */}
      <div className="space-y-2 text-sm text-sapphire-600">
        <div className="flex items-center gap-2">
          <CalendarBlank size={16} weight="light" />
          <span>{formatDate(report.created_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} weight="light" />
          <span>Created by User #{report.created_by}</span>
        </div>
      </div>

      {/* Progress Bar (if processing) */}
      {report.status === 'processing' && (
        <div className="mt-4 pt-4 border-t border-sapphire-100">
          <div className="flex items-center justify-between text-xs text-sapphire-500 mb-2">
            <span>Processing...</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-sapphire-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal to-teal-600"
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
