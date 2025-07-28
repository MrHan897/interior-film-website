import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// AI Priority Calculation Algorithm
function calculateAIPriority(task: any): number {
  let score = 50; // Base score
  
  // Due date urgency (0-30 points)
  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) score += 30; // Overdue
    else if (daysDiff <= 1) score += 25; // Due today/tomorrow
    else if (daysDiff <= 3) score += 20; // Due within 3 days
    else if (daysDiff <= 7) score += 15; // Due within a week
    else if (daysDiff <= 14) score += 10; // Due within 2 weeks
    else score += 5; // Future tasks
  }
  
  // Priority level (0-25 points)
  switch (task.priority) {
    case 'urgent': score += 25; break;
    case 'high': score += 20; break;
    case 'medium': score += 10; break;
    case 'low': score += 0; break;
  }
  
  // Complexity factor (0-15 points) - higher complexity = higher priority
  if (task.ai_complexity_score) {
    score += (task.ai_complexity_score * 3);
  }
  
  // Category-based priorities for interior film business
  const categoryBonus: { [key: string]: number } = {
    'client_meetings': 15,
    'installations': 12,
    'measurements': 10,
    'quotes': 8,
    'follow_ups': 5,
    'administrative': 2
  };
  
  if (task.category && categoryBonus[task.category]) {
    score += categoryBonus[task.category];
  }
  
  return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
}

// AI Task Suggestions
function generateAISuggestions(task: any, relatedTasks: any[] = []): any {
  const suggestions: any = {
    recommended_time: null,
    preparation_items: [],
    follow_up_tasks: [],
    efficiency_tips: []
  };
  
  // Time recommendations based on category
  const timeRecommendations: { [key: string]: string } = {
    'client_meetings': 'morning', // Best for professional meetings
    'installations': 'morning', // Good weather and energy
    'measurements': 'afternoon', // Good light conditions
    'quotes': 'morning', // Requires focus and calculation
    'follow_ups': 'afternoon', // Less demanding
    'administrative': 'afternoon' // Lower energy tasks
  };
  
  if (task.category && timeRecommendations[task.category]) {
    suggestions.recommended_time = timeRecommendations[task.category];
  }
  
  // Category-specific preparation items
  const preparationItems: { [key: string]: string[] } = {
    'client_meetings': ['Review client history', 'Prepare samples', 'Check calendar for travel time'],
    'installations': ['Check weather forecast', 'Prepare tools', 'Confirm team availability'],
    'measurements': ['Charge devices', 'Bring measuring tools', 'Check site access'],
    'quotes': ['Gather current pricing', 'Review measurement data', 'Check material availability']
  };
  
  if (task.category && preparationItems[task.category]) {
    suggestions.preparation_items = preparationItems[task.category];
  }
  
  // Suggest follow-up tasks
  const followUpTasks: { [key: string]: string[] } = {
    'client_meetings': ['Send meeting summary', 'Prepare quote', 'Schedule follow-up'],
    'measurements': ['Process measurements', 'Prepare quote', 'Upload photos'],
    'installations': ['Clean up site', 'Update completion status', 'Schedule quality check']
  };
  
  if (task.category && followUpTasks[task.category]) {
    suggestions.follow_up_tasks = followUpTasks[task.category];
  }
  
  // Efficiency tips
  const efficiencyTips: { [key: string]: string[] } = {
    'client_meetings': ['Batch meetings in same area', 'Prepare standard presentation'],
    'measurements': ['Group nearby properties', 'Use digital tools for accuracy'],
    'quotes': ['Use templates', 'Double-check calculations']
  };
  
  if (task.category && efficiencyTips[task.category]) {
    suggestions.efficiency_tips = efficiencyTips[task.category];
  }
  
  return suggestions;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assigned_to');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '50';
    const aiSort = searchParams.get('ai_sort') === 'true';

    let query = supabase
      .from('tasks')
      .select('*')
      .limit(parseInt(limit));

    // Apply filters
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (assignedTo) query = query.eq('assigned_to', assignedTo);
    if (category) query = query.eq('category', category);

    // Sort by AI priority or creation date
    if (aiSort) {
      query = query.order('ai_priority_score', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: tasks, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority = 'medium',
      category,
      tags = [],
      due_date,
      estimated_duration,
      assigned_to,
      created_by
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create task object
    const taskData = {
      title,
      description,
      priority,
      category,
      tags,
      due_date,
      estimated_duration,
      assigned_to,
      created_by
    };

    // Calculate AI priority score
    const aiPriorityScore = calculateAIPriority(taskData);
    taskData.ai_priority_score = aiPriorityScore;

    // Generate AI suggestions
    const aiSuggestions = generateAISuggestions(taskData);
    taskData.ai_suggestions = aiSuggestions;

    // Determine AI complexity score based on description and category
    let complexityScore = 3; // Default
    if (category === 'installations') complexityScore = 4;
    if (category === 'client_meetings') complexityScore = 3;
    if (category === 'measurements') complexityScore = 2;
    if (category === 'administrative') complexityScore = 1;
    
    taskData.ai_complexity_score = complexityScore;

    // Insert task into database
    const { data: task, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create AI insight record
    await supabase
      .from('ai_insights')
      .insert([
        {
          task_id: task.id,
          insight_type: 'priority_calculation',
          insight_data: {
            calculated_score: aiPriorityScore,
            factors: {
              due_date_factor: due_date ? 'applied' : 'not_applicable',
              priority_factor: priority,
              category_factor: category || 'none',
              complexity_factor: complexityScore
            }
          },
          confidence_score: 0.85
        }
      ]);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}