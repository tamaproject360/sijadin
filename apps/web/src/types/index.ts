export interface User {
  id: number
  email: string
  role: 'admin' | 'user' | 'viewer'
  created_at: string
}

export interface Organization {
  id: number
  name: string
  created_at: string
}

export interface Report {
  id: number
  org_id: number
  template_id?: number
  title: string
  status: 'drafting' | 'processing' | 'ready_to_review' | 'finalized' | 'exported'
  created_by: number
  created_at: string
  updated_at: string
}

export interface ReportFile {
  id: number
  report_id: number
  kind?: string
  filename: string
  mime: string
  size: number
  storage_key: string
  created_at: string
}

export interface ReportDraft {
  template_id: string
  title: string
  meta: {
    activity_name: string
    location: string
    date_start: string
    date_end: string
    unit: string
    participants: string[]
  }
  sections: Section[]
}

export interface Section {
  key: string
  title: string
  content?: string
  subsections?: Subsection[]
  citations?: Citation[]
  attachments?: Attachments
}

export interface Subsection {
  key: string
  content?: string
  table?: TableRow[]
}

export interface TableRow {
  [key: string]: string
}

export interface Citation {
  file_id: string
  page: number
}

export interface Attachments {
  photos?: Photo[]
  tickets?: Ticket[]
  documents?: Document[]
}

export interface Photo {
  file_id: string
  caption: string
}

export interface Ticket {
  file_id: string
  note: string
}

export interface Document {
  file_id: string
  title: string
}

export interface JobRun {
  id: number
  report_id: number
  status: 'queued' | 'running' | 'success' | 'failed'
  progress: number
  started_at?: string
  finished_at?: string
  error_json?: any
  created_at: string
}

export interface Export {
  id: number
  report_id: number
  format: 'docx' | 'pdf'
  storage_key: string
  created_at: string
}
