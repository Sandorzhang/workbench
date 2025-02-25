export interface AssessmentIndicator {
  id: number
  name: string
  description: string
  score: number
}

export interface AssessmentDimension {
  id: number
  name: string
  weight: number
  indicators: AssessmentIndicator[]
}

export interface AssessmentFramework {
  id: number
  name: string
  description: string
  dimensions: AssessmentDimension[]
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface AssessmentTask {
  id: number
  title: string
  grade: string
  class: string
  type: string
  status: 'draft' | 'in_progress' | 'completed'
  deadline: string
  completionRate: number
  frameworkId: number
  framework?: AssessmentFramework
}

export type CreateAssessmentTaskDto = Omit<AssessmentTask, 'id' | 'status' | 'completionRate'> 