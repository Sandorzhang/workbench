import { API_BASE_URL } from './config'

export interface Subject {
  code: string
  name: string
  shortName: string
  color: string
  icon: string
  order: number
}

export async function fetchSubjects(): Promise<Subject[]> {
  const response = await fetch(`${API_BASE_URL}/subjects`)
  if (!response.ok) {
    throw new Error('Failed to fetch subjects')
  }
  return response.json()
} 