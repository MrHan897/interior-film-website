interface Step1BuildingTypeProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
}

export default function Step1BuildingType({ value, onChange, onNext }: Step1BuildingTypeProps) {
  const buildingTypes = [
    {
      id: 'apartment',
      label: '아파트',
      description: '아파트, 분양 아파트'
    },
    {
      id: 'villa',
      label: '빌라',
      description: '빌라, 연립주택'
    },
    {
      id: 'house',
      label: '단독주택',
      description: '단독주택, 주택'
    },
    {
      id: 'officetel',
      label: '오피스텔',
      description: '오피스텔, 원룸'
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
          어떤 건물에서 인테리어 필름 시공을 원하시나요?
        </h2>
        <p className="text-gray-600">
          건물 유형을 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {buildingTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value === type.id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {type.description}
                </p>
              </div>
              {value === type.id && (
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

      {value && (
        <div className="mt-8 text-center">
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            다음 단계
          </button>
        </div>
      )}
    </div>
  )
}