'use client'

import React from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface BookingData {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  consult_date: string
  consult_time: string
  building_type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  estimate_amount?: number
  final_amount?: number
  consultation_memo?: string
  visit_date?: string
  estimate_details?: string
  payment_status?: 'unpaid' | 'partial' | 'completed'
  work_start_date?: string
  work_end_date?: string
}

interface SalesChartProps {
  bookings: BookingData[]
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export default function SalesChart({ bookings, period }: SalesChartProps) {
  // 기간별 매출 데이터 생성
  const generateSalesData = () => {
    const now = new Date()
    let labels: string[] = []
    let salesData: number[] = []
    let bookingCounts: number[] = []
    
    switch (period) {
      case 'daily':
        // 최근 7일간 데이터
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          const dateStr = date.toISOString().split('T')[0]
          labels.push(`${date.getMonth() + 1}/${date.getDate()}`)
          
          const dayBookings = bookings.filter(booking => 
            booking.consult_date === dateStr && booking.status === 'completed'
          )
          const daySales = dayBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0)
          salesData.push(daySales)
          bookingCounts.push(dayBookings.length)
        }
        break
        
      case 'weekly':
        // 최근 4주간 데이터
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now.getTime() - (i * 7 + now.getDay()) * 24 * 60 * 60 * 1000)
          const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
          labels.push(`${weekStart.getMonth() + 1}/${weekStart.getDate()}주`)
          
          const weekBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.consult_date)
            return bookingDate >= weekStart && bookingDate <= weekEnd && booking.status === 'completed'
          })
          const weekSales = weekBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0)
          salesData.push(weekSales)
          bookingCounts.push(weekBookings.length)
        }
        break
        
      case 'monthly':
        // 최근 6개월간 데이터
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
          labels.push(`${monthDate.getFullYear()}.${String(monthDate.getMonth() + 1).padStart(2, '0')}`)
          
          const monthBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.consult_date)
            return bookingDate.getFullYear() === monthDate.getFullYear() && 
                   bookingDate.getMonth() === monthDate.getMonth() && 
                   booking.status === 'completed'
          })
          const monthSales = monthBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0)
          salesData.push(monthSales)
          bookingCounts.push(monthBookings.length)
        }
        break
        
      case 'yearly':
        // 최근 3년간 데이터
        for (let i = 2; i >= 0; i--) {
          const year = now.getFullYear() - i
          labels.push(`${year}년`)
          
          const yearBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.consult_date)
            return bookingDate.getFullYear() === year && booking.status === 'completed'
          })
          const yearSales = yearBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0)
          salesData.push(yearSales)
          bookingCounts.push(yearBookings.length)
        }
        break
    }
    
    return { labels, salesData, bookingCounts }
  }

  const { labels, salesData, bookingCounts } = generateSalesData()

  // 매출 추이 차트 데이터
  const lineChartData = {
    labels,
    datasets: [
      {
        label: '매출 금액',
        data: salesData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // 예약 건수 차트 데이터
  const barChartData = {
    labels,
    datasets: [
      {
        label: '완료 건수',
        data: bookingCounts,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  }

  // 상태별 분포 차트 데이터
  const statusCounts = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  const doughnutChartData = {
    labels: ['대기', '확정', '완료'],
    datasets: [
      {
        data: [statusCounts.pending, statusCounts.confirmed, statusCounts.completed],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(147, 51, 234)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('ko-KR').format(value)
          }
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 매출 추이 차트 */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          {period === 'daily' ? '일별' : 
           period === 'weekly' ? '주별' : 
           period === 'monthly' ? '월별' : '연별'} 매출 추이
        </h4>
        <div className="h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      {/* 상태별 분포 차트 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4">예약 상태 분포</h4>
        <div className="h-64">
          <Doughnut data={doughnutChartData} options={doughnutOptions} />
        </div>
      </div>

      {/* 예약 건수 차트 */}
      <div className="lg:col-span-3 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          {period === 'daily' ? '일별' : 
           period === 'weekly' ? '주별' : 
           period === 'monthly' ? '월별' : '연별'} 완료 건수
        </h4>
        <div className="h-64">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}