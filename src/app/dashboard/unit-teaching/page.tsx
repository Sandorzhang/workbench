'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs"
import { Button } from "@/components/common/ui/button"
import { Input } from "@/components/common/ui/input"
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter,
  Calendar,
  Clock,
  FileText,
  MoreHorizontal 
} from 'lucide-react'
import { Badge } from "@/components/common/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu"
import { PageHeader } from "@/components/common/layout/page-header"
import { cn } from "@/lib/types/utils"

export default function UnitTeachingPage() {
  const [activeTab, setActiveTab] = useState('units')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="单元教学管理"
        description="管理教学单元、课时和教案"
        icon={BookOpen}
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
              新建单元
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-6">
          <Tabs defaultValue="units" className="space-y-6" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="units">教学单元</TabsTrigger>
                <TabsTrigger value="lessons">课时管理</TabsTrigger>
                <TabsTrigger value="plans">教案库</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/50"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="units" className="space-y-4">
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
                          <h3 className="font-medium">第{i + 1}单元</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {['语文', '数学', '英语'][i % 3]} | 三年级上学期
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>编辑单元</DropdownMenuItem>
                            <DropdownMenuItem>查看详情</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          2024-03-01 至 2024-03-15
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          12课时
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 mr-2" />
                          8个教案
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">
                          进行中
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          重点单元
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lessons">
              <div className="text-center py-8 text-muted-foreground">
                课时管理功能开发中...
              </div>
            </TabsContent>

            <TabsContent value="plans">
              <div className="text-center py-8 text-muted-foreground">
                教案库功能开发中...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 