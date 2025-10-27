import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface AuthState {
  token: string | null;
  expiresAt: number | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string, expiresIn: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const persistedToken = localStorage.getItem('ship-tracker-token');
    const persistedExpiry = localStorage.getItem('ship-tracker-expiry');
    if (persistedToken && persistedExpiry) {
      const expiresAt = Number(persistedExpiry);
      if (Number.isFinite(expiresAt) && expiresAt > Date.now()) {
        return { token: persistedToken, expiresAt };
      }
    }
    return { token: null, expiresAt: null };
  });

  const login = useCallback((token: string, expiresIn: number) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem('ship-tracker-token', token);
    localStorage.setItem('ship-tracker-expiry', String(expiresAt));
    setState({ token, expiresAt });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ship-tracker-token');
    localStorage.removeItem('ship-tracker-expiry');
    setState({ token: null, expiresAt: null });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = Boolean(state.token && state.expiresAt && state.expiresAt > Date.now());
    return { ...state, login, logout, isAuthenticated };
  }, [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
