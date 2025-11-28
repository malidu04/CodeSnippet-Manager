import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Fix: Use createTransport instead of createTransporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(user: IUser): Promise<void> {
    const verificationToken = jwt.sign(
      { id: user._id, purpose: 'email_verification' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"CodeSnippet Manager" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your Email - CodeSnippet Manager',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Welcome to CodeSnippet Manager!</h2>
          <p>Hello ${user.username},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3B82F6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    };

    await this.sendEmail(mailOptions);
  }

  async sendPasswordResetEmail(user: IUser, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"CodeSnippet Manager" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Your Password - CodeSnippet Manager',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3B82F6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
      `,
    };

    await this.sendEmail(mailOptions);
  }

  async sendWelcomeEmail(user: IUser): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"CodeSnippet Manager" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to CodeSnippet Manager!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Welcome to CodeSnippet Manager!</h2>
          <p>Hello ${user.username},</p>
          <p>Your account has been successfully verified and you're ready to start organizing your code snippets!</p>
          <p>Here are some things you can do:</p>
          <ul>
            <li>Create and organize your code snippets</li>
            <li>Categorize by programming programmingLanguage</li>
            <li>Add tags for easy searching</li>
            <li>Share snippets with others</li>
          </ul>
          <p>Happy coding! 🚀</p>
        </div>
      `,
    };

    await this.sendEmail(mailOptions);
  }

  private async sendEmail(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'test') {
        logger.info('Email sending skipped in test environment:', {
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        return;
      }

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to: ${mailOptions.to}`, {
        messageId: result.messageId
      });
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email server connection verified');
      return true;
    } catch (error) {
      logger.error('Email server connection failed:', error);
      return false;
    }
  }

  // Additional utility method for testing email configuration
  async testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
    try {
      const isConnected = await this.verifyConnection();
      if (!isConnected) {
        return { success: false, error: 'Failed to connect to email server' };
      }

      // Test with a simple email if in development
      if (process.env.NODE_ENV === 'development') {
        const testMailOptions: nodemailer.SendMailOptions = {
          from: `"CodeSnippet Manager Test" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: 'Test Email - CodeSnippet Manager',
          text: 'This is a test email to verify your email configuration.',
        };

        await this.transporter.sendMail(testMailOptions);
        logger.info('Test email sent successfully');
      }

      return { success: true };
    } catch (error: any) {
      logger.error('Email configuration test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const emailService = new EmailService();