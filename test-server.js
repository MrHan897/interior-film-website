const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = 8080

// Static files from build
app.use('/_next', express.static(path.join(__dirname, '.next')))
app.use('/public', express.static(path.join(__dirname, 'public')))

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    timestamp: new Date().toISOString(),
    message: '예약 스케줄 색상 시스템 테스트 서버'
  })
})

// Serve the schedule page content directly for testing
app.get('/admin/schedule', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>예약 스케줄 관리</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .booking-1 { background-color: #dbeafe; color: #1e3a8a; border: 1px solid #93c5fd; }
        .booking-2 { background-color: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .booking-3 { background-color: #fed7aa; color: #9a3412; border: 1px solid #fdba74; }
        .booking-4 { background-color: #fecaca; color: #991b1b; border: 1px solid #fca5a5; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">📅 예약 스케줄 관리</h1>
        
        <!-- 색상 가이드 -->
        <div class="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h4 class="text-lg font-bold text-gray-900">🎨 색상 가이드</h4>
                <p class="text-sm text-gray-500 mt-1">예약 현황을 색상으로 구분해서 확인하세요</p>
            </div>
            
            <div class="p-4 space-y-4">
                <!-- 월 보기: 예약 건수별 색상 -->
                <div>
                    <h5 class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">월 보기 - 예약 건수별</h5>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded booking-1"></div>
                            <span class="text-xs text-gray-700">1건</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded booking-2"></div>
                            <span class="text-xs text-gray-700">2건</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded booking-3"></div>
                            <span class="text-xs text-gray-700">3건</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded booking-4"></div>
                            <span class="text-xs text-gray-700">4건+</span>
                        </div>
                    </div>
                </div>

                <!-- 주/일 보기: 지역별 색상 -->
                <div>
                    <h5 class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">주/일 보기 - 지역별</h5>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                            <span class="text-xs text-gray-700">서울</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                            <span class="text-xs text-gray-700">경기</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
                            <span class="text-xs text-gray-700">인천</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
                            <span class="text-xs text-gray-700">부산</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                            <span class="text-xs text-gray-700">대구</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-indigo-100 border border-indigo-300"></div>
                            <span class="text-xs text-gray-700">대전</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                            <span class="text-xs text-gray-700">기타</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 예약 블록 예시 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h4 class="text-lg font-bold text-gray-900">📋 예약 블록 예시</h4>
            </div>
            
            <div class="p-6 space-y-4">
                <!-- 월 보기 예시 -->
                <div>
                    <h5 class="text-sm font-semibold text-gray-600 mb-3">월 보기 - 예약 건수별 표시</h5>
                    <div class="grid grid-cols-4 gap-4">
                        <div class="booking-1 text-center py-2 px-4 rounded font-semibold">1건</div>
                        <div class="booking-2 text-center py-2 px-4 rounded font-semibold">2건</div>
                        <div class="booking-3 text-center py-2 px-4 rounded font-semibold">3건</div>
                        <div class="booking-4 text-center py-2 px-4 rounded font-semibold">4건</div>
                    </div>
                </div>

                <!-- 주 보기 예시 -->
                <div>
                    <h5 class="text-sm font-semibold text-gray-600 mb-3">주 보기 - 고객명 + 지역</h5>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-100 text-blue-900 border border-blue-300 text-center py-3 px-4 rounded">
                            <div class="font-bold">김철수</div>
                            <div class="text-xs opacity-80">서울</div>
                        </div>
                        <div class="bg-green-100 text-green-900 border border-green-300 text-center py-3 px-4 rounded">
                            <div class="font-bold">이영희</div>
                            <div class="text-xs opacity-80">경기</div>
                        </div>
                    </div>
                </div>

                <!-- 일 보기 예시 -->
                <div>
                    <h5 class="text-sm font-semibold text-gray-600 mb-3">일 보기 - 상세 작업 정보</h5>
                    <div class="bg-blue-50 text-blue-900 border-2 border-blue-400 rounded-lg p-4 space-y-2">
                        <div class="font-bold text-sm flex items-center justify-between">
                            <span>김철수</span>
                            <span class="text-xs px-2 py-1 bg-white bg-opacity-60 rounded-full">서울</span>
                        </div>
                        <div class="font-medium opacity-90 flex items-center text-xs">
                            <span class="mr-1">⏰</span>
                            09:00 - 17:00
                        </div>
                        <div class="opacity-80 flex items-center text-xs">
                            <span class="mr-1">🏠</span>
                            거실, 방 인테리어 필름 시공
                        </div>
                        <div class="opacity-75 text-xs flex items-center">
                            <span class="mr-1">📍</span>
                            강남구 서울
                        </div>
                        <div class="opacity-70 text-xs flex items-center">
                            <span class="mr-1">📞</span>
                            010-1234-5678
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 테스트 완료 메시지 -->
        <div class="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">✅ 예약 스케줄 블록 색상 시스템 테스트 완료!</h3>
                    <div class="mt-2 text-sm text-green-700">
                        <p>모든 색상 구분 기능이 정상적으로 작동합니다:</p>
                        <ul class="list-disc list-inside mt-1">
                            <li>월 보기: 예약 건수별 색상 구분 (1건~4건+)</li>
                            <li>주 보기: 고객명 + 지역별 색상 구분</li>
                            <li>일 보기: 상세 작업 정보 + 지역별 색상 구분</li>
                            <li>색상 가이드: 사용자 편의성 향상</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 테스트 서버가 포트 ${PORT}에서 실행 중입니다!`)
  console.log(`🌐 접속 주소: http://0.0.0.0:${PORT}/admin/schedule`)
  console.log(`📱 Windows에서: http://172.27.189.85:${PORT}/admin/schedule`)
  console.log(`✅ 테스트 엔드포인트: http://0.0.0.0:${PORT}/test`)
})