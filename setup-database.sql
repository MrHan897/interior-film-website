-- ================================
-- 인테리어 필름 서비스 - 전체 데이터베이스 스키마
-- ================================

-- 공통 함수: 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================
-- 1. BOOKINGS 테이블 (기존 테이블 업데이트)
-- ================================

-- consultation_type 컬럼이 없다면 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'consultation_type'
    ) THEN
        ALTER TABLE bookings ADD COLUMN consultation_type VARCHAR(50) DEFAULT 'consultation' CHECK (consultation_type IN ('consultation', 'estimate', 'installation', 'inspection'));
    END IF;
END $$;

-- ================================
-- 2. EVENTS 테이블 생성
-- ================================

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

-- 트리거 생성
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
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

-- Row Level Security (RLS) 활성화
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Anyone can insert events" ON events;
DROP POLICY IF EXISTS "Anyone can update events" ON events;
DROP POLICY IF EXISTS "Anyone can delete events" ON events;

CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON events FOR DELETE USING (true);

-- ================================
-- 3. PORTFOLIO 테이블 생성
-- ================================

CREATE TABLE IF NOT EXISTS portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    tags TEXT[], -- 배열 타입으로 태그 저장
    project_date DATE,
    client_company VARCHAR(200),
    location VARCHAR(200),
    area_size VARCHAR(100),
    materials_used TEXT[],
    project_duration VARCHAR(100),
    budget_range VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 트리거 생성
DROP TRIGGER IF EXISTS update_portfolio_updated_at ON portfolio;
CREATE TRIGGER update_portfolio_updated_at 
    BEFORE UPDATE ON portfolio 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_display_order ON portfolio(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_is_featured ON portfolio(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at);

-- Row Level Security (RLS) 활성화
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Anyone can view portfolio" ON portfolio;
DROP POLICY IF EXISTS "Anyone can insert portfolio" ON portfolio;
DROP POLICY IF EXISTS "Anyone can update portfolio" ON portfolio;
DROP POLICY IF EXISTS "Anyone can delete portfolio" ON portfolio;

CREATE POLICY "Anyone can view portfolio" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Anyone can insert portfolio" ON portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update portfolio" ON portfolio FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete portfolio" ON portfolio FOR DELETE USING (true);

-- ================================
-- 4. 샘플 데이터 삽입 (포트폴리오)
-- ================================

INSERT INTO portfolio (title, category, description, image_url, tags, project_date, client_company, location, area_size, materials_used, project_duration, is_featured, display_order, status) VALUES 
('모던 아파트 거실 리모델링', '주거 공간', '기존 벽면을 고급 우드 패턴 필름으로 변화시켜 따뜻하고 세련된 분위기를 연출했습니다.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', ARRAY['우드 패턴', '거실', '아파트'], '2024-01-15', '개인고객', '서울 강남구', '32평', ARRAY['우드패턴 필름', '접착제', '마감재'], '3일', true, 1, 'published'),
('카페 인테리어 필름 시공', '상업 공간', '브랜드 아이덴티티에 맞는 컬러와 패턴의 필름으로 독특한 분위기의 카페를 완성했습니다.', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop', ARRAY['브랜딩', '카페', '상업공간'], '2024-02-20', '○○ 카페', '서울 홍대', '25평', ARRAY['브랜딩 필름', '컬러 필름', '로고 필름'], '5일', true, 2, 'published'),
('주방 가구 리폼', '가구 리폼', '오래된 주방 가구를 마블 패턴 필름으로 리폼하여 고급스러운 주방으로 변화시켰습니다.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', ARRAY['마블 패턴', '주방', '가구'], '2024-03-10', '개인고객', '경기 성남시', '주방', ARRAY['마블패턴 필름', '가구용 접착제'], '2일', false, 3, 'published'),
('사무실 파티션 필름', '상업 공간', '프라이버시 보호와 동시에 개방감을 유지하는 반투명 필름으로 사무 공간을 구성했습니다.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', ARRAY['프라이버시', '사무실', '파티션'], '2024-04-05', '○○ 기업', '서울 판교', '100평', ARRAY['반투명 필름', '프라이버시 필름'], '7일', false, 4, 'published'),
('침실 벽면 아트 필름', '주거 공간', '포인트 벽면에 아트 패턴 필름을 적용하여 개성있는 침실 공간을 완성했습니다.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop', ARRAY['아트 패턴', '침실', '포인트 벽'], '2024-05-12', '개인고객', '인천 연수구', '방 1개', ARRAY['아트패턴 필름', '특수 접착제'], '1일', false, 5, 'published'),
('매장 외벽 브랜딩', '상업 공간', '매장 외벽에 브랜드 컬러와 로고를 적용한 필름으로 강력한 브랜딩 효과를 창출했습니다.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', ARRAY['브랜딩', '외벽', '매장'], '2024-06-18', '○○ 매장', '부산 해운대', '외벽', ARRAY['브랜딩 필름', '날씨저항 필름'], '4일', true, 6, 'published')
ON CONFLICT (id) DO NOTHING;

-- ================================
-- 완료 메시지
-- ================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ 데이터베이스 스키마 설정이 완료되었습니다!';
    RAISE NOTICE '📋 생성된 테이블: bookings (업데이트), events, portfolio';
    RAISE NOTICE '🔧 추가된 기능: 트리거, 인덱스, RLS 정책, 샘플 데이터';
END $$;