-- 예약(bookings) 테이블 생성
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    building_type VARCHAR(50) NOT NULL,
    area_size VARCHAR(100),
    home_condition VARCHAR(100),
    reason VARCHAR(200),
    spaces TEXT[], -- 배열 타입으로 여러 공간 저장
    budget VARCHAR(100),
    timeline VARCHAR(100),
    consult_date DATE NOT NULL,
    consult_time TIME NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_requirements TEXT,
    consultation_type VARCHAR(50) DEFAULT 'consultation' CHECK (consultation_type IN ('consultation', 'estimate', 'installation', 'inspection')),
    privacy_consent BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신을 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_bookings_consult_date ON bookings(consult_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Row Level Security (RLS) 활성화 (보안)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (익명 사용자 포함)
CREATE POLICY "Anyone can view bookings" ON bookings
    FOR SELECT USING (true);

-- 모든 사용자가 삽입 가능 (예약 생성)
CREATE POLICY "Anyone can insert bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- 업데이트와 삭제는 관리자만 가능 (나중에 인증 시스템 추가 시 수정 필요)
CREATE POLICY "Anyone can update bookings" ON bookings
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete bookings" ON bookings
    FOR DELETE USING (true);