# 🚀 GitHub 연동 자동 배포 가이드

## 📋 현재 상태
✅ Git 저장소 초기화 완료
✅ 모든 코드 커밋 완료 (최신 커밋: e123599)
✅ 502 오류 수정 완료
✅ 배포 준비 완료

## 🔧 1단계: GitHub 저장소 생성

### GitHub 웹사이트에서:
1. **https://github.com** 접속
2. **"New repository"** 클릭 (우측 상단 + 버튼)
3. **Repository name**: `interior-film-website`
4. **Description**: `인테리어 필름 웹사이트 + Task Master AI 시스템`
5. **Public** 선택 (또는 Private)
6. **❌ Initialize with README 체크 해제** (이미 로컬에 있음)
7. **"Create repository"** 클릭

## 🔗 2단계: 로컬 저장소 연결

GitHub에서 저장소 생성 후 나타나는 명령어 중 **"push an existing repository"** 섹션을 사용:

```bash
# GitHub 저장소와 연결 (본인의 username으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/interior-film-website.git

# 기본 브랜치 이름 변경 (권장)
git branch -M main

# 코드 푸시
git push -u origin main
```

**예시** (실제 username으로 변경하세요):
```bash
git remote add origin https://github.com/ghostf1/interior-film-website.git
git branch -M main  
git push -u origin main
```

## 🚀 3단계: Vercel 자동 배포

### Vercel 대시보드에서:
1. **https://vercel.com/dashboard** 접속
2. **"Add New..." → "Project"** 클릭
3. **"Import Git Repository"** 섹션에서 GitHub 연동
4. **GitHub 권한 허용** (처음 연동 시)
5. **`interior-film-website` 저장소 선택**
6. **"Import"** 클릭

### 프로젝트 설정:
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동)
- **Output Directory**: `.next` (자동)

## ⚙️ 4단계: 환경변수 설정

배포 진행 중 **"Configure Project"** 단계에서 환경변수 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sdjlawzmeeqkyvqwwbga.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDQ2NzMsImV4cCI6MjA2ODQ4MDY3M30.OCl1lFMqb0twJs6TVIS3-HuoEtwSQlZDcJdnxl1Hlhw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamxhd3ptZWVxa3l2cXd3YmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkwNDY3MywiZXhwIjoyMDY4NDgwNjczfQ.8FiGRlECUy44kNJ8vG7RV8vVEOkT5vKOhRGgLwSyVcs
NODE_ENV=production
```

## 🎉 5단계: 배포 완료 및 URL 확인

배포 완료 후:
1. **배포 URL이 표시됩니다**: `https://interior-film-website-xxx.vercel.app`
2. **자동으로 할당되는 도메인들**:
   - Production: `https://your-project.vercel.app`
   - Git branch별 Preview URL도 생성됨

## 🔄 6단계: 자동 재배포 설정

이제 코드 변경 시:
1. **로컬에서 코드 수정**
2. **Git 커밋 및 푸시**:
   ```bash
   git add .
   git commit -m "update: 기능 개선"
   git push origin main
   ```
3. **Vercel이 자동으로 재배포** ✨

## 📱 예상 결과

배포 완료 후 다음 URL들을 받게 됩니다:

### 🌐 즉시 사용 가능한 페이지:
- **메인**: `https://your-project.vercel.app/`
- **예약**: `https://your-project.vercel.app/booking`
- **관리자**: `https://your-project.vercel.app/admin/schedule`

### 🤖 데이터베이스 설정 후 사용 가능:
- **Task Master AI**: `https://your-project.vercel.app/admin/task-master`

## 🔧 추가 설정 (선택사항)

### 커스텀 도메인 연결:
1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력 (예: `interior-film.co.kr`)
3. DNS 설정 가이드 따라하기

### GitHub Actions 연동:
- 자동 테스트, 린팅 등 추가 가능
- `.github/workflows/` 폴더에 YAML 파일 작성

## 🆘 문제 해결

### 권한 오류 시:
```bash
# SSH 키 대신 HTTPS 사용
git remote set-url origin https://github.com/USERNAME/interior-film-website.git
```

### 푸시 실패 시:
```bash
# 강제 푸시 (최초 설정 시만)
git push -f origin main
```

### Vercel 빌드 실패 시:
- **Functions** 탭에서 로그 확인
- 환경변수 설정 재확인
- `package.json` 의존성 확인

## 📞 다음 단계

GitHub 연동 배포 완료 후 알려주시면:
1. **정확한 배포 URL 제공**
2. **각 페이지 기능 테스트**
3. **Task Master AI 데이터베이스 설정 가이드**
4. **추가 최적화 및 개선사항 안내**

---

**💡 팁**: GitHub 연동의 장점
- ✅ 코드 버전 관리 자동화
- ✅ 브랜치별 Preview 배포
- ✅ 롤백 기능
- ✅ 협업 가능
- ✅ 배포 히스토리 관리