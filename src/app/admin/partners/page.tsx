'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  BuildingOfficeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

interface Partner {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email?: string
  address: string
  businessType: 'supplier' | 'contractor' | 'distributor' | 'installer'
  specialties: string[]
  partnerSince: string
  status: 'active' | 'inactive' | 'suspended'
  rating?: number
  totalProjects: number
  totalRevenue: number
  lastProject: string
  lastProjectDate: string
  notes?: string
  website?: string
}

const samplePartners: Partner[] = [
  {
    id: '1',
    companyName: '(주)프리미엄 필름',
    contactPerson: '이재호 이사',
    phone: '02-1234-5678',
    email: 'jaeho.lee@premiumfilm.co.kr',
    address: '서울시 강남구 테헤란로 123',
    businessType: 'supplier',
    specialties: ['3M 필름', '프리미엄 인테리어 필름', '자동차 필름'],
    partnerSince: '2022-03-15',
    status: 'active',
    rating: 4.8,
    totalProjects: 45,
    totalRevenue: 125000000,
    lastProject: '강남 오피스텔 대량 공급',
    lastProjectDate: '2024-01-15',
    website: 'https://premiumfilm.co.kr'
  },
  {
    id: '2',
    companyName: '일진시공',
    contactPerson: '박성민 대표',
    phone: '02-2345-6789',
    email: 'sm.park@iljin.co.kr',
    address: '서울시 서초구 강남대로 456',
    businessType: 'contractor',
    specialties: ['대형 건물 시공', '상업시설 시공', '아파트 단지'],
    partnerSince: '2021-08-20',
    status: 'active',
    rating: 4.5,
    totalProjects: 78,
    totalRevenue: 189000000,
    lastProject: '서초 신축 아파트 전체 시공',
    lastProjectDate: '2024-01-10',
    notes: '대형 프로젝트 전문, 품질 우수'
  },
  {
    id: '3',
    companyName: '스마트 디스트리뷰션',
    contactPerson: '최영수 팀장',
    phone: '031-3456-7890',
    email: 'ys.choi@smartdist.com',
    address: '경기도 성남시 분당구 판교로 789',
    businessType: 'distributor',
    specialties: ['전국 배송', '창고 관리', '재고 관리'],
    partnerSince: '2023-01-10',
    status: 'active',
    rating: 4.2,
    totalProjects: 156,
    totalRevenue: 67000000,
    lastProject: '전국 협력업체 배송',
    lastProjectDate: '2024-01-20',
    website: 'https://smartdist.com'
  },
  {
    id: '4',
    companyName: '퀵시공팀',
    contactPerson: '김동현 실장',
    phone: '010-4567-8901',
    email: 'dh.kim@quickteam.kr',
    address: '서울시 마포구 홍대입구역 근처',
    businessType: 'installer',
    specialties: ['긴급 시공', '소규모 시공', '당일 완료'],
    partnerSince: '2023-06-01',
    status: 'active',
    rating: 4.0,
    totalProjects: 203,
    totalRevenue: 45000000,
    lastProject: '홍대 카페 긴급 보수',
    lastProjectDate: '2024-01-18',
    notes: '신속성이 장점, 소규모 작업 전문'
  }
]

const businessTypeConfig = {
  supplier: { label: '공급업체', color: 'bg-blue-100 text-blue-600', icon: BuildingOfficeIcon },
  contractor: { label: '시공업체', color: 'bg-green-100 text-green-600', icon: WrenchScrewdriverIcon },
  distributor: { label: '유통업체', color: 'bg-purple-100 text-purple-600', icon: BriefcaseIcon },
  installer: { label: '설치업체', color: 'bg-orange-100 text-orange-600', icon: WrenchScrewdriverIcon }
}

const statusConfig = {
  active: { label: '활성', color: 'bg-emerald-100 text-emerald-600' },
  inactive: { label: '비활성', color: 'bg-gray-100 text-gray-600' },
  suspended: { label: '중단', color: 'bg-red-100 text-red-600' }
}

