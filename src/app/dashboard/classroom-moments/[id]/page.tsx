import { auth } from "@/lib/types/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, ArrowLeft, Clock, Brain, HelpCircle, ListTodo } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchClassroomMomentById } from "@/lib/api/classroom-moments"
import QuestionsTab from './questions-tab'

interface ClassroomMoment {
  id: string
  title: string
  teacher: string
  subject: string
  grade: string
  class: string
  date: string
  description: string
  tags: string[]
  imageUrl: string
  likes: number
  comments: number
  sections: {
    name: string
    duration: string
    activities: string[]
  }[]
  knowledgeMap: {
    topic: string
    concepts: string[]
  }[]
  questions: {
    id: string
    content: string
    type: string
  }[]
  tasks: {
    content: string
    status: "进行中" | "未开始" | "已完成"
  }[]
}

export default async function ClassroomMomentDetailPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const userRole = session.user.role
  if (userRole !== "TEACHER" && userRole !== "ADMIN") {
    redirect("/dashboard")
  }

  // 从 API 获取数据
  const moment = await fetchClassroomMomentById(params.id)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/classroom-moments">
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">课堂记录详情</h1>
          <p className="text-sm text-muted-foreground mt-1">
            记录精彩教学瞬间，分享教学智慧
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* 左侧基础信息 */}
        <div className="col-span-3">
          <Card className="border-none shadow-lg">
            <div className="relative h-[300px] w-full">
              <Image
                src={moment.imageUrl}
                alt={moment.title}
                fill
                className="object-cover rounded-t-lg"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white mb-2">{moment.title}</h2>
                <div className="flex flex-col text-sm text-white/90 space-y-1">
                  <span>{moment.teacher}</span>
                  <span>{moment.grade}{moment.class}</span>
                  <span>{moment.date}</span>
                </div>
              </div>
            </div>
            <CardContent className="space-y-6 pt-6">
              <div className="flex justify-end">
                <Badge className="text-base px-4 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {moment.subject}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">课堂记录</h3>
                <p className="text-muted-foreground">{moment.description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {moment.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="bg-secondary/10 hover:bg-secondary/20 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>{moment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{moment.comments}</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>分享</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧内容区 */}
        <div className="col-span-9">
          <Tabs defaultValue="sections" className="w-full bg-card rounded-lg p-6 shadow-lg">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="sections" className="gap-2">
                <Clock className="h-4 w-4" />
                课堂环节
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="gap-2">
                <Brain className="h-4 w-4" />
                知识结构
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                问题链
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2">
                <ListTodo className="h-4 w-4" />
                任务链
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="mt-6">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="pt-6">
                  {moment.sections?.map((section: { name: string; duration: string; activities: string[] }, index: number) => (
                    <div key={index} className="mb-6 bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-lg">{section.name}</h3>
                        <Badge variant="outline">{section.duration}</Badge>
                      </div>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        {section.activities.map((activity: string, idx: number) => (
                          <li key={idx}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {moment.knowledgeMap?.map((item: { topic: string; concepts: string[] }, index: number) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-medium mb-2">{item.topic}</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.concepts.map((concept: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{concept}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <QuestionsTab questions={moment.questions} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {moment.tasks?.map((task: { content: string; status: string }, index: number) => (
                    <div key={index} className="mb-4 flex items-center justify-between">
                      <p className="text-muted-foreground">{task.content}</p>
                      <Badge>{task.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 