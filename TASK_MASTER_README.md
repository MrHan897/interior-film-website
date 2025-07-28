# Task Master AI - Intelligent Task Management System

An advanced AI-powered task management system built for interior film businesses with smart prioritization, automated insights, and productivity analytics.

## Features

### 🤖 AI-Powered Intelligence
- **Smart Priority Scoring**: AI calculates priority scores (0-100) based on due dates, complexity, and business context
- **Automated Suggestions**: AI provides time recommendations, preparation checklists, and efficiency tips
- **Predictive Analytics**: Insights on task completion patterns and productivity optimization
- **Workflow Optimization**: AI identifies bottlenecks and suggests improvements

### 📊 Advanced Analytics
- **Productivity Metrics**: Completion rates, time accuracy, and performance scoring
- **Category Analysis**: Performance tracking across different task types
- **Peak Hours Detection**: AI identifies your most productive time periods
- **Trend Analysis**: Historical data and pattern recognition

### 🎯 Business-Focused Categories
- **Client Meetings**: High-priority customer interactions
- **Installations**: On-site film installation projects
- **Measurements**: Property measurement and assessment tasks
- **Quotes**: Pricing and proposal preparation
- **Follow-ups**: Client communication and relationship management
- **Administrative**: Business operations and documentation

### 🛠 Smart Features
- **Dependency Tracking**: Link related tasks and manage prerequisites
- **Time Logging**: Track actual vs estimated time for better planning
- **Template System**: Reusable task templates for common workflows
- **Status Management**: Comprehensive task lifecycle tracking

## Installation

### 1. Database Setup

Run the database schema setup:

```sql
-- In your Supabase SQL editor, run:
\i supabase-tasks-schema.sql

-- Or run the complete setup with sample data:
\i setup-task-master.sql
```

### 2. Environment Variables

Ensure your `.env.local` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Access the System

Navigate to `/admin/task-master` in your application to access the Task Master AI dashboard.

## API Endpoints

### Tasks Management
- `GET /api/tasks` - List tasks with filtering and AI sorting
- `POST /api/tasks` - Create new task with AI analysis
- `GET /api/tasks/[id]` - Get task details with dependencies and insights
- `PATCH /api/tasks/[id]` - Update task with AI recalculation
- `DELETE /api/tasks/[id]` - Delete task

### AI Insights
- `GET /api/tasks/ai-insights?type=productivity` - Productivity analytics
- `GET /api/tasks/ai-insights?type=optimization` - Optimization suggestions
- `GET /api/tasks/ai-insights?type=predictions` - Task predictions
- `GET /api/tasks/ai-insights?type=recommendations` - AI recommendations

## Usage Guide

### Creating Tasks

1. **Basic Information**: Title, description, and category
2. **Priority & Timing**: Manual priority + AI calculates smart priority score
3. **AI Enhancement**: System automatically suggests optimal timing and preparation items

### AI Priority Algorithm

The AI priority score (0-100) considers:
- **Due Date Urgency** (0-30 points): Overdue tasks get maximum points
- **Manual Priority** (0-25 points): User-set importance level
- **Complexity Factor** (0-15 points): Based on task complexity score
- **Category Bonus** (0-15 points): Business-critical categories get priority

### AI Suggestions

For each task, AI provides:
- **Recommended Time**: Best time of day based on task type
- **Preparation Items**: Category-specific preparation checklists
- **Follow-up Tasks**: Suggested next steps after completion
- **Efficiency Tips**: Optimization recommendations

### Analytics Dashboard

Access comprehensive insights:
- **Productivity View**: Completion rates, time accuracy, performance metrics
- **Optimization View**: Bottleneck identification and improvement suggestions
- **Predictions View**: Workload forecasting and risk assessment
- **Recommendations View**: Personalized AI recommendations

## Database Schema

### Core Tables

- **`tasks`**: Main task storage with AI fields
- **`task_dependencies`**: Task relationships and prerequisites
- **`task_time_logs`**: Time tracking for productivity analysis
- **`ai_insights`**: AI-generated insights and recommendations
- **`task_templates`**: Reusable task templates
- **`user_productivity_metrics`**: Daily productivity tracking

### Key AI Fields

- `ai_priority_score`: Calculated priority (0-100)
- `ai_complexity_score`: Task complexity rating (1-5)
- `ai_suggestions`: JSON object with AI recommendations
- `ai_dependencies`: AI-identified task relationships

## Customization

### Adding New Categories

1. Update the categories array in `TaskMaster.tsx`
2. Add category-specific logic in the AI priority calculation
3. Update preparation items and efficiency tips in the API

### Modifying AI Algorithms

The AI algorithms are in:
- `/api/tasks/route.ts` - Priority calculation and suggestions
- `/api/tasks/ai-insights/route.ts` - Analytics and insights generation

### Business Logic Customization

Adjust priority bonuses and recommendations in the `calculateAIPriority` function:

```typescript
const categoryBonus: { [key: string]: number } = {
  'client_meetings': 15,
  'installations': 12,
  'measurements': 10,
  'quotes': 8,
  'follow_ups': 5,
  'administrative': 2
};
```

## Performance Features

- **Optimistic Updates**: Instant UI feedback
- **Intelligent Caching**: AI insights cached for performance
- **Batch Operations**: Efficient database operations
- **Real-time Scoring**: Live priority recalculation

## Security

- Row Level Security (RLS) enabled on all tables
- API rate limiting implemented
- Input validation and sanitization
- Secure file upload for attachments

## Troubleshooting

### Common Issues

1. **AI Insights Not Loading**
   - Verify Supabase connection
   - Check if tasks exist in database
   - Ensure proper permissions on tables

2. **Priority Scores Not Updating**
   - Verify `calculateAIPriority` function
   - Check task update API endpoint
   - Ensure AI fields are included in database schema

3. **Performance Issues**
   - Enable database indexes (included in schema)
   - Check query performance in Supabase
   - Consider pagination for large task lists

### Database Maintenance

```sql
-- Cleanup old AI insights (run monthly)
DELETE FROM ai_insights 
WHERE created_at < NOW() - INTERVAL '90 days' 
AND insight_type NOT IN ('productivity_pattern', 'workflow_optimization');

-- Update productivity metrics
REFRESH MATERIALIZED VIEW IF EXISTS user_productivity_summary;
```

## Contributing

When extending the system:

1. Follow the existing AI pattern architecture
2. Add comprehensive logging for AI decisions
3. Include confidence scores for AI recommendations
4. Test with various business scenarios
5. Update documentation for new features

## Support

For technical support or feature requests, refer to the main project documentation or contact the development team.

---

**Task Master AI** - Transforming task management with artificial intelligence for interior film businesses.