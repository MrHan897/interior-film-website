#!/usr/bin/env node

/**
 * 배포 전 Supabase 데이터베이스 상태 확인 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://temp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'temp_service_key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  console.log('🔍 Supabase 데이터베이스 상태 확인 중...\n');

  const tables = [
    'tasks',
    'task_dependencies', 
    'task_time_logs',
    'ai_insights',
    'task_templates',
    'user_productivity_metrics'
  ];

  let allTablesExist = true;

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: 테이블이 존재하지 않음`);
        allTablesExist = false;
      } else {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact' });
        console.log(`✅ ${table}: ${count}개 레코드`);
      }
    } catch (err) {
      console.log(`❌ ${table}: 접근 오류 - ${err.message}`);
      allTablesExist = false;
    }
  }

  console.log('\n📊 전체 상태:');
  if (allTablesExist) {
    console.log('✅ 모든 테이블이 정상적으로 설정되었습니다!');
    console.log('🚀 Vercel 배포를 진행할 수 있습니다.');
  } else {
    console.log('⚠️  일부 테이블이 누락되었습니다.');
    console.log('📝 다음 단계를 수행하세요:');
    console.log('1. Supabase 대시보드 접속: https://supabase.com/dashboard');
    console.log('2. SQL Editor에서 task-master-complete-setup.sql 실행');
    console.log('3. 이 스크립트 다시 실행하여 확인');
  }

  // API 테스트
  console.log('\n🧪 API 엔드포인트 테스트...');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks?select=count`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ REST API 연결 정상');
    } else {
      console.log('⚠️  REST API 연결 문제:', response.status);
    }
  } catch (err) {
    console.log('❌ REST API 테스트 실패:', err.message);
  }
}

checkDatabase();