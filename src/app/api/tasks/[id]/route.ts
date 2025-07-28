import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://temp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'temp_service_key';

const supabase = createClient(supabaseUrl, supabaseKey);

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_dependencies:task_dependencies!task_id(
          id,
          depends_on_task_id,
          dependency_type,
          dependent_task:tasks!depends_on_task_id(id, title, status)
        ),
        time_logs:task_time_logs(
          id,
          start_time,
          end_time,
          duration,
          description,
          user_id
        ),
        ai_insights(
          id,
          insight_type,
          insight_data,
          confidence_score,
          created_at,
          is_applied
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Handle status change to completed
    if (body.status === 'completed' && body.status !== body.current_status) {
      body.completed_at = new Date().toISOString();
      
      // Calculate actual duration if time logs exist
      const { data: timeLogs } = await supabase
        .from('task_time_logs')
        .select('duration')
        .eq('task_id', id);

      if (timeLogs && timeLogs.length > 0) {
        const totalDuration = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
        body.actual_duration = totalDuration;
      }
    }

    // Recalculate AI priority if relevant fields changed
    if (body.priority || body.due_date || body.category) {
      const { data: currentTask } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (currentTask) {
        const updatedTask = { ...currentTask, ...body };
        body.ai_priority_score = calculateAIPriority(updatedTask);
      }
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log AI insight for status changes
    if (body.status && body.status !== body.current_status) {
      await supabase
        .from('ai_insights')
        .insert([
          {
            task_id: id,
            insight_type: 'status_change',
            insight_data: {
              previous_status: body.current_status,
              new_status: body.status,
              changed_at: new Date().toISOString(),
              completion_time: body.actual_duration || null
            },
            confidence_score: 1.0
          }
        ]);
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function for AI priority calculation (same as in route.ts)
function calculateAIPriority(task: any): number {
  let score = 50;
  
  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) score += 30;
    else if (daysDiff <= 1) score += 25;
    else if (daysDiff <= 3) score += 20;
    else if (daysDiff <= 7) score += 15;
    else if (daysDiff <= 14) score += 10;
    else score += 5;
  }
  
  switch (task.priority) {
    case 'urgent': score += 25; break;
    case 'high': score += 20; break;
    case 'medium': score += 10; break;
    case 'low': score += 0; break;
  }
  
  if (task.ai_complexity_score) {
    score += (task.ai_complexity_score * 3);
  }
  
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
  
  return Math.min(Math.max(score, 0), 100);
}