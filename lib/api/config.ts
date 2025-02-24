// 开发环境使用 json-server
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3100' 
  : '/api' 