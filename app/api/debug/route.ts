import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const results: { [key: string]: any } = {
    timestamp: new Date().toISOString(),
    env_check: {
      SERVICE_ROLE_KEY_PRESENT: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      SUPABASE_URL_PRESENT: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
  };

  try {
    // Test 1: Get current_user
    console.log('🔍 Testing current_user...');
    const currentUserResult = await supabaseAdmin
      .rpc('get_current_user_info');
    
    if (currentUserResult.error) {
      results.current_user_rpc = { error: currentUserResult.error.message };
      console.log('❌ RPC failed, trying direct query...');
      
      // Fallback: simple SELECT to see what user we are
      const queryResult = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1);
      
      if (queryResult.error) {
        results.simple_select = { error: queryResult.error.message };
      } else {
        results.simple_select = { success: true, data: queryResult.data };
      }
    } else {
      results.current_user_rpc = { success: true, data: currentUserResult.data };
    }
  } catch (err: any) {
    results.current_user_error = { message: err.message, stack: err.stack };
  }

  try {
    // Test 2: Try INSERT on users (will fail if permissions denied)
    console.log('🔍 Testing INSERT on users...');
    const testInsert = await supabaseAdmin
      .from('users')
      .insert({
        id: `debug-test-${Date.now()}`,
        password: 'test',
        join_date: new Date().toISOString(),
        first_name: 'Debug',
      });

    if (testInsert.error) {
      results.insert_test = {
        error: testInsert.error.message,
        code: testInsert.error.code,
        details: testInsert.error.details,
        hint: testInsert.error.hint,
      };
      console.log('❌ INSERT failed:', testInsert.error.message);
    } else {
      results.insert_test = { success: true, data: testInsert.data };
      console.log('✅ INSERT succeeded');

      // Clean up test data
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', `debug-test-${Date.now()}`);
    }
  } catch (err: any) {
    results.insert_error = { message: err.message, stack: err.stack };
  }

  try {
    // Test 3: Try SELECT from users
    console.log('🔍 Testing SELECT from users...');
    const selectTest = await supabaseAdmin
      .from('users')
      .select('id, first_name')
      .limit(1);

    if (selectTest.error) {
      results.select_test = {
        error: selectTest.error.message,
        code: selectTest.error.code,
      };
      console.log('❌ SELECT failed:', selectTest.error.message);
    } else {
      results.select_test = { success: true, count: selectTest.data?.length };
      console.log('✅ SELECT succeeded');
    }
  } catch (err: any) {
    results.select_error = { message: err.message };
  }

  try {
    // Test 4: Check table schema
    console.log('🔍 Checking users table info...');
    const schemaCheck = await supabaseAdmin.rpc('information_schema.tables', {
      table_schema: 'public',
      table_name: 'users'
    }).catch(() => null);

    results.schema_info = schemaCheck || { note: 'Could not retrieve schema info via RPC' };
  } catch (err: any) {
    results.schema_error = { message: err.message };
  }

  console.log('📋 Debug results:', JSON.stringify(results, null, 2));
  return NextResponse.json(results, { status: 200 });
}
