import { NextRequest, NextResponse } from 'next/server'

// 카카오톡 발송 API 엔드포인트
export async function POST(request: NextRequest) {
  try {
    const { customerName, phone, quoteData, content } = await request.json()

    // 입력 값 검증
    if (!customerName || !phone || !quoteData || !content) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    console.log('카카오톡 발송 요청:', {
      customerName,
      phone,
      quoteData,
      contentLength: content.length
    })

    // 실제 구현에서는 카카오톡 비즈니스 메시지 API 사용
    // 현재는 시뮬레이션으로 처리
    
    // 예시: 카카오톡 비즈니스 메시지 API
    /*
    const kakaoApiUrl = 'https://kapi.kakao.com/v2/api/talk/memo/default/send'
    
    const kakaoResponse = await fetch(kakaoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KAKAO_ACCESS_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'template_object': JSON.stringify({
          object_type: 'text',
          text: content,
          link: {
            web_url: process.env.NEXT_PUBLIC_SITE_URL,
            mobile_web_url: process.env.NEXT_PUBLIC_SITE_URL
          },
          button_title: '견적서 확인'
        })
      })
    })

    if (!kakaoResponse.ok) {
      throw new Error('카카오톡 API 호출 실패')
    }
    */

    // 전화번호 정규화 (010-1234-5678 -> 01012345678)
    const normalizedPhone = phone.replace(/[^0-9]/g, '')
    
    // 메시지 길이 검증 (카카오톡 비즈니스 메시지 제한)
    if (content.length > 1000) {
      return NextResponse.json(
        { error: '메시지가 너무 깁니다. (최대 1000자)' },
        { status: 400 }
      )
    }

    // 시뮬레이션: 1.5초 대기 후 성공 응답
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: `${customerName}님에게 카카오톡이 성공적으로 발송되었습니다.`,
      data: {
        customerName,
        phone: normalizedPhone,
        sentAt: new Date().toISOString(),
        method: 'kakao',
        messageLength: content.length
      }
    })

  } catch (error) {
    console.error('카카오톡 발송 오류:', error)
    
    return NextResponse.json(
      { 
        error: '카카오톡 발송 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}

// GET 요청은 지원하지 않음
export async function GET() {
  return NextResponse.json(
    { error: 'GET 방식은 지원하지 않습니다. POST 방식을 사용해주세요.' },
    { status: 405 }
  )
}