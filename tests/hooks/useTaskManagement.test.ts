/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useTaskManagement } from '../../src/hooks/useTaskManagement';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('useTaskManagement', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches tasks successfully', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'pending', priority: 'high', created_at: '2024-01-01' },
      { id: '2', title: 'Task 2', status: 'completed', priority: 'medium', created_at: '2024-01-02' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: mockTasks })
    } as Response);

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      await result.current.fetchTasks();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      await result.current.fetchTasks();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('updates task status successfully', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'pending', priority: 'high', created_at: '2024-01-01' }
    ];

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: mockTasks })
    } as Response);

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      await result.current.fetchTasks();
    });

    // Mock status update
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response);

    await act(async () => {
      const success = await result.current.updateTaskStatus('1', 'completed');
      expect(success).toBe(true);
    });

    expect(result.current.tasks[0].status).toBe('completed');
  });

  it('handles update task status error', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'pending', priority: 'high', created_at: '2024-01-01' }
    ];

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: mockTasks })
    } as Response);

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      await result.current.fetchTasks();
    });

    // Mock failed status update
    mockFetch.mockRejectedValueOnce(new Error('Update failed'));

    await act(async () => {
      const success = await result.current.updateTaskStatus('1', 'completed');
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Update failed');
    expect(result.current.tasks[0].status).toBe('pending'); // Should remain unchanged
  });

  it('creates task successfully', async () => {
    const newTaskData = {
      title: 'New Task',
      description: 'New task description',
      priority: 'high' as const,
      status: 'pending' as const
    };

    const createdTask = {
      id: '1',
      ...newTaskData,
      created_at: '2024-01-01T00:00:00Z'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createdTask
    } as Response);

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      const task = await result.current.createTask(newTaskData);
      expect(task).toEqual(createdTask);
    });

    expect(result.current.tasks).toContain(createdTask);
  });

  it('handles create task error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Create failed'));

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      const task = await result.current.createTask({ title: 'New Task' });
      expect(task).toBeNull();
    });

    expect(result.current.error).toBe('Create failed');
  });

  it('deletes task successfully', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'pending', priority: 'high', created_at: '2024-01-01' },
      { id: '2', title: 'Task 2', status: 'completed', priority: 'medium', created_at: '2024-01-02' }
    ];

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: mockTasks })
    } as Response);

    const { result } = renderHook(() => useTaskManagement());

    await act(async () => {
      await result.current.fetchTasks();
    });

    // Mock delete
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response);

    await act(async () => {
      const success = await result.current.deleteTask('1');
      expect(success).toBe(true);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('2');
  });

  it('clears error', () => {
    const { result } = renderHook(() => useTaskManagement());

    act(() => {
      // Simulate error state
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});