-- 포트폴리오(portfolio) 테이블 생성
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

-- 업데이트 시간 자동 갱신을 위한 트리거 생성
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

-- 모든 사용자가 읽기 가능 (익명 사용자 포함)
CREATE POLICY "Anyone can view portfolio" ON portfolio
    FOR SELECT USING (true);

-- 관리자만 삽입, 업데이트, 삭제 가능 (나중에 인증 시스템 추가 시 수정 필요)
CREATE POLICY "Anyone can insert portfolio" ON portfolio
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio" ON portfolio
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete portfolio" ON portfolio
    FOR DELETE USING (true);