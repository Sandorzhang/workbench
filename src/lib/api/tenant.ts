import { API_BASE_URL } from './config'

export interface Tenant {
  id: number
  name: string
  shortName: string
  code: string
  type: string
  address: string
  phone: string
  logo: string
}

export async function fetchCurrentTenant(): Promise<Tenant> {
  const userStr = localStorage.getItem('user')
  if (!userStr) throw new Error('User not found')
  
  const user = JSON.parse(userStr)
  
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${user.tenantId}`)
    
    if (!response.ok) {
      console.error('Response status:', response.status)
      throw new Error('Failed to fetch tenant')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching tenant:', error)
    throw error
  }
} 