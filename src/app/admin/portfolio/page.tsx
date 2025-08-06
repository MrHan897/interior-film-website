'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LinkIcon,
  StarIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Portfolio {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  tags: string[]
  created_at: string
  featured?: boolean
  blogUrl?: string
  location?: string
  completedAt?: string
}

// 기본 샘플 데이터
const defaultSampleData: Portfolio[] = [
  {
    id: '1',
    title: '모던 아파트 거실 리모델링',
    category: '주거 공간',
    description: '기존 벽면을 고급 우드 패턴 필름으로 변화시켜 따뜻하고 세련된 분위기를 연출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    tags: ['우드 패턴', '거실', '아파트'],
    created_at: new Date().toISOString(),
    featured: true,
    location: '서울시 강남구',
    completedAt: '2024-01-15',
    blogUrl: 'https://blog.example.com/gangnam-apartment'
  },
  {
    id: '2',
    title: '카페 인테리어 필름 시공',
    category: '상업 공간',
    description: '브랜드 아이덴티티에 맞는 컬러와 패턴의 필름으로 독특한 분위기의 카페를 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    tags: ['브랜딩', '카페', '상업공간'],
    created_at: new Date().toISOString(),
    featured: false,
    location: '서울시 마포구 홍대',
    completedAt: '2024-01-10'
  },
  {
    id: '3',
    title: '주방 가구 리폼',
    category: '가구 리폼',
    description: '오래된 주방 가구를 마블 패턴 필름으로 리폼하여 고급스러운 주방으로 변화시켰습니다.',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    tags: ['마블 패턴', '주방', '가구'],
    created_at: new Date().toISOString(),
    featured: true,
    location: '서울시 서초구',
    completedAt: '2024-01-05'
  },
  {
    id: '4',
    title: '사무실 파티션 필름',
    category: '상업 공간',
    description: '프라이버시 보호와 동시에 개방감을 유지하는 반투명 필름으로 사무 공간을 구성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    tags: ['프라이버시', '사무실', '파티션'],
    created_at: new Date().toISOString(),
    featured: false,
    location: '서울시 중구',
    completedAt: '2023-12-28'
  },
  {
    id: '5',
    title: '침실 벽면 아트 필름',
    category: '주거 공간',
    description: '포인트 벽면에 아트 패턴 필름을 적용하여 개성있는 침실 공간을 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
    tags: ['아트 패턴', '침실', '포인트 벽'],
    created_at: new Date().toISOString(),
    featured: false,
    location: '경기도 성남시',
    completedAt: '2023-12-20'
  },
  {
    id: '6',
    title: '매장 외벽 브랜딩',
    category: '상업 공간',
    description: '매장 외벽에 브랜드 컬러와 로고를 적용한 필름으로 강력한 브랜딩 효과를 창출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['브랜딩', '외벽', '매장'],
    created_at: new Date().toISOString(),
    featured: true,
    location: '서울시 영등포구',
    completedAt: '2023-12-15',
    blogUrl: 'https://blog.example.com/store-branding'
  }
]

