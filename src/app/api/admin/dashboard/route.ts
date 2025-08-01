import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 실제 구현에서는 데이터베이스에서 집계 데이터를 조회
    const dashboardData = {
      stats: {
        todayBookings: 8,
        ongoingProjects: 12,
        pendingQuotes: 5,
        monthlyRevenue: 15800000
      },
      todaySchedule: [
        {
          id: '1',
          time: '09:00',
          customerName: '김민수',
          service: '아파트 거실 필름 시공',
          type: 'installation',
          status: 'confirmed'
        },
        {
          id: '2',
          time: '14:00',
          customerName: '이영희',
          service: '상담 및 견적',
          type: 'consultation',
          status: 'pending'
        },
        {
          id: '3',
          time: '16:30',
          customerName: '박철수',
          service: '필름 교체 A/S',
          type: 'maintenance',
          status: 'confirmed'
        }
      ],
      recentQuotes: [
        {
          id: '1',
          customerName: '정다은',
          service: '오피스 인테리어 필름',
          amount: 2800000,
          date: '2024-01-20',
          status: 'pending'
        },
        {
          id: '2',
          customerName: '최승호',
          service: '아파트 전체 시공',
          amount: 4500000,
          date: '2024-01-19',
          status: 'sent'
        },
        {
          id: '3',
          customerName: '황미영',
          service: '상가 인테리어',
          amount: 1800000,
          date: '2024-01-18',
          status: 'accepted'
        }
      ],
      monthlyTrends: [
        { month: '11월', revenue: 12800000, bookings: 15 },
        { month: '12월', revenue: 14200000, bookings: 18 },
        { month: '1월', revenue: 15800000, bookings: 21 }
      ],
      serviceBreakdown: [
        { service: '아파트', percentage: 45, count: 12 },
        { service: '사무실', percentage: 30, count: 8 },
        { service: '상가', percentage: 15, count: 4 },
        { service: '주택', percentage: 10, count: 3 }
      ]
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: '대시보드 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}