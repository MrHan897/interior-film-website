'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  HandRaisedIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  badge?: number
}

const desktopNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: HomeIcon,
    path: '/admin/dashboard'
  },
  {
    id: 'quotes',
    title: '견적관리',
    icon: CalculatorIcon,
    path: '/admin/quotes',
    badge: 5
  },
  {
    id: 'bookings',
    title: '예약관리',
    icon: CalendarDaysIcon,
    path: '/admin/bookings'
  },
  {
    id: 'schedule',
    title: '일정관리',
    icon: ClockIcon,
    path: '/admin/schedule'
  },
  {
    id: 'projects',
    title: '시공관리',
    icon: WrenchScrewdriverIcon,
    path: '/admin/projects'
  },
  {
    id: 'customers',
    title: '고객관리',
    icon: UsersIcon,
    path: '/admin/customers'
  },
  {
    id: 'partners',
    title: '협력업체',
    icon: HandRaisedIcon,
    path: '/admin/partners'
  },
  {
    id: 'reports',
    title: '매출분석',
    icon: ChartBarIcon,
    path: '/admin/reports'
  }
]

const mobileNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    title: '홈',
    icon: HomeIcon,
    path: '/admin/dashboard'
  },
  {
    id: 'schedule',
    title: '일정',
    icon: ClockIcon,
    path: '/admin/schedule'
  },
  {
    id: 'projects',
    title: '시공',
    icon: WrenchScrewdriverIcon,
    path: '/admin/projects'
  },
  {
    id: 'customers',
    title: '고객',
    icon: UsersIcon,
    path: '/admin/customers'
  },
  {
    id: 'more',
    title: '더보기',
    icon: Bars3Icon,
    path: '/admin/more'
  }
]

// 데스크톱 사이드바 네비게이션 아이템
const SidebarNavItem = ({ item, isActive }: { item: NavigationItem, isActive: boolean }) => (
  <Link
    href={item.path}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 shadow-sm'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <item.icon className="w-5 h-5 flex-shrink-0" />
    <span className="flex-1">{item.title}</span>
    {item.badge && (
      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
        {item.badge}
      </span>
    )}
  </Link>
)

// 모바일 하단 탭 네비게이션 아이템
const BottomTabItem = ({ item, isActive }: { item: NavigationItem, isActive: boolean }) => (
  <Link
    href={item.path}
    className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-[60px] relative ${
      isActive
        ? 'text-indigo-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    <item.icon className="w-6 h-6" />
    <span className="text-xs font-medium">{item.title}</span>
    {item.badge && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
        {item.badge}
      </span>
    )}
  </Link>
)

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          {/* 로고 및 헤더 */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">필름시공 관리자</h1>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {desktopNavigation.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                isActive={pathname === item.path}
              />
            ))}
          </nav>

          {/* 사용자 정보 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <UserCircleIcon className="w-8 h-8 text-gray-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">관리자</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">필름시공 관리자</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {desktopNavigation.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  isActive={pathname === item.path}
                />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="lg:pl-80">
        {/* 모바일 헤더 */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">필름시공 관리자</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <BellIcon className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-1 rounded-lg hover:bg-gray-100">
                <UserCircleIcon className="w-7 h-7 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 페이지 컨텐츠 */}
        <main className="pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* 모바일 하단 네비게이션 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 gap-1 px-2 py-1">
          {mobileNavigation.map((item) => (
            <BottomTabItem
              key={item.id}
              item={item}
              isActive={pathname === item.path}
            />
          ))}
        </div>
      </div>
    </div>
  )
}