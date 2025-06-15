import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create client with fallback for demo mode
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Check if we're in demo mode
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || 
                         import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co';

export type Database = {
  public: {
    Tables: {
      soil_analyses: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          phosphorus: number;
          potassium: number;
          nitrogen: number;
          organic_carbon: number;
          cation_exchange: number;
          sand_percent: number;
          clay_percent: number;
          silt_percent: number;
          rainfall: number;
          elevation: number;
          crop_type: string;
          recommended_fertilizer: string;
          application_rate: number;
          confidence_score: number;
          expected_yield_increase: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          phosphorus: number;
          potassium: number;
          nitrogen: number;
          organic_carbon: number;
          cation_exchange: number;
          sand_percent: number;
          clay_percent: number;
          silt_percent: number;
          rainfall: number;
          elevation: number;
          crop_type: string;
          recommended_fertilizer: string;
          application_rate: number;
          confidence_score: number;
          expected_yield_increase: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          phosphorus?: number;
          potassium?: number;
          nitrogen?: number;
          organic_carbon?: number;
          cation_exchange?: number;
          sand_percent?: number;
          clay_percent?: number;
          silt_percent?: number;
          rainfall?: number;
          elevation?: number;
          crop_type?: string;
          recommended_fertilizer?: string;
          application_rate?: number;
          confidence_score?: number;
          expected_yield_increase?: number;
        };
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan_type: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan_type?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan_type?: string;
        };
      };
    };
  };
};