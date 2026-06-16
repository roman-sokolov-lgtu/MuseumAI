import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type User = {
  email: string;
  name: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "admin_panel_auth";

function loadStoredAuth(): { user: User } | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { user: User; token: string };
    return data.user && data.token ? data : null;
  } catch {
    return null;
  }
}

function saveAuth(user: User, token: string) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: User | null }>(() => {
    const stored = loadStoredAuth();
    return { user: stored?.user ?? null };
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        const user: User = { email: username, name: username };
        saveAuth(user, data.access_token);
        setState({ user });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({ user: null });
  }, []);

  const getToken = useCallback(() => {
    const stored = loadStoredAuth();
    return stored ? stored.token : null;
  }, []);

  const value: AuthContextType = {
    isLoggedIn: !!state.user,
    user: state.user,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
