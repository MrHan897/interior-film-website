# 🚀 배포 가이드 - 인테리어 필름 웹사이트 + Task Master AI

## 📋 배포 전 체크리스트

### ✅ 현재 구성 확인
- [x] Next.js 15.4.1 웹사이트 완성
- [x] Task Master AI 시스템 구축
- [x] Supabase 데이터베이스 연결
- [x] 환경변수 설정 완료
- [x] 한글 인터페이스 적용

## 📝 1단계: 프로덕션 빌드 준비

### 1.1 빌드 테스트
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build
npm run start
```

### 1.2 필요 시 최적화 작업
- 이미지 최적화 확인
- SEO 메타태그 점검
- 성능 최적화 확인

## 🗄️ 2단계: Supabase 프로덕션 설정

### 2.1 Supabase 데이터베이스 스키마 설정
1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 현재 프로젝트 선택: `sdjlawzmeeqkyvqwwbga`
3. SQL Editor에서 `task-master-complete-setup.sql` 실행
4. 테이블 생성 확인:
   - tasks
   - task_dependencies
   - task_time_logs
   - ai_insights
   - task_templates
   - user_productivity_metrics

### 2.2 RLS (Row Level Security) 정책 확인
```sql
-- 정책 확인
SELECT * FROM pg_policies WHERE tablename IN ('tasks', 'ai_insights');
```

### 2.3 API 키 확인
- NEXT_PUBLIC_SUPABASE_URL: `https://sdjlawzmeeqkyvqwwbga.supabase.co`
- SUPABASE_SERVICE_ROLE_KEY: 프로덕션용 키 준비

## ☁️ 3단계: Vercel 배포 설정

### 3.1 Vercel 계정 준비
1. https://vercel.com 가입/로그인
2. GitHub 연동 (권장)

### 3.2 프로젝트 준비
```bash
# Git 저장소 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit: Interior Film Website + Task Master AI"

# GitHub에 푸시 (권장)
# 또는 Vercel CLI 사용
npm i -g vercel
vercel
```

### 3.3 Vercel 프로젝트 설정
- Framework Preset: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## 🔧 4단계: 환경변수 프로덕션 설정

### 4.1 Vercel 환경변수 설정
Vercel 대시보드 → Project Settings → Environment Variables

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://sdjlawzmeeqkyvqwwbga.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDQ2NzMsImV4cCI6MjA2ODQ4MDY3M30.OCl1lFMqb0twJs6TVIS3-HuoEtwSQlZDcJdnxl1Hlhw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkwNDY3MywiZXhwIjoyMDY4NDgwNjczfQ.8FiGRlECUy44kNJ8vG7RV8vVEOkT5vKOhRGgLwSyVcs

# 프로덕션 설정
NODE_ENV=production
```

### 4.2 환경변수 적용 범위
- Production: 프로덕션 환경
- Preview: 프리뷰 배포
- Development: 개발 환경

## 🎯 5단계: 배포 실행

### 5.1 자동 배포 (GitHub 연동 시)
1. 코드를 GitHub에 푸시
2. Vercel이 자동으로 빌드 및 배포
3. 배포 로그 확인

### 5.2 수동 배포 (Vercel CLI)
```bash
vercel --prod
```

### 5.3 배포 URL 확인
- 임시 URL: `https://your-project.vercel.app`
- 배포 상태 모니터링

## ✅ 6단계: 배포 후 테스트

### 6.1 기본 기능 테스트
- [ ] 메인 페이지 로딩
- [ ] 포트폴리오 페이지
- [ ] 관리자 페이지 (`/admin/schedule`)
- [ ] Task Master AI (`/admin/task-master`)

### 6.2 Task Master AI 기능 테스트
- [ ] 작업 목록 표시
- [ ] 새 작업 생성
- [ ] AI 우선순위 점수 표시
- [ ] 필터링 및 정렬
- [ ] AI 인사이트 대시보드

### 6.3 API 엔드포인트 테스트
```bash
# 작업 목록 조회
curl https://your-project.vercel.app/api/tasks

# AI 인사이트 조회
curl https://your-project.vercel.app/api/tasks/ai-insights
```

## 🌐 7단계: 도메인 연결 (선택사항)

### 7.1 도메인 구매 및 설정
1. 도메인 구매 (예: interior-film.kr)
2. Vercel 대시보드에서 도메인 추가
3. DNS 설정 업데이트

### 7.2 SSL 인증서
- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- HTTPS 강제 리다이렉트 설정

## 🔍 8단계: 모니터링 및 분석

### 8.1 Vercel Analytics 설정
```bash
npm install @vercel/analytics
```

### 8.2 에러 모니터링
- Vercel 대시보드에서 에러 로그 확인
- Supabase 대시보드에서 데이터베이스 로그 확인

## 🚨 문제 해결

### 빌드 실패 시
1. 로컬에서 `npm run build` 테스트
2. TypeScript 오류 확인
3. 환경변수 누락 확인

### 데이터베이스 연결 오류 시
1. Supabase 프로젝트 상태 확인
2. API 키 유효성 확인
3. RLS 정책 설정 확인

### API 응답 오류 시
1. Vercel 함수 로그 확인
2. CORS 설정 확인
3. 환경변수 설정 확인

## 📊 성능 최적화 (배포 후)

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 형식 적용

### 코드 스플리팅
- 동적 import 활용
- 번들 크기 분석

### 캐싱 전략
- Vercel Edge Cache 활용
- Supabase 쿼리 최적화

## 🎉 배포 완료 체크리스트

- [ ] 웹사이트 정상 접속
- [ ] Task Master AI 모든 기능 작동
- [ ] 모바일 반응형 확인
- [ ] SEO 메타태그 확인
- [ ] 성능 점수 확인 (Lighthouse)
- [ ] 보안 설정 확인

## 📞 지원 리소스

- **Vercel 문서**: https://vercel.com/docs
- **Supabase 문서**: https://supabase.com/docs
- **Next.js 문서**: https://nextjs.org/docs
- **배포 상태 확인**: Vercel 대시보드