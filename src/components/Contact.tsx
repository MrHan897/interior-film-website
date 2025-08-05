'use client'

import { useState, useEffect, useRef } from 'react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    serviceType: 'apartment'
  })

  const sectionRef = useRef<HTMLElement>(null)
  const contactInfoRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

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

    if (sectionRef.current) observer.observe(sectionRef.current)
    if (contactInfoRef.current) observer.observe(contactInfoRef.current)
    if (formRef.current) observer.observe(formRef.current)

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultation_type: 'phone_consult',
          name: formData.name,
          phone: formData.phone,
          serviceType: formData.serviceType,
          message: formData.message
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || '전화상담 요청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.')
        setFormData({
          name: '',
          phone: '',
          message: '',
          serviceType: 'apartment'
        })
      } else {
        alert(result.error || '요청 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div 
          ref={sectionRef}
          className="mx-auto max-w-2xl text-center scroll-animate"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600">전화상담요청</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            언제든지 연락주세요
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            궁금한 사항이나 견적 문의가 있으시면 언제든지 연락주세요. 
            전문 상담을 통해 최적의 솔루션을 제안해드립니다.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div 
            ref={contactInfoRef}
            className="bg-white rounded-2xl p-8 shadow-sm scroll-animate hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: '200ms' }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">연락처 정보</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <PhoneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">전화번호</p>
                  <p className="text-gray-600">010-4781-8012</p>
                  <p className="text-sm text-gray-500">평일 09:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <EnvelopeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">이메일</p>
                  <p className="text-gray-600">interior.film.yj@gmail.com</p>
                  <p className="text-sm text-gray-500">24시간 문의 가능</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">주소</p>
                  <p className="text-gray-600">서울시 강남구 테헤란로 123</p>
                  <p className="text-sm text-gray-500">꾸미다필름 빌딩 5층</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2">빠른 상담 신청</h4>
              <p className="text-sm text-gray-600 mb-4">
                카카오톡 채널을 통해 더 빠른 상담을 받아보세요.
              </p>
              <button 
                onClick={() => window.open('https://open.kakao.com/o/sUR8xKPe', '_blank')}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 px-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                카카오톡 상담하기
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            ref={formRef}
            className="bg-white rounded-2xl p-8 shadow-sm scroll-animate hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: '400ms' }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">전화상담요청</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900 placeholder-gray-400"
                />
              </div>


              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  전화번호 *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                  건물 유형
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900 placeholder-gray-400"
                >
                  <option value="apartment">아파트</option>
                  <option value="villa">빌라</option>
                  <option value="house">단독주택</option>
                  <option value="officetel">오피스텔</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  문의 내용 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900 placeholder-gray-400"
                  placeholder="시공 위치, 면적, 희망 스타일 등을 자세히 알려주세요."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                전화상담 요청하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}