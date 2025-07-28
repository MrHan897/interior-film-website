interface Step4ReasonProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step4Reason({ value, onChange, onNext, onPrev }: Step4ReasonProps) {
  const reasons = [
    {
      id: 'moving',
      label: '이사로 인한 인테리어',
      description: '새 집으로 이사하면서 분위기 변경'
    },
    {
      id: 'aging',
      label: '기존 인테리어 노후화',
      description: '오래된 벽지나 마감재 교체 필요'
    },
    {
      id: 'mood-change',
      label: '분위기 변경',
      description: '새로운 스타일로 공간 변화'
    },
    {
      id: 'function-improvement',
      label: '기능 개선',
      description: '실용성과 편의성 향상'
    },
    {
      id: 'maintenance',
      label: '유지보수',
      description: '손상된 부분 보수'
    },
    {
      id: 'investment',
      label: '자산 가치 향상',
      description: '집값 상승을 위한 투자'
    },
    {
      id: 'family-change',
      label: '가족 구성 변화',
      description: '출산, 결혼 등으로 인한 공간 변화'
    },
    {
      id: 'other',
      label: '기타',
      description: '직접 상담을 통해 설명'
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
          인테리어를 고려하게 된 주요 이유는 무엇인가요?
        </h2>
        <p className="text-gray-600">
          목적에 맞는 최적의 솔루션을 제안해드립니다
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reasons.map((reason) => (
          <button
            key={reason.id}
            onClick={() => handleSelect(reason.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value === reason.id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {reason.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {reason.description}
                </p>
              </div>
              {value === reason.id && (
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