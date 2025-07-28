import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// AI-powered task analysis and insights
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get('type') || 'productivity';
    const userId = searchParams.get('user_id');
    const timeframe = searchParams.get('timeframe') || '7'; // days

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    let insights: any = {};

    switch (analysisType) {
      case 'productivity':
        insights = await generateProductivityInsights(userId, startDate, endDate);
        break;
      case 'optimization':
        insights = await generateOptimizationInsights(userId, startDate, endDate);
        break;
      case 'predictions':
        insights = await generatePredictionInsights(userId, startDate, endDate);
        break;
      case 'recommendations':
        insights = await generateRecommendations(userId, startDate, endDate);
        break;
      default:
        insights = await generateProductivityInsights(userId, startDate, endDate);
    }

    return NextResponse.json({ insights, timeframe, analysisType });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateProductivityInsights(userId: string | null, startDate: Date, endDate: Date) {
  // Get tasks in timeframe
  let tasksQuery = supabase
    .from('tasks')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (userId) {
    tasksQuery = tasksQuery.eq('assigned_to', userId);
  }

  const { data: tasks } = await tasksQuery;

  if (!tasks) return {};

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date() && t.status !== 'completed';
  });

  const totalEstimatedTime = tasks.reduce((sum, t) => sum + (t.estimated_duration || 0), 0);
  const totalActualTime = completedTasks.reduce((sum, t) => sum + (t.actual_duration || 0), 0);

  // Calculate productivity score
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const timeAccuracy = totalEstimatedTime > 0 ? 
    Math.max(0, 100 - Math.abs(totalActualTime - totalEstimatedTime) / totalEstimatedTime * 100) : 100;
  const overdueRate = tasks.length > 0 ? (overdueTasks.length / tasks.length) * 100 : 0;
  
  const productivityScore = (completionRate * 0.5) + (timeAccuracy * 0.3) + ((100 - overdueRate) * 0.2);

  // Category performance
  const categoryStats = tasks.reduce((stats, task) => {
    const category = task.category || 'uncategorized';
    if (!stats[category]) {
      stats[category] = { total: 0, completed: 0, avgDuration: 0, totalDuration: 0 };
    }
    stats[category].total++;
    if (task.status === 'completed') {
      stats[category].completed++;
      stats[category].totalDuration += task.actual_duration || 0;
    }
    return stats;
  }, {});

  // Calculate average duration per category
  Object.keys(categoryStats).forEach(category => {
    const stat = categoryStats[category];
    stat.avgDuration = stat.completed > 0 ? stat.totalDuration / stat.completed : 0;
    stat.completionRate = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
  });

  return {
    summary: {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: Math.round(completionRate),
      productivityScore: Math.round(productivityScore),
      timeAccuracy: Math.round(timeAccuracy)
    },
    categoryPerformance: categoryStats,
    trends: {
      dailyCompletion: calculateDailyTrends(completedTasks, startDate, endDate),
      peakHours: identifyPeakHours(completedTasks)
    }
  };
}

