'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  ChartBarIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface TrafficStats {
  total: number
  last24Hours: number
  last7Days: number
  uniqueVisitors24h: number
  uniqueVisitors7d: number
  topPages: { path: string; count: number }[]
  deviceBreakdown: Record<string, number>
  browserBreakdown: Record<string, number>
  countryBreakdown: { country: string; count: number }[]
}

interface TrafficSummary {
  totalVisits: number
  visitsLast24h: number
  visitsLast7d: number
  uniqueVisitors24h: number
  uniqueVisitors7d: number
  currentHourTraffic: number
  topPage: { path: string; count: number }
  primaryDevice: string
  primaryBrowser: string
}

interface HourlyTraffic {
  hour: number
  date: string
  visits: number
  uniqueVisitors: number
}

export default function TrafficManagement() {
  const [stats, setStats] = useState<TrafficStats | null>(null)
  const [summary, setSummary] = useState<TrafficSummary | null>(null)
  const [hourlyData, setHourlyData] = useState<HourlyTraffic[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d'>('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchTrafficData = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    if (!showLoading) setRefreshing(true)

    try {
      const [statsRes, summaryRes, hourlyRes] = await Promise.all([
        fetch('/api/admin/traffic?type=stats'),
        fetch('/api/admin/traffic?type=summary'),
        fetch('/api/admin/traffic?type=hourly')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data)
      }

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData.data)
      }

      if (hourlyRes.ok) {
        const hourlyResponse = await hourlyRes.json()
        setHourlyData(hourlyResponse.data)
      }
    } catch (error) {
      console.error('Failed to fetch traffic data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTrafficData()

    // 자동 새로고침 (30초마다)
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchTrafficData(false)
      }, 30000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5" />
      case 'tablet':
        return <DeviceTabletIcon className="w-5 h-5" />
      case 'desktop':
      default:
        return <ComputerDesktopIcon className="w-5 h-5" />
    }
  }

  const formatPagePath = (path: string) => {
    if (path === '/') return '홈페이지'
    if (path === '/booking') return '예약 페이지'
    if (path === '/emergency') return '응급 서비스'
    return path
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">트래픽 데이터 로딩 중...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">트래픽 관리</h1>
            <p className="text-gray-600 mt-1">웹사이트 방문자 분석 및 통계</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">자동 새로고침</span>
            </label>
            <button
              onClick={() => fetchTrafficData(false)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 방문수</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalVisits.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">24시간: {summary.visitsLast24h}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">순 방문자 (24시간)</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.uniqueVisitors24h}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">7일간: {summary.uniqueVisitors7d}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">현재 시간 트래픽</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.currentHourTraffic}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">실시간 방문자</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">주요 디바이스</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{summary.primaryDevice}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  {getDeviceIcon(summary.primaryDevice)}
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">{summary.primaryBrowser} 브라우저</span>
              </div>
            </div>
          </div>
        )}

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 시간별 트래픽 차트 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">시간별 트래픽 (24시간)</h3>
            <div className="space-y-2">
              {hourlyData.slice(-12).map((hour, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 w-12">
                    {hour.hour.toString().padStart(2, '0')}시
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.max(5, (hour.visits / Math.max(...hourlyData.map(h => h.visits), 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-900 w-8 text-right">
                    {hour.visits}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 상위 페이지 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 페이지</h3>
            <div className="space-y-3">
              {stats?.topPages.slice(0, 8).map((page, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPagePath(page.path)}
                      </p>
                      <p className="text-xs text-gray-500">{page.path}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {page.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device and Browser Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 디바이스 분석 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">디바이스 분석</h3>
            <div className="space-y-3">
              {stats && Object.entries(stats.deviceBreakdown).map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device)}
                    <span className="text-sm font-medium capitalize">{device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(stats.deviceBreakdown))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 브라우저 분석 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">브라우저 분석</h3>
            <div className="space-y-3">
              {stats && Object.entries(stats.browserBreakdown).map(([browser, count]) => (
                <div key={browser} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">{browser}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(stats.browserBreakdown))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 국가별 분석 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">국가별 방문자</h3>
            <div className="space-y-3">
              {stats?.countryBreakdown.slice(0, 6).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-medium text-blue-600">
                      {country.country.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{country.country}</span>
                  </div>
                  <span className="text-sm text-gray-600">{country.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 실시간 업데이트 상태 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-blue-700">
              {autoRefresh ? '실시간 모니터링 활성화 (30초마다 업데이트)' : '실시간 모니터링 비활성화'}
            </span>
            {refreshing && (
              <span className="text-sm text-blue-600 ml-2">업데이트 중...</span>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}