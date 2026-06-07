import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DEMO_USERS, storage } from '../data/mockData';

const AuthContext = createContext(null);

export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'profile', 'attendance', 'leave', 'payroll', 'tasks', 'timesheet', 'documents', 'communication', 'performance', 'recruitment', 'training', 'helpdesk', 'assets', 'expenses', 'calendar', 'notifications', 'analytics', 'admin'],
  hr: ['dashboard', 'profile', 'attendance', 'leave', 'payroll', 'tasks', 'timesheet', 'documents', 'communication', 'performance', 'recruitment', 'training', 'helpdesk', 'assets', 'expenses', 'calendar', 'notifications', 'analytics'],
  manager: ['dashboard', 'profile', 'attendance', 'leave', 'payroll', 'tasks', 'timesheet', 'documents', 'communication', 'performance', 'training', 'helpdesk', 'assets', 'expenses', 'calendar', 'notifications', 'analytics'],
  employee: ['dashboard', 'profile', 'attendance', 'leave', 'payroll', 'tasks', 'timesheet', 'documents', 'communication', 'performance', 'training', 'helpdesk', 'assets', 'expenses', 'calendar', 'notifications'],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get('user'));
  const [supabaseSession, setSupabaseSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Supabase auth changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSupabaseSession(session);
        loadProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
      if (session) {
        loadProfile(session.user);
      } else {
        setUser(null);
        storage.remove('user');
        setIsLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // On mount with no Supabase, restore from localStorage
  useEffect(() => {
    if (!isSupabaseConfigured && user) {
      setIsLoading(false);
    }
  }, []);

  // Load user profile from Supabase profiles table
  async function loadProfile(authUser) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      const appUser = {
        id: authUser.id,
        email: authUser.email,
        firstName: profile.first_name || authUser.email.split('@')[0],
        lastName: profile.last_name || '',
        name: profile.full_name || authUser.email.split('@')[0],
        role: profile.role || 'employee',
        department: profile.department || 'Engineering',
        designation: profile.designation || 'Employee',
        employeeId: profile.employee_id || 'TIA-000',
        phone: profile.phone || '',
        joinDate: profile.join_date || '',
        avatar: profile.avatar_url || null,
      };

      setUser(appUser);
      storage.set('user', appUser);
    } catch (err) {
      console.warn('Failed to load profile, using basic info:', err.message);
      // Fallback: use basic auth info
      const appUser = {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.email.split('@')[0],
        lastName: '',
        name: authUser.email.split('@')[0],
        role: authUser.user_metadata?.role || 'employee',
        department: 'General',
        designation: 'Employee',
        employeeId: 'TIA-000',
      };
      setUser(appUser);
      storage.set('user', appUser);
    }
    setIsLoading(false);
  }

  const login = useCallback(async (email, password) => {
    setIsLoading(true);

    // Try Supabase Auth first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.session) {
          // Profile loading is handled by onAuthStateChange listener
          return { success: true };
        }
        // If Supabase auth fails, fall through to demo login
        console.log('Supabase auth failed, trying demo login:', error?.message);
      } catch (err) {
        console.warn('Supabase auth error:', err.message);
      }
    }

    // Fallback: Demo user login (mock)
    await new Promise(resolve => setTimeout(resolve, 600));
    const foundUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      storage.set('user', userWithoutPassword);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const signup = useCallback(async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: metadata.firstName,
            last_name: metadata.lastName,
            role: metadata.role || 'employee',
          },
        },
      });

      setIsLoading(false);
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabaseSession) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSupabaseSession(null);
    storage.remove('user');
    storage.remove('lastLogin');
  }, [supabaseSession]);

  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Demo mode: password reset simulated' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const hasPermission = useCallback((module) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(module) ?? false;
  }, [user]);

  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      isSupabaseAuth: !!supabaseSession,
      login,
      signup,
      logout,
      resetPassword,
      hasPermission,
      isAdmin,
      isHR,
      isManager,
      isEmployee,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
