#!/usr/bin/env node

/**
 * Task Master AI Database Setup Script
 * This script will execute the complete database schema in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ 설정됨' : '❌ 누락');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ 설정됨' : '❌ 누락');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Task Master AI 데이터베이스 설정 시작...');

    // Read the complete setup SQL file
    const sqlContent = fs.readFileSync('./task-master-complete-setup.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    console.log(`📝 ${statements.length}개의 SQL 문을 실행합니다...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements and comments
      if (!statement || statement.startsWith('--') || statement.trim() === '') {
        continue;
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        
        if (error) {
          // Try direct query execution instead
          const { error: directError } = await supabase
            .from('_dummy_') // This will fail but we can catch specific errors
            .select('*');
          
          // Execute using raw SQL if available
          const { error: rawError } = await supabase.auth.admin.database.query(statement + ';');
          
          if (rawError) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, rawError.message);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
        errorCount++;
      }
    }

    console.log('\n📊 실행 결과:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`⚠️  경고/오류: ${errorCount}개`);

    // Test the setup by trying to read from tasks table
    console.log('\n🔍 데이터베이스 연결 테스트...');
    const { data: tasks, error: testError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ 데이터베이스 테스트 실패:', testError.message);
      console.log('\n📝 수동 설정이 필요합니다:');
      console.log('1. Supabase 대시보드로 이동: https://supabase.com/dashboard');
      console.log('2. SQL Editor 탭 클릭');
      console.log('3. task-master-complete-setup.sql 파일 내용을 복사하여 실행');
    } else {
      console.log('✅ 데이터베이스 연결 성공!');
      
      // Get task count
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' });
      
      console.log(`📋 현재 등록된 작업: ${count}개`);
    }

    console.log('\n🎉 Task Master AI 데이터베이스 설정 완료!');
    console.log('🌐 웹사이트 접속: http://localhost:3000/admin/task-master');

  } catch (error) {
    console.error('❌ 설정 중 오류 발생:', error.message);
    console.log('\n📝 수동 설정 안내:');
    console.log('1. Supabase 대시보드 접속: https://supabase.com/dashboard');
    console.log('2. 프로젝트 선택 후 SQL Editor 이동');
    console.log('3. task-master-complete-setup.sql 파일 내용 복사하여 실행');
    console.log('4. 서버 재시작: npm run dev');
  }
}

// Run the setup
setupDatabase();