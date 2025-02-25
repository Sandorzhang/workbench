'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { GraduationCap, FileBarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/types/utils"
import { PageContainer } from "@/components/dashboard/page-container"
import Link from 'next/link'

interface StudentJourney {
  id: string
  studentName: string
  grade: string
  class: string
  currentStatus: string
  academicPerformance: string
  lastUpdated: string
}

interface Props {
  studentId: string
}

export default function StudentJourneyClient({ studentId }: Props) {
  const [journey, setJourney] = useState<StudentJourney | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从 mock API 获取数据
    fetch(`http://localhost:3100/academicJourneys/${studentId}`)
      .then(res => res.json())
      .then(data => {
        setJourney(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('加载数据失败:', err)
        setIsLoading(false)
      })
  }, [studentId])

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    )
  }

  if (!journey) {
    return (
      <PageContainer>
        <div className="text-center py-8">
          <p className="text-muted-foreground">未找到学生数据</p>
          <Link href="/dashboard/academic-journey" className="text-primary hover:underline mt-2 inline-block">
            返回列表
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title={`${journey.studentName}的学业旅程`}
        description={`${journey.grade}${journey.class} · ${journey.academicPerformance}`}
        icon={GraduationCap}
        className="mb-6"
        showBack
        backUrl="/dashboard/academic-journey"
        action={
          <Button
            className={cn(
              "bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary",
              "transition-all duration-300",
              "shadow-lg shadow-primary/20"
            )}
          >
            <FileBarChart className="h-4 w-4 mr-2" />
            生成报告
          </Button>
        }
      />

      <div className="grid gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-white/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>基本信息</span>
              <Badge 
                variant={journey.currentStatus === "正常" ? "default" : "destructive"}
                className={cn(
                  journey.currentStatus === "正常" 
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {journey.currentStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">年级班级</div>
                <div className="mt-1">{journey.grade} {journey.class}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">学业表现</div>
                <div className="mt-1">{journey.academicPerformance}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">最后更新</div>
                <div className="mt-1">{journey.lastUpdated}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 其他详细信息卡片 */}
        <div className="text-center py-8 text-muted-foreground">
          更多内容开发中...
        </div>
      </div>
    </PageContainer>
  )
} 