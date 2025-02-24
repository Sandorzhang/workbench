import { API_BASE_URL } from './config'

interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
  features: {
    id: number
    code: string
    name: string
  }[]
}

export async function fetchUserApplications(): Promise<Application[]> {
  const userStr = localStorage.getItem('user')
  if (!userStr) throw new Error('User not found')
  
  const user = JSON.parse(userStr)
  const userAppResponse = await fetch(`${API_BASE_URL}/userApplications?userId=${user.id}`)
  const userAppData = await userAppResponse.json()
  const userApp = userAppData[0]

  const tenantAppResponse = await fetch(`${API_BASE_URL}/tenantApplications?tenantId=${user.tenantId}`)
  const tenantAppData = await tenantAppResponse.json()
  const tenantApp = tenantAppData[0]

  return tenantApp.applications.filter((app: any) => userApp.applicationIds.includes(app.id))
} 