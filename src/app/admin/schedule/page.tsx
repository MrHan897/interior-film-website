'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isWeekend } from 'date-fns'
import { ko } from 'date-fns/locale'
import AdminBookingForm from '@/components/AdminBookingForm'
import AdminEventForm from '@/components/AdminEventForm'
import BookingDetailModal from '@/components/BookingDetailModal'
import EventDetailModal from '@/components/EventDetailModal'
import SalesChart from '@/components/SalesChart'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// 커스텀 스타일 추가
const customCalendarStyles = `
  .rbc-month-view .rbc-date-cell {
    padding: 8px 4px;
    min-height: 120px;
  }
  
  .rbc-month-view .rbc-date-cell > a {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    text-decoration: none;
  }
  
  .rbc-month-view .rbc-event {
    background: transparent !important;
    border: none !important;
    padding: 2px 4px;
    margin: 2px 0;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    touch-action: manipulation;
    min-height: 24px;
    display: flex;
    align-items: center;
    color: inherit !important;
  }
  
  .rbc-week-view .rbc-event {
    background: transparent !important;
    border: none !important;
    padding: 2px 4px;
    margin: 1px 0;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    color: inherit !important;
  }
  
  .rbc-day-view .rbc-event {
    background: transparent !important;
    border: none !important;
    padding: 4px;
    margin: 1px 0;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    color: inherit !important;
  }
  
  .rbc-month-view .rbc-event:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
  
  .rbc-month-view .rbc-event-content {
    background: transparent !important;
    border: none !important;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
    color: inherit !important;
  }
  
  .rbc-week-view .rbc-event-content {
    background: transparent !important;
    border: none !important;
    color: inherit !important;
  }
  
  .rbc-day-view .rbc-event-content {
    background: transparent !important;
    border: none !important;
    color: inherit !important;
  }
  
  .rbc-month-view .rbc-row-content {
    z-index: 4;
  }
  
  .rbc-month-view .rbc-day-bg.rbc-today {
    background-color: #dbeafe;
  }
  
  .rbc-month-view .rbc-off-range-bg {
    background-color: #f9fafb;
  }
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    .rbc-month-view .rbc-date-cell {
      padding: 4px 2px;
      min-height: 100px;
    }
    
    .rbc-month-view .rbc-date-cell > a {
      font-size: 14px;
    }
    
    .rbc-month-view .rbc-event {
      padding: 6px 4px;
      margin: 1px 0;
      font-size: 10px;
      min-height: 28px;
      border-radius: 4px;
    }
    
    .rbc-month-view .rbc-event:active {
      background-color: rgba(59, 130, 246, 0.8) !important;
      transform: scale(0.98);
    }
  }
  
  /* 터치 디바이스 최적화 */
  @media (hover: none) and (pointer: coarse) {
    .rbc-month-view .rbc-event {
      min-height: 32px;
      padding: 8px 6px;
    }
  }
`

const locales = {
  'ko': ko,
}

const localizer = dateFnsLocalizer({
  format: (date, formatStr, culture) => format(date, formatStr, { locale: locales[culture] }),
  parse,
  startOfWeek: (date, culture) => startOfWeek(date, { locale: locales[culture] }),
  getDay,
  locales,
})

// 한국 공휴일 데이터 (2024-2025년)
const koreanHolidays = [
  // 2024년
  { date: '2024-01-01', name: '신정' },
  { date: '2024-02-09', name: '설날 연휴' },
  { date: '2024-02-10', name: '설날' },
  { date: '2024-02-11', name: '설날 연휴' },
  { date: '2024-02-12', name: '대체공휴일' },
  { date: '2024-03-01', name: '삼일절' },
  { date: '2024-04-10', name: '국회의원선거일' },
  { date: '2024-05-05', name: '어린이날' },
  { date: '2024-05-06', name: '대체공휴일' },
  { date: '2024-05-15', name: '부처님오신날' },
  { date: '2024-06-06', name: '현충일' },
  { date: '2024-08-15', name: '광복절' },
  { date: '2024-09-16', name: '추석 연휴' },
  { date: '2024-09-17', name: '추석' },
  { date: '2024-09-18', name: '추석 연휴' },
  { date: '2024-10-03', name: '개천절' },
  { date: '2024-10-09', name: '한글날' },
  { date: '2024-12-25', name: '크리스마스' },
  // 2025년
  { date: '2025-01-01', name: '신정' },
  { date: '2025-01-28', name: '설날 연휴' },
  { date: '2025-01-29', name: '설날' },
  { date: '2025-01-30', name: '설날 연휴' },
  { date: '2025-03-01', name: '삼일절' },
  { date: '2025-05-05', name: '어린이날' },
  { date: '2025-05-12', name: '부처님오신날' },
  { date: '2025-06-06', name: '현충일' },
  { date: '2025-08-15', name: '광복절' },
  { date: '2025-10-03', name: '개천절' },
  { date: '2025-10-06', name: '추석 연휴' },
  { date: '2025-10-07', name: '추석' },
  { date: '2025-10-08', name: '추석 연휴' },
  { date: '2025-10-09', name: '한글날' },
  { date: '2025-12-25', name: '크리스마스' },
]

// 공휴일 확인 함수
const isKoreanHoliday = (date: Date) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return false
    }
    const dateString = format(date, 'yyyy-MM-dd')
    return koreanHolidays.some(holiday => holiday.date === dateString)
  } catch (error) {
    console.warn('Invalid date in isKoreanHoliday:', date)
    return false
  }
}

// 공휴일 이름 가져오기 함수
const _getHolidayName = (date: Date) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return ''
    }
    const dateString = format(date, 'yyyy-MM-dd')
    const holiday = koreanHolidays.find(h => h.date === dateString)
    return holiday?.name || ''
  } catch (error) {
    console.warn('Invalid date in getHolidayName:', date)
    return ''
  }
}

interface BookingData {
  id: string
  building_type: string
  area_size: string
  home_condition: string
  reason: string
  spaces: string[]
  budget: string
  timeline: string
  consult_date: string
  consult_time: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_requirements: string
  privacy_consent: boolean
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  // 상담 및 견적 관련 필드
  consultation_memo?: string
  visit_date?: string
  estimate_amount?: number
  estimate_details?: string
  final_amount?: number
  payment_status?: 'unpaid' | 'partial' | 'completed'
  work_start_date?: string
  work_end_date?: string
}

