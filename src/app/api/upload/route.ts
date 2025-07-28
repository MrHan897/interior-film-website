import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 파일명 중복 방지를 위해 timestamp 추가
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `portfolio_${timestamp}.${extension}`
    
    // public/uploads 디렉토리에 저장
    const path = join(process.cwd(), 'public', 'uploads', fileName)
    await writeFile(path, buffer)

    // 클라이언트에 파일 URL 반환
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${fileName}` 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}