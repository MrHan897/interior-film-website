'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  BoltIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CalendarIcon,
  TagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  ai_priority_score: number;
  category?: string;
  tags?: string[];
  due_date?: string;
  estimated_duration?: number;
  actual_duration?: number;
  assigned_to?: string;
  created_at: string;
  completed_at?: string;
  ai_suggestions?: any;
  ai_complexity_score?: number;
}

interface TaskMasterProps {
  className?: string;
}

export default function TaskMaster({ className = '' }: TaskMasterProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    aiSort: true
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.priority !== 'all') params.append('priority', filter.priority);
      if (filter.category !== 'all') params.append('category', filter.category);
      if (filter.aiSort) params.append('ai_sort', 'true');

      const response = await fetch(`/api/tasks?${params}`);
      const data = await response.json();
      
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          current_status: task?.status 
        })
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIconSolid className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'on_hold':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BoltIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Master AI</h1>
              <p className="text-sm text-gray-600">AI 기반 지능형 작업 관리 시스템</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>작업 추가</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체 상태</option>
            <option value="pending">대기중</option>
            <option value="in_progress">진행중</option>
            <option value="completed">완료</option>
            <option value="on_hold">보류</option>
          </select>

          <select
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체 우선순위</option>
            <option value="urgent">긴급</option>
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체 카테고리</option>
            <option value="client_meetings">고객 미팅</option>
            <option value="installations">현장 설치</option>
            <option value="measurements">현장 측정</option>
            <option value="quotes">견적 작성</option>
            <option value="follow_ups">고객 후속관리</option>
            <option value="administrative">업무 관리</option>
          </select>

          <button
            onClick={() => setFilter({ ...filter, aiSort: !filter.aiSort })}
            className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-2 ${
              filter.aiSort 
                ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <BoltIcon className="h-4 w-4" />
            <span>AI 정렬</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 작업이 없습니다</h3>
            <p className="text-gray-600 mb-4">
              첫 번째 작업을 생성하여 AI 기반 작업 관리를 시작해보세요.<br/>
              <span className="text-sm bg-yellow-50 text-yellow-700 px-2 py-1 rounded mt-2 inline-block">
                💡 데이터베이스 연결이 필요합니다. Supabase 설정을 확인해주세요.
              </span>
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              작업 생성하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const daysUntilDue = getDaysUntilDue(task.due_date);
              const overdue = isOverdue(task.due_date);
              
              return (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                          updateTaskStatus(task.id, newStatus);
                        }}
                        className="mt-1"
                      >
                        {getStatusIcon(task.status)}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-medium ${
                            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          
                          {/* AI Priority Score */}
                          <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            <BoltIcon className="h-3 w-3" />
                            <span>{task.ai_priority_score}</span>
                          </div>
                          
                          {/* Priority Badge */}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {task.category && (
                            <div className="flex items-center space-x-1">
                              <TagIcon className="h-4 w-4" />
                              <span>{task.category.replace('_', ' ')}</span>
                            </div>
                          )}

                          {task.estimated_duration && (
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>{formatDuration(task.estimated_duration)}</span>
                            </div>
                          )}

                          {task.assigned_to && (
                            <div className="flex items-center space-x-1">
                              <UserIcon className="h-4 w-4" />
                              <span>{task.assigned_to}</span>
                            </div>
                          )}

                          {task.due_date && (
                            <div className={`flex items-center space-x-1 ${
                              overdue ? 'text-red-600' : daysUntilDue !== null && daysUntilDue <= 1 ? 'text-orange-600' : ''
                            }`}>
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {overdue 
                                  ? `Overdue by ${Math.abs(daysUntilDue!)} days`
                                  : daysUntilDue === 0 
                                    ? 'Due today'
                                    : daysUntilDue === 1
                                      ? 'Due tomorrow'
                                      : `${daysUntilDue} days left`
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {/* AI Suggestions Preview */}
                        {task.ai_suggestions?.recommended_time && (
                          <div className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs inline-block">
                            <BoltIcon className="h-3 w-3 inline mr-1" />
                            AI 추천: 최적 시간 - {task.ai_suggestions.recommended_time === 'morning' ? '오전' : task.ai_suggestions.recommended_time === 'afternoon' ? '오후' : task.ai_suggestions.recommended_time}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* Complexity Score */}
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ChartBarIcon className="h-4 w-4" />
                        <span>{task.ai_complexity_score || 3}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <TaskCreateModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchTasks();
          }}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={fetchTasks}
        />
      )}
    </div>
  );
}

// Task Create Modal Component
function TaskCreateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    due_date: '',
    estimated_duration: '',
    assigned_to: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
          due_date: formData.due_date || null
        })
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">새 작업 생성</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="작업 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="작업 설명을 입력하세요"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">카테고리 선택</option>
                  <option value="client_meetings">고객 미팅</option>
                  <option value="installations">현장 설치</option>
                  <option value="measurements">현장 측정</option>
                  <option value="quotes">견적 작성</option>
                  <option value="follow_ups">고객 후속관리</option>
                  <option value="administrative">업무 관리</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">마감일</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예상 소요시간 (분)</label>
                <input
                  type="number"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
              <input
                type="text"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="담당자 이름을 입력하세요"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📖 사용 방법</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• AI가 자동으로 우선순위 점수를 계산합니다</li>
                <li>• 카테고리별로 최적 시간을 추천합니다</li>
                <li>• 작업 유형에 따라 준비사항을 제안합니다</li>
                <li>• 데이터베이스 연결 시 모든 기능이 활성화됩니다</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '생성 중...' : '작업 생성'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Task Detail Modal Component (simplified for now)
function TaskDetailModal({ task, onClose, onUpdate }: { 
  task: Task; 
  onClose: () => void; 
  onUpdate: () => void; 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{task.title}</h3>
            {task.description && <p className="text-gray-600">{task.description}</p>}
            
            {/* AI Suggestions */}
            {task.ai_suggestions && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <BoltIcon className="h-5 w-5 mr-2" />
                  AI Suggestions
                </h4>
                {task.ai_suggestions.recommended_time && (
                  <p className="text-blue-700 text-sm">
                    <strong>Best time:</strong> {task.ai_suggestions.recommended_time}
                  </p>
                )}
                {task.ai_suggestions.preparation_items && task.ai_suggestions.preparation_items.length > 0 && (
                  <div className="mt-2">
                    <p className="text-blue-700 text-sm font-medium">Preparation items:</p>
                    <ul className="text-blue-600 text-sm list-disc list-inside">
                      {task.ai_suggestions.preparation_items.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}