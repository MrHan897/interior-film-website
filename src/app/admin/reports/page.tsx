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
  format = 'number',
  onClick
}: {
  title: string
  value: number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'emerald' | 'purple' | 'amber'
  format?: 'number' | 'currency' | 'percentage'
  onClick?: () => void
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
    <div 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
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
      {onClick && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          클릭하여 상세 분석 보기
        </div>
      )}
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
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
    >
      <option value="this-month" className="text-gray-900">이번 달</option>
      <option value="last-month" className="text-gray-900">지난 달</option>
      <option value="last-3-months" className="text-gray-900">최근 3개월</option>
      <option value="last-6-months" className="text-gray-900">최근 6개월</option>
      <option value="this-year" className="text-gray-900">올해</option>
      <option value="last-year" className="text-gray-900">작년</option>
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
          <div key={index} className={`p-4 rounded-lg border ${typeColors[insight.type as keyof typeof typeColors]}`}>
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

const MetricDetailModal = ({ 
  isOpen, 
  onClose, 
  metricType, 
  data 
}: { 
  isOpen: boolean
  onClose: () => void
  metricType: 'revenue' | 'bookings' | 'customers' | 'completion' | null
  data: ReportData
}) => {
  if (!isOpen || !metricType) return null

  const getMetricDetails = () => {
    switch (metricType) {
      case 'revenue':
        return {
          title: '매출 상세 분석',
          icon: CurrencyDollarIcon,
          color: 'emerald',
          mainValue: `${(data.revenue / 10000).toFixed(0)}만원`,
          chartData: [
            { label: '필름 재료비', value: data.revenue * 0.4, percentage: 40 },
            { label: '인건비', value: data.revenue * 0.35, percentage: 35 },
            { label: '간접비', value: data.revenue * 0.15, percentage: 15 },
            { label: '순이익', value: data.revenue * 0.1, percentage: 10 }
          ],
          insights: [
            '전월 대비 23.5% 증가한 매출을 기록했습니다.',
            '아파트 인테리어 필름이 전체 매출의 44.2%를 차지합니다.',
            '평균 주문 금액이 158만원으로 목표치를 초과 달성했습니다.'
          ]
        }
      case 'bookings':
        return {
          title: '예약 상세 분석',
          icon: CalendarDaysIcon,
          color: 'blue',
          mainValue: `${data.bookings}건`,
          chartData: [
            { label: '아파트', value: Math.round(data.bookings * 0.4), percentage: 40 },
            { label: '사무실', value: Math.round(data.bookings * 0.3), percentage: 30 },
            { label: '상가', value: Math.round(data.bookings * 0.2), percentage: 20 },
            { label: '주택', value: Math.round(data.bookings * 0.1), percentage: 10 }
          ],
          insights: [
            '전월 대비 15.2% 증가한 예약 건수를 기록했습니다.',
            '주말 예약이 평일 대비 35% 높은 선호도를 보입니다.',
            '재방문 고객의 예약률이 68%로 높은 만족도를 보여줍니다.'
          ]
        }
      case 'customers':
        return {
          title: '고객 상세 분석',
          icon: UsersIcon,
          color: 'purple',
          mainValue: `${data.customers}명`,
          chartData: [
            { label: '신규 고객', value: Math.round(data.customers * 0.7), percentage: 70 },
            { label: '재방문 고객', value: Math.round(data.customers * 0.3), percentage: 30 }
          ],
          insights: [
            '신규 고객 유입이 전월 대비 8.7% 증가했습니다.',
            '고객 만족도가 평균 4.6/5점으로 높은 수준을 유지하고 있습니다.',
            '추천을 통한 신규 고객 유입이 42%를 차지합니다.'
          ]
        }
      case 'completion':
        return {
          title: '완료율 상세 분석',
          icon: WrenchScrewdriverIcon,
          color: 'amber',
          mainValue: `${data.completion_rate.toFixed(1)}%`,
          chartData: [
            { label: '정시 완료', value: data.completion_rate * 0.8, percentage: 80 },
            { label: '지연 완료', value: data.completion_rate * 0.15, percentage: 15 },
            { label: '미완료/취소', value: 100 - data.completion_rate, percentage: 100 - data.completion_rate }
          ],
          insights: [
            '완료율이 94.4%로 업계 평균을 상회합니다.',
            '평균 시공 시간이 계획 대비 5% 단축되었습니다.',
            '품질 검수 통과율이 98.5%로 높은 품질을 유지하고 있습니다.'
          ]
        }
      default:
        return null
    }
  }

  const metricDetails = getMetricDetails()
  if (!metricDetails) return null

  const colorClasses = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600' }
  }

  const colors = colorClasses[metricDetails.color]

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <metricDetails.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{metricDetails.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* 모달 컨텐츠 */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 메인 지표 */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {metricDetails.mainValue}
            </div>
            <p className="text-lg text-gray-600">현재 {metricDetails.title.split(' ')[0]}</p>
          </div>

          {/* 차트 데이터 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">구성 비율</h3>
            <div className="space-y-4">
              {metricDetails.chartData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-semibold">
                        {typeof item.value === 'number' && item.value > 1000 
                          ? `${(item.value / 10000).toFixed(0)}만원`
                          : `${Math.round(item.value)}${metricType === 'revenue' ? '만원' : metricType === 'bookings' ? '건' : metricType === 'customers' ? '명' : '%'}`
                        }
                      </span>
                      <span className={`text-sm ${colors.text}`}>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${colors.bg} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 인사이트 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">핵심 인사이트</h3>
            <div className="space-y-3">
              {metricDetails.insights.map((insight, index) => (
                <div key={index} className={`p-4 ${colors.light} rounded-lg`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className={`text-sm font-bold ${colors.text}`}>{index + 1}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${colors.text}`}>
                      {insight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 액션 제안 */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">개선 제안</h3>
            <div className="space-y-2">
              {metricType === 'revenue' && (
                <>
                  <p className="text-sm text-gray-700">• 고단가 서비스 비중을 늘려 평균 주문 금액을 향상시키세요</p>
                  <p className="text-sm text-gray-700">• 재료비 효율화를 통해 수익성을 개선해보세요</p>
                </>
              )}
              {metricType === 'bookings' && (
                <>
                  <p className="text-sm text-gray-700">• 평일 예약 활성화를 위한 프로모션을 고려해보세요</p>
                  <p className="text-sm text-gray-700">• 상가/주택 시장 확대를 위한 마케팅 전략을 수립하세요</p>
                </>
              )}
              {metricType === 'customers' && (
                <>
                  <p className="text-sm text-gray-700">• 재방문 고객 비율 증대를 위한 멤버십 프로그램을 도입하세요</p>
                  <p className="text-sm text-gray-700">• 고객 추천 프로그램을 강화하여 신규 고객을 확보하세요</p>
                </>
              )}
              {metricType === 'completion' && (
                <>
                  <p className="text-sm text-gray-700">• 시공 프로세스 표준화를 통해 완료율을 더욱 향상시키세요</p>
                  <p className="text-sm text-gray-700">• 품질 관리 시스템을 도입하여 고객 만족도를 높이세요</p>
                </>
              )}
            </div>
          </section>
        </div>

        {/* 모달 액션 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={() => {
                alert(`${metricDetails.title} 보고서를 저장했습니다.`)
              }}
              className={`px-4 py-2 ${colors.bg} text-white rounded-lg hover:opacity-90 transition-opacity`}
            >
              보고서 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month')
  const [reportData, setReportData] = useState<ReportData>(sampleReportData)
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>(sampleServiceStats)
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>(sampleMonthlyTrends)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'bookings' | 'customers' | 'completion' | null>(null)

  const handleMetricClick = (metricType: 'revenue' | 'bookings' | 'customers' | 'completion') => {
    setSelectedMetric(metricType)
    setModalOpen(true)
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    
    // 기간별 데이터 시뮬레이션
    const periodMultipliers = {
      'this-month': 1.0,
      'last-month': 0.85,
      'last-3-months': 2.8,
      'last-6-months': 5.2,
      'this-year': 12.5,
      'last-year': 10.8
    }
    
    const multiplier = periodMultipliers[period as keyof typeof periodMultipliers] || 1.0
    
    // 보고서 데이터 업데이트
    setReportData({
      period: getPeriodLabel(period),
      revenue: Math.round(sampleReportData.revenue * multiplier),
      bookings: Math.round(sampleReportData.bookings * multiplier),
      customers: Math.round(sampleReportData.customers * multiplier),
      avgOrderValue: Math.round(sampleReportData.avgOrderValue * (0.8 + multiplier * 0.1)),
      completion_rate: Math.min(99.9, sampleReportData.completion_rate + (multiplier - 1) * 2)
    })
    
    // 서비스별 통계 업데이트
    setServiceStats(sampleServiceStats.map(stat => ({
      ...stat,
      revenue: Math.round(stat.revenue * multiplier),
      count: Math.round(stat.count * multiplier)
    })))
    
    // 성공 메시지
    setTimeout(() => {
      alert(`${getPeriodLabel(period)} 데이터로 업데이트되었습니다.`)
    }, 300)
  }
  
  const getPeriodLabel = (period: string) => {
    const labels = {
      'this-month': '이번 달',
      'last-month': '지난 달', 
      'last-3-months': '최근 3개월',
      'last-6-months': '최근 6개월',
      'this-year': '올해',
      'last-year': '작년'
    }
    return labels[period as keyof typeof labels] || '이번 달'
  }

  const handleExportReport = () => {
    // 보고서 내보내기 옵션 선택
    const exportFormat = confirm(
      `${reportData.period} 보고서를 내보내시겠습니까?\n\n` +
      `매출: ${(reportData.revenue / 10000).toFixed(0)}만원\n` +
      `예약: ${reportData.bookings}건\n` +
      `신규고객: ${reportData.customers}명\n\n` +
      `확인 = CSV 다운로드 / 취소 = 인쇄하기`
    )
    
    if (exportFormat) {
      // CSV 다운로드 시뮬레이션
      const csvContent = [
        ' 항목,값',
        `기간,${reportData.period}`,
        `매출,${reportData.revenue}`,
        `예약건수,${reportData.bookings}`,
        `신규고객,${reportData.customers}`,
        `평균결제,${reportData.avgOrderValue}`,
        `완료율,${reportData.completion_rate}%`
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `매출보고서_${reportData.period}_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      alert('CSV 파일이 다운로드되었습니다.')
    } else {
      // 인쇄하기
      window.print()
    }
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
                onClick={() => handleMetricClick('revenue')}
              />
              <StatCard
                title="총 예약"
                value={reportData.bookings}
                change={15.2}
                icon={CalendarDaysIcon}
                color="blue"
                onClick={() => handleMetricClick('bookings')}
              />
              <StatCard
                title="신규 고객"
                value={reportData.customers}
                change={8.7}
                icon={UsersIcon}
                color="purple"
                onClick={() => handleMetricClick('customers')}
              />
              <StatCard
                title="완료율"
                value={reportData.completion_rate}
                change={2.1}
                icon={WrenchScrewdriverIcon}
                color="amber"
                format="percentage"
                onClick={() => handleMetricClick('completion')}
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

      {/* 상세 분석 모달 */}
      <MetricDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        metricType={selectedMetric}
        data={reportData}
      />
    </AdminLayout>
  )
}