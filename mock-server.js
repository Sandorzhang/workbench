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
const path = require('path');
const fs = require('fs');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// 合并所有 JSON 文件数据
const getData = () => {
  const dataDir = path.join(__dirname, 'mocks/data');
  let db = {};

  const readDir = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        readDir(filePath);
      } else if (file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        Object.assign(db, data);
      }
    });
  };

  readDir(dataDir);
  return db;
};

// 创建路由和数据库实例
const router = jsonServer.router(getData());

// 使用中间件
server.use(middlewares);
server.use(jsonServer.bodyParser);

// 将数据库实例添加到 app 对象中
server.db = router.db;

// 使用自定义中间件处理 API 请求
server.use('/api', require('./mocks/middleware'));

// 使用默认路由处理其他请求
server.use('/api', router);

// 启动服务器
const port = 3100;
server.listen(port, () => {
  console.log(`Mock Server is running on port ${port}`);
}); 