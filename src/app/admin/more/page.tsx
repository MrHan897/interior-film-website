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
    if (confirm('로그아웃 하시겠습니까?')) {
      alert('로그아웃되었습니다.')
      window.location.href = '/'
    }
  }

  const handleSettings = () => {
    const settingsModal = document.createElement('div')
    settingsModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    settingsModal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">시스템 설정</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">언어 설정</span>
            <select class="px-3 py-1 border rounded-lg text-sm">
              <option>한국어</option>
              <option>English</option>
            </select>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">테마</span>
            <select class="px-3 py-1 border rounded-lg text-sm">
              <option>라이트</option>
              <option>다크</option>
            </select>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">자동 백업</span>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2" />
              <span class="text-sm">활성화</span>
            </label>
          </div>
        </div>
        <div class="mt-6 flex space-x-3">
          <button id="save-settings" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            저장
          </button>
          <button id="cancel-settings" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            취소
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(settingsModal)
    
    settingsModal.querySelector('#save-settings')?.addEventListener('click', () => {
      alert('설정이 저장되었습니다.')
      document.body.removeChild(settingsModal)
    })
    
    settingsModal.querySelector('#cancel-settings')?.addEventListener('click', () => {
      document.body.removeChild(settingsModal)
    })
    
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        document.body.removeChild(settingsModal)
      }
    })
  }

  const handleHelp = () => {
    const helpModal = document.createElement('div')
    helpModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    helpModal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">도움말 및 지원</h3>
        
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">📞 고객지원</h4>
            <p class="text-sm text-blue-800">전화: 1588-0000</p>
            <p class="text-sm text-blue-800">이메일: support@interior-film.com</p>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-medium text-yellow-900 mb-2">💬 카카오톡 상담</h4>
            <button id="kakao-help" class="text-sm text-yellow-800 underline">
              꾸미다필름 1:1 상담 (24시간)
            </button>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">📚 사용법 가이드</h4>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>• 예약 관리: 고객 예약 생성 및 상태 변경</li>
              <li>• 견적 관리: 견적서 작성 및 발송</li>
              <li>• 고객 관리: 고객 정보 및 연락처 관리</li>
              <li>• 프로젝트 관리: 시공 진행률 및 일정 관리</li>
            </ul>
          </div>
          
          <div class="bg-emerald-50 p-4 rounded-lg">
            <h4 class="font-medium text-emerald-900 mb-2">🔧 시스템 정보</h4>
            <p class="text-sm text-emerald-800">버전: v1.0.0</p>
            <p class="text-sm text-emerald-800">최종 업데이트: 2024-01-25</p>
          </div>
        </div>
        
        <div class="mt-6">
          <button id="close-help" class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            닫기
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(helpModal)
    
    helpModal.querySelector('#kakao-help')?.addEventListener('click', () => {
      window.open('https://open.kakao.com/o/sUR8xKPe', '_blank')
    })
    
    helpModal.querySelector('#close-help')?.addEventListener('click', () => {
      document.body.removeChild(helpModal)
    })
    
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        document.body.removeChild(helpModal)
      }
    })
  }

  const handleNotifications = () => {
    const notificationModal = document.createElement('div')
    notificationModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    notificationModal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">알림 설정</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">새 예약 알림</p>
              <p class="text-xs text-gray-600">새로운 예약이 등록될 때</p>
            </div>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2" />
              <span class="text-sm">활성화</span>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">시공 완료 알림</p>
              <p class="text-xs text-gray-600">프로젝트가 완료될 때</p>
            </div>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2" />
              <span class="text-sm">활성화</span>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">결제 완료 알림</p>
              <p class="text-xs text-gray-600">고객 결제가 완료될 때</p>
            </div>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2" />
              <span class="text-sm">활성화</span>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">일정 리마인더</p>
              <p class="text-xs text-gray-600">시공 예정일 하루 전</p>
            </div>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2" />
              <span class="text-sm">활성화</span>
            </label>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-3">
          <button id="save-notifications" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            저장
          </button>
          <button id="cancel-notifications" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            취소
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(notificationModal)
    
    notificationModal.querySelector('#save-notifications')?.addEventListener('click', () => {
      alert('알림 설정이 저장되었습니다.')
      document.body.removeChild(notificationModal)
    })
    
    notificationModal.querySelector('#cancel-notifications')?.addEventListener('click', () => {
      document.body.removeChild(notificationModal)
    })
    
    notificationModal.addEventListener('click', (e) => {
      if (e.target === notificationModal) {
        document.body.removeChild(notificationModal)
      }
    })
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