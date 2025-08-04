'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CameraIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Project {
  id: string
  customerName: string
  phone: string
  address: string
  service: string
  scheduledDate: string
  workerAssigned?: string
  priority: 'low' | 'normal' | 'high'
  status: 'scheduled' | 'in_progress' | 'quality_check' | 'completed'
  progressPercentage: number
  totalAmount: number
  notes?: string
  photos?: string[]
  createdAt: string
}

const sampleProjects: Project[] = [
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
  },
  {
    id: '3',
    customerName: '박철수',
    phone: '010-3456-7890',
    address: '서울시 마포구 홍대 456-789',
    service: '매장 인테리어 필름 교체',
    scheduledDate: '2024-01-24',
    workerAssigned: '시공팀 A',
    priority: 'normal',
    status: 'quality_check',
    progressPercentage: 90,
    totalAmount: 1050000,
    createdAt: '2024-01-18'
  },
  {
    id: '4',
    customerName: '정다은',
    phone: '010-4567-8901',
    address: '서울시 용산구 이태원동 321-654',
    service: '카페 인테리어 필름',
    scheduledDate: '2024-01-22',
    workerAssigned: '시공팀 C',
    priority: 'normal',
    status: 'completed',
    progressPercentage: 100,
    totalAmount: 1800000,
    createdAt: '2024-01-15'
  }
]

