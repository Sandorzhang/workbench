import { API_BASE_URL } from './config'
import type { TimeSlot, ScheduleTemplate, Timetable } from '@/lib/types/schedule'

// 模拟课表数据
const MOCK_TIMETABLES = {
  class: {
    G1: {
      id: "1",
      academicYearId: "2023-2024",
      semesterId: "1",
      gradeId: "G1",
      classId: "C1",
      scheduleTemplateId: "1",
      entries: [
        { timeSlotId: "1", courseId: "CHINESE", teacherId: "T1", classroomId: "R101", weekday: 1 },
        { timeSlotId: "2", courseId: "MATH", teacherId: "T2", classroomId: "R101", weekday: 1 },
        { timeSlotId: "3", courseId: "ENGLISH", teacherId: "T3", classroomId: "R101", weekday: 1 },
        { timeSlotId: "4", courseId: "PE", teacherId: "T4", classroomId: "GYM", weekday: 1 },
        
        { timeSlotId: "1", courseId: "MATH", teacherId: "T2", classroomId: "R101", weekday: 2 },
        { timeSlotId: "2", courseId: "CHINESE", teacherId: "T1", classroomId: "R101", weekday: 2 },
        { timeSlotId: "3", courseId: "SCIENCE", teacherId: "T5", classroomId: "R101", weekday: 2 },
        { timeSlotId: "4", courseId: "ART", teacherId: "T6", classroomId: "ART", weekday: 2 },

        { timeSlotId: "1", courseId: "ENGLISH", teacherId: "T3", classroomId: "R101", weekday: 3 },
        { timeSlotId: "2", courseId: "CHINESE", teacherId: "T1", classroomId: "R101", weekday: 3 },
        { timeSlotId: "3", courseId: "MATH", teacherId: "T2", classroomId: "R101", weekday: 3 },
        { timeSlotId: "4", courseId: "MUSIC", teacherId: "T7", classroomId: "MUSIC", weekday: 3 }
      ]
    }
  },
  teacher: {
    // 语文老师
    "1": {
      id: "t1",
      academicYearId: "2023-2024",
      semesterId: "1",
      teacherId: "1",
      entries: [
        { timeSlotId: "1", courseId: "CHINESE", classId: "C1", classroomId: "R101", weekday: 1 },
        { timeSlotId: "2", courseId: "CHINESE", classId: "C2", classroomId: "R102", weekday: 1 },
        { timeSlotId: "3", courseId: "CHINESE", classId: "C3", classroomId: "R103", weekday: 1 },
        { timeSlotId: "4", courseId: "CHINESE", classId: "C1", classroomId: "R101", weekday: 2 },
        { timeSlotId: "1", courseId: "CHINESE", classId: "C2", classroomId: "R102", weekday: 3 },
        { timeSlotId: "2", courseId: "CHINESE", classId: "C3", classroomId: "R103", weekday: 4 }
      ]
    },
    // 数学老师
    "2": {
      id: "t2",
      academicYearId: "2023-2024",
      semesterId: "1",
      teacherId: "2",
      entries: [
        { timeSlotId: "1", courseId: "MATH", classId: "C1", classroomId: "R201", weekday: 2 },
        { timeSlotId: "2", courseId: "MATH", classId: "C2", classroomId: "R202", weekday: 2 },
        { timeSlotId: "3", courseId: "MATH", classId: "C3", classroomId: "R203", weekday: 2 },
        { timeSlotId: "4", courseId: "MATH", classId: "C1", classroomId: "R201", weekday: 3 },
        { timeSlotId: "1", courseId: "MATH", classId: "C2", classroomId: "R202", weekday: 4 },
        { timeSlotId: "2", courseId: "MATH", classId: "C3", classroomId: "R203", weekday: 5 }
      ]
    },
    // 英语老师
    "3": {
      id: "t3",
      academicYearId: "2023-2024",
      semesterId: "1",
      teacherId: "3",
      entries: [
        { timeSlotId: "1", courseId: "ENGLISH", classId: "C1", classroomId: "R301", weekday: 3 },
        { timeSlotId: "2", courseId: "ENGLISH", classId: "C2", classroomId: "R302", weekday: 3 },
        { timeSlotId: "3", courseId: "ENGLISH", classId: "C3", classroomId: "R303", weekday: 3 },
        { timeSlotId: "4", courseId: "ENGLISH", classId: "C1", classroomId: "R301", weekday: 4 },
        { timeSlotId: "1", courseId: "ENGLISH", classId: "C2", classroomId: "R302", weekday: 5 },
        { timeSlotId: "2", courseId: "ENGLISH", classId: "C3", classroomId: "R303", weekday: 5 }
      ]
    }
  }
}

// 默认时间段
const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', name: '第一节', startTime: '08:00', endTime: '08:45' },
  { id: '2', name: '第二节', startTime: '08:55', endTime: '09:40' },
  { id: '3', name: '第三节', startTime: '10:00', endTime: '10:45' },
  { id: '4', name: '第四节', startTime: '10:55', endTime: '11:40' }
]

// 获取时间段模板
export async function fetchTimeSlots(gradeId: string): Promise<TimeSlot[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return DEFAULT_TIME_SLOTS
}

// 保存时间段模板
export async function saveTimeSlots(gradeId: string, timeSlots: TimeSlot[]): Promise<void> {
  try {
    // 先获取现有模板
    const response = await fetch(`${API_BASE_URL}/scheduleTemplates?gradeId=${gradeId}`)
    const templates = await response.json()
    const template = templates[0]

    if (template) {
      // 更新现有模板
      const updateResponse = await fetch(`${API_BASE_URL}/scheduleTemplates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          timeSlots
        })
      })
      if (!updateResponse.ok) throw new Error('更新时间段模板失败')
    } else {
      // 创建新模板
      const createResponse = await fetch(`${API_BASE_URL}/scheduleTemplates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now().toString(),
          gradeId,
          name: `${gradeId}课程时间`,
          timeSlots
        })
      })
      if (!createResponse.ok) throw new Error('创建时间段模板失败')
    }
  } catch (error) {
    console.error('保存时间段模板错误:', error)
    throw error
  }
}

// 获取课表数据
export async function fetchTimetable(params: {
  type: 'class' | 'teacher'
  gradeId?: string
  classId?: string
  teacherId?: string
}): Promise<Timetable[]> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (params.type === 'teacher') {
    const teacherId = params.teacherId || '1' // 默认显示语文老师的课表
    const teacherTimetable = MOCK_TIMETABLES.teacher[teacherId]
    if (!teacherTimetable) {
      console.warn(`未找到教师 ${teacherId} 的课表数据，使用默认课表`)
      return [MOCK_TIMETABLES.teacher['1']] // 找不到对应教师时返回默认课表
    }
    return [teacherTimetable]
  } else {
    if (!params.gradeId) return []
    return [MOCK_TIMETABLES.class[params.gradeId as keyof typeof MOCK_TIMETABLES.class]]
  }
}

// 更新课表
export async function updateTimetable(timetableId: string, data: Partial<Timetable>): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables/${timetableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update timetable')
  } catch (error) {
    console.error('Error updating timetable:', error)
    throw error
  }
} 