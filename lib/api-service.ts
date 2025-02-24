const API_BASE = 'http://localhost:3100'

export class ApiService {
  // 学生相关操作
  static async getStudents(tenantId: number) {
    const response = await fetch(`${API_BASE}/students?tenantId=${tenantId}`)
    return response.json()
  }

  static async createStudent(data: any) {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async updateStudent(id: number, data: any) {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async deleteStudent(id: number) {
    await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
    })
  }

  // 班级相关操作
  static async getClasses(tenantId: number) {
    const response = await fetch(`${API_BASE}/classes?tenantId=${tenantId}`)
    return response.json()
  }

  // ... 其他班级操作
} 