const statusConfig = {
  scheduled: { 
    label: '예정', 
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  in_progress: { 
    label: '진행중', 
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  quality_check: { 
    label: '검수중', 
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  completed: { 
    label: '완료', 
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  }
}

const priorityConfig = {
  low: { label: '낮음', color: 'bg-gray-100 text-gray-600' },
  normal: { label: '보통', color: 'bg-blue-100 text-blue-600' },
  high: { label: '높음', color: 'bg-red-100 text-red-600' }
}

const ProjectCard = ({ 
  project, 
  onView, 
  onEdit, 
  onUpdateProgress,
  onContactCustomer 
}: { 
  project: Project
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onUpdateProgress: (project: Project) => void
  onContactCustomer: (project: Project) => void
}) => {
  const priority = priorityConfig[project.priority]
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* 프로젝트 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{project.customerName}</h3>
            {project.priority === 'high' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                {priority.label}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{project.service}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(project)}
            className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 진행률 */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>진행률</span>
          <span>{project.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 프로젝트 정보 */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <CalendarDaysIcon className="w-3 h-3" />
          <span>{project.scheduledDate}</span>
        </div>
        {project.workerAssigned && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <UserIcon className="w-3 h-3" />
            <span>{project.workerAssigned}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <MapPinIcon className="w-3 h-3" />
          <span className="truncate">{project.address}</span>
        </div>
      </div>

      {/* 금액 */}
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
        <span className="text-xs font-medium text-gray-700">금액</span>
        <span className="text-sm font-bold text-gray-900">
          {(project.totalAmount / 10000).toFixed(0)}만원
        </span>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateProgress(project)}
          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <WrenchScrewdriverIcon className="w-3 h-3" />
          <span>진행 업데이트</span>
        </button>
        <button
          onClick={() => onContactCustomer(project)}
          className="flex items-center justify-center p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <PhoneIcon className="w-3 h-3" />
        </button>
      </div>

      {/* 사진이 있는 경우 표시 */}
      {project.photos && project.photos.length > 0 && (
        <div className="flex items-center space-x-1 mt-2 p-2 bg-blue-50 rounded-lg">
          <CameraIcon className="w-3 h-3 text-blue-600" />
          <span className="text-xs text-blue-600">{project.photos.length}장의 사진</span>
        </div>
      )}

      {/* 메모가 있는 경우 표시 */}
      {project.notes && (
        <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-800">{project.notes}</p>
        </div>
      )}
    </div>
  )
}

const KanbanColumn = ({ 
  status, 
  projects, 
  onView, 
  onEdit, 
  onUpdateProgress,
  onContactCustomer 
}: {
  status: keyof typeof statusConfig
  projects: Project[]
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onUpdateProgress: (project: Project) => void
  onContactCustomer: (project: Project) => void
}) => {
  const config = statusConfig[status]
  
  return (
    <div className="flex-1 min-w-80">
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${config.color}`} />
          <h3 className="font-semibold text-gray-900">{config.label}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {projects.length}
          </span>
        </div>
        <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 프로젝트 카드들 */}
      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onView={onView}
            onEdit={onEdit}
            onUpdateProgress={onUpdateProgress}
            onContactCustomer={onContactCustomer}
          />
        ))}
        
        {projects.length === 0 && (
          <div className={`${config.bgColor} border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center`}>
            <WrenchScrewdriverIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">진행중인 프로젝트가 없음</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ProjectModal = ({ 
  project, 
  isOpen, 
  onClose, 
  mode 
}: { 
  project: Project | null
  isOpen: boolean
  onClose: () => void
  mode: 'view' | 'edit'
}) => {
  const [editData, setEditData] = useState<Project | null>(null)
  
  const isEditable = mode === 'edit'
  
  // 편집 모드일 때 데이터 초기화
  useEffect(() => {
    if (isEditable && project) {
      setEditData(project)
    }
  }, [isEditable, project])
  
  const handleInputChange = (field: keyof Project, value: string | number) => {
    if (!isEditable || !editData) return
    setEditData({ ...editData, [field]: value })
  }
  
  if (!isOpen || !project) return null

  const status = statusConfig[project.status]
  const currentData = isEditable ? (editData || project) : project

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'edit' ? '프로젝트 수정' : '프로젝트 상세'}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.textColor} ${status.bgColor}`}>
                {status.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* 모달 컨텐츠 */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 프로젝트 정보 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">프로젝트 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">고객명</label>
                <input
                  type="text"
                  value={currentData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={currentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <input
                  type="text"
                  value={project.address}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">서비스</label>
                <input
                  type="text"
                  value={project.service}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </section>

          {/* 시공 정보 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">시공 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예정일</label>
                <input
                  type="date"
                  value={project.scheduledDate}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당 시공팀</label>
                <input
                  type="text"
                  value={project.workerAssigned || ''}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="담당 시공팀"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                <select
                  value={project.priority}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="low">낮음</option>
                  <option value="normal">보통</option>
                  <option value="high">높음</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">진행률 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={project.progressPercentage}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </section>

          {/* 진행률 표시 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">진행률</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">현재 진행률</span>
                <span className="text-lg font-bold text-indigo-600">{project.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>
          </section>

          {/* 금액 정보 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">금액 정보</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">총 프로젝트 금액</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {(project.totalAmount / 10000).toFixed(0)}만원
                </span>
              </div>
            </div>
          </section>

          {/* 메모 */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
            <textarea
              value={project.notes || ''}
              disabled={!isEditable}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="프로젝트 특이사항이나 고객 요청사항을 입력하세요"
            />
          </section>

          {/* 사진 정보 */}
          {project.photos && project.photos.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">시공 사진</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 모달 액션 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {mode === 'view' ? '닫기' : '취소'}
            </button>
            {isEditable && (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                수정 완료
              </button>
            )}
            {mode === 'view' && (
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                고객 연락
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(sampleProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(sampleProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = term 
      ? projects.filter(project =>
          project.customerName.toLowerCase().includes(term.toLowerCase()) ||
          project.phone.includes(term) ||
          project.address.toLowerCase().includes(term.toLowerCase()) ||
          project.service.toLowerCase().includes(term.toLowerCase())
        )
      : projects
    setFilteredProjects(filtered)
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setModalMode('view')
    setModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleUpdateProgress = (project: Project) => {
    console.log('프로젝트 진행률 업데이트:', project.id)
  }

  const handleContactCustomer = (project: Project) => {
    console.log('고객 연락:', project.customerName, project.phone)
  }

  // 상태별로 프로젝트 그룹화
  const projectsByStatus = {
    scheduled: filteredProjects.filter(p => p.status === 'scheduled'),
    in_progress: filteredProjects.filter(p => p.status === 'in_progress'),
    quality_check: filteredProjects.filter(p => p.status === 'quality_check'),
    completed: filteredProjects.filter(p => p.status === 'completed')
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">시공관리</h1>
                <p className="text-sm text-gray-600">프로젝트 진행 상황 및 시공팀 관리</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>새 프로젝트</span>
              </button>
            </div>
          </div>
        </div>

        {/* 검색 */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="고객명, 연락처, 주소, 서비스로 검색..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 칸반 보드 (데스크톱) */}
        <div className="hidden lg:block p-6">
          <div className="flex space-x-6 overflow-x-auto">
            {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
              <KanbanColumn
                key={status}
                status={status as keyof typeof statusConfig}
                projects={statusProjects}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onUpdateProgress={handleUpdateProgress}
                onContactCustomer={handleContactCustomer}
              />
            ))}
          </div>
        </div>

        {/* 모바일 리스트 뷰 */}
        <div className="lg:hidden p-6">
          {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
            <div key={status} className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${statusConfig[status as keyof typeof statusConfig].color}`} />
                <h3 className="font-semibold text-gray-900">
                  {statusConfig[status as keyof typeof statusConfig].label}
                </h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {statusProjects.length}
                </span>
              </div>
              <div className="space-y-3">
                {statusProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={handleViewProject}
                    onEdit={handleEditProject}
                    onUpdateProgress={handleUpdateProgress}
                    onContactCustomer={handleContactCustomer}
                  />
                ))}
                {statusProjects.length === 0 && (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                    <WrenchScrewdriverIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">프로젝트가 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 프로젝트 모달 */}
        <ProjectModal
          project={selectedProject}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
        />
      </div>
    </AdminLayout>
  )
}