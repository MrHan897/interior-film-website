'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  BoltIcon,
  ClockIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface AIInsight {
  type: string;
  title?: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: string;
  effort?: string;
}

interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  productivityScore: number;
  timeAccuracy: number;
}

interface CategoryPerformance {
  [category: string]: {
    total: number;
    completed: number;
    avgDuration: number;
    completionRate: number;
  };
}

interface DashboardData {
  insights: {
    summary: ProductivityMetrics;
    categoryPerformance: CategoryPerformance;
    trends: {
      dailyCompletion: Array<{ date: string; count: number }>;
      peakHours: Array<{ hour: number; count: number }>;
    };
    optimizations?: AIInsight[];
    recommendations?: AIInsight[];
  };
  timeframe: string;
  analysisType: string;
}

interface AIInsightsDashboardProps {
  className?: string;
  userId?: string;
}

export default function AIInsightsDashboard({ className = '', userId }: AIInsightsDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'productivity' | 'optimization' | 'predictions' | 'recommendations'>('productivity');
  const [timeframe, setTimeframe] = useState('7');

  useEffect(() => {
    fetchInsights();
  }, [selectedTab, timeframe, userId, fetchInsights]);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: selectedTab,
        timeframe: timeframe
      });
      
      if (userId) {
        params.append('user_id', userId);
      }

      const response = await fetch(`/api/tasks/ai-insights?${params}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTab, timeframe, userId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center py-12">
          <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI 인사이트가 없습니다</h3>
          <p className="text-gray-600">
            작업을 생성하여 AI 기반 인사이트를 확인해보세요.<br/>
            <span className="text-sm bg-yellow-50 text-yellow-700 px-2 py-1 rounded mt-2 inline-block">
              💡 데이터베이스 연결이 필요합니다. Supabase 설정을 확인해주세요.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BoltIcon className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI 인사이트 대시보드</h1>
              <p className="text-sm text-gray-600">지능형 분석 및 추천 시스템</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="1">최근 24시간</option>
              <option value="7">최근 7일</option>
              <option value="30">최근 30일</option>
              <option value="90">최근 90일</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'productivity', label: '생산성 분석', icon: ChartBarIcon },
            { key: 'optimization', label: '최적화 제안', icon: ArrowTrendingUpIcon },
            { key: 'predictions', label: '예측 분석', icon: CalendarDaysIcon },
            { key: 'recommendations', label: 'AI 추천', icon: LightBulbIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === key
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'productivity' && dashboardData.insights.summary && (
          <ProductivityView
            summary={dashboardData.insights.summary}
            categoryPerformance={dashboardData.insights.categoryPerformance}
            trends={dashboardData.insights.trends}
          />
        )}

        {selectedTab === 'optimization' && dashboardData.insights.optimizations && (
          <OptimizationView optimizations={dashboardData.insights.optimizations} />
        )}

        {selectedTab === 'predictions' && (
          <PredictionsView />
        )}

        {selectedTab === 'recommendations' && dashboardData.insights.recommendations && (
          <RecommendationsView recommendations={dashboardData.insights.recommendations} />
        )}
      </div>
    </div>
  );
}

function ProductivityView({ 
  summary, 
  categoryPerformance, 
  trends 
}: { 
  summary: ProductivityMetrics;
  categoryPerformance: CategoryPerformance;
  trends: any;
}) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-900">{formatPercentage(summary.completionRate)}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Productivity Score</p>
              <p className="text-2xl font-bold text-purple-900">{summary.productivityScore}/100</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Time Accuracy</p>
              <p className="text-2xl font-bold text-green-900">{formatPercentage(summary.timeAccuracy)}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Overdue Tasks</p>
              <p className="text-2xl font-bold text-red-900">{summary.overdueTasks}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Performance</h3>
        <div className="space-y-3">
          {Object.entries(categoryPerformance).map(([category, performance]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {performance.completed}/{performance.total} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${performance.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatPercentage(performance.completionRate)}
                </p>
                {performance.avgDuration > 0 && (
                  <p className="text-xs text-gray-500">
                    Avg: {Math.round(performance.avgDuration)}m
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours */}
      {trends.peakHours && trends.peakHours.length > 0 && (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BoltIcon className="h-5 w-5 text-yellow-600 mr-2" />
            Peak Productivity Hours
          </h3>
          <div className="flex space-x-4">
            {trends.peakHours.map((peak: any, index: number) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {peak.hour}:00 - {peak.hour + 1}:00
                </p>
                <p className="text-xs text-gray-500">{peak.count} tasks completed</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OptimizationView({ optimizations }: { optimizations: AIInsight[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Optimization Opportunities</h3>
      
      {optimizations.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Great job!</h3>
          <p className="text-gray-600">No major optimization opportunities detected.</p>
        </div>
      ) : (
        optimizations.map((optimization, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getPriorityColor(optimization.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  {optimization.title || optimization.type.replace('_', ' ')}
                </h4>
                <p className="text-gray-700 text-sm mb-2">{optimization.description}</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="font-medium">Impact: {optimization.impact}</span>
                  {optimization.effort && (
                    <span className="font-medium">Effort: {optimization.effort}</span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(optimization.priority)}`}>
                {optimization.priority.toUpperCase()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function PredictionsView() {
  return (
    <div className="text-center py-12">
      <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Predictions Coming Soon</h3>
      <p className="text-gray-600">AI-powered task predictions and forecasting will be available soon.</p>
    </div>
  );
}

function RecommendationsView({ recommendations }: { recommendations: AIInsight[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h3>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations</h3>
          <p className="text-gray-600">Complete more tasks to get personalized AI recommendations.</p>
        </div>
      ) : (
        recommendations.map((recommendation, index) => (
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <LightBulbIcon className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-2">
                  {recommendation.title || recommendation.type.replace('_', ' ')}
                </h4>
                <p className="text-blue-800 text-sm mb-2">{recommendation.description}</p>
                <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {recommendation.impact}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}