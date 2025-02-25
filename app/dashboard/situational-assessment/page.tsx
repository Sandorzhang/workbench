'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Target, Filter, Plus, Loader2, FileBarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PageContainer } from "@/components/dashboard/page-container"

interface Assessment {
  id: number
  title: string
  grade: string
  class: string
  type: string
  status: string
  deadline: string
  completionRate: number
}

export default function SituationalAssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从 mock API 获取数据
    fetch('http://localhost:3100/situationalAssessments')
      .then(res => res.json())
      .then((data: Assessment[]) => {
        setAssessments(Array.isArray(data) ? data : [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error('加载数据失败:', err)
        setAssessments([])
        setIsLoading(false)
      })
  }, [])

  return (
    <PageContainer>
      <PageHeader
        title="情境化测评"
        description="智能评价情境化测评工具"
        icon={Target}
        className="bg-white/50 mb-6"
        action={
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              size="sm"
              className={cn(
                "bg-white/50 hover:bg-white/80",
                "transition-all duration-300"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
            <Button
              className={cn(
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary",
                "transition-all duration-300",
                "shadow-lg shadow-primary/20"
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              新建测评
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : assessments.length === 0 ? (
        <Card className="bg-white/70 backdrop-blur-sm border-white/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileBarChart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">暂无测评数据</p>
            <p className="text-sm text-muted-foreground mt-1">
              点击"新建测评"按钮创建您的第一个测评
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <Card 
              key={assessment.id} 
              className={cn(
                "transition-all duration-200",
                "hover:shadow-md hover:-translate-y-0.5",
                "bg-white/70 backdrop-blur-sm border-white/50"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{assessment.title}</span>
                  <Badge 
                    variant={assessment.status === "进行中" ? "default" : "secondary"}
                    className={cn(
                      assessment.status === "进行中" 
                        ? "bg-primary/10 text-primary"
                        : "bg-muted"
                    )}
                  >
                    {assessment.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">年级班级</div>
                  <div>{assessment.grade} {assessment.class}</div>
                  <div className="text-muted-foreground">测评类型</div>
                  <div>{assessment.type}</div>
                  <div className="text-muted-foreground">截止日期</div>
                  <div>{assessment.deadline}</div>
                  <div className="text-muted-foreground">完成情况</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${assessment.completionRate}%` }}
                        />
                      </div>
                      <span>{assessment.completionRate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
} 