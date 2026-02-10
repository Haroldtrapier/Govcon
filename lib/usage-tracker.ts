// lib/usage-tracker.ts
import { createClient } from './supabase/server';

interface UsageEvent {
  user_id: string;
  event_type: 'search' | 'alert' | 'export' | 'api_call';
  metadata?: Record<string, any>;
}

export async function trackUsage(event: UsageEvent) {
  const supabase = await createClient();
  
  await supabase
    .from('usage_logs')
    .insert({
      ...event,
      timestamp: new Date().toISOString()
    });
}

export async function getCurrentMonthUsage(userId: string) {
  const supabase = await createClient();
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('usage_logs')
    .select('event_type, count')
    .eq('user_id', userId)
    .gte('timestamp', startOfMonth.toISOString())
    .order('timestamp', { ascending: false });
  
  if (error) return null;
  
  return {
    searches: data?.filter(e => e.event_type === 'search').length || 0,
    alerts: data?.filter(e => e.event_type === 'alert').length || 0,
    exports: data?.filter(e => e.event_type === 'export').length || 0,
  };
}

export async function checkUsageLimit(userId: string, eventType: 'search' | 'alert' | 'export'): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('products(tier)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (!subscriptions) return false;
  
  const tier = subscriptions.products?.tier;
  
  const limits = {
    starter: { searches: 10, alerts: 30, exports: 5 },
    professional: { searches: 50, alerts: 90, exports: 20 },
    enterprise: { searches: Infinity, alerts: Infinity, exports: Infinity }
  };
  
  const tierLimits = limits[tier as keyof typeof limits] || limits.starter;
  const usage = await getCurrentMonthUsage(userId);
  
  if (!usage) return false;
  
  const currentUsage = usage[`${eventType}s` as keyof typeof usage] || 0;
  const limit = tierLimits[`${eventType}s` as keyof typeof tierLimits];
  
  return currentUsage < limit;
}
