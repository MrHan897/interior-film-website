export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                🏠 인테리어 필름 전문
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🎉 배포 성공!
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              인테리어 필름 웹사이트 + Task Master AI 시스템
            </p>
            <div className="space-x-4">
              <a 
                href="/booking" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                온라인 예약
              </a>
              <a 
                href="/admin/schedule" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                관리자
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              시스템 기능
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">포트폴리오</h3>
              <p className="text-gray-600">완성된 프로젝트 갤러리</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">온라인 예약</h3>
              <p className="text-gray-600">8단계 예약 시스템</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">관리자</h3>
              <p className="text-gray-600">일정 및 포트폴리오 관리</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Task Master AI</h3>
              <p className="text-gray-600">AI 기반 작업 관리</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              페이지 테스트
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="/booking" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-xl font-semibold mb-2">예약 페이지</h3>
              <p className="text-gray-600">8단계 예약 프로세스</p>
            </a>
            
            <a 
              href="/admin/schedule" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-xl font-semibold mb-2">관리자 일정</h3>
              <p className="text-gray-600">일정 관리 대시보드</p>
            </a>
            
            <a 
              href="/admin/task-master" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Task Master AI</h3>
              <p className="text-gray-600">AI 작업 관리</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 인테리어 필름 전문. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Next.js 15.4.1 + Supabase + Task Master AI
          </p>
        </div>
      </footer>
    </div>
  );
}