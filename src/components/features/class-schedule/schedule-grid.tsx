'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { ScheduleViewType, TimeSlot, Timetable } from "@/lib/types/schedule"
import { fetchTimeSlots, fetchTimetable } from "@/lib/api/class-schedule"
import { SUBJECTS } from "@/lib/constants/subjects"

interface ScheduleGridProps {
  type: ScheduleViewType
  gradeId: string
  classId?: string
}

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五']

export function ScheduleGrid({ type, gradeId, classId }: ScheduleGridProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [timetable, setTimetable] = useState<Timetable | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (type === 'class' && !gradeId) return
    loadData()
  }, [type, gradeId, classId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [slotsData, timetableData] = await Promise.all([
        type === 'teacher' ? fetchTimeSlots('default') : fetchTimeSlots(gradeId),
        fetchTimetable({
          type,
          ...(type === 'teacher' && { teacherId: getCurrentTeacherId() }),
          ...(type === 'class' && { gradeId, classId })
        })
      ])
      
      console.log('Loaded data:', { slotsData, timetableData }) // 调试日志
      setTimeSlots(slotsData)
      setTimetable(timetableData[0] || null)
    } catch (error) {
      console.error('加载课表数据失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载课表失败"
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentTeacherId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.id || 'T1' // 默认返回T1用于测试
  }

  const getCourseInfo = (timeSlotId: string, weekday: number) => {
    if (!timetable?.entries) return null

    const entry = timetable.entries.find(e => 
      e.timeSlotId === timeSlotId && e.weekday === weekday
    )
    
    if (!entry) return null

    return {
      subject: SUBJECTS[entry.courseId as keyof typeof SUBJECTS] || entry.courseId,
      classroom: entry.classroomId ? `${entry.classroomId}教室` : '',
      teacher: entry.teacherId ? `${entry.teacherId}老师` : '',
      class: entry.classId ? `${entry.classId}班` : ''
    }
  }

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (type === 'class' && !gradeId) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        请先选择年级
      </div>
    )
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col className="w-[15%]"/>
          <col className="w-[17%]"/>
          <col className="w-[17%]"/>
          <col className="w-[17%]"/>
          <col className="w-[17%]"/>
          <col className="w-[17%]"/>
        </colgroup>
        <thead>
          <tr>
            <th className="border p-2 bg-muted font-medium text-sm">时间</th>
            {WEEKDAYS.map((day, index) => (
              <th key={day} className="border p-2 bg-muted font-medium text-sm">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slot => (
            <tr key={slot.id}>
              <td className="border p-2 text-sm bg-muted/50">
                <div className="font-medium">{slot.name}</div>
                <div className="text-muted-foreground text-xs">
                  {slot.startTime}-{slot.endTime}
                </div>
              </td>
              {WEEKDAYS.map((_, index) => {
                const course = getCourseInfo(slot.id, index + 1)
                return (
                  <td key={index} className="border p-2 align-top">
                    {course ? (
                      <div className="text-sm space-y-0.5">
                        <div className="font-medium truncate">{course.subject}</div>
                        {type === 'class' && course.teacher && (
                          <div className="text-xs text-muted-foreground truncate">
                            {course.teacher}
                          </div>
                        )}
                        {type === 'teacher' && course.class && (
                          <div className="text-xs text-muted-foreground truncate">
                            {course.class}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground truncate">
                          {course.classroom}
                        </div>
                      </div>
                    ) : (
                      <div className="h-[52px]"></div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 