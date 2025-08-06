import { NextRequest } from 'next/server'
import { logRateLimitHit } from './security-logger'

interface RateLimitConfig {
  windowMs: number // 시간 윈도우 (밀리초)
  maxRequests: number // 최대 요청 수
  keyGenerator?: (request: NextRequest) => string // 키 생성 함수
  skipSuccessfulRequests?: boolean // 성공한 요청은 제외
  skipFailedRequests?: boolean // 실패한 요청은 제외
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
    firstRequest: number
  }
}

class InMemoryRateLimitStore {
  private store: RateLimitStore = {}
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // 5분마다 만료된 항목 정리
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  get(key: string): { count: number; resetTime: number } | null {
    const record = this.store[key]
    if (!record) return null

    const now = Date.now()
    if (record.resetTime < now) {
      delete this.store[key]
      return null
    }

    return {
      count: record.count,
      resetTime: record.resetTime
    }
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now()
    const existing = this.store[key]

    if (!existing || existing.resetTime < now) {
      // 새로운 윈도우 시작
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now
      }
      return {
        count: 1,
        resetTime: now + windowMs
      }
    }

    // 기존 윈도우에서 카운트 증가
    existing.count++
    return {
      count: existing.count,
      resetTime: existing.resetTime
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store = {}
  }
}

class RateLimiter {
  private store: InMemoryRateLimitStore
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    this.store = new InMemoryRateLimitStore()
  }

  private generateKey(request: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(request)
    }

    // 기본 키 생성: IP + endpoint
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const pathname = new URL(request.url).pathname
    return `${ip}:${pathname}`
  }

  async checkLimit(request: NextRequest): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
    totalRequests: number
  }> {
    const key = this.generateKey(request)
    const result = this.store.increment(key, this.config.windowMs)

    const allowed = result.count <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - result.count)

    // Rate limit 초과 시 로그 기록
    if (!allowed) {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      const userAgent = request.headers.get('user-agent')
      const pathname = new URL(request.url).pathname
      
      logRateLimitHit(ip, pathname, this.config.maxRequests, userAgent || undefined)
    }

    return {
      allowed,
      remaining,
      resetTime: result.resetTime,
      totalRequests: result.count
    }
  }

  destroy(): void {
    this.store.destroy()
  }
}

// 미리 정의된 Rate Limiter 인스턴스들
export const rateLimiters = {
  // 일반 API 요청 (분당 60회)
  general: new RateLimiter({
    windowMs: 60 * 1000, // 1분
    maxRequests: 60
  }),

  // 로그인 API (분당 5회)
  login: new RateLimiter({
    windowMs: 60 * 1000, // 1분
    maxRequests: 5,
    keyGenerator: (request) => {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      return `login:${ip}`
    }
  }),

  // 예약 생성 API (분당 10회)
  reservation: new RateLimiter({
    windowMs: 60 * 1000, // 1분
    maxRequests: 10,
    keyGenerator: (request) => {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      return `reservation:${ip}`
    }
  }),

  // 파일 업로드 (시간당 20회)
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1시간
    maxRequests: 20,
    keyGenerator: (request) => {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      return `upload:${ip}`
    }
  }),

  // 관리자 API (분당 100회)
  admin: new RateLimiter({
    windowMs: 60 * 1000, // 1분
    maxRequests: 100,
    keyGenerator: (request) => {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      return `admin:${ip}`
    }
  })
}

// Rate limiting 미들웨어 헬퍼
export async function applyRateLimit(
  request: NextRequest, 
  limiterType: keyof typeof rateLimiters = 'general'
): Promise<{
  success: boolean
  headers: Record<string, string>
  status?: number
  message?: string
}> {
  const limiter = rateLimiters[limiterType]
  const result = await limiter.checkLimit(request)

  const headers = {
    'X-RateLimit-Limit': String(limiter['config'].maxRequests),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  }

  if (!result.allowed) {
    return {
      success: false,
      headers: {
        ...headers,
        'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000))
      },
      status: 429,
      message: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  return {
    success: true,
    headers
  }
}

// 정리 함수 (앱 종료 시 호출)
export function cleanupRateLimiters(): void {
  Object.values(rateLimiters).forEach(limiter => {
    limiter.destroy()
  })
}