async function generateOptimizationInsights(userId: string | null, startDate: Date, endDate: Date) {
  let tasksQuery = supabase
    .from('tasks')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (userId) {
    tasksQuery = tasksQuery.eq('assigned_to', userId);
  }

  const { data: tasks } = await tasksQuery;
  if (!tasks) return {};

  const optimizations = [];

  // Time estimation accuracy
  const tasksWithBothTimes = tasks.filter(t => t.estimated_duration && t.actual_duration);
  if (tasksWithBothTimes.length > 0) {
    const avgAccuracy = tasksWithBothTimes.reduce((sum, t) => {
      const accuracy = 1 - Math.abs(t.actual_duration - t.estimated_duration) / t.estimated_duration;
      return sum + Math.max(0, accuracy);
    }, 0) / tasksWithBothTimes.length;

    if (avgAccuracy < 0.8) {
      optimizations.push({
        type: 'time_estimation',
        priority: 'high',
        description: 'Time estimation accuracy is below 80%. Consider breaking down complex tasks.',
        impact: 'medium',
        effort: 'low'
      });
    }
  }

  // Category batching opportunities
  const categoryDistribution = tasks.reduce((dist, task) => {
    const category = task.category || 'uncategorized';
    dist[category] = (dist[category] || 0) + 1;
    return dist;
  }, {});

  const scatteredCategories = Object.entries(categoryDistribution)
    .filter(([_, count]) => count >= 3)
    .map(([category, _]) => category);

  if (scatteredCategories.length > 2) {
    optimizations.push({
      type: 'task_batching',
      priority: 'medium',
      description: `Consider batching similar tasks: ${scatteredCategories.join(', ')}`,
      impact: 'high',
      effort: 'low'
    });
  }

  // Overdue pattern analysis
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date() && t.status !== 'completed';
  });

  if (overdueTasks.length > tasks.length * 0.2) {
    optimizations.push({
      type: 'deadline_management',
      priority: 'high',
      description: 'High rate of overdue tasks detected. Consider more realistic scheduling.',
      impact: 'high',
      effort: 'medium'
    });
  }

  return {
    optimizations,
    timeEstimationAccuracy: tasksWithBothTimes.length > 0 ? 
      Math.round((tasksWithBothTimes.reduce((sum, t) => {
        const accuracy = 1 - Math.abs(t.actual_duration - t.estimated_duration) / t.estimated_duration;
        return sum + Math.max(0, accuracy);
      }, 0) / tasksWithBothTimes.length) * 100) : null,
    batchingOpportunities: scatteredCategories,
    overdueRate: Math.round((overdueTasks.length / tasks.length) * 100)
  };
}

async function generatePredictionInsights(userId: string | null, startDate: Date, endDate: Date) {
  let tasksQuery = supabase
    .from('tasks')
    .select('*')
    .eq('status', 'pending');

  if (userId) {
    tasksQuery = tasksQuery.eq('assigned_to', userId);
  }

  const { data: pendingTasks } = await tasksQuery;
  if (!pendingTasks) return {};

  // Get historical completion times for similar tasks
  let historicalQuery = supabase
    .from('tasks')
    .select('category, actual_duration, ai_complexity_score')
    .eq('status', 'completed')
    .not('actual_duration', 'is', null);

  if (userId) {
    historicalQuery = historicalQuery.eq('assigned_to', userId);
  }

  const { data: historicalTasks } = await historicalQuery;

  const predictions = pendingTasks.map(task => {
    // Find similar historical tasks
    const similarTasks = historicalTasks?.filter(h => 
      h.category === task.category && 
      Math.abs((h.ai_complexity_score || 3) - (task.ai_complexity_score || 3)) <= 1
    ) || [];

    let predictedDuration = task.estimated_duration;
    if (similarTasks.length > 0) {
      const avgHistoricalDuration = similarTasks.reduce((sum, t) => sum + t.actual_duration, 0) / similarTasks.length;
      predictedDuration = Math.round(avgHistoricalDuration);
    }

    // Predict completion date based on current workload
    const workdaysUntilDue = task.due_date ? calculateWorkdays(new Date(), new Date(task.due_date)) : null;
    
    return {
      taskId: task.id,
      title: task.title,
      predictedDuration,
      confidence: similarTasks.length >= 3 ? 'high' : similarTasks.length >= 1 ? 'medium' : 'low',
      riskFactors: identifyRiskFactors(task, workdaysUntilDue),
      recommendedStartDate: calculateRecommendedStartDate(task, predictedDuration)
    };
  });

  return {
    taskPredictions: predictions,
    workloadForecast: calculateWorkloadForecast(pendingTasks),
    riskyTasks: predictions.filter(p => p.riskFactors.length > 0)
  };
}

