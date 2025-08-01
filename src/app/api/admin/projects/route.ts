import { NextRequest, NextResponse } from 'next/server'

// 임시 데이터
const sampleProjects = [
  {
    id: '1',
    customerName: '김민수',
    phone: '010-1234-5678',
    address: '서울시 강남구 역삼동 123-456',
    service: '아파트 거실 필름 시공',
    scheduledDate: '2024-01-25',
    workerAssigned: '시공팀 A',
    priority: 'normal',
    status: 'scheduled',
    progressPercentage: 0,
    totalAmount: 2100000,
    notes: '주말 시공 희망',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    customerName: '이영희',
    phone: '010-2345-6789',
    address: '서울시 서초구 반포동 789-123',
    service: '사무실 전체 인테리어 필름',
    scheduledDate: '2024-01-26',
    workerAssigned: '시공팀 B',
    priority: 'high',
    status: 'in_progress',
    progressPercentage: 65,
    totalAmount: 4500000,
    notes: '야간 작업 가능',
    photos: ['photo1.jpg', 'photo2.jpg'],
    createdAt: '2024-01-19'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const worker = searchParams.get('worker')

    let filteredProjects = [...sampleProjects]

    // 상태 필터링
    if (status && status !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.status === status)
    }

    // 시공팀 필터링
    if (worker) {
      filteredProjects = filteredProjects.filter(project => project.workerAssigned === worker)
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProjects = filteredProjects.filter(project =>
        project.customerName.toLowerCase().includes(searchLower) ||
        project.phone.includes(search) ||
        project.address.toLowerCase().includes(searchLower) ||
        project.service.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      projects: filteredProjects,
      total: filteredProjects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: '프로젝트 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newProject = {
      id: Date.now().toString(),
      ...data,
      status: 'scheduled',
      progressPercentage: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    console.log('새 프로젝트 생성:', newProject)

    return NextResponse.json({
      success: true,
      project: newProject,
      message: '프로젝트가 성공적으로 등록되었습니다.'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: '프로젝트 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
}