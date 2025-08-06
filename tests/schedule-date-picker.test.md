# 일정관리 날짜 선택 기능 테스트 시나리오

## E2E 테스트 시나리오

### 시나리오 1: 기본 날짜 선택 기능
**목적**: 새 일정 추가 시 날짜를 선택할 수 있는지 확인

**테스트 단계**:
1. 관리자 페이지 → 일정관리 접속
2. "새 일정" 버튼 클릭
3. "새 일정 추가" 모달 확인
4. 날짜 필드 존재 확인
5. 날짜 선택 (다음 주 날짜)
6. 필수 정보 입력 (제목, 고객명, 연락처, 주소)
7. "저장" 버튼 클릭
8. 선택한 날짜에 일정이 정상적으로 추가되었는지 확인

**예상 결과**: ✅ 선택한 날짜에 새 일정이 성공적으로 추가됨

### 시나리오 2: 날짜 검증 기능
**목적**: 과거 날짜 선택 방지 기능 확인

**테스트 단계**:
1. 새 일정 추가 모달 열기
2. 날짜 필드의 min 속성 확인
3. 과거 날짜 선택 시도
4. 브라우저 검증 메시지 확인

**예상 결과**: ✅ 과거 날짜 선택이 방지됨

### 시나리오 3: 모바일 환경 테스트
**목적**: 모바일에서 날짜 선택 기능 확인

**테스트 단계**:
1. 모바일 뷰포트로 설정 (< 768px)
2. 새 일정 추가 모달 열기
3. 네이티브 date picker 동작 확인
4. 터치 인터페이스 반응성 확인

**예상 결과**: ✅ 모바일에서 날짜 선택이 원활하게 동작

### 시나리오 4: 편집 모드에서 날짜 변경
**목적**: 기존 일정 편집 시 날짜 변경 가능 여부 확인

**테스트 단계**:
1. 기존 일정 클릭하여 상세 모달 열기
2. "수정" 버튼 클릭
3. 날짜 필드에 기존 날짜가 로드되었는지 확인
4. 다른 날짜로 변경
5. "수정" 버튼으로 저장
6. 변경된 날짜로 일정이 이동되었는지 확인

**예상 결과**: ✅ 일정 편집 시 날짜 변경이 정상적으로 반영됨

## 크로스 브라우저 테스트

### 지원 브라우저
- ✅ Chrome (최신 버전)
- ✅ Firefox (최신 버전)  
- ✅ Safari (최신 버전)
- ✅ Edge (최신 버전)

### 모바일 브라우저
- ✅ iOS Safari
- ✅ Android Chrome

## 접근성 테스트

### 키보드 내비게이션
- ✅ Tab 키로 날짜 필드 접근
- ✅ Enter/Space 키로 date picker 열기
- ✅ 화살표 키로 날짜 네비게이션

### 스크린 리더 지원
- ✅ 날짜 필드 레이블 읽기
- ✅ 선택된 날짜 안내
- ✅ 검증 메시지 읽기

## 성능 테스트

### 렌더링 성능
- ✅ 모달 열기 시간 < 300ms
- ✅ 날짜 선택 반응 시간 < 100ms

### 메모리 사용량
- ✅ 메모리 누수 없음
- ✅ DOM 정리 정상 작동

## 테스트 자동화 스크립트 (Playwright)

```javascript
// test/schedule-date-picker.spec.js
const { test, expect } = require('@playwright/test');

test('새 일정 추가 시 날짜 선택 기능', async ({ page }) => {
  // 관리자 페이지 접속
  await page.goto('/admin/schedule');
  
  // 새 일정 버튼 클릭
  await page.click('text=새 일정');
  
  // 날짜 필드 확인
  const dateField = page.locator('input[type="date"]');
  await expect(dateField).toBeVisible();
  
  // 내일 날짜로 설정
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  await dateField.fill(tomorrowStr);
  
  // 필수 필드 입력
  await page.fill('input[placeholder*="제목"]', '테스트 일정');
  await page.fill('input[placeholder*="고객명"]', '홍길동');
  await page.fill('input[placeholder*="010-0000-0000"]', '010-1234-5678');
  await page.fill('input[placeholder*="주소"]', '서울시 강남구');
  
  // 저장 버튼 클릭
  await page.click('button:has-text("저장")');
  
  // 일정이 추가되었는지 확인
  await expect(page.locator('text=테스트 일정')).toBeVisible();
});

test('과거 날짜 선택 방지', async ({ page }) => {
  await page.goto('/admin/schedule');
  await page.click('text=새 일정');
  
  const dateField = page.locator('input[type="date"]');
  const minDate = await dateField.getAttribute('min');
  const today = new Date().toISOString().split('T')[0];
  
  expect(minDate).toBe(today);
});
```