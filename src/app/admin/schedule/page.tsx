'use client'

import { useState, useEffect } from 'react'
import { format, isSameDay, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  CalendarDaysIcon, 
  ClockIcon,
  UserIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// 색상 체계 (디자인 시스템 사양 기준)
const colorScheme = {
  primary: '#4F46E5',
  secondary: '#06B6D4', 
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    500: '#6B7280',
    900: '#111827'
  }
}

// 반응형 브레이크포인트 (디자인 시스템 사양)
const breakpoints = {
  mobile: '< 768px',
  tablet: '768px - 1024px', 
  desktop: '> 1024px'
}

// 일정 데이터 인터페이스
interface ScheduleEvent {
  id: string
  title: string
  customer_name: string
  contact: string
  address: string
  service_type: 'consultation' | 'installation' | 'support' | 'maintenance'
  start_time: string
  end_time: string
  date: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
  worker?: string
  materials?: string[]
}

// 뷰 타입
type ViewType = 'month' | 'week' | 'day'

// 서비스 타입별 설정
const serviceConfig = {
  consultation: {
    label: '상담',
    color: '#3B82F6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '💬'
  },
  installation: {
    label: '시공',
    color: '#10B981',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    icon: '🔧'
  },
  support: {
    label: '지원',
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: '🛠️'
  },
  maintenance: {
    label: 'A/S',
    color: '#8B5CF6',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: '🔍'
  }
}

// 상태별 설정
const statusConfig = {
  confirmed: { label: '확정', color: 'bg-emerald-100 text-emerald-800' },
  pending: { label: '대기', color: 'bg-amber-100 text-amber-800' },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: '취소', color: 'bg-red-100 text-red-800' }
}

// 샘플 데이터
const sampleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: '아파트 거실 필름 시공',
    customer_name: '김민수',
    contact: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    service_type: 'installation',
    start_time: '09:00',
    end_time: '12:00',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'confirmed',
    worker: '김기술',
    materials: ['프리미엄 필름', '접착제', '도구세트']
  },
  {
    id: '2',
    title: '오피스텔 상담',
    customer_name: '이영희',
    contact: '010-2345-6789',
    address: '서울시 서초구 서초대로 456',
    service_type: 'consultation',
    start_time: '14:00',
    end_time: '15:00',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending',
    notes: '베란다 필름 문의'
  },
  {
    id: '3',
    title: '상가 A/S 점검',
    customer_name: '박철수',
    contact: '010-3456-7890',
    address: '서울시 마포구 홍대입구역 789',
    service_type: 'maintenance',
    start_time: '16:00',
    end_time: '17:00',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    status: 'confirmed',
    worker: '이기술',
    notes: '필름 가장자리 점검'
  }
]

