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
  status: 'draft' | 'published'
  dimensions: AssessmentDimension[]
  createdAt: string
  updatedAt: string
}

export interface CreateFrameworkDto {
  name: string
  description: string
  dimensions: Omit<AssessmentDimension, 'id'>[]
}

export interface UpdateFrameworkDto {
  name?: string
  description?: string
  status?: 'draft' | 'published'
  dimensions?: Omit<AssessmentDimension, 'id'>[]
}

// 暂时注释掉任务相关的类型
/*
export interface AssessmentTask { ... }
export interface CreateTaskDto { ... }
*/ 