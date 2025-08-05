'use client'

import { useEffect } from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingConsultButton from '@/components/FloatingConsultButton'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function Home() {
  // 페이지 로드 후 스크롤 위치 복원 방지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 스크롤 위치가 의도치 않게 변경되는 것을 방지
      window.history.scrollRestoration = 'manual'
      
      return () => {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingConsultButton />
      <ScrollToTopButton />
    </div>
  )
}