"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth";
import type { User } from "@/lib/types/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    role: "job_seeker" | "employer"
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = AuthService.isAuthenticated();
    const currentUser = AuthService.getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        AuthService.setCurrentUser(response.user);
        return { success: true };
      }

      return { success: false, error: response.error || "Login failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "job_seeker" | "employer"
  ) => {
    try {
      const response = await AuthService.register({ email, password, role });

      if (response.success && response.user) {
        return { success: true };
      }

      return { success: false, error: response.error || "Registration failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
