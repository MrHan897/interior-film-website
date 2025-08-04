# Supabase 무료 설정 가이드

## 1. Supabase 프로젝트 생성 (무료)
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New project" 생성
5. 무료 플랜 선택

## 2. 데이터베이스 테이블 생성

### customers 테이블
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  building_type TEXT CHECK (building_type IN ('apartment', 'office', 'house', 'store')),
  total_reservations INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  last_service TEXT,
  last_service_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### quotes 테이블
```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  building_type TEXT,
  room_type TEXT,
  area_size INTEGER,
  film_type TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'normal', 'hard')),
  material_cost INTEGER DEFAULT 0,
  labor_cost INTEGER DEFAULT 0,
  additional_fees INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'quote_requested' CHECK (status IN ('quote_requested', 'quote_sent', 'confirmed', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### bookings 테이블
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration INTEGER DEFAULT 240, -- 분 단위
  worker TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('quote_requested', 'quote_sent', 'confirmed', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  total_amount INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### projects 테이블
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  worker_assigned TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'quality_check', 'completed')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  total_amount INTEGER NOT NULL,
  notes TEXT,
  photos TEXT[], -- 사진 URL 배열
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. Row Level Security (RLS) 설정

```sql
-- RLS 활성화
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY; 
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 관리자 정책 (임시로 모든 접근 허용)
CREATE POLICY "Allow all for authenticated users" ON customers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON bookings  
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
```

## 4. 환경변수 설정

`.env.local` 파일에 추가:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 5. 무료 티어 제한사항

- **데이터베이스**: 500MB (소규모 비즈니스에 충분)
- **스토리지**: 1GB (사진 압축 필요)
- **대역폭**: 5GB/월 (일반적 사용량으로 충분)
- **인증 사용자**: 50,000명/월 (관리자 시스템에 충분)

## 6. 데이터 효율성 팁

1. **이미지 압축**: 업로드 전 자동 압축
2. **썸네일 생성**: 원본 + 썸네일로 용량 절약
3. **데이터 정리**: 주기적으로 불필요한 데이터 삭제
4. **페이지네이션**: 대량 데이터 로딩 시 페이지 단위 로딩