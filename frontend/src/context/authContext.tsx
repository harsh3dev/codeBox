import { BACKEND_URL } from "@/lib/credentials";
import { createContext, useState, useEffect } from "react";
import { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<{ loading: boolean; success: boolean; error: string | null }>;
  logout: () => void;
  signup: (fullName: string, email: string, password: string) => Promise<{ loading: boolean; success: boolean; error: string | null }>;
  loading: boolean;
}

interface User {
  id: string;
  email: string;
  full_name: string;
}

const AuthContext = createContext({
  user: null,
  login: async (email: string, password: string) => ({ loading: false, success: false, error: null }),
  logout: () => { },
  signup: async (fullName: string, email: string, password: string) => ({ loading: false, success: false, error: null }),
  loading: true,
} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  interface LoginResponse {
    access: string;
    refresh: string;
  }

  const login = async (email: string, password: string): Promise<{ loading: boolean; success: boolean; error: string | null }> => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data: LoginResponse = await res.json();
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        await fetchUser();
        return { loading: false, success: true, error: null };
      } else {
        return { loading: false, success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      console.error(error);
      return { loading: false, success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<{ loading: boolean; success: boolean; error: string | null }> => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      if (res.ok) {
        const data: LoginResponse = await res.json();
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        await fetchUser();
        return { loading: false, success: true, error: null };
      } else {
        return { loading: false, success: false, error: "Signup failed" };
      }
    } catch (error) {
      console.error(error);
      return { loading: false, success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
