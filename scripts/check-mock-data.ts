import fs from 'fs';
import path from 'path';

// 读取 mock 数据
const usersPath = path.join(process.cwd(), 'mocks/data/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf8')).users;

// 检查数据结构
const requiredFields = ['id', 'name', 'username', 'role', 'avatar'];
const missingFields = users.flatMap((user: any) => 
  requiredFields.filter(field => !(field in user))
    .map(field => `User ${user.id || 'unknown'} is missing field: ${field}`)
);

if (missingFields.length > 0) {
  console.error('Mock data validation failed:');
  missingFields.forEach(msg => console.error(`- ${msg}`));
  process.exit(1);
} else {
  console.log('Mock data validation passed!');
} 