'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Filter, LineChart } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/types/utils"
import Link from "next/link"

interface AcademicJourneyClientProps {
  academicData: any[]
}

export function AcademicJourneyClient({ academicData }: AcademicJourneyClientProps) {
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
        {academicData.map((student) => (
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