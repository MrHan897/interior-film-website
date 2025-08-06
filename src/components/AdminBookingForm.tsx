'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface AdminBookingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { [key: string]: string | boolean | Date }) => void
  selectedDate: Date | null
  isEmbedded?: boolean
}

export default function AdminBookingForm({ isOpen, onClose, onSubmit, selectedDate, isEmbedded = false }: AdminBookingFormProps) {
  const [formData, setFormData] = useState({
    // 고객 정보
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_requirements: '',
    
    // 시공 정보
    building_type: 'apartment',
    area_size: '',
    home_condition: '신축',
    reason: '새집 인테리어',
    spaces: [] as string[],
    budget: '',
    timeline: 'within-month',
    
    // 상담 일정
    consult_date: '',
    consult_time: '09:00',
    
    // 상태
    status: 'pending',
    privacy_consent: true
  })

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        consult_date: format(selectedDate, 'yyyy-MM-dd')
      }))
    }
  }, [selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      customer_requirements: '',
      building_type: 'apartment',
      area_size: '',
      home_condition: '신축',
      reason: '새집 인테리어',
      spaces: [],
      budget: '',
      timeline: 'within-month',
      consult_date: '',
      consult_time: '09:00',
      status: 'pending',
      privacy_consent: true
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checkboxValue = (e.target as HTMLInputElement).checked
      if (name === 'spaces') {
        const currentSpaces = formData.spaces
        if (checkboxValue) {
          setFormData({ ...formData, spaces: [...currentSpaces, value] })
        } else {
          setFormData({ ...formData, spaces: currentSpaces.filter(space => space !== value) })
        }
      } else {
        setFormData({ ...formData, [name]: checkboxValue })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const spaceOptions = [
    '거실', '안방', '방1', '방2', '방3', '주방', '화장실', '현관', '베란다', '기타'
  ]

  if (!isOpen) return null

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
          {/* 고객 정보 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                  고객명 *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
              <div>
                <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  연락처 *
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="customer_address" className="block text-sm font-medium text-gray-700 mb-1">
                  주소 *
                </label>
                <input
                  type="text"
                  id="customer_address"
                  name="customer_address"
                  required
                  value={formData.customer_address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* 상담 일정 */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">상담 일정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="consult_date" className="block text-sm font-medium text-gray-700 mb-1">
                  상담 날짜 *
                </label>
                <input
                  type="date"
                  id="consult_date"
                  name="consult_date"
                  required
                  value={formData.consult_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
              <div>
                <label htmlFor="consult_time" className="block text-sm font-medium text-gray-700 mb-1">
                  상담 시간 *
                </label>
                <select
                  id="consult_time"
                  name="consult_time"
                  required
                  value={formData.consult_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                >
                  <option value="09:00">오전 9시</option>
                  <option value="10:00">오전 10시</option>
                  <option value="11:00">오전 11시</option>
                  <option value="13:00">오후 1시</option>
                  <option value="14:00">오후 2시</option>
                  <option value="15:00">오후 3시</option>
                  <option value="16:00">오후 4시</option>
                  <option value="17:00">오후 5시</option>
                </select>
              </div>
            </div>
          </div>

          {/* 시공 정보 */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">시공 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="building_type" className="block text-sm font-medium text-gray-700 mb-1">
                  건물 유형 *
                </label>
                <select
                  id="building_type"
                  name="building_type"
                  required
                  value={formData.building_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                >
                  <option value="apartment">아파트</option>
                  <option value="villa">빌라</option>
                  <option value="house">단독주택</option>
                  <option value="officetel">오피스텔</option>
                </select>
              </div>
              <div>
                <label htmlFor="area_size" className="block text-sm font-medium text-gray-700 mb-1">
                  시공 면적
                </label>
                <input
                  type="text"
                  id="area_size"
                  name="area_size"
                  value={formData.area_size}
                  onChange={handleChange}
                  placeholder="예: 30평, 100㎡"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  예산 범위
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                >
                  <option value="">선택해주세요</option>
                  <option value="under-100">100만원 이하</option>
                  <option value="100-300">100-300만원</option>
                  <option value="300-500">300-500만원</option>
                  <option value="500-1000">500-1000만원</option>
                  <option value="over-1000">1000만원 이상</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  예약 상태 *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                >
                  <option value="pending">대기</option>
                  <option value="confirmed">확정</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
            </div>

            {/* 시공 공간 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시공 공간 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {spaceOptions.map((space) => (
                  <label key={space} className="flex items-center">
                    <input
                      type="checkbox"
                      name="spaces"
                      value={space}
                      checked={formData.spaces.includes(space)}
                      onChange={handleChange}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{space}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">추가 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="home_condition" className="block text-sm font-medium text-gray-700 mb-1">
                  집 상태
                </label>
                <input
                  type="text"
                  id="home_condition"
                  name="home_condition"
                  value={formData.home_condition}
                  onChange={handleChange}
                  placeholder="예: 신축, 구축, 리모델링"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  시공 이유
                </label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="예: 새집 인테리어, 노후화"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-600"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="customer_requirements" className="block text-sm font-medium text-gray-700 mb-1">
                고객 요청사항
              </label>
              <textarea
                id="customer_requirements"
                name="customer_requirements"
                rows={3}
                value={formData.customer_requirements}
                onChange={handleChange}
                placeholder="고객의 특별 요청사항이나 참고사항을 입력해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          예약 등록
        </button>
      </div>
    </form>
  )

  if (isEmbedded) {
    return formContent
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">관리자 예약 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {formContent}
        </div>
      </div>
    </div>
  )
}