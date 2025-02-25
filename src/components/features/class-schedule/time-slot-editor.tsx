'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { TimeSlot } from "@/lib/types/schedule"

interface TimeSlotEditorProps {
  gradeId: string
}

export function TimeSlotEditor({ gradeId }: TimeSlotEditorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const { toast } = useToast()

  // 加载默认时间段
  useEffect(() => {
    if (!gradeId) return
    
    // 模拟加载数据
    const defaultSlots: TimeSlot[] = [
      { id: '1', name: '第一节', startTime: '08:00', endTime: '08:45' },
      { id: '2', name: '第二节', startTime: '08:55', endTime: '09:40' },
      { id: '3', name: '第三节', startTime: '10:00', endTime: '10:45' },
      { id: '4', name: '第四节', startTime: '10:55', endTime: '11:40' }
    ]
    setTimeSlots(defaultSlots)
  }, [gradeId])

  const handleAddSlot = () => {
    const newSlot: TimeSlot = {
      id: `new-${Date.now()}`,
      name: `第${timeSlots.length + 1}节`,
      startTime: '',
      endTime: ''
    }
    setTimeSlots([...timeSlots, newSlot])
  }

  const handleRemoveSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id))
  }

  const handleUpdateSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  const handleSave = async () => {
    try {
      // 验证时间格式
      const isValid = timeSlots.every(slot => {
        const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        return timePattern.test(slot.startTime) && timePattern.test(slot.endTime)
      })

      if (!isValid) {
        throw new Error('请输入正确的时间格式 (HH:MM)')
      }

      // TODO: 调用API保存时间段
      toast({
        title: "成功",
        description: "时间段设置已保存"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "保存失败"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>课程时间段设置</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddSlot}>
            <Plus className="h-4 w-4 mr-2" />
            添加时间段
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存设置
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeSlots.map((slot, index) => (
            <div key={slot.id} className="flex items-center gap-4">
              <Input
                value={slot.name}
                onChange={(e) => handleUpdateSlot(slot.id, 'name', e.target.value)}
                placeholder="课节名称"
                className="w-32"
              />
              <Input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleUpdateSlot(slot.id, 'startTime', e.target.value)}
                className="w-32"
              />
              <span className="text-muted-foreground">至</span>
              <Input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleUpdateSlot(slot.id, 'endTime', e.target.value)}
                className="w-32"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveSlot(slot.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 