-- Task Master AI Complete Database Setup Script
-- Copy and paste this entire script into Supabase SQL Editor and run

-- ===== TASK MANAGEMENT SCHEMA =====

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

-- ===== CREATE INDEXES =====

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

-- ===== CREATE TRIGGERS =====

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

-- ===== ENABLE RLS =====

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_productivity_metrics ENABLE ROW LEVEL SECURITY;

-- ===== CREATE RLS POLICIES =====

-- Allow all operations for authenticated users (you can customize this)
CREATE POLICY "Allow all for authenticated users" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON task_dependencies FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON task_time_logs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON ai_insights FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON task_templates FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON user_productivity_metrics FOR ALL USING (true);

-- ===== INSERT SAMPLE DATA =====

-- Sample task templates
INSERT INTO task_templates (name, description, category, default_priority, estimated_duration, template_data) VALUES
('고객 미팅', '표준 고객 상담 미팅', 'client_meetings', 'high', 60, '{"checklist": ["일정 준비", "고객 히스토리 검토", "샘플 준비"]}'),
('현장 측정', '고객 부동산 필름 설치 측정', 'measurements', 'high', 120, '{"필요도구": ["줄자", "카메라", "측정 폼"], "체크리스트": ["모든 창문 측정", "상태 기록", "사진 촬영"]}'),
('견적 준비', '고객 상세 견적서 작성', 'quotes', 'high', 45, '{"섹션": ["재료비", "인건비", "일정", "조건"]}'),
('설치 계획', '필름 설치 물류 계획', 'installations', 'medium', 30, '{"고려사항": ["날씨", "접근성", "재료", "팀 규모"]}');

