import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화 (환경 변수가 있을 때만)
let supabase: ReturnType<typeof createClient> | null = null
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://temp.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'temp_service_key'
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(supabaseUrl, supabaseKey)
  } else {
    console.log('Supabase 환경 변수가 없습니다. 샘플 데이터를 사용합니다.')
  }
} catch (error) {
  console.log('Supabase 초기화 실패. 샘플 데이터를 사용합니다.')
}

// PUT - 포트폴리오 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Supabase가 설정되지 않은 경우 에러 반환
  if (!supabase) {
    return NextResponse.json({ 
      error: 'Database not configured. Portfolio update is not available.' 
    }, { status: 503 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, category, description, image_url, tags, featured, blogUrl, location, completedAt } = body

    const { data, error } = await supabase
      .from('portfolio')
      .update({
        title,
        category,
        description,
        image_url,
        tags: Array.isArray(tags) ? tags : [tags],
        featured: featured || false,
        blogUrl: blogUrl || null,
        location: location || null,
        completedAt: completedAt || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Portfolio update error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

// DELETE - 포트폴리오 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Supabase가 설정되지 않은 경우 에러 반환
  if (!supabase) {
    return NextResponse.json({ 
      error: 'Database not configured. Portfolio deletion is not available.' 
    }, { status: 503 })
  }

  try {
    const { id } = await params

    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Portfolio deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}