async function generateRecommendations(userId: string | null, startDate: Date, endDate: Date) {
  const recommendations = [];

  // Get user's task patterns
  let tasksQuery = supabase
    .from('tasks')
    .select('*')
    .gte('created_at', startDate.toISOString());

  if (userId) {
    tasksQuery = tasksQuery.eq('assigned_to', userId);
  }

  const { data: tasks } = await tasksQuery;
  if (!tasks) return { recommendations: [] };

  // AI recommendations based on patterns
  
  // 1. Time blocking recommendation
  const categoryGroups = tasks.reduce((groups, task) => {
    const category = task.category || 'uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(task);
    return groups;
  }, {});

  Object.entries(categoryGroups).forEach(([category, categoryTasks]: [string, any]) => {
    if (categoryTasks.length >= 3) {
      recommendations.push({
        type: 'time_blocking',
        title: `Block time for ${category} tasks`,
        description: `You have ${categoryTasks.length} ${category} tasks. Consider dedicating specific time blocks for this type of work.`,
        priority: 'medium',
        impact: 'efficiency'
      });
    }
  });

  // 2. Template suggestion
  const frequentTasks = Object.entries(
    tasks.reduce((freq, task) => {
      const key = task.title.toLowerCase().replace(/\d+/g, '').trim();
      freq[key] = (freq[key] || 0) + 1;
      return freq;
    }, {})
  ).filter(([_, count]) => count >= 2);

  if (frequentTasks.length > 0) {
    recommendations.push({
      type: 'task_templates',
      title: 'Create task templates',
      description: `Consider creating templates for recurring tasks like: ${frequentTasks.map(([task, _]) => task).join(', ')}`,
      priority: 'low',
      impact: 'efficiency'
    });
  }

  // 3. Deadline management
  const urgentTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    const daysUntilDue = Math.ceil((new Date(t.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 2 && t.status !== 'completed';
  });

  if (urgentTasks.length >= 3) {
    recommendations.push({
      type: 'workload_management',
      title: 'Urgent tasks clustering detected',
      description: `You have ${urgentTasks.length} tasks due within 2 days. Consider delegating or rescheduling non-critical tasks.`,
      priority: 'high',
      impact: 'stress_reduction'
    });
  }

  return { recommendations };
}

// Helper functions
function calculateDailyTrends(tasks: any[], startDate: Date, endDate: Date) {
  const dailyCount: { [key: string]: number } = {};
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dailyCount[dateStr] = 0;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  tasks.forEach(task => {
    if (task.completed_at) {
      const dateStr = new Date(task.completed_at).toISOString().split('T')[0];
      if (dailyCount.hasOwnProperty(dateStr)) {
        dailyCount[dateStr]++;
      }
    }
  });

  return Object.entries(dailyCount).map(([date, count]) => ({ date, count }));
}

function identifyPeakHours(tasks: any[]) {
  const hourCounts: { [key: number]: number } = {};
  
  tasks.forEach(task => {
    if (task.completed_at) {
      const hour = new Date(task.completed_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  const sortedHours = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }));

  return sortedHours;
}

function calculateWorkdays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

function identifyRiskFactors(task: any, workdaysUntilDue: number | null): string[] {
  const risks = [];
  
  if (workdaysUntilDue !== null && workdaysUntilDue <= 1) {
    risks.push('Very tight deadline');
  }
  
  if (task.ai_complexity_score >= 4) {
    risks.push('High complexity');
  }
  
  if (!task.estimated_duration) {
    risks.push('No time estimate');
  }
  
  if (task.priority === 'urgent' && workdaysUntilDue !== null && workdaysUntilDue > 5) {
    risks.push('Urgent task with distant deadline may lose focus');
  }
  
  return risks;
}

function calculateRecommendedStartDate(task: any, predictedDuration: number): string | null {
  if (!task.due_date) return null;
  
  const dueDate = new Date(task.due_date);
  const bufferHours = Math.max(2, predictedDuration * 0.2); // 20% buffer, minimum 2 hours
  const totalHours = predictedDuration + bufferHours;
  
  // Assume 8 working hours per day
  const daysNeeded = Math.ceil(totalHours / (8 * 60)); // totalHours is in minutes
  
  const recommendedStart = new Date(dueDate);
  recommendedStart.setDate(recommendedStart.getDate() - daysNeeded);
  
  return recommendedStart.toISOString().split('T')[0];
}

function calculateWorkloadForecast(pendingTasks: any[]) {
  const totalEstimatedHours = pendingTasks.reduce((sum, task) => {
    return sum + (task.estimated_duration || 60); // Default 1 hour if no estimate
  }, 0) / 60; // Convert to hours

  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent').length;
  const overdueTasks = pendingTasks.filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date();
  }).length;

  return {
    totalEstimatedHours: Math.round(totalEstimatedHours),
    totalTasks: pendingTasks.length,
    urgentTasks,
    overdueTasks,
    workloadLevel: totalEstimatedHours > 40 ? 'high' : totalEstimatedHours > 20 ? 'medium' : 'low'
  };
}