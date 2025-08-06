'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

interface Partner {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email?: string
  address: string
  businessType: 'supplier' | 'contractor' | 'distributor' | 'installer'
  specialties: string[]
  partnerSince: string
  status: 'active' | 'inactive' | 'suspended'
  rating?: number
  totalProjects: number
  totalRevenue: number
  lastProject: string
  lastProjectDate: string
  notes?: string
  website?: string
}

interface Quote {
  id: string
  customerName: string
  phone: string
  address: string
  buildingType: 'apartment' | 'office' | 'house' | 'store'
  roomType: string
  areaSize: number
  filmType: string
  difficulty: 'easy' | 'normal' | 'hard'
  materialCost: number
  laborCost: number
  additionalFees: number
  totalAmount: number
  status: 'quote_requested' | 'quote_sent' | 'confirmed' | 'rejected'
  createdAt: string
  sentAt?: string
  notes?: string
  // 협력업체 정보 추가
  supplierId?: string
  contractorId?: string
  supplierInfo?: Partner
  contractorInfo?: Partner
}

// 샘플 협력업체 데이터
const samplePartners: Partner[] = [
  {
    id: '1',
    companyName: '(주)프리미엄 필름',
    contactPerson: '이재호 이사',
    phone: '02-1234-5678',
    email: 'jaeho.lee@premiumfilm.co.kr',
    address: '서울시 강남구 테헤란로 123',
    businessType: 'supplier',
    specialties: ['3M 필름', '프리미엄 인테리어 필름'],
    partnerSince: '2022-03-15',
    status: 'active',
    rating: 4.8,
    totalProjects: 45,
    totalRevenue: 125000000,
    lastProject: '강남 오피스텔 대량 공급',
    lastProjectDate: '2024-01-15',
    website: 'https://premiumfilm.co.kr'
  },
  {
    id: '2',
    companyName: '일진시공',
    contactPerson: '박성민 대표',
    phone: '02-2345-6789',
    email: 'sm.park@iljin.co.kr',
    address: '서울시 서초구 강남대로 456',
    businessType: 'contractor',
    specialties: ['대형 건물 시공', '상업시설 시공'],
    partnerSince: '2021-08-20',
    status: 'active',
    rating: 4.5,
    totalProjects: 78,
    totalRevenue: 189000000,
    lastProject: '서초 신축 아파트 전체 시공',
    lastProjectDate: '2024-01-10',
    notes: '대형 프로젝트 전문, 품질 우수'
  }
]

const sampleQuotes: Quote[] = [
  {
    id: '1',
    customerName: '김민수',
    phone: '010-1234-5678',
    address: '서울시 강남구 역삼동 123-456',
    buildingType: 'apartment',
    roomType: '거실, 침실 2개',
    areaSize: 85,
    filmType: '우드그레인 필름',
    difficulty: 'normal',
    materialCost: 1200000,
    laborCost: 800000,
    additionalFees: 100000,
    totalAmount: 2100000,
    status: 'quote_sent',
    createdAt: '2024-01-20',
    sentAt: '2024-01-21',
    notes: '주말 시공 희망'
  },
  {
    id: '2',
    customerName: '이영희',
    phone: '010-2345-6789',
    address: '서울시 서초구 반포동 789-123',
    buildingType: 'office',
    roomType: '사무실 전체',
    areaSize: 120,
    filmType: '메탈릭 필름',
    difficulty: 'hard',
    materialCost: 2400000,
    laborCost: 1800000,
    additionalFees: 300000,
    totalAmount: 4500000,
    status: 'quote_requested',
    createdAt: '2024-01-19',
    notes: '야간 작업 가능'
  },
  {
    id: '3',
    customerName: '박철수',
    phone: '010-3456-7890',
    address: '서울시 마포구 홍대 456-789',
    buildingType: 'store',
    roomType: '매장 전체',
    areaSize: 60,
    filmType: '솔리드 컬러',
    difficulty: 'easy',
    materialCost: 600000,
    laborCost: 400000,
    additionalFees: 50000,
    totalAmount: 1050000,
    status: 'confirmed',
    createdAt: '2024-01-18',
    sentAt: '2024-01-19'
  }
]

