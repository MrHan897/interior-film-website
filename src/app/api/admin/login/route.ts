import { NextRequest, NextResponse } from 'next/server'

// 간단한 JWT 토큰 생성 (프로덕션에서는 JWT 라이브러리 사용 권장)
function generateSimpleToken(username: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    username,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24시간 후 만료
    iat: Math.floor(Date.now() / 1000)
  }))
  
  // 실제 환경에서는 비밀키로 서명해야 함
  const signature = btoa('simple_signature_' + username)
  
  return `${header}.${payload}.${signature}`
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 환경변수에서 관리자 계정 정보 가져오기
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // 자격증명 검증
    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: '잘못된 사용자명 또는 비밀번호입니다.' },
        { status: 401 }
      )
    }

    // 토큰 생성
    const token = generateSimpleToken(username)

    return NextResponse.json({
      success: true,
      token,
      message: '로그인 성공'
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 로그아웃을 위한 DELETE 메서드
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: '로그아웃 되었습니다.' })
  
  // 쿠키 삭제
  response.cookies.set('admin-token', '', {
    maxAge: 0,
    path: '/'
  })
  
  return response
}