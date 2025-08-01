import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// JWT 토큰 검증을 위한 간단한 구현
function isValidToken(token: string): boolean {
  try {
    // 실제 환경에서는 JWT 라이브러리를 사용해야 합니다
    // 여기서는 간단한 구현으로 대체
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    
    // 토큰 만료 시간 체크
    return payload.exp > now
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 관리자 페이지 보호
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value
    
    // 로그인 페이지는 예외
    if (pathname === '/admin/login') {
      // 이미 로그인된 경우 대시보드로 리다이렉트
      if (token && isValidToken(token)) {
        return NextResponse.redirect(new URL('/admin/schedule', request.url))
      }
      return NextResponse.next()
    }
    
    // 토큰이 없거나 유효하지 않은 경우
    if (!token || !isValidToken(token)) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|[\\w-]+\\.\\w+).*)',
  ],
}