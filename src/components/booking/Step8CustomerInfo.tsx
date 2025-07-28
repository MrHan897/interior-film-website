'use client'


interface CustomerInfo {
  name: string
  phone: string
  address: string
  requirements: string
  privacyConsent: boolean
}

interface Step8CustomerInfoProps {
  consultDate: string
  consultTime: string
  customerInfo: CustomerInfo
  onConsultDateChange: (value: string) => void
  onConsultTimeChange: (value: string) => void
  onCustomerInfoChange: (field: string, value: string | boolean) => void
  onSubmit: () => void
  onPrev: () => void
}

export default function Step8CustomerInfo({
  consultDate,
  consultTime,
  customerInfo,
  onConsultDateChange,
  onConsultTimeChange,
  onCustomerInfoChange,
  onSubmit,
  onPrev
}: Step8CustomerInfoProps) {
  const timeSlots = [
    { id: '09:00', label: '오전 9시' },
    { id: '10:00', label: '오전 10시' },
    { id: '11:00', label: '오전 11시' },
    { id: '13:00', label: '오후 1시' },
    { id: '14:00', label: '오후 2시' },
    { id: '15:00', label: '오후 3시' },
    { id: '16:00', label: '오후 4시' },
    { id: '17:00', label: '오후 5시' }
  ]

  // 오늘 날짜를 최소값으로 설정
  const today = new Date().toISOString().split('T')[0]

  const isFormValid = () => {
    return (
      consultDate &&
      consultTime &&
      customerInfo.name.trim() &&
      customerInfo.phone.trim() &&
      customerInfo.address.trim() &&
      customerInfo.privacyConsent
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          원하시는 상담 일정을 알려주세요
        </h2>
        <p className="text-gray-600">
          고객님의 소중한 정보는 오직 상담 목적으로만 활용됩니다
        </p>
      </div>

      <div className="space-y-8">
        {/* 상담 일정 선택 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">상담 일정</h3>
          
          {/* 날짜 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              희망 날짜 *
            </label>
            <input
              type="date"
              min={today}
              value={consultDate}
              onChange={(e) => onConsultDateChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* 시간 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              희망 시간 *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onConsultTimeChange(slot.id)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg border transition-colors
                    ${consultTime === slot.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    }
                  `}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 고객 정보 입력 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h3>
          
          <div className="space-y-4">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => onCustomerInfoChange('name', e.target.value)}
                placeholder="성함을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                휴대폰 번호 *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => onCustomerInfoChange('phone', e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 *
              </label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) => onCustomerInfoChange('address', e.target.value)}
                placeholder="시공 예정 주소를 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* 요청사항 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요청사항 (선택)
              </label>
              <textarea
                rows={4}
                value={customerInfo.requirements}
                onChange={(e) => onCustomerInfoChange('requirements', e.target.value)}
                placeholder="추가 요청사항이나 궁금한 점을 자유롭게 적어주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* 개인정보 수집 동의 */}
        <div className="bg-gray-50 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacy-consent"
              checked={customerInfo.privacyConsent}
              onChange={(e) => onCustomerInfoChange('privacyConsent', e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="privacy-consent" className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">[필수] 개인정보 수집 및 이용 동의</span>
              <br />
              상담 및 견적 제공을 위해 개인정보를 수집합니다. 수집된 정보는 상담 목적으로만 사용되며, 
              상담 완료 후 안전하게 폐기됩니다.
            </label>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-12 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          이전
        </button>
        
        <button
          onClick={onSubmit}
          disabled={!isFormValid()}
          className={`
            px-8 py-3 rounded-xl font-semibold transition-colors
            ${isFormValid()
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          상담 신청하기
        </button>
      </div>
    </div>
  )
}