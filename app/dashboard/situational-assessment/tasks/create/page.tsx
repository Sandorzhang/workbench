'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { createTask } from "@/lib/api/assessment"
import { fetchFrameworks } from "@/lib/api/assessment"
import { AssessmentFramework, CreateTaskDto } from "@/lib/types/assessment"

export default function CreateAssessmentTaskPage() {
  const router = useRouter()
  const [frameworks, setFrameworks] = useState<AssessmentFramework[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    grade: '',
    class: '',
    type: '',
    deadline: '',
    frameworkId: 0
  })

  useEffect(() => {
    loadFrameworks()
  }, [])

  const loadFrameworks = async () => {
    try {
      const data = await fetchFrameworks()
      setFrameworks(data)
    } catch (error) {
      console.error('加载框架失败:', error)
      setError('加载评估框架失败，请稍后重试')
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const task = await createTask(formData)
      if (!task) {
        throw new Error('创建任务失败')
      }
      
      router.push('/dashboard/situational-assessment')
    } catch (error) {
      console.error('创建测评任务失败:', error)
      setError('创建测评任务失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title="创建测评任务"
          description="创建新的情境化测评任务"
          icon={Target}
          className="mb-6"
          showBack
          backUrl="/dashboard/situational-assessment"
        />

        {error && (
          <div className="mb-6 p-4 text-center text-destructive bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>测评标题</Label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入测评标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label>测评类型</Label>
                  <Input
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    placeholder="请输入测评类型"
                  />
                </div>
                <div className="space-y-2">
                  <Label>年级</Label>
                  <Input
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="请输入年级"
                  />
                </div>
                <div className="space-y-2">
                  <Label>班级</Label>
                  <Input
                    value={formData.class}
                    onChange={e => setFormData({ ...formData, class: e.target.value })}
                    placeholder="请输入班级"
                  />
                </div>
                <div className="space-y-2">
                  <Label>截止日期</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>评估框架</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>选择框架</Label>
                <Select
                  value={formData.frameworkId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, frameworkId: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择评估框架" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map((framework) => (
                      <SelectItem key={framework.id} value={framework.id.toString()}>
                        {framework.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn(
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary",
                "transition-all duration-300",
                "shadow-lg shadow-primary/20"
              )}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  创建测评
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 