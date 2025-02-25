import { createServer } from 'miragejs'
import applicationRoutes from './api/app-management/applications'
import roleRoutes from './api/app-management/roles'
// ... 导入其他路由

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = 'api'
      
      // 注册所有路由
      Object.entries(applicationRoutes).forEach(([route, handler]) => {
        const [method, path] = route.split(' ')
        this[method.toLowerCase()](path, handler)
      })
      // ... 注册其他路由
    }
  })
} 