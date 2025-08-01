import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'this-month'
    const type = searchParams.get('type') || 'revenue'

    // 실제 구현에서는 데이터베이스에서 기간별 집계 데이터 조회
    const reportData = {
      period: '2024년 1월',
      summary: {
        revenue: 28500000,
        bookings: 18,
        customers: 12,
        avgOrderValue: 1583333,
        completionRate: 94.4,
        growth: {
          revenue: 23.5,
          bookings: 15.2,
          customers: 8.7,
          avgOrderValue: 12.3
        }
      },
      monthlyTrends: [
        { month: '2023-08', revenue: 15200000, bookings: 8, growth: 0 },
        { month: '2023-09', revenue: 18500000, bookings: 11, growth: 21.7 },
        { month: '2023-10', revenue: 22100000, bookings: 13, growth: 19.5 },
        { month: '2023-11', revenue: 25800000, bookings: 15, growth: 16.7 },
        { month: '2023-12', revenue: 19200000, bookings: 9, growth: -25.6 },
        { month: '2024-01', revenue: 28500000, bookings: 18, growth: 48.4 }
      ],
      serviceStats: [
        {
          service: '아파트 인테리어 필름',
          revenue: 12600000,
          count: 6,
          percentage: 44.2
        },
        {
          service: '사무실 인테리어 필름',
          revenue: 9500000,
          count: 3,
          percentage: 33.3
        },
        {
          service: '상가 인테리어 필름',
          revenue: 4200000,
          count: 5,
          percentage: 14.7
        },
        {
          service: '주택 인테리어 필름',
          revenue: 2200000,
          count: 4,
          percentage: 7.8
        }
      ],
      customerAnalysis: {
        newCustomers: 12,
        returningCustomers: 4,
        vipCustomers: 3,
        averageLifetimeValue: 4200000,
        customerSatisfaction: 4.6
      },
      insights: [
        {
          type: 'positive',
          message: '평균 주문 금액이 158만원으로 업계 평균을 상회합니다.',
          priority: 'high'
        },
        {
          type: 'neutral',
          message: '완료율 94.4%로 안정적인 서비스 품질을 유지하고 있습니다.',
          priority: 'medium'
        },
        {
          type: 'suggestion',
          message: '신규 고객 12명 중 4명이 재방문 가능성이 높습니다.',
          priority: 'low'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json(
      { success: false, error: '보고서 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { period, format, email } = await request.json()

    // 보고서 생성 로직 (PDF, Excel 등)
    console.log('보고서 생성 요청:', { period, format, email })

    // 실제 구현에서는 보고서 생성 후 이메일 발송 또는 다운로드 링크 제공
    const reportId = Date.now().toString()

    return NextResponse.json({
      success: true,
      reportId,
      downloadUrl: `/api/admin/reports/download/${reportId}`,
      message: '보고서가 성공적으로 생성되었습니다.'
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { success: false, error: '보고서 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}