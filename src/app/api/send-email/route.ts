import { NextRequest, NextResponse } from 'next/server'

// 이메일 발송 API 엔드포인트
export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail, phone, quoteData, content } = await request.json()

    // 입력 값 검증
    if (!customerName || !phone || !quoteData || !content) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    console.log('이메일 발송 요청:', {
      customerName,
      customerEmail,
      phone,
      quoteData,
      contentLength: content.length
    })

    // 실제 구현에서는 이메일 서비스 사용 (Nodemailer, SendGrid, AWS SES 등)
    // 현재는 시뮬레이션으로 처리
    
    // 예시: Nodemailer 사용
    /*
    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // 또는 다른 이메일 서비스
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail || phone + '@example.com', // 실제로는 고객 이메일
      subject: `[인테리어필름] ${customerName}님 견적서`,
      html: `
        <h2>인테리어 필름 시공 견적서</h2>
        <p>안녕하세요 ${customerName}님,</p>
        <div style="white-space: pre-line;">${content}</div>
        <hr>
        <h3>견적 상세</h3>
        <ul>
          <li>시공 위치: ${quoteData.address}</li>
          <li>시공 면적: ${quoteData.areaSize}㎡</li>
          <li>필름 종류: ${quoteData.filmType}</li>
          <li>총 견적 금액: ${(quoteData.totalAmount / 10000).toFixed(0)}만원</li>
        </ul>
        <p>문의사항이 있으시면 언제든 연락 주세요.</p>
        <p>감사합니다.</p>
      `
    }

    await transporter.sendMail(mailOptions)
    */

    // 시뮬레이션: 1초 대기 후 성공 응답
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: `${customerName}님에게 이메일이 성공적으로 발송되었습니다.`,
      data: {
        customerName,
        phone,
        sentAt: new Date().toISOString(),
        method: 'email'
      }
    })

  } catch (error) {
    console.error('이메일 발송 오류:', error)
    
    return NextResponse.json(
      { 
        error: '이메일 발송 중 오류가 발생했습니다.',
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