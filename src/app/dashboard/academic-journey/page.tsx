'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/ui/card"
import { Badge } from "@/components/common/ui/badge"
import Link from "next/link"
import { PageHeader } from "@/components/common/layout/page-header"
import { GraduationCap, Filter, LineChart } from 'lucide-react'
import { Button } from "@/components/common/ui/button"
import { cn } from "@/lib/types/utils"

export default function AcademicJourneyPage() {
  const [academicData, setAcademicData] = useState([])

  useEffect(() => {
    // 从 mock API 获取数据
    fetch('http://localhost:3100/academicJourneys')
      .then(res => res.json())
      .then(data => setAcademicData(data))
      .catch(err => console.error('加载数据失败:', err))
  }, [])

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="学业旅程"
        description="管理学生的学业发展轨迹"
        icon={GraduationCap}
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
              <LineChart className="h-4 w-4 mr-2" />
              生成报告
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {academicData.map((student: any) => (
          <Link 
            href={`/dashboard/academic-journey/${student.id}`}
            key={student.id}
            className="block group"
          >
            <Card className={cn(
              "transition-all duration-200",
              "hover:shadow-md hover:-translate-y-0.5"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{student.studentName}</span>
                  <Badge variant={student.currentStatus === "正常" ? "default" : "destructive"}>
                    {student.currentStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">年级班级</div>
                  <div>{student.grade} {student.class}</div>
                  <div className="text-muted-foreground">学业表现</div>
                  <div>{student.academicPerformance}</div>
                  <div className="text-muted-foreground">最后更新</div>
                  <div>{student.lastUpdated}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 