interface Step5SpacesProps {
  value: string[]
  onChange: (value: string[]) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step5Spaces({ value, onChange, onNext, onPrev }: Step5SpacesProps) {
  const spaces = [
    {
      id: 'living-room',
      label: '거실',
      description: '거실 벽면, TV벽 등'
    },
    {
      id: 'kitchen',
      label: '주방',
      description: '주방 가구, 싱크대 등'
    },
    {
      id: 'bedroom',
      label: '침실',
      description: '안방, 자녀방 등'
    },
    {
      id: 'bathroom',
      label: '화장실',
      description: '욕실, 세면대 등'
    },
    {
      id: 'entrance',
      label: '현관',
      description: '현관문, 신발장 등'
    },
    {
      id: 'study',
      label: '서재/공부방',
      description: '책상, 서재 공간 등'
    },
    {
      id: 'balcony',
      label: '베란다/발코니',
      description: '베란다, 확장 공간 등'
    },
    {
      id: 'storage',
      label: '수납공간',
      description: '옷장, 창고 등'
    }
  ]

  const handleToggle = (spaceId: string) => {
    if (value.includes(spaceId)) {
      onChange(value.filter(id => id !== spaceId))
    } else {
      onChange([...value, spaceId])
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          인테리어가 필요한 공간을 모두 선택해주세요
        </h2>
        <p className="text-gray-600">
          여러 공간을 선택할 수 있습니다
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => handleToggle(space.id)}
            className={`
              relative p-6 text-left rounded-2xl border-2 transition-all duration-200 hover:scale-105
              ${value.includes(space.id)
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {space.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {space.description}
                </p>
              </div>
              {value.includes(space.id) && (
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

      {value.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{value.length}개 공간</span>이 선택되었습니다
          </p>
        </div>
      )}

      {/* 고정된 하단 버튼 영역 */}
      <div className="mt-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={onPrev}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            이전
          </button>
          
          <div className="text-center">
            {value.length > 0 ? (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-blue-600">{value.length}개 공간</span> 선택됨
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-2">
                공간을 선택해주세요
              </p>
            )}
          </div>
          
          <button
            onClick={onNext}
            disabled={value.length === 0}
            className={`
              px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform
              ${value.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            다음 단계
          </button>
        </div>
      </div>
    </div>
  )
}