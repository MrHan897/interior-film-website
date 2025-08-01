'use client'

import { useState, useEffect } from 'react'
import { format, startOfDay, isSameDay, addDays, subDays } from 'date-fns'
import { ko } from 'date-fns/locale'

// Apple iOS 스타일 디자인 시스템
const iosColors = {
  light: {
    primary: '#007AFF',
    secondary: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceSecondary: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    separator: '#C6C6C8'
  }
}

const iosTypography = {
  largeTitle: 'text-[34px] font-bold leading-tight',
  title1: 'text-[28px] font-bold leading-normal',
  title2: 'text-[22px] font-semibold leading-normal',
  headline: 'text-[17px] font-semibold leading-normal',
  body: 'text-[17px] font-normal leading-relaxed',
  caption: 'text-[12px] font-normal leading-normal'
}

// 예약 데이터 인터페이스
interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  service: string
  time: string
  duration: number
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  staff?: string
  notes?: string
  date: string
}

// 샘플 데이터
const sampleReservations: Reservation[] = [
  {
    id: '1',
    customerName: '김민수',
    customerPhone: '010-1234-5678',
    service: '인테리어 필름 시공',
    time: '09:00',
    duration: 120,
    status: 'confirmed',
    staff: '시공팀 A',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '2',
    customerName: '이영희',
    customerPhone: '010-2345-6789',
    service: '상담',
    time: '14:00',
    duration: 60,
    status: 'pending',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '3',
    customerName: '박철수',
    customerPhone: '010-3456-7890',
    service: '마감재 교체',
    time: '16:30',
    duration: 180,
    status: 'completed',
    staff: '시공팀 B',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd')
  }
]

// iOS 스타일 컴포넌트들
const IOSCard = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-all duration-200' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
)

const IOSButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  className = ''
}: { 
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'plain'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  className?: string
}) => {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center min-h-[44px]'
  
  const variants = {
    primary: 'bg-blue-500 text-white shadow-sm hover:bg-blue-600',
    secondary: 'bg-green-500 text-white shadow-sm hover:bg-green-600',
    danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
    plain: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const StatusBadge = ({ status }: { status: Reservation['status'] }) => {
  const statusConfig = {
    confirmed: { label: '확정', color: 'bg-blue-100 text-blue-800' },
    pending: { label: '대기', color: 'bg-orange-100 text-orange-800' },
    completed: { label: '완료', color: 'bg-green-100 text-green-800' },
    cancelled: { label: '취소', color: 'bg-red-100 text-red-800' }
  }
  
  const config = statusConfig[status]
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

const TimelineItem = ({ reservation, onTap }: { reservation: Reservation, onTap: (reservation: Reservation) => void }) => (
  <IOSCard 
    className="p-4 mb-3 hover:bg-gray-50" 
    onClick={() => onTap(reservation)}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <div className="text-lg font-semibold text-blue-500">
            {reservation.time}
          </div>
          <StatusBadge status={reservation.status} />
        </div>
        
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">
            {reservation.customerName}
          </div>
          <div className="text-sm text-gray-600">
            {reservation.service}
          </div>
          <div className="text-xs text-gray-500 flex items-center space-x-2">
            <span>{reservation.duration}분</span>
            {reservation.staff && (
              <>
                <span>•</span>
                <span>{reservation.staff}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </IOSCard>
)

const QuickStatsCard = ({ title, value, trend, color }: { 
  title: string
  value: string
  trend?: string
  color: 'primary' | 'secondary' | 'warning'
}) => {
  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-green-500',
    warning: 'bg-orange-500'
  }
  
  return (
    <IOSCard className="p-4 min-w-[120px]">
      <div className={`w-8 h-8 rounded-full ${colorClasses[color]} mb-3 flex items-center justify-center`}>
        <div className="w-4 h-4 bg-white rounded-full"></div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
        {trend && (
          <div className="text-xs text-green-600 font-medium">+{trend}</div>
        )}
      </div>
    </IOSCard>
  )
}

export default function ReservationManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentTab, setCurrentTab] = useState<'today' | 'calendar' | 'customers' | 'analytics' | 'settings'>('today')
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // 에러 처리를 위한 state
  const [error, setError] = useState<string | null>(null)
  
  // 컴포넌트 마운트 시 에러 처리
  useEffect(() => {
    try {
      // 날짜 검증
      if (!selectedDate || isNaN(selectedDate.getTime())) {
        setSelectedDate(new Date())
      }
      // 예약 데이터 검증
      if (!Array.isArray(reservations)) {
        setReservations(sampleReservations)
      }
    } catch (err) {
      console.error('Component initialization error:', err)
      setError('시스템 초기화 중 오류가 발생했습니다.')
    }
  }, [])
  
  // 에러 상태일 때 에러 화면 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    )
  }

  // 오늘 예약 필터링 (안전 장치 추가)
  const todayReservations = reservations?.filter(reservation => {
    try {
      return reservation?.date && isSameDay(new Date(reservation.date), selectedDate)
    } catch (err) {
      console.warn('Date parsing error for reservation:', reservation)
      return false
    }
  }).sort((a, b) => (a?.time || '').localeCompare(b?.time || '')) || []

  // 통계 계산 (안전 장치 추가)
  const stats = {
    today: todayReservations.length,
    pending: reservations?.filter(r => r?.status === 'pending').length || 0,
    completed: reservations?.filter(r => {
      try {
        return r?.status === 'completed' && r?.date && isSameDay(new Date(r.date), selectedDate)
      } catch (err) {
        return false
      }
    }).length || 0
  }

  const handleReservationTap = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDetailModal(true)
  }

  const TabButton = ({ 
    tab, 
    icon, 
    label, 
    isActive 
  }: { 
    tab: typeof currentTab
    icon: string
    label: string
    isActive: boolean
  }) => (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-[60px] ${
        isActive 
          ? 'text-blue-500 bg-blue-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-xs font-medium">{label}</div>
    </button>
  )

  // 달력 뷰 렌더링
  const renderCalendarView = () => {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
    const days = ['일', '월', '화', '수', '목', '금', '토']
    
    const calendarDays = []
    
    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }
    
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day)
    }
    
    return (
      <div className="space-y-4">
        <IOSCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${iosTypography.title2} text-gray-900`}>
              {format(today, 'yyyy년 M월', { locale: ko })}
            </h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const hasReservation = day && reservations.some(r => 
                isSameDay(new Date(r.date), new Date(today.getFullYear(), today.getMonth(), day))
              )
              const isToday = day && isSameDay(new Date(today.getFullYear(), today.getMonth(), day), new Date())
              
              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                    day
                      ? isToday
                        ? 'bg-blue-500 text-white font-semibold'
                        : hasReservation
                        ? 'bg-green-100 text-green-800 font-medium hover:bg-green-200'
                        : 'hover:bg-gray-100'
                      : ''
                  }`}
                  onClick={() => day && setSelectedDate(new Date(today.getFullYear(), today.getMonth(), day))}
                >
                  {day}
                  {hasReservation && !isToday && (
                    <div className="absolute mt-6 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  )}
                </div>
              )
            })}
          </div>
        </IOSCard>
        
        {/* 선택된 날짜의 예약 */}
        <div className="space-y-3">
          <h3 className={`${iosTypography.headline} text-gray-900`}>
            {format(selectedDate, 'M월 d일 예약', { locale: ko })}
          </h3>
          {reservations.filter(r => isSameDay(new Date(r.date), selectedDate)).length === 0 ? (
            <IOSCard className="p-8 text-center">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-500">예약이 없습니다</p>
            </IOSCard>
          ) : (
            reservations
              .filter(r => isSameDay(new Date(r.date), selectedDate))
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((reservation) => (
                <TimelineItem
                  key={reservation.id}
                  reservation={reservation}
                  onTap={handleReservationTap}
                />
              ))
          )}
        </div>
      </div>
    )
  }
  
  // 고객 관리 뷰 렌더링
  const renderCustomersView = () => {
    const customers = Array.from(new Set(reservations.map(r => r.customerName).filter(name => name && name.trim())))
      .map(name => {
        const customerReservations = reservations.filter(r => r.customerName === name)
        const lastReservation = customerReservations.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
        
        return {
          name,
          phone: lastReservation.customerPhone,
          totalReservations: customerReservations.length,
          lastService: lastReservation.service,
          lastDate: lastReservation.date,
          status: lastReservation.status
        }
      })
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`${iosTypography.title2} text-gray-900`}>고객 목록</h2>
          <IOSButton variant="primary" size="medium">
            + 새 고객
          </IOSButton>
        </div>
        
        <div className="space-y-3">
          {customers.map((customer, index) => (
            <IOSCard key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {customer.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                    </div>
                  </div>
                  
                  <div className="ml-13 space-y-1">
                    <div className="text-sm text-gray-600">
                      총 예약: {customer.totalReservations}회
                    </div>
                    <div className="text-sm text-gray-600">
                      최근 서비스: {customer.lastService}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(customer.lastDate), 'M월 d일', { locale: ko })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StatusBadge status={customer.status} />
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </IOSCard>
          ))}
        </div>
      </div>
    )
  }
  
  // 분석 뷰 렌더링
  const renderAnalyticsView = () => {
    const monthlyStats = {
      totalReservations: reservations.length,
      completedReservations: reservations.filter(r => r.status === 'completed').length,
      pendingReservations: reservations.filter(r => r.status === 'pending').length,
      revenue: reservations.filter(r => r.status === 'completed').length * 150000 // 평균 서비스 금액
    }
    
    const serviceStats = reservations.reduce((acc, reservation) => {
      acc[reservation.service] = (acc[reservation.service] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return (
      <div className="space-y-6">
        <h2 className={`${iosTypography.title2} text-gray-900`}>이번 달 통계</h2>
        
        {/* 주요 지표 */}
        <div className="grid grid-cols-2 gap-4">
          <IOSCard className="p-4">
            <div className="text-2xl font-bold text-blue-500">{monthlyStats.totalReservations}</div>
            <div className="text-sm text-gray-600">총 예약</div>
          </IOSCard>
          <IOSCard className="p-4">
            <div className="text-2xl font-bold text-green-500">{monthlyStats.completedReservations}</div>
            <div className="text-sm text-gray-600">완료된 서비스</div>
          </IOSCard>
          <IOSCard className="p-4">
            <div className="text-2xl font-bold text-orange-500">{monthlyStats.pendingReservations}</div>
            <div className="text-sm text-gray-600">대기 중</div>
          </IOSCard>
          <IOSCard className="p-4">
            <div className="text-2xl font-bold text-purple-500">
              {(monthlyStats.revenue / 10000).toFixed(0)}만원
            </div>
            <div className="text-sm text-gray-600">예상 매출</div>
          </IOSCard>
        </div>
        
        {/* 서비스별 통계 */}
        <IOSCard className="p-6">
          <h3 className={`${iosTypography.headline} text-gray-900 mb-4`}>서비스별 예약</h3>
          <div className="space-y-3">
            {Object.entries(serviceStats).map(([service, count]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-gray-900">{service}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ 
                        width: `${Object.values(serviceStats).length > 0 
                          ? (count / Math.max(...Object.values(serviceStats))) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </IOSCard>
      </div>
    )
  }
  
  // 설정 뷰 렌더링
  const renderSettingsView = () => {
    const settingsGroups = [
      {
        title: '예약 설정',
        items: [
          { label: '운영 시간', value: '09:00 - 18:00', action: '수정' },
          { label: '예약 간격', value: '30분', action: '수정' },
          { label: '최대 예약 기간', value: '30일', action: '수정' }
        ]
      },
      {
        title: '알림 설정',
        items: [
          { label: '새 예약 알림', value: '켜짐', action: '토글' },
          { label: '예약 변경 알림', value: '켜짐', action: '토글' },
          { label: '리뷰 요청', value: '켜짐', action: '토글' }
        ]
      },
      {
        title: '시스템',
        items: [
          { label: '데이터 백업', value: '자동', action: '설정' },
          { label: '버전', value: 'v1.0.0', action: '확인' },
          { label: '로그아웃', value: '', action: '실행' }
        ]
      }
    ]
    
    return (
      <div className="space-y-6">
        <h2 className={`${iosTypography.title2} text-gray-900`}>설정</h2>
        
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className={`${iosTypography.headline} text-gray-700`}>{group.title}</h3>
            <IOSCard className="overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`p-4 flex items-center justify-between ${
                    itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    {item.value && (
                      <div className="text-sm text-gray-600">{item.value}</div>
                    )}
                  </div>
                  
                  <button className="text-blue-500 font-medium hover:text-blue-600">
                    {item.action}
                  </button>
                </div>
              ))}
            </IOSCard>
          </div>
        ))}
      </div>
    )
  }
  
  // 현재 탭에 따른 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (currentTab) {
      case 'calendar':
        return renderCalendarView()
      case 'customers':
        return renderCustomersView()
      case 'analytics':
        return renderAnalyticsView()
      case 'settings':
        return renderSettingsView()
      default:
        return null
    }
  }
  
  if (currentTab !== 'today') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className={`${iosTypography.title1} text-gray-900`}>
                {currentTab === 'calendar' && '달력'}
                {currentTab === 'customers' && '고객 관리'}
                {currentTab === 'analytics' && '분석'}
                {currentTab === 'settings' && '설정'}
              </h1>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          {renderTabContent()}
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-around py-2">
              <TabButton tab="today" icon="📅" label="오늘" isActive={currentTab === 'today'} />
              <TabButton tab="calendar" icon="🗓️" label="달력" isActive={currentTab === 'calendar'} />
              <TabButton tab="customers" icon="👥" label="고객" isActive={currentTab === 'customers'} />
              <TabButton tab="analytics" icon="📊" label="분석" isActive={currentTab === 'analytics'} />
              <TabButton tab="settings" icon="⚙️" label="설정" isActive={currentTab === 'settings'} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className={`${iosTypography.title1} text-gray-900`}>
                예약 관리
              </h1>
              <p className="text-sm text-gray-500">
                {format(selectedDate, 'M월 d일 EEEE', { locale: ko })}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                오늘
              </button>
              
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* 퀵 스탯 카드들 */}
        <div className="flex space-x-4 overflow-x-auto pb-4 mb-6">
          <QuickStatsCard 
            title="오늘 예약" 
            value={`${stats.today}건`} 
            trend="2" 
            color="primary" 
          />
          <QuickStatsCard 
            title="대기 고객" 
            value={`${stats.pending}명`} 
            color="warning" 
          />
          <QuickStatsCard 
            title="완료된 서비스" 
            value={`${stats.completed}건`} 
            color="secondary" 
          />
        </div>

        {/* 타임라인 뷰 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`${iosTypography.title2} text-gray-900`}>
              오늘의 일정
            </h2>
            <IOSButton variant="primary" size="medium">
              + 새 예약
            </IOSButton>
          </div>

          {todayReservations.length === 0 ? (
            <IOSCard className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className={`${iosTypography.headline} text-gray-600 mb-2`}>
                예약이 없습니다
              </h3>
              <p className="text-gray-500">
                오늘은 예약된 일정이 없습니다
              </p>
            </IOSCard>
          ) : (
            <div className="space-y-3">
              {todayReservations.map((reservation) => (
                <TimelineItem
                  key={reservation.id}
                  reservation={reservation}
                  onTap={handleReservationTap}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <TabButton tab="today" icon="📅" label="오늘" isActive={currentTab === 'today'} />
            <TabButton tab="calendar" icon="🗓️" label="달력" isActive={currentTab === 'calendar'} />
            <TabButton tab="customers" icon="👥" label="고객" isActive={currentTab === 'customers'} />
            <TabButton tab="analytics" icon="📊" label="분석" isActive={currentTab === 'analytics'} />
            <TabButton tab="settings" icon="⚙️" label="설정" isActive={currentTab === 'settings'} />
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className={`${iosTypography.title2} text-gray-900`}>
                  예약 상세
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 모달 컨텐츠 */}
            <div className="p-6 space-y-6">
              {/* 고객 정보 */}
              <div className="space-y-3">
                <h3 className={`${iosTypography.headline} text-gray-900`}>고객 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름</span>
                    <span className="font-medium">{selectedReservation.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연락처</span>
                    <span className="font-medium">{selectedReservation.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* 서비스 상세 */}
              <div className="space-y-3">
                <h3 className={`${iosTypography.headline} text-gray-900`}>서비스 상세</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">서비스</span>
                    <span className="font-medium">{selectedReservation.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">시간</span>
                    <span className="font-medium">{selectedReservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">소요시간</span>
                    <span className="font-medium">{selectedReservation.duration}분</span>
                  </div>
                  {selectedReservation.staff && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">담당자</span>
                      <span className="font-medium">{selectedReservation.staff}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">상태</span>
                    <StatusBadge status={selectedReservation.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* 모달 액션 버튼들 */}
            <div className="p-6 bg-gray-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <IOSButton variant="secondary" size="medium">
                  예약 확정
                </IOSButton>
                <IOSButton variant="plain" size="medium">
                  시간 변경
                </IOSButton>
              </div>
              <IOSButton variant="danger" size="medium" className="w-full">
                예약 취소
              </IOSButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}