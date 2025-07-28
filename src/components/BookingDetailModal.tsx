'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface BookingData {
  id: string
  building_type: string
  area_size: string
  home_condition: string
  reason: string
  spaces: string[]
  budget: string
  timeline: string
  consult_date: string
  consult_time: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_requirements: string
  privacy_consent: boolean
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  // 상담 및 견적 관련 필드
  consultation_memo?: string
  visit_date?: string
  estimate_amount?: number
  estimate_details?: string
  final_amount?: number
  payment_status?: 'unpaid' | 'partial' | 'completed'
  work_start_date?: string
  work_end_date?: string
}

interface BookingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingData | null
  onStatusUpdate: (bookingId: string, newStatus: string) => void
  onSalesUpdate?: (bookingId: string, salesData: {
    consultation_memo?: string;
    visit_date?: string;
    estimate_amount?: number;
    estimate_details?: string;
    final_amount?: number;
    payment_status?: 'unpaid' | 'partial' | 'completed';
    work_start_date?: string;
    work_end_date?: string;
  }) => void
}

export default function BookingDetailModal({
  isOpen,
  onClose,
  booking,
  onStatusUpdate,
  onSalesUpdate
}: BookingDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSalesForm, setShowSalesForm] = useState(false)
  const [salesData, setSalesData] = useState({
    consultation_memo: '',
    visit_date: '',
    estimate_amount: 0,
    estimate_details: '',
    final_amount: 0,
    payment_status: 'unpaid' as 'unpaid' | 'partial' | 'completed',
    work_start_date: '',
    work_end_date: ''
  })

  if (!isOpen || !booking) return null

  const getBuildingTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      apartment: '아파트',
      villa: '빌라',
      house: '단독주택',
      officetel: '오피스텔'
    }
    return labels[type] || type
  }

  const getDisplayType = (booking: BookingData): string => {
    return booking.building_type === 'phone_consult' ? '전화상담' : getBuildingTypeLabel(booking.building_type)
  }

  const getBudgetLabel = (budget: string) => {
    const labels: { [key: string]: string } = {
      'under-100': '100만원 이하',
      '100-300': '100-300만원',
      '300-500': '300-500만원',
      '500-1000': '500-1000만원',
      'over-1000': '1000만원 이상'
    }
    return labels[budget] || budget
  }

  const getTimelineLabel = (timeline: string) => {
    const labels: { [key: string]: string } = {
      'urgent': '1주일 이내',
      'within-month': '1개월 이내',
      'within-3months': '3개월 이내',
      'flexible': '시기 상관없음'
    }
    return labels[timeline] || timeline
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '대기',
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (isUpdating) return
    setIsUpdating(true)
    await onStatusUpdate(booking.id, newStatus)
    setIsUpdating(false)
  }

  const handleSalesSubmit = async () => {
    if (!onSalesUpdate || isUpdating) return
    setIsUpdating(true)
    
    const submitData = {
      ...salesData,
      estimate_amount: salesData.estimate_amount || undefined,
      final_amount: salesData.final_amount || undefined
    }
    
    await onSalesUpdate(booking.id, submitData)
    setIsUpdating(false)
    setShowSalesForm(false)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: ko })
    } catch {
      return dateString
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">예약 상세 정보</h2>
            <p className="text-sm text-gray-500 mt-1">
              예약 번호: {booking.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 상태 */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">예약 상태</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </span>
          </div>

          {/* 고객 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">고객 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">이름</label>
                <p className="font-medium text-gray-900">{booking.customer_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">연락처</label>
                <p className="font-medium text-gray-900">{booking.customer_phone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">주소</label>
                <p className="font-medium text-gray-900">{booking.customer_address}</p>
              </div>
            </div>
          </div>

          {/* 상담 일정 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">상담 일정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">날짜</label>
                <p className="font-medium text-gray-900">{formatDate(booking.consult_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">시간</label>
                <p className="font-medium text-gray-900">{booking.consult_time}</p>
              </div>
            </div>
          </div>

          {/* 시공 정보 */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">시공 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">{booking.building_type === 'phone_consult' ? '상담 유형' : '건물 유형'}</label>
                <p className="font-medium text-gray-900">{getDisplayType(booking)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">시공 면적</label>
                <p className="font-medium text-gray-900">{booking.area_size}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">집 상태</label>
                <p className="font-medium text-gray-900">{booking.home_condition}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">시공 이유</label>
                <p className="font-medium text-gray-900">{booking.reason}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">예산</label>
                <p className="font-medium text-gray-900">{getBudgetLabel(booking.budget)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">시공 시기</label>
                <p className="font-medium text-gray-900">{getTimelineLabel(booking.timeline)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">시공 공간</label>
                <p className="font-medium text-gray-900">{booking.spaces.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* 요청사항 */}
          {booking.customer_requirements && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">고객 요청사항</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{booking.customer_requirements}</p>
            </div>
          )}

          {/* 상태 변경 버튼 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">상태 변경</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleStatusUpdate('pending')}
                disabled={booking.status === 'pending' || isUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  booking.status === 'pending'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                대기
              </button>
              <button
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={booking.status === 'confirmed' || isUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  booking.status === 'confirmed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                확정
              </button>
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={booking.status === 'completed' || isUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  booking.status === 'completed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                완료
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={booking.status === 'cancelled' || isUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  booking.status === 'cancelled'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                취소
              </button>
            </div>
          </div>

          {/* 매출 정보 섹션 */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">매출 정보</h3>
              {onSalesUpdate && (
                <button
                  onClick={() => setShowSalesForm(!showSalesForm)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showSalesForm ? '취소' : '매출 입력'}
                </button>
              )}
            </div>
            
            {/* 기존 매출 정보 표시 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">견적 금액</p>
                <p className="font-medium">
                  {booking.estimate_amount ? `₩${booking.estimate_amount.toLocaleString()}` : '미입력'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">최종 금액</p>
                <p className="font-medium">
                  {booking.final_amount ? `₩${booking.final_amount.toLocaleString()}` : '미입력'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">결제 상태</p>
                <p className="font-medium">
                  {booking.payment_status === 'completed' ? '완료' : 
                   booking.payment_status === 'partial' ? '부분결제' : '미결제'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">방문 견적일</p>
                <p className="font-medium">{booking.visit_date || '미정'}</p>
              </div>
            </div>

            {booking.consultation_memo && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">상담 메모</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.consultation_memo}</p>
              </div>
            )}

            {/* 매출 입력 폼 */}
            {showSalesForm && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">방문 견적일</label>
                    <input
                      type="date"
                      value={salesData.visit_date}
                      onChange={(e) => setSalesData({...salesData, visit_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">견적 금액</label>
                    <input
                      type="number"
                      value={salesData.estimate_amount}
                      onChange={(e) => setSalesData({...salesData, estimate_amount: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="견적 금액 입력"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최종 계약 금액</label>
                    <input
                      type="number"
                      value={salesData.final_amount}
                      onChange={(e) => setSalesData({...salesData, final_amount: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="최종 계약 금액"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">결제 상태</label>
                    <select
                      value={salesData.payment_status}
                      onChange={(e) => setSalesData({...salesData, payment_status: e.target.value as 'pending' | 'paid' | 'partial'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="unpaid">미결제</option>
                      <option value="partial">부분결제</option>
                      <option value="completed">완료</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상담 메모</label>
                  <textarea
                    value={salesData.consultation_memo}
                    onChange={(e) => setSalesData({...salesData, consultation_memo: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="현장 상담 내용, 고객 요구사항 등을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">견적서 상세</label>
                  <textarea
                    value={salesData.estimate_details}
                    onChange={(e) => setSalesData({...salesData, estimate_details: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="견적서 상세 내용 (재료, 공정, 기간 등)"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowSalesForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSalesSubmit}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 생성/수정 시간 */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p>생성일: {formatDateTime(booking.created_at)}</p>
            <p>수정일: {formatDateTime(booking.updated_at)}</p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}