import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { collectTrafficMiddleware } from './middleware/traffic'
import { verifyToken, isTokenExpired } from './lib/auth'

// JWT 토큰 검증
async function isValidToken(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token)
    if (!payload) return false
    
    return !isTokenExpired(payload)
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 트래픽 수집 (관리자 페이지와 API 경로 제외)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    collectTrafficMiddleware(request)
  }

  // 관리자 페이지 보호
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value
    
    // 로그인 페이지는 예외
    if (pathname === '/admin/login') {
      // 이미 로그인된 경우 대시보드로 리다이렉트
      if (token && await isValidToken(token)) {
        return NextResponse.redirect(new URL('/admin/schedule', request.url))
      }
      return NextResponse.next()
    }
    
    // 토큰이 없거나 유효하지 않은 경우
    if (!token || !(await isValidToken(token))) {
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