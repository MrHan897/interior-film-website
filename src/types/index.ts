// 공통 타입 정의
export interface BaseEntity {
  id: string
  created_at: string
  updated_at?: string
}

// Portfolio 관련 타입
export interface Portfolio extends BaseEntity {
  title: string
  category: string
  description: string
  image_url: string
  tags: string[]
  featured?: boolean
  order_index?: number
}

export interface PortfolioFormData {
  title: string
  category: string
  description: string
  image_url: string
  tags: string[]
  featured?: boolean
}

// Booking 관련 타입
export interface Booking extends BaseEntity {
  building_type: string
  area_size?: string
  home_condition?: string
  reason?: string
  spaces?: string[]
  budget?: string
  timeline?: string
  consult_date: string
  consult_time: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_requirements?: string
  privacy_consent: boolean
  status: BookingStatus
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface BookingFormData {
  building_type: string
  area_size?: string
  home_condition?: string
  reason?: string
  spaces?: string[]
  budget?: string
  timeline?: string
  consult_date: string
  consult_time: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_requirements?: string
  privacy_consent: boolean
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 컴포넌트 Props 타입
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

// 유틸리티 타입
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

// 환경변수 타입
export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  ADMIN_USERNAME?: string
  ADMIN_PASSWORD?: string
  JWT_SECRET?: string
  NODE_ENV: 'development' | 'production' | 'test'
}

// 인증 관련 타입
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  error?: string
  message?: string
}

// 이벤트 핸들러 타입
export type FormSubmitHandler<T = unknown> = (data: T) => Promise<void> | void
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void
export type ChangeHandler<T = string> = (value: T) => void

// 애니메이션 관련 타입
export interface IntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  root?: Element | null
}

export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
}