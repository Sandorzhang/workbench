'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { 
  Search, 
  Plus, 
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  School,
  BookOpen,
  MoreHorizontal
} from "lucide-react"
import { fetchTeachers, type Teacher } from "@/lib/api/teacher"
import { TeacherForm } from './teacher-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/types/utils"
import { PageHeader } from "@/components/page-header"

export default function TeacherManagementPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>()

  useEffect(() => {
    async function loadTeachers() {
      try {
        if (!user?.tenantId) return
        setIsLoading(true)
        const data = await fetchTeachers(user.tenantId)
        setTeachers(data)
      } catch (error) {
        console.error('加载教师数据失败:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载教师数据失败"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTeachers()
  }, [user?.tenantId, toast])

  const handleAddEdit = (teacher?: Teacher) => {
    setSelectedTeacher(teacher)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    if (user?.tenantId) {
      loadTeachers()
    }
  }

  // 权限检查
  if (user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">访问受限</p>
              <p className="text-sm mt-1">您没有权限访问此页面</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="教师管理"
        description="管理学校教师信息和权限配置"
        icon={GraduationCap}
        className="bg-white/50"
        action={
          <Button 
            onClick={() => handleAddEdit()} 
            className={cn(
              "bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary",
              "transition-all duration-300",
              "shadow-lg shadow-primary/20"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加教师
          </Button>
        }
      />

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-0">
          <div className="border-b bg-muted/30 backdrop-blur-sm p-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索教师..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/50"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                共 {teachers.length} 名教师
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredTeachers.map(teacher => (
              <Card 
                key={teacher.id}
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  "hover:shadow-md hover:scale-[1.02]",
                  "border border-border/50"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {teacher.name.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {teacher.name}
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({teacher.username})
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <School className="h-3 w-3" />
                          {teacher.title || '未设置职称'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(teacher)}>
                          编辑信息
                        </DropdownMenuItem>
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <div className="flex gap-1">
                        {teacher.subjects?.map(subject => (
                          <Badge key={subject} variant="outline" className="bg-white">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {teacher.phone && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {teacher.phone}
                      </p>
                    )}
                    {teacher.email && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {teacher.email}
                      </p>
                    )}
                    {teacher.joinDate && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        入职时间：{teacher.joinDate}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Badge 
                      variant={teacher.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {teacher.status === 'active' ? '在职' : '离职'}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      {teacher.education || '学历未知'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">
                {searchQuery ? '未找到匹配的教师' : '暂无教师数据'}
              </p>
              <p className="text-sm mt-1">
                {searchQuery ? '尝试使用其他关键词搜索' : '点击右上角添加教师'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {user?.tenantId && (
        <TeacherForm
          open={formOpen}
          onOpenChange={setFormOpen}
          teacher={selectedTeacher}
          tenantId={user.tenantId}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
} 