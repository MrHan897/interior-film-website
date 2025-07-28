# 🏠 인테리어 필름 웹사이트 + Task Master AI

인테리어 필름 시공 전문 회사의 공식 웹사이트와 AI 기반 작업 관리 시스템이 통합된 Next.js 프로젝트입니다.

## ✨ 주요 기능

### 🌐 고객용 웹사이트
- **포트폴리오**: 완성된 프로젝트 갤러리
- **서비스 소개**: 다양한 필름 시공 서비스
- **온라인 예약**: 단계별 상담 예약 시스템
- **실시간 상담**: 플로팅 상담 버튼

### 🤖 Task Master AI (관리자 전용)
- **AI 우선순위 점수**: 마감일, 복잡도, 카테고리 종합 분석 (0-100점)
- **스마트 정렬**: AI 기반 작업 자동 정렬
- **최적 시간 추천**: 작업 유형별 최적 시간대 제안
- **준비사항 제안**: 카테고리별 맞춤 체크리스트
- **생산성 분석**: 완료율, 효율성 대시보드
- **한글 인터페이스**: 완전한 한국어 사용자 경험

### 📊 관리자 기능
- **일정 관리**: 예약 및 이벤트 관리
- **포트폴리오 관리**: 프로젝트 업로드 및 편집
- **AI 인사이트**: 생산성 분석 및 최적화 제안

## 🚀 시작하기

### 1. 환경 설정
```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase 정보 입력
```

### 2. 데이터베이스 설정
1. [Supabase](https://supabase.com) 프로젝트 생성
2. SQL Editor에서 `task-master-complete-setup.sql` 실행
3. 환경변수에 Supabase URL과 API 키 설정

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
├── src/
│   ├── app/
│   │   ├── admin/           # 관리자 페이지
│   │   │   ├── schedule/    # 일정 관리
│   │   │   ├── portfolio/   # 포트폴리오 관리
│   │   │   └── task-master/ # Task Master AI
│   │   ├── api/             # API 라우트
│   │   │   ├── tasks/       # 작업 관리 API
│   │   │   ├── events/      # 이벤트 API
│   │   │   └── portfolio/   # 포트폴리오 API
│   │   ├── booking/         # 예약 페이지
│   │   └── page.tsx         # 메인 페이지
│   └── components/          # React 컴포넌트
├── task-master-complete-setup.sql  # 데이터베이스 스키마
├── DEPLOYMENT-GUIDE.md             # 배포 가이드
└── TASK-MASTER-SETUP-GUIDE.md     # Task Master AI 설정 가이드
```

## 🎯 Task Master AI 사용법

### 기본 사용
1. **작업 추가**: "작업 추가" 버튼으로 새 작업 생성
2. **AI 정렬**: "AI 정렬" 토글로 스마트 정렬 활성화
3. **필터링**: 상태, 우선순위, 카테고리별 필터링
4. **AI 인사이트**: 생산성 분석 및 최적화 제안 확인

### AI 기능
- **스마트 우선순위**: 자동 점수 계산 (0-100점)
- **최적 시간 추천**: 작업 유형별 최적 시간대
- **준비사항 제안**: 카테고리별 체크리스트
- **생산성 분석**: 효율성 및 완료율 추적

## 🛠 기술 스택

- **Framework**: Next.js 15.4.1 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Heroicons
- **Deployment**: Vercel

## 📝 배포하기

상세한 배포 가이드는 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)를 참고하세요.

### 빠른 배포 (Vercel)
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 임포트
3. 환경변수 설정
4. 자동 배포 완료

## 🔧 환경변수

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=production
```

## 📚 추가 문서

- [Task Master AI 설정 가이드](./TASK-MASTER-SETUP-GUIDE.md)
- [배포 가이드](./DEPLOYMENT-GUIDE.md)
- [데이터베이스 설정](./DATABASE_SETUP.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- [Troubleshooting Guide](./DEPLOYMENT-GUIDE.md#문제-해결)
- Supabase 프로젝트 상태
- 환경변수 설정
- 브라우저 콘솔 오류 메시지
