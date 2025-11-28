import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { authService } from '../services/authService';
import { responseUtils } from '../utils/responseUtils';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.registerUser({ username, email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    await authService.logoutUser(userId);

    return res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return next(error);
  }
};

// ✅ FIXED — all paths now return a value
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return responseUtils.sendError(res, 'Refresh token is required', 400);
    }

    const result = await authService.refreshAuthToken(refreshToken);

    return res.json({
      success: true,
      data: {
        token: result.token,
        refreshToken: result.newRefreshToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    return res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    await authService.verifyEmail(token);

    return res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);

    return res.json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);

    return res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return next(error);
  }
};
