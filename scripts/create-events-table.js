const { createClient } = require('@supabase/supabase-js')

async function createEventsTable() {
  const supabaseUrl = 'https://sdjlawzmeeqkyvqwwbga.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDQ2NzMsImV4cCI6MjA2ODQ4MDY3M30.OCl1lFMqb0twJs6TVIS3-HuoEtwSQlZDcJdnxl1Hlhw'
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase 환경 변수가 설정되지 않았습니다.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('events 테이블 생성 중...')

  // events 테이블 생성 SQL
  const createTableSQL = `
    -- 일반 일정(events) 테이블 생성 (B2B, 개인지원, 작업일정 등)
    CREATE TABLE IF NOT EXISTS events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('b2b', 'personal_support', 'work_schedule', 'company_event', 'meeting', 'other')),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_date DATE NOT NULL,
        end_time TIME NOT NULL,
        location VARCHAR(200),
        attendees TEXT[], -- 참석자 목록 (배열)
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
        assigned_to VARCHAR(100), -- 담당자
        client_company VARCHAR(100), -- B2B인 경우 고객 회사명
        contact_person VARCHAR(100), -- 연락 담당자
        contact_phone VARCHAR(20), -- 연락처
        notes TEXT, -- 추가 메모
        created_by VARCHAR(100) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    
    if (error) {
      console.error('테이블 생성 오류:', error)
      
      // RPC 함수가 없는 경우 직접 쿼리 시도
      if (error.code === 'PGRST202') {
        console.log('RPC 함수를 사용할 수 없습니다. 직접 API 호출을 시도합니다...')
        
        // REST API를 통한 직접 SQL 실행 시도
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({ sql: createTableSQL })
        })
        
        if (!response.ok) {
          console.error('API 호출 실패:', await response.text())
          console.log('\n수동으로 테이블을 생성해야 합니다.')
          console.log('Supabase 대시보드 → SQL Editor에서 다음 SQL을 실행하세요:')
          console.log('\n' + createTableSQL)
        } else {
          console.log('✅ events 테이블이 성공적으로 생성되었습니다!')
        }
      }
    } else {
      console.log('✅ events 테이블이 성공적으로 생성되었습니다!')
    }
  } catch (err) {
    console.error('실행 오류:', err)
    console.log('\n수동으로 테이블을 생성해야 합니다.')
    console.log('Supabase 대시보드 → SQL Editor에서 다음 SQL을 실행하세요:')
    console.log('\n' + createTableSQL)
  }
}

createEventsTable()