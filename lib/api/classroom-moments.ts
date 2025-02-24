import { API_BASE_URL } from './config'
import { SUBJECTS } from '@/lib/constants/subjects'

export async function fetchClassroomMoments() {
  const response = await fetch(`${API_BASE_URL}/classroomMoments`)
  if (!response.ok) {
    throw new Error('Failed to fetch classroom moments')
  }
  return response.json()
}

export async function fetchClassroomMomentById(id: string) {
  const response = await fetch(`${API_BASE_URL}/classroomMoments/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch classroom moment')
  }
  return response.json()
}

interface AnalysisResult {
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
    content: string
    type: string
  }[]
  tasks: {
    content: string
    status: string
  }[]
}

// 模拟智能分析服务
async function analyzeClassroomContent(title: string, subject: string, description: string): Promise<AnalysisResult> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 根据学科返回不同的模板
  if (subject === SUBJECTS.MATH) {
    return {
      sections: [
        {
          name: "导入环节",
          duration: "10分钟",
          activities: [
            "复习前置知识点",
            "创设问题情境",
            "引导学生思考"
          ]
        },
        {
          name: "探究环节",
          duration: "20分钟",
          activities: [
            "小组合作探究",
            "交流研讨",
            "归纳总结"
          ]
        },
        {
          name: "巩固环节",
          duration: "15分钟",
          activities: [
            "典型例题讲解",
            "分层练习",
            "及时反馈"
          ]
        }
      ],
      knowledgeMap: [
        {
          topic: "核心概念",
          concepts: ["数学建模", "逻辑推理", "空间想象", "运算能力"]
        },
        {
          topic: "思维方法",
          concepts: ["归纳总结", "类比迁移", "抽象概括", "演绎推理"]
        }
      ],
      questions: [
        {
          content: "如何理解本节课的核心概念？",
          type: "概念理解"
        },
        {
          content: "这个问题还有其他解决方法吗？",
          type: "发散思维"
        },
        {
          content: "如何将所学知识应用到实际问题中？",
          type: "实践应用"
        }
      ],
      tasks: [
        {
          content: "完成课后基础练习",
          status: "进行中"
        },
        {
          content: "尝试解决拓展题",
          status: "未开始"
        },
        {
          content: "整理知识要点",
          status: "未开始"
        }
      ]
    }
  } else if (subject === SUBJECTS.SCIENCE) {
    return {
      sections: [
        {
          name: "实验准备",
          duration: "10分钟",
          activities: [
            "介绍实验目的",
            "讲解安全注意事项",
            "分发实验器材"
          ]
        },
        {
          name: "实验探究",
          duration: "25分钟",
          activities: [
            "演示实验步骤",
            "学生动手实验",
            "记录实验数据",
            "观察实验现象"
          ]
        },
        {
          name: "总结分析",
          duration: "10分钟",
          activities: [
            "分析实验结果",
            "归纳实验规律",
            "延伸实验应用"
          ]
        }
      ],
      knowledgeMap: [
        {
          topic: "实验原理",
          concepts: ["科学原理", "实验方法", "数据分析", "结果验证"]
        },
        {
          topic: "实验技能",
          concepts: ["操作规范", "数据记录", "现象观察", "安全意识"]
        }
      ],
      questions: [
        {
          content: "实验现象背后的原理是什么？",
          type: "原理探究"
        },
        {
          content: "如何控制实验变量？",
          type: "方法思考"
        },
        {
          content: "实验结果与预期有何不同？",
          type: "结果分析"
        }
      ],
      tasks: [
        {
          content: "撰写实验报告",
          status: "进行中"
        },
        {
          content: "设计优化实验",
          status: "未开始"
        },
        {
          content: "总结实验心得",
          status: "未开始"
        }
      ]
    }
  } else if (subject === SUBJECTS.CHINESE) {
    return {
      sections: [
        {
          name: "导入环节",
          duration: "10分钟",
          activities: [
            "创设情境导入",
            "朗读范读",
            "激发阅读兴趣"
          ]
        },
        {
          name: "精读环节",
          duration: "20分钟",
          activities: [
            "自主阅读",
            "重点词句品析",
            "段落大意归纳"
          ]
        },
        {
          name: "拓展环节",
          duration: "15分钟",
          activities: [
            "主题探讨",
            "情感升华",
            "课外延伸"
          ]
        }
      ],
      knowledgeMap: [
        {
          topic: "语言知识",
          concepts: ["字词理解", "句式运用", "修辞手法", "写作技巧"]
        },
        {
          topic: "文学素养",
          concepts: ["情感体验", "主题把握", "文学鉴赏", "创意表达"]
        }
      ],
      questions: [
        {
          content: "作者使用了哪些写作手法？",
          type: "写作技巧"
        },
        {
          content: "文章表达了怎样的情感？",
          type: "情感理解"
        },
        {
          content: "如何理解文章的主旨？",
          type: "主题把握"
        }
      ],
      tasks: [
        {
          content: "背诵优美段落",
          status: "进行中"
        },
        {
          content: "仿写练习",
          status: "未开始"
        },
        {
          content: "读书笔记",
          status: "未开始"
        }
      ]
    }
  } else if (subject === SUBJECTS.ENGLISH) {
    // ... 英语课程模板
  } else if (subject === SUBJECTS.PHYSICS) {
    // ... 物理课程模板
  }

  // 默认模板
  return {
    sections: [
      {
        name: "课前准备",
        duration: "5分钟",
        activities: [
          "明确学习目标",
          "激发学习兴趣",
          "创设学习情境"
        ]
      },
      {
        name: "知识讲解",
        duration: "20分钟",
        activities: [
          "讲解重点内容",
          "师生互动交流",
          "及时检查反馈"
        ]
      },
      {
        name: "课堂实践",
        duration: "20分钟",
        activities: [
          "学生独立思考",
          "小组合作学习",
          "展示交流成果"
        ]
      }
    ],
    knowledgeMap: [
      {
        topic: "基础知识",
        concepts: ["核心概念", "基本原理", "重要方法"]
      },
      {
        topic: "能力培养",
        concepts: ["思维能力", "实践能力", "创新能力"]
      }
    ],
    questions: [
      {
        content: "如何理解本节课的重点难点？",
        type: "知识理解"
      },
      {
        content: "学习中遇到了哪些困惑？",
        type: "学习反思"
      }
    ],
    tasks: [
      {
        content: "完成课后作业",
        status: "进行中"
      },
      {
        content: "整理学习笔记",
        status: "未开始"
      }
    ]
  }
}

export async function uploadClassroomMoment(formData: FormData, onProgress?: (progress: number) => void) {
  try {
    // 模拟上传进度
    for (let progress = 0; progress <= 100; progress += 10) {
      onProgress?.(progress)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // 先创建一个待分析的记录
    const initialData = {
      id: Date.now().toString(),
      title: formData.get('title'),
      subject: formData.get('subject'),
      grade: formData.get('grade'),
      class: formData.get('class'),
      description: formData.get('description'),
      date: formData.get('date'),
      tags: JSON.parse(formData.get('tags') as string),
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      likes: 0,
      comments: 0,
      teacher: "曹玲",
      analysisStatus: 'pending'
    }

    // 保存初始记录
    const initialResponse = await fetch(`${API_BASE_URL}/classroomMoments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initialData),
    })

    if (!initialResponse.ok) {
      throw new Error('Failed to save initial record')
    }

    try {
      // 调用智能分析服务
      const title = formData.get('title') as string
      const subject = formData.get('subject') as string
      const description = formData.get('description') as string
      const analysis = await analyzeClassroomContent(title, subject, description)
      
      // 更新记录，添加分析结果
      const updatedData = {
        ...initialData,
        ...analysis,
        analysisStatus: 'completed'
      }

      // 更新服务器数据
      const updateResponse = await fetch(`${API_BASE_URL}/classroomMoments/${initialData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update analysis results')
      }

      return updateResponse.json()
    } catch (error) {
      // 如果分析失败，更新状态
      await fetch(`${API_BASE_URL}/classroomMoments/${initialData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisStatus: 'failed' }),
      })
      throw error
    }
  } catch (error) {
    throw error
  }
} 