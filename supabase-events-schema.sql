-- Supabase events 테이블 생성 스키마
-- 이 파일을 Supabase 대시보드 > SQL Editor에서 실행하세요

-- events 테이블 생성
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('b2b', 'personal_support', 'work_schedule', 'company_event', 'meeting', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    attendees TEXT[], -- PostgreSQL 배열 타입
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    assigned_to VARCHAR(100),
    client_company VARCHAR(255),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    notes TEXT,
    created_by VARCHAR(100) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_assigned_to ON public.events(assigned_to);

-- updated_at 자동 업데이트를 위한 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- events 테이블에 updated_at 트리거 연결
DROP TRIGGER IF EXISTS trigger_events_updated_at ON public.events;
CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- RLS (Row Level Security) 설정 (선택사항)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 생성
CREATE POLICY IF NOT EXISTS "Events are viewable by everyone" ON public.events
    FOR SELECT USING (true);

-- 인증된 사용자만 삽입/수정/삭제 가능하도록 정책 생성
CREATE POLICY IF NOT EXISTS "Events are insertable by authenticated users" ON public.events
    FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Events are updatable by authenticated users" ON public.events
    FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Events are deletable by authenticated users" ON public.events
    FOR DELETE USING (true);

-- 샘플 데이터 삽입
INSERT INTO public.events (
    event_type, title, description, start_date, start_time, end_date, end_time,
    location, attendees, priority, status, assigned_to, client_company,
    contact_person, contact_phone, notes, created_by
) VALUES 
(
    'b2b',
    'B2B 업체 미팅',
    '새로운 B2B 파트너와의 업무 논의',
    CURRENT_DATE,
    '14:00',
    CURRENT_DATE,
    '15:00',
    '본사 회의실',
    ARRAY['김대표', '이부장'],
    'high',
    'scheduled',
    '김대표',
    'ABC 인테리어',
    '박팀장',
    '010-1234-5678',
    '계약서 검토 필요',
    'admin'
),
(
    'work_schedule',
    '아파트 필름 시공',
    '강남구 아파트 필름 시공 작업',
    CURRENT_DATE + INTERVAL '1 day',
    '09:00',
    CURRENT_DATE + INTERVAL '1 day',
    '17:00',
    '강남구 삼성동',
    ARRAY['김기사', '박기사'],
    'medium',
    'scheduled',
    '김기사',
    NULL,
    NULL,
    NULL,
    '장비 점검 완료',
    'admin'
),
(
    'company_event',
    '월례 회의',
    '2025년 1월 월례 회의',
    CURRENT_DATE + INTERVAL '7 days',
    '10:00',
    CURRENT_DATE + INTERVAL '7 days',
    '12:00',
    '본사 대회의실',
    ARRAY['전체 직원'],
    'medium',
    'scheduled',
    '김대표',
    NULL,
    NULL,
    NULL,
    '2025년 사업 계획 발표',
    'admin'
),
(
    'meeting',
    '고객 상담',
    '신규 고객 상담 및 견적 논의',
    CURRENT_DATE + INTERVAL '2 days',
    '15:30',
    CURRENT_DATE + INTERVAL '2 days',
    '16:30',
    '고객 사무실',
    ARRAY['영업팀장'],
    'high',
    'scheduled',
    '영업팀장',
    '디자인 스튜디오',
    '최실장',
    '010-9876-5432',
    '인테리어 필름 전체 교체 문의',
    'admin'
);

-- 테이블 생성 완료 메시지
SELECT 'events 테이블이 성공적으로 생성되었습니다!' as message;