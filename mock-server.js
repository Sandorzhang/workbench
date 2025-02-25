/**
 * Mock 服务器配置文件
 * 
 * 功能：
 * 1. 配置 json-server 作为 Mock 数据服务器
 * 2. 提供 API 路由重写规则
 * 3. 统一添加 /api 前缀
 * 4. 处理 Mock 数据的请求响应
 * 
 * 配置说明：
 * - 使用 json-server 提供 RESTful API
 * - 所有请求都会添加 /api 前缀
 * - 自动将 /api/* 重写到对应的资源
 * 
 * 使用方式：
 * - 运行 node mock-server.js 启动服务
 * - 默认监听 3001 端口
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// 统一使用 /api 前缀
server.use(jsonServer.rewriter({
  '/api/*': '/$1', // 将所有 /api 开头的请求重写到对应的资源
}));

server.use(middlewares);
server.use('/api', router); // 添加 /api 前缀

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
}); 