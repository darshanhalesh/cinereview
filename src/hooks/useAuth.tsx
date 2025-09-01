import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener for JWT token changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log JWT token information for debugging
        if (session?.access_token) {
          console.log('JWT Token received, expires at:', new Date(session.expires_at! * 1000));
        }
      }
    );

    // Check for existing session and JWT token
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.access_token) {
        console.log('Existing JWT token found, expires at:', new Date(session.expires_at! * 1000));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (!error) {
        console.log('User signed up successfully, JWT token will be generated after email confirmation');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: err as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        console.log('User signed in successfully, JWT token generated');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log('User signed out, JWT token cleared');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      } else if (session) {
        console.log('Session refreshed, new JWT token generated');
        setSession(session);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const getAccessToken = (): string | null => {
    return session?.access_token || null;
  };

  // Check if user is authenticated based on JWT token
  const isAuthenticated = !!session?.access_token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAuthenticated,
      signUp,
      signIn,
      signOut,
      refreshSession,
      getAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};