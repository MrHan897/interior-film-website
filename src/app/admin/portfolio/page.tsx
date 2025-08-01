'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Portfolio {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  tags: string[]
  created_at: string
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
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: '카페 인테리어 필름 시공',
    category: '상업 공간',
    description: '브랜드 아이덴티티에 맞는 컬러와 패턴의 필름으로 독특한 분위기의 카페를 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    tags: ['브랜딩', '카페', '상업공간'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '주방 가구 리폼',
    category: '가구 리폼',
    description: '오래된 주방 가구를 마블 패턴 필름으로 리폼하여 고급스러운 주방으로 변화시켰습니다.',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    tags: ['마블 패턴', '주방', '가구'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: '사무실 파티션 필름',
    category: '상업 공간',
    description: '프라이버시 보호와 동시에 개방감을 유지하는 반투명 필름으로 사무 공간을 구성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    tags: ['프라이버시', '사무실', '파티션'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: '침실 벽면 아트 필름',
    category: '주거 공간',
    description: '포인트 벽면에 아트 패턴 필름을 적용하여 개성있는 침실 공간을 완성했습니다.',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
    tags: ['아트 패턴', '침실', '포인트 벽'],
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    title: '매장 외벽 브랜딩',
    category: '상업 공간',
    description: '매장 외벽에 브랜드 컬러와 로고를 적용한 필름으로 강력한 브랜딩 효과를 창출했습니다.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['브랜딩', '외벽', '매장'],
    created_at: new Date().toISOString()
  }
]

export default function PortfolioAdmin() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(defaultSampleData)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: '',
    tags: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  const categories = ['주거 공간', '상업 공간', '가구 리폼', '기타']

  useEffect(() => {
    fetchPortfolios()
  }, [])

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
          tags: ''
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
      tags: portfolio.tags.join(', ')
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
      tags: ''
    })
    setEditingPortfolio(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/schedule" className="text-blue-600 hover:text-blue-500 mr-4">
                ← 관리자 메인
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              새 포트폴리오 추가
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingPortfolio ? '포트폴리오 수정' : '새 포트폴리오 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {uploadingImage && (
                      <p className="text-sm text-blue-600 mt-1">업로드 중...</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">또는</div>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="이미지 URL 직접 입력"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <Image
                        src={formData.image_url}
                        alt="미리보기"
                        width={128}
                        height={96}
                        className="object-cover rounded-lg border"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="우드 패턴, 거실, 아파트"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  {editingPortfolio ? '수정' : '추가'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">포트폴리오 목록</h2>
              {portfolios.length > 0 && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  샘플 데이터 {portfolios.length}개 표시 중
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이미지
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    태그
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="space-y-2">
                        <p>포트폴리오 데이터를 불러오는 중...</p>
                        <p className="text-sm">샘플 데이터가 곧 표시됩니다.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  portfolios.map((portfolio) => (
                  <tr key={portfolio.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={portfolio.image_url}
                        alt={portfolio.title}
                        width={64}
                        height={64}
                        className="object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {portfolio.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {portfolio.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {portfolio.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {portfolio.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {portfolio.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{portfolio.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(portfolio)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}