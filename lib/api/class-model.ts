import { API_BASE_URL } from './config'

export interface ClassModel {
  id: string
  gradeId: string
  classId: string
  name: string
  totalStudents: number
  reportedStudents: number
  unreportedStudents: number
  maxScore: number
  minScore: number
  avgScore: number
  medianScore: number
  modelType: string
  modelSubType: string
  distribution: {
    level: string
    count: number
    students: {
      id: string
      name: string
      score: number
      badges?: number
    }[]
  }[]
}

export async function fetchClassModel(params?: { gradeId?: string; classId?: string }): Promise<ClassModel[]> {
  try {
    const url = params 
      ? `${API_BASE_URL}/class-models?${new URLSearchParams(params as Record<string, string>)}`
      : `${API_BASE_URL}/class-models`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('获取班级模型数据失败')
    return response.json()
  } catch (error) {
    console.error('获取班级模型数据错误:', error)
    throw error
  }
} 