const PartnerCard = ({ 
  partner, 
  onView, 
  onEdit, 
  onContact 
}: { 
  partner: Partner
  onView: (partner: Partner) => void
  onEdit: (partner: Partner) => void
  onContact: (partner: Partner) => void
}) => {
  const businessType = businessTypeConfig[partner.businessType]
  const status = statusConfig[partner.status]
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* 업체 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{partner.companyName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${businessType.color}`}>
              {businessType.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{partner.contactPerson}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>협력 시작: {partner.partnerSince}</span>
            {partner.rating && (
              <div className="flex items-center space-x-1">
                <StarIcon className="w-3 h-3 text-yellow-500" />
                <span>{partner.rating}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(partner)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(partner)}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4" />
          <span>{partner.phone}</span>
        </div>
        {partner.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="w-4 h-4 text-center">@</span>
            <span>{partner.email}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="truncate">{partner.address}</span>
        </div>
      </div>

      {/* 전문 분야 */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 mb-2">전문 분야</p>
        <div className="flex flex-wrap gap-1">
          {partner.specialties.slice(0, 3).map((specialty, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {specialty}
            </span>
          ))}
          {partner.specialties.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{partner.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* 실적 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 font-medium">총 프로젝트</p>
          <p className="text-lg font-bold text-blue-900">{partner.totalProjects}</p>
        </div>
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <p className="text-xs text-emerald-600 font-medium">총 매출</p>
          <p className="text-lg font-bold text-emerald-900">
            {(partner.totalRevenue / 10000).toFixed(0)}만원
          </p>
        </div>
      </div>

      {/* 최근 프로젝트 */}
      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <p className="text-xs font-medium text-gray-700 mb-1">최근 프로젝트</p>
        <p className="text-sm text-gray-900">{partner.lastProject}</p>
        <p className="text-xs text-gray-500">{partner.lastProjectDate}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onContact(partner)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>연락하기</span>
        </button>
        {partner.website && (
          <button
            onClick={() => window.open(partner.website, '_blank')}
            className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
          >
            웹사이트
          </button>
        )}
      </div>

      {/* 메모가 있는 경우 표시 */}
      {partner.notes && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-800">{partner.notes}</p>
        </div>
      )}
    </div>
  )
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(samplePartners)
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(samplePartners)
  const [searchTerm, setSearchTerm] = useState('')
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, businessTypeFilter, statusFilter)
  }

  const handleBusinessTypeFilter = (type: string) => {
    setBusinessTypeFilter(type)
    applyFilters(searchTerm, type, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    applyFilters(searchTerm, businessTypeFilter, status)
  }

  const applyFilters = (search: string, businessType: string, status: string) => {
    let filtered = partners

    // 검색어 필터
    if (search) {
      filtered = filtered.filter(partner =>
        partner.companyName.toLowerCase().includes(search.toLowerCase()) ||
        partner.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        partner.phone.includes(search) ||
        partner.specialties.some(specialty => 
          specialty.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // 업체 유형 필터
    if (businessType !== 'all') {
      filtered = filtered.filter(partner => partner.businessType === businessType)
    }

    // 상태 필터
    if (status !== 'all') {
      filtered = filtered.filter(partner => partner.status === status)
    }

    setFilteredPartners(filtered)
  }

  const handleViewPartner = (partner: Partner) => {
    alert(`${partner.companyName} 상세 정보를 확인합니다.`)
  }

  const handleEditPartner = (partner: Partner) => {
    alert(`${partner.companyName} 정보를 수정합니다.`)
  }

  const handleContactPartner = (partner: Partner) => {
    const message = `안녕하세요 ${partner.contactPerson}님, 꾸미다필름에서 연락드립니다.`
    const phoneNumber = partner.phone.replace(/-/g, '')
    
    // 연락 방법 선택 다이얼로그
    if (confirm(`${partner.companyName}에 연락하시겠습니까?\n\n확인: 전화걸기\n취소: 문자보내기`)) {
      window.location.href = `tel:${phoneNumber}`
    } else {
      window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
    }
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">협력업체 관리</h1>
                <p className="text-sm text-gray-600">협력업체 정보 및 관계 관리</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>새 협력업체</span>
              </button>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 검색 */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="업체명, 담당자, 연락처, 전문분야로 검색..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* 업체 유형 필터 */}
            <div>
              <select
                value={businessTypeFilter}
                onChange={(e) => handleBusinessTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">모든 업체 유형</option>
                <option value="supplier">공급업체</option>
                <option value="contractor">시공업체</option>
                <option value="distributor">유통업체</option>
                <option value="installer">설치업체</option>
              </select>
            </div>

            {/* 상태 필터 */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="suspended">중단</option>
              </select>
            </div>
          </div>
        </div>

        {/* 협력업체 통계 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전체 협력업체</p>
                  <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                </div>
                <BuildingOfficeIcon className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">활성 업체</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {partners.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 프로젝트</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {partners.reduce((sum, partner) => sum + partner.totalProjects, 0)}
                  </p>
                </div>
                <WrenchScrewdriverIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 매출</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {(partners.reduce((sum, partner) => sum + partner.totalRevenue, 0) / 100000000).toFixed(1)}억원
                  </p>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* 협력업체 목록 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onView={handleViewPartner}
                onEdit={handleEditPartner}
                onContact={handleContactPartner}
              />
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">협력업체를 찾을 수 없습니다</h3>
              <p className="text-gray-500">검색 조건을 변경하거나 새로운 협력업체를 추가해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}