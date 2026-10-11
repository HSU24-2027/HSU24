import { getSupabase } from '../lib/supabase';
import type { DataSource } from './DataSource';
import { MockDataSource } from './mock/MockDataSource';
import { SupabaseDataSource } from './supabase/SupabaseDataSource';

let instance: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!instance) {
    const supabase = getSupabase();
    instance = supabase ? new SupabaseDataSource(supabase) : new MockDataSource();
  }
  return instance;
}

/** Nur für Tests. */
export function setDataSource(ds: DataSource | null) {
  instance = ds;
}

export type { DataSource };
