import { NextRequest, NextResponse } from 'next/server'

// SMS 발송 API 엔드포인트 (모바일 전용)
export async function POST(request: NextRequest) {
  try {
    const { customerName, phone, quoteData, content, userAgent } = await request.json()

    // 입력 값 검증
    if (!customerName || !phone || !quoteData || !content) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 모바일 기기 검증
    const isMobile = checkMobileDevice(userAgent || request.headers.get('user-agent') || '')
    
    if (!isMobile) {
      return NextResponse.json(
        { 
          error: 'SMS 발송은 모바일 기기에서만 가능합니다.',
          code: 'DESKTOP_NOT_SUPPORTED'
        },
        { status: 403 }
      )
    }

    console.log('SMS 발송 요청:', {
      customerName,
      phone,
      quoteData,
      contentLength: content.length,
      isMobile,
      userAgent: userAgent || request.headers.get('user-agent')
    })

    // 실제 구현에서는 SMS 서비스 사용 (NAVER Cloud Platform, AWS SNS, CoolSMS 등)
    // 현재는 시뮬레이션으로 처리
    
    // 예시: CoolSMS 사용
    /*
    const CoolSMS = require('coolsms-node-sdk').default
    
    const messageService = new CoolSMS({
      apiKey: process.env.COOLSMS_API_KEY,
      apiSecret: process.env.COOLSMS_API_SECRET
    })

    const message = {
      to: normalizedPhone,
      from: process.env.SMS_SENDER_PHONE, // 발신번호 (사전 등록 필요)
      text: content.substring(0, 80), // SMS는 80자 제한 (단문)
      type: content.length > 80 ? 'LMS' : 'SMS', // 장문/단문 자동 선택
      subject: content.length > 80 ? `[인테리어필름] ${customerName}님 견적서` : undefined
    }

    const result = await messageService.send(message)
    
    if (!result.success) {
      throw new Error('SMS 발송 실패: ' + result.message)
    }
    */

    // 전화번호 정규화 (010-1234-5678 -> 01012345678)
    const normalizedPhone = phone.replace(/[^0-9]/g, '')
    
    // SMS 메시지 길이 검증 (장문 SMS는 1000자, 단문 SMS는 80자 제한)
    const messageType = content.length > 80 ? 'LMS' : 'SMS'
    const maxLength = messageType === 'LMS' ? 1000 : 80
    
    if (content.length > maxLength) {
      return NextResponse.json(
        { error: `메시지가 너무 깁니다. (${messageType} 최대 ${maxLength}자)` },
        { status: 400 }
      )
    }

    // 전화번호 유효성 검증
    if (!validateKoreanPhoneNumber(normalizedPhone)) {
      return NextResponse.json(
        { error: '유효하지 않은 전화번호입니다.' },
        { status: 400 }
      )
    }

    // 시뮬레이션: 2초 대기 후 성공 응답
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: `${customerName}님에게 SMS가 성공적으로 발송되었습니다.`,
      data: {
        customerName,
        phone: normalizedPhone,
        sentAt: new Date().toISOString(),
        method: 'sms',
        messageType,
        messageLength: content.length,
        deviceType: 'mobile'
      }
    })

  } catch (error) {
    console.error('SMS 발송 오류:', error)
    
    return NextResponse.json(
      { 
        error: 'SMS 발송 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}

// 모바일 기기 검증 함수
function checkMobileDevice(userAgent: string): boolean {
  const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
  return mobileRegex.test(userAgent)
}

// 한국 전화번호 유효성 검증
function validateKoreanPhoneNumber(phone: string): boolean {
  // 한국 휴대폰 번호 패턴: 010, 011, 016, 017, 018, 019로 시작하는 10-11자리
  const koreanMobileRegex = /^01[016789]\d{7,8}$/
  return koreanMobileRegex.test(phone)
}

// GET 요청은 지원하지 않음
export async function GET() {
  return NextResponse.json(
    { error: 'GET 방식은 지원하지 않습니다. POST 방식을 사용해주세요.' },
    { status: 405 }
  )
}