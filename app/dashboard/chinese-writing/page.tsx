'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  PenTool, 
  Search, 
  Plus,
  Filter,
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  MoreHorizontal 
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"

// 习作状态类型
type WritingStatus = 'pending' | 'in_progress' | 'completed'

// 习作状态配置
const STATUS_CONFIG: Record<WritingStatus, { label: string, variant: "default" | "secondary" | "outline" }> = {
  pending: { label: '待批改', variant: 'secondary' },
  in_progress: { label: '批改中', variant: 'default' },
  completed: { label: '已完成', variant: 'outline' }
}

export default function ChineseWritingPage() {
  const [activeTab, setActiveTab] = useState('writings')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="习作批改"
        description="管理语文单元习作教学和批改"
        icon={PenTool}
        className="bg-white/50"
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
              <Plus className="h-4 w-4 mr-2" />
              布置习作
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-6">
          <Tabs defaultValue="writings" className="space-y-6" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="writings">习作管理</TabsTrigger>
                <TabsTrigger value="templates">批改模板</TabsTrigger>
                <TabsTrigger value="analytics">数据分析</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索习作..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/50"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="writings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({length: 6}).map((_, i) => (
                  <Card key={i} className={cn(
                    "group transition-all duration-200",
                    "hover:shadow-md hover:scale-[1.02]",
                    "border border-border/50"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">记叙文写作</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            第{i + 1}单元 | 三年级上学期
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>查看详情</DropdownMenuItem>
                            <DropdownMenuItem>开始批改</DropdownMenuItem>
                            <DropdownMenuItem>导出报告</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 mr-2" />
                          《难忘的一天》
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          截止日期：2024-03-15
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          已提交：32/45
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          已批改：28份
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <Badge 
                          variant={STATUS_CONFIG[['pending', 'in_progress', 'completed'][i % 3] as WritingStatus].variant}
                          className={cn(
                            "bg-white/50",
                            STATUS_CONFIG[['pending', 'in_progress', 'completed'][i % 3] as WritingStatus].variant === 'default' && "bg-primary/10"
                          )}
                        >
                          {STATUS_CONFIG[['pending', 'in_progress', 'completed'][i % 3] as WritingStatus].label}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          剩余 3 天
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="text-center py-8 text-muted-foreground">
                批改模板功能开发中...
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-8 text-muted-foreground">
                数据分析功能开发中...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 