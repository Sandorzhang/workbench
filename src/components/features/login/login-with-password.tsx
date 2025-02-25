'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/common/ui/button"
import { Input } from "@/components/common/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { authApi } from '@/lib/api/auth'

// 定义表单验证规则
const formSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码至少6位"),
})

export function LoginWithPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const user = await authApi.login(values)
      const userData = {
        ...user,
        name: user.name || user.username,
        avatar: user.avatar || '/avatars/default.png'
      }
      
      // 先存储用户数据
      localStorage.setItem('user', JSON.stringify(userData))
      
      // 使用 setTimeout 确保状态更新完成后再跳转
      setTimeout(() => {
        router.replace('/dashboard')
      }, 100)
      
    } catch (error) {
      console.error('登录错误:', error)
      form.setError('root', { 
        message: error instanceof Error ? error.message : '登录失败，请检查用户名和密码' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" placeholder="请输入密码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "登录中..." : "登录"}
        </Button>
      </form>
    </Form>
  )
} 