-- 견적 관리 테이블 (Quotes) 생성
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    building_type VARCHAR(20) NOT NULL CHECK (building_type IN ('apartment', 'office', 'house', 'store')),
    room_type VARCHAR(200) NOT NULL,
    area_size INTEGER NOT NULL CHECK (area_size > 0),
    film_type VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard')),
    
    -- 비용 정보
    material_cost INTEGER NOT NULL DEFAULT 0 CHECK (material_cost >= 0),
    labor_cost INTEGER NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
    additional_fees INTEGER NOT NULL DEFAULT 0 CHECK (additional_fees >= 0),
    total_amount INTEGER GENERATED ALWAYS AS (material_cost + labor_cost + additional_fees) STORED,
    
    -- 상태 관리
    status VARCHAR(20) NOT NULL DEFAULT 'quote_requested' 
        CHECK (status IN ('quote_requested', 'quote_sent', 'confirmed', 'rejected')),
    
    -- 협력업체 정보 (optional)
    supplier_id VARCHAR(50),
    contractor_id VARCHAR(50),
    supplier_info JSONB,
    contractor_info JSONB,
    
    -- 메타 데이터
    notes TEXT,
    sent_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 성능 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_customer ON quotes(customer_name);
CREATE INDEX IF NOT EXISTS idx_quotes_phone ON quotes(phone);

-- Row Level Security 활성화
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 관리자 권한 (나중에 인증 시스템과 연동)
CREATE POLICY "Anyone can manage quotes" ON quotes
    FOR ALL USING (true);

-- 견적 통계를 위한 뷰 (선택사항)
CREATE OR REPLACE VIEW quotes_stats AS
SELECT 
    COUNT(*) as total_quotes,
    COUNT(*) FILTER (WHERE status = 'quote_requested') as requested_count,
    COUNT(*) FILTER (WHERE status = 'quote_sent') as sent_count,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
    AVG(total_amount) as avg_amount,
    SUM(total_amount) FILTER (WHERE status = 'confirmed') as confirmed_revenue
FROM quotes;

-- 댓글 테이블 (견적 관련 소통 기록용, 선택사항)
CREATE TABLE IF NOT EXISTS quote_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    comment_type VARCHAR(20) DEFAULT 'internal' CHECK (comment_type IN ('internal', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_comments_quote_id ON quote_comments(quote_id);

ALTER TABLE quote_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage quote comments" ON quote_comments
    FOR ALL USING (true);