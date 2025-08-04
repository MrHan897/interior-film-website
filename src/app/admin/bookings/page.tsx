'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: string
  customerName: string
  phone: string
  address: string
  service: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  worker?: string
  status: 'quote_requested' | 'quote_sent' | 'confirmed' | 'in_progress' | 'completed'
  priority: 'low' | 'normal' | 'high'
  notes?: string
  createdAt: string
  totalAmount: number
}

const sampleBookings: Booking[] = [
  {
    id: '1',
    customerName: '김민수',
    phone: '010-1234-5678',
    address: '서울시 강남구 역삼동 123-456',
    service: '아파트 거실 필름 시공',
    scheduledDate: '2024-01-25',
    scheduledTime: '09:00',
    duration: 240,
    worker: '시공팀 A',
    status: 'confirmed',
    priority: 'normal',
    notes: '주말 시공 희망',
    createdAt: '2024-01-20',
    totalAmount: 2100000
  },
  {
    id: '2',
    customerName: '이영희',
    phone: '010-2345-6789',
    address: '서울시 서초구 반포동 789-123',
    service: '사무실 전체 인테리어 필름',
    scheduledDate: '2024-01-26',
    scheduledTime: '14:00',
    duration: 480,
    worker: '시공팀 B',
    status: 'in_progress',
    priority: 'high',
    notes: '야간 작업 가능',
    createdAt: '2024-01-19',
    totalAmount: 4500000
  },
  {
    id: '3',
    customerName: '박철수',
    phone: '010-3456-7890',
    address: '서울시 마포구 홍대 456-789',
    service: '매장 인테리어 필름 교체',
    scheduledDate: '2024-01-24',
    scheduledTime: '10:30',
    duration: 180,
    status: 'quote_sent',
    priority: 'normal',
    createdAt: '2024-01-18',
    totalAmount: 1050000
  }
]

const statusConfig = {
  quote_requested: { 
    label: '견적요청', 
    color: 'bg-gray-100 text-gray-800',
    actions: ['create_quote', 'cancel']
  },
  quote_sent: { 
    label: '견적발송', 
    color: 'bg-blue-100 text-blue-800',
    actions: ['follow_up', 'modify_quote']
  },
  confirmed: { 
    label: '예약확정', 
    color: 'bg-emerald-100 text-emerald-800',
    actions: ['schedule', 'prepare_materials']
  },
  in_progress: { 
    label: '시공중', 
    color: 'bg-amber-100 text-amber-800',
    actions: ['update_progress', 'add_photos']
  },
  completed: { 
    label: '완료', 
    color: 'bg-green-100 text-green-800',
    actions: ['invoice', 'get_review']
  }
}

const priorityConfig = {
  low: { label: '낮음', color: 'bg-gray-100 text-gray-600' },
  normal: { label: '보통', color: 'bg-blue-100 text-blue-600' },
  high: { label: '높음', color: 'bg-red-100 text-red-600' }
}

