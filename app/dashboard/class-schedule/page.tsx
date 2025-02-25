'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, School, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScheduleGrid } from "@/components/class-schedule/schedule-grid"
import { GradeSelector } from "@/components/class-schedule/grade-selector"
import { ClassSelector } from "@/components/class-schedule/class-selector"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"

export default function ClassSchedulePage() {
  const [selectedTab, setSelectedTab] = useState<"teacher" | "class">("teacher")
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const router = useRouter()
  const { user, hasPermission } = useAuth()

  const isAdmin = user?.role === 'ADMIN'
  const canManageSettings = hasPermission('manage_schedule_settings')
  const canExport = hasPermission('export_schedule')

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="课表管理"
        description="管理学校课程表和时间安排"
        icon={Calendar}
        className="bg-white/50"
        action={
          <div className="flex items-center gap-4">
            {selectedTab === "class" && (
              <>
                <GradeSelector value={selectedGrade} onChange={setSelectedGrade} />
                <ClassSelector value={selectedClass} onChange={setSelectedClass} />
              </>
            )}
            {canManageSettings && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/class-schedule/settings')}
                className={cn(
                  "bg-white/50 hover:bg-white/80",
                  "transition-all duration-300"
                )}
              >
                <Settings className="h-4 w-4 mr-2" />
                基础设置
              </Button>
            )}
            {canExport && (
              <Button
                className={cn(
                  "bg-gradient-to-r from-primary to-primary/90",
                  "hover:from-primary/90 hover:to-primary",
                  "transition-all duration-300",
                  "shadow-lg shadow-primary/20"
                )}
              >
                导出课表
              </Button>
            )}
          </div>
        }
      />

      <Card className="bg-white/70 backdrop-blur-sm border-white/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>课表信息</CardTitle>
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
              <TabsList>
                <TabsTrigger value="teacher" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  我的课表
                </TabsTrigger>
                <TabsTrigger value="class" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  班级课表
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ScheduleGrid 
            type={selectedTab} 
            gradeId={selectedGrade}
            classId={selectedClass}
          />
        </CardContent>
      </Card>
    </div>
  )
} 