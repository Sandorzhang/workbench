/**
 * 路由配置文件
 * 统一管理所有前端路由
 */

const ROUTE_PARAMS = {
  APP_ID: 'id',            // 使用 'id' 作为应用ID的参数名
  ROLE_ID: 'id',           // 使用 'id' 作为角色ID的参数名
  FRAMEWORK_ID: 'id',      // 使用 'id' 作为框架ID的参数名
  TASK_ID: 'id',          // 使用 'id' 作为任务ID的参数名
  STUDENT_ID: 'studentId', // 使用 'studentId' 作为学生ID的参数名
  UNIT_ID: 'unitId',      // 保持原有的 unitId
  TEACHER_ID: 'teacherId', // 保持原有的 teacherId
  RECORD_ID: 'recordId',   // 保持原有的 recordId
  PLAN_ID: 'planId'       // 保持原有的 planId
} as const

export const ROUTES = {
  // 仪表盘
  DASHBOARD: '/dashboard',
  
  // 情境评估相关路由
  ASSESSMENT: {
    ROOT: '/dashboard/situational-assessment',
    FRAMEWORKS: {
      LIST: '/dashboard/situational-assessment/frameworks',
      DETAIL: (id: string | number) => `/dashboard/situational-assessment/frameworks/${id}`,
      EDIT: (id: string | number) => `/dashboard/situational-assessment/frameworks/${id}/edit`,
      CREATE: '/dashboard/situational-assessment/frameworks/create',
    },
    TASKS: {
      LIST: '/dashboard/situational-assessment/tasks',
      CREATE: '/dashboard/situational-assessment/tasks/create',
    }
  },
  
  // 学术旅程相关路由
  ACADEMIC: {
    JOURNEY: {
      DETAIL: (studentId: string | number) => `/dashboard/academic-journey/${studentId}`,
    }
  },

  APP_MANAGEMENT: {
    ROOT: '/dashboard/app-management',
    APPLICATIONS: {
      LIST: '/dashboard/app-management/applications',
      DETAIL: (id: string | number) => `/dashboard/app-management/applications/${id}`,
    },
    ROLES: {
      LIST: '/dashboard/app-management/roles',
      DETAIL: (id: string | number) => `/dashboard/app-management/roles/${id}`,
    }
  }
}

// 导出路由参数名称，确保一致性
export const ROUTE_NAMES = {
  APP: '[id]',
  ROLE: '[id]',
  FRAMEWORK: '[id]',
  TASK: '[id]',
  STUDENT: '[studentId]',
  UNIT: '[unitId]',
  TEACHER: '[teacherId]',
  RECORD: '[recordId]',
  PLAN: '[planId]'
} as const 