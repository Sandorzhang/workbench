// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 生成随机ID
const generateId = () => Date.now() + Math.floor(Math.random() * 1000)

export class MockService {
  private static instance: MockService
  private students: any[]
  private classes: any[]

  private constructor() {
    // 从 localStorage 初始化数据或使用默认数据
    this.students = JSON.parse(localStorage.getItem('mock_students') || '[]')
    this.classes = JSON.parse(localStorage.getItem('mock_classes') || '[]')

    if (this.students.length === 0) {
      this.students = [
        {
          id: 1,
          tenantId: 1,
          name: "张三",
          studentId: "20240001",
          gender: "male",
          birthday: "2017-09-01",
          grade: "一年级",
          class: "1班",
          guardianName: "张父",
          guardianPhone: "13900000001",
          address: "北京市海淀区",
          enrollmentDate: "2023-09-01",
          status: "active"
        },
        // ... 其他初始学生数据
      ]
    }

    if (this.classes.length === 0) {
      this.classes = [
        {
          id: 1,
          tenantId: 1,
          name: "一年级1班",
          grade: "一年级",
          headTeacherId: 2,
          studentCount: 45,
          createdAt: "2023-09-01T00:00:00.000Z"
        },
        // ... 其他初始班级数据
      ]
    }
  }

  static getInstance() {
    if (!MockService.instance) {
      MockService.instance = new MockService()
    }
    return MockService.instance
  }

  private saveToStorage() {
    localStorage.setItem('mock_students', JSON.stringify(this.students))
    localStorage.setItem('mock_classes', JSON.stringify(this.classes))
  }

  // 学生相关操作
  async getStudents(tenantId: number) {
    await delay(300)
    return this.students.filter(s => s.tenantId === tenantId)
  }

  async getStudentById(id: number) {
    await delay(200)
    return this.students.find(s => s.id === id)
  }

  async createStudent(data: any) {
    await delay(500)
    const newStudent = {
      id: generateId(),
      ...data,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    this.students.push(newStudent)
    this.saveToStorage()
    return newStudent
  }

  async updateStudent(id: number, data: any) {
    await delay(500)
    const index = this.students.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Student not found')
    
    this.students[index] = { ...this.students[index], ...data }
    this.saveToStorage()
    return this.students[index]
  }

  async deleteStudent(id: number) {
    await delay(500)
    const index = this.students.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Student not found')
    
    this.students.splice(index, 1)
    this.saveToStorage()
  }

  // 班级相关操作
  async getClasses(tenantId: number) {
    await delay(300)
    return this.classes.filter(c => c.tenantId === tenantId)
  }

  async getClassById(id: number) {
    await delay(200)
    return this.classes.find(c => c.id === id)
  }

  async createClass(data: any) {
    await delay(500)
    const newClass = {
      id: generateId(),
      ...data,
      studentCount: 0,
      createdAt: new Date().toISOString()
    }
    this.classes.push(newClass)
    this.saveToStorage()
    return newClass
  }

  async updateClass(id: number, data: any) {
    await delay(500)
    const index = this.classes.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Class not found')
    
    this.classes[index] = { ...this.classes[index], ...data }
    this.saveToStorage()
    return this.classes[index]
  }

  async deleteClass(id: number) {
    await delay(500)
    const index = this.classes.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Class not found')
    
    this.classes.splice(index, 1)
    this.saveToStorage()
  }
} 