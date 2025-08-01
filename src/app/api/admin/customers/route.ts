import { NextRequest, NextResponse } from 'next/server'

// 임시 데이터
const sampleCustomers = [
  {
    id: '1',
    name: '김민수',
    phone: '010-1234-5678',
    email: 'minsu.kim@email.com',
    address: '서울시 강남구 역삼동 123-456',
    buildingType: 'apartment',
    totalReservations: 3,
    totalSpent: 6300000,
    lastService: '아파트 거실 필름 시공',
    lastServiceDate: '2024-01-20',
    customerSince: '2023-06-15',
    status: 'vip',
    rating: 5,
    notes: '주말 시공 선호, 품질에 매우 만족'
  },
  {
    id: '2',
    name: '이영희',
    phone: '010-2345-6789',
    email: 'younghee.lee@company.com',
    address: '서울시 서초구 반포동 789-123',
    buildingType: 'office',
    totalReservations: 2,
    totalSpent: 8500000,
    lastService: '사무실 전체 인테리어 필름',
    lastServiceDate: '2024-01-19',
    customerSince: '2023-11-20',
    status: 'active',
    rating: 4,
    notes: '법인고객, 정기 유지보수 계약 원함'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const buildingType = searchParams.get('buildingType')

    let filteredCustomers = [...sampleCustomers]

    // 상태 필터링
    if (status && status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status)
    }

    // 건물 유형 필터링
    if (buildingType && buildingType !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.buildingType === buildingType)
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.phone.includes(search) ||
        customer.address.toLowerCase().includes(searchLower) ||
        (customer.email && customer.email.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      success: true,
      customers: filteredCustomers,
      total: filteredCustomers.length
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: '고객 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newCustomer = {
      id: Date.now().toString(),
      ...data,
      totalReservations: 0,
      totalSpent: 0,
      customerSince: new Date().toISOString().split('T')[0],
      status: data.status || 'active'
    }

    console.log('새 고객 생성:', newCustomer)

    return NextResponse.json({
      success: true,
      customer: newCustomer,
      message: '고객이 성공적으로 등록되었습니다.'
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: '고객 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
}