import { NextRequest, NextResponse } from 'next/server'

// 트래픽 수집 미들웨어
export interface TrafficData {
  id?: string
  ip: string
  userAgent: string
  method: string
  path: string
  query: string
  referer: string | null
  timestamp: string
  country: string | null
  city: string | null
  device: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  sessionId: string
  duration?: number
  isBot: boolean
}

export class TrafficCollector {
  private static instance: TrafficCollector
  private trafficData: TrafficData[] = []
  private readonly MAX_ENTRIES = 10000 // 메모리 제한
  
  private constructor() {}

  static getInstance(): TrafficCollector {
    if (!TrafficCollector.instance) {
      TrafficCollector.instance = new TrafficCollector()
    }
    return TrafficCollector.instance
  }

  // 트래픽 데이터 수집
  collectTraffic(request: NextRequest): TrafficData {
    const url = new URL(request.url)
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer')
    const ip = this.getClientIP(request)
    
    const trafficEntry: TrafficData = {
      ip,
      userAgent,
      method: request.method,
      path: url.pathname,
      query: url.search,
      referer,
      timestamp: new Date().toISOString(),
      country: request.geo?.country || null,
      city: request.geo?.city || null,
      device: this.detectDevice(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
      sessionId: this.generateSessionId(request),
      isBot: this.isBot(userAgent)
    }

    // 메모리 관리: 최대 항목 수 제한
    if (this.trafficData.length >= this.MAX_ENTRIES) {
      this.trafficData.shift() // 가장 오래된 항목 제거
    }

    this.trafficData.push(trafficEntry)
    
    // 데이터베이스에 저장 (비동기)
    this.saveToDatabase(trafficEntry).catch(error => {
      console.error('Traffic data save error:', error)
    })

    return trafficEntry
  }

  // 클라이언트 IP 추출
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const connectingIP = request.headers.get('cf-connecting-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    if (realIP) return realIP
    if (connectingIP) return connectingIP
    
    return request.ip || 'unknown'
  }

  // 디바이스 타입 감지
  private detectDevice(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    const mobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const tablet = /iPad|Android.*Tablet|Windows.*Touch/i.test(userAgent)
    
    if (tablet) return 'tablet'
    if (mobile) return 'mobile'
    return 'desktop'
  }

  // 브라우저 감지
  private detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    return 'Other'
  }

  // 운영체제 감지
  private detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac OS')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Other'
  }

  // 봇 감지
  private isBot(userAgent: string): boolean {
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper',
      'googlebot', 'bingbot', 'slurp', 'duckduckgo',
      'facebookexternalhit', 'twitterbot', 'linkedinbot'
    ]
    
    const lowerUserAgent = userAgent.toLowerCase()
    return botPatterns.some(pattern => lowerUserAgent.includes(pattern))
  }

  // 세션 ID 생성
  private generateSessionId(request: NextRequest): string {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const date = new Date().toDateString()
    
    // 간단한 해시 생성 (실제로는 더 강력한 해시 사용 권장)
    const hash = Buffer.from(`${ip}-${userAgent}-${date}`).toString('base64')
    return hash.substring(0, 16)
  }

  // 데이터베이스에 저장
  private async saveToDatabase(data: TrafficData): Promise<void> {
    try {
      // Supabase 또는 다른 데이터베이스에 저장
      // 현재는 시뮬레이션
      
      /*
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error } = await supabase
        .from('traffic_logs')
        .insert([{
          ip: data.ip,
          user_agent: data.userAgent,
          method: data.method,
          path: data.path,
          query: data.query,
          referer: data.referer,
          country: data.country,
          city: data.city,
          device: data.device,
          browser: data.browser,
          os: data.os,
          session_id: data.sessionId,
          is_bot: data.isBot,
          created_at: data.timestamp
        }])

      if (error) {
        console.error('Database save error:', error)
      }
      */
      
      // 로컬 로그 파일에 저장 (개발용)
      if (process.env.NODE_ENV === 'development') {
        console.log('Traffic collected:', {
          path: data.path,
          device: data.device,
          browser: data.browser,
          country: data.country,
          isBot: data.isBot
        })
      }
    } catch (error) {
      console.error('Traffic save error:', error)
    }
  }

  // 트래픽 통계 조회
  getTrafficStats() {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recent24h = this.trafficData.filter(entry => 
      new Date(entry.timestamp) >= last24Hours && !entry.isBot
    )
    const recent7d = this.trafficData.filter(entry => 
      new Date(entry.timestamp) >= last7Days && !entry.isBot
    )

    return {
      total: this.trafficData.length,
      last24Hours: recent24h.length,
      last7Days: recent7d.length,
      uniqueVisitors24h: new Set(recent24h.map(entry => entry.sessionId)).size,
      uniqueVisitors7d: new Set(recent7d.map(entry => entry.sessionId)).size,
      topPages: this.getTopPages(recent7d),
      deviceBreakdown: this.getDeviceBreakdown(recent7d),
      browserBreakdown: this.getBrowserBreakdown(recent7d),
      countryBreakdown: this.getCountryBreakdown(recent7d)
    }
  }

  // 상위 페이지 조회
  private getTopPages(data: TrafficData[]) {
    const pageCounts = data.reduce((acc, entry) => {
      acc[entry.path] = (acc[entry.path] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }))
  }

  // 디바이스 분석
  private getDeviceBreakdown(data: TrafficData[]) {
    const deviceCounts = data.reduce((acc, entry) => {
      acc[entry.device] = (acc[entry.device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return deviceCounts
  }

  // 브라우저 분석
  private getBrowserBreakdown(data: TrafficData[]) {
    const browserCounts = data.reduce((acc, entry) => {
      acc[entry.browser] = (acc[entry.browser] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return browserCounts
  }

  // 국가별 분석
  private getCountryBreakdown(data: TrafficData[]) {
    const countryCounts = data.reduce((acc, entry) => {
      const country = entry.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }))
  }

  // 실시간 트래픽 조회
  getRealTimeTraffic(minutes: number = 30) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    return this.trafficData.filter(entry => 
      new Date(entry.timestamp) >= cutoff && !entry.isBot
    )
  }
}

// 미들웨어 함수
export function collectTrafficMiddleware(request: NextRequest) {
  // 정적 파일과 API 루트는 제외
  const { pathname } = new URL(request.url)
  
  const excludePaths = [
    '/api/',
    '/_next/',
    '/_static/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '.css',
    '.js',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2'
  ]

  const shouldCollect = !excludePaths.some(path => pathname.includes(path))

  if (shouldCollect) {
    const collector = TrafficCollector.getInstance()
    collector.collectTraffic(request)
  }

  return NextResponse.next()
}