import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface UserStats {
  totalSnippets: number;
  totalCategories: number;
  favoriteSnippets: number;
  publicSnippets: number;
  programmingLanguages: { [key: string]: number };
}