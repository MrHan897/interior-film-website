import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    // 실제 구현에서는 데이터베이스에서 조회
    const quote = {
      id: quoteId,
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
    }

    return NextResponse.json({
      success: true,
      quote
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { success: false, error: '견적 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id
    const data = await request.json()

    // 실제 구현에서는 데이터베이스 업데이트
    const updatedQuote = {
      id: quoteId,
      ...data,
      updatedAt: new Date().toISOString().split('T')[0]
    }

    console.log('견적 수정:', updatedQuote)

    return NextResponse.json({
      success: true,
      quote: updatedQuote,
      message: '견적이 성공적으로 수정되었습니다.'
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { success: false, error: '견적 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    // 실제 구현에서는 데이터베이스에서 삭제
    console.log('견적 삭제:', quoteId)

    return NextResponse.json({
      success: true,
      message: '견적이 성공적으로 삭제되었습니다.'
    })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { success: false, error: '견적 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}