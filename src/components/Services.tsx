'use client'

import { HomeIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef } from 'react'

const services = [
  {
    name: '주거 공간 필름',
    description: '아파트, 빌라, 단독주택 등 주거 공간의 벽면, 가구, 도어에 고품질 필름을 시공합니다.',
    icon: HomeIcon,
    features: ['벽면 필름', '가구 리폼', '도어 필름', '창호 필름']
  },
  {
    name: '상업 공간 필름',
    description: '사무실, 카페, 상점 등 상업 공간의 브랜딩과 분위기 연출을 위한 필름 시공 서비스입니다.',
    icon: CogIcon,
    features: ['브랜딩 필름', '인테리어 필름', '프라이버시 필름', '데코레이션 필름']
  },
  {
    name: '시공 보증 서비스',
    description: 'A/S 보증과 함께 안전하고 깔끔한 시공을 약속드립니다. 전문 시공팀이 책임집니다.',
    icon: ShieldCheckIcon,
    features: ['1년 A/S 보증', '전문 시공팀', '무료 견적', '사후 관리']
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.animationDelay = `${index * 200}ms`
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div 
          ref={sectionRef}
          className="mx-auto max-w-2xl text-center scroll-animate"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600">서비스</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            전문 인테리어 필름 시공 서비스
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            다양한 공간에 최적화된 필름 솔루션을 제공합니다. 
            전문 시공팀이 완벽한 마감을 위해 최선을 다합니다.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {services.map((service, index) => (
              <div 
                key={service.name} 
                ref={(el) => { cardsRef.current[index] = el }}
                className="flex flex-col scroll-animate bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white border border-gray-100"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 transition-transform duration-300 group-hover:scale-110">
                    <service.icon className="h-6 w-6 flex-none text-white" aria-hidden="true" />
                  </div>
                  {service.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{service.description}</p>
                  <div className="mt-6">
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-x-2">
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}