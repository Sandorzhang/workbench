'use client'

import { useState, useRef, useEffect } from "react"
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
import { cn } from "@/lib/types/utils"
import { authApi } from '@/lib/api/auth'
import { eventBus } from "@/lib/events"

// 定义表单验证规则
const formSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  code: z.string().length(6, "验证码必须是6位"),
})

export function LoginWithPhone() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const codeInputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null))

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      code: "",
    },
  })

  // 发送验证码
  const sendCode = async () => {
    const phone = form.getValues("phone")
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      form.setError("phone", { message: "请输入正确的手机号" })
      return
    }

    setCountdown(60)
    try {
      const data = await authApi.sendCode({ phone })
      console.log('验证码发送成功:', data)
    } catch (error) {
      console.error('发送验证码错误:', error)
      form.setError("phone", { 
        message: error instanceof Error ? error.message : "发送验证码失败，请稍后重试" 
      })
    }
  }

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 验证码输入框处理
  const handleCodeInput = (index: number, value: string) => {
    if (value.length === 1) {
      // 自动跳转到下一个输入框
      if (index < 5) {
        codeInputRefs[index + 1].current?.focus()
      }
    }
    // 更新验证码值
    const newCode = form.getValues("code").split("")
    newCode[index] = value
    form.setValue("code", newCode.join(""))
  }

  useEffect(() => {
    // 添加事件监听
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') {
        e.stopPropagation()
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const user = await authApi.loginWithPhone({
        phone: values.phone,
        code: values.code
      })
      const userData = {
        ...user,
        name: user.name || user.username || '用户',
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
        message: error instanceof Error ? error.message : '登录失败，请检查手机号和验证码' 
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="请输入手机号" {...field} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={sendCode}
                  disabled={countdown > 0}
                  className="w-32 shrink-0"
                >
                  {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>验证码</FormLabel>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <FormControl key={index}>
                    <Input
                      ref={codeInputRefs[index]}
                      maxLength={1}
                      className={cn(
                        "h-[68]",
                        "text-center aspect-square text-4xl! font-mono",
                        "border-2 focus:border-primary",
                        "p-0 leading-none",
                        "flex items-center justify-center"
                      )}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </FormControl>
                ))}
              </div>
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