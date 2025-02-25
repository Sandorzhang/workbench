// 登录页面组件
// 使用 Next.js 的 Server Component
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs"
import { LoginWithPassword } from "@/components/features/login/login-with-password"
import { LoginWithPhone } from "@/components/features/login/login-with-phone"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* 左侧大图区域 - 添加固定宽度确保不会占据过多空间 */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90" />
        <Image
          src="/login-hero.jpg"
          alt="Login hero image"
          fill
          className="object-cover object-center"
          priority
        />
        {/* 左侧文字叠加 */}
        <div className="relative z-10 h-full flex flex-col justify-center px-12">
          <h1 className="text-4xl font-bold text-white mb-6">欢迎使用数智大脑</h1>
          <p className="text-lg text-white/90">
            高效的教学管理平台，助力教育工作者提升工作效率
          </p>
        </div>
      </div>
      
      {/* 右侧登录面板 - 确保在小屏幕下占据全部宽度 */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">数智大脑</h2>
            <p className="text-sm text-muted-foreground">
              请选择以下方式进行登录
            </p>
          </div>
          
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="password">账号密码登录</TabsTrigger>
              <TabsTrigger value="phone">手机验证码登录</TabsTrigger>
            </TabsList>
            <TabsContent value="password">
              <LoginWithPassword />
            </TabsContent>
            <TabsContent value="phone">
              <LoginWithPhone />
            </TabsContent>
          </Tabs>

          {/* 底部版权信息 */}
          <p className="text-center text-sm text-muted-foreground pt-8">
            © 2024 五石炼成(上海). All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
} 