'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface ReportData {
  period: string
  revenue: number
  bookings: number
  customers: number
  avgOrderValue: number
  completion_rate: number
}

interface ServiceStats {
  service: string
  revenue: number
  count: number
  percentage: number
}

interface MonthlyTrend {
  month: string
  revenue: number
  bookings: number
  growth: number
}

const sampleReportData: ReportData = {
  period: '2024년 1월',
  revenue: 28500000,
  bookings: 18,
  customers: 12,
  avgOrderValue: 1583333,
  completion_rate: 94.4
}

const sampleServiceStats: ServiceStats[] = [
  {
    service: '아파트 인테리어 필름',
    revenue: 12600000,
    count: 6,
    percentage: 44.2
  },
  {
    service: '사무실 인테리어 필름',
    revenue: 9500000,
    count: 3,
    percentage: 33.3
  },
  {
    service: '상가 인테리어 필름',
    revenue: 4200000,
    count: 5,
    percentage: 14.7
  },
  {
    service: '주택 인테리어 필름',
    revenue: 2200000,
    count: 4,
    percentage: 7.8
  }
]

const sampleMonthlyTrends: MonthlyTrend[] = [
  { month: '2023-08', revenue: 15200000, bookings: 8, growth: 0 },
  { month: '2023-09', revenue: 18500000, bookings: 11, growth: 21.7 },
  { month: '2023-10', revenue: 22100000, bookings: 13, growth: 19.5 },
  { month: '2023-11', revenue: 25800000, bookings: 15, growth: 16.7 },
  { month: '2023-12', revenue: 19200000, bookings: 9, growth: -25.6 },
  { month: '2024-01', revenue: 28500000, bookings: 18, growth: 48.4 }
]

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  format = 'number' 
}: {
  title: string
  value: number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'emerald' | 'purple' | 'amber'
  format?: 'number' | 'currency' | 'percentage'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500'
  }

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `${(val / 10000).toFixed(0)}만원`
      case 'percentage':
        return `${val.toFixed(1)}%`
      default:
        return val.toString()
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {change >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

const ServiceStatsCard = ({ stats }: { stats: ServiceStats[] }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 매출</h3>
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{stat.service}</span>
              <span className="text-sm text-gray-600">{stat.count}건</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-gray-900">
                {(stat.revenue / 10000).toFixed(0)}만원
              </span>
              <span className="text-sm text-gray-600">{stat.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const MonthlyTrendChart = ({ trends }: { trends: MonthlyTrend[] }) => {
  const maxRevenue = Math.max(...trends.map(t => t.revenue))
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 매출 추이</h3>
      <div className="space-y-4">
        {trends.map((trend, index) => {
          const height = (trend.revenue / maxRevenue) * 200
          return (
            <div key={index} className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(trend.month + '-01').toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{trend.bookings}건</span>
                    <span className="text-lg font-bold text-gray-900">
                      {(trend.revenue / 10000).toFixed(0)}만원
                    </span>
                    {trend.growth !== 0 && (
                      <div className="flex items-center space-x-1">
                        {trend.growth > 0 ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          trend.growth > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {Math.abs(trend.growth).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(trend.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PeriodSelector = ({ 
  selectedPeriod, 
  onPeriodChange 
}: { 
  selectedPeriod: string
  onPeriodChange: (period: string) => void 
}) => (
  <div className="flex items-center space-x-2">
    <select
      value={selectedPeriod}
      onChange={(e) => onPeriodChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="this-month">이번 달</option>
      <option value="last-month">지난 달</option>
      <option value="last-3-months">최근 3개월</option>
      <option value="last-6-months">최근 6개월</option>
      <option value="this-year">올해</option>
      <option value="last-year">작년</option>
    </select>
  </div>
)

const QuickInsights = ({ data }: { data: ReportData }) => {
  const insights = [
    {
      type: 'positive',
      message: `평균 주문 금액이 ${(data.avgOrderValue / 10000).toFixed(0)}만원으로 업계 평균을 상회합니다.`,
      icon: ArrowTrendingUpIcon
    },
    {
      type: 'neutral',
      message: `완료율 ${data.completion_rate}%로 안정적인 서비스 품질을 유지하고 있습니다.`,
      icon: WrenchScrewdriverIcon
    },
    {
      type: 'suggestion',
      message: `신규 고객 ${data.customers}명 중 ${Math.floor(data.customers * 0.3)}명이 재방문 가능성이 높습니다.`,
      icon: UsersIcon
    }
  ]

  const typeColors = {
    positive: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    neutral: 'bg-blue-50 border-blue-200 text-blue-800',
    suggestion: 'bg-amber-50 border-amber-200 text-amber-800'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">인사이트</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg border ${typeColors[insight.type]}`}>
            <div className="flex items-start space-x-3">
              <insight.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month')
  const [reportData] = useState<ReportData>(sampleReportData)
  const [serviceStats] = useState<ServiceStats[]>(sampleServiceStats)
  const [monthlyTrends] = useState<MonthlyTrend[]>(sampleMonthlyTrends)

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    // 실제 구현에서는 여기서 API 호출하여 데이터 업데이트
    console.log('기간 변경:', period)
  }

  const handleExportReport = () => {
    console.log('보고서 내보내기')
    // 실제 구현에서는 PDF 생성 또는 Excel 다운로드
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">매출분석</h1>
                <p className="text-sm text-gray-600">매출 현황 및 비즈니스 인사이트</p>
              </div>
              <div className="flex items-center space-x-4">
                <PeriodSelector 
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                />
                <button
                  onClick={handleExportReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>보고서 내보내기</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-6 space-y-8">
          {/* 핵심 지표 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">핵심 지표</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="총 매출"
                value={reportData.revenue}
                change={23.5}
                icon={CurrencyDollarIcon}
                color="emerald"
                format="currency"
              />
              <StatCard
                title="총 예약"
                value={reportData.bookings}
                change={15.2}
                icon={CalendarDaysIcon}
                color="blue"
              />
              <StatCard
                title="신규 고객"
                value={reportData.customers}
                change={8.7}
                icon={UsersIcon}
                color="purple"
              />
              <StatCard
                title="완료율"
                value={reportData.completion_rate}
                change={2.1}
                icon={WrenchScrewdriverIcon}
                color="amber"
                format="percentage"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 서비스별 매출 */}
            <section>
              <ServiceStatsCard stats={serviceStats} />
            </section>

            {/* 인사이트 */}
            <section>
              <QuickInsights data={reportData} />
            </section>
          </div>

          {/* 월별 추이 */}
          <section>
            <MonthlyTrendChart trends={monthlyTrends} />
          </section>

          {/* 추가 분석 */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 평균 주문 금액 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">평균 주문 금액</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {(reportData.avgOrderValue / 10000).toFixed(0)}만원
                  </div>
                  <p className="text-sm text-gray-600">
                    전월 대비 <span className="text-emerald-600 font-medium">+12.3%</span>
                  </p>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">목표</span>
                    <span className="font-medium text-gray-900">150만원</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.min((reportData.avgOrderValue / 1500000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 고객당 평균 매출 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">고객당 평균 매출</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {(reportData.revenue / reportData.customers / 10000).toFixed(0)}만원
                  </div>
                  <p className="text-sm text-gray-600">
                    전월 대비 <span className="text-emerald-600 font-medium">+18.5%</span>
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">신규 고객</span>
                    <span className="font-medium text-gray-900">{reportData.customers}명</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">재방문 고객</span>
                    <span className="font-medium text-gray-900">{Math.floor(reportData.customers * 0.3)}명</span>
                  </div>
                </div>
              </div>

              {/* 성장률 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">매출 성장률</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">+48.4%</div>
                  <p className="text-sm text-gray-600">전월 대비</p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">이번 달</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(reportData.revenue / 10000).toFixed(0)}만원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">지난 달</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(monthlyTrends[monthlyTrends.length - 2]?.revenue / 10000).toFixed(0)}만원
                    </span>
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