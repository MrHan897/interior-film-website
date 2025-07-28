'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import StepProgress from '@/components/booking/StepProgress'
import Step1BuildingType from '@/components/booking/Step1BuildingType'
import Step2AreaSize from '@/components/booking/Step2AreaSize'
import Step3HomeCondition from '@/components/booking/Step3HomeCondition'
import Step4Reason from '@/components/booking/Step4Reason'
import Step5Spaces from '@/components/booking/Step5Spaces'
import Step6Budget from '@/components/booking/Step6Budget'
import Step7Timeline from '@/components/booking/Step7Timeline'
import Step8CustomerInfo from '@/components/booking/Step8CustomerInfo'

export interface BookingData {
  buildingType: string
  areaSize: string
  homeCondition: string
  reason: string
  spaces: string[]
  budget: string
  timeline: string
  consultDate: string
  consultTime: string
  customerInfo: {
    name: string
    phone: string
    address: string
    requirements: string
    privacyConsent: boolean
  }
}

const TOTAL_STEPS = 8

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    buildingType: '',
    areaSize: '',
    homeCondition: '',
    reason: '',
    spaces: [],
    budget: '',
    timeline: '',
    consultDate: '',
    consultTime: '',
    customerInfo: {
      name: '',
      phone: '',
      address: '',
      requirements: '',
      privacyConsent: false
    }
  })

  const updateBookingData = (field: string, value: string | number | boolean | string[]) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateCustomerInfo = (field: string, value: string | boolean) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('상담 신청이 완료되었습니다. 곧 연락드리겠습니다.')
        // 폼 초기화
        setBookingData({
          buildingType: '',
          areaSize: '',
          homeCondition: '',
          reason: '',
          spaces: [],
          budget: '',
          timeline: '',
          consultDate: '',
          consultTime: '',
          customerInfo: {
            name: '',
            phone: '',
            address: '',
            requirements: '',
            privacyConsent: false
          }
        })
        setCurrentStep(1)
      } else {
        console.error('API 오류:', result)
        if (result.details) {
          alert(`설정 오류: ${result.error}\n\n${result.details}`)
        } else {
          alert(`오류: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('예약 제출 오류:', error)
      alert('예약 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BuildingType
            value={bookingData.buildingType}
            onChange={(value) => updateBookingData('buildingType', value)}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <Step2AreaSize
            value={bookingData.areaSize}
            onChange={(value) => updateBookingData('areaSize', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <Step3HomeCondition
            value={bookingData.homeCondition}
            onChange={(value) => updateBookingData('homeCondition', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <Step4Reason
            value={bookingData.reason}
            onChange={(value) => updateBookingData('reason', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 5:
        return (
          <Step5Spaces
            value={bookingData.spaces}
            onChange={(value) => updateBookingData('spaces', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 6:
        return (
          <Step6Budget
            value={bookingData.budget}
            onChange={(value) => updateBookingData('budget', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 7:
        return (
          <Step7Timeline
            value={bookingData.timeline}
            onChange={(value) => updateBookingData('timeline', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 8:
        return (
          <Step8CustomerInfo
            consultDate={bookingData.consultDate}
            consultTime={bookingData.consultTime}
            customerInfo={bookingData.customerInfo}
            onConsultDateChange={(value) => updateBookingData('consultDate', value)}
            onConsultTimeChange={(value) => updateBookingData('consultTime', value)}
            onCustomerInfoChange={updateCustomerInfo}
            onSubmit={handleSubmit}
            onPrev={prevStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">인테리어 필름 상담 신청</h1>
          <p className="text-lg text-gray-600">
            몇 가지 질문을 통해 맞춤 상담을 제공해드립니다
          </p>
        </div>

        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        <div className="mt-12">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}