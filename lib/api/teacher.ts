import { API_BASE_URL } from './config'

export interface Teacher {
  id: number
  tenantId: number
  username: string
  name: string
  role: string
  subjects?: string[]
  status: 'active' | 'inactive'
  phone?: string
  email?: string
  title?: string
  joinDate?: string
  education?: string
  major?: string
}

// 获取租户下的所有教师
export async function fetchTeachers(tenantId: number): Promise<Teacher[]> {
  const response = await fetch(`${API_BASE_URL}/teachers?tenantId=${tenantId}`)
  if (!response.ok) throw new Error('Failed to fetch teachers')
  return response.json()
}

// 获取单个教师信息
export async function fetchTeacher(id: number): Promise<Teacher> {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`)
  if (!response.ok) throw new Error('Failed to fetch teacher')
  return response.json()
}

// 创建教师
export async function createTeacher(data: Omit<Teacher, 'id'>): Promise<Teacher> {
  const response = await fetch(`${API_BASE_URL}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to create teacher')
  return response.json()
}

// 更新教师信息
export async function updateTeacher(id: number, data: Partial<Teacher>): Promise<Teacher> {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to update teacher')
  return response.json()
}

// 删除教师
export async function deleteTeacher(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete teacher')
} 