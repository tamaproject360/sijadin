import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CloudArrowUp, File, CheckCircle, Warning } from 'phosphor-react'
import Card from '../ui/Card'
import api from '../../lib/axios'
import { formatFileSize } from '../../lib/utils'
import clsx from 'clsx'

interface FileUploadZoneProps {
  reportId: number
}

export default function FileUploadZone({ reportId }: FileUploadZoneProps) {
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      const response = await api.post(`/reports/${reportId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', reportId.toString(), 'files'] })
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadMutation.mutate(acceptedFiles)
      }
    },
    [uploadMutation]
  )

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: uploadMutation.isPending,
  })

  return (
    <Card padding="none" className="overflow-hidden">
      <div
        {...getRootProps()}
        className={clsx(
          'relative p-12 cursor-pointer transition-all duration-300',
          isDragActive && 'bg-teal/5',
          uploadMutation.isPending && 'pointer-events-none'
        )}
      >
        <input {...getInputProps()} />

        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-sapphire/5"
          animate={{
            backgroundPosition: isDragActive ? ['0% 0%', '100% 100%'] : '0% 0%',
          }}
          transition={{
            duration: 2,
            repeat: isDragActive ? Infinity : 0,
            repeatType: 'reverse',
          }}
        />

        {/* Content */}
        <div className="relative text-center">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal to-teal-600 mx-auto mb-6 flex items-center justify-center"
            animate={{
              scale: isDragActive ? [1, 1.1, 1] : 1,
              rotate: isDragActive ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: isDragActive ? Infinity : 0,
            }}
          >
            <CloudArrowUp size={40} weight="fill" className="text-white" />
          </motion.div>

          <h3 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-2">
            {isDragActive ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-sapphire-500 mb-6">
            Drag & drop or click to browse
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-sapphire-400">
            <span className="px-3 py-1 rounded-full bg-vapor">PDF</span>
            <span className="px-3 py-1 rounded-full bg-vapor">DOCX</span>
            <span className="px-3 py-1 rounded-full bg-vapor">JPG</span>
            <span className="px-3 py-1 rounded-full bg-vapor">PNG</span>
          </div>

          <p className="text-xs text-sapphire-400 mt-4">
            Maximum file size: 50MB
          </p>
        </div>

        {/* Scanning Animation */}
        <AnimatePresence>
          {uploadMutation.isPending && (
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-teal-600 mx-auto mb-4 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <CloudArrowUp size={32} weight="fill" className="text-white" />
                </motion.div>
                <p className="text-lg font-medium text-sapphire-900 mb-1">
                  Uploading...
                </p>
                <p className="text-sm text-sapphire-500">
                  {acceptedFiles.length} file(s)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Status */}
      <AnimatePresence>
        {uploadMutation.isSuccess && (
          <motion.div
            className="p-4 bg-success/10 border-t border-success/20 flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle size={24} weight="fill" className="text-success" />
            <div className="flex-1">
              <p className="text-sm font-medium text-success">Upload Successful</p>
              <p className="text-xs text-success/80">
                {acceptedFiles.length} file(s) uploaded successfully
              </p>
            </div>
          </motion.div>
        )}

        {uploadMutation.isError && (
          <motion.div
            className="p-4 bg-error/10 border-t border-error/20 flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Warning size={24} weight="fill" className="text-error" />
            <div className="flex-1">
              <p className="text-sm font-medium text-error">Upload Failed</p>
              <p className="text-xs text-error/80">
                {uploadMutation.error instanceof Error
                  ? uploadMutation.error.message
                  : 'Please try again'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
