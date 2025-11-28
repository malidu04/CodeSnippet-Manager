export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: any;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}