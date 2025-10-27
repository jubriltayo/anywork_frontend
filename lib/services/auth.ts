import { apiClient } from "@/lib/api/client";
import type {
  BaseResponse,
  AuthResponse,
  User,
  LoginPayload,
  RegisterPayload,
} from "@/lib/types/api";

interface AuthServiceResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
  USER: "user",
} as const;

export class AuthService {
  static async register(
    payload: RegisterPayload
  ): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<BaseResponse<{ user: User }>>(
        "/auth/register/",
        payload
      );

      if (response.status === "success" && response.data?.user) {
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.message || "Registration failed",
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  static async login(payload: LoginPayload): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<BaseResponse<AuthResponse>>(
        "/auth/login/",
        payload
      );

      if (response.status === "success" && response.data) {
        AuthService.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        AuthService.setCurrentUser(response.data.user);
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.message || "Login failed",
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  static async googleAuth(code: string): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<BaseResponse<AuthResponse>>(
        "/auth/google/",
        { code }
      );

      if (response.status === "success" && response.data) {
        AuthService.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        AuthService.setCurrentUser(response.data.user);
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.message || "Google authentication failed",
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Google authentication failed",
      };
    }
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
      localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEYS.ACCESS);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEYS.REFRESH);
    }
    return null;
  }

  static clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_KEYS.REFRESH);
      localStorage.removeItem(TOKEN_KEYS.USER);
    }
  }

  static isAuthenticated(): boolean {
    return AuthService.getAccessToken() !== null;
  }

  static getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(TOKEN_KEYS.USER);
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static setCurrentUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    }
  }

  static async logout(): Promise<void> {
    AuthService.clearTokens();
  }
}
