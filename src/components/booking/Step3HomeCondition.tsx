interface Step3HomeConditionProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step3HomeCondition({ value, onChange, onNext, onPrev }: Step3HomeConditionProps) {
  const conditions = [
    {
      id: 'living-with-construction',
      label: '짐 보관 후 살면서 공사 예정',
      description: '거주하면서 부분적으로 시공'
    },
    {
      id: 'new-construction',
      label: '신축 입주 예정',
      description: '새로 지어진 집에 입주 전 시공'
    },
    {
      id: 'empty-house',
      label: '빈집에서 공사 예정',
      description: '완전히 비운 상태에서 시공'
    },
    {
      id: 'moving-out',
      label: '이사 나가면서 공사',
      description: '이사와 함께 진행하는 시공'
    },
    {
      id: 'partial-renovation',
      label: '부분 보수 공사',
      description: '특정 부위만 시공'
    },
    {
      id: 'consultation-needed',
      label: '상담 후 결정',
      description: '전문가와 상담 후 방법 결정'
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
          인테리어할 집의 상태를 알려주세요
        </h2>
        <p className="text-gray-600">
          시공 환경에 따라 최적의 방법을 제안해드립니다
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {conditions.map((condition) => (
          <button
            key={condition.id}
            onClick={() => handleSelect(condition.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value === condition.id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {condition.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {condition.description}
                </p>
              </div>
              {value === condition.id && (
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