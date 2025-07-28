export default function Emergency() {
  return (
    <html>
      <head>
        <title>긴급 테스트</title>
      </head>
      <body style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h1 style={{ color: 'green' }}>✅ Next.js 배포 성공!</h1>
        <p>이 페이지가 보인다면 Vercel 배포가 정상 작동합니다.</p>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h2>🔍 시스템 정보</h2>
          <ul>
            <li><strong>현재 시간:</strong> {new Date().toLocaleString('ko-KR')}</li>
            <li><strong>환경:</strong> {process.env.NODE_ENV || 'unknown'}</li>
            <li><strong>Next.js:</strong> 작동 중</li>
            <li><strong>Vercel:</strong> 배포 완료</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#e8f4f8', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h2>📱 테스트 URL</h2>
          <p>다음 URL들을 차례로 테스트해보세요:</p>
          <ul>
            <li><a href="/">/</a> - 메인 페이지</li>
            <li><a href="/test">/test</a> - 테스트 페이지</li>
            <li><a href="/api/health">/api/health</a> - API 헬스체크</li>
            <li><a href="/booking">/booking</a> - 예약 페이지</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h2>⚠️ 만약 다른 페이지에서 404 오류가 발생한다면:</h2>
          <ol>
            <li>Vercel 대시보드에서 Functions 로그 확인</li>
            <li>Build 로그에서 컴파일 오류 확인</li>
            <li>환경변수 설정 재확인</li>
            <li>이 /emergency 페이지만 작동하는지 확인</li>
          </ol>
        </div>

        <footer style={{ marginTop: '40px', padding: '20px', backgroundColor: '#333', color: 'white', borderRadius: '8px' }}>
          <p>🏠 인테리어 필름 웹사이트 + Task Master AI</p>
          <p>긴급 진단 페이지 - {new Date().toISOString()}</p>
        </footer>
      </body>
    </html>
  );
}