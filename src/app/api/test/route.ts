import { NextResponse } from 'next/server';

export async function GET() {
  const testData = {
    status: 'success',
    message: '✅ API 라우트 정상 작동',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    server: 'Vercel Functions',
    test_urls: [
      '/emergency - 긴급 테스트 페이지',
      '/api/test - 이 API 엔드포인트',
      '/api/health - 헬스체크 API',
      '/ - 메인 페이지'
    ]
  };

  return NextResponse.json(testData, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}