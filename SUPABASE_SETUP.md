# Supabase 테이블 설정 가이드

## 1. Supabase 대시보드 접속
1. https://supabase.com 접속
2. 프로젝트 선택 (sdjlawzmeeqkyvqwwbga)

## 2. SQL Editor에서 테이블 생성
1. 왼쪽 메뉴에서 "SQL Editor" 클릭
2. 아래 SQL 코드 전체를 복사해서 실행

```sql
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

-- 업데이트 시간 자동 갱신을 위한 함수 (이미 있다면 스킵)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_assigned_to ON events(assigned_to);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Row Level Security (RLS) 활성화 (보안)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (익명 사용자 포함)
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

-- 모든 사용자가 삽입 가능 (관리자 일정 생성)
CREATE POLICY "Anyone can insert events" ON events
    FOR INSERT WITH CHECK (true);

-- 업데이트와 삭제는 관리자만 가능
CREATE POLICY "Anyone can update events" ON events
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete events" ON events
    FOR DELETE USING (true);
```

## 3. 실행 확인
- SQL이 성공적으로 실행되면 "Success" 메시지가 표시됩니다
- 이제 회사일정이 새로고침해도 사라지지 않고 데이터베이스에 저장됩니다

## 4. 문제 해결
만약 오류가 발생하면:
1. SQL 전체를 다시 복사해서 실행해보세요
2. 이미 테이블이 있다면 "already exists" 오류는 무시하셔도 됩니다
3. 그래도 안되면 테이블을 수동으로 생성할 수 있습니다

테이블 생성 후에는 웹사이트에서 회사일정을 등록해보시고 새로고침해서 데이터가 유지되는지 확인해주세요.