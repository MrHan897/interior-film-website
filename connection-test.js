const http = require('http');

console.log('🔍 연결 테스트 시작...\n');

// 테스트할 주소들
const testUrls = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://172.27.189.85:3000'
];

async function testConnection(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`✅ ${url} - 상태: ${res.statusCode} - 응답시간: ${responseTime}ms`);
      resolve({ url, status: res.statusCode, responseTime, success: true });
    });

    req.on('error', (err) => {
      console.log(`❌ ${url} - 오류: ${err.message}`);
      resolve({ url, error: err.message, success: false });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏰ ${url} - 타임아웃 (5초)`);
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function runTests() {
  console.log('📊 WSL 내부 연결 테스트 결과:\n');
  
  for (const url of testUrls) {
    await testConnection(url);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 다음 단계:');
  console.log('1. Windows PowerShell 명령어 실행 완료');
  console.log('2. 브라우저에서 http://localhost:3000 접속 시도');
  console.log('3. 접속 안되면 http://172.27.189.85:3000 직접 시도');
  console.log('='.repeat(50));
}

runTests();