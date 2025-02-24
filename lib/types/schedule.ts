export interface TimeSlot {
  id: string
  name: string
  startTime: string
  endTime: string
}

export interface ScheduleTemplate {
  id: string
  name: string
  gradeId: string
  timeSlots: TimeSlot[]
}

export interface ScheduleEntry {
  timeSlotId: string
  courseId: string
  teacherId: string
  classroomId: string
}

export interface Timetable {
  id: string
  academicYearId: string
  semesterId: string
  gradeId: string
  classId: string
  scheduleTemplateId: string
  entries: ScheduleEntry[]
}

export type ScheduleViewType = 'class' | 'teacher' 