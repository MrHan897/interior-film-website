-- Task Master AI Database Setup Script
-- Run this script in your Supabase SQL editor to set up the Task Master AI system

-- Source the task management schema
\i supabase-tasks-schema.sql

-- Create some sample data for demonstration
INSERT INTO tasks (title, description, priority, category, due_date, estimated_duration, assigned_to, created_by) VALUES
(
  'Schedule client consultation for apartment renovation',
  'Meet with Kim family to discuss their living room film installation project. Review space requirements and design preferences.',
  'high',
  'client_meetings',
  (NOW() + INTERVAL '2 days')::timestamptz,
  90,
  'admin',
  'system'
),
(
  'Measure windows at Seoul downtown office',
  'Visit the new startup office space to measure all windows for privacy film installation. Bring measuring equipment and camera.',
  'high',
  'measurements',
  (NOW() + INTERVAL '1 day')::timestamptz,
  120,
  'admin',
  'system'
),
(
  'Prepare quote for cafe interior project',
  'Calculate costs for wood pattern film installation at the new cafe in Gangnam. Include material costs, labor, and timeline.',
  'medium',
  'quotes',
  (NOW() + INTERVAL '3 days')::timestamptz,
  60,
  'admin',
  'system'
),
(
  'Install decorative film at residential property',
  'Complete the marble pattern film installation in the kitchen area. Ensure proper preparation and clean finishing.',
  'high',
  'installations',
  (NOW() + INTERVAL '5 days')::timestamptz,
  240,
  'admin',
  'system'
),
(
  'Follow up with hotel chain procurement',
  'Contact the hotel chain about their decision on the privacy film project for 20 rooms. Provide any additional information needed.',
  'medium',
  'follow_ups',
  (NOW() + INTERVAL '7 days')::timestamptz,
  30,
  'admin',
  'system'
),
(
  'Update portfolio website with recent projects',
  'Add photos and descriptions of the 3 completed projects from last month to the company portfolio section.',
  'low',
  'administrative',
  (NOW() + INTERVAL '10 days')::timestamptz,
  45,
  'admin',
  'system'
),
(
  'Order materials for upcoming projects',
  'Place orders for wood grain film, privacy film, and installation tools based on confirmed projects for next month.',
  'medium',
  'administrative',
  (NOW() + INTERVAL '4 days')::timestamptz,
  30,
  'admin',
  'system'
),
(
  'Site inspection for corporate headquarters',
  'Conduct detailed site inspection at the corporate headquarters to assess requirements for large-scale film installation.',
  'high',
  'measurements',
  (NOW() + INTERVAL '6 days')::timestamptz,
  180,
  'admin',
  'system'
);

-- Create some AI insights for demonstration
INSERT INTO ai_insights (task_id, insight_type, insight_data, confidence_score) 
SELECT 
  t.id,
  'optimization_suggestion',
  '{"recommendation": "Consider batching client meetings in the same area", "time_savings": "20%", "efficiency_gain": "medium"}',
  0.87
FROM tasks t 
WHERE t.category = 'client_meetings' 
LIMIT 1;

INSERT INTO ai_insights (insight_type, insight_data, confidence_score) VALUES
(
  'workflow_optimization',
  '{"pattern": "measurement_then_quote", "success_rate": "94%", "recommendation": "Always schedule measurements before quote preparation", "impact": "high"}',
  0.94
),
(
  'productivity_insight',
  '{"peak_hours": ["09:00-11:00", "14:00-16:00"], "best_day": "Tuesday", "efficiency_tips": ["Batch similar tasks", "Schedule demanding work during peak hours"]}',
  0.91
);

-- Update AI priority scores for the sample tasks
UPDATE tasks 
SET ai_priority_score = CASE 
  WHEN priority = 'urgent' THEN 90 + FLOOR(RANDOM() * 10)
  WHEN priority = 'high' THEN 70 + FLOOR(RANDOM() * 15)
  WHEN priority = 'medium' THEN 50 + FLOOR(RANDOM() * 20)
  WHEN priority = 'low' THEN 20 + FLOOR(RANDOM() * 20)
  ELSE 50
END;

-- Create sample task dependencies
INSERT INTO task_dependencies (task_id, depends_on_task_id, dependency_type)
SELECT 
  t1.id as task_id,
  t2.id as depends_on_task_id,
  'blocks'
FROM tasks t1, tasks t2
WHERE t1.title LIKE '%quote%' 
  AND t2.title LIKE '%Measure%'
  AND t1.id != t2.id
LIMIT 1;

-- Create sample productivity metrics
INSERT INTO user_productivity_metrics (user_id, date, tasks_completed, total_time_spent, productivity_score, efficiency_rating)
VALUES 
('admin', CURRENT_DATE - INTERVAL '1 day', 3, 180, 85.5, 0.89),
('admin', CURRENT_DATE - INTERVAL '2 days', 2, 150, 78.2, 0.82),
('admin', CURRENT_DATE - INTERVAL '3 days', 4, 220, 92.1, 0.95);

-- Grant appropriate permissions (adjust based on your RLS policies)
-- Note: You may need to adjust these based on your authentication setup

COMMENT ON TABLE tasks IS 'Task Master AI - Main tasks table with AI-powered features';
COMMENT ON TABLE ai_insights IS 'Task Master AI - AI-generated insights and recommendations';
COMMENT ON TABLE task_templates IS 'Task Master AI - Reusable task templates for common workflows';
COMMENT ON TABLE user_productivity_metrics IS 'Task Master AI - User productivity tracking and analytics';

-- Verify the setup
DO $$
BEGIN
  RAISE NOTICE 'Task Master AI setup completed successfully!';
  RAISE NOTICE 'Created % tasks', (SELECT COUNT(*) FROM tasks);
  RAISE NOTICE 'Created % AI insights', (SELECT COUNT(*) FROM ai_insights);
  RAISE NOTICE 'Created % task templates', (SELECT COUNT(*) FROM task_templates);
  RAISE NOTICE 'Database schema is ready for Task Master AI system.';
END $$;