const BookingCard = ({ 
  booking, 
  onView, 
  onEdit, 
  onUpdateStatus 
}: { 
  booking: Booking
  onView: (booking: Booking) => void
  onEdit: (booking: Booking) => void
  onUpdateStatus: (booking: Booking, newStatus: string) => void
}) => {
  const status = statusConfig[booking.status]
  const priority = priorityConfig[booking.priority]
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{booking.customerName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
            {booking.priority === 'high' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                {priority.label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{booking.service}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(booking)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(booking)}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <UserIcon className="w-4 h-4" />
          <span>{booking.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span>{booking.address}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarDaysIcon className="w-4 h-4" />
          <span>{booking.scheduledDate} {booking.scheduledTime}</span>
          <span>({booking.duration}분)</span>
        </div>
        {booking.worker && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <WrenchScrewdriverIcon className="w-4 h-4" />
            <span>{booking.worker}</span>
          </div>
        )}
      </div>

      {/* 금액 */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <span className="text-sm font-medium text-gray-700">견적 금액</span>
        <span className="text-lg font-bold text-gray-900">
          {(booking.totalAmount / 10000).toFixed(0)}만원
        </span>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center space-x-2">
        {booking.status === 'quote_sent' && (
          <button
            onClick={() => onUpdateStatus(booking, 'confirmed')}
            className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>예약 확정</span>
          </button>
        )}
        {booking.status === 'confirmed' && (
          <button
            onClick={() => onUpdateStatus(booking, 'in_progress')}
            className="flex items-center space-x-1 px-3 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ClockIcon className="w-4 h-4" />
            <span>시공 시작</span>
          </button>
        )}
        {booking.status === 'in_progress' && (
          <button
            onClick={() => onUpdateStatus(booking, 'completed')}
            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>완료 처리</span>
          </button>
        )}
      </div>

      {booking.notes && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">{booking.notes}</p>
        </div>
      )}
    </div>
  )
}

const BookingModal = ({ 
  booking, 
  isOpen, 
  onClose, 
  mode 
}: { 
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  mode: 'view' | 'edit' | 'create'
}) => {
  const [editData, setEditData] = useState<Booking | null>(null)
  
  const isEditable = mode === 'edit' || mode === 'create'
  
  // 편집 모드일 때 데이터 초기화
  useEffect(() => {
    if (isEditable && booking) {
      setEditData(booking)
    }
  }, [isEditable, booking])
  
  const handleInputChange = (field: keyof Booking, value: string | number) => {
    if (!isEditable || !editData) return
    setEditData({ ...editData, [field]: value })
  }
  
  if (!isOpen || !booking) return null

  const status = statusConfig[booking.status]
  const currentData = isEditable ? (editData || booking) : booking

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? '새 예약 등록' : mode === 'edit' ? '예약 수정' : '예약 상세'}
              </h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
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
          {/* 고객 정보 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">고객 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">고객명</label>
                <input
                  type="text"
                  value={currentData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
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

          {/* 예약 정보 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">예약 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">서비스</label>
                <input
                  type="text"
                  value={currentData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예약 날짜</label>
                <input
                  type="date"
                  value={currentData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예약 시간</label>
                <input
                  type="time"
                  value={currentData.scheduledTime}
                  onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소요시간 (분)</label>
                <input
                  type="number"
                  value={currentData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당 시공팀</label>
                <input
                  type="text"
                  value={currentData.worker || ''}
                  onChange={(e) => handleInputChange('worker', e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="담당 시공팀을 입력하세요"
                />
              </div>
            </div>
          </section>

          {/* 금액 정보 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">금액 정보</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">총 견적 금액</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {(currentData.totalAmount / 10000).toFixed(0)}만원
                </span>
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="특이사항이나 고객 요청사항을 입력하세요"
            />
          </section>
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
                {mode === 'create' ? '예약 등록' : '수정 완료'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings)
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(sampleBookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
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

  const applyFilters = (search: string, status: string, bookingList = bookings) => {
    let filtered = bookingList

    if (search) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
        booking.phone.includes(search) ||
        booking.address.toLowerCase().includes(search.toLowerCase()) ||
        booking.service.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(booking => booking.status === status)
    }

    setFilteredBookings(filtered)
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setModalMode('view')
    setModalOpen(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleUpdateStatus = (booking: Booking, newStatus: string) => {
    // 상태 업데이트 - 실시간 반영
    const updatedBookings = bookings.map(b => 
      b.id === booking.id 
        ? { ...b, status: newStatus as Booking['status'] }
        : b
    )
    setBookings(updatedBookings)
    
    // 필터링된 목록도 업데이트
    applyFilters(searchTerm, statusFilter, updatedBookings)
    
    // 성공 알림
    const statusLabels = {
      confirmed: '예약 확정',
      in_progress: '시공 시작', 
      completed: '완료 처리'
    }
    const statusLabel = statusLabels[newStatus as keyof typeof statusLabels] || '상태 변경'
    alert(`${booking.customerName}님의 예약이 "${statusLabel}"로 변경되었습니다.`)
  }

  const statusCounts = {
    all: bookings.length,
    quote_requested: bookings.filter(b => b.status === 'quote_requested').length,
    quote_sent: bookings.filter(b => b.status === 'quote_sent').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">예약관리</h1>
                <p className="text-sm text-gray-600">고객 예약 현황 및 진행 상태 관리</p>
              </div>
              <button 
                onClick={() => {
                  const newBooking: Booking = {
                    id: 'new',
                    customerName: '',
                    phone: '',
                    address: '',
                    service: '',
                    scheduledDate: new Date().toISOString().split('T')[0],
                    scheduledTime: '09:00',
                    duration: 240,
                    status: 'quote_requested',
                    priority: 'normal',
                    createdAt: new Date().toISOString().split('T')[0],
                    totalAmount: 0
                  }
                  setSelectedBooking(newBooking)
                  setModalMode('create')
                  setModalOpen(true)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>새 예약</span>
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
                placeholder="고객명, 연락처, 주소, 서비스로 검색..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 예약 목록 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onView={handleViewBooking}
                onEdit={handleEditBooking}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <CalendarDaysIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">예약이 없습니다</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? '검색 조건에 맞는 예약이 없습니다.' 
                  : '아직 등록된 예약이 없습니다.'}
              </p>
            </div>
          )}
        </div>

        {/* 예약 모달 */}
        <BookingModal
          booking={selectedBooking}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
        />
      </div>
    </AdminLayout>
  )
}