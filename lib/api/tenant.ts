import { API_BASE_URL } from './config'

export interface Tenant {
  id: number
  name: string
  shortName: string
  code: string
  type: 'PRIMARY_SCHOOL'
  address: string
  phone: string
  logo: string
}

export async function fetchCurrentTenant(): Promise<Tenant> {
  try {
    // 从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      throw new Error('No user found')
    }
    
    const user = JSON.parse(userStr)
    if (!user.tenantId) {
      throw new Error('No tenant ID found for user')
    }

    // 直接访问租户资源
    const response = await fetch(`http://localhost:3100/tenants/${user.tenantId}`)
    console.log('API URL:', `http://localhost:3100/tenants/${user.tenantId}`)
    
    if (!response.ok) {
      console.error('Response status:', response.status)
      throw new Error('Failed to fetch tenant')
    }
    
    const data = await response.json()
    console.log('Raw API Response:', data)
    
    if (!data) {
      throw new Error('No tenant data received')
    }
    
    return data
  } catch (error) {
    console.error('Tenant API Error:', error)
    throw error
  }
} 