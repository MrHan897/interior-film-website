'use client'

import { useState, useEffect } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface CustomerCommunicationProps {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  quoteData?: {
    address?: string
    areaSize?: string
    filmType?: string
    totalAmount?: number
  }
  content: string
  onSuccess?: (method: string, data: any) => void
  onError?: (method: string, error: string) => void
}

export default function CustomerCommunication({
  customerName = '',
  customerPhone = '',
  customerEmail = '',
  quoteData = {},
  content,
  onSuccess,
  onError
}: CustomerCommunicationProps) {
  const [sending, setSending] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [lastSent, setLastSent] = useState<{ method: string; timestamp: number } | null>(null)

  // 모바일 기기 감지
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
      setIsMobile(mobileRegex.test(userAgent))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 발송 쿨다운 시간 (5분)
  const COOLDOWN_TIME = 5 * 60 * 1000 // 5분

  const canSend = (method: string) => {
    if (!lastSent || lastSent.method !== method) return true
    return Date.now() - lastSent.timestamp > COOLDOWN_TIME
  }

  const getCooldownRemaining = (method: string): number => {
    if (!lastSent || lastSent.method !== method) return 0
    const remaining = COOLDOWN_TIME - (Date.now() - lastSent.timestamp)
    return Math.max(0, remaining)
  }

  const formatCooldownTime = (ms: number): string => {
    const minutes = Math.ceil(ms / 60000)
    return `${minutes}분`
  }

  const sendMessage = async (method: 'kakao' | 'email' | 'sms') => {
    if (!canSend(method)) {
      const remaining = getCooldownRemaining(method)
      onError?.(method, `${formatCooldownTime(remaining)} 후에 다시 시도해주세요.`)
      return
    }

    if (method === 'sms' && !isMobile) {
      onError?.(method, 'SMS 발송은 모바일 기기에서만 가능합니다.')
      return
    }

    setSending(method)

    try {
      const endpoint = `/api/send-${method}`
      const body = {
        customerName,
        phone: customerPhone,
        customerEmail,
        quoteData,
        content,
        userAgent: navigator.userAgent
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setLastSent({ method, timestamp: Date.now() })
        onSuccess?.(method, result.data)
      } else {
        onError?.(method, result.error || `${method} 발송에 실패했습니다.`)
      }
    } catch (error) {
      console.error(`${method} 발송 오류:`, error)
      onError?.(method, `${method} 발송 중 오류가 발생했습니다.`)
    } finally {
      setSending(null)
    }
  }

  const communicationMethods = [
    {
      id: 'kakao',
      name: '카카오톡',
      description: '즉시 전송',
      icon: ChatBubbleLeftRightIcon,
      bgColor: 'bg-yellow-400 hover:bg-yellow-500',
      textColor: 'text-gray-900',
      available: true,
      emoji: '💬'
    },
    {
      id: 'email',
      name: '이메일',
      description: '상세한 견적서',
      icon: EnvelopeIcon,
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      available: true,
      emoji: '📧'
    },
    {
      id: 'sms',
      name: 'SMS',
      description: isMobile ? '모바일 전용' : '모바일에서만 사용 가능',
      icon: DevicePhoneMobileIcon,
      bgColor: isMobile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400',
      textColor: 'text-white',
      available: isMobile,
      emoji: '📱'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {communicationMethods.map((method) => {
          const isDisabled = !method.available || sending === method.id || !canSend(method.id)
          const cooldownRemaining = getCooldownRemaining(method.id)
          
          return (
            <div key={method.id} className="flex-1">
              <button
                onClick={() => sendMessage(method.id as 'kakao' | 'email' | 'sms')}
                disabled={isDisabled}
                className={`
                  w-full relative overflow-hidden rounded-lg px-4 py-3 font-medium transition-all duration-200 
                  ${isDisabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : `${method.bgColor} ${method.textColor} hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{method.emoji}</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold">
                      {method.name}
                      {sending === method.id && (
                        <span className="ml-2 inline-block animate-spin">⌛</span>
                      )}
                    </div>
                    <div className="text-xs opacity-90">
                      {cooldownRemaining > 0 
                        ? `${formatCooldownTime(cooldownRemaining)} 후 가능`
                        : method.description
                      }
                    </div>
                  </div>
                </div>

                {sending === method.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>

              {!method.available && method.id === 'sms' && (
                <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  <span>데스크톱에서는 SMS를 사용할 수 없습니다</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 안내 메시지 */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-700 mb-1">발송 안내</p>
            <ul className="space-y-1 text-gray-600">
              <li>• 카카오톡: 모든 기기에서 즉시 발송 가능</li>
              <li>• 이메일: 상세한 견적서와 함께 발송</li>
              <li>• SMS: 모바일 기기에서만 발송 가능 (보안상 제한)</li>
              <li>• 각 방식별로 5분간 재발송 제한이 적용됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 메시지 미리보기 */}
      {content && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">발송될 메시지 미리보기</h4>
          <div className="text-sm text-gray-600 whitespace-pre-line bg-white p-3 rounded border max-h-32 overflow-y-auto">
            {content}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            총 {content.length}자 {content.length > 80 && '(SMS 장문 발송)'}
          </div>
        </div>
      )}
    </div>
  )
}