interface Step7TimelineProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step7Timeline({ value, onChange, onNext, onPrev }: Step7TimelineProps) {
  const timelines = [
    {
      id: 'immediately',
      label: '즉시 시작',
      description: '가능한 빠른 시일 내에'
    },
    {
      id: '1-month',
      label: '1개월 후',
      description: '1개월 정도 후에 시작'
    },
    {
      id: '2-3-months',
      label: '2~3개월 후',
      description: '2~3개월 정도 후에 시작'
    },
    {
      id: '3-6-months',
      label: '3~6개월 후',
      description: '3~6개월 정도 후에 시작'
    },
    {
      id: '6-months-later',
      label: '6개월 이후',
      description: '6개월 이후에 시작'
    },
    {
      id: 'undecided',
      label: '아직 미정',
      description: '시기는 상담을 통해 결정'
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
          인테리어가 언제 시작되길 희망하시나요?
        </h2>
        <p className="text-gray-600">
          희망 시기에 맞춰 일정을 조율해드립니다
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {timelines.map((timeline) => (
          <button
            key={timeline.id}
            onClick={() => handleSelect(timeline.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value === timeline.id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {timeline.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {timeline.description}
                </p>
              </div>
              {value === timeline.id && (
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