import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export interface EventRecord {
  id?: string
  event_type: 'b2b' | 'personal_support' | 'work_schedule' | 'company_event' | 'meeting' | 'other'
  title: string
  description?: string
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  location?: string
  attendees?: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  assigned_to?: string
  client_company?: string
  contact_person?: string
  contact_phone?: string
  notes?: string
  created_by: string
  created_at?: string
  updated_at?: string
}

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
    
    const eventData: Omit<EventRecord, 'id' | 'created_at' | 'updated_at'> = {
      event_type: body.event_type,
      title: body.title,
      description: body.description,
      start_date: body.start_date,
      start_time: body.start_time,
      end_date: body.end_date,
      end_time: body.end_time,
      location: body.location,
      attendees: body.attendees || [],
      priority: body.priority || 'medium',
      status: body.status || 'scheduled',
      assigned_to: body.assigned_to,
      client_company: body.client_company,
      contact_person: body.contact_person,
      contact_phone: body.contact_phone,
      notes: body.notes,
      created_by: body.created_by || 'admin'
    }

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()

    if (error) {
      console.error('Supabase POST error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      // events 테이블이 존재하지 않는 경우
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'events 테이블이 설정되지 않았습니다.',
            details: 'Supabase 대시보드에서 다음 SQL을 실행해주세요:\n\n' + 
                    'supabase-events-schema.sql 파일의 내용을 복사하여 실행하세요.',
            action: 'table_not_found'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: '일정 저장 중 오류가 발생했습니다.',
          debug: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '일정이 성공적으로 등록되었습니다.', data },
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
    const eventType = searchParams.get('event_type')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

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
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // events 테이블이 존재하지 않는 경우 샘플 데이터 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.log('events 테이블이 없습니다. 샘플 데이터를 반환합니다.')
        
        // 샘플 일정 데이터
        const sampleEvents = [
          {
            id: 'sample-1',
            event_type: 'b2b',
            title: 'B2B 업체 미팅',
            description: '새로운 B2B 파트너와의 업무 논의',
            start_date: new Date().toISOString().split('T')[0],
            start_time: '14:00',
            end_date: new Date().toISOString().split('T')[0],
            end_time: '15:00',
            location: '본사 회의실',
            attendees: ['김대표', '이부장'],
            priority: 'high',
            status: 'scheduled',
            assigned_to: '김대표',
            client_company: 'ABC 인테리어',
            contact_person: '박팀장',
            contact_phone: '010-1234-5678',
            notes: '계약서 검토 필요',
            created_by: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-2',
            event_type: 'work_schedule',
            title: '아파트 필름 시공',
            description: '강남구 아파트 필름 시공 작업',
            start_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 내일
            start_time: '09:00',
            end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            end_time: '17:00',
            location: '강남구 삼성동',
            attendees: ['김기사', '박기사'],
            priority: 'medium',
            status: 'scheduled',
            assigned_to: '김기사',
            notes: '장비 점검 완료',
            created_by: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        
        return NextResponse.json({
          data: sampleEvents,
          total: sampleEvents.length,
          page: 1,
          limit: 10,
          note: 'events 테이블이 설정되지 않아 샘플 데이터를 표시합니다. Supabase에서 events 테이블을 생성해주세요.'
        })
      }
      
      return NextResponse.json(
        { 
          error: '일정 조회 중 오류가 발생했습니다.',
          debug: error.message
        },
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