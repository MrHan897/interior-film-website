# 데이터베이스 설정 가이드

## 1. Supabase 계정 생성 및 프로젝트 설정

1. [Supabase](https://supabase.com/) 웹사이트에 접속하여 무료 계정을 생성합니다.
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호를 설정합니다.
4. 리전은 "Northeast Asia (Seoul)"을 선택하는 것이 좋습니다.

## 2. 데이터베이스 테이블 생성

1. Supabase 대시보드에서 "SQL Editor" 메뉴로 이동합니다.
2. `supabase-schema.sql` 파일의 내용을 복사하여 SQL 에디터에 붙여넣습니다.
3. "Run" 버튼을 클릭하여 SQL을 실행합니다.

## 3. 환경 변수 설정

1. Supabase 대시보드에서 "Settings" > "API" 메뉴로 이동합니다.
2. 다음 정보를 복사합니다:
   - Project URL
   - anon public key

3. 프로젝트 루트에 `.env.local` 파일을 생성하고 다음과 같이 설정합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. 테스트

1. 개발 서버를 실행합니다:
```bash
npm run dev
```

2. `/booking` 페이지에서 예약 폼을 작성하여 데이터베이스에 저장되는지 확인합니다.

3. `/admin/schedule` 페이지에서 저장된 예약 데이터가 표시되는지 확인합니다.

## 5. 데이터베이스 구조

### bookings 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 기본키 (자동 생성) |
| building_type | VARCHAR(50) | 건물 유형 (apartment, villa, house, officetel) |
| area_size | VARCHAR(100) | 시공 면적 |
| home_condition | VARCHAR(100) | 집 상태 |
| reason | VARCHAR(200) | 시공 이유 |
| spaces | TEXT[] | 시공 공간들 (배열) |
| budget | VARCHAR(100) | 예산 범위 |
| timeline | VARCHAR(100) | 시공 시기 |
| consult_date | DATE | 상담 희망 날짜 |
| consult_time | TIME | 상담 희망 시간 |
| customer_name | VARCHAR(100) | 고객 이름 |
| customer_phone | VARCHAR(20) | 고객 전화번호 |
| customer_address | TEXT | 고객 주소 |
| customer_requirements | TEXT | 고객 요청사항 |
| privacy_consent | BOOLEAN | 개인정보 동의 여부 |
| status | VARCHAR(20) | 예약 상태 (pending, confirmed, completed, cancelled) |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

## 6. API 엔드포인트

### GET /api/bookings
예약 목록을 조회합니다.

쿼리 파라미터:
- `status`: 상태별 필터링
- `limit`: 페이지당 항목 수
- `page`: 페이지 번호

### POST /api/bookings
새 예약을 생성합니다.

### PUT /api/bookings/[id]
예약 상태를 업데이트합니다.

### DELETE /api/bookings/[id]
예약을 삭제합니다.

## 7. 보안 고려사항

- Row Level Security (RLS)가 활성화되어 있습니다.
- 현재는 모든 사용자가 읽기/쓰기가 가능하도록 설정되어 있습니다.
- 프로덕션 환경에서는 관리자 인증을 추가하여 예약 수정/삭제 권한을 제한해야 합니다.

## 8. 배포 시 주의사항

- `.env.local` 파일은 git에 커밋하지 마세요.
- Vercel 배포 시 Environment Variables 섹션에 환경 변수를 설정하세요.
- Supabase의 무료 플랜에는 월 500MB 데이터베이스 제한이 있습니다.