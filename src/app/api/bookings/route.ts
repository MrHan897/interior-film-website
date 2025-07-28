import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import type { BookingRecord } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
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
    
    // 전화상담 요청인지 일반 예약인지 확인
    const isPhoneConsult = body.consultation_type === 'phone_consult'
    
    const bookingData: Omit<BookingRecord, 'id' | 'created_at' | 'updated_at'> = isPhoneConsult ? {
      // 전화상담 요청 데이터 - phone_consult를 building_type으로 저장
      building_type: 'phone_consult',
      area_size: body.serviceType || 'apartment', // 건물 유형을 area_size에 임시 저장
      home_condition: '',
      reason: '전화상담 요청',
      spaces: [],
      budget: '',
      timeline: '',
      consult_date: new Date().toISOString().split('T')[0], // 오늘 날짜
      consult_time: '09:00', // 기본 시간
      customer_name: body.name,
      customer_phone: body.phone,
      customer_address: '',
      customer_requirements: body.message || '',
      privacy_consent: true,
      status: 'pending'
    } : {
      // 일반 예약 데이터
      building_type: body.buildingType,
      area_size: body.areaSize,
      home_condition: body.homeCondition,
      reason: body.reason,
      spaces: body.spaces,
      budget: body.budget,
      timeline: body.timeline,
      consult_date: body.consultDate,
      consult_time: body.consultTime,
      customer_name: body.customerInfo.name,
      customer_phone: body.customerInfo.phone,
      customer_address: body.customerInfo.address,
      customer_requirements: body.customerInfo.requirements,
      privacy_consent: body.customerInfo.privacyConsent,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '예약 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    const successMessage = isPhoneConsult 
      ? '전화상담 요청이 성공적으로 등록되었습니다.'
      : '예약이 성공적으로 등록되었습니다.'
    
    return NextResponse.json(
      { message: successMessage, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (limit) {
      const limitNum = parseInt(limit)
      const pageNum = parseInt(page || '1')
      const from = (pageNum - 1) * limitNum
      const to = from + limitNum - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '예약 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      total: count,
      page: parseInt(page || '1'),
      limit: parseInt(limit || '10')
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}