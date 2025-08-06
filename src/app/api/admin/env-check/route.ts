import { NextResponse } from 'next/server'

export async function GET() {
  // 보안상 실제 비밀번호는 표시하지 않고, 설정 여부만 확인
  return NextResponse.json({
    adminUsernameSet: !!process.env.ADMIN_USERNAME,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    jwtSecretSet: !!process.env.JWT_SECRET,
    // 마스킹된 정보만 표시
    adminUsername: process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME.charAt(0) + '***' : 'NOT_SET',
    adminPasswordLength: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.length : 0
  })
}