import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('grant_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Grant Applications] Query error:', error);
      return NextResponse.json({
        applications: [],
        message: 'Grant applications table may not exist yet',
      });
    }

    return NextResponse.json({ applications: data || [] });
  } catch (error) {
    console.error('[Grant Applications] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { grantTitle, agency, amount, deadline, notes } = body;

    if (!grantTitle) {
      return NextResponse.json({ error: 'Grant title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('grant_applications')
      .insert([{
        user_id: user.id,
        grant_title: grantTitle,
        agency,
        amount,
        deadline,
        notes,
        status: 'draft',
        completion_percent: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('[Grant Applications] Insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create application', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    console.error('[Grant Applications] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
