'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash, ArrowLeft, Clock } from "lucide-react"
import { TimeSlot } from "@/lib/types/schedule"
import { cn } from "@/lib/utils"

interface ScheduleTemplate {
  id: string
  name: string
  timeSlots: TimeSlot[]
  order?: number
}

export default function ScheduleSettingsPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([
    {
      id: "1",
      name: "标准作息时间",
      order: 1,
      timeSlots: [
        { id: "1", name: "第一节", startTime: "08:00", endTime: "08:45" },
        { id: "2", name: "第二节", startTime: "08:55", endTime: "09:40" }
      ]
    },
    {
      id: "2",
      name: "下午作息时间",
      order: 2,
      timeSlots: [
        { id: "1", name: "第一节", startTime: "13:30", endTime: "14:15" },
        { id: "2", name: "第二节", startTime: "14:25", endTime: "15:10" }
      ]
    }
  ])
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const defaultTemplate = templates.find(t => t.order === 1)
    if (defaultTemplate) {
      setSelectedTemplate(defaultTemplate)
    }
  }, [])

  const handleAddTemplate = () => {
    const newTemplate: ScheduleTemplate = {
      id: Date.now().toString(),
      name: "新作息时间",
      order: Math.max(...templates.map(t => t.order || 0)) + 1,
      timeSlots: []
    }
    setTemplates([...templates, newTemplate])
    setSelectedTemplate(newTemplate)
    setIsEditing(true)
  }

  const handleEditTemplate = (template: ScheduleTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      const defaultTemplate = templates.find(t => t.order === 1)
      setSelectedTemplate(defaultTemplate || null)
      setIsEditing(false)
    }
  }

  const handleSaveTemplate = (template: ScheduleTemplate) => {
    setTemplates(templates.map(t => t.id === template.id ? template : t))
    setSelectedTemplate(template)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (selectedTemplate?.id) {
      const originalTemplate = templates.find(t => t.id === selectedTemplate.id)
      setSelectedTemplate(originalTemplate || null)
    }
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/class-schedule')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">课表基础设置</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理课程时间安排
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 space-y-4">
          <Button onClick={handleAddTemplate} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            添加时间安排
          </Button>
          <div className="space-y-2">
            {templates
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(template => (
                <Card 
                  key={template.id} 
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    selectedTemplate?.id === template.id && "border-primary",
                    template.order === 1 && "bg-muted/50",
                    isEditing && selectedTemplate?.id !== template.id && "opacity-50"
                  )}
                  onClick={() => !isEditing && setSelectedTemplate(template)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        {template.order === 1 && (
                          <p className="text-xs text-muted-foreground">默认时间安排</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {template.timeSlots.length} 个时间段
                        </p>
                      </div>
                      {!isEditing && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation()
                            handleEditTemplate(template)
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTemplate(template.id)
                            }}
                            disabled={template.order === 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </div>

        <div className="col-span-3">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {isEditing ? "编辑时间安排" : "时间安排详情"}
                </CardTitle>
                {!isEditing && (
                  <CardDescription>
                    查看时间安排详情，点击编辑按钮进行修改
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  // 编辑表单
                  <>
                    <div className="space-y-2">
                      <Label>名称</Label>
                      <Input 
                        value={selectedTemplate.name}
                        onChange={e => setSelectedTemplate({
                          ...selectedTemplate,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>时间段</Label>
                      {selectedTemplate.timeSlots.map((slot, index) => (
                        <div key={slot.id} className="grid grid-cols-4 gap-2">
                          <Input 
                            value={slot.name}
                            onChange={e => {
                              const newSlots = [...selectedTemplate.timeSlots]
                              newSlots[index] = { ...slot, name: e.target.value }
                              setSelectedTemplate({
                                ...selectedTemplate,
                                timeSlots: newSlots
                              })
                            }}
                          />
                          <Input 
                            type="time"
                            value={slot.startTime}
                            onChange={e => {
                              const newSlots = [...selectedTemplate.timeSlots]
                              newSlots[index] = { ...slot, startTime: e.target.value }
                              setSelectedTemplate({
                                ...selectedTemplate,
                                timeSlots: newSlots
                              })
                            }}
                          />
                          <Input 
                            type="time"
                            value={slot.endTime}
                            onChange={e => {
                              const newSlots = [...selectedTemplate.timeSlots]
                              newSlots[index] = { ...slot, endTime: e.target.value }
                              setSelectedTemplate({
                                ...selectedTemplate,
                                timeSlots: newSlots
                              })
                            }}
                          />
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => {
                              const newSlots = selectedTemplate.timeSlots.filter((_, i) => i !== index)
                              setSelectedTemplate({
                                ...selectedTemplate,
                                timeSlots: newSlots
                              })
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => {
                        setSelectedTemplate({
                          ...selectedTemplate,
                          timeSlots: [
                            ...selectedTemplate.timeSlots,
                            {
                              id: Date.now().toString(),
                              name: `第${selectedTemplate.timeSlots.length + 1}节`,
                              startTime: "08:00",
                              endTime: "08:45"
                            }
                          ]
                        })
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        添加时间段
                      </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        取消
                      </Button>
                      <Button onClick={() => handleSaveTemplate(selectedTemplate)}>
                        保存
                      </Button>
                    </div>
                  </>
                ) : (
                  // 详情视图
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">名称</Label>
                      <p className="text-sm font-medium">{selectedTemplate.name}</p>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-sm text-muted-foreground">时间段</Label>
                      <div className="grid gap-2">
                        {selectedTemplate.timeSlots.map(slot => (
                          <div 
                            key={slot.id} 
                            className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
                          >
                            <span className="font-medium">{slot.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => handleEditTemplate(selectedTemplate)}>
                        编辑时间安排
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              请选择或创建时间安排
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 