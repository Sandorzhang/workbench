import { GraduationCap } from "lucide-react"

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "学业旅程",
      href: "/dashboard/academic-journey",
      icon: GraduationCap,
      appCode: "academic-journey",
      role: ["TEACHER", "ADMIN"]
    }
    // ... 其他导航项
  ]
} 