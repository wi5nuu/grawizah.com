import { useState, useEffect } from 'react';
import { UserRole } from '@/types';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session from localStorage
    const storedUser = localStorage.getItem('grawizah_user');
    const token = localStorage.getItem('grawizah_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Sign in failed');
      }

      const data = await response.json();
      
      // Save session
      localStorage.setItem('grawizah_token', data.token);
      localStorage.setItem('grawizah_user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole = UserRole.FREE_TRADER) => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Sign up failed');
      }

      const data = await response.json();
      
      // Save session
      localStorage.setItem('grawizah_token', data.token);
      localStorage.setItem('grawizah_user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      localStorage.removeItem('grawizah_token');
      localStorage.removeItem('grawizah_user');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  };

  const upgradeTier = async (newRole: string) => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/auth/upgrade-tier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Upgrade failed');
      }

      // Update local state
      const updatedUser = { ...user, role: newRole as UserRole };
      localStorage.setItem('grawizah_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      [UserRole.GUEST]: 0,
      [UserRole.FREE_TRADER]: 1,
      [UserRole.PREMIUM_TRADER]: 2,
      [UserRole.BUYER]: 2,
      [UserRole.ADMIN]: 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    upgradeTier,
    hasRole,
    isAuthenticated: !!user,
    isPremium: user?.role === UserRole.PREMIUM_TRADER || user?.role === 'premium_trader' as any,
    isBuyer: user?.role === UserRole.BUYER || user?.role === 'buyer' as any,
    isAdmin: user?.role === UserRole.ADMIN || user?.role === 'admin' as any
  };
};
