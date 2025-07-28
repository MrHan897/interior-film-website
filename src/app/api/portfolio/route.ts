import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 샘플 포트폴리오 데이터
const samplePortfolios = [
  {
    id: '1',
    title: '모던 아파트 거실 리모델링',
    category: '주거 공간',
    description: '기존 벽면을 고급 우드 패턴 필름으로 변화시켜 따뜻하고 세련된 분위기를 연출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    tags: ['우드 패턴', '거실', '아파트'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: '카페 인테리어 필름 시공',
    category: '상업 공간',
    description: '브랜드 아이덴티티에 맞는 컬러와 패턴의 필름으로 독특한 분위기의 카페를 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    tags: ['브랜딩', '카페', '상업공간'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '주방 가구 리폼',
    category: '가구 리폼',
    description: '오래된 주방 가구를 마블 패턴 필름으로 리폼하여 고급스러운 주방으로 변화시켰습니다.',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    tags: ['마블 패턴', '주방', '가구'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: '사무실 파티션 필름',
    category: '상업 공간',
    description: '프라이버시 보호와 동시에 개방감을 유지하는 반투명 필름으로 사무 공간을 구성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    tags: ['프라이버시', '사무실', '파티션'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: '침실 벽면 아트 필름',
    category: '주거 공간',
    description: '포인트 벽면에 아트 패턴 필름을 적용하여 개성있는 침실 공간을 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
    tags: ['아트 패턴', '침실', '포인트 벽'],
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    title: '매장 외벽 브랜딩',
    category: '상업 공간',
    description: '매장 외벽에 브랜드 컬러와 로고를 적용한 필름으로 강력한 브랜딩 효과를 창출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['브랜딩', '외벽', '매장'],
    created_at: new Date().toISOString()
  }
]

// Supabase 클라이언트 초기화 (환경 변수가 있을 때만)
let supabase: ReturnType<typeof createClient> | null = null
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (error) {
  console.log('Supabase 환경 변수가 없습니다. 샘플 데이터를 사용합니다.')
}

// GET - 포트폴리오 목록 조회
export async function GET() {
  // Supabase가 설정되지 않은 경우 샘플 데이터 반환
  if (!supabase) {
    console.log('portfolio 테이블이 없습니다. 샘플 데이터를 반환합니다.')
    return NextResponse.json(samplePortfolios)
  }

  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error details:', error)
      console.log('portfolio 테이블이 없습니다. 샘플 데이터를 반환합니다.')
      return NextResponse.json(samplePortfolios)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    console.log('portfolio 테이블이 없습니다. 샘플 데이터를 반환합니다.')
    return NextResponse.json(samplePortfolios)
  }
}

// POST - 새 포트폴리오 추가
export async function POST(request: NextRequest) {
  // Supabase가 설정되지 않은 경우 에러 반환
  if (!supabase) {
    return NextResponse.json({ 
      error: 'Database not configured. Portfolio creation is not available.' 
    }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { title, category, description, image_url, tags } = body

    const { data, error } = await supabase
      .from('portfolio')
      .insert([
        {
          title,
          category,
          description,
          image_url,
          tags: Array.isArray(tags) ? tags : [tags],
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Portfolio creation error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}