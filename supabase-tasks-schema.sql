-- Task Master AI Database Schema
-- This schema creates tables for an intelligent task management system

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    ai_priority_score INTEGER DEFAULT 50 CHECK (ai_priority_score >= 0 AND ai_priority_score <= 100),
    category VARCHAR(100),
    tags TEXT[], -- Array of tags for better organization
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER, -- Duration in minutes
    actual_duration INTEGER, -- Actual time spent in minutes
    assigned_to VARCHAR(255),
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- AI-related fields
    ai_suggestions JSONB, -- AI-generated suggestions and insights
    ai_complexity_score INTEGER DEFAULT 3 CHECK (ai_complexity_score >= 1 AND ai_complexity_score <= 5),
    ai_dependencies TEXT[], -- AI-identified task dependencies
    ai_recommended_time VARCHAR(50), -- AI-suggested best time to work on this task
    
    -- Metadata
    metadata JSONB DEFAULT '{}' -- Additional flexible data storage
);

-- Create task dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'related', 'subtask')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(task_id, depends_on_task_id)
);

-- Create task time tracking table
CREATE TABLE IF NOT EXISTS task_time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- Duration in minutes
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI insights table for storing AI analysis and recommendations
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    insight_type VARCHAR(100) NOT NULL, -- 'priority_suggestion', 'time_estimate', 'workflow_optimization', etc.
    insight_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_applied BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP WITH TIME ZONE
);

-- Create task templates table for AI to learn from patterns
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    default_priority VARCHAR(20) DEFAULT 'medium',
    estimated_duration INTEGER,
    template_data JSONB, -- Template structure and default values
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user productivity metrics table
CREATE TABLE IF NOT EXISTS user_productivity_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    productivity_score DECIMAL(5,2) DEFAULT 0.00,
    peak_hours JSONB, -- AI-identified peak productivity hours
    efficiency_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_ai_priority_score ON tasks(ai_priority_score);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_task_time_logs_task_id ON task_time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_task_id ON ai_insights(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_user_productivity_user_date ON user_productivity_metrics(user_id, date);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_templates_updated_at 
    BEFORE UPDATE ON task_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_productivity_metrics ENABLE ROW LEVEL SECURITY;

-- Sample data for testing (optional)
INSERT INTO task_templates (name, description, category, default_priority, estimated_duration, template_data) VALUES
('Client Meeting', 'Standard client consultation meeting', 'meetings', 'high', 60, '{"checklist": ["Prepare agenda", "Review client history", "Prepare samples"]}'),
('Site Measurement', 'Measure client property for film installation', 'fieldwork', 'high', 120, '{"tools_needed": ["Measuring tape", "Camera", "Forms"], "checklist": ["Measure all windows", "Document conditions", "Take photos"]}'),
('Quote Preparation', 'Prepare detailed quote for client', 'sales', 'high', 45, '{"sections": ["Materials", "Labor", "Timeline", "Terms"]}'),
('Installation Planning', 'Plan film installation logistics', 'operations', 'medium', 30, '{"considerations": ["Weather", "Access", "Materials", "Team size"]}');

-- Insert sample AI insights for demonstration
INSERT INTO ai_insights (insight_type, insight_data, confidence_score) VALUES
('workflow_optimization', '{"suggestion": "Batch similar tasks together", "potential_time_savings": "15%", "recommended_order": ["measurements", "quotes", "follow-ups"]}', 0.85),
('productivity_pattern', '{"peak_hours": ["9:00-11:00", "14:00-16:00"], "low_energy_tasks": ["administrative", "planning"], "high_energy_tasks": ["client_meetings", "installations"]}', 0.92);