/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskMasterContainer from '../../src/components/TaskMasterContainer';
import { useTaskManagement } from '../../src/hooks/useTaskManagement';

// Mock the custom hook
jest.mock('../../src/hooks/useTaskManagement');

const mockUseTaskManagement = useTaskManagement as jest.MockedFunction<typeof useTaskManagement>;

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test description',
    status: 'pending' as const,
    priority: 'high' as const,
    ai_priority_score: 85,
    category: 'client_meetings',
    tags: ['urgent', 'client'],
    due_date: '2024-02-01',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Test Task 2',
    status: 'in_progress' as const,
    priority: 'medium' as const,
    ai_priority_score: 70,
    created_at: '2024-01-16T10:00:00Z'
  }
];

describe('TaskMasterContainer', () => {
  const mockFetchTasks = jest.fn();
  const mockUpdateTaskStatus = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    mockUseTaskManagement.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      updateTaskStatus: mockUpdateTaskStatus,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      clearError: mockClearError
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with correct title and task count', () => {
    render(<TaskMasterContainer />);
    
    expect(screen.getByText('Task Master AI')).toBeInTheDocument();
    expect(screen.getByText('2개 작업')).toBeInTheDocument();
  });

  it('renders filter panel with all filter options', () => {
    render(<TaskMasterContainer />);
    
    expect(screen.getByDisplayValue('전체 상태')).toBeInTheDocument();
    expect(screen.getByDisplayValue('전체 우선순위')).toBeInTheDocument();
    expect(screen.getByDisplayValue('전체 카테고리')).toBeInTheDocument();
  });

  it('renders task list with correct number of tasks', () => {
    render(<TaskMasterContainer />);
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('총 2개 작업')).toBeInTheDocument();
  });

  it('opens create task modal when create button is clicked', () => {
    render(<TaskMasterContainer />);
    
    fireEvent.click(screen.getByText('작업 추가'));
    expect(screen.getByText('새 작업 생성')).toBeInTheDocument();
  });

  it('handles filter changes correctly', async () => {
    render(<TaskMasterContainer />);
    
    const statusFilter = screen.getByDisplayValue('전체 상태');
    fireEvent.change(statusFilter, { target: { value: 'pending' } });
    
    await waitFor(() => {
      expect(mockFetchTasks).toHaveBeenCalledWith({
        status: 'pending',
        priority: 'all',
        category: 'all',
        aiSort: true
      });
    });
  });

  it('handles task status updates', async () => {
    mockUpdateTaskStatus.mockResolvedValue(true);
    
    render(<TaskMasterContainer />);
    
    const completeButton = screen.getAllByText('완료')[0];
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', 'completed');
    });
  });

  it('shows loading state', () => {
    mockUseTaskManagement.mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      fetchTasks: mockFetchTasks,
      updateTaskStatus: mockUpdateTaskStatus,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      clearError: mockClearError
    });

    render(<TaskMasterContainer />);
    expect(screen.getByText('작업을 불러오는 중...')).toBeInTheDocument();
  });

  it('shows error state and allows error dismissal', () => {
    mockUseTaskManagement.mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to load tasks',
      fetchTasks: mockFetchTasks,
      updateTaskStatus: mockUpdateTaskStatus,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      clearError: mockClearError
    });

    render(<TaskMasterContainer />);
    
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('닫기'));
    expect(mockClearError).toHaveBeenCalled();
  });

  it('shows empty state when no tasks', () => {
    mockUseTaskManagement.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      updateTaskStatus: mockUpdateTaskStatus,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      clearError: mockClearError
    });

    render(<TaskMasterContainer />);
    
    expect(screen.getByText('등록된 작업이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('작업 생성하기')).toBeInTheDocument();
  });
});