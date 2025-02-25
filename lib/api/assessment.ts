import { AssessmentFramework, AssessmentTask, CreateFrameworkDto, UpdateFrameworkDto, CreateTaskDto } from "../types/assessment"

// 获取框架列表
export async function fetchFrameworks(): Promise<AssessmentFramework[]> {
  try {
    const res = await fetch('/api/assessment-frameworks')
    if (!res.ok) throw new Error('Failed to fetch frameworks')
    return res.json()
  } catch (error) {
    console.error('Error fetching frameworks:', error)
    return []
  }
}

// 获取单个框架
export async function fetchFrameworkById(id: number): Promise<AssessmentFramework | null> {
  try {
    const res = await fetch(`/api/assessment-frameworks/${id}`)
    if (!res.ok) throw new Error('Failed to fetch framework')
    return res.json()
  } catch (error) {
    console.error('Error fetching framework:', error)
    return null
  }
}

// 创建框架
export async function createFramework(data: CreateFrameworkDto): Promise<AssessmentFramework | null> {
  try {
    const res = await fetch('/api/assessment-frameworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create framework')
    return res.json()
  } catch (error) {
    console.error('Error creating framework:', error)
    return null
  }
}

// 更新框架
export async function updateFramework(
  id: number, 
  data: UpdateFrameworkDto
): Promise<AssessmentFramework | null> {
  try {
    const res = await fetch(`/api/assessment-frameworks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update framework')
    return res.json()
  } catch (error) {
    console.error('Error updating framework:', error)
    return null
  }
}

// 获取任务列表
export async function fetchTasks(): Promise<AssessmentTask[]> {
  try {
    const res = await fetch('/api/assessment-tasks')
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

// 获取单个任务
export async function fetchTaskById(id: number): Promise<AssessmentTask | null> {
  try {
    const res = await fetch(`/api/assessment-tasks/${id}`)
    if (!res.ok) throw new Error('Failed to fetch task')
    return res.json()
  } catch (error) {
    console.error('Error fetching task:', error)
    return null
  }
}

// 创建任务
export async function createTask(data: CreateTaskDto): Promise<AssessmentTask | null> {
  try {
    const res = await fetch('/api/assessment-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: 'draft',
        completionRate: 0
      })
    })
    if (!res.ok) throw new Error('Failed to create task')
    return res.json()
  } catch (error) {
    console.error('Error creating task:', error)
    return null
  }
}

// 更新任务
export async function updateTask(
  id: number, 
  data: Partial<AssessmentTask>
): Promise<AssessmentTask | null> {
  try {
    const res = await fetch(`/api/assessment-tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
  } catch (error) {
    console.error('Error updating task:', error)
    return null
  }
} 