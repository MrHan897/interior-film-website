import { NextRequest, NextResponse } from 'next/server'
import { generateToken, COOKIE_OPTIONS } from '@/lib/auth'
import { adminLoginSchema, sanitizeInput } from '@/lib/validation'
import { logAuthSuccess, logAuthFailure, logValidationError } from '@/lib/security-logger'
import { applyRateLimit } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const endpoint = '/api/admin/login'

  // Rate limiting 적용
  const rateLimitResult = await applyRateLimit(request, 'login')
  if (!rateLimitResult.success) {
    const response = NextResponse.json(
      { error: rateLimitResult.message },
      { status: rateLimitResult.status }
    )
    
    // Rate limit 헤더 추가
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  try {
    const body = await request.json()
    
    // 입력값 정화
    if (body.username) body.username = sanitizeInput(body.username)
    if (body.password) body.password = sanitizeInput(body.password)
    
    // 입력 검증
    const validation = adminLoginSchema.safeParse(body)
    if (!validation.success) {
      // 검증 실패 로그
      validation.error.errors.forEach(error => {
        logValidationError(ip, endpoint, error.path.join('.'), String(body[error.path[0]]), userAgent)
      })
      
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const { username, password } = validation.data

    // 환경변수에서 관리자 계정 정보 가져오기
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // 자격증명 검증
    if (username !== adminUsername || password !== adminPassword) {
      logAuthFailure(ip, username, endpoint, 'invalid_credentials', userAgent)
      
      return NextResponse.json(
        { error: '잘못된 사용자명 또는 비밀번호입니다.' },
        { status: 401 }
      )
    }

    // 토큰 생성
    const token = await generateToken(username, 'admin')

    // 응답 생성 및 쿠키 설정
    const response = NextResponse.json({
      success: true,
      message: '로그인 성공'
    })

    // HttpOnly 쿠키로 토큰 저장 (XSS 방지)
    response.cookies.set('admin-token', token, COOKIE_OPTIONS)

    // Rate limit 헤더 추가
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // 성공 로그 기록
    logAuthSuccess(ip, username, endpoint, userAgent)

    return response

  } catch (error) {
    console.error('Login API error:', error)
    
    // 에러 로그도 보안 로그로 기록
    logAuthFailure(ip, 'unknown', endpoint, 'server_error', userAgent)
    
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 로그아웃을 위한 DELETE 메서드
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: '로그아웃 되었습니다.' })
  
  // 쿠키 삭제 (보안 옵션 포함)
  response.cookies.set('admin-token', '', {
    ...COOKIE_OPTIONS,
    maxAge: 0
  })
  
  return response
}