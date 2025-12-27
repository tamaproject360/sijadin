import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  FloppyDisk,
  ClockCounterClockwise,
  Export,
  CheckCircle,
} from 'phosphor-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TiptapEditor from '../components/editor/TiptapEditor'
import SectionNav from '../components/editor/SectionNav'
import CitationPanel from '../components/editor/CitationPanel'
import api from '../lib/axios'
import { ReportDraft, ReportFile } from '../types'

export default function DraftEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [activeSection, setActiveSection] = useState<string>('')
  const [draftData, setDraftData] = useState<ReportDraft | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch draft
  const { data: draft, isLoading: draftLoading } = useQuery({
    queryKey: ['reports', id, 'draft'],
    queryFn: async () => {
      const response = await api.get<ReportDraft>(`/reports/${id}/draft`)
      return response.data
    },
    enabled: !!id,
  })

  // Fetch files for citations
  const { data: files = [] } = useQuery({
    queryKey: ['reports', id, 'files'],
    queryFn: async () => {
      const response = await api.get<ReportFile[]>(`/reports/${id}/files`)
      return response.data
    },
    enabled: !!id,
  })

  // Initialize draft data
  useEffect(() => {
    if (draft) {
      setDraftData(draft)
      if (draft.sections.length > 0 && !activeSection) {
        setActiveSection(draft.sections[0].key)
      }
    }
  }, [draft])

  // Save draft mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ReportDraft) => {
      const response = await api.patch(`/reports/${id}/draft`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', id, 'draft'] })
      setHasChanges(false)
    },
  })

  const handleSectionContentChange = (content: string) => {
    if (!draftData) return

    const updatedSections = draftData.sections.map((section) => {
      if (section.key === activeSection) {
        return { ...section, content }
      }
      return section
    })

    setDraftData({ ...draftData, sections: updatedSections })
    setHasChanges(true)
  }

  const handleSave = () => {
    if (draftData) {
      saveMutation.mutate(draftData)
    }
  }

  const currentSection = draftData?.sections.find((s) => s.key === activeSection)
  const currentCitations = currentSection?.citations || []

  if (draftLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="h-96">
          <div className="skeleton h-full" />
        </Card>
      </div>
    )
  }

  if (!draftData) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="text-center py-16">
          <h3 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-2">
            Draft not found
          </h3>
          <Button variant="teal" onClick={() => navigate(`/reports/${id}`)}>
            Back to Report
          </Button>
        </Card>
      </div>
    )
  }

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
          onClick={() => navigate(`/reports/${id}`)}
          className="mb-4"
        >
          Back to Report
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-light tracking-tighter text-sapphire-900 mb-2">
              {draftData.title}
            </h1>
            <p className="text-sapphire-500">{draftData.meta.activity_name}</p>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                Unsaved changes
              </span>
            )}
            <Button
              variant="secondary"
              icon={<ClockCounterClockwise size={20} weight="light" />}
              onClick={() => navigate(`/reports/${id}/versions`)}
            >
              History
            </Button>
            <Button
              variant="teal"
              icon={<FloppyDisk size={20} weight="fill" />}
              onClick={handleSave}
              loading={saveMutation.isPending}
              disabled={!hasChanges}
            >
              Save Draft
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Section Navigation */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="sticky top-6">
            <h2 className="text-lg font-medium text-sapphire-900 mb-4">Sections</h2>
            <SectionNav
              sections={draftData.sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </Card>
        </motion.div>

        {/* Editor Area */}
        <motion.div
          className="col-span-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="mb-6">
              <h2 className="text-2xl font-light tracking-tighter text-sapphire-900">
                {currentSection?.title}
              </h2>
            </div>

            <TiptapEditor
              content={currentSection?.content || ''}
              onChange={handleSectionContentChange}
              placeholder={`Write ${currentSection?.title.toLowerCase()}...`}
            />
          </Card>
        </motion.div>

        {/* Citations & Info Panel */}
        <motion.div
          className="col-span-3 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CitationPanel citations={currentCitations} files={files} />

          {/* Export Card */}
          <Card>
            <h3 className="text-lg font-medium text-sapphire-900 mb-4">Export</h3>
            <div className="space-y-2">
              <Button
                variant="secondary"
                fullWidth
                icon={<Export size={20} weight="light" />}
                onClick={() => navigate(`/reports/${id}/export`)}
              >
                Export Options
              </Button>
            </div>
          </Card>

          {/* Progress Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} weight="fill" className="text-teal" />
                <h3 className="text-lg font-medium text-sapphire-900">Progress</h3>
              </div>
              <p className="text-sm text-sapphire-600 mb-3">
                {draftData.sections.filter((s) => s.content).length} of{' '}
                {draftData.sections.length} sections completed
              </p>
              <div className="w-full h-2 bg-vapor rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal to-teal/80 transition-all duration-500"
                  style={{
                    width: `${
                      (draftData.sections.filter((s) => s.content).length /
                        draftData.sections.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