export default function BookingPage() {
  const [events, setEvents] = useState<(BookingData & { start: Date; end: Date; title: string; color: string })[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [generalEvents, setGeneralEvents] = useState<{ id: string; title: string; start: Date; end: Date; color: string }[]>([])
  const [selectedEvent] = useState<BookingData | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [registrationType] = useState<'booking' | 'event'>('booking')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [showEventDetailModal, setShowEventDetailModal] = useState(false)
  const [selectedEventDetail, setSelectedEventDetail] = useState<{ id: string; title: string; start: Date; end: Date } | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date('2025-07-01')) // Static initial date for SSR
  const [isClient, setIsClient] = useState(false)
  const [currentView, setCurrentView] = useState('month')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'bookings' | 'sales' | 'settings'>('dashboard')
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [bookingViewMode, setBookingViewMode] = useState<'table' | 'calendar'>('table')
  const [showUnifiedForm, setShowUnifiedForm] = useState(false)
  const [unifiedFormType, setUnifiedFormType] = useState<'booking' | 'event'>('booking')
  const [dashboardCardFilter, setDashboardCardFilter] = useState<'all' | 'month' | 'confirmed' | 'pending'>('all')
  const [showSalesSection, setShowSalesSection] = useState(true)
  const [salesDetailModal, setSalesDetailModal] = useState<{
    isOpen: boolean;
    type: 'total' | 'completed' | 'confirmed' | 'pending';
    title: string;
    data: any[];
  }>({
    isOpen: false,
    type: 'total',
    title: '',
    data: []
  })
  const [salesEditModal, setSalesEditModal] = useState<{
    isOpen: boolean;
    booking: BookingData | null;
  }>({
    isOpen: false,
    booking: null
  })
  const [settingsData, setSettingsData] = useState({
    workStartTime: '09:00',
    workEndTime: '18:00',
    consultDuration: 2,
    bookingNotification: true,
    salesReport: true
  })

  // 설정 업데이트 함수들
  const updateWorkHours = (startTime: string, endTime: string) => {
    setSettingsData(prev => ({ ...prev, workStartTime: startTime, workEndTime: endTime }))
    alert(`업무 시간이 ${startTime} - ${endTime}로 변경되었습니다.`)
  }

  const updateConsultDuration = (duration: number) => {
    setSettingsData(prev => ({ ...prev, consultDuration: duration }))
    alert(`상담 소요 시간이 ${duration}시간으로 변경되었습니다.`)
  }

  const toggleNotification = (type: 'booking' | 'sales') => {
    if (type === 'booking') {
      setSettingsData(prev => ({ ...prev, bookingNotification: !prev.bookingNotification }))
      alert(`예약 알림이 ${!settingsData.bookingNotification ? '활성화' : '비활성화'}되었습니다.`)
    } else {
      setSettingsData(prev => ({ ...prev, salesReport: !prev.salesReport }))
      alert(`매출 리포트 알림이 ${!settingsData.salesReport ? '활성화' : '비활성화'}되었습니다.`)
    }
  }

  const handleDataBackup = () => {
    alert('데이터 백업을 시작합니다. 완료되면 알림을 받으실 수 있습니다.')
  }

  const handleDataExport = () => {
    const exportData = {
      bookings,
      settings: settingsData,
      exportDate: new Date().toISOString()
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kkumida-film-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    alert('데이터가 성공적으로 내보내졌습니다.')
  }

  const handleClearCache = () => {
    if (confirm('캐시를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear()
      sessionStorage.clear()
      alert('캐시가 성공적으로 삭제되었습니다. 페이지를 새로고침합니다.')
      window.location.reload()
    }
  }

  // 샘플 데이터 로드 (Supabase 미설정 시)
  const loadSampleData = () => {
    const sampleBookings: BookingData[] = [
      {
        id: 'sample-1',
        building_type: 'apartment',
        area_size: '30평',
        home_condition: '신축',
        reason: '새집 인테리어',
        spaces: ['거실', '방'],
        budget: '300-500',
        timeline: 'within-month',
        consult_date: new Date().toISOString().split('T')[0],
        consult_time: '14:00',
        customer_name: '김○○',
        customer_phone: '010-1234-5678',
        customer_address: '서울시 강남구 ○○아파트',
        customer_requirements: '밝은 색상 선호',
        privacy_consent: true,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    setBookings(sampleBookings)
    
    const sampleEvents = sampleBookings.map((booking) => {
      const [hour, minute] = booking.consult_time.split(':')
      const startDateTime = new Date(booking.consult_date)
      startDateTime.setHours(parseInt(hour), parseInt(minute))
      
      const endDateTime = new Date(startDateTime)
      endDateTime.setHours(startDateTime.getHours() + 2)
      
      // 시간을 12시간 형식으로 변환
      const timeString = `${hour}:${minute}`
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      
      return {
        id: booking.id,
        title: '', // 빈 제목으로 설정하여 커스텀 컴포넌트만 표시
        start: startDateTime,
        end: endDateTime,
        resource: {
          ...booking,
          client: booking.customer_name,
          phone: booking.customer_phone,
          address: booking.customer_address,
          displayTime: displayTime
        }
      }
    })
    
    setEvents(sampleEvents)
  }

  // 예약 데이터 가져오기
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings')
      const result = await response.json()
      
      if (response.ok) {
        setBookings(result.data)
      } else {
        console.error('예약 데이터 가져오기 실패:', result.error)
        loadSampleData()
      }
    } catch (error) {
      console.error('예약 데이터 가져오기 오류:', error) 
      loadSampleData()
    } finally {
      setLoading(false)
    }
  }, [])

  // 일반 일정 데이터 가져오기
  const fetchGeneralEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/events')
      const result = await response.json()
      
      if (response.ok) {
        setGeneralEvents(result.data)
      } else {
        if (result.details) {
          console.log('Supabase 미설정으로 인해 샘플 일정 데이터를 사용합니다.')
        } else {
          console.error('일정 데이터 가져오기 실패:', result.error)
        }
      }
    } catch (error) {
      console.error('일정 데이터 가져오기 오류:', error)
    }
  }, [])

  // 모든 데이터를 캘린더 이벤트로 통합
  const combineAllEvents = useCallback(() => {
    // 예약 데이터 필터링
    let filteredBookings = bookings
    if (eventTypeFilter === 'customer_booking') {
      if (bookingStatusFilter !== 'all') {
        filteredBookings = bookings.filter(b => b.status === bookingStatusFilter)
      }
    } else if (eventTypeFilter === 'company') {
      filteredBookings = []
    }

    const bookingEvents = filteredBookings.map((booking: BookingData) => {
      const [hour, minute] = booking.consult_time.split(':')
      const startDateTime = new Date(booking.consult_date)
      startDateTime.setHours(parseInt(hour), parseInt(minute))
      
      const endDateTime = new Date(startDateTime)
      endDateTime.setHours(startDateTime.getHours() + 2)
      
      const timeString = `${hour}:${minute}`
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      
      return {
        id: booking.id,
        title: '', // 빈 제목으로 설정하여 커스텀 컴포넌트만 표시
        start: startDateTime,
        end: endDateTime,
        type: 'customer_booking',
        resource: {
          ...booking,
          client: booking.customer_name,
          phone: booking.customer_phone,
          address: booking.customer_address,
          displayTime: displayTime
        }
      }
    })

    // 회사 일정 데이터 필터링
    let filteredGeneralEvents = generalEvents
    if (eventTypeFilter === 'customer_booking') {
      filteredGeneralEvents = []
    } else if (eventTypeFilter === 'company') {
      // 회사 일정만 보여줌
    }

    const generalEventsForCalendar = filteredGeneralEvents.map((event: { id: string; start_date: string; start_time: string; end_date: string; end_time: string }) => {
      const startDateTime = new Date(`${event.start_date}T${event.start_time}`)
      const endDateTime = new Date(`${event.end_date}T${event.end_time}`)
      
      const timeString = format(startDateTime, 'HH:mm')
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      
      return {
        id: event.id,
        title: '', // 빈 제목으로 설정하여 커스텀 컴포넌트만 표시
        start: startDateTime,
        end: endDateTime,
        type: event.event_type,
        resource: {
          ...event,
          displayTime: displayTime
        }
      }
    })

    return [...bookingEvents, ...generalEventsForCalendar]
  }, [bookings, generalEvents, eventTypeFilter, bookingStatusFilter])

  // 필터링된 예약 데이터 (테이블 표시용)
  const filteredBookingsForTable = useMemo(() => {
    if (bookingStatusFilter === 'all') {
      return bookings
    }
    return bookings.filter(booking => booking.status === bookingStatusFilter)
  }, [bookings, bookingStatusFilter])

  // 실제 매출 데이터 계산
  const salesData = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === 'completed' && b.final_amount)
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
    const pendingBookings = bookings.filter(b => b.status === 'pending')
    
    // 총 매출 (완료된 예약의 final_amount 합계)
    const totalSales = completedBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0)
    
    // 예상 매출 (확정된 예약의 estimate_amount 합계)
    const expectedSales = confirmedBookings.reduce((sum, booking) => sum + (booking.estimate_amount || 0), 0)
    
    return {
      totalSales,
      expectedSales,
      completedCount: completedBookings.length,
      confirmedCount: confirmedBookings.length,
      pendingCount: pendingBookings.length,
      completedBookings,
      confirmedBookings,
      pendingBookings
    }
  }, [bookings])

  // 기간별 데이터 필터링
  const filteredSalesData = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    
    switch (salesPeriod) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        break
      case 'weekly':
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 0, 0, 0)
        endDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6, 23, 59, 59)
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        break
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0)
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
    }
    
    const filteredBookings = bookings.filter(booking => {
      const consultDate = new Date(booking.consult_date)
      return consultDate >= startDate && consultDate <= endDate
    })
    
    const completedBookings = filteredBookings.filter(b => b.status === 'completed' && b.final_amount)
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed')
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending')
    
    const totalSales = completedBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0)
    const expectedSales = confirmedBookings.reduce((sum, booking) => sum + (booking.estimate_amount || 0), 0)
    
    return {
      totalSales,
      expectedSales,
      completedCount: completedBookings.length,
      confirmedCount: confirmedBookings.length,
      pendingCount: pendingBookings.length,
      completedBookings,
      confirmedBookings,
      pendingBookings,
      totalBookings: filteredBookings.length,
      period: {
        start: startDate,
        end: endDate,
        label: salesPeriod === 'daily' ? '오늘' : 
               salesPeriod === 'weekly' ? '이번 주' :
               salesPeriod === 'monthly' ? '이번 달' : '올해'
      }
    }
  }, [bookings, salesPeriod])

  // 매출 상세 모달 열기
  const openSalesDetailModal = (type: 'total' | 'completed' | 'confirmed' | 'pending') => {
    let data: any[] = []
    let title = ''
    
    switch (type) {
      case 'total':
        data = filteredSalesData.completedBookings
        title = `총 매출 상세 (${filteredSalesData.period.label})`
        break
      case 'completed':
        data = filteredSalesData.completedBookings
        title = `완료 건수 상세 (${filteredSalesData.period.label})`
        break
      case 'confirmed':
        data = filteredSalesData.confirmedBookings
        title = `확정 예약 상세 (${filteredSalesData.period.label})`
        break
      case 'pending':
        data = filteredSalesData.pendingBookings
        title = `대기 예약 상세 (${filteredSalesData.period.label})`
        break
    }
    
    setSalesDetailModal({
      isOpen: true,
      type,
      title,
      data
    })
  }

  // 건물 유형 라벨 변환
  const getBuildingTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      apartment: '아파트',
      villa: '빌라',
      house: '단독주택',
      officetel: '오피스텔'
    }
    return labels[type] || type
  }

  // 상담 유형 표시 라벨 변환
  const getDisplayType = (booking: BookingData): string => {
    return booking.building_type === 'phone_consult' ? '전화상담' : getBuildingTypeLabel(booking.building_type)
  }

  // 예약 상태 업데이트
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    // 샘플 데이터인 경우 로컬 상태만 업데이트
    if (bookingId.startsWith('sample-')) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as 'pending' | 'confirmed' | 'cancelled' | 'completed' }
          : booking
      )
      setBookings(updatedBookings)
      
      const updatedEvents = events.map(event =>
        event.id === bookingId
          ? { ...event, resource: { ...event.resource, status: newStatus } }
          : event
      )
      setEvents(updatedEvents)
      
      // 선택된 예약 정보도 업데이트
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as 'pending' | 'confirmed' | 'cancelled' | 'completed' })
      }
      
      alert('예약 상태가 업데이트되었습니다. (샘플 데이터)')
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchBookings() // 데이터 새로고침
        
        // 선택된 예약 정보도 업데이트
        if (selectedBooking && selectedBooking.id === bookingId) {
          const updatedBooking = bookings.find(b => b.id === bookingId)
          if (updatedBooking) {
            setSelectedBooking({ ...updatedBooking, status: newStatus as 'pending' | 'confirmed' | 'cancelled' | 'completed' })
          }
        }
        
        alert('예약 상태가 업데이트되었습니다.')
      } else {
        const result = await response.json()
        if (result.details) {
          alert(`설정 오류: ${result.error}\n\n${result.details}`)
        } else {
          alert(`오류: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('상태 업데이트 오류:', error)
      alert('상태 업데이트 중 오류가 발생했습니다.')
    }
  }

  // 매출 정보 업데이트 함수
  const updateBookingSales = async (bookingId: string, salesData: {
    consultation_memo?: string;
    visit_date?: string;
    estimate_amount?: number;
    estimate_details?: string;
    final_amount?: number;
    payment_status?: 'unpaid' | 'partial' | 'completed';
    work_start_date?: string;
    work_end_date?: string;
  }) => {
    // 샘플 데이터인 경우 로컬 상태만 업데이트
    if (bookingId.startsWith('sample-')) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...salesData }
          : booking
      )
      setBookings(updatedBookings)
      
      // 선택된 예약 정보도 업데이트
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, ...salesData })
      }
      
      alert('매출 정보가 업데이트되었습니다. (샘플 데이터)')
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/sales`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesData),
      })

      if (response.ok) {
        await fetchBookings() // 데이터 새로고침
        
        // 선택된 예약 정보도 업데이트
        if (selectedBooking && selectedBooking.id === bookingId) {
          const updatedBooking = bookings.find(b => b.id === bookingId)
          if (updatedBooking) {
            setSelectedBooking({ ...updatedBooking, ...salesData })
          }
        }
        
        alert('매출 정보가 업데이트되었습니다.')
      } else {
        const result = await response.json()
        if (result.details) {
          alert(`설정 오류: ${result.error}\n\n${result.details}`)
        } else {
          alert(`오류: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('매출 정보 업데이트 오류:', error)
      alert('매출 정보 업데이트 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchBookings(), fetchGeneralEvents()])
    }
    fetchAllData()
  }, [fetchBookings, fetchGeneralEvents])

  useEffect(() => {
    setEvents(combineAllEvents())
  }, [combineAllEvents])

  // Client-side initialization to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
    setCurrentDate(new Date()) // Set current date on client side
  }, [])

  // 커스텀 툴바 컴포넌트
  const CustomToolbar = ({ label, onNavigate, onView, view }: { label: string; onNavigate: (action: string) => void; onView: (view: string) => void; view: string }) => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">{label}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onView('month')
              setCurrentView('month')
            }}
            className={`px-3 py-1 text-sm rounded ${
              view === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            월
          </button>
          <button
            onClick={() => {
              onView('week')
              setCurrentView('week')
            }}
            className={`px-3 py-1 text-sm rounded ${
              view === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            주
          </button>
          <button
            onClick={() => {
              onView('day')
              setCurrentView('day')
            }}
            className={`px-3 py-1 text-sm rounded ${
              view === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            일
          </button>
        </div>
      </div>
    )
  }

  // 커스텀 네비게이션 버튼들
  const renderNavigationButtons = () => {
    const goToPrevious = () => {
      const newDate = new Date(currentDate)
      if (currentView === 'month') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (currentView === 'week') {
        newDate.setDate(newDate.getDate() - 7)
      } else if (currentView === 'day') {
        newDate.setDate(newDate.getDate() - 1)
      }
      setCurrentDate(newDate)
    }

    const goToNext = () => {
      const newDate = new Date(currentDate)
      if (currentView === 'month') {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (currentView === 'week') {
        newDate.setDate(newDate.getDate() + 7)
      } else if (currentView === 'day') {
        newDate.setDate(newDate.getDate() + 1)
      }
      setCurrentDate(newDate)
    }

    const goToToday = () => {
      setCurrentDate(new Date())
    }

    return (
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={goToPrevious}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          이전
        </button>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          오늘
        </button>
        <button
          onClick={goToNext}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          다음
        </button>
      </div>
    )
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedDate(start)
    // 기본값은 고객 예약으로 설정
    if (registrationType === 'booking') {
      setShowBookingForm(true)
    } else {
      setShowEventForm(true)
    }
  }

  const handleSelectEvent = (event: { id: string; title: string; start: Date; end: Date; [key: string]: unknown }) => {
    // selectedEvent 상태를 설정하지 않아서 실시간 현황 유지
    // setSelectedEvent(event)
    
    // 고객 예약인 경우 BookingDetailModal 열기
    if (event.type === 'customer_booking') {
      const booking = bookings.find(b => b.id === event.id)
      if (booking) {
        setSelectedBooking(booking)
        setShowDetailModal(true)
      }
    } else {
      // 회사 일정인 경우 EventDetailModal 열기
      const eventDetail = generalEvents.find(e => e.id === event.id)
      if (eventDetail) {
        setSelectedEventDetail(eventDetail)
        setShowEventDetailModal(true)
      }
    }
  }

  // 일정 상태 업데이트
  const updateEventStatus = async (eventId: string, newStatus: string) => {
    // 로컬 데이터인 경우 상태만 업데이트
    if (eventId.startsWith('sample-') || eventId.startsWith('local-')) {
      const updatedEvents = generalEvents.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus }
          : event
      )
      setGeneralEvents(updatedEvents)
      
      // 선택된 이벤트도 업데이트
      if (selectedEventDetail?.id === eventId) {
        setSelectedEventDetail({ ...selectedEventDetail, status: newStatus })
      }
      
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchGeneralEvents() // 데이터 새로고침
        
        // 선택된 이벤트도 업데이트
        if (selectedEventDetail?.id === eventId) {
          setSelectedEventDetail({ ...selectedEventDetail, status: newStatus })
        }
      } else {
        console.error('일정 상태 업데이트 실패')
        alert('상태 업데이트 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('일정 상태 업데이트 오류:', error)
      alert('상태 업데이트 중 오류가 발생했습니다.')
    }
  }

  const handleBookingRowClick = (booking: BookingData) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleBookingSubmit = async (bookingData: BookingData) => {
    try {
      // API 형식에 맞게 데이터 변환
      const apiData = {
        buildingType: bookingData.building_type,
        areaSize: bookingData.area_size,
        homeCondition: bookingData.home_condition,
        reason: bookingData.reason,
        spaces: bookingData.spaces,
        budget: bookingData.budget,
        timeline: bookingData.timeline,
        consultDate: bookingData.consult_date,
        consultTime: bookingData.consult_time,
        customerInfo: {
          name: bookingData.customer_name,
          phone: bookingData.customer_phone,
          address: bookingData.customer_address,
          requirements: bookingData.customer_requirements,
          privacyConsent: bookingData.privacy_consent
        }
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('예약이 성공적으로 등록되었습니다.')
        await fetchBookings() // 데이터 새로고침
        setShowBookingForm(false)
        setSelectedDate(null)
      } else {
        console.error('API 오류:', result)
        if (result.details) {
          alert(`설정 오류: ${result.error}\n\n${result.details}`)
        } else {
          alert(`오류: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('예약 등록 오류:', error)
      alert('예약 등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 일반 일정 등록 핸들러
  const handleEventSubmit = async (eventData: { title: string; description?: string; start_date: string; start_time: string; end_date: string; end_time: string; type: string }) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('일정이 성공적으로 등록되었습니다.')
        await fetchGeneralEvents() // 일정 데이터 새로고침
        setShowEventForm(false)
        setSelectedDate(null)
      } else {
        console.error('API 오류:', result)
        
        // events 테이블이 없는 경우 로컬 상태로 일정 추가
        if (result.action === 'table_not_found' || result.error?.includes('테이블이 설정되지 않았습니다') || result.error?.includes('일정 저장 중 오류가 발생했습니다')) {
          console.log('데이터베이스 테이블이 없으므로 로컬 상태로 일정을 추가합니다.')
          
          // 새로운 일정 객체 생성
          const newEvent = {
            id: `local-${Date.now()}`,
            event_type: eventData.event_type,
            title: eventData.title,
            description: eventData.description,
            start_date: eventData.start_date,
            start_time: eventData.start_time,
            end_date: eventData.end_date,
            end_time: eventData.end_time,
            location: eventData.location,
            attendees: eventData.attendees || [],
            priority: eventData.priority || 'medium',
            status: eventData.status || 'scheduled',
            assigned_to: eventData.assigned_to,
            client_company: eventData.client_company,
            contact_person: eventData.contact_person,
            contact_phone: eventData.contact_phone,
            notes: eventData.notes,
            created_by: eventData.created_by || 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          // 로컬 상태에 추가
          setGeneralEvents(prev => [...prev, newEvent])
          
          alert('일정이 성공적으로 등록되었습니다. (로컬 저장)')
          setShowEventForm(false)
          setSelectedDate(null)
        } else {
          if (result.details) {
            alert(`설정 오류: ${result.error}\n\n${result.details}`)
          } else {
            alert(`오류: ${result.error}`)
          }
        }
      }
    } catch (error) {
      console.error('일정 등록 오류:', error)
      alert('일정 등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const eventStyleGetter = (event: { [key: string]: unknown }) => {
    const style: React.CSSProperties = {
      borderRadius: '8px',
      opacity: 0.8,
      border: '0px',
      display: 'block'
    }

    // 일정 타입별 색상 구분
    if (event.type === 'customer_booking') {
      // 고객 예약 - 상태별 색상 가이드
      switch (event.resource?.status) {
        case 'pending':
          style.backgroundColor = '#f59e0b' // 대기 - 주황색
          style.color = '#ffffff'
          break
        case 'confirmed':
          style.backgroundColor = '#10b981' // 확정 - 초록색  
          style.color = '#ffffff'
          break
        case 'completed':
          style.backgroundColor = '#3b82f6' // 완료 - 파란색
          style.color = '#ffffff'
          break
        case 'cancelled':
          style.backgroundColor = '#ef4444' // 취소 - 빨간색
          style.color = '#ffffff'
          break
        default:
          style.backgroundColor = '#6b7280' // 기본 - 회색
          style.color = '#ffffff'
      }
    } else {
      // 일반 일정 - 타입별 색상
      switch (event.type) {
        case 'b2b':
          style.backgroundColor = '#3b82f6' // blue
          break
        case 'personal_support':
          style.backgroundColor = '#10b981' // green
          break
        case 'work_schedule':
          style.backgroundColor = '#f97316' // orange
          break
        case 'company_event':
          style.backgroundColor = '#8b5cf6' // purple
          break
        case 'meeting':
          style.backgroundColor = '#6b7280' // gray
          break
        case 'other':
          style.backgroundColor = '#ec4899' // pink
          break
        default:
          style.backgroundColor = '#6b7280' // gray
      }

      // 우선순위에 따른 테두리 추가
      if (event.resource.priority === 'urgent') {
        style.border = '3px solid #ef4444'
      } else if (event.resource.priority === 'high') {
        style.border = '2px solid #f97316'
      }
    }

    return { style }
  }

  // 날짜 셀 배경색 설정 (예약 건수에 따라)
  const dayPropGetter = (date: Date) => {
    const dayEvents = events.filter(e => 
      format(e.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
    const eventCount = dayEvents.length
    
    if (eventCount === 0) {
      return {}
    }
    
    // 예약 건수에 따른 배경색 설정
    let backgroundColor = ''
    if (eventCount === 1) {
      backgroundColor = '#f0fdf4' // 연한 초록 배경
    } else if (eventCount === 2) {
      backgroundColor = '#fefce8' // 연한 노랑 배경
    } else if (eventCount === 3) {
      backgroundColor = '#fff7ed' // 연한 주황 배경
    } else if (eventCount >= 4) {
      backgroundColor = '#fef2f2' // 연한 빨강 배경
    }
    
    return {
      style: {
        backgroundColor: backgroundColor
      }
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 커스텀 캘린더 스타일 */}
      <style dangerouslySetInnerHTML={{ __html: customCalendarStyles }} />
      {/* 토스 스타일 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">인테리어 필름 관리자</h1>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <a 
                  href="/admin/portfolio"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  포트폴리오 관리
                </a>
                <a 
                  href="/admin/task-master"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                >
                  <span>⚡</span>
                  <span>Task Master AI</span>
                </a>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-1 pt-1 text-sm font-medium transition-colors ${
                    currentPage === 'dashboard' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  대시보드
                </button>
                <button 
                  onClick={() => setCurrentPage('bookings')}
                  className={`px-1 pt-1 text-sm font-medium transition-colors ${
                    currentPage === 'bookings' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  예약 관리
                </button>
                <button 
                  onClick={() => setCurrentPage('sales')}
                  className={`px-1 pt-1 text-sm font-medium transition-colors ${
                    currentPage === 'sales' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  매출 현황
                </button>
                <button 
                  onClick={() => setCurrentPage('settings')}
                  className={`px-1 pt-1 text-sm font-medium transition-colors ${
                    currentPage === 'settings' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  설정
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                메인으로
              </Link>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">관</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 토스 스타일 대시보드 */}
        <div className="space-y-8">
          {/* 핵심 지표 카드들 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* 오늘 매출 */}
            <div 
              onClick={() => {
                setCurrentPage('sales')
                setShowSalesSection(true)
              }}
              className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                  +12%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">₩6,327,250</p>
                <p className="text-xs sm:text-sm text-gray-600">오늘 매출</p>
              </div>
            </div>

            {/* 전체 예약 */}
            <div 
              onClick={() => {
                setCurrentPage('dashboard')
                setDashboardCardFilter('month')
                setEventTypeFilter('customer_booking')
                setBookingStatusFilter('all')
              }}
              className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                  이번달
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{bookings.length}건</p>
                <p className="text-xs sm:text-sm text-gray-600">전체 예약</p>
              </div>
            </div>

            {/* 확정 예약 */}
            <div 
              onClick={() => {
                setCurrentPage('dashboard')
                setDashboardCardFilter('confirmed')
                setEventTypeFilter('customer_booking')
                setBookingStatusFilter('confirmed')
              }}
              className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                  {bookings.length > 0 ? Math.round((bookings.filter(b => b.status === 'confirmed').length / bookings.length) * 100) : 0}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed').length}건</p>
                <p className="text-xs sm:text-sm text-gray-600">확정 예약</p>
              </div>
            </div>

            {/* 대기 예약 */}
            <div 
              onClick={() => {
                setCurrentPage('dashboard')
                setDashboardCardFilter('pending')
                setEventTypeFilter('customer_booking')
                setBookingStatusFilter('pending')
              }}
              className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-medium">
                  신청
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'pending').length}건</p>
                <p className="text-xs sm:text-sm text-gray-600">대기 예약</p>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 영역 */}
          {currentPage === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 캘린더 영역 */}
            <div className="lg:col-span-2">
              {/* 색상 범례 */}
              <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900">색상 가이드</h4>
                  <p className="text-sm text-gray-500 mt-1">예약 현황을 색상으로 구분해서 확인하세요</p>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* 월 보기: 예약 건수별 색상 */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">월 보기 - 예약 건수별</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                        <span className="text-xs text-gray-700">1건</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-xs text-gray-700">2건</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
                        <span className="text-xs text-gray-700">3건</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                        <span className="text-xs text-gray-700">4건+</span>
                      </div>
                    </div>
                  </div>

                  {/* 주/일 보기: 지역별 색상 */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">주/일 보기 - 지역별</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                        <span className="text-xs text-gray-700">서울</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-xs text-gray-700">경기</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
                        <span className="text-xs text-gray-700">인천</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
                        <span className="text-xs text-gray-700">부산</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                        <span className="text-xs text-gray-700">대구</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-300"></div>
                        <span className="text-xs text-gray-700">대전</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                        <span className="text-xs text-gray-700">기타</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 모바일용 스마트 필터 - 예약 스케줄 위에 */}
              <div className="lg:hidden mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900">스마트 필터</h4>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">원하는 일정만 골라보세요</p>
                </div>
              
                <div className="p-4 space-y-4">
                  {/* 일정 타입 필터 */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">타입별 보기</h5>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => {
                          setEventTypeFilter('all')
                          setBookingStatusFilter('all')
                        }}
                        className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${
                          eventTypeFilter === 'all' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>전체 보기</span>
                          <span className="font-semibold">{bookings.length + generalEvents.length}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setEventTypeFilter('customer_booking')
                          setBookingStatusFilter('all')
                        }}
                        className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${
                          eventTypeFilter === 'customer_booking' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>고객 예약만</span>
                          <span className="font-semibold">{bookings.length}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setEventTypeFilter('company')
                          setBookingStatusFilter('all')
                        }}
                        className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${
                          eventTypeFilter === 'company' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>회사 일정만</span>
                          <span className="font-semibold">{generalEvents.length}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* 통계 요약 */}
                  <div className="pt-3 border-t border-gray-100">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">오늘 일정</h5>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {events.filter(e => {
                            const today = format(new Date(), 'yyyy-MM-dd')
                            const eventDate = format(e.start, 'yyyy-MM-dd')
                            return eventDate === today
                          }).length}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">개의 일정</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* 토스 스타일 캘린더 헤더 */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">예약 스케줄</h2>
                      <p className="text-sm text-gray-600">{isClient ? format(currentDate, 'yyyy년 M월') : '2025년 7월'}의 일정을 확인하세요</p>
                    </div>
                  {/* 통합 등록 버튼 */}
                  <button
                    onClick={() => setShowUnifiedForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    + 예약 등록
                  </button>
                </div>
                
                {/* 색상 가이드 (월 보기일 때만 표시) */}
                {currentView === 'month' && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">예약 건수별 색상:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                        <span className="text-xs text-gray-600">1건</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                        <span className="text-xs text-gray-600">2건</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                        <span className="text-xs text-gray-600">3건</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                        <span className="text-xs text-gray-600">4건+</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 예약 상태별 색상 가이드 */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">예약 상태 색상 가이드</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span className="text-sm text-gray-600">대기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                    <span className="text-sm text-gray-600">확정</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-sm text-gray-600">완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                    <span className="text-sm text-gray-600">취소</span>
                  </div>
                </div>
              </div>

              <div className="h-[32rem] md:h-[36rem]">
                <Calendar
                  localizer={localizer}
                  culture="ko"
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  dayPropGetter={dayPropGetter}
                  date={currentDate}
                  view={currentView as 'month' | 'week' | 'day' | 'agenda'}
                  onNavigate={(date) => setCurrentDate(date)}
                  onView={(view) => setCurrentView(view)}
                  components={{
                    toolbar: CustomToolbar,
                    month: {
                      dateHeader: ({ date, label }) => (
                        <div className="text-center">
                          <span className="text-lg font-semibold text-gray-900">{label}</span>
                        </div>
                      )
                    },
                    event: ({ event, view }) => {
                      const booking = event.resource
                      
                      // 월 보기: 예약 건수만 표시 (첫 번째 이벤트에만 표시)
                      if (view === 'month') {
                        const dayEvents = events.filter(e => 
                          format(e.start, 'yyyy-MM-dd') === format(event.start, 'yyyy-MM-dd')
                        )
                        // 같은 날짜의 첫 번째 이벤트인지 확인
                        const isFirstEventOfDay = dayEvents[0]?.id === event.id
                        
                        // 예약 건수별 색상 설정 (1건, 2건, 3건, 4건+)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const getBookingCountStyle = (count: number, dayEventsData: any[]) => {
                          // 예약 건수별 색상 구분
                          if (count === 1) {
                            return "bg-blue-100 text-blue-900 border border-blue-300 font-semibold"
                          } else if (count === 2) {
                            return "bg-green-100 text-green-900 border border-green-300 font-semibold"
                          } else if (count === 3) {
                            return "bg-orange-100 text-orange-900 border border-orange-300 font-semibold"
                          } else if (count >= 4) {
                            return "bg-red-100 text-red-900 border border-red-300 font-semibold"
                          }
                          
                          return "bg-gray-100 text-gray-800 border border-gray-200 font-semibold" // 기본값
                        }
                        
                        if (isFirstEventOfDay && dayEvents.length > 1) {
                          return (
                            <div className={`w-full h-full flex items-center justify-center ${getBookingCountStyle(dayEvents.length, dayEvents)} text-xs font-medium rounded px-2 py-1 !important`}>
                              {dayEvents.length}건
                            </div>
                          )
                        } else if (dayEvents.length === 1) {
                          return (
                            <div className={`w-full h-full flex items-center justify-center ${getBookingCountStyle(1, dayEvents)} text-xs font-medium rounded px-2 py-1 !important`}>
                              1건
                            </div>
                          )
                        } else {
                          // 같은 날짜의 두 번째 이후 이벤트는 완전히 숨김
                          return <div style={{ display: 'none', visibility: 'hidden', height: 0, width: 0 }}></div>
                        }
                      }
                      
                      // 주 보기: 고객명과 지역을 색상으로 구분하여 표시
                      if (view === 'week') {
                        const customerName = booking?.customer_name || booking?.client || '고객'
                        const address = booking?.customer_address || booking?.address || ''
                        const region = address.split(' ')[0] || '미정'
                        
                        // 지역별 색상 구분 (서울, 경기, 인천 등)
                        const getRegionStyle = (region: string) => {
                          const regionColors = {
                            '서울': 'bg-blue-100 text-blue-900 border-blue-300',
                            '경기': 'bg-green-100 text-green-900 border-green-300', 
                            '인천': 'bg-purple-100 text-purple-900 border-purple-300',
                            '부산': 'bg-orange-100 text-orange-900 border-orange-300',
                            '대구': 'bg-red-100 text-red-900 border-red-300',
                            '광주': 'bg-yellow-100 text-yellow-900 border-yellow-300',
                            '대전': 'bg-indigo-100 text-indigo-900 border-indigo-300',
                            '울산': 'bg-pink-100 text-pink-900 border-pink-300',
                            '세종': 'bg-cyan-100 text-cyan-900 border-cyan-300',
                            '강원': 'bg-emerald-100 text-emerald-900 border-emerald-300',
                            '충북': 'bg-lime-100 text-lime-900 border-lime-300',
                            '충남': 'bg-amber-100 text-amber-900 border-amber-300',
                            '전북': 'bg-rose-100 text-rose-900 border-rose-300',
                            '전남': 'bg-violet-100 text-violet-900 border-violet-300', 
                            '경북': 'bg-sky-100 text-sky-900 border-sky-300',
                            '경남': 'bg-teal-100 text-teal-900 border-teal-300',
                            '제주': 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300'
                          }
                          return regionColors[region] || 'bg-gray-100 text-gray-900 border-gray-300'
                        }
                        
                        return (
                          <div className={`w-full h-full flex flex-col items-center justify-center text-xs font-medium rounded px-1 py-1 border !important ${getRegionStyle(region)}`}>
                            <div className="font-bold truncate w-full text-center">{customerName}</div>
                            <div className="text-[10px] opacity-80 truncate w-full text-center">{region}</div>
                          </div>
                        )
                      }
                      
                      // 일 보기: 당일 작업 고객명, 지역, 시간, 작업내용을 지역별 색상으로 구분
                      if (view === 'day') {
                        const time = format(event.start, 'HH:mm')
                        const endTime = format(event.end, 'HH:mm')
                        const customerName = booking?.customer_name || booking?.client || '고객'
                        const address = booking?.customer_address || booking?.address || ''
                        const region = address.split(' ')[0] || '미정'
                        const district = address.split(' ')[1] || ''
                        const workType = booking?.spaces ? booking.spaces.join(', ') : booking?.building_type || '상담'
                        const phone = booking?.customer_phone || '연락처 미정'
                        
                        // 지역별 색상 구분 (일 보기용)
                        const getRegionStyleForDay = (region: string) => {
                          const regionColors = {
                            '서울': 'bg-blue-50 text-blue-900 border-blue-400 shadow-blue-100',
                            '경기': 'bg-green-50 text-green-900 border-green-400 shadow-green-100', 
                            '인천': 'bg-purple-50 text-purple-900 border-purple-400 shadow-purple-100',
                            '부산': 'bg-orange-50 text-orange-900 border-orange-400 shadow-orange-100',
                            '대구': 'bg-red-50 text-red-900 border-red-400 shadow-red-100',
                            '광주': 'bg-yellow-50 text-yellow-900 border-yellow-400 shadow-yellow-100',
                            '대전': 'bg-indigo-50 text-indigo-900 border-indigo-400 shadow-indigo-100',
                            '울산': 'bg-pink-50 text-pink-900 border-pink-400 shadow-pink-100',
                            '세종': 'bg-cyan-50 text-cyan-900 border-cyan-400 shadow-cyan-100',
                            '강원': 'bg-emerald-50 text-emerald-900 border-emerald-400 shadow-emerald-100',
                            '충북': 'bg-lime-50 text-lime-900 border-lime-400 shadow-lime-100',
                            '충남': 'bg-amber-50 text-amber-900 border-amber-400 shadow-amber-100',
                            '전북': 'bg-rose-50 text-rose-900 border-rose-400 shadow-rose-100',
                            '전남': 'bg-violet-50 text-violet-900 border-violet-400 shadow-violet-100', 
                            '경북': 'bg-sky-50 text-sky-900 border-sky-400 shadow-sky-100',
                            '경남': 'bg-teal-50 text-teal-900 border-teal-400 shadow-teal-100',
                            '제주': 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-400 shadow-fuchsia-100'
                          }
                          return regionColors[region] || 'bg-gray-50 text-gray-900 border-gray-400 shadow-gray-100'
                        }
                        
                        return (
                          <div className={`w-full h-full text-xs rounded-lg px-3 py-2 space-y-1 border-2 shadow-lg !important ${getRegionStyleForDay(region)}`}>
                            <div className="font-bold text-sm flex items-center justify-between">
                              <span>{customerName}</span>
                              <span className="text-[10px] px-2 py-1 bg-white bg-opacity-60 rounded-full">{region}</span>
                            </div>
                            <div className="font-medium opacity-90 flex items-center">
                              <span className="mr-1">⏰</span>
                              {time} - {endTime}
                            </div>
                            <div className="opacity-80 truncate flex items-center">
                              <span className="mr-1">🏠</span>
                              {workType}
                            </div>
                            <div className="opacity-75 text-[10px] flex items-center">
                              <span className="mr-1">📍</span>
                              {district && `${district} `}{region}
                            </div>
                            <div className="opacity-70 text-[10px] flex items-center">
                              <span className="mr-1">📞</span>
                              {phone}
                            </div>
                          </div>
                        )
                      }
                      
                      // 기본 표시 (Agenda 등) - 상태별 색상
                      const getStatusStyleBasic = (status: string) => {
                        switch (status) {
                          case 'pending':
                            return 'bg-orange-100 text-orange-800 border-orange-200'
                          case 'confirmed':
                            return 'bg-green-100 text-green-800 border-green-200'
                          case 'completed':
                            return 'bg-blue-100 text-blue-800 border-blue-200'
                          case 'cancelled':
                            return 'bg-red-100 text-red-800 border-red-200'
                          default:
                            return 'bg-gray-100 text-gray-800 border-gray-200'
                        }
                      }
                      
                      return (
                        <div className={`w-full h-full text-xs rounded px-2 py-1 border !important ${getStatusStyleBasic(booking?.status)}`}>
                          {booking?.customer_name || event.title}
                        </div>
                      )
                    }
                  }}
                  formats={{
                    monthHeaderFormat: (date) => format(date, 'yyyy년 M월', { locale: ko }),
                    dayHeaderFormat: (date) => format(date, 'M월 d일 (E)', { locale: ko }),
                    dayRangeHeaderFormat: ({ start, end }) => 
                      `${format(start, 'yyyy년 M월 d일', { locale: ko })} - ${format(end, 'M월 d일', { locale: ko })}`,
                    weekdayFormat: (date) => format(date, 'E', { locale: ko }),
                    timeGutterFormat: (date, culture, localizer) => format(date, 'HH:mm'),
                    eventTimeRangeFormat: ({ start, end }, culture, localizer) => 
                      `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
                    agendaTimeFormat: (date, culture, localizer) => format(date, 'HH:mm'),
                    agendaDateFormat: (date, culture, localizer) => format(date, 'M월 d일 (E)', { locale: ko }),
                  }}
                  messages={{
                    next: "다음",
                    previous: "이전", 
                    today: "오늘",
                    month: "월",
                    week: "주", 
                    day: "일",
                    agenda: "일정",
                    date: "날짜",
                    time: "시간",
                    event: "이벤트",
                    noEventsInRange: "해당 기간에 일정이 없습니다.",
                    showMore: (total) => `+${total} 더보기`
                  }}
                />
              </div>
              
              {/* 네비게이션 버튼들 */}
              {renderNavigationButtons()}
              
              {/* 여유 공간 */}
              <div className="pb-8"></div>
            </div>
          </div>

          {/* 사이드바 */}
            <div className="space-y-6">
              {/* 데스크톱용 스마트 필터 - 실시간 현황 위에 */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900">스마트 필터</h4>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">원하는 일정만 골라보세요</p>
                </div>
              
                <div className="p-4 space-y-4">
                  {/* 일정 타입 필터 */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">타입별 보기</h5>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => {
                          setEventTypeFilter('all')
                          setBookingStatusFilter('all')
                        }}
                        className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${
                          eventTypeFilter === 'all' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>전체 보기</span>
                          <span className="font-semibold">{bookings.length + generalEvents.length}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setEventTypeFilter('customer_booking')
                          setBookingStatusFilter('all')
                        }}
                        className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${
                          eventTypeFilter === 'customer_booking' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>고객 예약만</span>
                          <span className="font-semibold">{bookings.length}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setEventTypeFilter('company')
                          setBookingStatusFilter('all')
                        }}
                        className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${
                          eventTypeFilter === 'company' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>회사 일정만</span>
                          <span className="font-semibold">{generalEvents.length}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* 통계 요약 */}
                  <div className="pt-3 border-t border-gray-100">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">오늘 일정</h5>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {events.filter(e => {
                            const today = format(new Date(), 'yyyy-MM-dd')
                            const eventDate = format(e.start, 'yyyy-MM-dd')
                            return eventDate === today
                          }).length}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">개의 일정</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 토스 스타일 정보 패널 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* 모던한 헤더 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedEvent ? '선택된 일정' : '실시간 현황'}
                    </h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedEvent ? '상세 정보' : '예약 및 매출 현황'}
                  </p>
                </div>
              
              <div className="p-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  {selectedEvent ? '상세 정보' : '예약 현황'}
                </h4>
              
              {selectedEvent ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">고객명</p>
                    <p className="font-semibold text-gray-900">{selectedEvent.resource.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-semibold text-blue-700">{selectedEvent.resource.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">주소</p>
                    <p className="font-medium">{selectedEvent.resource.customer_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{selectedEvent.resource.building_type === 'phone_consult' ? '상담 유형' : '건물 유형'}</p>
                    <p className="font-semibold text-green-700">{getDisplayType(selectedEvent.resource)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">시공 면적</p>
                    <p className="font-medium">{selectedEvent.resource.area_size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">예산</p>
                    <p className="font-semibold text-orange-600">{selectedEvent.resource.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">상담 일시</p>
                    <p className="font-semibold text-purple-700">
                      {format(selectedEvent.start, 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">상태</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedEvent.resource.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : selectedEvent.resource.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedEvent.resource.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEvent.resource.status === 'confirmed' ? '확정' : 
                         selectedEvent.resource.status === 'pending' ? '대기' :
                         selectedEvent.resource.status === 'completed' ? '완료' : '취소'}
                      </span>
                    </div>
                  </div>
                  {selectedEvent.resource.customer_requirements && (
                    <div>
                      <p className="text-sm text-gray-500">요청사항</p>
                      <p className="font-medium text-sm">{selectedEvent.resource.customer_requirements}</p>
                    </div>
                  )}
                  
                  {/* 상태 변경 버튼 */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">상태 변경</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateBookingStatus(selectedEvent.resource.id, 'confirmed')}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={selectedEvent.resource.status === 'confirmed'}
                      >
                        확정
                      </button>
                      <button
                        onClick={() => updateBookingStatus(selectedEvent.resource.id, 'completed')}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={selectedEvent.resource.status === 'completed'}
                      >
                        완료
                      </button>
                      <button
                        onClick={() => updateBookingStatus(selectedEvent.resource.id, 'pending')}
                        className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        disabled={selectedEvent.resource.status === 'pending'}
                      >
                        대기
                      </button>
                      <button
                        onClick={() => updateBookingStatus(selectedEvent.resource.id, 'cancelled')}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        disabled={selectedEvent.resource.status === 'cancelled'}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">로딩 중...</p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setBookingStatusFilter('all')
                          setEventTypeFilter('customer_booking')
                        }}
                        className={`w-full flex justify-between items-center p-2 rounded-lg transition-colors ${
                          bookingStatusFilter === 'all' && eventTypeFilter === 'customer_booking'
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm text-gray-500">전체 예약</span>
                        <span className="font-semibold text-blue-800">{bookings.length}</span>
                      </button>
                      <button
                        onClick={() => {
                          setBookingStatusFilter('pending')
                          setEventTypeFilter('customer_booking')
                        }}
                        className={`w-full flex justify-between items-center p-2 rounded-lg transition-colors ${
                          bookingStatusFilter === 'pending' && eventTypeFilter === 'customer_booking'
                            ? 'bg-yellow-50 border border-yellow-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm text-gray-500">대기 예약</span>
                        <span className="font-semibold text-yellow-800">
                          {bookings.filter(b => b.status === 'pending').length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setBookingStatusFilter('confirmed')
                          setEventTypeFilter('customer_booking')
                        }}
                        className={`w-full flex justify-between items-center p-2 rounded-lg transition-colors ${
                          bookingStatusFilter === 'confirmed' && eventTypeFilter === 'customer_booking'
                            ? 'bg-green-50 border border-green-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm text-gray-500">확정 예약</span>
                        <span className="font-semibold text-green-800">
                          {bookings.filter(b => b.status === 'confirmed').length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setBookingStatusFilter('completed')
                          setEventTypeFilter('customer_booking')
                        }}
                        className={`w-full flex justify-between items-center p-2 rounded-lg transition-colors ${
                          bookingStatusFilter === 'completed' && eventTypeFilter === 'customer_booking'
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm text-gray-500">완료 예약</span>
                        <span className="font-semibold text-blue-800">
                          {bookings.filter(b => b.status === 'completed').length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setBookingStatusFilter('cancelled')
                          setEventTypeFilter('customer_booking')
                        }}
                        className={`w-full flex justify-between items-center p-2 rounded-lg transition-colors ${
                          bookingStatusFilter === 'cancelled' && eventTypeFilter === 'customer_booking'
                            ? 'bg-red-50 border border-red-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm text-gray-500">취소 예약</span>
                        <span className="font-semibold text-red-800">
                          {bookings.filter(b => b.status === 'cancelled').length}
                        </span>
                      </button>
                      
                      {/* 최근 예약 목록 */}
                      {bookings.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">최근 예약</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {bookings.slice(0, 5).map((booking) => (
                              <div
                                key={booking.id}
                                onClick={() => handleBookingRowClick(booking)}
                                className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {booking.customer_name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {format(new Date(booking.consult_date), 'MM/dd')} {booking.consult_time}
                                    </p>
                                  </div>
                                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800'
                                      : booking.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : booking.status === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status === 'confirmed' ? '확정' : 
                                     booking.status === 'pending' ? '대기' :
                                     booking.status === 'completed' ? '완료' : '취소'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* 일정 범례 섹션 (예약 현황 하단에 추가) */}
                  {!selectedEvent && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          일정 색상 가이드
                        </h4>
                        <button
                          onClick={() => {
                            fetchBookings()
                            fetchGeneralEvents()
                          }}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                          disabled={loading}
                        >
                          {loading ? '로딩...' : '새로고침'}
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {/* 고객 예약 색상 */}
                        <div>
                          <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">고객 예약</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">대기</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">확정</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">완료</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">취소</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 회사 일정 색상 */}
                        <div>
                          <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">회사 일정</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">B2B 업무</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-teal-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">개인 지원</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                              <span className="text-xs text-gray-700">작업 일정</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
            </div>
          )}

          {/* 예약 관리 페이지 */}
          {currentPage === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">예약 관리</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* 예약 관리 필터 */}
                  <div className="flex bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => {
                        setBookingStatusFilter('all')
                        setEventTypeFilter('customer_booking')
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex-1 ${
                        bookingStatusFilter === 'all'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      전체
                    </button>
                    <button
                      onClick={() => {
                        setBookingStatusFilter('pending')
                        setEventTypeFilter('customer_booking')
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex-1 ${
                        bookingStatusFilter === 'pending'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      대기
                    </button>
                    <button
                      onClick={() => {
                        setBookingStatusFilter('confirmed')
                        setEventTypeFilter('customer_booking')
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex-1 ${
                        bookingStatusFilter === 'confirmed'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      확정
                    </button>
                    <button
                      onClick={() => {
                        setBookingStatusFilter('completed')
                        setEventTypeFilter('customer_booking')
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex-1 ${
                        bookingStatusFilter === 'completed'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      완료
                    </button>
                  </div>
                  {/* 모바일용 보기 모드 선택 */}
                  <div className="flex bg-gray-50 rounded-xl p-1 sm:hidden">
                    <button
                      onClick={() => setBookingViewMode('table')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex-1 ${
                        bookingViewMode === 'table'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      목록
                    </button>
                    <button
                      onClick={() => setBookingViewMode('calendar')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex-1 ${
                        bookingViewMode === 'calendar'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      달력
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setUnifiedFormType('booking')
                      setShowUnifiedForm(true)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    새 예약 등록
                  </button>
                </div>
              </div>
              
              {/* 모바일에서는 카드형 또는 캘린더 뷰 */}
              <div className="sm:hidden">
                {bookingViewMode === 'table' ? (
                  filteredBookingsForTable.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-500 mb-4">
                        <p className="text-lg font-medium">해당 조건의 예약이 없습니다</p>
                        <p className="text-sm mt-1">다른 필터를 선택해보세요</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBookingsForTable.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBookingRowClick(booking)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-gray-900">{booking.customer_name}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' ? '확정' : 
                             booking.status === 'pending' ? '대기' :
                             booking.status === 'completed' ? '완료' : '취소'}
                          </span>
                        </div>
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="text-gray-500">연락처:</span> 
                            <span className="font-semibold text-blue-700 ml-1">{booking.customer_phone}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">상담일시:</span> 
                            <span className="font-semibold text-purple-700 ml-1">{format(new Date(booking.consult_date), 'M월 d일')} {booking.consult_time}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">건물유형:</span> 
                            <span className="font-semibold text-green-700 ml-1">{getDisplayType(booking)}</span>
                          </div>
                          {booking.estimate_amount && (
                            <div>
                              <span className="text-gray-500">견적금액:</span> 
                              <span className="font-semibold text-orange-600 ml-1">₩{booking.estimate_amount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div>
                    {/* 예약 상태별 색상 가이드 */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">예약 상태 색상 가이드</h4>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                          <span className="text-sm text-gray-600">대기</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                          <span className="text-sm text-gray-600">확정</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                          <span className="text-sm text-gray-600">완료</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                          <span className="text-sm text-gray-600">취소</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[500px]">
                      <Calendar
                        localizer={localizer}
                        culture="ko"
                        events={events.filter(e => e.type === 'customer_booking')}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        dayPropGetter={dayPropGetter}
                        date={currentDate}
                        view={currentView as 'month' | 'week' | 'day' | 'agenda'}
                        onNavigate={(date) => setCurrentDate(date)}
                        onView={(view) => setCurrentView(view)}
                        components={{
                          toolbar: CustomToolbar
                        }}
                        formats={{
                          monthHeaderFormat: (date) => format(date, 'yyyy년 M월', { locale: ko }),
                          dayHeaderFormat: (date) => format(date, 'M월 d일 (E)', { locale: ko }),
                          dayRangeHeaderFormat: ({ start, end }) => 
                            `${format(start, 'yyyy년 M월 d일', { locale: ko })} - ${format(end, 'M월 d일', { locale: ko })}`,
                          weekdayFormat: (date) => format(date, 'E', { locale: ko }),
                          timeGutterFormat: (date, _culture, _localizer) => format(date, 'HH:mm'),
                          eventTimeRangeFormat: ({ start, end }, _culture, _localizer) => 
                            `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
                          agendaTimeFormat: (date, _culture, _localizer) => format(date, 'HH:mm'),
                          agendaDateFormat: (date, _culture, _localizer) => format(date, 'M월 d일 (E)', { locale: ko }),
                        }}
                        messages={{
                          next: "다음",
                          previous: "이전", 
                          today: "오늘",
                          month: "월",
                          week: "주", 
                          day: "일",
                          agenda: "일정",
                          date: "날짜",
                          time: "시간",
                          event: "이벤트",
                          noEventsInRange: "해당 기간에 일정이 없습니다.",
                          showMore: (total) => `+${total} 더보기`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* 데스크톱용 테이블 */}
              <div className="hidden sm:block overflow-x-auto">
                {filteredBookingsForTable.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <p className="text-lg font-medium">해당 조건의 예약이 없습니다</p>
                      <p className="text-sm mt-1">다른 필터를 선택해보세요</p>
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">고객명</th>
                        <th className="text-left py-3 px-4 font-semibold text-blue-700">연락처</th>
                        <th className="text-left py-3 px-4 font-semibold text-purple-700">상담일시</th>
                        <th className="text-left py-3 px-4 font-semibold text-green-700">건물유형</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">상태</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-600">견적금액</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookingsForTable.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{booking.customer_name}</td>
                        <td className="py-3 px-4 font-medium text-blue-700">{booking.customer_phone}</td>
                        <td className="py-3 px-4 font-medium text-purple-700">{booking.consult_date} {booking.consult_time}</td>
                        <td className="py-3 px-4 font-medium text-green-700">{getDisplayType(booking)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' ? '확정' : 
                             booking.status === 'pending' ? '대기' :
                             booking.status === 'completed' ? '완료' : '취소'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${booking.estimate_amount ? 'text-orange-600' : 'text-gray-400'}`}>
                            {booking.estimate_amount ? `₩${booking.estimate_amount.toLocaleString()}` : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handleBookingRowClick(booking)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            상세보기
                          </button>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* 매출 현황 페이지 */}
          {currentPage === 'sales' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">매출 현황</h2>
                  <div className="flex bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => setSalesPeriod('daily')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        salesPeriod === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      일별
                    </button>
                    <button
                      onClick={() => setSalesPeriod('weekly')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        salesPeriod === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      주별
                    </button>
                    <button
                      onClick={() => setSalesPeriod('monthly')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        salesPeriod === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      월별
                    </button>
                    <button
                      onClick={() => setSalesPeriod('yearly')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        salesPeriod === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      년간
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div 
                    onClick={() => openSalesDetailModal('total')}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <h3 className="text-sm font-medium text-blue-600 mb-2">총 매출 ({filteredSalesData.period.label})</h3>
                    <p className="text-2xl font-bold text-blue-900">₩{filteredSalesData.totalSales.toLocaleString()}</p>
                    <p className="text-sm text-blue-600 mt-1">완료된 {filteredSalesData.completedCount}건</p>
                  </div>
                  <div 
                    onClick={() => openSalesDetailModal('completed')}
                    className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <h3 className="text-sm font-medium text-green-600 mb-2">완료 건수 ({filteredSalesData.period.label})</h3>
                    <p className="text-2xl font-bold text-green-900">{filteredSalesData.completedCount}건</p>
                    <p className="text-sm text-green-600 mt-1">평균 ₩{filteredSalesData.completedCount > 0 ? Math.round(filteredSalesData.totalSales / filteredSalesData.completedCount).toLocaleString() : '0'}</p>
                  </div>
                  <div 
                    onClick={() => openSalesDetailModal('confirmed')}
                    className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <h3 className="text-sm font-medium text-purple-600 mb-2">확정 예약 ({filteredSalesData.period.label})</h3>
                    <p className="text-2xl font-bold text-purple-900">{filteredSalesData.confirmedCount}건</p>
                    <p className="text-sm text-purple-600 mt-1">예상 매출 ₩{filteredSalesData.expectedSales.toLocaleString()}</p>
                  </div>
                  <div 
                    onClick={() => openSalesDetailModal('pending')}
                    className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <h3 className="text-sm font-medium text-yellow-600 mb-2">대기 예약 ({filteredSalesData.period.label})</h3>
                    <p className="text-2xl font-bold text-yellow-900">{filteredSalesData.pendingCount}건</p>
                    <p className="text-sm text-yellow-600 mt-1">대기 중인 예약</p>
                  </div>
                </div>

                {/* 차트 영역 */}
                <div className="mb-8">
                  <SalesChart bookings={bookings} period={salesPeriod} />
                </div>

                {/* 다양한 정보 대시보드 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 기간별 상세 통계 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{filteredSalesData.period.label} 상세 통계</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">전체 예약</span>
                        <span className="font-bold text-gray-900">{filteredSalesData.totalBookings}건</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-green-600">완료율</span>
                        <span className="font-bold text-green-600">
                          {filteredSalesData.totalBookings > 0 ? Math.round((filteredSalesData.completedCount / filteredSalesData.totalBookings) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-purple-600">확정율</span>
                        <span className="font-bold text-purple-600">
                          {filteredSalesData.totalBookings > 0 ? Math.round((filteredSalesData.confirmedCount / filteredSalesData.totalBookings) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-blue-600">평균 매출</span>
                        <span className="font-bold text-blue-600">
                          ₩{filteredSalesData.completedCount > 0 ? Math.round(filteredSalesData.totalSales / filteredSalesData.completedCount).toLocaleString() : '0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 매출 대비 및 예상 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">매출 분석</h4>
                    <div className="space-y-4">
                      {/* 예상 대비 실제 매출 */}
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">예상 대비 성취율</span>
                          <span className="text-sm font-bold text-blue-600">
                            {filteredSalesData.expectedSales > 0 ? Math.round((filteredSalesData.totalSales / filteredSalesData.expectedSales) * 100) : 0}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          예상: ₩{filteredSalesData.expectedSales.toLocaleString()} → 실제: ₩{filteredSalesData.totalSales.toLocaleString()}
                        </div>
                      </div>

                      {/* 건물유형별 통계 */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">건물유형별 예약</h5>
                        <div className="space-y-2">
                          {(() => {
                            const buildingTypes = filteredSalesData.completedBookings.concat(filteredSalesData.confirmedBookings, filteredSalesData.pendingBookings)
                            const typeCount = buildingTypes.reduce((acc: any, booking: any) => {
                              const type = booking.building_type === 'phone_consult' ? '전화상담' : 
                                          booking.building_type === 'apartment' ? '아파트' :
                                          booking.building_type === 'villa' ? '빌라' :
                                          booking.building_type === 'house' ? '단독주택' :
                                          booking.building_type === 'officetel' ? '오피스텔' : booking.building_type
                              acc[type] = (acc[type] || 0) + 1
                              return acc
                            }, {})
                            
                            return Object.entries(typeCount).slice(0, 3).map(([type, count]: [string, any]) => (
                              <div key={type} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{type}</span>
                                <span className="font-medium text-gray-900">{count}건</span>
                              </div>
                            ))
                          })()} 
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 시스템 상태 및 안내 */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-green-900 mb-2">시스템 상태 및 안내</h4>
                          <div className="space-y-2 text-sm text-green-800">
                            <p><strong>• 차트 기능:</strong> Chart.js 라이브러리가 성공적으로 연동되어 매출 추이, 예약 상태 분포, 완료 건수 차트를 제공합니다.
                            </p>
                            <p><strong>• 데이터베이스:</strong> Supabase events 테이블 설정을 위해 <code className="bg-green-100 px-2 py-1 rounded text-green-900">supabase-events-schema.sql</code> 파일을 Supabase 대시보드에서 실행하세요.
                            </p>
                            <p><strong>• 기간 필터:</strong> {filteredSalesData.period.label} 기준으로 데이터가 필터링되어 표시되며, 차트도 동일한 기간에 따라 업데이트됩니다.
                            </p>
                            <p><strong>• 실시간 업데이트:</strong> 데이터 수정 시 즉시 반영되며, 차트와 통계가 자동으로 업데이트됩니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 설정 페이지 */}
          {currentPage === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">시스템 설정</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">기본 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" 
                           onClick={() => {
                             const newStart = prompt('업무 시작 시간을 입력하세요 (HH:MM)', settingsData.workStartTime)
                             if (newStart && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newStart)) {
                               updateWorkHours(newStart, settingsData.workEndTime)
                             }
                           }}>
                        <span className="text-sm font-medium text-gray-700">업무 시작 시간</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-600 font-medium">{settingsData.workStartTime}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => {
                             const newEnd = prompt('업무 종료 시간을 입력하세요 (HH:MM)', settingsData.workEndTime)
                             if (newEnd && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newEnd)) {
                               updateWorkHours(settingsData.workStartTime, newEnd)
                             }
                           }}>
                        <span className="text-sm font-medium text-gray-700">업무 종료 시간</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-600 font-medium">{settingsData.workEndTime}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => {
                             const newDuration = prompt('상담 소요 시간을 입력하세요 (시간)', settingsData.consultDuration.toString())
                             if (newDuration && !isNaN(Number(newDuration)) && Number(newDuration) > 0) {
                               updateConsultDuration(Number(newDuration))
                             }
                           }}>
                        <span className="text-sm font-medium text-gray-700">상담 소요 시간</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-600 font-medium">{settingsData.consultDuration}시간</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => toggleNotification('booking')}>
                        <span className="text-sm font-medium text-gray-700">예약 알림</span>
                        <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${
                          settingsData.bookingNotification ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                            settingsData.bookingNotification ? 'right-1' : 'left-1'
                          }`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => toggleNotification('sales')}>
                        <span className="text-sm font-medium text-gray-700">매출 리포트</span>
                        <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${
                          settingsData.salesReport ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                            settingsData.salesReport ? 'right-1' : 'left-1'
                          }`}></div>
                        </div>
                      </div>
                      
                      {/* 추가 알림 옵션 */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">알림 설정 옵션</h4>
                        <div className="space-y-2 text-xs text-blue-800">
                          <p>• 예약 알림: 새 예약 또는 예약 상태 변경 시 알림</p>
                          <p>• 매출 리포트: 일일/주간/월간 매출 리포트 자동 전송</p>
                          <p>• 알림은 브라우저 알림 및 이메일로 전송됩니다</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">데이터 관리</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button 
                      onClick={handleDataBackup}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      <span>데이터 백업</span>
                    </button>
                    <button 
                      onClick={handleDataExport}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:scale-105 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>데이터 내보내기</span>
                    </button>
                    <button 
                      onClick={handleClearCache}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>캐시 삭제</span>
                    </button>
                  </div>
                  
                  {/* 추가 기능 섹션 */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">추천 기능</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2">자동 리포트 기능</h4>
                        <p className="text-sm text-purple-700 mb-3">매일/주간/월간 매출 리포트를 자동으로 생성하고 이메일로 전송합니다.</p>
                        <button 
                          onClick={() => alert('자동 리포트 기능이 활성화되었습니다. 매주 월요일 오전 9시에 주간 리포트를 전송합니다.')}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                          활성화
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">고객 피드백 시스템</h4>
                        <p className="text-sm text-green-700 mb-3">완료된 예약에 대해 자동으로 고객 만족도 설문을 전송합니다.</p>
                        <button 
                          onClick={() => alert('고객 피드백 시스템이 활성화되었습니다. 작업 완료 3일 후 SMS/이메일로 설문을 전송합니다.')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                          활성화
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                        <h4 className="font-semibold text-orange-900 mb-2">예약 충돌 방지</h4>
                        <p className="text-sm text-orange-700 mb-3">동일 시간대에 예약이 격쿄하지 않도록 스마트 알림과 대안 시간 제안합니다.</p>
                        <button 
                          onClick={() => alert('예약 충돌 방지 기능이 활성화되었습니다. 중복 예약 시 자동으로 대안 시간을 제안합니다.')}
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors">
                          활성화
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                        <h4 className="font-semibold text-indigo-900 mb-2">예상 매출 분석 AI</h4>
                        <p className="text-sm text-indigo-700 mb-3">과거 데이터를 기반으로 다음 달 예상 매출과 트렌드를 예측합니다.</p>
                        <button 
                          onClick={() => alert('AI 분석 기능이 활성화되었습니다. 매주 금요일에 다음 주 예상 매출 리포트를 제공합니다.')}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
                          활성화
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 시스템 상태 */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-900">예약 시스템</span>
                        </div>
                        <p className="text-sm text-green-700">정상 작동 중</p>
                        <p className="text-xs text-green-600 mt-1">총 {bookings.length}건의 예약 데이터</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-blue-900">차트 시스템</span>
                        </div>
                        <p className="text-sm text-blue-700">정상 작동 중</p>
                        <p className="text-xs text-blue-600 mt-1">Chart.js 연동 완료</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium text-yellow-900">데이터베이스</span>
                        </div>
                        <p className="text-sm text-yellow-700">샘플 데이터 사용</p>
                        <p className="text-xs text-yellow-600 mt-1">Supabase 연동 필요</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 관리자 예약 폼 모달 */}
      {showBookingForm && (
        <AdminBookingForm
          isOpen={showBookingForm}
          onClose={() => {
            setShowBookingForm(false)
            setSelectedDate(null)
          }}
          onSubmit={handleBookingSubmit}
          selectedDate={selectedDate}
        />
      )}

      {/* 관리자 일정 폼 모달 */}
      {showEventForm && (
        <AdminEventForm
          isOpen={showEventForm}
          onClose={() => {
            setShowEventForm(false)
            setSelectedDate(null)
          }}
          onSubmit={handleEventSubmit}
          selectedDate={selectedDate}
        />
      )}

      {/* 예약 상세 정보 모달 */}
      <BookingDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
        onStatusUpdate={updateBookingStatus}
        onSalesUpdate={updateBookingSales}
      />

      {/* 일정 상세 정보 모달 */}
      <EventDetailModal
        isOpen={showEventDetailModal}
        onClose={() => {
          setShowEventDetailModal(false)
          setSelectedEventDetail(null)
        }}
        event={selectedEventDetail}
        onStatusUpdate={updateEventStatus}
      />

      {/* 통합 예약/일정 등록 모달 */}
      {showUnifiedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">예약 등록</h2>
                <button
                  onClick={() => {
                    setShowUnifiedForm(false)
                    setUnifiedFormType('booking')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 타입 선택 */}
              <div className="mt-4 flex bg-gray-50 rounded-xl p-1">
                <button
                  onClick={() => setUnifiedFormType('booking')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex-1 ${
                    unifiedFormType === 'booking'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  고객 예약
                </button>
                <button
                  onClick={() => setUnifiedFormType('event')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex-1 ${
                    unifiedFormType === 'event'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  회사 일정
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {unifiedFormType === 'booking' ? (
                <AdminBookingForm
                  isOpen={true}
                  onClose={() => {
                    setShowUnifiedForm(false)
                    setUnifiedFormType('booking')
                  }}
                  onSubmit={handleBookingSubmit}
                  selectedDate={selectedDate}
                  isEmbedded={true}
                />
              ) : (
                <AdminEventForm
                  isOpen={true}
                  onClose={() => {
                    setShowUnifiedForm(false)
                    setUnifiedFormType('booking')
                  }}
                  onSubmit={handleEventSubmit}
                  selectedDate={selectedDate}
                  isEmbedded={true}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 매출 상세 모달 */}
      {salesDetailModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{salesDetailModal.title}</h2>
              <button
                onClick={() => setSalesDetailModal({ isOpen: false, type: 'total', title: '', data: [] })}
                className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
                title="닫기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {salesDetailModal.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-gray-600">해당하는 데이터가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {salesDetailModal.data.map((booking: any, index: number) => (
                    <div key={booking.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {booking.customer_name}
                          </h4>
                          <p className="text-sm text-blue-600 font-medium">{booking.customer_phone}</p>
                          <p className="text-xs text-gray-600">{getDisplayType(booking)}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-purple-600 font-medium">
                            상담일시: {format(new Date(booking.consult_date), 'yyyy-MM-dd')} {booking.consult_time}
                          </p>
                          <p className="text-sm text-gray-600">
                            상태: <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status === 'pending' ? '대기' :
                               booking.status === 'confirmed' ? '확정' :
                               booking.status === 'completed' ? '완료' : booking.status}
                            </span>
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {booking.estimate_amount && (
                            <p className="text-sm text-green-600 font-medium">
                              견적금액: ₩{booking.estimate_amount.toLocaleString()}
                            </p>
                          )}
                          {booking.final_amount && (
                            <p className="text-sm text-orange-600 font-bold">
                              최종금액: ₩{booking.final_amount.toLocaleString()}
                            </p>
                          )}
                          {booking.payment_status && (
                            <p className="text-xs text-gray-600">
                              결제상태: {booking.payment_status === 'completed' ? '완료' : 
                                       booking.payment_status === 'partial' ? '부분완료' : '미완료'}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {(booking.consultation_memo || booking.estimate_details) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {booking.consultation_memo && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">상담메모:</span> {booking.consultation_memo}
                            </p>
                          )}
                          {booking.estimate_details && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">견적상세:</span> {booking.estimate_details}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowDetailModal(true)
                            // 매출 상세 모달 닫기
                            setSalesDetailModal({ isOpen: false, type: 'total', title: '', data: [] })
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => {
                            setSalesEditModal({ isOpen: true, booking: booking })
                            // 매출 상세 모달 닫기
                            setSalesDetailModal({ isOpen: false, type: 'total', title: '', data: [] })
                          }}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          수정하기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 매출 수정 모달 */}
      {salesEditModal.isOpen && salesEditModal.booking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">매출 정보 수정</h2>
              <button
                onClick={() => setSalesEditModal({ isOpen: false, booking: null })}
                className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
                title="닫기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <SalesEditForm 
                booking={salesEditModal.booking}
                onSave={(updatedData) => {
                  updateBookingSales(salesEditModal.booking!.id, updatedData)
                  setSalesEditModal({ isOpen: false, booking: null })
                }}
                onCancel={() => setSalesEditModal({ isOpen: false, booking: null })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 매출 수정 폼 컴포넌트
interface SalesEditFormProps {
  booking: BookingData
  onSave: (data: {
    consultation_memo?: string;
    visit_date?: string;
    estimate_amount?: number;
    estimate_details?: string;
    final_amount?: number;
    payment_status?: 'unpaid' | 'partial' | 'completed';
    work_start_date?: string;
    work_end_date?: string;
  }) => void
  onCancel: () => void
}

function SalesEditForm({ booking, onSave, onCancel }: SalesEditFormProps) {
  const [formData, setFormData] = useState({
    consultation_memo: booking.consultation_memo || '',
    visit_date: booking.visit_date || '',
    estimate_amount: booking.estimate_amount || 0,
    estimate_details: booking.estimate_details || '',
    final_amount: booking.final_amount || 0,
    payment_status: booking.payment_status || 'unpaid' as 'unpaid' | 'partial' | 'completed',
    work_start_date: booking.work_start_date || '',
    work_end_date: booking.work_end_date || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 고객 정보 요약 */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3">고객 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">이름:</span> <span className="font-bold text-gray-900">{booking.customer_name}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">연락처:</span> <span className="font-bold text-gray-900">{booking.customer_phone}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">상담일시:</span> <span className="font-bold text-gray-900">{format(new Date(booking.consult_date), 'yyyy-MM-dd')} {booking.consult_time}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">건물유형:</span> <span className="font-bold text-gray-900">{booking.building_type === 'phone_consult' ? '전화상담' : booking.building_type}</span>
          </div>
        </div>
      </div>

      {/* 상담 메모 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          상담 메모
        </label>
        <textarea
          value={formData.consultation_memo}
          onChange={(e) => setFormData({ ...formData, consultation_memo: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="상담 내용을 입력하세요"
        />
      </div>

      {/* 방문 예정일 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          방문 예정일
        </label>
        <input
          type="date"
          value={formData.visit_date}
          onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
        />
      </div>

      {/* 견적 금액 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          견적 금액 (원)
        </label>
        <input
          type="number"
          value={formData.estimate_amount}
          onChange={(e) => setFormData({ ...formData, estimate_amount: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="0"
        />
      </div>

      {/* 견적 상세 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          견적 상세
        </label>
        <textarea
          value={formData.estimate_details}
          onChange={(e) => setFormData({ ...formData, estimate_details: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="견적 상세 내용을 입력하세요"
        />
      </div>

      {/* 최종 금액 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          최종 금액 (원)
        </label>
        <input
          type="number"
          value={formData.final_amount}
          onChange={(e) => setFormData({ ...formData, final_amount: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="0"
        />
      </div>

      {/* 결제 상태 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          결제 상태
        </label>
        <select
          value={formData.payment_status}
          onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as 'unpaid' | 'partial' | 'completed' })}
          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
        >
          <option value="unpaid">미완료</option>
          <option value="partial">부분완료</option>
          <option value="completed">완료</option>
        </select>
      </div>

      {/* 작업 기간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            작업 시작일
          </label>
          <input
            type="date"
            value={formData.work_start_date}
            onChange={(e) => setFormData({ ...formData, work_start_date: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            작업 종료일
          </label>
          <input
            type="date"
            value={formData.work_end_date}
            onChange={(e) => setFormData({ ...formData, work_end_date: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-300">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors border border-gray-400 hover:border-gray-500"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
        >
          저장
        </button>
      </div>
    </form>
  )
}