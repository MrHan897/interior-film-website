'use client';

import React, { useState } from 'react';
import TaskMaster from '@/components/TaskMaster';
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import { 
  ChartBarIcon, 
  BoltIcon, 
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TaskMasterPage() {
  const [activeView, setActiveView] = useState<'tasks' | 'insights' | 'settings'>('tasks');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/schedule"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                관리자로 돌아가기
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <div className="flex items-center space-x-3">
                <BoltIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Task Master AI</h1>
                  <p className="text-sm text-gray-600">AI 기반 지능형 작업 관리 시스템</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('tasks')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'tasks'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ClipboardDocumentListIcon className="h-4 w-4" />
                <span>작업 관리</span>
              </button>
              
              <button
                onClick={() => setActiveView('insights')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'insights'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChartBarIcon className="h-4 w-4" />
                <span>AI 인사이트</span>
              </button>

              <button
                onClick={() => setActiveView('settings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'settings'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Cog6ToothIcon className="h-4 w-4" />
                <span>설정</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'tasks' && (
          <TaskMaster className="w-full" />
        )}

        {activeView === 'insights' && (
          <AIInsightsDashboard className="w-full" />
        )}

        {activeView === 'settings' && (
          <TaskMasterSettings />
        )}
      </div>

      {/* AI Status Indicator */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white rounded-full shadow-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <BoltIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">AI 작동중</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskMasterSettings() {
  const [settings, setSettings] = useState({
    aiSortByDefault: true,
    enableNotifications: true,
    autoAssignPriority: true,
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    categories: [
      'client_meetings',
      'installations',
      'measurements',
      'quotes',
      'follow_ups',
      'administrative'
    ],
    aiInsightFrequency: 'daily'
  });

  const [newCategory, setNewCategory] = useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
      setSettings(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Master AI 설정</h2>
      
      {/* 사용 방법 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BoltIcon className="h-6 w-6 text-blue-600 mr-2" />
          📖 Task Master AI 사용 방법
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">🎯 기본 사용법</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">1.</span>
                <span><strong>"작업 추가"</strong> 버튼으로 새 작업 생성</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">2.</span>
                <span>카테고리, 우선순위, 마감일 입력</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">3.</span>
                <span>AI가 자동으로 우선순위 점수 계산 (0-100점)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">4.</span>
                <span><strong>"AI 정렬"</strong> 토글로 스마트 정렬 활성화</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">🤖 AI 기능</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>스마트 우선순위:</strong> 마감일, 복잡도, 카테고리 종합 분석</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>최적 시간 추천:</strong> 작업 유형별 최적 작업 시간</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>준비사항 제안:</strong> 카테고리별 맞춤 체크리스트</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>생산성 분석:</strong> 완료율, 시간 정확도 추적</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ 현재 상태 및 설정 안내</h4>
          <div className="text-sm text-yellow-700">
            <p className="mb-2"><strong>데이터베이스 상태:</strong> 샘플 데이터 사용 중</p>
            <p className="mb-2"><strong>전체 기능 사용하려면:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Supabase 프로젝트 생성 및 연결</li>
              <li>환경변수 설정 (.env.local)</li>
              <li>데이터베이스 스키마 설정 (setup-task-master.sql 실행)</li>
              <li>서버 재시작</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* AI Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BoltIcon className="h-5 w-5 text-blue-600 mr-2" />
            AI 설정
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">기본 AI 정렬</label>
                <p className="text-sm text-gray-500">작업 정렬 시 AI 우선순위 점수 사용</p>
              </div>
              <button
                onClick={() => handleSettingChange('aiSortByDefault', !settings.aiSortByDefault)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.aiSortByDefault ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.aiSortByDefault ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">자동 우선순위 설정</label>
                <p className="text-sm text-gray-500">AI가 자동으로 작업 우선순위를 계산</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoAssignPriority', !settings.autoAssignPriority)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoAssignPriority ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoAssignPriority ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI 인사이트 빈도
              </label>
              <select
                value={settings.aiInsightFrequency}
                onChange={(e) => handleSettingChange('aiInsightFrequency', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="realtime">실시간</option>
                <option value="hourly">매시간</option>
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
              </select>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">근무 시간</h3>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => handleSettingChange('workingHours', {
                  ...settings.workingHours,
                  start: e.target.value
                })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => handleSettingChange('workingHours', {
                  ...settings.workingHours,
                  end: e.target.value
                })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Task Categories */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">작업 카테고리</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {category.replace('_', ' ')}
                  <button
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex space-x-2 max-w-md">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="새 카테고리 추가"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <button
                onClick={addCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                추가
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">알림 설정</h3>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">알림 활성화</label>
              <p className="text-sm text-gray-500">작업 업데이트 및 AI 인사이트 알림 받기</p>
            </div>
            <button
              onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
}