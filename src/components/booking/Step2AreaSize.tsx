interface Step2AreaSizeProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step2AreaSize({ value, onChange, onNext, onPrev }: Step2AreaSizeProps) {
  const areaSizes = [
    {
      id: 'under-10',
      label: '10평 이하',
      description: '~33㎡'
    },
    {
      id: '10-20',
      label: '10~20평',
      description: '33~66㎡'
    },
    {
      id: '20-30',
      label: '20~30평',
      description: '66~99㎡'
    },
    {
      id: '30-40',
      label: '30~40평',
      description: '99~132㎡'
    },
    {
      id: '40-50',
      label: '40~50평',
      description: '132~165㎡'
    },
    {
      id: 'over-50',
      label: '50평 이상',
      description: '165㎡~'
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
          시공하실 공간의 평수를 알려주세요
        </h2>
        <p className="text-gray-600">
          대략적인 평수를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {areaSizes.map((area) => (
          <button
            key={area.id}
            onClick={() => handleSelect(area.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value === area.id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {area.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {area.description}
                </p>
              </div>
              {value === area.id && (
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