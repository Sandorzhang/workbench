export interface User {
  id: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  name: string
  tenantId: number
  permissions?: string[]
} 