const statusConfig = {
  quote_requested: { label: '견적요청', color: 'bg-gray-100 text-gray-800' },
  quote_sent: { label: '견적발송', color: 'bg-blue-100 text-blue-800' },
  confirmed: { label: '예약확정', color: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: '거절', color: 'bg-red-100 text-red-800' }
}

const buildingTypeLabels = {
  apartment: '아파트',
  office: '사무실',
  house: '주택',
  store: '상가'
}

const difficultyLabels = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움'
}

const QuoteCard = ({ 
  quote, 
  onView, 
  onEdit, 
  onDelete,
  onCommunicate
}: { 
  quote: Quote
  onView: (quote: Quote) => void
  onEdit: (quote: Quote) => void
  onDelete: (quote: Quote) => void
  onCommunicate: (quote: Quote) => void
}) => {
  const status = statusConfig[quote.status]
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{quote.customerName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-4 h-4" />
              <span>{quote.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{quote.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="w-4 h-4" />
              <span>{buildingTypeLabels[quote.buildingType]} · {quote.roomType} · {quote.areaSize}㎡</span>
            </div>
            {quote.sentAt && (
              <div className="flex items-center space-x-2 text-blue-600">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="text-xs">견적서 발송됨 ({quote.sentAt})</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(quote)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="견적 상세보기"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(quote)}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="견적 수정"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onCommunicate(quote)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="고객 연락하기"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(quote)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="견적 삭제"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">필름: {quote.filmType}</p>
            <p className="text-sm text-gray-600">난이도: {difficultyLabels[quote.difficulty]}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-lg font-bold text-gray-900">
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>{(quote.totalAmount / 10000).toFixed(0)}만원</span>
            </div>
            <p className="text-xs text-gray-500">{quote.createdAt}</p>
          </div>
        </div>
      </div>

      {quote.notes && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}

// 커뮤니케이션 모달 컴포넌트
const CommunicationModal = ({
  quote,
  isOpen,
  onClose,
  onSend
}: {
  quote: Quote | null
  isOpen: boolean
  onClose: () => void
  onSend: (type: 'email' | 'kakao' | 'sms', content: string) => void
}) => {
  const [selectedType, setSelectedType] = useState<'email' | 'kakao' | 'sms'>('email')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  // 기기 감지
  const isMobile = typeof window !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)

  // 메시지 템플릿
  const getDefaultMessage = (type: 'email' | 'kakao' | 'sms') => {
    if (!quote) return ''
    
    const baseMessage = `안녕하세요 ${quote.customerName}님,

인테리어 필름 시공 견적서를 보내드립니다.

📋 견적 정보:
• 시공 위치: ${quote.address}
• 시공 공간: ${quote.roomType}
• 시공 면적: ${quote.areaSize}㎡
• 필름 종류: ${quote.filmType}
• 견적 금액: ${(quote.totalAmount / 10000).toFixed(0)}만원

상세 내역:
• 재료비: ${(quote.materialCost / 10000).toFixed(0)}만원
• 공임비: ${(quote.laborCost / 10000).toFixed(0)}만원
• 추가비용: ${(quote.additionalFees / 10000).toFixed(0)}만원

문의사항이 있으시면 언제든 연락 주세요.
감사합니다.`

    if (type === 'sms') {
      return `[인테리어필름] ${quote.customerName}님 견적서
${quote.roomType} ${quote.areaSize}㎡
${quote.filmType}
총 ${(quote.totalAmount / 10000).toFixed(0)}만원
문의: 이 번호로 연락주세요`
    }

    return baseMessage
  }

  useEffect(() => {
    if (isOpen && quote) {
      setMessage(getDefaultMessage(selectedType))
    }
  }, [isOpen, quote, selectedType])

  const handleSend = async () => {
    if (!quote || !message.trim()) return

    setIsSending(true)
    try {
      await onSend(selectedType, message)
      onClose()
    } catch (error) {
      console.error('전송 실패:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen || !quote) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">고객 연락하기</h2>
              <p className="text-sm text-gray-600 mt-1">
                {quote.customerName}님 ({quote.phone})
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 연락 방법 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">연락 방법</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedType('email')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedType === 'email'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                }`}
              >
                <EnvelopeIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">이메일</div>
                <div className="text-xs text-gray-500">상세한 견적서</div>
              </button>
              <button
                onClick={() => setSelectedType('kakao')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedType === 'kakao'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                }`}
              >
                <ChatBubbleLeftIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">카카오톡</div>
                <div className="text-xs text-gray-500">빠른 연락</div>
              </button>
              <button
                onClick={() => setSelectedType('sms')}
                disabled={!isMobile}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  !isMobile
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedType === 'sms'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                }`}
              >
                <DevicePhoneMobileIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">문자</div>
                <div className="text-xs text-gray-500">
                  {isMobile ? '모바일 전용' : '모바일만 가능'}
                </div>
              </button>
            </div>
          </div>

          {/* 메시지 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메시지 내용
              <span className="text-gray-500 text-xs ml-2">
                ({selectedType === 'sms' ? '90자 권장' : '자유 형식'})
              </span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={selectedType === 'sms' ? 4 : 8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="고객에게 보낼 메시지를 입력하세요..."
            />
            {selectedType === 'sms' && (
              <div className="mt-1 text-xs text-gray-500">
                현재 {message.length}자 (SMS 최대 90자 권장)
              </div>
            )}
          </div>

          {/* 견적 요약 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">견적 요약</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">고객:</span>
                <span className="ml-2 font-medium">{quote.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">연락처:</span>
                <span className="ml-2 font-medium">{quote.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">면적:</span>
                <span className="ml-2 font-medium">{quote.areaSize}㎡</span>
              </div>
              <div>
                <span className="text-gray-600">금액:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {(quote.totalAmount / 10000).toFixed(0)}만원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !message.trim() || (selectedType === 'sms' && !isMobile)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>전송 중...</span>
                </>
              ) : (
                <>
                  {selectedType === 'email' && <EnvelopeIcon className="w-4 h-4" />}
                  {selectedType === 'kakao' && <ChatBubbleLeftIcon className="w-4 h-4" />}
                  {selectedType === 'sms' && <DevicePhoneMobileIcon className="w-4 h-4" />}
                  <span>
                    {selectedType === 'email' && '이메일 보내기'}
                    {selectedType === 'kakao' && '카카오톡 보내기'}
                    {selectedType === 'sms' && '문자 보내기'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const QuoteModal = ({ 
  quote, 
  isOpen, 
  onClose, 
  onSubmit,
  mode 
}: { 
  quote: Quote | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (quoteData: Quote) => void
  mode: 'view' | 'edit' | 'create'
}) => {
  const [editData, setEditData] = useState<Quote | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEditable = mode === 'edit' || mode === 'create'
  
  // 편집 모드일 때 데이터 초기화
  useEffect(() => {
    if (isEditable) {
      setEditData(quote)
    } else {
      setEditData(null)
    }
  }, [isEditable, quote, mode])
  
  const handleInputChange = (field: keyof Quote, value: string | number) => {
    if (!isEditable || !editData) return
    setEditData({ ...editData, [field]: value })
  }

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    
    console.log('handleSubmit 호출됨', { editData, isSubmitting, mode })
    
    if (!editData) {
      console.error('editData가 없습니다')
      alert('폼 데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.')
      return
    }
    
    if (isSubmitting) {
      console.log('이미 제출 중입니다')
      return
    }

    // 폼 검증
    const errors = validateQuoteForm(editData)
    if (errors.length > 0) {
      console.log('검증 오류:', errors)
      alert('다음 항목을 확인해주세요:\n' + errors.join('\n'))
      return
    }

    setIsSubmitting(true)
    try {
      // 총 금액 자동 계산
      const totalAmount = editData.materialCost + editData.laborCost + editData.additionalFees
      const finalData = {
        ...editData,
        totalAmount,
        createdAt: mode === 'create' ? new Date().toISOString().split('T')[0] : editData.createdAt
      }
      
      console.log('견적 저장 시도:', finalData)
      
      onSubmit(finalData)
      
      console.log('견적 저장 성공')
      onClose()
    } catch (error) {
      console.error('견적 저장 오류:', error)
      alert('견적 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateQuoteForm = (data: Quote): string[] => {
    const errors: string[] = []
    
    if (!data.customerName?.trim()) errors.push('• 고객명을 입력해주세요')
    if (!data.phone?.trim()) errors.push('• 연락처를 입력해주세요')
    if (!data.address?.trim()) errors.push('• 주소를 입력해주세요')
    if (!data.buildingType) errors.push('• 건물 유형을 선택해주세요')
    if (!data.roomType?.trim()) errors.push('• 시공 공간을 입력해주세요')
    if (!data.areaSize || data.areaSize <= 0) errors.push('• 면적을 올바르게 입력해주세요')
    if (!data.filmType?.trim()) errors.push('• 필름 종류를 입력해주세요')
    if (!data.difficulty) errors.push('• 난이도를 선택해주세요')
    if (!data.materialCost || data.materialCost < 0) errors.push('• 자재비를 올바르게 입력해주세요')
    if (!data.laborCost || data.laborCost < 0) errors.push('• 공임비를 올바르게 입력해주세요')
    
    return errors
  }
  
  if (!isOpen) return null

  const currentData = isEditable ? (editData || quote) : quote

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? '새 견적 등록' : mode === 'edit' ? '견적 수정' : '견적 상세'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* 모달 컨텐츠 */}
        <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {quote && (
            <>
              {/* 고객 정보 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">고객정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">고객명</label>
                    <input
                      type="text"
                      value={currentData?.customerName || ''}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '고객명을 입력하세요' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                    <input
                      type="text"
                      value={currentData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '010-0000-0000' : ''}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      value={currentData?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '예: 서울시 강남구 역삼동 123-456' : ''}
                    />
                  </div>
                </div>
              </section>

              {/* 시공 정보 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">시공정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">건물 유형</label>
                    <select
                      value={currentData?.buildingType || ''}
                      onChange={(e) => handleInputChange('buildingType', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="apartment">아파트</option>
                      <option value="office">사무실</option>
                      <option value="house">주택</option>
                      <option value="store">상가</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시공 공간</label>
                    <input
                      type="text"
                      value={currentData?.roomType || ''}
                      onChange={(e) => handleInputChange('roomType', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '예: 거실, 침실 2개' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시공 면적 (㎡)</label>
                    <input
                      type="number"
                      value={currentData?.areaSize || 0}
                      onChange={(e) => handleInputChange('areaSize', parseInt(e.target.value) || 0)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '예: 85' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">필름 종류</label>
                    <input
                      type="text"
                      value={currentData?.filmType || ''}
                      onChange={(e) => handleInputChange('filmType', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '예: 우드그레인 필름, 메탈릭 필름' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시공 난이도</label>
                    <select
                      value={currentData?.difficulty || 'normal'}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="easy">쉬움</option>
                      <option value="normal">보통</option>
                      <option value="hard">어려움</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 협력업체 정보 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">협력업체 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">필름 공급업체</label>
                    <select
                      value={currentData?.supplierId || ''}
                      onChange={(e) => handleInputChange('supplierId', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">공급업체 선택</option>
                      {samplePartners
                        .filter(partner => partner.businessType === 'supplier' && partner.status === 'active')
                        .map(partner => (
                          <option key={partner.id} value={partner.id}>
                            {partner.companyName} ({partner.contactPerson})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시공업체</label>
                    <select
                      value={currentData?.contractorId || ''}
                      onChange={(e) => handleInputChange('contractorId', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">시공업체 선택</option>
                      {samplePartners
                        .filter(partner => partner.businessType === 'contractor' && partner.status === 'active')
                        .map(partner => (
                          <option key={partner.id} value={partner.id}>
                            {partner.companyName} ({partner.contactPerson})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {mode === 'create' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      💡 필요한 협력업체가 목록에 없다면, 협력업체 관리에서 먼저 등록해주세요.
                    </p>
                  </div>
                )}
              </section>

              {/* 견적 내역 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">견적내역</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">재료비</label>
                      <input
                        type="number"
                        value={currentData?.materialCost || 0}
                        onChange={(e) => handleInputChange('materialCost', parseInt(e.target.value) || 0)}
                        disabled={!isEditable}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                        placeholder={mode === 'create' ? '예: 1200000' : ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">인건비</label>
                      <input
                        type="number"
                        value={currentData?.laborCost || 0}
                        onChange={(e) => handleInputChange('laborCost', parseInt(e.target.value) || 0)}
                        disabled={!isEditable}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                        placeholder={mode === 'create' ? '예: 800000' : ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">추가비용</label>
                      <input
                        type="number"
                        value={currentData?.additionalFees || 0}
                        onChange={(e) => handleInputChange('additionalFees', parseInt(e.target.value) || 0)}
                        disabled={!isEditable}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-600 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                        placeholder={mode === 'create' ? '예: 100000 (운반비, 야간작업비 등)' : ''}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">총 견적 금액</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {(((currentData?.materialCost || 0) + (currentData?.laborCost || 0) + (currentData?.additionalFees || 0)) / 10000).toFixed(0)}만원
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 메모 */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                <textarea
                  value={currentData?.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={!isEditable}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    !isEditable 
                      ? 'bg-gray-50 text-gray-600 border-gray-300' 
                      : mode === 'create' 
                        ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-600' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="특이사항이나 고객 요청사항을 입력하세요"
                />
              </section>
            </>
          )}
        </div>
        </form>

        {/* 모달 액션 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {mode === 'view' ? '닫기' : '취소'}
            </button>
            {isEditable && (
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? '처리중...' 
                  : mode === 'create' 
                    ? '견적 등록' 
                    : '수정 완료'
                }
              </button>
            )}
            {mode === 'view' && quote?.status === 'quote_sent' && (
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                예약 확정
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(sampleQuotes)
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(sampleQuotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  
  // 커뮤니케이션 모달 상태
  const [communicationModalOpen, setCommunicationModalOpen] = useState(false)
  const [communicationQuote, setCommunicationQuote] = useState<Quote | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    applyFilters(searchTerm, status)
  }

  const applyFilters = (search: string, status: string, quotesData?: Quote[]) => {
    let filtered = quotesData || quotes

    if (search) {
      filtered = filtered.filter(quote =>
        quote.customerName.toLowerCase().includes(search.toLowerCase()) ||
        quote.phone.includes(search) ||
        quote.address.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(quote => quote.status === status)
    }

    setFilteredQuotes(filtered)
  }

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setModalMode('view')
    setModalOpen(true)
  }

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDeleteQuote = (quote: Quote) => {
    if (confirm(`${quote.customerName}님의 견적을 완전히 삭제하시겠습니까?\n\n견적금액: ${(quote.totalAmount / 10000).toFixed(0)}만원\n이 작업은 되돌릴 수 없습니다.`)) {
      // 견적 목록에서 제거
      const updatedQuotes = quotes.filter(q => q.id !== quote.id)
      setQuotes(updatedQuotes)
      
      // 필터링된 목록도 업데이트  
      const filteredUpdated = updatedQuotes.filter(q => {
        const matchesSearch = searchTerm === '' || 
          q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.phone.includes(searchTerm) ||
          q.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.filmType.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || q.status === statusFilter
        
        return matchesSearch && matchesStatus
      })
      setFilteredQuotes(filteredUpdated)
      
      alert(`${quote.customerName}님의 견적이 삭제되었습니다.`)
    }
  }

  const handleCreateQuote = () => {
    const newQuote: Quote = {
      id: '',
      customerName: '',
      phone: '',
      address: '',
      buildingType: 'apartment',
      roomType: '',
      areaSize: 0,
      filmType: '',
      difficulty: 'normal',
      materialCost: 0,
      laborCost: 0,
      additionalFees: 0,
      totalAmount: 0,
      status: 'quote_requested',
      createdAt: new Date().toISOString().split('T')[0],
      supplierId: '',
      contractorId: ''
    }
    setSelectedQuote(newQuote)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleQuoteSubmit = async (quoteData: Quote) => {
    try {
      if (modalMode === 'create') {
        // 새 견적 추가
        const newQuote = {
          ...quoteData,
          id: Date.now().toString() // 실제로는 서버에서 생성
        }
        const updatedQuotes = [newQuote, ...quotes]
        setQuotes(updatedQuotes)
        applyFilters(searchTerm, statusFilter, updatedQuotes)
        
        alert(`${quoteData.customerName}님의 견적이 성공적으로 등록되었습니다.\n총 금액: ${(quoteData.totalAmount / 10000).toFixed(0)}만원`)
      } else if (modalMode === 'edit') {
        // 기존 견적 수정
        const updatedQuotes = quotes.map(q => 
          q.id === quoteData.id ? quoteData : q
        )
        setQuotes(updatedQuotes)
        applyFilters(searchTerm, statusFilter, updatedQuotes)
        
        alert(`${quoteData.customerName}님의 견적이 성공적으로 수정되었습니다.`)
      }
    } catch (error) {
      throw error // 모달에서 에러 처리
    }
  }

  // 커뮤니케이션 핸들러
  const handleCommunicate = (quote: Quote) => {
    setCommunicationQuote(quote)
    setCommunicationModalOpen(true)
  }

  const handleSendCommunication = async (type: 'email' | 'kakao' | 'sms', content: string) => {
    if (!communicationQuote) return

    try {
      // 각 타입별 API 호출
      if (type === 'email') {
        // 이메일 발송 API 호출
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerName: communicationQuote.customerName,
            customerEmail: null, // 실제로는 고객 이메일 필드 추가 필요
            phone: communicationQuote.phone,
            quoteData: communicationQuote,
            content: content
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '이메일 발송 실패')
        }

        const result = await response.json()
        console.log('이메일 발송 성공:', result)
        
      } else if (type === 'kakao') {
        // 카카오톡 비즈니스 메시지 API 호출
        const response = await fetch('/api/send-kakao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerName: communicationQuote.customerName,
            phone: communicationQuote.phone,
            quoteData: communicationQuote,
            content: content
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '카카오톡 발송 실패')
        }

        const result = await response.json()
        console.log('카카오톡 발송 성공:', result)
        
      } else if (type === 'sms') {
        // SMS 발송 - 모바일에서만 가능
        const phoneNumber = communicationQuote.phone.replace(/[^0-9]/g, '')
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(content)}`
        
        // 모바일 기기에서 SMS 앱 열기
        window.location.href = smsUrl
        
        // SMS의 경우 즉시 반환 (실제 발송 여부는 확인 불가)
        console.log('SMS 앱 열기:', { phoneNumber, content })
      }

      // 견적 상태 업데이트 (견적 발송됨으로 변경)
      if (communicationQuote.status === 'quote_requested') {
        const updatedQuotes = quotes.map(q => 
          q.id === communicationQuote.id 
            ? { ...q, status: 'quote_sent' as const, sentAt: new Date().toISOString().split('T')[0] }
            : q
        )
        setQuotes(updatedQuotes)
        applyFilters(searchTerm, statusFilter, updatedQuotes)
      }

      alert(`${communicationQuote.customerName}님에게 ${
        type === 'email' ? '이메일' : 
        type === 'kakao' ? '카카오톡' : 
        '문자'
      }가 성공적으로 발송되었습니다.`)

    } catch (error) {
      console.error('발송 실패:', error)
      alert('발송 중 오류가 발생했습니다. 다시 시도해주세요.')
      throw error
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
                <h1 className="text-2xl font-bold text-gray-900">견적관리</h1>
                <p className="text-sm text-gray-600">고객 견적 요청 및 발송 관리</p>
              </div>
              <button
                onClick={handleCreateQuote}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>새 견적</span>
              </button>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="고객명, 연락처, 주소로 검색..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">전체 상태</option>
                <option value="quote_requested">견적요청</option>
                <option value="quote_sent">견적발송</option>
                <option value="confirmed">예약확정</option>
                <option value="rejected">거절</option>
              </select>
            </div>
          </div>
        </div>

        {/* 견적 목록 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onView={handleViewQuote}
                onEdit={handleEditQuote}
                onDelete={handleDeleteQuote}
                onCommunicate={handleCommunicate}
              />
            ))}
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">견적이 없습니다</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? '검색 조건에 맞는 견적이 없습니다.' 
                  : '아직 등록된 견적이 없습니다.'}
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <button
                  onClick={handleCreateQuote}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  첫 견적 등록하기
                </button>
              )}
            </div>
          )}
        </div>

        {/* 견적 모달 */}
        <QuoteModal
          quote={selectedQuote}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleQuoteSubmit}
          mode={modalMode}
        />

        {/* 커뮤니케이션 모달 */}
        <CommunicationModal
          quote={communicationQuote}
          isOpen={communicationModalOpen}
          onClose={() => setCommunicationModalOpen(false)}
          onSend={handleSendCommunication}
        />
      </div>
    </AdminLayout>
  )
}