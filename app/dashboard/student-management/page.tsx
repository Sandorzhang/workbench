'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Search, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { ApiService } from '@/lib/api-service'
import { PageHeader } from "@/components/page-header"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  id: number
  name: string
  studentId: string
  gender: 'male' | 'female'
  grade: string
  class: string
  guardianName: string
  guardianPhone: string
  status: 'active' | 'inactive'
}

interface Class {
  id: number
  name: string
  grade: string
  headTeacherId: number
  studentCount: number
}

export default function StudentManagementPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('students')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) return
      const user = JSON.parse(userStr)

      const studentsData = await ApiService.getStudents(user.tenantId)
      setStudents(studentsData)

      const classesData = await ApiService.getClasses(user.tenantId)
      setClasses(classesData)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: "获取数据失败",
        variant: "destructive",
      })
    }
  }

  const handleCreateStudent = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) return
      const user = JSON.parse(userStr)

      const newStudent = await ApiService.createStudent({
        tenantId: user.tenantId,
        name: "新学生",
        studentId: `2024${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        gender: "male",
        grade: "一年级",
        class: "1班",
        guardianName: "监护人",
        guardianPhone: "13900000000",
        address: "地址待补充",
        enrollmentDate: new Date().toISOString()
      })

      setStudents(prev => [...prev, newStudent])
      toast({
        title: "创建成功",
        description: "已添加新学生",
      })
    } catch (error) {
      toast({
        title: "创建失败",
        description: "添加学生时出现错误",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStudent = async (id: number) => {
    try {
      await ApiService.deleteStudent(id)
      setStudents(prev => prev.filter(s => s.id !== id))
      toast({
        title: "删除成功",
        description: "已删除学生信息",
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "删除学生时出现错误",
        variant: "destructive",
      })
    }
  }

  const handleCreateClass = () => {
    toast({
      title: "创建功能",
      description: "创建班级功能开发中",
    })
  }

  const filteredStudents = students.filter(student => 
    student.name.includes(searchTerm) || 
    student.studentId.includes(searchTerm) ||
    student.guardianPhone.includes(searchTerm)
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="学生管理"
        description="管理学校学生信息和班级分配"
        icon={Users}
        className="bg-white/50"
        action={
          <Button 
            onClick={() => router.push('/dashboard/student-management/new')}
            className={cn(
              "bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary",
              "transition-all duration-300",
              "shadow-lg shadow-primary/20"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加学生
          </Button>
        }
      />

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-6">
          <Tabs defaultValue="students" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="students">学生列表</TabsTrigger>
              <TabsTrigger value="classes">班级管理</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索学生..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button onClick={handleCreateStudent}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加学生
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredStudents.map(student => (
                  <Card key={student.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          学号：{student.studentId} | {student.grade}{student.class}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          监护人：{student.guardianName} ({student.guardianPhone})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">查看详情</Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={handleCreateClass}>
                  <Plus className="h-4 w-4 mr-2" />
                  创建班级
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map(cls => (
                  <Card key={cls.id}>
                    <CardHeader>
                      <CardTitle>{cls.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        学生人数：{cls.studentCount}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 