export default function PortfolioAdmin() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(defaultSampleData)
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>(defaultSampleData)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: '',
    tags: '',
    featured: false,
    blogUrl: '',
    location: '',
    completedAt: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  const categories = ['주거 공간', '상업 공간', '가구 리폼', '기타']

  useEffect(() => {
    fetchPortfolios()
  }, [])
  
  // 필터링 로직
  useEffect(() => {
    let filtered = portfolios

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // 카테고리 필터
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    // Featured 필터
    if (featuredFilter === 'featured') {
      filtered = filtered.filter(item => item.featured)
    } else if (featuredFilter === 'normal') {
      filtered = filtered.filter(item => !item.featured)
    }

    setFilteredPortfolios(filtered)
  }, [portfolios, searchTerm, categoryFilter, featuredFilter])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // 포트폴리오 데이터 로드 완료
      // API 데이터가 있으면 사용하고, 없으면 기본 샘플 데이터 유지
      if (Array.isArray(data) && data.length > 0) {
        setPortfolios(data)
      }
      // 기본 샘플 데이터는 이미 초기값으로 설정되어 있음
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
      // 에러 발생 시에도 기본 샘플 데이터 유지
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const portfolioData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    try {
      const url = editingPortfolio ? `/api/portfolio/${editingPortfolio.id}` : '/api/portfolio'
      const method = editingPortfolio ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
      })

      const result = await response.json()

      if (response.ok) {
        await fetchPortfolios()
        setShowForm(false)
        setEditingPortfolio(null)
        setFormData({
          title: '',
          category: '',
          description: '',
          image_url: '',
          tags: '',
          featured: false,
          blogUrl: '',
          location: '',
          completedAt: ''
        })
        alert(editingPortfolio ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 추가되었습니다.')
      } else {
        if (response.status === 503) {
          alert('데이터베이스가 설정되지 않아 포트폴리오 관리 기능을 사용할 수 없습니다. 현재 샘플 데이터가 표시됩니다.')
        } else {
          alert(result.error || '포트폴리오 저장에 실패했습니다.')
        }
      }
    } catch (error) {
      console.error('Failed to save portfolio:', error)
      alert('포트폴리오 저장에 실패했습니다.')
    }
  }

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio)
    setFormData({
      title: portfolio.title,
      category: portfolio.category,
      description: portfolio.description,
      image_url: portfolio.image_url,
      tags: portfolio.tags.join(', '),
      featured: portfolio.featured || false,
      blogUrl: portfolio.blogUrl || '',
      location: portfolio.location || '',
      completedAt: portfolio.completedAt || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (response.ok) {
          await fetchPortfolios()
          alert('포트폴리오가 삭제되었습니다.')
        } else {
          if (response.status === 503) {
            alert('데이터베이스가 설정되지 않아 포트폴리오 삭제 기능을 사용할 수 없습니다.')
          } else {
            alert(result.error || '포트폴리오 삭제에 실패했습니다.')
          }
        }
      } catch (error) {
        console.error('Failed to delete portfolio:', error)
        alert('포트폴리오 삭제에 실패했습니다.')
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }))
      } else {
        alert('이미지 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploadingImage(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      image_url: '',
      tags: '',
      featured: false,
      blogUrl: '',
      location: '',
      completedAt: ''
    })
    setEditingPortfolio(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
            <p className="text-gray-600 mt-1">프로젝트 포트폴리오를 관리하고 블로그 링크를 연결하세요</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            새 포트폴리오 추가
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="제목, 설명, 태그, 위치로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px] text-gray-900"
              >
                <option value="all" className="text-gray-900">모든 카테고리</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="text-gray-900">{category}</option>
                ))}
              </select>
            </div>
            
            {/* Featured Filter */}
            <div className="relative">
              <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] text-gray-900"
              >
                <option value="all" className="text-gray-900">전체</option>
                <option value="featured" className="text-gray-900">추천만</option>
                <option value="normal" className="text-gray-900">일반만</option>
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            총 {filteredPortfolios.length}개 결과 (전체 {portfolios.length}개)
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPortfolio ? '포트폴리오 수정' : '새 포트폴리오 추가'}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제목 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
                      placeholder="프로젝트 제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리 *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="" className="text-gray-900">카테고리 선택</option>
                      {categories.map((category) => (
                        <option key={category} value={category} className="text-gray-900">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시공 위치
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
                      placeholder="예: 서울시 강남구"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      완료일
                    </label>
                    <input
                      type="date"
                      value={formData.completedAt}
                      onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      블로그 링크
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={formData.blogUrl}
                        onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
                        placeholder="https://blog.example.com/project"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">추천 포트폴리오</span>
                      {formData.featured && <StarIconSolid className="w-4 h-4 text-yellow-400" />}
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      설명 *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
                      placeholder="프로젝트에 대한 상세한 설명을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이미지
                    </label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-2">
                              <label className="cursor-pointer inline-flex items-center gap-2 bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  disabled={uploadingImage}
                                  className="sr-only"
                                />
                                {uploadingImage ? '업로드 중...' : '파일 선택'}
                              </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (최대 10MB)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">또는</span>
                        </div>
                      </div>
                      
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
                        placeholder="이미지 URL 직접 입력"
                      />
                      
                      {formData.image_url && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">미리보기</p>
                          <Image
                            src={formData.image_url}
                            alt="미리보기"
                            width={200}
                            height={150}
                            className="object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      태그 (쉼표로 구분)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-900 text-gray-900"
                      placeholder="우드 패턴, 거실, 아파트"
                    />
                    <p className="text-xs text-gray-500 mt-1">검색에 도움이 되는 키워드를 입력하세요</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {editingPortfolio ? '수정 완료' : '포트폴리오 추가'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredPortfolios.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">포트폴리오가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' || featuredFilter !== 'all' 
                  ? '검색 조건에 맞는 포트폴리오가 없습니다' 
                  : '첫 번째 포트폴리오를 추가해보세요'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && featuredFilter === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <PlusIcon className="w-5 h-5" />
                    새 포트폴리오 추가
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {/* Featured Badge */}
                  {portfolio.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="inline-flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                        <StarIconSolid className="w-3 h-3" />
                        추천
                      </div>
                    </div>
                  )}
                  
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={portfolio.image_url}
                      alt={portfolio.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {portfolio.title}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shrink-0">
                        {portfolio.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {portfolio.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      {portfolio.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPinIcon className="w-3 h-3" />
                          {portfolio.location}
                        </div>
                      )}
                      {portfolio.completedAt && (
                        <div className="text-xs text-gray-500">
                          완료일: {new Date(portfolio.completedAt).toLocaleDateString('ko-KR')}
                        </div>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {portfolio.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {portfolio.tags.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{portfolio.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {portfolio.blogUrl && (
                          <a
                            href={portfolio.blogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <LinkIcon className="w-3 h-3" />
                            블로그
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(portfolio)}
                          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <PencilIcon className="w-3 h-3" />
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(portfolio.id)}
                          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}