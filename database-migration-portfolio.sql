-- 포트폴리오 테이블 생성 및 업데이트 스크립트
-- 이 스크립트는 Supabase 데이터베이스에서 실행해야 합니다

-- 1. 기존 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    order_index INTEGER,
    blogUrl TEXT,
    location TEXT,
    completedAt DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 2. 새로운 컬럼들이 없다면 추가 (기존 테이블 업데이트)
DO $$ 
BEGIN
    -- featured 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'portfolio' AND column_name = 'featured') THEN
        ALTER TABLE portfolio ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
    
    -- blogUrl 컬럼 추가  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'portfolio' AND column_name = 'blogUrl') THEN
        ALTER TABLE portfolio ADD COLUMN blogUrl TEXT;
    END IF;
    
    -- location 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'portfolio' AND column_name = 'location') THEN
        ALTER TABLE portfolio ADD COLUMN location TEXT;
    END IF;
    
    -- completedAt 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'portfolio' AND column_name = 'completedAt') THEN
        ALTER TABLE portfolio ADD COLUMN completedAt DATE;
    END IF;
END $$;

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio (featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio (category);
CREATE INDEX IF NOT EXISTS idx_portfolio_completed_at ON portfolio (completedAt);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio (created_at DESC);

-- 4. RLS (Row Level Security) 정책 설정
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 포트폴리오를 읽을 수 있도록 허용 (공개 데이터)
CREATE POLICY IF NOT EXISTS "Public read access" ON portfolio
    FOR SELECT USING (true);

-- 관리자만 포트폴리오를 생성, 수정, 삭제할 수 있도록 설정
-- (실제 운영에서는 auth.role() 또는 특정 사용자 조건으로 변경)
CREATE POLICY IF NOT EXISTS "Admin write access" ON portfolio
    FOR ALL USING (true);

-- 5. 샘플 데이터 삽입 (테이블이 비어있을 때만)
INSERT INTO portfolio (title, category, description, image_url, tags, featured, location, completedAt, blogUrl)
SELECT * FROM (VALUES
    ('모던 아파트 거실 리모델링', '주거 공간', '기존 벽면을 고급 우드 패턴 필름으로 변화시켜 따뜻하고 세련된 분위기를 연출했습니다.', 
     'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', 
     ARRAY['우드 패턴', '거실', '아파트'], true, '서울시 강남구', '2024-01-15'::date, 'https://blog.example.com/gangnam-apartment'),
    
    ('카페 인테리어 필름 시공', '상업 공간', '브랜드 아이덴티티에 맞는 컬러와 패턴의 필름으로 독특한 분위기의 카페를 완성했습니다.',
     'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
     ARRAY['브랜딩', '카페', '상업공간'], false, '서울시 마포구 홍대', '2024-01-10'::date, null),
    
    ('주방 가구 리폼', '가구 리폼', '오래된 주방 가구를 마블 패턴 필름으로 리폼하여 고급스러운 주방으로 변화시켰습니다.',
     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
     ARRAY['마블 패턴', '주방', '가구'], true, '서울시 서초구', '2024-01-05'::date, null),
    
    ('사무실 파티션 필름', '상업 공간', '프라이버시 보호와 동시에 개방감을 유지하는 반투명 필름으로 사무 공간을 구성했습니다.',
     'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
     ARRAY['프라이버시', '사무실', '파티션'], false, '서울시 중구', '2023-12-28'::date, null),
    
    ('침실 벽면 아트 필름', '주거 공간', '포인트 벽면에 아트 패턴 필름을 적용하여 개성있는 침실 공간을 완성했습니다.',
     'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
     ARRAY['아트 패턴', '침실', '포인트 벽'], false, '경기도 성남시', '2023-12-20'::date, null),
    
    ('매장 외벽 브랜딩', '상업 공간', '매장 외벽에 브랜드 컬러와 로고를 적용한 필름으로 강력한 브랜딩 효과를 창출했습니다.',
     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
     ARRAY['브랜딩', '외벽', '매장'], true, '서울시 영등포구', '2023-12-15'::date, 'https://blog.example.com/store-branding')
) AS sample_data(title, category, description, image_url, tags, featured, location, completedAt, blogUrl)
WHERE NOT EXISTS (SELECT 1 FROM portfolio LIMIT 1);

-- 완료 메시지
SELECT 'Portfolio table migration completed successfully!' as status;