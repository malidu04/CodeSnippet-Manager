import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { emailService } from './emailService';
import { bcryptUtils } from '../utils/bcryptUtils';
import { logger } from '../utils/logger';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}

export const authService = {
  async registerUser(userData: RegisterData): Promise<{ user: IUser; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = this.generateToken(user);

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user);
    } catch (error) {
      logger.error('Failed to send verification email:', error);
    }

    return { user, token };
  },

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return { user, token, refreshToken };
  },

  async logoutUser(userId: string): Promise<void> {
    // Revoke all refresh tokens for the user
    await RefreshToken.updateMany(
      { user: userId, isRevoked: false },
      { isRevoked: true }
    );
  },

  async refreshAuthToken(refreshToken: string): Promise<{ token: string; newRefreshToken: string }> {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    
    // Find valid refresh token
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: decoded.id,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const token = this.generateToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    // Revoke old refresh token
    storedToken.isRevoked = true;
    await storedToken.save();

    return { token, newRefreshToken };
  },

  async verifyEmail(token: string): Promise<void> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    user.isVerified = true;
    await user.save();
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    await emailService.sendPasswordResetEmail(user, resetToken);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.purpose !== 'password_reset') {
      throw new Error('Invalid reset token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Invalid reset token');
    }

    user.password = newPassword;
    await user.save();

    // Revoke all existing refresh tokens
    await RefreshToken.updateMany(
      { user: user._id, isRevoked: false },
      { isRevoked: true }
    );
  },

  generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  },

  async generateRefreshToken(user: IUser): Promise<string> {
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return refreshToken;
  },
};