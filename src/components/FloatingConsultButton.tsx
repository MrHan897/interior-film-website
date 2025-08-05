'use client'

import { useState } from 'react'
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function FloatingConsultButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const consultOptions = [
    {
      id: 'kakao',
      label: '카카오톡 상담',
      description: '빠른 채팅 상담',
      icon: '💬',
      bgColor: 'bg-yellow-400 hover:bg-yellow-500',
      textColor: 'text-gray-900',
      action: () => {
        // 관리자 페이지에 설정된 카카오톡 오픈채팅방 링크
        window.open('https://open.kakao.com/o/sUR8xKPe', '_blank')
      }
    },
    {
      id: 'booking',
      label: '상담 신청',
      description: '온라인 상담 예약',
      icon: '📝',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      action: () => {
        window.location.href = '/booking'
      }
    },
    {
      id: 'phone',
      label: '전화 상담',
      description: '010-4781-8012',
      icon: '📞',
      bgColor: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white',
      action: () => {
        window.location.href = 'tel:010-4781-8012'
      }
    },
    {
      id: 'contact',
      label: '문의하기',
      description: '상세 문의 작성',
      icon: '✉️',
      bgColor: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-white',
      action: () => {
        const contactElement = document.getElementById('contact')
        if (contactElement) {
          // 스크롤 위치를 안전하게 체크하고 이동
          const rect = contactElement.getBoundingClientRect()
          const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
          
          if (!isVisible) {
            contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
        setIsOpen(false)
      }
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 메뉴 옵션들 */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 mb-2 space-y-3">
          {consultOptions.map((option, index) => (
            <div
              key={option.id}
              className={`
                transform transition-all duration-300 ease-out
                ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ 
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? 'slideInUp 0.3s ease-out forwards' : 'none'
              }}
            >
              <button
                onClick={option.action}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105
                  ${option.bgColor} ${option.textColor}
                  backdrop-blur-sm border border-white/20
                `}
              >
                <span className="text-xl">{option.icon}</span>
                <div className="text-left min-w-[120px]">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs opacity-90">{option.description}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 메인 플로팅 버튼 */}
      <div className="relative group">
        {/* 펄스 링 효과 */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-75 animate-pulse-ring"></div>
        )}
        
        <button
          onClick={toggleMenu}
          className={`
            relative w-16 h-16 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }
            flex items-center justify-center text-white
            backdrop-blur-sm border-2 border-white/20
          `}
        >
          {isOpen ? (
            <XMarkIcon className="w-8 h-8 transition-transform duration-200" />
          ) : (
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-8 h-8 transition-transform duration-200" />
              {/* 알림 점 */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse-dot"></div>
            </div>
          )}
        </button>

        {/* 툴팁 */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              상담 요청하기
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}