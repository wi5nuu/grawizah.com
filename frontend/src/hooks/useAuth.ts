import { useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

interface User {
  id: string;
  email: string;
  role: UserRole;
  company_name?: string;
  avatar_url?: string;
}

// ── [H-04] Token validation ──────────────────────────────────────────────────
/**
 * Decodes the JWT payload and checks if the `exp` claim is in the future.
 * Returns false for any malformed token — never throws.
 */
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    // JWT payload is Base64URL-encoded — pad and replace chars for atob()
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    if (typeof decoded.exp !== 'number') return false;
    // exp is in seconds; add 10s buffer to avoid micro-expiry race conditions
    return decoded.exp * 1000 > Date.now() + 10_000;
  } catch {
    return false;
  }
}

/**
 * Returns token expiry time in milliseconds, or 0 if invalid.
 */
function getTokenExpiry(token: string): number {
  try {
    const parts = token.split('.');
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : 0;
  } catch {
    return 0;
  }
}
// ── End H-04 token helpers ───────────────────────────────────────────────────

const clearSession = () => {
  localStorage.removeItem('grawizah_token');
  localStorage.removeItem('grawizah_user');
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── [H-04] Validated session initialization ──────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('grawizah_user');
    const token = localStorage.getItem('grawizah_token');

    if (storedUser && token) {
      if (isTokenValid(token)) {
        setUser(JSON.parse(storedUser));
      } else {
        // Token expired — clear session silently, user will be redirected by
        // the 401 interceptor in BaseService on next API call, or by route guards.
        clearSession();
      }
    }

    setLoading(false);
  }, []);

  // ── [H-04] Proactive silent refresh ─────────────────────────────────────
  // If token will expire within 5 minutes, attempt a Supabase session refresh.
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('grawizah_token');
    if (!token) return;

    const expiry = getTokenExpiry(token);
    if (expiry === 0) return;

    const msUntilExpiry = expiry - Date.now();
    const refreshAt = msUntilExpiry - 5 * 60 * 1000; // 5 minutes before expiry

    if (refreshAt <= 0) return; // Already within 5-min window — too late, let 401 handle it

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refresh_token: localStorage.getItem('grawizah_refresh_token'),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('grawizah_token', data.token);
          }
        }
      } catch {
        // Silent failure — 401 interceptor in BaseService will handle the redirect
      }
    }, refreshAt);

    return () => clearTimeout(timer);
  }, [user]);
  // ── End H-04 ─────────────────────────────────────────────────────────────

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Sign in failed');
      }

      const data = await response.json();

      // Normalize user: Supabase nests role in user_metadata
      const rawUser = data.user || {};
      const normalizedUser: User = {
        id: rawUser.id || '',
        email: rawUser.email || email,
        role: (rawUser.user_metadata?.role || rawUser.role || UserRole.FREE_TRADER) as UserRole,
        company_name: rawUser.user_metadata?.company_name || rawUser.company_name || '',
      };

      // Save session
      localStorage.setItem('grawizah_token', data.token);
      if (data.refresh_token) {
        localStorage.setItem('grawizah_refresh_token', data.refresh_token);
      }
      localStorage.setItem('grawizah_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, role?: UserRole, companyName?: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: role || UserRole.FREE_TRADER, company_name: companyName }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Sign up failed');
      }

      const data = await response.json();

      // [H-04, M-04] Normalize register response same way as signIn
      const rawUser = data.user || {};
      const normalizedUser: User = {
        id: rawUser.id || '',
        email: rawUser.email || email,
        role: (rawUser.user_metadata?.role || rawUser.role || UserRole.FREE_TRADER) as UserRole,
        company_name: rawUser.user_metadata?.company_name || rawUser.company_name || '',
      };

      localStorage.setItem('grawizah_token', data.token);
      if (data.refresh_token) {
        localStorage.setItem('grawizah_refresh_token', data.refresh_token);
      }
      localStorage.setItem('grawizah_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      clearSession();
      localStorage.removeItem('grawizah_refresh_token');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  };

  const upgradeTier = async (newRole: string) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('grawizah_token');
      const response = await fetch(`${API_BASE_URL}/api/auth/upgrade-tier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: user.id, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Upgrade failed');
      }

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
      [UserRole.ADMIN]: 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('grawizah_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    upgradeTier,
    updateUser,
    hasRole,
    isAuthenticated: !!user,
    isPremium: user?.role === UserRole.PREMIUM_TRADER,
    isBuyer: user?.role === UserRole.BUYER,
    isAdmin: user?.role === UserRole.ADMIN,
  };
};
