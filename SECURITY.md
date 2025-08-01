# 보안 가이드

## 환경변수 설정

### 1. 환경변수 파일 생성
```bash
cp .env.example .env.local
```

### 2. 필수 환경변수 설정
`.env.local` 파일에 다음 값들을 설정하세요:

```env
# Supabase 설정 (Supabase 프로젝트 대시보드에서 확인)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 관리자 인증 (반드시 변경!)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password_min_12_chars

# JWT 시크릿 (최소 32자 이상)
JWT_SECRET=your_jwt_secret_here_should_be_at_least_32_characters_long
```

## 관리자 페이지 접근

### 1. 로그인
- URL: `/admin/login`
- 환경변수에 설정한 관리자 계정으로 로그인

### 2. 보호된 페이지
- `/admin/schedule` - 일정 관리
- `/admin/portfolio` - 포트폴리오 관리

## 보안 체크리스트

### ✅ 완료된 보안 조치
- [x] `.env.local` 파일을 `.gitignore`에 추가
- [x] 관리자 페이지 인증 시스템 구축
- [x] Next.js middleware를 통한 접근 제어
- [x] JWT 토큰 기반 세션 관리
- [x] 환경변수 템플릿 제공

### 🔒 권장 보안 조치

#### 프로덕션 배포 시
1. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대소문자, 숫자, 특수문자 포함

2. **JWT 시크릿 변경**
   - 32자 이상의 랜덤 문자열 사용
   - 온라인 JWT 시크릿 생성기 활용

3. **Supabase 보안 설정**
   - Row Level Security (RLS) 활성화
   - API 키 정기적 교체

4. **HTTPS 사용**
   - 프로덕션에서는 반드시 HTTPS 사용
   - SSL 인증서 설정

#### 추가 보안 강화
1. **2FA (이중인증) 구현**
2. **IP 화이트리스트 설정**
3. **접근 로그 모니터링**
4. **정기적인 보안 업데이트**

## 보안 문제 신고

보안 취약점을 발견하시면 다음 방법으로 신고해주세요:
- 이메일: security@your-domain.com
- 비공개 이슈로 GitHub에 신고

## 업데이트 기록

- 2025-08-01: 초기 보안 시스템 구축
  - 관리자 인증 시스템 추가
  - 환경변수 보안 강화
  - Next.js middleware 보호 추가