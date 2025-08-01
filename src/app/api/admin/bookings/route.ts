import { NextRequest, NextResponse } from 'next/server'

// 임시 데이터
const sampleBookings = [
  {
    id: '1',
    customerName: '김민수',
    phone: '010-1234-5678',
    address: '서울시 강남구 역삼동 123-456',
    service: '아파트 거실 필름 시공',
    scheduledDate: '2024-01-25',
    scheduledTime: '09:00',
    duration: 240,
    worker: '시공팀 A',
    status: 'confirmed',
    priority: 'normal',
    notes: '주말 시공 희망',
    createdAt: '2024-01-20',
    totalAmount: 2100000
  },
  {
    id: '2',
    customerName: '이영희',
    phone: '010-2345-6789',
    address: '서울시 서초구 반포동 789-123',
    service: '사무실 전체 인테리어 필름',
    scheduledDate: '2024-01-26',
    scheduledTime: '14:00',
    duration: 480,
    worker: '시공팀 B',
    status: 'in_progress',
    priority: 'high',
    notes: '야간 작업 가능',
    createdAt: '2024-01-19',
    totalAmount: 4500000
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const date = searchParams.get('date')

    let filteredBookings = [...sampleBookings]

    // 상태 필터링
    if (status && status !== 'all') {
      filteredBookings = filteredBookings.filter(booking => booking.status === status)
    }

    // 날짜 필터링
    if (date) {
      filteredBookings = filteredBookings.filter(booking => booking.scheduledDate === date)
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase()
      filteredBookings = filteredBookings.filter(booking =>
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.phone.includes(search) ||
        booking.address.toLowerCase().includes(searchLower) ||
        booking.service.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      bookings: filteredBookings,
      total: filteredBookings.length
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: '예약 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newBooking = {
      id: Date.now().toString(),
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    }

    console.log('새 예약 생성:', newBooking)

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: '예약이 성공적으로 등록되었습니다.'
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: '예약 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
}