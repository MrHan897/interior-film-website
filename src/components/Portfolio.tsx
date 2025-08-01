'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Image from 'next/image'

interface Portfolio {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  tags: string[]
  created_at: string
}

// 기본 샘플 데이터
const defaultSampleData: Portfolio[] = [
  {
    id: '1',
    title: '모던 아파트 거실 리모델링',
    category: '주거 공간',
    description: '기존 벽면을 고급 우드 패턴 필름으로 변화시켜 따뜻하고 세련된 분위기를 연출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    tags: ['우드 패턴', '거실', '아파트'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: '카페 인테리어 필름 시공',
    category: '상업 공간',
    description: '브랜드 아이덴티티에 맞는 컬러와 패턴의 필름으로 독특한 분위기의 카페를 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    tags: ['브랜딩', '카페', '상업공간'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '주방 가구 리폼',
    category: '가구 리폼',
    description: '오래된 주방 가구를 마블 패턴 필름으로 리폼하여 고급스러운 주방으로 변화시켰습니다.',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    tags: ['마블 패턴', '주방', '가구'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: '사무실 파티션 필름',
    category: '상업 공간',
    description: '프라이버시 보호와 동시에 개방감을 유지하는 반투명 필름으로 사무 공간을 구성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    tags: ['프라이버시', '사무실', '파티션'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: '침실 벽면 아트 필름',
    category: '주거 공간',
    description: '포인트 벽면에 아트 패턴 필름을 적용하여 개성있는 침실 공간을 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
    tags: ['아트 패턴', '침실', '포인트 벽'],
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    title: '매장 외벽 브랜딩',
    category: '상업 공간',
    description: '매장 외벽에 브랜드 컬러와 로고를 적용한 필름으로 강력한 브랜딩 효과를 창출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['브랜딩', '외벽', '매장'],
    created_at: new Date().toISOString()
  }
]

const Portfolio = memo(function Portfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(defaultSampleData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const hasFetched = useRef(false)

  const fetchPortfolios = useCallback(async () => {
    if (loading || hasFetched.current) return // 이미 로딩 중이거나 가져온 적이 있으면 중복 호출 방지
    
    hasFetched.current = true
    
    setLoading(true)
    setError(null)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch('/api/portfolio', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        setPortfolios(data)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to fetch portfolios:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated')
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { 
      threshold: 0.1,
      rootMargin: '50px'
    })

    const currentSection = sectionRef.current
    const currentCards = cardsRef.current

    if (currentSection) {
      observer.observe(currentSection)
    }

    currentCards.forEach((card, index) => {
      if (card) {
        card.style.animationDelay = `${index * 150}ms`
        observer.observe(card)
      }
    })

    return () => {
      if (currentSection) observer.unobserve(currentSection)
      currentCards.forEach(card => card && observer.unobserve(card))
      observer.disconnect()
    }
  }, [handleIntersection, portfolios.length])

  return (
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div 
          ref={sectionRef}
          className="mx-auto max-w-2xl text-center scroll-animate"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600">포트폴리오</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            완성된 프로젝트들
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            다양한 공간에서 진행한 필름 시공 프로젝트들을 확인해보세요.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="ml-3 text-gray-500">포트폴리오를 불러오는 중...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-2">포트폴리오를 불러오는 데 실패했습니다.</div>
              <button 
                onClick={() => {
                  hasFetched.current = false
                  fetchPortfolios()
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio, index) => (
              <div 
                key={portfolio.id} 
                ref={(el) => { cardsRef.current[index] = el }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={portfolio.image_url}
                    alt={portfolio.title}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {portfolio.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {portfolio.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {portfolio.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            더 많은 프로젝트 보기
          </button>
        </div>
      </div>
    </section>
  )
})

export default Portfolio