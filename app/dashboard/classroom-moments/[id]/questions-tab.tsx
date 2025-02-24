'use client'

import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  content: string
  type: string
}

interface QuestionsTabProps {
  questions: Question[]
}

export default function QuestionsTab({ questions }: QuestionsTabProps) {
  // 处理点击导航事件
  const handleNavClick = (questionId: string) => {
    document.getElementById(`question-${questionId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <div className="grid gap-4">
      {questions.map((question) => (
        <div 
          key={question.id} 
          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
        >
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{question.content}</p>
          </div>
          <Badge className="ml-4">{question.type}</Badge>
        </div>
      ))}
    </div>
  )
} 