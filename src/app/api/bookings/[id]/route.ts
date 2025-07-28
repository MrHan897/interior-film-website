import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    if (!supabase) {
      return NextResponse.json(
        { 
          error: 'Supabase가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
          details: 'NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env.local에 설정해주세요.'
        },
        { status: 500 }
      )
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '예약 상태 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: '해당 예약을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: '예약 상태가 업데이트되었습니다.',
      data: data[0]
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    if (!supabase) {
      return NextResponse.json(
        { 
          error: 'Supabase가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
          details: 'NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env.local에 설정해주세요.'
        },
        { status: 500 }
      )
    }


    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '예약 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '예약이 삭제되었습니다.'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}