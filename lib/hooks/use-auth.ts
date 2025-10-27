import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth";
import type { User } from "@/lib/types/api";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      const currentUser = AuthService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });

    if (response.success && response.user) {
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: response.error };
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      role: "job_seeker" | "employer"
    ) => {
      const response = await AuthService.register({ email, password, role });

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        AuthService.setCurrentUser(response.user);
        return { success: true };
      }

      return { success: false, error: response.error };
    },
    []
  );

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  }, [router]);

  const requireAuth = useCallback(
    (redirectTo = "/login") => {
      if (!isAuthenticated && !isLoading) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [isAuthenticated, isLoading, router]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    requireAuth,
  };
}
