import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // 기본 쿼리 빌드
    let query = supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    // 상태 필터링
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // 검색 필터링 (고객명, 전화번호, 주소)
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,phone.ilike.%${search}%,address.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: '견적 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      )
    }

    // 프론트엔드 호환성을 위한 데이터 변환
    const formattedQuotes = data?.map(quote => ({
      id: quote.id,
      customerName: quote.customer_name,
      phone: quote.phone,
      address: quote.address,
      buildingType: quote.building_type,
      roomType: quote.room_type,
      areaSize: quote.area_size,
      filmType: quote.film_type,
      difficulty: quote.difficulty,
      materialCost: quote.material_cost,
      laborCost: quote.labor_cost,
      additionalFees: quote.additional_fees,
      totalAmount: quote.total_amount,
      status: quote.status,
      createdAt: quote.created_at?.split('T')[0],
      sentAt: quote.sent_at,
      notes: quote.notes,
      supplierId: quote.supplier_id,
      contractorId: quote.contractor_id,
      supplierInfo: quote.supplier_info,
      contractorInfo: quote.contractor_info
    })) || []

    return NextResponse.json({
      success: true,
      quotes: formattedQuotes,
      total: formattedQuotes.length
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
    
    // 입력 데이터 검증
    const requiredFields = ['customerName', 'phone', 'address', 'buildingType', 'roomType', 'areaSize', 'filmType']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `필수 항목이 누락되었습니다: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // 데이터베이스에 저장할 형태로 변환
    const insertData = {
      customer_name: data.customerName,
      phone: data.phone,
      address: data.address,
      building_type: data.buildingType,
      room_type: data.roomType,
      area_size: parseInt(data.areaSize),
      film_type: data.filmType,
      difficulty: data.difficulty || 'normal',
      material_cost: parseInt(data.materialCost) || 0,
      labor_cost: parseInt(data.laborCost) || 0,
      additional_fees: parseInt(data.additionalFees) || 0,
      status: 'quote_requested',
      notes: data.notes || null,
      supplier_id: data.supplierId || null,
      contractor_id: data.contractorId || null,
      supplier_info: data.supplierInfo || null,
      contractor_info: data.contractorInfo || null
    }

    // Supabase에 데이터 삽입
    const { data: newQuote, error } = await supabase
      .from('quotes')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: '견적 등록 중 오류가 발생했습니다.'
      }, { status: 500 })
    }

    // 프론트엔드 호환성을 위한 데이터 변환
    const formattedQuote = {
      id: newQuote.id,
      customerName: newQuote.customer_name,
      phone: newQuote.phone,
      address: newQuote.address,
      buildingType: newQuote.building_type,
      roomType: newQuote.room_type,
      areaSize: newQuote.area_size,
      filmType: newQuote.film_type,
      difficulty: newQuote.difficulty,
      materialCost: newQuote.material_cost,
      laborCost: newQuote.labor_cost,
      additionalFees: newQuote.additional_fees,
      totalAmount: newQuote.total_amount,
      status: newQuote.status,
      createdAt: newQuote.created_at?.split('T')[0],
      sentAt: newQuote.sent_at,
      notes: newQuote.notes,
      supplierId: newQuote.supplier_id,
      contractorId: newQuote.contractor_id,
      supplierInfo: newQuote.supplier_info,
      contractorInfo: newQuote.contractor_info
    }

    return NextResponse.json({
      success: true,
      quote: formattedQuote,
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

// PUT - 견적 수정
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({
        success: false,
        error: '견적 ID가 필요합니다.'
      }, { status: 400 })
    }

    // 데이터베이스 형태로 변환
    const dbUpdateData = {
      customer_name: updateData.customerName,
      phone: updateData.phone,
      address: updateData.address,
      building_type: updateData.buildingType,
      room_type: updateData.roomType,
      area_size: parseInt(updateData.areaSize),
      film_type: updateData.filmType,
      difficulty: updateData.difficulty,
      material_cost: parseInt(updateData.materialCost) || 0,
      labor_cost: parseInt(updateData.laborCost) || 0,
      additional_fees: parseInt(updateData.additionalFees) || 0,
      status: updateData.status,
      notes: updateData.notes,
      supplier_id: updateData.supplierId,
      contractor_id: updateData.contractorId,
      supplier_info: updateData.supplierInfo,
      contractor_info: updateData.contractorInfo,
      sent_at: updateData.sentAt
    }

    const { data: updatedQuote, error } = await supabase
      .from('quotes')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: '견적 수정 중 오류가 발생했습니다.'
      }, { status: 500 })
    }

    // 프론트엔드 호환성을 위한 데이터 변환
    const formattedQuote = {
      id: updatedQuote.id,
      customerName: updatedQuote.customer_name,
      phone: updatedQuote.phone,
      address: updatedQuote.address,
      buildingType: updatedQuote.building_type,
      roomType: updatedQuote.room_type,
      areaSize: updatedQuote.area_size,
      filmType: updatedQuote.film_type,
      difficulty: updatedQuote.difficulty,
      materialCost: updatedQuote.material_cost,
      laborCost: updatedQuote.labor_cost,
      additionalFees: updatedQuote.additional_fees,
      totalAmount: updatedQuote.total_amount,
      status: updatedQuote.status,
      createdAt: updatedQuote.created_at?.split('T')[0],
      sentAt: updatedQuote.sent_at,
      notes: updatedQuote.notes,
      supplierId: updatedQuote.supplier_id,
      contractorId: updatedQuote.contractor_id,
      supplierInfo: updatedQuote.supplier_info,
      contractorInfo: updatedQuote.contractor_info
    }

    return NextResponse.json({
      success: true,
      quote: formattedQuote,
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

// DELETE - 견적 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: '견적 ID가 필요합니다.'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: '견적 삭제 중 오류가 발생했습니다.'
      }, { status: 500 })
    }

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