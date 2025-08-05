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
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
  HomeIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  EyeIcon
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

interface TrafficData {
  currentVisitors: number
  todayVisitors: number
  pageViews: number
  bounceRate: number
  averageSession: string
  topPages: { page: string, views: number, percentage: number }[]
  deviceStats: { desktop: number, mobile: number, tablet: number }
  referralSources: { source: string, visitors: number, percentage: number }[]
}

interface VisitorChart {
  period: string
  visitors: number
  pageViews: number
  uniqueVisitors: number
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
  trend,
  onClick
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'primary' | 'success' | 'warning' | 'secondary'
  format?: 'number' | 'currency'
  trend?: string
  onClick?: () => void
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

  const CardContent = (
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
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 w-full text-left"
      >
        {CardContent}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {CardContent}
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

// 주간 매출 차트 컴포넌트
const WeeklyRevenueChart = ({ data }: { data: { day: string, revenue: number, bookings: number }[] }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue))
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">주간 매출 현황</h3>
        <div className="flex items-center space-x-2 text-sm text-emerald-600">
          <ArrowTrendingUpIcon className="w-4 h-4" />
          <span>+12.5%</span>
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => {
          const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-10 text-sm text-gray-600 font-medium">
                {item.day}
              </div>
              <div className="flex-1 relative">
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <span className="text-xs font-medium text-white">
                    {item.bookings}건
                  </span>
                </div>
              </div>
              <div className="w-20 text-right text-sm font-semibold text-gray-900">
                {(item.revenue / 10000).toFixed(0)}만원
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 월간 성과 개요 컴포넌트
const MonthlyOverview = ({ data }: { 
  data: { 
    completedProjects: number
    customerSatisfaction: number
    averageProjectValue: number
    totalCustomers: number
  } 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">월간 성과 개요</h3>
      <div className="space-y-6">
        {/* 완료된 프로젝트 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">완료된 프로젝트</span>
            <span className="text-sm font-bold text-gray-900">{data.completedProjects}개</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((data.completedProjects / 20) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">목표: 20개 프로젝트</p>
        </div>

        {/* 고객 만족도 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">고객 만족도</span>
            <span className="text-sm font-bold text-gray-900">{data.customerSatisfaction}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${data.customerSatisfaction}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">목표: 95% 이상</p>
        </div>

        {/* 평균 프로젝트 가치 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">평균 프로젝트 가치</span>
            <span className="text-sm font-bold text-gray-900">{(data.averageProjectValue / 10000).toFixed(0)}만원</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((data.averageProjectValue / 3000000) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">목표: 300만원</p>
        </div>

        {/* 누적 고객 수 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">누적 고객 수</span>
            <span className="text-sm font-bold text-gray-900">{data.totalCustomers}명</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((data.totalCustomers / 100) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">목표: 100명</p>
        </div>
      </div>
    </div>
  )
}

// 서비스 분포 차트 컴포넌트
const ServiceDistributionChart = ({ 
  data 
}: { 
  data: { service: string, count: number, color: string }[] 
}) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">서비스 분포</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.service}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{item.count}건</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 실시간 트래픽 모니터 컴포넌트
const RealTimeTrafficMonitor = ({ data }: { data: TrafficData }) => {
  const [isLive, setIsLive] = useState(true)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev) // 실시간 표시를 위한 깜빡임 효과
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">실시간 트래픽</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-emerald-300'} transition-colors`} />
          <span className="text-sm text-gray-600">LIVE</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <EyeIcon className="w-5 h-5 text-emerald-600 mr-1" />
            <span className="text-2xl font-bold text-emerald-600">{data.currentVisitors}</span>
          </div>
          <p className="text-sm text-gray-600">현재 접속자</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <UsersIcon className="w-5 h-5 text-blue-600 mr-1" />
            <span className="text-2xl font-bold text-blue-600">{data.todayVisitors}</span>
          </div>
          <p className="text-sm text-gray-600">오늘 방문자</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-600 mr-1" />
            <span className="text-2xl font-bold text-purple-600">{data.pageViews}</span>
          </div>
          <p className="text-sm text-gray-600">페이지뷰</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="w-5 h-5 text-amber-600 mr-1" />
            <span className="text-2xl font-bold text-amber-600">{data.averageSession}</span>
          </div>
          <p className="text-sm text-gray-600">평균 세션</p>
        </div>
      </div>

      {/* 디바이스 분포 */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">디바이스 분포</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">데스크톱</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.deviceStats.desktop}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{data.deviceStats.desktop}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DevicePhoneMobileIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">모바일</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.deviceStats.mobile}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{data.deviceStats.mobile}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">태블릿</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.deviceStats.tablet}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{data.deviceStats.tablet}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 방문자 차트 컴포넌트 (일별/주간/월별)
const VisitorAnalyticsChart = ({ 
  data, 
  period, 
  onPeriodChange 
}: { 
  data: VisitorChart[], 
  period: 'daily' | 'weekly' | 'monthly',
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void
}) => {
  const maxVisitors = Math.max(...data.map(d => d.visitors))
  const maxPageViews = Math.max(...data.map(d => d.pageViews))
  
  const periodLabels = {
    daily: '일별',
    weekly: '주간',
    monthly: '월별'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">방문자 분석</h3>
        <div className="flex items-center space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === p 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const visitorHeight = maxVisitors > 0 ? (item.visitors / maxVisitors) * 100 : 0
          const pageViewHeight = maxPageViews > 0 ? (item.pageViews / maxPageViews) * 100 : 0
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{item.period}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-gray-600">{item.visitors} 방문자</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-gray-600">{item.pageViews} 페이지뷰</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all duration-1000"
                    style={{ width: `${visitorHeight}%` }}
                  />
                </div>
                <div className="h-6 bg-gray-100 rounded-lg overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg transition-all duration-1000"
                    style={{ width: `${pageViewHeight}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* 요약 통계 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {data.reduce((sum, item) => sum + item.visitors, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">총 방문자</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {data.reduce((sum, item) => sum + item.pageViews, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">총 페이지뷰</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {data.reduce((sum, item) => sum + item.uniqueVisitors, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">순 방문자</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 인기 페이지 및 트래픽 소스 컴포넌트
const TrafficSourcesAndPages = ({ data }: { data: TrafficData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 인기 페이지 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 페이지</h3>
        <div className="space-y-3">
          {data.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${page.percentage}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-gray-900">{page.views}</p>
                <p className="text-xs text-gray-500">{page.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 트래픽 소스 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">트래픽 소스</h3>
        <div className="space-y-3">
          {data.referralSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{source.source}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-gray-900">{source.visitors}</p>
                <p className="text-xs text-gray-500">{source.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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

  // 주간 매출 데이터
  const [weeklyRevenue] = useState([
    { day: '월', revenue: 2100000, bookings: 3 },
    { day: '화', revenue: 1800000, bookings: 2 },
    { day: '수', revenue: 3200000, bookings: 4 },
    { day: '목', revenue: 2600000, bookings: 3 },
    { day: '금', revenue: 4100000, bookings: 5 },
    { day: '토', revenue: 1900000, bookings: 2 },
    { day: '일', revenue: 1200000, bookings: 1 }
  ])

  // 월간 성과 데이터
  const [monthlyOverview] = useState({
    completedProjects: 18,
    customerSatisfaction: 94.2,
    averageProjectValue: 2400000,
    totalCustomers: 87
  })

  // 서비스 분포 데이터
  const [serviceDistribution] = useState([
    { service: '아파트 시공', count: 12, color: '#4F46E5' },
    { service: '사무실 시공', count: 8, color: '#10B981' },
    { service: '상가 시공', count: 5, color: '#F59E0B' },
    { service: 'A/S 서비스', count: 3, color: '#EF4444' }
  ])

  // 실시간 트래픽 데이터 (실시간 업데이트 시뮬레이션)
  const [trafficData, setTrafficData] = useState<TrafficData>({
    currentVisitors: 23,
    todayVisitors: 387,
    pageViews: 1254,
    bounceRate: 32.5,
    averageSession: '2m 45s',
    topPages: [
      { page: '/', views: 428, percentage: 34.1 },
      { page: '/services', views: 312, percentage: 24.9 },
      { page: '/gallery', views: 186, percentage: 14.8 },
      { page: '/contact', views: 153, percentage: 12.2 },
      { page: '/about', views: 175, percentage: 14.0 }
    ],
    deviceStats: { desktop: 45, mobile: 48, tablet: 7 },
    referralSources: [
      { source: 'Google 검색', visitors: 198, percentage: 51.2 },
      { source: '네이버 검색', visitors: 87, percentage: 22.5 },
      { source: '직접 방문', visitors: 62, percentage: 16.0 },
      { source: '소셜 미디어', visitors: 25, percentage: 6.5 },
      { source: '기타', visitors: 15, percentage: 3.8 }
    ]
  })

  // 방문자 차트 데이터 (기간별)
  const [visitorPeriod, setVisitorPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [visitorChartData] = useState({
    daily: [
      { period: '오늘', visitors: 387, pageViews: 1254, uniqueVisitors: 298 },
      { period: '어제', visitors: 423, pageViews: 1156, uniqueVisitors: 312 },
      { period: '2일 전', visitors: 356, pageViews: 987, uniqueVisitors: 267 },
      { period: '3일 전', visitors: 445, pageViews: 1387, uniqueVisitors: 334 },
      { period: '4일 전', visitors: 398, pageViews: 1201, uniqueVisitors: 289 },
      { period: '5일 전', visitors: 467, pageViews: 1445, uniqueVisitors: 356 },
      { period: '6일 전', visitors: 412, pageViews: 1298, uniqueVisitors: 301 }
    ],
    weekly: [
      { period: '이번 주', visitors: 2688, pageViews: 8728, uniqueVisitors: 2157 },
      { period: '지난 주', visitors: 3012, pageViews: 9456, uniqueVisitors: 2398 },
      { period: '2주 전', visitors: 2834, pageViews: 8967, uniqueVisitors: 2234 },
      { period: '3주 전', visitors: 2945, pageViews: 9123, uniqueVisitors: 2345 },
      { period: '4주 전', visitors: 2756, pageViews: 8634, uniqueVisitors: 2089 }
    ],
    monthly: [
      { period: '이번 달', visitors: 11289, pageViews: 36274, uniqueVisitors: 8934 },
      { period: '지난 달', visitors: 12456, pageViews: 39821, uniqueVisitors: 9567 },
      { period: '2개월 전', visitors: 11834, pageViews: 37965, uniqueVisitors: 9123 },
      { period: '3개월 전', visitors: 10976, pageViews: 35428, uniqueVisitors: 8456 },
      { period: '4개월 전', visitors: 10234, pageViews: 33156, uniqueVisitors: 7898 },
      { period: '5개월 전', visitors: 9876, pageViews: 31789, uniqueVisitors: 7567 }
    ]
  })

  // 실시간 트래픽 데이터 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => ({
        ...prev,
        currentVisitors: Math.max(15, prev.currentVisitors + Math.floor(Math.random() * 5) - 2),
        todayVisitors: prev.todayVisitors + Math.floor(Math.random() * 3),
        pageViews: prev.pageViews + Math.floor(Math.random() * 5)
      }))
    }, 10000) // 10초마다 업데이트
    
    return () => clearInterval(interval)
  }, [])

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

  // 통계 카드 클릭 핸들러
  const handleStatsClick = (type: string) => {
    switch (type) {
      case 'today-bookings':
        // 오늘 예약 - 예약관리 페이지에서 오늘 날짜 필터
        window.location.href = '/admin/bookings?filter=today'
        break
      case 'ongoing-projects':
        // 진행중 시공 - 프로젝트관리 페이지에서 진행중 필터
        window.location.href = '/admin/projects?filter=in_progress'
        break
      case 'pending-quotes':
        // 대기 견적 - 견적관리 페이지에서 대기 상태 필터
        window.location.href = '/admin/quotes?filter=quote_requested'
        break
      case 'monthly-revenue':
        // 월 매출 - 리포트 페이지로 이동
        window.location.href = '/admin/reports?period=month'
        break
    }
  }

  // 전체보기 핸들러
  const handleViewAll = (type: string) => {
    switch (type) {
      case 'schedule':
        // 일정관리 페이지로 이동
        window.location.href = '/admin/schedule'
        break
      case 'quotes':
        // 견적관리 페이지로 이동
        window.location.href = '/admin/quotes'
        break
    }
  }

  // 대시보드 데이터 내보내기 핸들러
  const handleExport = () => {
    // UTF-8 BOM을 추가하여 한글 깨짐 방지
    const BOM = '\uFEFF'
    
    // 종합 대시보드 리포트 생성
    const reportData = [
      ['=== 인테리어 필름 대시보드 종합 리포트 ==='],
      [`생성일시: ${new Date().toLocaleString('ko-KR')}`],
      [''],
      ['1. 핵심 지표 현황'],
      ['항목', '수량', '전월 대비', '목표', '달성률'],
      ['오늘 예약', stats.todayBookings, '+2건', '10건', `${(stats.todayBookings/10*100).toFixed(1)}%`],
      ['진행중 시공', stats.ongoingProjects, '±0건', '15건', `${(stats.ongoingProjects/15*100).toFixed(1)}%`],
      ['대기 견적', stats.pendingQuotes, '-1건', '3건', `${stats.pendingQuotes <= 3 ? '목표 달성' : '목표 초과'}`],
      ['월 매출', `${(stats.monthlyRevenue/10000).toFixed(0)}만원`, '+23.5%', '2000만원', `${(stats.monthlyRevenue/20000000*100).toFixed(1)}%`],
      [''],
      ['2. 주간 매출 상세'],
      ['요일', '매출액(원)', '예약건수', '평균 단가(원)'],
      ...weeklyRevenue.map(day => [
        day.day,
        day.revenue.toLocaleString(),
        day.bookings,
        Math.round(day.revenue / day.bookings).toLocaleString()
      ]),
      [''],
      ['3. 월간 성과 분석'],
      ['지표', '현재값', '목표값', '달성률', '평가'],
      ['완료된 프로젝트', `${monthlyOverview.completedProjects}개`, '20개', `${(monthlyOverview.completedProjects/20*100).toFixed(1)}%`, monthlyOverview.completedProjects >= 18 ? '우수' : '보통'],
      ['고객 만족도', `${monthlyOverview.customerSatisfaction}%`, '95%', `${(monthlyOverview.customerSatisfaction/95*100).toFixed(1)}%`, monthlyOverview.customerSatisfaction >= 90 ? '우수' : '개선 필요'],
      ['평균 프로젝트 가치', `${(monthlyOverview.averageProjectValue/10000).toFixed(0)}만원`, '300만원', `${(monthlyOverview.averageProjectValue/3000000*100).toFixed(1)}%`, monthlyOverview.averageProjectValue >= 2500000 ? '양호' : '개선 필요'],
      ['누적 고객 수', `${monthlyOverview.totalCustomers}명`, '100명', `${monthlyOverview.totalCustomers}%`, monthlyOverview.totalCustomers >= 80 ? '우수' : '보통'],
      [''],
      ['4. 서비스 분포 현황'],
      ['서비스 유형', '건수', '비율', '매출 기여도'],
      ...serviceDistribution.map(service => {
        const total = serviceDistribution.reduce((sum, s) => sum + s.count, 0)
        const percentage = (service.count / total * 100).toFixed(1)
        return [service.service, service.count, `${percentage}%`, '높음']
      }),
      [''],
      ['5. 오늘 일정 요약'],
      ['시간', '고객명', '서비스', '유형', '상태'],
      ...todaySchedule.map(item => [
        item.time,
        item.customerName,
        item.service,
        item.type === 'consultation' ? '상담' : 
        item.type === 'installation' ? '시공' :
        item.type === 'support' ? '지원' : 'A/S',
        item.status === 'confirmed' ? '확정' :
        item.status === 'pending' ? '대기' : '완료'
      ]),
      [''],
      ['6. 최근 견적 현황'],
      ['고객명', '서비스', '견적금액(원)', '날짜', '상태'],
      ...recentQuotes.map(quote => [
        quote.customerName,
        quote.service,
        quote.amount.toLocaleString(),
        quote.date,
        quote.status === 'pending' ? '대기' :
        quote.status === 'sent' ? '발송' :
        quote.status === 'accepted' ? '승인' : '거절'
      ]),
      [''],
      ['7. 주요 인사이트'],
      ['구분', '내용'],
      ['매출 성장률', '주간 매출이 전주 대비 12.5% 증가했습니다.'],
      ['고객 만족도', '고객 만족도 94.2%로 목표 95%에 근접했습니다.'],
      ['서비스 분포', '아파트 시공이 42.9%로 가장 높은 비중을 차지합니다.'],
      ['재방문율', '기존 고객의 재방문율이 68%로 높은 충성도를 보입니다.'],
      ['완료 시간', '평균 프로젝트 완료 시간이 3.2일로 목표를 달성했습니다.']
    ]
    
    // CSV 형식으로 변환 (한글 깨짐 방지)
    const csvContent = BOM + reportData.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell
      ).join(',')
    ).join('\n')
    
    // 파일 다운로드
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `대시보드_종합리포트_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert('대시보드 종합 리포트가 CSV 파일로 다운로드되었습니다.\n\n포함 내용:\n• 핵심 지표 및 달성률\n• 주간 매출 상세 분석\n• 월간 성과 데이터\n• 서비스 분포 현황\n• 일정 및 견적 요약\n• 주요 인사이트')
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
                <button 
                  onClick={handleExport}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="대시보드 데이터 내보내기"
                >
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
        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
          {/* 상단: 핵심 지표 카드 섹션 */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatsCard
                title="오늘 예약"
                value={stats.todayBookings}
                icon={CalendarDaysIcon}
                color="primary"
                trend="2"
                onClick={() => handleStatsClick('today-bookings')}
              />
              <StatsCard
                title="진행중 시공"
                value={stats.ongoingProjects}
                icon={WrenchScrewdriverIcon}
                color="warning"
                onClick={() => handleStatsClick('ongoing-projects')}
              />
              <StatsCard
                title="대기 견적"
                value={stats.pendingQuotes}
                icon={ClockIcon}
                color="secondary"
                onClick={() => handleStatsClick('pending-quotes')}
              />
              <StatsCard
                title="월 매출"
                value={stats.monthlyRevenue}
                icon={CurrencyDollarIcon}
                color="success"
                format="currency"
                onClick={() => handleStatsClick('monthly-revenue')}
              />
            </div>
          </section>

          {/* 퀵 액션 + 오늘 일정 + 최근 견적 */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* 퀵 액션 섹션 */}
            <section className="xl:col-span-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 작업</h2>
              <div className="space-y-4">
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

            <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* 오늘 일정 섹션 */}
              <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">오늘 일정</h2>
              <button 
                onClick={() => handleViewAll('schedule')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
              >
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
              <button 
                onClick={() => handleViewAll('quotes')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
              >
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

          {/* 성과 분석 섹션 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">비즈니스 성과 분석</h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* 주간 매출 차트 */}
              <div className="xl:col-span-2">
                <WeeklyRevenueChart data={weeklyRevenue} />
              </div>
              
              {/* 서비스 분포 차트 */}
              <div>
                <ServiceDistributionChart data={serviceDistribution} />
              </div>
            </div>
          </section>

          {/* 트래픽 모니터링 섹션 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">웹사이트 트래픽 분석</h2>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
              {/* 실시간 트래픽 모니터 */}
              <div className="xl:col-span-1">
                <RealTimeTrafficMonitor data={trafficData} />
              </div>
              
              {/* 방문자 분석 차트 */}
              <div className="xl:col-span-3">
                <VisitorAnalyticsChart 
                  data={visitorChartData[visitorPeriod]}
                  period={visitorPeriod}
                  onPeriodChange={setVisitorPeriod}
                />
              </div>
            </div>
          </section>

          {/* 트래픽 소스 및 인기 페이지 */}
          <section>
            <TrafficSourcesAndPages data={trafficData} />
          </section>

          {/* 월간 성과 및 KPI 카드 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">월간 성과 및 핵심 지표</h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* 월간 성과 개요 */}
              <div className="xl:col-span-2">
                <MonthlyOverview data={monthlyOverview} />
              </div>
              
              {/* 추가 KPI 카드들 */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <TruckIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">+8.2%</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">진행중 배송</h3>
                    <p className="text-2xl font-bold text-gray-900">6건</p>
                    <p className="text-xs text-gray-500 mt-1">예상 완료: 내일</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">+15.3%</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">재방문율</h3>
                    <p className="text-2xl font-bold text-gray-900">68%</p>
                    <p className="text-xs text-gray-500 mt-1">전월 대비 증가</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex items-center space-x-1 text-amber-600">
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">-2.1일</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">평균 완료시간</h3>
                    <p className="text-2xl font-bold text-gray-900">3.2일</p>
                    <p className="text-xs text-gray-500 mt-1">목표: 3.5일</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex items-center space-x-1 text-purple-600">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">+12명</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">신규 고객</h3>
                    <p className="text-2xl font-bold text-gray-900">25명</p>
                    <p className="text-xs text-gray-500 mt-1">이번 달</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}