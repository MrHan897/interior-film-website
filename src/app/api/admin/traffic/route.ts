import { NextRequest, NextResponse } from 'next/server'
import { TrafficCollector } from '@/middleware/traffic'

// 트래픽 통계 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stats'
    const minutes = parseInt(searchParams.get('minutes') || '30')

    const collector = TrafficCollector.getInstance()

    switch (type) {
      case 'stats':
        // 전체 트래픽 통계
        const stats = collector.getTrafficStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'realtime':
        // 실시간 트래픽 (기본 30분)
        const realtime = collector.getRealTimeTraffic(minutes)
        return NextResponse.json({
          success: true,
          data: {
            traffic: realtime,
            count: realtime.length,
            timeRange: `${minutes}분`,
            lastUpdate: new Date().toISOString()
          }
        })

      case 'summary':
        // 요약 정보
        const summary = collector.getTrafficStats()
        return NextResponse.json({
          success: true,
          data: {
            totalVisits: summary.total,
            visitsLast24h: summary.last24Hours,
            visitsLast7d: summary.last7Days,
            uniqueVisitors24h: summary.uniqueVisitors24h,
            uniqueVisitors7d: summary.uniqueVisitors7d,
            currentHourTraffic: collector.getRealTimeTraffic(60).length,
            topPage: summary.topPages[0] || { path: '/', count: 0 },
            primaryDevice: getPrimaryDevice(summary.deviceBreakdown),
            primaryBrowser: getPrimaryBrowser(summary.browserBreakdown)
          }
        })

      case 'hourly':
        // 시간별 트래픽 (지난 24시간)
        const hourlyData = getHourlyTraffic(collector)
        return NextResponse.json({
          success: true,
          data: hourlyData
        })

      case 'pages':
        // 페이지별 트래픽
        const pageStats = collector.getTrafficStats()
        return NextResponse.json({
          success: true,
          data: {
            topPages: pageStats.topPages,
            totalPages: pageStats.topPages.length
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Traffic API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch traffic data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 주 디바이스 타입 추출
function getPrimaryDevice(deviceBreakdown: Record<string, number>): string {
  const devices = Object.entries(deviceBreakdown)
  if (devices.length === 0) return 'unknown'
  
  const primary = devices.reduce((max, current) => 
    current[1] > max[1] ? current : max
  )
  return primary[0]
}

// 주 브라우저 추출
function getPrimaryBrowser(browserBreakdown: Record<string, number>): string {
  const browsers = Object.entries(browserBreakdown)
  if (browsers.length === 0) return 'unknown'
  
  const primary = browsers.reduce((max, current) => 
    current[1] > max[1] ? current : max
  )
  return primary[0]
}

// 시간별 트래픽 데이터 생성
function getHourlyTraffic(collector: TrafficCollector) {
  const now = new Date()
  const hours = []
  
  // 지난 24시간 데이터 생성
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const startHour = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours())
    const endHour = new Date(startHour.getTime() + 60 * 60 * 1000)
    
    const realtime = collector.getRealTimeTraffic(24 * 60) // 24시간 데이터
    const hourTraffic = realtime.filter(entry => {
      const entryTime = new Date(entry.timestamp)
      return entryTime >= startHour && entryTime < endHour
    })
    
    hours.push({
      hour: hour.getHours(),
      date: startHour.toISOString(),
      visits: hourTraffic.length,
      uniqueVisitors: new Set(hourTraffic.map(entry => entry.sessionId)).size
    })
  }
  
  return hours
}

// POST, PUT, DELETE는 지원하지 않음
export async function POST() {
  return NextResponse.json(
    { error: 'POST method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'PUT method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'DELETE method not allowed' },
    { status: 405 }
  )
}