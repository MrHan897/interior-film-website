import { NextRequest, NextResponse } from 'next/server'

// 임시 데이터 (실제 구현에서는 데이터베이스 사용)
const sampleQuotes = [
  {
    id: '1',
    customerName: '김민수',
    phone: '010-1234-5678',
    address: '서울시 강남구 역삼동 123-456',
    buildingType: 'apartment',
    roomType: '거실, 침실 2개',
    areaSize: 85,
    filmType: '우드그레인 필름',
    difficulty: 'normal',
    materialCost: 1200000,
    laborCost: 800000,
    additionalFees: 100000,
    totalAmount: 2100000,
    status: 'quote_sent',
    createdAt: '2024-01-20',
    sentAt: '2024-01-21',
    notes: '주말 시공 희망'
  },
  {
    id: '2',
    customerName: '이영희',
    phone: '010-2345-6789',
    address: '서울시 서초구 반포동 789-123',
    buildingType: 'office',
    roomType: '사무실 전체',
    areaSize: 120,
    filmType: '메탈릭 필름',
    difficulty: 'hard',
    materialCost: 2400000,
    laborCost: 1800000,
    additionalFees: 300000,
    totalAmount: 4500000,
    status: 'quote_requested',
    createdAt: '2024-01-19',
    notes: '야간 작업 가능'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredQuotes = [...sampleQuotes]

    // 상태 필터링
    if (status && status !== 'all') {
      filteredQuotes = filteredQuotes.filter(quote => quote.status === status)
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase()
      filteredQuotes = filteredQuotes.filter(quote =>
        quote.customerName.toLowerCase().includes(searchLower) ||
        quote.phone.includes(search) ||
        quote.address.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      quotes: filteredQuotes,
      total: filteredQuotes.length
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: '견적 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // 새 견적 생성
    const newQuote = {
      id: Date.now().toString(),
      ...data,
      status: 'quote_requested',
      createdAt: new Date().toISOString().split('T')[0],
      totalAmount: (data.materialCost || 0) + (data.laborCost || 0) + (data.additionalFees || 0)
    }

    // 실제 구현에서는 데이터베이스에 저장
    console.log('새 견적 생성:', newQuote)

    return NextResponse.json({
      success: true,
      quote: newQuote,
      message: '견적이 성공적으로 등록되었습니다.'
    })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { success: false, error: '견적 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
}