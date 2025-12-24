import { motion } from 'framer-motion'
import { File, FilePdf, FileDoc, Image, Trash } from 'phosphor-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReportFile } from '../../types'
import { formatFileSize } from '../../lib/utils'
import api from '../../lib/axios'
import Button from '../ui/Button'

interface FileListProps {
  files: ReportFile[]
  reportId: number
}

const getFileIcon = (mime: string) => {
  if (mime.includes('pdf')) return FilePdf
  if (mime.includes('word')) return FileDoc
  if (mime.includes('image')) return Image
  return File
}

const getFileColor = (mime: string) => {
  if (mime.includes('pdf')) return 'from-error to-red-600'
  if (mime.includes('word')) return 'from-blue-500 to-blue-600'
  if (mime.includes('image')) return 'from-purple-500 to-purple-600'
  return 'from-sapphire to-sapphire-800'
}

export default function FileList({ files, reportId }: FileListProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (fileId: number) => {
      await api.delete(`/files/${fileId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', reportId.toString(), 'files'] })
    },
  })

  return (
    <div className="space-y-3">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.mime)
        const colorClass = getFileColor(file.mime)

        return (
          <motion.div
            key={file.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-vapor/50 hover:bg-vapor transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
              <Icon size={24} weight="fill" className="text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sapphire-900 truncate">
                {file.filename}
              </p>
              <div className="flex items-center gap-2 text-sm text-sapphire-500">
                <span>{formatFileSize(file.size)}</span>
                {file.kind && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-sapphire-300" />
                    <span className="capitalize">{file.kind}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash size={18} weight="light" />}
                onClick={() => deleteMutation.mutate(file.id)}
                loading={deleteMutation.isPending}
                className="!p-2 text-error hover:bg-error/10"
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
