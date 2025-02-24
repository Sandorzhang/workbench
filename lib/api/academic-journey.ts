import { API_BASE_URL } from './config'

export interface LearningObjective {
  id: string
  name: string
  status: 'completed' | 'in_progress' | 'not_started' | 'excellent'
  progress: number
}

export interface Category {
  name: string
  description: string
  objectives: LearningObjective[]
}

export interface Subject {
  name: string
  code: string
  masteryRate: number
  categories: Category[]
}

export interface StudentLearningData {
  studentId: string
  subjects: Subject[]
}

export async function fetchStudentLearningObjectives(studentId: string): Promise<StudentLearningData> {
  try {
    const response = await fetch(`${API_BASE_URL}/learningObjectives?studentId=${studentId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch learning objectives')
    }
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error('Error fetching learning objectives:', error)
    throw error
  }
}

// API 请求函数
export async function fetchAcademicJourneys() {
  const response = await fetch("/api/academic-journeys")
  if (!response.ok) {
    throw new Error("Failed to fetch academic journeys")
  }
  return response.json()
} 