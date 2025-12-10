import type { User } from './user'
import type { Category } from './category'

export interface Snippet {
  _id: string
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  category: Category
  user: User
  isPublic: boolean
  favoriteCount: number
  isFavorited?: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateSnippetRequest {
  title: string
  description?: string
  code: string
  language: string
  tags?: string[]
  category: string
  isPublic?: boolean
}

export interface UpdateSnippetRequest {
  title?: string
  description?: string
  code?: string
  language?: string
  tags?: string[]
  category?: string
  isPublic?: boolean
}

export interface SnippetFilters {
  page?: number
  limit?: number
  language?: string
  search?: string
  category?: string
  tags?: string
}

export interface SnippetListResponse {
  snippets: Snippet[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}