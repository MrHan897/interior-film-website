'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  UsersIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  buildingType: 'apartment' | 'office' | 'house' | 'store'
  totalReservations: number
  totalSpent: number
  lastService: string
  lastServiceDate: string
  customerSince: string
  status: 'active' | 'inactive' | 'vip'
  rating?: number
  notes?: string
}

const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: '김민수',
    phone: '010-1234-5678',
    email: 'minsu.kim@email.com',
    address: '서울시 강남구 역삼동 123-456',
    buildingType: 'apartment',
    totalReservations: 3,
    totalSpent: 6300000,
    lastService: '아파트 거실 필름 시공',
    lastServiceDate: '2024-01-20',
    customerSince: '2023-06-15',
    status: 'vip',
    rating: 5,
    notes: '주말 시공 선호, 품질에 매우 만족'
  },
  {
    id: '2',
    name: '이영희',
    phone: '010-2345-6789',
    email: 'younghee.lee@company.com',
    address: '서울시 서초구 반포동 789-123',
    buildingType: 'office',
    totalReservations: 2,
    totalSpent: 8500000,
    lastService: '사무실 전체 인테리어 필름',
    lastServiceDate: '2024-01-19',
    customerSince: '2023-11-20',
    status: 'active',
    rating: 4,
    notes: '법인고객, 정기 유지보수 계약 원함'
  },
  {
    id: '3',
    name: '박철수',
    phone: '010-3456-7890',
    address: '서울시 마포구 홍대 456-789',
    buildingType: 'store',
    totalReservations: 1,
    totalSpent: 1050000,
    lastService: '매장 인테리어 필름 교체',
    lastServiceDate: '2024-01-18',
    customerSince: '2024-01-10',
    status: 'active',
    rating: 4
  },
  {
    id: '4',
    name: '정다은',
    phone: '010-4567-8901',
    email: 'daeun.jung@cafe.com',
    address: '서울시 용산구 이태원동 321-654',
    buildingType: 'store',
    totalReservations: 2,
    totalSpent: 3600000,
    lastService: '카페 인테리어 필름',
    lastServiceDate: '2024-01-15',
    customerSince: '2023-08-05',
    status: 'active',
    rating: 5,
    notes: '디자인 감각 좋음, 추천 고객 많음'
  }
]

const statusConfig = {
  active: { label: '활성', color: 'bg-emerald-100 text-emerald-800' },
  inactive: { label: '비활성', color: 'bg-gray-100 text-gray-600' },
  vip: { label: 'VIP', color: 'bg-purple-100 text-purple-800' }
}

const buildingTypeLabels = {
  apartment: '아파트',
  office: '사무실',
  house: '주택',
  store: '상가'
}

