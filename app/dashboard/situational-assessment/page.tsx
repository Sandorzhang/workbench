'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Filter, Scale, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssessmentFramework, AssessmentTask } from "@/lib/types/assessment"
import { fetchFrameworks, fetchTasks } from "@/lib/api/assessment"

export default function SituationalAssessmentPage() {
  const [assessments, setAssessments] = useState<AssessmentTask[]>([])
  const [frameworks, setFrameworks] = useState<AssessmentFramework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [tasks, frameworks] = await Promise.all([
        fetchTasks(),
        fetchFrameworks()
      ])

      setAssessments(tasks)
      setFrameworks(frameworks)
    } catch (error) {
      console.error('加载数据失败:', error)
      setError('加载数据失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <PageContainer>
        <div className="px-6">
          <div className="text-center py-8 text-destructive">
            {error}
            <Button
              variant="outline"
              onClick={loadData}
              className="ml-4"
            >
              重试
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title="情境化测评"
          description="智能评价情境化测评工具"
          icon={Target}
          className="mb-6"
        />

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assessments">测评任务</TabsTrigger>
            <TabsTrigger value="frameworks">评估框架</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">测评任务</h2>
                <p className="text-sm text-muted-foreground">
                  管理和跟踪测评任务的进度
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
                <Link href="/dashboard/situational-assessment/tasks/create">
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
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="bg-white/70 backdrop-blur-sm border-white/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{assessment.title}</span>
                      <Badge 
                        variant={assessment.status === "in_progress" ? "default" : "secondary"}
                        className={cn(
                          assessment.status === "in_progress" 
                            ? "bg-primary/10 text-primary"
                            : "bg-muted"
                        )}
                      >
                        {assessment.status === 'draft' ? '草稿' : 
                         assessment.status === 'in_progress' ? '进行中' : '已完成'}
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
          </TabsContent>

          <TabsContent value="frameworks" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">评估框架</h2>
                <p className="text-sm text-muted-foreground">
                  管理测评的评估框架和维度
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
                <Link href="/dashboard/situational-assessment/frameworks/create">
                  <Button
                    className={cn(
                      "bg-gradient-to-r from-primary to-primary/90",
                      "hover:from-primary/90 hover:to-primary",
                      "transition-all duration-300",
                      "shadow-lg shadow-primary/20"
                    )}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新建框架
                  </Button>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {frameworks.map((framework) => (
                  <Link 
                    href={`/dashboard/situational-assessment/frameworks/${framework.id}`}
                    key={framework.id}
                  >
                    <Card className={cn(
                      "transition-all duration-200",
                      "hover:shadow-md hover:-translate-y-0.5",
                      "bg-white/70 backdrop-blur-sm border-white/50"
                    )}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            <span>{framework.name}</span>
                          </div>
                          <Badge 
                            variant={framework.status === "published" ? "default" : "secondary"}
                            className={cn(
                              framework.status === "published" 
                                ? "bg-primary/10 text-primary"
                                : "bg-muted"
                            )}
                          >
                            {framework.status === 'published' ? '已发布' : '草稿'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          {framework.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">评估维度</div>
                          <div>{framework.dimensions.length} 个</div>
                          <div className="text-muted-foreground">更新时间</div>
                          <div>{framework.updatedAt}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 