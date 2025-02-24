'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Target, Download } from "lucide-react"
import { PageContainer } from "@/components/dashboard/page-container"
import { GradeSelector } from "@/components/class-schedule/grade-selector"
import { ClassSelector } from "@/components/class-schedule/class-selector"

export default function SituationalAssessmentPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const { hasPermission } = useAuth()

  const canManage = hasPermission('manage_assessment')
  const canExport = hasPermission('export_assessment')

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">情境化测评工具</h1>
          <p className="text-sm text-muted-foreground mt-1">
            智能评价情境化测评工具
          </p>
        </div>
        <div className="flex items-center gap-4">
          <GradeSelector value={selectedGrade} onChange={setSelectedGrade} />
          <ClassSelector value={selectedClass} onChange={setSelectedClass} />
          {canExport && (
            <Button>
              <Download className="h-4 w-4 mr-2" />
              导出测评
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-white/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            测评列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            暂无测评数据
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
} 