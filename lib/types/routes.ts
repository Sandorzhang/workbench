/**
 * 路由相关的类型定义文件
 * 
 * 功能：
 * 1. 定义所有路由参数的类型
 * 2. 提供动态路由的类型支持
 * 3. 确保路由参数的类型安全
 * 
 * 类型定义：
 * - RouteParams: 定义所有可能的路由参数
 * - DynamicRoute: 定义动态路由的结构
 * 
 * 使用方式：
 * - 在页面组件中使用这些类型来定义props
 * - 用于类型检查和IDE自动完成
 */

export type RouteParams = {
  id: string;
  studentId: string;
}

export type DynamicRoute = {
  params: Partial<RouteParams>;
} 