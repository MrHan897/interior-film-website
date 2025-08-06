import { SignJWT, jwtVerify } from 'jose'

// JWT 시크릿 키 (환경변수에서 가져오기)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface TokenPayload {
  username: string
  role: string
  exp: number
  iat: number
}

/**
 * JWT 토큰 생성
 */
export async function generateToken(username: string, role: string = 'admin'): Promise<string> {
  try {
    const token = await new SignJWT({ username, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    return token
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('토큰 생성에 실패했습니다.')
  }
}

/**
 * JWT 토큰 검증
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    
    return {
      username: payload.username as string,
      role: payload.role as string,
      exp: payload.exp as number,
      iat: payload.iat as number
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * 토큰 만료 시간 체크
 */
export function isTokenExpired(payload: TokenPayload): boolean {
  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now
}

/**
 * 안전한 쿠키 옵션
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24시간
  path: '/'
}