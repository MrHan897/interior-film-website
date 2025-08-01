'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useCallback, memo } from 'react'

const Hero = memo(function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up')
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { 
      threshold: 0.1,
      rootMargin: '50px'
    })

    const currentRef = heroRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [handleIntersection])

  return (
    <section 
      ref={heroRef}
      className="relative isolate px-4 sm:px-6 pt-14 lg:px-8 h-[70vh] min-h-[500px] max-h-[800px] flex items-center opacity-0 transform translate-y-10 transition-all duration-1000"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 128, 181, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(144, 137, 252, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)
        `,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      {/* 로고 백그라운드 */}
      <div className="absolute inset-0 -z-20 flex items-center justify-center">
        <Image 
          src="/logo.png" 
          alt="꾸미다필름 로고" 
          width={384}
          height={384}
          className="object-contain opacity-5 blur-sm"
          priority={false}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      {/* 3D 인테리어 도구 백그라운드 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* 대형 배경 오브 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* 3D 시공 도구들 - 은은하게 표현 */}
        {/* 헤라 (스퀴지) */}
        <div 
          className="absolute top-16 left-20 opacity-20"
          style={{ 
            animation: 'float 8s ease-in-out infinite',
            transform: 'perspective(1000px) rotateX(30deg) rotateY(-20deg)'
          }}
        >
          <div className="w-24 h-6 bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg shadow-lg"></div>
          <div className="w-4 h-12 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full mx-auto -mt-2"></div>
        </div>

        {/* 커터 나이프 */}
        <div 
          className="absolute top-1/3 right-16 opacity-15"
          style={{ 
            animation: 'particle-drift 10s ease-in-out infinite 1s',
            transform: 'perspective(1000px) rotateX(-15deg) rotateY(25deg)'
          }}
        >
          <div className="w-20 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
          <div className="w-8 h-1 bg-gradient-to-r from-gray-300 to-gray-100 mx-auto mt-1"></div>
        </div>

        {/* 측정 도구 (자) */}
        <div 
          className="absolute bottom-1/4 left-1/4 opacity-25"
          style={{ 
            animation: 'float 12s ease-in-out infinite 2s',
            transform: 'perspective(1000px) rotateX(45deg) rotateZ(-10deg)'
          }}
        >
          <div className="w-32 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-sm">
            <div className="h-full bg-repeating-linear-gradient w-full" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)'
            }}></div>
          </div>
        </div>

        {/* 히트건 */}
        <div 
          className="absolute top-2/3 right-1/3 opacity-20"
          style={{ 
            animation: 'particle-drift 9s ease-in-out infinite 3s',
            transform: 'perspective(1000px) rotateX(20deg) rotateY(-30deg)'
          }}
        >
          <div className="w-16 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"></div>
          <div className="w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full mx-auto -mt-1"></div>
          <div className="w-6 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto opacity-60 animate-pulse"></div>
        </div>

        {/* 롤러 */}
        <div 
          className="absolute bottom-20 right-20 opacity-30"
          style={{ 
            animation: 'float 7s ease-in-out infinite 4s',
            transform: 'perspective(1000px) rotateX(-25deg) rotateY(15deg)'
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
          <div className="w-2 h-16 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full mx-auto -mt-2"></div>
        </div>

        {/* 필름 롤 */}
        <div 
          className="absolute top-40 left-1/2 opacity-15"
          style={{ 
            animation: 'particle-drift 11s ease-in-out infinite 5s',
            transform: 'perspective(1000px) rotateX(60deg) rotateY(-45deg)'
          }}
        >
          <div className="w-6 h-20 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full shadow-lg"></div>
          <div className="w-8 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mx-auto -mt-1"></div>
        </div>

        {/* 스크래퍼 */}
        <div 
          className="absolute bottom-1/3 right-1/4 opacity-20"
          style={{ 
            animation: 'float 6s ease-in-out infinite 6s',
            transform: 'perspective(1000px) rotateX(-30deg) rotateY(40deg)'
          }}
        >
          <div className="w-16 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-sm"></div>
          <div className="w-3 h-8 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mx-auto -mt-1"></div>
        </div>

        {/* 필름 샘플 */}
        <div 
          className="absolute top-1/4 right-1/3 opacity-10"
          style={{ 
            animation: 'particle-drift 13s ease-in-out infinite 7s',
            transform: 'perspective(1000px) rotateX(15deg) rotateY(-35deg)'
          }}
        >
          <div className="w-10 h-14 bg-gradient-to-br from-slate-300 to-slate-400 rounded-md shadow-md relative">
            <div className="absolute inset-1 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-sm"></div>
          </div>
        </div>

        {/* 더블 사이드 테이프 */}
        <div 
          className="absolute bottom-40 left-1/3 opacity-15"
          style={{ 
            animation: 'float 9s ease-in-out infinite 8s',
            transform: 'perspective(1000px) rotateX(50deg) rotateY(-20deg)'
          }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full"></div>
          <div className="w-1 h-4 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mx-auto -mt-1"></div>
        </div>
        
        {/* 움직이는 파티클들 */}
        <div 
          className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full"
          style={{ animation: 'particle-drift 6s ease-in-out infinite' }}
        ></div>
        <div 
          className="absolute top-20 right-20 w-6 h-6 bg-blue-400/30 rounded-full"
          style={{ animation: 'particle-drift 8s ease-in-out infinite 0.5s' }}
        ></div>
        <div 
          className="absolute top-1/3 left-1/5 w-3 h-3 bg-purple-400/40 rounded-full"
          style={{ animation: 'float 7s ease-in-out infinite 1s' }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/3 w-5 h-5 bg-pink-400/30 rounded-full"
          style={{ animation: 'particle-drift 9s ease-in-out infinite 1.5s' }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-cyan-400/35 rounded-full"
          style={{ animation: 'float 6.5s ease-in-out infinite 2s' }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-3 h-3 bg-white/25 rounded-full"
          style={{ animation: 'particle-drift 7.5s ease-in-out infinite 2.5s' }}
        ></div>
        <div 
          className="absolute top-1/2 left-10 w-2 h-2 bg-indigo-400/40 rounded-full"
          style={{ animation: 'float 8.5s ease-in-out infinite 3s' }}
        ></div>
        <div 
          className="absolute top-3/4 left-2/3 w-6 h-6 bg-purple-300/20 rounded-full"
          style={{ animation: 'particle-drift 6.8s ease-in-out infinite 3.5s' }}
        ></div>
        
        {/* 추가 작은 파티클들 */}
        <div 
          className="absolute top-40 left-1/2 w-1 h-1 bg-white/30 rounded-full"
          style={{ animation: 'float 5s ease-in-out infinite 4s' }}
        ></div>
        <div 
          className="absolute bottom-40 right-1/4 w-2 h-2 bg-blue-300/25 rounded-full"
          style={{ animation: 'particle-drift 7.2s ease-in-out infinite 4.5s' }}
        ></div>
      </div>

      {/* 3D 메쉬 패턴 */}
      <div 
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(1000px) rotateX(45deg) scale(2)',
          animation: 'float 8s ease-in-out infinite'
        }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full relative z-10 text-center">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center opacity-0 animate-fade-in delay-500">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white/80 ring-1 ring-white/20 hover:ring-white/40 backdrop-blur-sm bg-white/10 transition-all duration-300 hover:scale-105 text-center">
            전문 인테리어 필름 시공 서비스{' '}
            <Link href="#services" className="font-semibold text-blue-300 hover:text-blue-200">
              <span className="absolute inset-0" aria-hidden="true" />
              더 알아보기 <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white opacity-0 animate-fade-in delay-700 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x block">공간을 변화시키는</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x block">프리미엄 필름</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/80 opacity-0 animate-fade-in delay-1000 text-center mx-auto max-w-2xl">
            <span className="block">꾸미다필름과 함께 특별한 공간을 만들어보세요.</span>
            <span className="block">상담부터 시공까지 완벽한 마감을 약속드립니다.</span>
          </p>
          <div className="mt-10 flex items-center justify-center opacity-0 animate-fade-in delay-1300">
            <Link
              href="/booking"
              className="relative group rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-center"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">상담 신청하기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 그라데이션 효과 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
  )
})

export default Hero