'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTeacher, updateTeacher, type Teacher } from "@/lib/api/teacher"
import { useToast } from "@/hooks/use-toast"

interface TeacherFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher?: Teacher
  tenantId: number
  onSuccess: () => void
}

const SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '音乐', '美术', '体育']
const TITLES = ['教师', '一级教师', '高级教师', '特级教师', '正高级教师']
const EDUCATION = ['专科', '本科', '硕士', '博士']

export function TeacherForm({ open, onOpenChange, teacher, tenantId, onSuccess }: TeacherFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Teacher>>(
    teacher || {
      tenantId,
      role: 'TEACHER',
      status: 'active'
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (teacher) {
        await updateTeacher(teacher.id, formData)
        toast({ title: "成功", description: "教师信息更新成功" })
      } else {
        await createTeacher(formData as Omit<Teacher, 'id'>)
        toast({ title: "成功", description: "教师添加成功" })
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('保存教师信息失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "保存教师信息失败"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{teacher ? '编辑教师' : '添加教师'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <Input
                required
                value={formData.username || ''}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="请输入用户名"
              />
            </div>
            <div className="space-y-2">
              <Label>姓名</Label>
              <Input
                required
                value={formData.name || ''}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入姓名"
              />
            </div>
            <div className="space-y-2">
              <Label>职称</Label>
              <Select
                value={formData.title}
                onValueChange={value => setFormData(prev => ({ ...prev, title: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择职称" />
                </SelectTrigger>
                <SelectContent>
                  {TITLES.map(title => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>学历</Label>
              <Select
                value={formData.education}
                onValueChange={value => setFormData(prev => ({ ...prev, education: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择学历" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION.map(edu => (
                    <SelectItem key={edu} value={edu}>
                      {edu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>手机号码</Label>
              <Input
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="请输入手机号码"
              />
            </div>
            <div className="space-y-2">
              <Label>邮箱</Label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱"
              />
            </div>
            <div className="space-y-2">
              <Label>专业</Label>
              <Input
                value={formData.major || ''}
                onChange={e => setFormData(prev => ({ ...prev, major: e.target.value }))}
                placeholder="请输入专业"
              />
            </div>
            <div className="space-y-2">
              <Label>入职日期</Label>
              <Input
                type="date"
                value={formData.joinDate || ''}
                onChange={e => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 