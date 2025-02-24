import { GraduationCap, Calendar, BarChart } from "lucide-react"

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "学业旅程",
      href: "/dashboard/academic-journey",
      icon: GraduationCap,
      appCode: "academic-journey",
      role: ["TEACHER", "ADMIN"]
    },
    {
      title: "课表管理",
      href: "/dashboard/class-schedule",
      icon: Calendar,
      appCode: "class-schedule",
      role: ["TEACHER", "ADMIN"]
    },
    {
      title: "班级模型报告",
      href: "/dashboard/class-model",
      icon: BarChart,
      appCode: "class-model",
      role: ["TEACHER", "ADMIN"]
    }
    // ... 其他导航项
  ]
} 