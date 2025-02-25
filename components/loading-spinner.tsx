/**
 * 通用加载状态展示组件
 * 
 * 功能：
 * 1. 提供统一的加载动画展示
 * 2. 可在任何需要加载状态的地方复用
 * 3. 保持一致的加载状态样式
 * 
 * 样式特点：
 * - 居中显示的旋转动画
 * - 使用主题色
 * - 固定的容器高度
 * 
 * 使用方式：
 * - 直接导入 LoadingSpinner 组件
 * - 在需要显示加载状态的地方使用
 */

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
} 