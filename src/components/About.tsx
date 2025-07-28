import { CheckCircleIcon } from '@heroicons/react/24/outline'

const stats = [
  { label: '완료 프로젝트', value: '500+' },
  { label: '만족 고객', value: '400+' },
  { label: '시공 경험', value: '5년+' },
  { label: 'A/S 보증', value: '1년' },
]

const features = [
  {
    name: '프리미엄 필름 소재',
    description: '국내외 유명 브랜드의 고품질 필름만을 사용하여 내구성과 완성도를 보장합니다.',
  },
  {
    name: '전문 시공팀',
    description: '5년 이상의 경험을 가진 전문 시공팀이 정확하고 깔끔한 시공을 진행합니다.',
  },
  {
    name: '맞춤형 솔루션',
    description: '고객의 공간과 요구사항에 맞는 최적의 필름 솔루션을 제안합니다.',
  },
  {
    name: '완벽한 A/S',
    description: '시공 완료 후 1년간 무상 A/S를 제공하여 고객만족을 최우선으로 합니다.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">회사소개</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            전문가 윤정은과 함께하는 공간 변화
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            인테리어 필름 시공 전문가 윤정은 대표가 직접 상담부터 시공까지 책임지며, 
            공간을 만드는 손길로 고객의 꿈을 현실로 만들어드립니다.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-400/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
              <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">{stat.value}</dd>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 max-w-2xl mx-auto lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="lg:pr-8">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                왜 꾸미다필름를 선택해야 할까요?
              </h3>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                최고의 품질과 서비스로 고객만족을 실현하는 인테리어 필름 전문 업체입니다.
              </p>
              <dl className="mt-8 space-y-6">
                {features.map((feature) => (
                  <div key={feature.name} className="flex gap-x-3">
                    <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    <div>
                      <dt className="font-semibold text-gray-900">{feature.name}</dt>
                      <dd className="text-gray-600">{feature.description}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:pl-8">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  시공 프로세스
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">상담 및 견적</h5>
                      <p className="text-sm text-gray-600">현장 방문을 통한 정확한 상담과 견적 제공</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">필름 선택</h5>
                      <p className="text-sm text-gray-600">다양한 필름 샘플을 통한 최적의 선택</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">전문 시공</h5>
                      <p className="text-sm text-gray-600">숙련된 전문가의 정확하고 깔끔한 시공</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">완료 및 A/S</h5>
                      <p className="text-sm text-gray-600">시공 완료 후 1년간 무상 A/S 제공</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}