// 반응형 스케줄 이벤트 카드 컴포넌트
const EventCard = ({ 
  event, 
  onClick,
  isMobile = false
}: { 
  event: ScheduleEvent
  onClick: (event: ScheduleEvent) => void
  isMobile?: boolean
}) => {
  const config = serviceConfig[event.service_type]
  const statusConf = statusConfig[event.status]
  
  if (isMobile) {
    // 모바일 최적화된 카드 레이아웃
    return (
      <div
        onClick={() => onClick(event)}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 cursor-pointer touch-manipulation"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="text-xl">{config.icon}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <ClockIcon className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">{event.start_time} - {event.end_time}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConf.color} whitespace-nowrap`}>
            {statusConf.label}
          </span>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{event.customer_name}</span>
          </div>
          <div className="flex items-start space-x-2">
            <MapPinIcon className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="truncate text-xs leading-tight">{event.address}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
            {config.label}
          </span>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    )
  }

  // 데스크톱 카드 레이아웃
  return (
    <div
      onClick={() => onClick(event)}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-lg truncate">{event.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConf.color}`}>
              {statusConf.label}
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>{event.start_time} - {event.end_time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <span>{event.customer_name}</span>
            </div>
            <div className="flex items-center space-x-2 lg:col-span-2">
              <MapPinIcon className="w-4 h-4" />
              <span className="truncate">{event.address}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
              {config.label}
            </span>
            {event.worker && (
              <span className="text-sm text-gray-500">담당: {event.worker}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 반응형 새 일정 추가 모달 컴포넌트
const NewEventModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  selectedDate,
  isMobile = false
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<ScheduleEvent, 'id'>) => void
  selectedDate: Date
  isMobile?: boolean
}) => {
  const [formData, setFormData] = useState<Omit<ScheduleEvent, 'id'>>({
    title: '',
    customer_name: '',
    contact: '',
    address: '',
    service_type: 'consultation',
    start_time: '09:00',
    end_time: '10:00',
    date: format(selectedDate, 'yyyy-MM-dd'),
    status: 'pending',
    notes: '',
    worker: '',
    materials: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
    // 폼 초기화
    setFormData({
      title: '',
      customer_name: '',
      contact: '',
      address: '',
      service_type: 'consultation',
      start_time: '09:00',
      end_time: '10:00',
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: 'pending',
      notes: '',
      worker: '',
      materials: []
    })
  }

  if (!isOpen) return null

  const modalClasses = isMobile 
    ? "fixed inset-0 bg-white z-50 overflow-hidden" 
    : "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"

  const contentClasses = isMobile
    ? "h-full flex flex-col"
    : "bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* 모달 헤더 */}
        <div className={`p-4 ${isMobile ? 'pt-safe-top' : 'p-6'} border-b border-gray-200 ${isMobile ? 'flex-shrink-0' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>새 일정 추가</h2>
            <button
              onClick={onClose}
              className={`flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors ${
                isMobile ? 'w-8 h-8' : 'w-10 h-10'
              }`}
            >
              <XMarkIcon className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </button>
          </div>
        </div>

        {/* 모달 컨텐츠 */}
        <div className={`${isMobile ? 'flex-1 overflow-y-auto' : ''}`}>
          <form onSubmit={handleSubmit} className={`space-y-6 ${isMobile ? 'p-4' : 'p-6'} ${isMobile ? '' : 'overflow-y-auto max-h-[calc(90vh-140px)]'}`}>
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>기본 정보</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                    hover:border-gray-500 hover:bg-white
                    focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                    placeholder:text-gray-500 text-gray-900 ${
                    isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                  }`}
                  placeholder="일정 제목을 입력하세요"
                />
              </div>

              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">고객명</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                    placeholder="고객명"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                    hover:border-gray-500 hover:bg-white
                    focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                    placeholder:text-gray-500 text-gray-900 ${
                    isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                  }`}
                  placeholder="시공 주소를 입력하세요"
                />
              </div>
            </div>

            {/* 일정 정보 섹션 */}
            <div className="space-y-4">
              <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>일정 정보</h3>
              
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">서비스 유형</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value as any })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                  >
                    {Object.entries(serviceConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                  />
                </div>
              </div>

              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">담당자</label>
                  <input
                    type="text"
                    value={formData.worker}
                    onChange={(e) => setFormData({ ...formData, worker: e.target.value })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                    placeholder="담당자명 (선택사항)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                      hover:border-gray-500 hover:bg-white
                      focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                      text-gray-900 ${
                      isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                    }`}
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={isMobile ? 4 : 3}
                  className={`w-full bg-gray-50 border-2 border-gray-400 rounded-2xl transition-all duration-200 
                    hover:border-gray-500 hover:bg-white
                    focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white
                    placeholder:text-gray-500 text-gray-900 ${
                    isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3'
                  }`}
                  placeholder="추가 메모나 특이사항을 입력하세요"
                />
              </div>
            </div>
          </form>
        </div>

        {/* 버튼 */}
        <div className={`border-t border-gray-200 ${isMobile ? 'p-4 flex-shrink-0 pb-safe-bottom' : 'p-6'}`}>
          <div className={`flex space-x-4 ${isMobile ? '' : 'pt-0'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors ${
                isMobile ? 'py-4 text-base font-medium' : 'px-6 py-3'
              }`}
            >
              취소
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`flex-1 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-colors ${
                isMobile ? 'py-4 text-base font-medium' : 'px-6 py-3'
              }`}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('month')
  const [events, setEvents] = useState<ScheduleEvent[]>(sampleEvents)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showNewEventModal, setShowNewEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // 모바일에서도 모든 뷰 타입 허용 (사용자 선택 존중)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 새 이벤트 추가
  const handleAddEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: Date.now().toString()
    }
    setEvents([...events, newEvent])
  }

  // 월 뷰 렌더링
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    const days = []
    let day = startDate
    
    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }
    
    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    if (isMobile) {
      // 모바일 월 뷰 (간소화된 버전)
      return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* 달력 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-semibold text-gray-700 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          
          {/* 달력 본체 */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
              {week.map((day) => {
                const dayEvents = events.filter(event => 
                  isSameDay(new Date(event.date), day)
                )
                const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                const isToday = isSameDay(day, new Date())
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[60px] p-1 border-r border-gray-100 last:border-r-0 ${
                      !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                    } active:bg-gray-100 transition-colors touch-manipulation`}
                    onClick={() => {
                      setSelectedDate(day)
                      setView('day')
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-xs font-medium mb-1 ${
                        isToday 
                          ? 'bg-indigo-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]' 
                          : isCurrentMonth 
                            ? 'text-gray-900' 
                            : 'text-gray-400'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-0.5 flex-1">
                        {dayEvents.slice(0, 1).map((event) => {
                          const config = serviceConfig[event.service_type]
                          return (
                            <div
                              key={event.id}
                              className={`text-[9px] px-1 py-0.5 rounded truncate ${config.bgColor} ${config.textColor}`}
                            >
                              {event.start_time}
                            </div>
                          )
                        })}
                        {dayEvents.length > 1 && (
                          <div className="text-[8px] text-gray-500">
                            +{dayEvents.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )
    }

    // 데스크톱 월 뷰
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 달력 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        {/* 달력 본체 */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
            {week.map((day) => {
              const dayEvents = events.filter(event => 
                isSameDay(new Date(event.date), day)
              )
              const isCurrentMonth = day.getMonth() === currentDate.getMonth()
              const isToday = isSameDay(day, new Date())
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 border-r border-gray-100 last:border-r-0 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                  onClick={() => {
                    setSelectedDate(day)
                    setShowNewEventModal(true)
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium mb-2 ${
                      isToday 
                        ? 'bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                        : isCurrentMonth 
                          ? 'text-gray-900' 
                          : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1 flex-1">
                      {dayEvents.slice(0, 2).map((event) => {
                        const config = serviceConfig[event.service_type]
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEvent(event)
                            }}
                            className={`text-xs p-1 rounded cursor-pointer truncate ${config.bgColor} ${config.textColor} hover:opacity-80`}
                          >
                            {event.start_time} {event.title}
                          </div>
                        )
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2}개 더
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  // 주 뷰 렌더링  
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const days = []
    let day = weekStart
    
    while (day <= weekEnd) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="space-y-4">
        {days.map((day) => {
          const dayEvents = events.filter(event => 
            isSameDay(new Date(event.date), day)
          ).sort((a, b) => a.start_time.localeCompare(b.start_time))
          
          const isToday = isSameDay(day, new Date())
          
          return (
            <div key={day.toISOString()} className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} ${
                  isToday ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  {format(day, 'M월 d일 EEEE', { locale: ko })}
                  {isToday && <span className={`ml-2 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'}`}>오늘</span>}
                </h3>
                <button
                  onClick={() => {
                    setSelectedDate(day)
                    setShowNewEventModal(true)
                  }}
                  className={`flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 ${isMobile ? 'text-sm' : ''}`}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>일정 추가</span>
                </button>
              </div>
              
              {dayEvents.length === 0 ? (
                <div className={`text-center text-gray-500 ${isMobile ? 'py-6' : 'py-8'}`}>
                  예정된 일정이 없습니다
                </div>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={setSelectedEvent}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // 일 뷰 렌더링
  const renderDayView = () => {
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.date), currentDate)
    ).sort((a, b) => a.start_time.localeCompare(b.start_time))
    
    const isToday = isSameDay(currentDate, new Date())
    
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} ${
            isToday ? 'text-indigo-600' : 'text-gray-900'
          }`}>
            {format(currentDate, 'M월 d일 EEEE', { locale: ko })}
            {isToday && <span className={`ml-3 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'}`}>오늘</span>}
          </h2>
          <button
            onClick={() => {
              setSelectedDate(currentDate)
              setShowNewEventModal(true)
            }}
            className={`flex items-center space-x-2 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-colors ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
            }`}
          >
            <PlusIcon className="w-4 h-4" />
            <span>새 일정</span>
          </button>
        </div>
        
        {dayEvents.length === 0 ? (
          <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
            <CalendarDaysIcon className={`text-gray-300 mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
            <h3 className={`font-medium text-gray-500 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>예정된 일정이 없습니다</h3>
            <p className="text-gray-400">새 일정을 추가해보세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={setSelectedEvent}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // 네비게이션 핸들러
  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    } else {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1))
    }
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className={`px-4 lg:px-6 ${isMobile ? 'py-3' : 'py-4'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>일정관리</h1>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>예약 일정을 효율적으로 관리하세요</p>
              </div>
              
              {/* 모바일 새 일정 추가 버튼 */}
              {isMobile && (
                <button
                  onClick={() => {
                    setSelectedDate(new Date())
                    setShowNewEventModal(true)
                  }}
                  className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* 네비게이션 및 뷰 컨트롤 */}
            <div className={`flex items-center justify-between ${isMobile ? 'mt-3' : 'mt-4'}`}>
              {/* 날짜 네비게이션 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className={`p-2 hover:bg-gray-100 rounded-xl transition-colors ${isMobile ? 'p-1.5' : ''}`}
                >
                  <ChevronLeftIcon className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
                
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className={`font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors ${
                    isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'
                  }`}
                >
                  오늘
                </button>
                
                <button
                  onClick={() => navigateDate('next')}
                  className={`p-2 hover:bg-gray-100 rounded-xl transition-colors ${isMobile ? 'p-1.5' : ''}`}
                >
                  <ChevronRightIcon className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
              </div>
              
              {/* 뷰 선택 버튼 */}
              <div className={`flex bg-gray-100 rounded-2xl p-1 ${isMobile ? 'text-xs' : ''}`}>
                {[
                  { key: 'month', label: isMobile ? '월' : '월' },
                  { key: 'week', label: isMobile ? '주' : '주' },
                  { key: 'day', label: isMobile ? '일' : '일' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setView(key as ViewType)}
                    className={`rounded-xl font-medium transition-colors ${
                      isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                    } ${
                      view === key
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              {/* 데스크톱 새 일정 추가 버튼 */}
              {!isMobile && (
                <button
                  onClick={() => {
                    setSelectedDate(new Date())
                    setShowNewEventModal(true)
                  }}
                  className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-2xl hover:bg-indigo-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>새 일정</span>
                </button>
              )}
            </div>
            
            {/* 현재 날짜 표시 */}
            <div className={`${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {view === 'month' && format(currentDate, 'yyyy년 M월', { locale: ko })}
                {view === 'week' && `${format(startOfWeek(currentDate), 'M월 d일', { locale: ko })} - ${format(endOfWeek(currentDate), 'M월 d일', { locale: ko })}`}
                {view === 'day' && format(currentDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
              </h2>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        {/* 새 일정 추가 모달 */}
        <NewEventModal
          isOpen={showNewEventModal}
          onClose={() => setShowNewEventModal(false)}
          onSave={handleAddEvent}
          selectedDate={selectedDate}
          isMobile={isMobile}
        />

        {/* 이벤트 상세 모달 */}
        {selectedEvent && (
          <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ${
            isMobile ? 'bg-black/30 p-0' : 'bg-black/50 p-4'
          }`}>
            <div className={`bg-white overflow-hidden shadow-2xl ${
              isMobile ? 'w-full h-full' : 'rounded-3xl w-full max-w-lg'
            }`}>
              {/* 모달 헤더 */}
              <div className={`border-b border-gray-200 ${isMobile ? 'p-4 pt-safe-top' : 'p-6'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>일정 상세</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className={`flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors ${
                      isMobile ? 'w-8 h-8' : 'w-8 h-8'
                    }`}
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* 모달 컨텐츠 */}
              <div className={`space-y-4 ${isMobile ? 'p-4 flex-1 overflow-y-auto' : 'p-6'}`}>
                <div>
                  <h3 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-base' : ''}`}>{selectedEvent.title}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 rounded-full font-medium ${serviceConfig[selectedEvent.service_type].bgColor} ${serviceConfig[selectedEvent.service_type].textColor} ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      {serviceConfig[selectedEvent.service_type].label}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-medium ${statusConfig[selectedEvent.status].color} ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      {statusConfig[selectedEvent.status].label}
                    </span>
                  </div>
                </div>
                
                <div className={`space-y-3 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>{selectedEvent.start_time} - {selectedEvent.end_time}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>{selectedEvent.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span>{selectedEvent.contact}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="flex-1">{selectedEvent.address}</span>
                  </div>
                  {selectedEvent.worker && (
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>담당자: {selectedEvent.worker}</span>
                    </div>
                  )}
                  {selectedEvent.notes && (
                    <div className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="flex-1">{selectedEvent.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 모달 액션 */}
              <div className={`bg-gray-50 flex space-x-3 ${isMobile ? 'p-4 pb-safe-bottom' : 'p-6'}`}>
                <button className={`flex-1 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-colors ${
                  isMobile ? 'py-3 text-base font-medium' : 'px-4 py-2'
                }`}>
                  수정
                </button>
                <button className={`flex-1 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors ${
                  isMobile ? 'py-3 text-base font-medium' : 'px-4 py-2'
                }`}>
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}