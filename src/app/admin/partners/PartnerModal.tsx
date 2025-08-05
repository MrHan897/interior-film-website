'use client'

import { useState, useEffect } from 'react'

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

const PartnerModal = ({ 
  partner, 
  isOpen, 
  onClose, 
  onSubmit,
  mode 
}: { 
  partner: Partner | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (partnerData: Partner) => void
  mode: 'view' | 'edit' | 'create'
}) => {
  const [editData, setEditData] = useState<Partner | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEditable = mode === 'edit' || mode === 'create'
  
  // 편집 모드일 때 데이터 초기화
  useEffect(() => {
    if (isEditable) {
      setEditData(partner)
    } else {
      setEditData(null)
    }
  }, [isEditable, partner, mode])
  
  const handleInputChange = (field: keyof Partner, value: string | number | string[]) => {
    if (!isEditable || !editData) return
    setEditData({ ...editData, [field]: value })
  }

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    
    if (!editData) {
      alert('폼 데이터를 불러올 수 없습니다.')
      return
    }
    
    if (isSubmitting) return

    // 폼 검증
    const errors = validatePartnerForm(editData)
    if (errors.length > 0) {
      alert('다음 항목을 확인해주세요:\n' + errors.join('\n'))
      return
    }

    setIsSubmitting(true)
    try {
      onSubmit(editData)
    } catch (error) {
      alert('협력업체 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validatePartnerForm = (data: Partner): string[] => {
    const errors: string[] = []
    
    if (!data.companyName?.trim()) errors.push('• 업체명을 입력해주세요')
    if (!data.contactPerson?.trim()) errors.push('• 담당자명을 입력해주세요')
    if (!data.phone?.trim()) errors.push('• 연락처를 입력해주세요')
    if (!data.address?.trim()) errors.push('• 주소를 입력해주세요')
    if (!data.businessType) errors.push('• 업체 유형을 선택해주세요')
    
    return errors
  }
  
  if (!isOpen) return null

  const currentData = isEditable ? (editData || partner) : partner

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? '새 협력업체 등록' : mode === 'edit' ? '협력업체 수정' : '협력업체 상세'}
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
          {partner && (
            <>
              {/* 기본 정보 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">기본정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">업체명</label>
                    <input
                      type="text"
                      value={currentData?.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '예: (주)프리미엄 필름' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                    <input
                      type="text"
                      value={currentData?.contactPerson || ''}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '예: 이재호 이사' : ''}
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
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '02-1234-5678' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                      type="email"
                      value={currentData?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? 'contact@company.co.kr' : ''}
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
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={mode === 'create' ? '서울시 강남구 테헤란로 123' : ''}
                    />
                  </div>
                </div>
              </section>

              {/* 업체 정보 */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">업체정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">업체 유형</label>
                    <select
                      value={currentData?.businessType || ''}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="supplier">공급업체</option>
                      <option value="contractor">시공업체</option>
                      <option value="distributor">유통업체</option>
                      <option value="installer">설치업체</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <select
                      value={currentData?.status || 'active'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={!isEditable}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !isEditable 
                          ? 'bg-gray-50 text-gray-500 border-gray-300' 
                          : mode === 'create' 
                            ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                      <option value="suspended">중단</option>
                    </select>
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
                      ? 'bg-gray-50 text-gray-500 border-gray-300' 
                      : mode === 'create' 
                        ? 'bg-blue-50 border-blue-300 text-gray-900 placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={mode === 'create' ? '업체 특징이나 참고사항을 입력하세요' : ''}
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
                    ? '협력업체 등록' 
                    : '수정 완료'
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerModal