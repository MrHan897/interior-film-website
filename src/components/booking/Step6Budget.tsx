interface Step6BudgetProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step6Budget({ value, onChange, onNext, onPrev }: Step6BudgetProps) {
  const budgets = [
    {
      id: 'under-100',
      label: '100만원 이하',
      description: '간단한 부분 시공'
    },
    {
      id: '100-300',
      label: '100~300만원',
      description: '1~2개 공간 시공'
    },
    {
      id: '300-500',
      label: '300~500만원',
      description: '여러 공간 시공'
    },
    {
      id: '500-1000',
      label: '500~1000만원',
      description: '전체적인 인테리어'
    },
    {
      id: '1000-2000',
      label: '1000~2000만원',
      description: '고급 소재 및 전문 시공'
    },
    {
      id: 'over-2000',
      label: '2000만원 이상',
      description: '프리미엄 인테리어'
    },
    {
      id: 'consultation',
      label: '상담 후 결정',
      description: '견적을 받아본 후 결정'
    }
  ]

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    // 선택 후 자동으로 다음 단계로
    setTimeout(() => {
      onNext()
    }, 300)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          인테리어 예산은 총 얼마를 생각하고 계시나요?
        </h2>
        <p className="text-gray-600">
          대략적인 예산 범위를 알려주시면 맞춤 견적을 제공해드립니다
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {budgets.map((budget) => (
          <button
            key={budget.id}
            onClick={() => handleSelect(budget.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value === budget.id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {budget.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {budget.description}
                </p>
              </div>
              {value === budget.id && (
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          이전
        </button>
        
        {value && (
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            다음 단계
          </button>
        )}
      </div>
    </div>
  )
}