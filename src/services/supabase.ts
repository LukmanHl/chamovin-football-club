import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = customKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return null;
  }

  if (cachedClient && cachedUrl === url && cachedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    cachedUrl = url;
    cachedKey = key;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(
  url: string,
  key: string
): Promise<{ success: boolean; message: string; tablesFound?: string[] }> {
  if (!url || !key) {
    return {
      success: false,
      message: 'Please enter both the Supabase Project URL and Anon/Public API Key.'
    };
  }

  const cleanUrl = url.trim().replace(/\/$/, '');
  const cleanKey = key.trim();

  try {
    const client = createClient(cleanUrl, cleanKey);

    // Test pinging the schema tables
    const checkSettings = await client.from('company_settings').select('count', { count: 'exact', head: true });
    const checkPlayers = await client.from('players').select('count', { count: 'exact', head: true });

    if (checkSettings.error) {
      // Table doesn't exist yet (Postgres code 42P01)
      if (checkSettings.error.code === '42P01') {
        return {
          success: true,
          message:
            'Connected to your Supabase project! However, the database tables have not been created yet. Please copy and run the SQL script in your Supabase SQL Editor.'
        };
      }
      return { success: false, message: `Supabase returned: ${checkSettings.error.message}` };
    }

    const found: string[] = ['company_settings'];
    if (!checkPlayers.error) found.push('players');

    return {
      success: true,
      message: 'Successfully connected and verified database access to your Supabase project!',
      tablesFound: found
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to Supabase'
    };
  }
}
