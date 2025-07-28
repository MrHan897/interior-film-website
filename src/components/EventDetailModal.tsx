'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface EventData {
  id: string
  event_type: string
  title: string
  description?: string
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  location?: string
  attendees?: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  assigned_to?: string
  client_company?: string
  contact_person?: string
  contact_phone?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

interface EventDetailModalProps {
  isOpen: boolean
  onClose: () => void
  event: EventData | null
  onStatusUpdate?: (eventId: string, newStatus: string) => void
}

export default function EventDetailModal({
  isOpen,
  onClose,
  event,
  onStatusUpdate
}: EventDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  if (!isOpen || !event) return null

  const getEventTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      b2b: 'B2B 업무',
      personal_support: '개인지원',
      work_schedule: '작업일정',
      company_event: '회사행사',
      meeting: '회의',
      other: '기타'
    }
    return labels[type] || type
  }

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      low: '낮음',
      medium: '보통',
      high: '높음',
      urgent: '긴급'
    }
    return labels[priority] || priority
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      scheduled: '예정',
      in_progress: '진행중',
      completed: '완료',
      cancelled: '취소',
      postponed: '연기'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      postponed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    }
    return colors[priority] || 'text-gray-600'
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (isUpdating || !onStatusUpdate) return
    setIsUpdating(true)
    await onStatusUpdate(event.id, newStatus)
    setIsUpdating(false)
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
            <h2 className="text-2xl font-bold text-gray-900">일정 상세 정보</h2>
            <p className="text-sm text-gray-500 mt-1">
              일정 번호: {event.id.slice(0, 8)}...
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
          {/* 기본 정보 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">일정 유형</label>
                <p className="font-medium text-gray-900">{getEventTypeLabel(event.event_type)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">우선순위</label>
                <p className={`font-medium ${getPriorityColor(event.priority)}`}>
                  {getPriorityLabel(event.priority)}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">제목</label>
                <p className="font-medium text-gray-900">{event.title}</p>
              </div>
              {event.description && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">설명</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* 일정 정보 */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">일정 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">시작 날짜</label>
                <p className="font-medium text-gray-900">{formatDate(event.start_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">시작 시간</label>
                <p className="font-medium text-gray-900">{event.start_time}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">종료 날짜</label>
                <p className="font-medium text-gray-900">{formatDate(event.end_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">종료 시간</label>
                <p className="font-medium text-gray-900">{event.end_time}</p>
              </div>
              {event.location && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">장소</label>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* B2B 정보 (B2B 타입인 경우만) */}
          {event.event_type === 'b2b' && (event.client_company || event.contact_person || event.contact_phone) && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">B2B 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.client_company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">고객 회사</label>
                    <p className="font-medium text-gray-900">{event.client_company}</p>
                  </div>
                )}
                {event.contact_person && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">담당자</label>
                    <p className="font-medium text-gray-900">{event.contact_person}</p>
                  </div>
                )}
                {event.contact_phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">연락처</label>
                    <p className="font-medium text-gray-900">{event.contact_phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 담당자 및 참석자 */}
          {(event.assigned_to || event.attendees?.length) && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">담당자 및 참석자</h3>
              <div className="space-y-4">
                {event.assigned_to && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">담당자</label>
                    <p className="font-medium text-gray-900">{event.assigned_to}</p>
                  </div>
                )}
                {event.attendees && event.attendees.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">참석자</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.attendees.map((attendee, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 상태 및 메모 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">상태 및 메모</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">현재 상태</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {getStatusLabel(event.status)}
                </span>
              </div>
              {event.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">메모</label>
                  <p className="text-gray-700 whitespace-pre-wrap mt-1">{event.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* 상태 변경 버튼 */}
          {onStatusUpdate && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">상태 변경</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button
                  onClick={() => handleStatusUpdate('scheduled')}
                  disabled={event.status === 'scheduled' || isUpdating}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    event.status === 'scheduled'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  예정
                </button>
                <button
                  onClick={() => handleStatusUpdate('in_progress')}
                  disabled={event.status === 'in_progress' || isUpdating}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    event.status === 'in_progress'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  }`}
                >
                  진행중
                </button>
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={event.status === 'completed' || isUpdating}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    event.status === 'completed'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  완료
                </button>
                <button
                  onClick={() => handleStatusUpdate('postponed')}
                  disabled={event.status === 'postponed' || isUpdating}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    event.status === 'postponed'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  연기
                </button>
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={event.status === 'cancelled' || isUpdating}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    event.status === 'cancelled'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 생성/수정 시간 */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p>생성일: {formatDateTime(event.created_at)}</p>
            <p>수정일: {formatDateTime(event.updated_at)}</p>
            <p>작성자: {event.created_by}</p>
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