const CustomerCard = ({ 
  customer, 
  onView, 
  onEdit, 
  onDelete,
  onContact 
}: { 
  customer: Customer
  onView: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  onContact: (customer: Customer) => void
}) => {
  const status = statusConfig[customer.status]
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* 고객 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{buildingTypeLabels[customer.buildingType]}</span>
              <span>가입: {customer.customerSince}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(customer)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(customer)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4" />
          <span>{customer.phone}</span>
        </div>
        {customer.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>@</span>
            <span>{customer.email}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="truncate">{customer.address}</span>
        </div>
      </div>

      {/* 고객 통계 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <CalendarDaysIcon className="w-4 h-4" />
            <span className="text-xs font-medium">총 예약</span>
          </div>
          <div className="text-lg font-bold text-blue-900">{customer.totalReservations}회</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span className="text-xs font-medium">총 결제</span>
          </div>
          <div className="text-lg font-bold text-emerald-900">
            {(customer.totalSpent / 10000).toFixed(0)}만원
          </div>
        </div>
      </div>

      {/* 최근 서비스 */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="text-xs font-medium text-gray-700 mb-1">최근 서비스</div>
        <div className="text-sm font-medium text-gray-900 mb-1">{customer.lastService}</div>
        <div className="text-xs text-gray-600">{customer.lastServiceDate}</div>
      </div>

      {/* 평점 */}
      {customer.rating && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">만족도:</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-4 h-4 ${
                  star <= customer.rating! 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({customer.rating}/5)</span>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onContact(customer)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>연락하기</span>
        </button>
        <button 
          onClick={() => {
            // 예약관리 페이지로 이동하면서 고객 정보 전달
            window.location.href = `/admin/bookings?customer=${encodeURIComponent(customer.name)}&phone=${encodeURIComponent(customer.phone)}&address=${encodeURIComponent(customer.address)}&action=create`
          }}
          className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
        >
          새 예약
        </button>
      </div>

      {/* 메모가 있는 경우 표시 */}
      {customer.notes && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">{customer.notes}</p>
        </div>
      )}
    </div>
  )
}

const CustomerModal = ({ 
  customer, 
  isOpen, 
  onClose,
  onSubmit,
  mode 
}: { 
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (customerData: Customer) => void
  mode: 'view' | 'edit' | 'create'
}) => {
  const [editData, setEditData] = useState<Customer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEditable = mode === 'edit' || mode === 'create'
  
  // 편집 모드일 때 데이터 초기화
  useEffect(() => {
    if (isEditable && customer) {
      setEditData(customer)
    } else if (mode === 'create') {
      setEditData({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        buildingType: 'apartment',
        totalReservations: 0,
        totalSpent: 0,
        lastService: '',
        lastServiceDate: '',
        customerSince: new Date().toISOString().split('T')[0],
        status: 'active',
        rating: undefined,
        notes: ''
      })
    }
  }, [isEditable, customer, mode])
  
  const handleInputChange = (field: keyof Customer, value: string | number) => {
    if (!isEditable || !editData) return
    setEditData({ ...editData, [field]: value })
  }

  const handleSubmit = () => {
    if (!editData) {
      alert('폼 데이터를 불러올 수 없습니다.')
      return
    }
    
    if (isSubmitting) return

    // 폼 검증
    const errors = validateCustomerForm(editData)
    if (errors.length > 0) {
      alert('다음 항목을 확인해주세요:\n' + errors.join('\n'))
      return
    }

    setIsSubmitting(true)
    try {
      const submitData = {
        ...editData,
        id: mode === 'create' ? Date.now().toString() : editData.id
      }
      onSubmit(submitData)
    } catch (error) {
      alert('고객 정보 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateCustomerForm = (data: Customer): string[] => {
    const errors: string[] = []
    
    if (!data.name?.trim()) errors.push('• 고객명을 입력해주세요')
    if (!data.phone?.trim()) errors.push('• 연락처를 입력해주세요')
    if (!data.address?.trim()) errors.push('• 주소를 입력해주세요')
    if (!data.buildingType) errors.push('• 건물 유형을 선택해주세요')
    
    return errors
  }
  
  if (!isOpen) return null

  const currentData = isEditable ? (editData || customer) : customer

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? '새 고객 등록' : mode === 'edit' ? '고객 정보 수정' : '고객 상세 정보'}
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
          {currentData && (
            <>
              {/* 기본 정보 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">고객명</label>
                    <input
                      type="text"
                      value={currentData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                    <input
                      type="text"
                      value={currentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                      type="email"
                      value={currentData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="이메일 주소"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">건물 유형</label>
                    <select
                      value={currentData.buildingType}
                      onChange={(e) => handleInputChange('buildingType', e.target.value as Customer['buildingType'])}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="apartment">아파트</option>
                      <option value="office">사무실</option>
                      <option value="house">주택</option>
                      <option value="store">상가</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      value={currentData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </section>

              {/* 고객 상태 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">고객 상태</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <select
                      value={currentData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as Customer['status'])}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">만족도 (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={currentData.rating || ''}
                      onChange={(e) => handleInputChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="1-5점"
                    />
                  </div>
                </div>
              </section>

              {/* 이용 현황 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">이용 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-700 mb-1">총 예약</div>
                    <div className="text-2xl font-bold text-blue-900">{currentData.totalReservations}회</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-emerald-700 mb-1">총 결제</div>
                    <div className="text-2xl font-bold text-emerald-900">
                      {(currentData.totalSpent / 10000).toFixed(0)}만원
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-purple-700 mb-1">평균 결제</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {currentData.totalReservations > 0 
                        ? (currentData.totalSpent / currentData.totalReservations / 10000).toFixed(0)
                        : '0'}만원
                    </div>
                  </div>
                </div>
              </section>

              {/* 최근 서비스 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">최근 서비스</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">서비스 내용</label>
                      <input
                        type="text"
                        value={currentData.lastService}
                        onChange={(e) => handleInputChange('lastService', e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">서비스 날짜</label>
                      <input
                        type="date"
                        value={currentData.lastServiceDate}
                        onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 메모 */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                <textarea
                  value={currentData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={!isEditable}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="고객 특이사항, 선호도, 주의사항 등을 입력하세요"
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
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? '처리중...' 
                  : mode === 'create' 
                    ? '고객 등록' 
                    : '수정 완료'
                }
              </button>
            )}
            {mode === 'view' && (
              <button 
                onClick={() => {
                  onClose()
                  // 연락하기 기능 재사용
                  setTimeout(() => {
                    if (customer) {
                      const event = new CustomEvent('contactCustomer', { detail: customer })
                      window.dispatchEvent(event)
                    }
                  }, 100)
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                연락하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers)
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(sampleCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
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

  const applyFilters = (search: string, status: string, customerList = customers) => {
    let filtered = customerList

    if (search) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.address.toLowerCase().includes(search.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(customer => customer.status === status)
    }

    setFilteredCustomers(filtered)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setModalMode('view')
    setModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    if (confirm(`${customer.name}님의 고객 정보를 완전히 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      // 고객 목록에서 제거
      const updatedCustomers = customers.filter(c => c.id !== customer.id)
      setCustomers(updatedCustomers)
      
      // 필터링된 목록도 업데이트
      applyFilters(searchTerm, statusFilter, updatedCustomers)
      
      alert(`${customer.name}님의 정보가 삭제되었습니다.`)
    }
  }

  const handleContactCustomer = (customer: Customer) => {
    // 연락 방법 선택을 위한 커스텀 다이얼로그
    const showContactOptions = () => {
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">${customer.name}님께 연락하기</h3>
          <p class="text-sm text-gray-600 mb-6">연락처: ${customer.phone}</p>
          <div class="space-y-3">
            <button id="kakao-btn" class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              <span>💬</span>
              <span>카카오톡 1:1 상담</span>
            </button>
            <button id="phone-btn" class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <span>📞</span>
              <span>전화걸기</span>
            </button>
            <button id="sms-btn" class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <span>💬</span>
              <span>문자보내기</span>
            </button>
            <button id="cancel-btn" class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              취소
            </button>
          </div>
        </div>
      `
      
      document.body.appendChild(modal)
      
      // 카카오톡 버튼
      modal.querySelector('#kakao-btn')?.addEventListener('click', () => {
        window.open('https://open.kakao.com/o/sUR8xKPe', '_blank')
        document.body.removeChild(modal)
      })
      
      // 전화 버튼
      modal.querySelector('#phone-btn')?.addEventListener('click', () => {
        window.location.href = `tel:${customer.phone}`
        document.body.removeChild(modal)
      })
      
      // 문자 버튼
      modal.querySelector('#sms-btn')?.addEventListener('click', () => {
        const message = encodeURIComponent(
          `안녕하세요 ${customer.name}님, 꾸미다필름 인테리어 필름 시공 관련하여 연락드립니다.`
        )
        window.location.href = `sms:${customer.phone}?body=${message}`
        document.body.removeChild(modal)
      })
      
      // 취소 버튼
      modal.querySelector('#cancel-btn')?.addEventListener('click', () => {
        document.body.removeChild(modal)
      })
      
      // 모달 외부 클릭 시 닫기
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
        }
      })
    }
    
    showContactOptions()
  }

  const handleCreateCustomer = () => {
    setSelectedCustomer(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleCustomerSubmit = (customerData: Customer) => {
    if (modalMode === 'create') {
      const newCustomer = {
        ...customerData,
        id: Date.now().toString(),
        totalReservations: 0,
        totalSpent: 0,
        lastService: '',
        lastServiceDate: '',
        customerSince: new Date().toISOString().split('T')[0]
      }
      const updatedCustomers = [newCustomer, ...customers]
      setCustomers(updatedCustomers)
      applyFilters(searchTerm, statusFilter, updatedCustomers)
      alert(`${customerData.name}님이 성공적으로 등록되었습니다.`)
    } else if (modalMode === 'edit') {
      const updatedCustomers = customers.map(c => 
        c.id === customerData.id ? customerData : c
      )
      setCustomers(updatedCustomers)
      applyFilters(searchTerm, statusFilter, updatedCustomers)
      alert(`${customerData.name}님의 정보가 성공적으로 수정되었습니다.`)
    }
    setModalOpen(false)
  }

  // 연락하기 이벤트 리스너
  useEffect(() => {
    const handleContactEvent = (e: any) => {
      handleContactCustomer(e.detail)
    }
    window.addEventListener('contactCustomer', handleContactEvent)
    return () => window.removeEventListener('contactCustomer', handleContactEvent)
  }, [])

  const statusCounts = {
    all: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">고객관리</h1>
                <p className="text-sm text-gray-600">고객 정보 및 이용 내역 관리</p>
              </div>
              <button
                onClick={handleCreateCustomer}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>새 고객</span>
              </button>
            </div>
          </div>
        </div>

        {/* 상태별 통계 */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex space-x-6 overflow-x-auto">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>
                  {status === 'all' ? '전체' : statusConfig[status as keyof typeof statusConfig]?.label}
                </span>
                <span className="bg-white px-2 py-1 rounded-full text-xs font-bold">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="고객명, 연락처, 주소, 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 고객 목록 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                onContact={handleContactCustomer}
              />
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">고객이 없습니다</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? '검색 조건에 맞는 고객이 없습니다.' 
                  : '아직 등록된 고객이 없습니다.'}
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <button
                  onClick={handleCreateCustomer}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  첫 고객 등록하기
                </button>
              )}
            </div>
          )}
        </div>

        {/* 고객 모달 */}
        <CustomerModal
          customer={selectedCustomer}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCustomerSubmit}
          mode={modalMode}
        />
      </div>
    </AdminLayout>
  )
}