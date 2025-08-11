import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - 특정 견적 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: '견적을 찾을 수 없습니다.'
      }, { status: 404 })
    }

    // 프론트엔드 호환성을 위한 데이터 변환
    const formattedQuote = {
      id: data.id,
      customerName: data.customer_name,
      phone: data.phone,
      address: data.address,
      buildingType: data.building_type,
      roomType: data.room_type,
      areaSize: data.area_size,
      filmType: data.film_type,
      difficulty: data.difficulty,
      materialCost: data.material_cost,
      laborCost: data.labor_cost,
      additionalFees: data.additional_fees,
      totalAmount: data.total_amount,
      status: data.status,
      createdAt: data.created_at?.split('T')[0],
      sentAt: data.sent_at,
      notes: data.notes,
      supplierId: data.supplier_id,
      contractorId: data.contractor_id,
      supplierInfo: data.supplier_info,
      contractorInfo: data.contractor_info
    }

    return NextResponse.json({
      success: true,
      quote: formattedQuote
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { success: false, error: '견적 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT - 특정 견적 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    // 데이터베이스 형태로 변환
    const dbUpdateData = {
      customer_name: data.customerName,
      phone: data.phone,
      address: data.address,
      building_type: data.buildingType,
      room_type: data.roomType,
      area_size: parseInt(data.areaSize),
      film_type: data.filmType,
      difficulty: data.difficulty,
      material_cost: parseInt(data.materialCost) || 0,
      labor_cost: parseInt(data.laborCost) || 0,
      additional_fees: parseInt(data.additionalFees) || 0,
      status: data.status,
      notes: data.notes,
      supplier_id: data.supplierId,
      contractor_id: data.contractorId,
      supplier_info: data.supplierInfo,
      contractor_info: data.contractorInfo,
      sent_at: data.sentAt
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

// DELETE - 특정 견적 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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