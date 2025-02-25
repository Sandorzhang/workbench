import fs from 'fs';
import path from 'path';

console.log('Starting mock data validation...');

// 检查文件是否存在
const usersPath = path.join(process.cwd(), 'mocks/data/users.json');
console.log(`Checking if users data file exists at: ${usersPath}`);

if (!fs.existsSync(usersPath)) {
  console.error(`ERROR: Users data file not found at ${usersPath}`);
  process.exit(1);
}

// 读取 mock 数据
try {
  console.log('Reading users data file...');
  const fileContent = fs.readFileSync(usersPath, 'utf8');
  
  console.log('Parsing JSON data...');
  const jsonData = JSON.parse(fileContent);
  
  if (!jsonData.users || !Array.isArray(jsonData.users)) {
    console.error('ERROR: Invalid users data format. Expected { users: [] }');
    console.log('Actual data structure:', JSON.stringify(jsonData, null, 2).substring(0, 200) + '...');
    process.exit(1);
  }
  
  const users = jsonData.users;
  console.log(`Found ${users.length} users in the data file`);
  
  // 检查数据结构
  const requiredFields = ['id', 'name', 'username', 'role', 'avatar'];
  console.log(`Checking for required fields: ${requiredFields.join(', ')}`);
  
  // 记录每个用户的字段
  users.forEach((user, index) => {
    console.log(`User ${index + 1} (${user.id || 'unknown'}):`, 
      Object.keys(user).join(', '));
  });
  
  const missingFields = users.flatMap((user, index) => 
    requiredFields.filter(field => !(field in user))
      .map(field => `User ${index + 1} (${user.id || 'unknown'}) is missing field: ${field}`)
  );
  
  // 检查密码字段 (可选但推荐)
  const missingPasswords = users.filter(user => !user.password)
    .map(user => `User ${user.id || 'unknown'} is missing password`);
  
  if (missingPasswords.length > 0) {
    console.warn('WARNING: Some users are missing passwords:');
    missingPasswords.forEach(msg => console.warn(`- ${msg}`));
  }
  
  // 检查角色值是否有效
  const validRoles = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];
  const invalidRoles = users.filter(user => user.role && !validRoles.includes(user.role))
    .map(user => `User ${user.id || 'unknown'} has invalid role: ${user.role}`);
  
  if (invalidRoles.length > 0) {
    console.warn('WARNING: Some users have invalid roles:');
    invalidRoles.forEach(msg => console.warn(`- ${msg}`));
  }
  
  if (missingFields.length > 0) {
    console.error('ERROR: Mock data validation failed:');
    missingFields.forEach(msg => console.error(`- ${msg}`));
    process.exit(1);
  } else {
    console.log('✅ Mock data validation passed!');
    
    // 额外检查 - 验证用户数据是否可用于登录
    console.log('\nVerifying login credentials:');
    const testUsers = [
      { username: 'admin', password: 'admin123', expected: true },
      { username: 'teacher', password: 'teacher123', expected: true },
      { username: 'student', password: 'student123', expected: true },
      { username: 'nonexistent', password: 'wrong', expected: false }
    ];
    
    testUsers.forEach(test => {
      const user = users.find(u => u.username === test.username && u.password === test.password);
      const result = !!user;
      const status = result === test.expected ? '✅' : '❌';
      console.log(`${status} User "${test.username}": ${result ? 'Found' : 'Not found'}`);
      
      if (result) {
        console.log(`  - ID: ${user.id}`);
        console.log(`  - Name: ${user.name}`);
        console.log(`  - Role: ${user.role}`);
      }
    });
  }
} catch (error) {
  console.error('ERROR: Failed to validate mock data:', error);
  process.exit(1);
} 