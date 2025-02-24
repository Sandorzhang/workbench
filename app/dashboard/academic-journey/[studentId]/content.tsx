'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleIcon, CheckCircle2Icon, CircleDotIcon } from "lucide-react"
import { fetchStudentLearningObjectives } from "@/lib/api/academic-journey"
import type { Subject, StudentLearningData } from "@/lib/api/academic-journey"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchSubjects } from "@/lib/api/subjects"
import type { Subject as SubjectConfig } from "@/lib/api/subjects"
import * as LucideIcons from "lucide-react"

export default function StudentJourneyContent({ studentId }: { studentId: string }) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectConfigs, setSubjectConfigs] = useState<SubjectConfig[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [learningData, configs] = await Promise.all([
          fetchStudentLearningObjectives(studentId),
          fetchSubjects()
        ])
        setSubjects(learningData.subjects || [])
        setSubjectConfigs(configs)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载学习目标数据失败"
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [studentId, toast])

  const getSubjectConfig = (code: string) => {
    return subjectConfigs.find(config => config.code === code.toUpperCase())
  }

  const getSubjectIcon = (code: string) => {
    const config = getSubjectConfig(code)
    if (!config?.icon) return null
    
    const IconComponent = LucideIcons[config.icon as keyof typeof LucideIcons] as React.FC<{ className?: string }>
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <CircleDotIcon className="h-4 w-4 text-blue-500" />
      case 'excellent':
        return <CheckCircle2Icon className="h-4 w-4 text-purple-500" />
      default:
        return <CircleIcon className="h-4 w-4 text-gray-300" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '达成'
      case 'in_progress':
        return '发展中'
      case 'excellent':
        return '卓越'
      default:
        return '未测试'
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs defaultValue={subjects[0]?.code} className="space-y-6">
        <TabsList className="bg-muted/50 w-full h-auto flex-wrap">
          {subjects.map(subject => {
            const config = getSubjectConfig(subject.code)
            return (
              <TabsTrigger 
                key={subject.code} 
                value={subject.code}
                className={`flex items-center gap-2 ${config?.color ? `text-${config.color}-600` : ''}`}
              >
                {getSubjectIcon(subject.code)}
                <span>{subject.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {subject.masteryRate}%
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {subjects.map(subject => (
          <TabsContent key={subject.code} value={subject.code} className="space-y-6">
            {subject.categories.map(category => (
              <Card key={category.name} className="overflow-hidden">
                <CardHeader className="border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.objectives.map((objective) => (
                      <div
                        key={objective.id}
                        className={`p-4 rounded-lg border ${
                          objective.status === 'excellent' 
                            ? 'bg-purple-50 border-purple-200'
                            : objective.status === 'completed'
                            ? 'bg-green-50 border-green-200'
                            : objective.status === 'in_progress'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(objective.status)}
                            <span className="font-medium">{objective.name}</span>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {getStatusText(objective.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 