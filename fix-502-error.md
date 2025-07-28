# 🚨 502 BAD_GATEWAY 오류 해결 가이드

## 📋 원인 분석
DNS_HOSTNAME_NOT_FOUND 오류는 주로 다음과 같은 원인으로 발생합니다:

### 1. 환경변수 문제 (가장 가능성 높음)
- Supabase URL 또는 API 키 오류
- 환경변수가 프로덕션에 적용되지 않음

### 2. API 라우트 오류
- 데이터베이스 연결 실패
- 잘못된 Supabase 설정

## 🔧 해결 방법

### 즉시 수정 (Vercel 대시보드)
1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **프로젝트 선택** → **Settings** → **Environment Variables**
3. **기존 환경변수 삭제** 후 다시 추가:

```env
NEXT_PUBLIC_SUPABASE_URL
값: https://sdjlawzmeeqkyvqwwbga.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY  
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDQ2NzMsImV4cCI6MjA2ODQ4MDY3M30.OCl1lFMqb0twJs6TVIS3-HuoEtwSQlZDcJdnxl1Hlhw

SUPABASE_SERVICE_ROLE_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkwNDY3MywiZXhwIjoyMDY4NDgwNjczfQ.8FiGRlECUy44kNJ8vG7RV8vVEOkT5vKOhRGgLwSyVcs

NODE_ENV
값: production
```

4. **Environment 범위 설정**:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. **저장 후 재배포**:
   - Deployments 탭 → 최근 배포 → "Redeploy" 클릭

### 로그 확인 방법
1. **Functions 로그**:
   - Vercel 대시보드 → Functions → View Logs
   - 에러 메시지 확인

2. **Runtime Logs**:
   - Deployments → 배포 선택 → Function Logs
   - API 라우트 오류 확인

## 🔄 임시 우회 방법

환경변수 문제라면 다음 페이지는 정상 작동해야 합니다:
- ✅ **메인 페이지**: `/` 
- ✅ **예약 페이지**: `/booking`
- ❌ **관리자 페이지**: `/admin/*` (API 의존적)

## 📞 추가 지원

만약 여전히 문제가 지속된다면:
1. Vercel Function 로그 스크린샷 공유
2. 환경변수 설정 확인 (값은 숨김)
3. 어떤 페이지에서 오류가 발생하는지 알려주세요

## 🚀 빠른 테스트

환경변수 수정 후:
1. 메인 페이지 접속 테스트
2. `/booking` 페이지 접속 테스트  
3. `/admin/schedule` 페이지 접속 테스트

모든 페이지가 정상 작동하면 해결 완료입니다!