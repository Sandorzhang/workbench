// 导入必要的组件和类型
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AcademicJourneyPage() {
  // 获取当前用户会话
  const session = await auth()

  // 如果未登录，重定向到登录页面
  if (!session) {
    redirect("/auth/login")
  }

  // 检查用户角色是否为教师或管理员
  const userRole = session.user.role
  if (userRole !== "TEACHER" && userRole !== "ADMIN") {
    redirect("/dashboard")
  }

  // 从 API 获取数据
  const response = await fetch('http://localhost:3100/academicJourneys')
  if (!response.ok) {
    throw new Error('Failed to fetch academic journeys')
  }
  const academicData = await response.json()

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">学业旅程管理</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {academicData.map((student: any) => (
          <Card key={student.id}>
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
        ))}
      </div>
    </div>
  )
} 