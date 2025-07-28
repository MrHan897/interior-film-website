interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 단계 표시 */}
      <div className="text-center mb-4">
        <span className="text-sm font-semibold text-gray-500">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 단계 제목들 */}
      <div className="flex justify-between mt-4 text-xs text-gray-400">
        <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : ''}>
          건물선택
        </span>
        <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : ''}>
          평수선택
        </span>
        <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : ''}>
          집상태
        </span>
        <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : ''}>
          이유
        </span>
        <span className={currentStep >= 5 ? 'text-blue-600 font-semibold' : ''}>
          공간선택
        </span>
        <span className={currentStep >= 6 ? 'text-blue-600 font-semibold' : ''}>
          예산
        </span>
        <span className={currentStep >= 7 ? 'text-blue-600 font-semibold' : ''}>
          일정
        </span>
        <span className={currentStep >= 8 ? 'text-blue-600 font-semibold' : ''}>
          정보입력
        </span>
      </div>
    </div>
  )
}