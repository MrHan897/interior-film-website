export default function TestPage() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>🎉 배포 테스트 성공!</h1>
      <p>이 페이지가 보인다면 Next.js 배포가 성공적으로 완료되었습니다.</p>
      
      <div style={{ 
        background: '#f0f8ff', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>📋 시스템 상태</h2>
        <ul>
          <li>✅ Next.js 15.4.1 정상 작동</li>
          <li>✅ Vercel 배포 완료</li>
          <li>✅ 기본 라우팅 작동</li>
          <li>⏳ 데이터베이스 연결 대기</li>
        </ul>
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>🔗 테스트할 페이지들</h2>
        <ul>
          <li><a href="/">메인 페이지</a></li>
          <li><a href="/booking">예약 페이지</a></li>
          <li><a href="/admin/schedule">관리자 일정</a></li>
          <li><a href="/api/health">/api/health (헬스체크)</a></li>
        </ul>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>🏠 인테리어 필름 웹사이트</h2>
        <p>전문적인 인테리어 필름 시공 서비스를 제공합니다.</p>
        <ul>
          <li>🎨 다양한 디자인 필름</li>
          <li>🏢 주거 및 상업공간 시공</li>
          <li>🤖 AI 기반 작업 관리 시스템</li>
          <li>📱 온라인 예약 시스템</li>
        </ul>
      </div>
    </div>
  );
}