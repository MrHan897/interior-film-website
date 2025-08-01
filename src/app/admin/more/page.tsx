'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  CalculatorIcon,
  CalendarDaysIcon,
  HandRaisedIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface MenuItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  action?: () => void
  color: 'indigo' | 'emerald' | 'amber' | 'red' | 'purple' | 'blue'
  badge?: number
}

const MenuCard = ({ item }: { item: MenuItem }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600'
  }

  const Content = (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all duration-200 touch-manipulation">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className={`w-12 h-12 rounded-2xl ${colorClasses[item.color]} flex items-center justify-center flex-shrink-0`}>
            <item.icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {item.badge && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {item.badge}
            </span>
          )}
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  )

  if (item.path) {
    return (
      <Link href={item.path}>
        {Content}
      </Link>
    )
  }

  return (
    <button onClick={item.action} className="w-full text-left">
      {Content}
    </button>
  )
}

export default function MorePage() {
  const [user] = useState({
    name: '관리자',
    email: 'admin@example.com',
    role: '시스템 관리자'
  })

  const handleLogout = () => {
    console.log('로그아웃 처리')
    // 실제 구현에서는 로그아웃 로직 추가
  }

  const handleSettings = () => {
    console.log('설정 페이지로 이동')
    // 설정 페이지 구현 후 연결
  }

  const handleHelp = () => {
    console.log('도움말 페이지로 이동')
    // 도움말 페이지 구현 후 연결
  }

  const handleNotifications = () => {
    console.log('알림 설정')
    // 알림 설정 페이지 구현 후 연결
  }

  const menuItems: MenuItem[] = [
    {
      id: 'quotes',
      title: '견적관리',
      description: '견적 요청 및 발송 관리',
      icon: CalculatorIcon,
      path: '/admin/quotes',
      color: 'indigo',
      badge: 5
    },
    {
      id: 'bookings',
      title: '예약관리',
      description: '예약 일정 및 상태 관리',
      icon: CalendarDaysIcon,
      path: '/admin/bookings',
      color: 'emerald'
    },
    {
      id: 'partners',
      title: '협력업체',
      description: '협력업체 정보 및 관리',
      icon: HandRaisedIcon,
      path: '/admin/partners',
      color: 'purple'
    },
    {
      id: 'reports',
      title: '매출분석',
      description: '매출 현황 및 비즈니스 인사이트',
      icon: ChartBarIcon,
      path: '/admin/reports',
      color: 'blue'
    }
  ]

  const settingsItems: MenuItem[] = [
    {
      id: 'notifications',
      title: '알림 설정',
      description: '푸시 알림 및 이메일 설정',
      icon: BellIcon,
      action: handleNotifications,
      color: 'amber'
    },
    {
      id: 'settings',
      title: '시스템 설정',
      description: '시스템 환경 및 기본 설정',
      icon: Cog6ToothIcon,
      action: handleSettings,
      color: 'indigo'
    },
    {
      id: 'help',
      title: '도움말',
      description: '사용법 및 FAQ',
      icon: QuestionMarkCircleIcon,
      action: handleHelp,
      color: 'emerald'
    }
  ]

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">더보기</h1>
              <p className="text-sm text-gray-600">추가 기능 및 설정</p>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-6 space-y-8">
          {/* 사용자 정보 */}
          <section>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <UserCircleIcon className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-indigo-600 font-medium">{user.role}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 관리 메뉴 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">관리 메뉴</h2>
            <div className="space-y-3">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* 설정 및 기타 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">설정 및 기타</h2>
            <div className="space-y-3">
              {settingsItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* 로그아웃 */}
          <section>
            <button
              onClick={handleLogout}
              className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all duration-200 touch-manipulation"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">로그아웃</h3>
                    <p className="text-sm text-gray-600">관리자 세션 종료</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </section>

          {/* 하단 여백 (모바일 네비게이션 고려) */}
          <div className="h-4"></div>
        </div>
      </div>
    </AdminLayout>
  )
}