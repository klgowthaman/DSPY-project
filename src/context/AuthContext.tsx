import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User, Workspace } from '../types';

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, company?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'admin' | 'engineer' | 'viewer') => void;
  backendOnline: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

const DEMO_WORKSPACE: Workspace = {
  id: 'demo-workspace',
  name: 'Backend Engineering',
  description: 'Core backend services and APIs',
  memberCount: 11,
  projectCount: 5,
  createdAt: '2024-01-01',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser({
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar || storedUser.name?.slice(0, 2).toUpperCase() || 'U',
        workspaceId: storedUser.workspace_id,
      });
      setWorkspace(DEMO_WORKSPACE);
    }
    setIsLoading(false);
    checkBackend();
  }, []);

  async function checkBackend() {
    const { isBackendAvailable } = await import('../services/api');
    const online = await isBackendAvailable();
    setBackendOnline(online);
  }

  const login = async (email: string, password: string) => {
    if (!backendOnline) {
      console.warn("Backend offline, using mock login fallback");
      const matchedQuick = [
        { name: 'Alex Chen', role: 'admin' as const, email: 'alex.chen@company.com' },
        { name: 'Sarah Kim', role: 'engineer' as const, email: 'sarah.kim@company.com' },
        { name: 'Marcus Webb', role: 'viewer' as const, email: 'marcus.webb@company.com' },
      ].find(q => q.email === email);

      const u = matchedQuick || {
        name: email.split('@')[0],
        email: email,
        role: 'admin' as const,
      };

      const resolved: User = {
        id: 'demo-user-id',
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.name.slice(0, 2).toUpperCase(),
        workspaceId: 'demo-workspace',
      };
      
      localStorage.setItem('ima_token', 'mock-token');
      localStorage.setItem('ima_user', JSON.stringify({
        id: resolved.id,
        name: resolved.name,
        email: resolved.email,
        role: resolved.role,
        avatar: resolved.avatar,
        workspace_id: resolved.workspaceId,
      }));
      setUser(resolved);
      setWorkspace(DEMO_WORKSPACE);
      return;
    }

    const data = await authService.login({ email, password });
    const u = data.user;
    const resolved: User = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar || u.name?.slice(0, 2).toUpperCase() || 'U',
      workspaceId: u.workspace_id,
    };
    setUser(resolved);
    setWorkspace(DEMO_WORKSPACE);
  };

  const signup = async (name: string, email: string, password: string, company?: string) => {
    if (!backendOnline) {
      console.warn("Backend offline, using mock signup fallback");
      const resolved: User = {
        id: 'demo-user-id',
        name: name,
        email: email,
        role: 'admin',
        avatar: name.slice(0, 2).toUpperCase(),
        workspaceId: 'demo-workspace',
      };
      localStorage.setItem('ima_token', 'mock-token');
      localStorage.setItem('ima_user', JSON.stringify({
        id: resolved.id,
        name: resolved.name,
        email: resolved.email,
        role: resolved.role,
        avatar: resolved.avatar,
        workspace_id: resolved.workspaceId,
      }));
      setUser(resolved);
      setWorkspace({ ...DEMO_WORKSPACE, name: `${company || name} Workspace` });
      return;
    }

    const data = await authService.signup({ name, email, password, company });
    const u = data.user;
    const resolved: User = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar || name.slice(0, 2).toUpperCase(),
      workspaceId: u.workspace_id,
    };
    setUser(resolved);
    setWorkspace({ ...DEMO_WORKSPACE, name: `${company || name} Workspace` });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setWorkspace(null);
  };

  // Dev helper: switch role without re-auth
  const switchRole = (role: 'admin' | 'engineer' | 'viewer') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    const stored = authService.getStoredUser();
    if (stored) {
      localStorage.setItem('ima_user', JSON.stringify({ ...stored, role }));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      workspace,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      switchRole,
      backendOnline,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