-- Sample tasks with Korean content for interior film business
INSERT INTO tasks (title, description, priority, category, due_date, estimated_duration, assigned_to, created_by, ai_suggestions, ai_complexity_score) VALUES
(
  '아파트 거실 리노베이션 고객 상담 일정',
  '김씨 가족과 거실 필름 설치 프로젝트 논의. 공간 요구사항 및 디자인 선호도 검토.',
  'high',
  'client_meetings',
  (NOW() + INTERVAL '2 days')::timestamptz,
  90,
  'admin',
  'system',
  '{"recommended_time": "morning", "preparation_items": ["고객 히스토리 검토", "샘플 준비", "이동시간 확인"], "efficiency_tips": ["같은 지역 미팅 배치", "표준 프레젠테이션 준비"]}',
  3
),
(
  '서울 시내 사무실 창문 측정',
  '새로운 스타트업 사무공간의 모든 창문에 대한 프라이버시 필름 설치 측정. 측정 장비와 카메라 지참.',
  'high',
  'measurements',
  (NOW() + INTERVAL '1 day')::timestamptz,
  120,
  'admin',
  'system',
  '{"recommended_time": "afternoon", "preparation_items": ["디바이스 충전", "측정 도구 준비", "현장 접근 확인"], "efficiency_tips": ["근처 부동산 그룹화", "정확성을 위한 디지털 도구 사용"]}',
  2
),
(
  '강남 카페 인테리어 프로젝트 견적 준비',
  '강남 신규 카페의 우드 패턴 필름 설치 비용 계산. 재료비, 인건비, 일정 포함.',
  'medium',
  'quotes',
  (NOW() + INTERVAL '3 days')::timestamptz,
  60,
  'admin',
  'system',
  '{"recommended_time": "morning", "preparation_items": ["현재 가격 수집", "측정 데이터 검토", "재료 재고 확인"], "efficiency_tips": ["템플릿 사용", "계산 재확인"]}',
  3
),
(
  '주거용 부동산 장식 필름 설치',
  '주방 구역의 마블 패턴 필름 설치 완료. 적절한 준비와 깨끗한 마감 보장.',
  'high',
  'installations',
  (NOW() + INTERVAL '5 days')::timestamptz,
  240,
  'admin',
  'system',
  '{"recommended_time": "morning", "preparation_items": ["날씨 예보 확인", "도구 준비", "팀 가용성 확인"], "efficiency_tips": ["비슷한 작업 배치", "품질 체크 일정"]}',
  4
),
(
  '호텔 체인 조달 후속 관리',
  '20개 객실의 프라이버시 필름 프로젝트에 대한 호텔 체인의 결정 연락. 필요한 추가 정보 제공.',
  'medium',
  'follow_ups',
  (NOW() + INTERVAL '7 days')::timestamptz,
  30,
  'admin',
  'system',
  '{"recommended_time": "afternoon", "preparation_items": ["이전 제안서 검토", "연락처 확인", "추가 자료 준비"], "efficiency_tips": ["후속 관리 배치", "통화 시간 최적화"]}',
  2
),
(
  '최근 프로젝트로 포트폴리오 웹사이트 업데이트',
  '지난달 완료된 3개 프로젝트의 사진과 설명을 회사 포트폴리오 섹션에 추가.',
  'low',
  'administrative',
  (NOW() + INTERVAL '10 days')::timestamptz,
  45,
  'admin',
  'system',
  '{"recommended_time": "afternoon", "preparation_items": ["사진 정리", "설명 작성", "웹사이트 접근"], "efficiency_tips": ["콘텐츠 배치", "일정한 업데이트"]}',
  1
),
(
  '향후 프로젝트용 재료 주문',
  '다음 달 확정된 프로젝트를 기반으로 우드 그레인 필름, 프라이버시 필름 및 설치 도구 주문.',
  'medium',
  'administrative',
  (NOW() + INTERVAL '4 days')::timestamptz,
  30,
  'admin',
  'system',
  '{"recommended_time": "morning", "preparation_items": ["프로젝트 일정 검토", "재고 확인", "공급업체 연락"], "efficiency_tips": ["대량 주문", "배송 일정 조정"]}',
  2
),
(
  '기업 본사 현장 검사',
  '기업 본사에서 대규모 필름 설치 요구사항 평가를 위한 상세 현장 검사 실시.',
  'high',
  'measurements',
  (NOW() + INTERVAL '6 days')::timestamptz,
  180,
  'admin',
  'system',
  '{"recommended_time": "morning", "preparation_items": ["검사 체크리스트", "측정 도구", "카메라", "안전 장비"], "efficiency_tips": ["체계적 접근", "상세 기록"]}',
  4
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

-- Sample AI insights
INSERT INTO ai_insights (task_id, insight_type, insight_data, confidence_score) 
SELECT 
  t.id,
  'optimization_suggestion',
  '{"recommendation": "같은 지역의 고객 미팅 배치 고려", "time_savings": "20%", "efficiency_gain": "medium"}',
  0.87
FROM tasks t 
WHERE t.category = 'client_meetings' 
LIMIT 1;

INSERT INTO ai_insights (insight_type, insight_data, confidence_score) VALUES
(
  'workflow_optimization',
  '{"pattern": "measurement_then_quote", "success_rate": "94%", "recommendation": "견적 준비 전에 항상 측정 일정 잡기", "impact": "high"}',
  0.94
),
(
  'productivity_insight',
  '{"peak_hours": ["09:00-11:00", "14:00-16:00"], "best_day": "Tuesday", "efficiency_tips": ["비슷한 작업 배치", "피크 시간에 중요한 작업 스케줄"]}',
  0.91
);

-- Create sample task dependencies
INSERT INTO task_dependencies (task_id, depends_on_task_id, dependency_type)
SELECT 
  t1.id as task_id,
  t2.id as depends_on_task_id,
  'blocks'
FROM tasks t1, tasks t2
WHERE t1.title LIKE '%견적%' 
  AND t2.title LIKE '%측정%'
  AND t1.id != t2.id
LIMIT 1;

-- Sample productivity metrics
INSERT INTO user_productivity_metrics (user_id, date, tasks_completed, total_time_spent, productivity_score, efficiency_rating)
VALUES 
('admin', CURRENT_DATE - INTERVAL '1 day', 3, 180, 85.5, 0.89),
('admin', CURRENT_DATE - INTERVAL '2 days', 2, 150, 78.2, 0.82),
('admin', CURRENT_DATE - INTERVAL '3 days', 4, 220, 92.1, 0.95);

-- ===== VERIFICATION =====

-- Verify the setup
DO $$
BEGIN
  RAISE NOTICE 'Task Master AI 설정이 성공적으로 완료되었습니다!';
  RAISE NOTICE '생성된 작업: %개', (SELECT COUNT(*) FROM tasks);
  RAISE NOTICE '생성된 AI 인사이트: %개', (SELECT COUNT(*) FROM ai_insights);
  RAISE NOTICE '생성된 작업 템플릿: %개', (SELECT COUNT(*) FROM task_templates);
  RAISE NOTICE 'Task Master AI 시스템 데이터베이스가 준비되었습니다.';
END $$;