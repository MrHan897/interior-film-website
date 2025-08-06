import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// 공통 검증 스키마
export const schemas = {
  // 사용자 입력 검증
  name: z.string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자 이하로 입력해주세요')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글과 영문만 입력 가능합니다'),
  
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다'),
  
  email: z.string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .max(100, '이메일은 100자 이하로 입력해주세요'),
  
  address: z.string()
    .min(1, '주소를 입력해주세요')
    .max(200, '주소는 200자 이하로 입력해주세요'),
  
  // 예약 관련
  date: z.string()
    .min(1, '날짜를 선택해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  
  time: z.string()
    .min(1, '시간을 선택해주세요')
    .regex(/^\d{2}:\d{2}$/, '올바른 시간 형식이 아닙니다'),
  
  service: z.string()
    .min(1, '서비스를 선택해주세요')
    .max(100, '서비스명은 100자 이하로 입력해주세요'),
  
  message: z.string()
    .max(1000, '메시지는 1000자 이하로 입력해주세요')
    .optional(),
  
  // 파일 업로드
  file: z.object({
    name: z.string().max(255, '파일명이 너무 깁니다'),
    size: z.number().max(10 * 1024 * 1024, '파일 크기는 10MB 이하여야 합니다'),
    type: z.string().refine(
      (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type),
      '지원되지 않는 파일 형식입니다'
    )
  }).optional(),
  
  // 관리자 관련
  adminUsername: z.string()
    .min(1, '사용자명을 입력해주세요')
    .max(50, '사용자명은 50자 이하로 입력해주세요')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다'),
  
  adminPassword: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(100, '비밀번호는 100자 이하로 입력해주세요')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다'),
}

// 예약 생성 스키마
export const createReservationSchema = z.object({
  name: schemas.name,
  phone: schemas.phone,
  email: schemas.email,
  address: schemas.address,
  date: schemas.date,
  time: schemas.time,
  service: schemas.service,
  message: schemas.message,
})

// 예약 업데이트 스키마
export const updateReservationSchema = createReservationSchema.partial()

// 관리자 로그인 스키마
export const adminLoginSchema = z.object({
  username: schemas.adminUsername,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

// XSS 방지를 위한 HTML 정화
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // HTML 태그 모두 제거
    ALLOWED_ATTR: [], // 속성 모두 제거
  })
}

// 입력값 정화 및 검증
export function sanitizeInput(input: string): string {
  return sanitizeHtml(input.trim())
}

// SQL Injection 방지를 위한 기본 검증
export function validateSqlInput(input: string): boolean {
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
    'EXEC', 'EXECUTE', 'UNION', 'SCRIPT', 'DECLARE', '--', ';'
  ]
  
  const upperInput = input.toUpperCase()
  return !sqlKeywords.some(keyword => upperInput.includes(keyword))
}

// 파일 업로드 검증
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // 파일 크기 검증 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' }
  }
  
  // 파일 타입 검증
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '지원되지 않는 파일 형식입니다.' }
  }
  
  // 파일명 검증
  const filename = file.name
  if (filename.length > 255) {
    return { valid: false, error: '파일명이 너무 깁니다.' }
  }
  
  // 위험한 파일 확장자 검증
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.html']
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  if (dangerousExtensions.includes(extension)) {
    return { valid: false, error: '업로드할 수 없는 파일 형식입니다.' }
  }
  
  return { valid: true }
}

// Rate Limiting용 키 생성
export function getRateLimitKey(ip: string, endpoint: string): string {
  return `rate_limit:${endpoint}:${ip}`
}

// 입력값 로깅을 위한 안전한 문자열 변환
export function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, (key, value) => {
      // 민감한 정보 마스킹
      if (key.toLowerCase().includes('password') || 
          key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('secret')) {
        return '***REDACTED***'
      }
      return value
    })
  } catch {
    return '[Object object - stringify failed]'
  }
}