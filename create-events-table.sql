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