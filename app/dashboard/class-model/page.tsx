'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GradeSelector } from "@/components/class-schedule/grade-selector"
import { ClassSelector } from "@/components/class-schedule/class-selector"
import { useAuth } from "@/hooks/use-auth"
import { BarChart, Download, Medal, Filter, FileBarChart } from "lucide-react"
import { fetchClassModel, type ClassModel } from "@/lib/api/class-model"
import { useToast } from "@/hooks/use-toast"
import { PageContainer } from "@/components/dashboard/page-container"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const LEVEL_COLORS = {
  "发展中": "bg-red-500",
  "接近": "bg-orange-500",
  "达成": "bg-yellow-500",
  "卓越": "bg-green-500",
  "融会贯通": "bg-blue-500"
}

export default function ClassModelPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [modelData, setModelData] = useState<ClassModel | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, hasPermission } = useAuth()
  const { toast } = useToast()
  const [classModels, setClassModels] = useState([])

  const canExport = hasPermission('export_class_model')

  useEffect(() => {
    if (!selectedGrade || !selectedClass) return
    loadModelData()
  }, [selectedGrade, selectedClass])

  useEffect(() => {
    // 从 mock API 获取数据
    fetch('http://localhost:3100/classModels')
      .then(res => res.json())
      .then(data => setClassModels(data))
      .catch(err => console.error('加载数据失败:', err))
  }, [])

  const loadModelData = async () => {
    try {
      setLoading(true)
      const data = await fetchClassModel({
        gradeId: selectedGrade,
        classId: selectedClass
      })
      setModelData(data[0] || null)
    } catch (error) {
      console.error('加载班级模型数据失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载班级模型数据失败"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="班级模型"
        description="查看班级发展模型分析报告"
        icon={BarChart}
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
              <FileBarChart className="h-4 w-4 mr-2" />
              生成报告
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">班级模型报告</h1>
          <p className="text-sm text-muted-foreground mt-1">
            查看班级发展模型分析报告
          </p>
        </div>
        <div className="flex items-center gap-4">
          <GradeSelector value={selectedGrade} onChange={setSelectedGrade} />
          <ClassSelector value={selectedClass} onChange={setSelectedClass} />
          {canExport && (
            <Button>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          )}
        </div>
      </div>

      {modelData ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-sm">总学生数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modelData.totalStudents}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-sm">已测评学生</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modelData.reportedStudents}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-sm">未测评学生</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modelData.unreportedStudents}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-sm">平均分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modelData.avgScore}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  水平分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelData.distribution.map(item => (
                    <div key={item.level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.level}</span>
                        <span className="text-sm text-muted-foreground">{item.count} 人</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full ${LEVEL_COLORS[item.level as keyof typeof LEVEL_COLORS]}`}
                          style={{ width: `${(item.count / modelData.reportedStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>学生列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelData.distribution.map(item => (
                    <div key={item.level}>
                      <h3 className="font-medium mb-2">{item.level}</h3>
                      <div className="grid gap-2">
                        {item.students.map(student => (
                          <div 
                            key={student.id}
                            className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{student.name}</span>
                                {student.badges && (
                                  <div className="flex items-center gap-1 text-xs text-amber-500">
                                    <Medal className="h-3 w-3" />
                                    <span>x{student.badges}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{student.id}</div>
                            </div>
                            <div className="text-sm">{student.score}分</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          请选择年级和班级查看模型报告
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classModels.map((model: any) => (
          <Card key={model.id} className={cn(
            "transition-all duration-200",
            "hover:shadow-md hover:-translate-y-0.5"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{model.grade}{model.class}</span>
                <Badge variant="outline">{model.lastUpdated}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">班主任</div>
                <div>{model.headTeacher}</div>
                <div className="text-muted-foreground">学生人数</div>
                <div>{model.studentCount}人</div>
                <div className="text-muted-foreground">发展水平</div>
                <div>{model.developmentLevel}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
} 