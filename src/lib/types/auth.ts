import type { User } from './user'

export function getUser(): User | null {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  return JSON.parse(userStr)
} 