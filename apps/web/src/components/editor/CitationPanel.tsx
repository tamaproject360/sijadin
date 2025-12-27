import { motion } from 'framer-motion'
import { FileText, Image as ImageIcon, File } from 'phosphor-react'
import Card from '../ui/Card'
import { Citation, ReportFile } from '../../types'

interface CitationPanelProps {
  citations: Citation[]
  files: ReportFile[]
}

export default function CitationPanel({ citations, files }: CitationPanelProps) {
  const getFileById = (fileId: string) => {
    return files.find((f) => f.id.toString() === fileId)
  }

  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon size={20} weight="light" />
    if (mime.includes('pdf')) return <FileText size={20} weight="light" />
    return <File size={20} weight="light" />
  }

  if (citations.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-sapphire-900 mb-4">Citations</h3>
        <p className="text-sm text-sapphire-500 text-center py-8">
          No citations for this section
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-lg font-medium text-sapphire-900 mb-4">
        Citations ({citations.length})
      </h3>
      <div className="space-y-2">
        {citations.map((citation, index) => {
          const file = getFileById(citation.file_id)
          if (!file) return null

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-vapor hover:bg-vapor/70 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center text-sapphire-600">
                {getFileIcon(file.mime)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sapphire-900 truncate">
                  {file.filename}
                </p>
                <p className="text-xs text-sapphire-500">Page {citation.page}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
