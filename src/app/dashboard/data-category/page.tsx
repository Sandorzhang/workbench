'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/ui/card"
import { Badge } from "@/components/common/ui/badge"
import { PageHeader } from "@/components/common/layout/page-header"
import { Database, Filter, Plus, Loader2, FolderTree } from 'lucide-react'
import { Button } from "@/components/common/ui/button"
import { cn } from "@/lib/types/utils"
import { PageContainer } from "@/components/features/dashboard/page-container"

interface Category {
  id: number
  name: string
  type: string
  count: number
  lastUpdated: string
  status: string
}

export default function DataCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从 mock API 获取数据
    fetch('http://localhost:3100/dataCategories')
      .then(res => res.json())
      .then((data: Category[]) => {
        setCategories(Array.isArray(data) ? data : [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error('加载数据失败:', err)
        setCategories([])
        setIsLoading(false)
      })
  }, [])

  return (
    <PageContainer>
      <PageHeader
        title="数据类目"
        description="管理教学相关的数据类目"
        icon={Database}
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
              <Plus className="h-4 w-4 mr-2" />
              新建类目
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="bg-white/70 backdrop-blur-sm border-white/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderTree className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">暂无数据类目</p>
            <p className="text-sm text-muted-foreground mt-1">
              点击"新建类目"按钮创建您的第一个数据类目
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className={cn(
                "transition-all duration-200",
                "hover:shadow-md hover:-translate-y-0.5",
                "bg-white/70 backdrop-blur-sm border-white/50"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <Badge 
                    variant={category.status === "使用中" ? "default" : "secondary"}
                    className={cn(
                      category.status === "使用中" 
                        ? "bg-primary/10 text-primary"
                        : "bg-muted"
                    )}
                  >
                    {category.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">类目类型</div>
                  <div>{category.type}</div>
                  <div className="text-muted-foreground">数据数量</div>
                  <div>{category.count} 条</div>
                  <div className="text-muted-foreground">最后更新</div>
                  <div>{category.lastUpdated}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
} 