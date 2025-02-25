import type { User } from './user'
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export function getUser(): User | null {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  return JSON.parse(userStr)
}

/**
 * 认证相关类型和函数
 */

// 模拟用户会话
export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
    tenantId: number;
  };
  expires: string;
}

// 模拟认证函数
export async function auth(): Promise<Session | null> {
  // 在实际应用中，这里会检查用户的认证状态
  // 这里我们返回一个模拟的教师用户
  return {
    user: {
      id: "1",
      name: "张老师",
      email: "teacher@example.com",
      role: "TEACHER",
      tenantId: 1
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
}

// 检查用户是否已认证
export function isAuthenticated(session: Session | null): boolean {
  if (!session) return false;
  
  const expiresDate = new Date(session.expires);
  return expiresDate > new Date();
}

// 检查用户是否有特定角色
export function hasRole(session: Session | null, roles: string[]): boolean {
  if (!session) return false;
  return roles.includes(session.user.role);
}

// 确保 NextAuth 配置正确
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }
          
          console.log(`NextAuth authorize: username=${credentials.username}`);
          
          // 调用登录 API
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });
          
          console.log(`NextAuth authorize response status: ${response.status}`);
          
          if (!response.ok) {
            console.error('NextAuth authorize failed');
            return null;
          }
          
          const user = await response.json();
          console.log('NextAuth authorize successful, user:', user);
          return user;
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.username = user.username;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}; 