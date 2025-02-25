export interface User {
  id: string | number
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  name: string
  tenantId: number
} 