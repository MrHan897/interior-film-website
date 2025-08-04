'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarDaysIcon, 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'

interface DashboardStats {
  todayBookings: number
  ongoingProjects: number  
  pendingQuotes: number
  monthlyRevenue: number
}

interface TodayScheduleItem {
  id: string
  time: string
  customerName: string
  service: string
  type: 'consultation' | 'installation' | 'support' | 'maintenance'
  status: 'confirmed' | 'pending' | 'completed'
}

interface RecentQuote {
  id: string
  customerName: string
  service: string
  amount: number
  date: string
  status: 'pending' | 'sent' | 'accepted' | 'rejected'
}

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

// 통계 카드 컴포넌트
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  format = 'number',
  trend
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'primary' | 'success' | 'warning' | 'secondary'
  format?: 'number' | 'currency'
  trend?: string
}) => {
  const colorClasses = {
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500', 
    warning: 'bg-amber-500',
    secondary: 'bg-cyan-500'
  }

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return `${(val / 10000).toFixed(0)}만원`
    }
    return val.toString()
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
          {trend && (
            <p className="text-sm text-emerald-600 font-medium">+{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

// 퀵 액션 카드
const QuickActionCard = ({ 
  title, 
  icon: Icon, 
  onClick 
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left w-full group"
  >
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">클릭하여 시작하기</p>
      </div>
    </div>
  </button>
)

// 오늘 일정 아이템
const ScheduleItem = ({ item, onClick }: { item: TodayScheduleItem, onClick: (item: TodayScheduleItem) => void }) => {
  const typeColors = {
    consultation: 'bg-blue-100 text-blue-800',
    installation: 'bg-emerald-100 text-emerald-800',
    support: 'bg-amber-100 text-amber-800',
    maintenance: 'bg-purple-100 text-purple-800'
  }

  const typeLabels = {
    consultation: '상담',
    installation: '시공', 
    support: '지원',
    maintenance: 'A/S'
  }

  const statusColors = {
    confirmed: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    completed: 'bg-gray-100 text-gray-600'
  }

  return (
    <button
      onClick={() => onClick(item)}
      className="w-full p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg font-semibold text-indigo-600">{item.time}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
              {typeLabels[item.type]}
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{item.customerName}</p>
            <p className="text-sm text-gray-600">{item.service}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
          {item.status === 'confirmed' ? '확정' : item.status === 'pending' ? '대기' : '완료'}
        </span>
      </div>
    </button>
  )
}

// 최근 견적 테이블 행
const QuoteRow = ({ quote, onClick }: { quote: RecentQuote, onClick: (quote: RecentQuote) => void }) => {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: '대기',
    sent: '발송', 
    accepted: '승인',
    rejected: '거절'
  }

  return (
    <tr 
      onClick={() => onClick(quote)}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {quote.customerName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {quote.service}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {(quote.amount / 10000).toFixed(0)}만원
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {quote.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[quote.status]}`}>
          {statusLabels[quote.status]}
        </span>
      </td>
    </tr>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 8,
    ongoingProjects: 12,
    pendingQuotes: 5,
    monthlyRevenue: 15800000
  })

  const [todaySchedule] = useState<TodayScheduleItem[]>([
    {
      id: '1',
      time: '09:00',
      customerName: '김민수',
      service: '아파트 거실 필름 시공',
      type: 'installation',
      status: 'confirmed'
    },
    {
      id: '2', 
      time: '14:00',
      customerName: '이영희',
      service: '상담 및 견적',
      type: 'consultation',
      status: 'pending'
    },
    {
      id: '3',
      time: '16:30',
      customerName: '박철수',
      service: '필름 교체 A/S',
      type: 'maintenance',
      status: 'confirmed'
    }
  ])

  const [recentQuotes] = useState<RecentQuote[]>([
    {
      id: '1',
      customerName: '정다은',
      service: '오피스 인테리어 필름',
      amount: 2800000,
      date: '2024-01-20',
      status: 'pending'
    },
    {
      id: '2',
      customerName: '최승호',
      service: '아파트 전체 시공',
      amount: 4500000,
      date: '2024-01-19',
      status: 'sent'
    },
    {
      id: '3',
      customerName: '황미영',
      service: '상가 인테리어',
      amount: 1800000,
      date: '2024-01-18',
      status: 'accepted'
    }
  ])

  // 퀵 액션 핸들러
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-quote':
        // 견적관리 페이지로 이동하면서 새 견적 모달 열기
        window.location.href = '/admin/quotes?action=create'
        break
      case 'new-booking':
        // 예약관리 페이지로 이동하면서 새 예약 모달 열기
        window.location.href = '/admin/bookings?action=create'
        break
      case 'complete-project':
        // 프로젝트관리 페이지로 이동
        window.location.href = '/admin/projects'
        break
    }
  }

  const handleScheduleClick = (item: TodayScheduleItem) => {
    // 예약 상세보기 - 예약관리 페이지로 이동
    window.location.href = `/admin/bookings?view=${item.id}`
  }

  const handleQuoteClick = (quote: RecentQuote) => {
    // 견적 상세보기 - 견적관리 페이지로 이동
    window.location.href = `/admin/quotes?view=${quote.id}`
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
                <p className="text-sm text-gray-600">인테리어 필름 시공 예약관리 시스템</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-6 space-y-8">
        {/* 통계 카드 섹션 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="오늘 예약"
              value={stats.todayBookings}
              icon={CalendarDaysIcon}
              color="primary"
              trend="2"
            />
            <StatsCard
              title="진행중 시공"
              value={stats.ongoingProjects}
              icon={WrenchScrewdriverIcon}
              color="warning"
            />
            <StatsCard
              title="대기 견적"
              value={stats.pendingQuotes}
              icon={ClockIcon}
              color="secondary"
            />
            <StatsCard
              title="월 매출"
              value={stats.monthlyRevenue}
              icon={CurrencyDollarIcon}
              color="success"
              format="currency"
            />
          </div>
        </section>

        {/* 퀵 액션 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              title="새 견적 등록"
              icon={DocumentTextIcon}
              onClick={() => handleQuickAction('new-quote')}
            />
            <QuickActionCard
              title="예약 일정 추가"
              icon={CalendarDaysIcon}
              onClick={() => handleQuickAction('new-booking')}
            />
            <QuickActionCard
              title="시공 완료 처리"
              icon={WrenchScrewdriverIcon}
              onClick={() => handleQuickAction('complete-project')}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 오늘 일정 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">오늘 일정</h2>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                전체보기
              </button>
            </div>
            <div className="space-y-3">
              {todaySchedule.slice(0, 5).map((item) => (
                <ScheduleItem
                  key={item.id}
                  item={item}
                  onClick={handleScheduleClick}
                />
              ))}
              {todaySchedule.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                  <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">오늘 예정된 일정이 없습니다</p>
                </div>
              )}
            </div>
          </section>

          {/* 최근 견적 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">최근 견적</h2>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                전체보기
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        고객명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        서비스
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        날짜
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentQuotes.map((quote) => (
                      <QuoteRow
                        key={quote.id}
                        quote={quote}
                        onClick={handleQuoteClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {recentQuotes.length === 0 && (
                <div className="p-8 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">최근 견적 요청이 없습니다</p>
                </div>
              )}
            </div>
          </section>
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}