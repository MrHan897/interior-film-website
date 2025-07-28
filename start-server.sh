#!/bin/bash

# WSL2에서 Windows로 접근 가능한 서버 시작 스크립트

echo "🚀 인테리어 필름 웹사이트 서버 시작..."

# 환경 설정
export HOST=0.0.0.0
export PORT=3000

# Next.js 개발 서버 시작
npm run dev -- --hostname 0.0.0.0 --port 3000

echo "✅ 서버가 시작되었습니다!"
echo "🌐 접속 주소:"
echo "   - WSL 내부: http://localhost:3000"
echo "   - Windows: http://$(hostname -I | awk '{print $1}'):3000"
echo "   - 관리자 페이지: /admin/schedule"