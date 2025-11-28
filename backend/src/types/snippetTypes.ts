import { Document, Types } from 'mongoose';

export interface ISnippet extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  code: string;
  programmingLanguage: string;
  tags: string[];
  category: Types.ObjectId;
  user: Types.ObjectId;
  isPublic: boolean;
  favoriteCount: number;
  favorites: Types.ObjectId[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SnippetResponse {
  _id: string;
  title: string;
  description: string;
  code: string;
  programmingLanguage: string;
  tags: string[];
  category: {
    _id: string;
    name: string;
    color: string;
  };
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  isPublic: boolean;
  favoriteCount: number;
  isFavorited?: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetRequest {
  title: string;
  description?: string;
  code: string;
  programmingLanguage: string;
  tags?: string[];
  category: string;
  isPublic?: boolean;
}

export interface UpdateSnippetRequest {
  title?: string;
  description?: string;
  code?: string;
  programmingLanguage?: string;
  tags?: string[];
  category?: string;
  isPublic?: boolean;
}

export interface SnippetFilters {
  page: number;
  limit: number;
  programmingLanguage?: string;
  search?: string;
  category?: string;
  tags?: string;
  userId?: string;
  publicOnly?: boolean;
}

export interface SnippetListResponse {
  snippets: SnippetResponse[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}