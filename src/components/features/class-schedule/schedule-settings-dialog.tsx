'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Plus, Pencil, Trash } from "lucide-react"
import { TimeSlot } from "@/lib/types/schedule"

interface ScheduleTemplate {
  id: string
  name: string
  timeSlots: TimeSlot[]
}

export function ScheduleSettingsDialog({ 
  trigger 
}: { 
  trigger: React.ReactNode 
}) {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([
    {
      id: "1",
      name: "标准作息时间",
      timeSlots: [
        { id: "1", name: "第一节", startTime: "08:00", endTime: "08:45" },
        { id: "2", name: "第二节", startTime: "08:55", endTime: "09:40" }
      ]
    }
  ])
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null)

  const handleAddTemplate = () => {
    const newTemplate: ScheduleTemplate = {
      id: Date.now().toString(),
      name: "新作息时间",
      timeSlots: []
    }
    setTemplates([...templates, newTemplate])
    setSelectedTemplate(newTemplate)
  }

  const handleEditTemplate = (template: ScheduleTemplate) => {
    setSelectedTemplate(template)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
  }

  const handleSaveTemplate = (template: ScheduleTemplate) => {
    setTemplates(templates.map(t => t.id === template.id ? template : t))
    setSelectedTemplate(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>课程时间安排管理</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-6">
          {/* 左侧模板列表 */}
          <div className="col-span-2 space-y-4">
            <Button onClick={handleAddTemplate} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              添加时间安排
            </Button>
            <div className="space-y-2">
              {templates.map(template => (
                <Card key={template.id} className={selectedTemplate?.id === template.id ? "border-primary" : ""}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* 右侧编辑区域 */}
          <div className="col-span-3">
            {selectedTemplate ? (
              <Card>
                <CardHeader>
                  <CardTitle>编辑时间安排</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <Button variant="destructive" size="icon">
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
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                      取消
                    </Button>
                    <Button onClick={() => handleSaveTemplate(selectedTemplate)}>
                      保存
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                请选择或创建时间安排
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 