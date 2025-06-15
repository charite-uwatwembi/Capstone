import { supabase, isDemoMode } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  planType: string;
}

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    if (isDemoMode) {
      throw new Error('Authentication is not available in demo mode. Please configure Supabase to enable user accounts.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Create user profile
    if (data.user) {
      await this.createUserProfile(data.user.id, email, fullName);
    }

    return data;
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (isDemoMode) {
      throw new Error('Authentication is not available in demo mode. Please configure Supabase to enable user accounts.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sign out
  async signOut() {
    if (isDemoMode) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    if (isDemoMode) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      fullName: profile?.full_name || undefined,
      avatarUrl: profile?.avatar_url || undefined,
      planType: profile?.plan_type || 'free'
    };
  }

  // Create user profile
  private async createUserProfile(userId: string, email: string, fullName?: string) {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        plan_type: 'free'
      });

    if (error) {
      console.error('Error creating user profile:', error);
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<AuthUser, 'fullName' | 'avatarUrl'>>) {
    if (isDemoMode) {
      throw new Error('Profile updates are not available in demo mode.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { error } = await supabase
      .from('users')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (isDemoMode) {
      // Return a dummy subscription for demo mode
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = await this.getCurrentUser();
        callback(authUser);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();