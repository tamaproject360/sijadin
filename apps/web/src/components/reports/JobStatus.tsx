import { motion } from 'framer-motion'
import { Sparkle, CheckCircle, Warning, Clock } from 'phosphor-react'
import Card from '../ui/Card'
import { JobRun } from '../../types'

interface JobStatusProps {
  job?: JobRun
}

const statusConfig = {
  queued: {
    icon: Clock,
    label: 'Queued',
    color: 'from-sapphire to-sapphire-600',
    bgColor: 'bg-sapphire/10',
    textColor: 'text-sapphire',
  },
  running: {
    icon: Sparkle,
    label: 'Processing',
    color: 'from-teal to-teal-600',
    bgColor: 'bg-teal/10',
    textColor: 'text-teal',
  },
  success: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'from-success to-green-600',
    bgColor: 'bg-success/10',
    textColor: 'text-success',
  },
  failed: {
    icon: Warning,
    label: 'Failed',
    color: 'from-error to-red-600',
    bgColor: 'bg-error/10',
    textColor: 'text-error',
  },
}

export default function JobStatus({ job }: JobStatusProps) {
  if (!job) return null

  const config = statusConfig[job.status]
  const Icon = config.icon

  return (
    <Card className="relative overflow-hidden">
      {/* Background Animation */}
      {job.status === 'running' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal/5 via-teal/10 to-teal/5"
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      <div className="relative">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}
            animate={job.status === 'running' ? { rotate: [0, 360] } : {}}
            transition={{
              duration: 3,
              repeat: job.status === 'running' ? Infinity : 0,
              ease: 'linear',
            }}
          >
            <Icon size={28} weight="fill" className="text-white" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-medium text-sapphire-900">
                AI Processing
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                {config.label}
              </span>
            </div>

            <p className="text-sapphire-600 mb-4">
              {job.status === 'queued' && 'Your report is in the queue and will be processed shortly.'}
              {job.status === 'running' && 'AI is analyzing your documents and generating the draft.'}
              {job.status === 'success' && 'Your report has been processed successfully!'}
              {job.status === 'failed' && 'An error occurred while processing your report.'}
            </p>

            {/* Progress Bar */}
            {(job.status === 'queued' || job.status === 'running') && (
              <div>
                <div className="flex items-center justify-between text-sm text-sapphire-500 mb-2">
                  <span>Progress</span>
                  <span className="font-mono">{Math.round(job.progress)}%</span>
                </div>
                <div className="h-3 bg-sapphire-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${config.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {job.status === 'failed' && job.error_json && (
              <div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20">
                <p className="text-sm text-error">
                  {job.error_json.message || 'An unexpected error occurred'}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="mt-4 flex items-center gap-4 text-xs text-sapphire-400">
              {job.started_at && (
                <span>Started: {new Date(job.started_at).toLocaleTimeString()}</span>
              )}
              {job.finished_at && (
                <span>Finished: {new Date(job.finished_at).toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
