// 견적 테이블 생성 및 초기 데이터 삽입 스크립트
const { createClient } = require('@supabase/supabase-js')

// 환경변수 직접 설정
const SUPABASE_URL = 'https://sdjlawzmeeqkyvqwwbga.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkwNDY3MywiZXhwIjoyMDY4NDgwNjczfQ.8FiGRlECUy44kNJ8vG7RV8vVEOkT5vKOhRGgLwSyVcs'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const createQuotesTable = async () => {
  console.log('🔄 견적 관리 시스템 설정 시작...')
  
  try {
    // 기존 데이터 확인 (테이블이 있는지 확인)
    console.log('📋 기존 테이블 확인 중...')
    const { data: existingData, error: selectError } = await supabase
      .from('quotes')
      .select('id')
      .limit(1)
    
    if (selectError) {
      console.log('⚠️  quotes 테이블이 없습니다. 생성이 필요합니다.')
      console.log('\n📝 수동 설정 안내:')
      console.log('1. https://supabase.com 접속')
      console.log('2. 프로젝트 선택 → SQL Editor')
      console.log('3. 아래 SQL 복사하여 실행:')
      console.log('\n--- SQL 시작 ---')
      console.log(`
CREATE TABLE quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    building_type VARCHAR(20) NOT NULL CHECK (building_type IN ('apartment', 'office', 'house', 'store')),
    room_type VARCHAR(200) NOT NULL,
    area_size INTEGER NOT NULL CHECK (area_size > 0),
    film_type VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard')),
    material_cost INTEGER NOT NULL DEFAULT 0 CHECK (material_cost >= 0),
    labor_cost INTEGER NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
    additional_fees INTEGER NOT NULL DEFAULT 0 CHECK (additional_fees >= 0),
    total_amount INTEGER GENERATED ALWAYS AS (material_cost + labor_cost + additional_fees) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'quote_requested' 
        CHECK (status IN ('quote_requested', 'quote_sent', 'confirmed', 'rejected')),
    supplier_id VARCHAR(50),
    contractor_id VARCHAR(50),
    supplier_info JSONB,
    contractor_info JSONB,
    notes TEXT,
    sent_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_quotes_customer ON quotes(customer_name);

-- RLS 활성화
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON quotes FOR ALL USING (true);
      `)
      console.log('--- SQL 끝 ---\n')
      console.log('4. SQL 실행 후 이 스크립트를 다시 실행하세요.')
      return false
    }
    
    console.log('✅ quotes 테이블이 존재합니다!')
    
    // 기존 데이터가 있으면 스킵
    if (existingData && existingData.length > 0) {
      console.log('📊 이미 견적 데이터가 존재합니다.')
      console.log('✅ 설정이 완료된 상태입니다!')
      return true
    }
    
    // 샘플 데이터 삽입
    console.log('🔄 샘플 데이터 삽입 중...')
    
    const sampleQuotes = [
      {
        customer_name: '김민수',
        phone: '010-1234-5678',
        address: '서울시 강남구 역삼동 123-456',
        building_type: 'apartment',
        room_type: '거실, 침실 2개',
        area_size: 85,
        film_type: '우드그레인 필름',
        difficulty: 'normal',
        material_cost: 1200000,
        labor_cost: 800000,
        additional_fees: 100000,
        status: 'quote_sent',
        notes: '주말 시공 희망',
        sent_at: '2024-01-21'
      },
      {
        customer_name: '이영희',
        phone: '010-2345-6789',
        address: '서울시 서초구 반포동 789-123',
        building_type: 'office',
        room_type: '사무실 전체',
        area_size: 120,
        film_type: '메탈릭 필름',
        difficulty: 'hard',
        material_cost: 2400000,
        labor_cost: 1800000,
        additional_fees: 300000,
        status: 'quote_requested',
        notes: '야간 작업 가능'
      },
      {
        customer_name: '박철수',
        phone: '010-3456-7890',
        address: '서울시 마포구 홍대 456-789',
        building_type: 'store',
        room_type: '매장 전체',
        area_size: 60,
        film_type: '솔리드 컬러',
        difficulty: 'easy',
        material_cost: 600000,
        labor_cost: 400000,
        additional_fees: 50000,
        status: 'confirmed'
      }
    ]

    const { error: insertError } = await supabase
      .from('quotes')
      .insert(sampleQuotes)

    if (insertError) {
      console.error('❌ 샘플 데이터 삽입 실패:', insertError)
      return false
    }

    console.log('✅ 샘플 데이터가 성공적으로 삽입되었습니다!')
    console.log('🎉 견적 관리 시스템 초기화 완료!')
    
    return true
    
  } catch (error) {
    console.error('❌ 오류 발생:', error)
    return false
  }
}

// 스크립트 실행
if (require.main === module) {
  createQuotesTable()
    .then((success) => {
      if (success) {
        console.log('\n🔥 모든 설정이 완료되었습니다!')
        console.log('이제 견적 등록 후 새로고침해도 데이터가 유지됩니다.')
      } else {
        console.log('\n💡 위의 안내에 따라 테이블을 생성한 후 다시 실행해주세요.')
      }
      process.exit(success ? 0 : 1)
    })
}