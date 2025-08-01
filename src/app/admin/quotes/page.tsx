'use client'

import { useState } from 'react'
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
  EyeIcon
} from '@heroicons/react/24/outline'

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
}

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
  onDelete 
}: { 
  quote: Quote
  onView: (quote: Quote) => void
  onEdit: (quote: Quote) => void
  onDelete: (quote: Quote) => void
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
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(quote)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(quote)}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(quote)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

const QuoteModal = ({ 
  quote, 
  isOpen, 
  onClose, 
  mode 
}: { 
  quote: Quote | null
  isOpen: boolean
  onClose: () => void
  mode: 'view' | 'edit' | 'create'
}) => {
  if (!isOpen) return null

  const isEditable = mode === 'edit' || mode === 'create'

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
                      value={quote.customerName}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                    <input
                      type="text"
                      value={quote.phone}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      value={quote.address}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                      value={quote.buildingType}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="apartment">아파트</option>
                      <option value="office">사무실</option>
                      <option value="house">주택</option>
                      <option value="store">상가</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시공 면적 (㎡)</label>
                    <input
                      type="number"
                      value={quote.areaSize}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">필름 종류</label>
                    <input
                      type="text"
                      value={quote.filmType}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시공 난이도</label>
                    <select
                      value={quote.difficulty}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="easy">쉬움</option>
                      <option value="normal">보통</option>
                      <option value="hard">어려움</option>
                    </select>
                  </div>
                </div>
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
                        value={quote.materialCost}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">인건비</label>
                      <input
                        type="number"
                        value={quote.laborCost}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">추가비용</label>
                      <input
                        type="number"
                        value={quote.additionalFees}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">총 견적 금액</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {(quote.totalAmount / 10000).toFixed(0)}만원
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 메모 */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                <textarea
                  value={quote.notes || ''}
                  disabled={!isEditable}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="특이사항이나 고객 요청사항을 입력하세요"
                />
              </section>
            </>
          )}
        </div>

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
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                {mode === 'create' ? '견적 등록' : '수정 완료'}
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
  const [quotes] = useState<Quote[]>(sampleQuotes)
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(sampleQuotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    applyFilters(searchTerm, status)
  }

  const applyFilters = (search: string, status: string) => {
    let filtered = quotes

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
    if (confirm(`${quote.customerName}님의 견적을 삭제하시겠습니까?`)) {
      console.log('견적 삭제:', quote.id)
    }
  }

  const handleCreateQuote = () => {
    setSelectedQuote(null)
    setModalMode('create')
    setModalOpen(true)
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
          mode={modalMode}
        />
      </div>
    </AdminLayout>
  )
}