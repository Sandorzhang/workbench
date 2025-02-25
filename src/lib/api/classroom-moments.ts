import { API_CONFIG } from '../config/api.config';
import { SUBJECTS } from '@/lib/constants/subjects'

/**
 * 课堂时光机相关 API
 * 
 * 提供课堂记录的获取、创建、更新等功能
 */

// 获取所有课堂记录
export async function fetchClassroomMoments() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/classroomMoments`)
    if (!response.ok) {
      throw new Error('Failed to fetch classroom moments')
    }
    return response.json()
  } catch (error) {
    // 如果API请求失败，返回模拟数据
    console.warn('Using mock data for classroom moments')
    return [
      {
        id: "1",
        title: "分数加减法探究",
        teacher: "张老师",
        subject: "数学",
        grade: "五年级",
        class: "2班",
        date: "2023-10-15",
        description: "通过小组合作探究分数加减法的计算方法",
        tags: ["分数", "加减法", "合作学习"],
        imageUrl: "https://picsum.photos/seed/math1/400/300",
        likes: 24,
        comments: 5
      },
      {
        id: "2",
        title: "古诗文鉴赏",
        teacher: "李老师",
        subject: "语文",
        grade: "六年级",
        class: "1班",
        date: "2023-10-12",
        description: "学习古诗文的鉴赏方法，感受古典文学的魅力",
        tags: ["古诗文", "鉴赏", "文学"],
        imageUrl: "https://picsum.photos/seed/chinese1/400/300",
        likes: 18,
        comments: 3
      },
      {
        id: "3",
        title: "植物生长实验",
        teacher: "王老师",
        subject: "科学",
        grade: "四年级",
        class: "3班",
        date: "2023-10-10",
        description: "观察记录不同条件下植物的生长情况",
        tags: ["植物", "实验", "观察记录"],
        imageUrl: "https://picsum.photos/seed/science1/400/300",
        likes: 15,
        comments: 7
      }
    ]
  }
}

// 获取单个课堂记录详情
export async function fetchClassroomMomentById(id: string) {
  try {
    // 检查是否在服务器端
    const isServer = typeof window === 'undefined';
    
    // 构建 API 请求 URL
    let url;
    if (isServer) {
      // 在服务器端，使用内部 API 路由
      url = `http://localhost:3100/api/classroomMoments/${id}`;
    } else {
      // 在客户端，使用相对路径
      url = `/api/classroomMoments/${id}`;
    }
    
    console.log(`Fetching classroom moment with id ${id} from ${url}`);
    
    // 发送请求获取数据
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // 确保请求不会被缓存
      cache: 'no-store'
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch classroom moment with id ${id} (status: ${response.status})`);
    }
    
    // 解析响应数据
    const data = await response.json();
    console.log(`Successfully fetched data for classroom moment ${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching classroom moment ${id}:`, error);
    throw error; // 将错误向上传播，让调用者处理
  }
}

// 创建新的课堂记录
export async function createClassroomMoment(data: any) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/classroomMoments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create classroom moment')
  }
  
  return response.json()
}

// 更新课堂记录
export async function updateClassroomMoment(id: string, data: any) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/classroomMoments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to update classroom moment with id ${id}`)
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
    const initialResponse = await fetch(`${API_CONFIG.BASE_URL}/api/classroomMoments`, {
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
      const updateResponse = await fetch(`${API_CONFIG.BASE_URL}/api/classroomMoments/${initialData.id}`, {
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
      await fetch(`${API_CONFIG.BASE_URL}/api/classroomMoments/${initialData.id}`, {
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