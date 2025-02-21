'use client'

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
    // 调用发送验证码API
    try {
      await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
    } catch (error) {
      console.error(error)
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

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) throw new Error('登录失败')
      
      const data = await response.json()
      // 登录成功，跳转到工作台
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
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
                      className="text-center h-14 text-3xl font-mono tracking-wider border-2 focus:border-primary p-0 leading-none"
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