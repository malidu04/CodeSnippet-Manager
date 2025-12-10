export interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  isVerified: boolean
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  totalSnippets: number
  totalCategories: number
  favoriteSnippets: number 
  publicSnippets: number
  languages: { [key: string]: number }
}

export interface UpdateProfileRequest {
  username?: string
  email?: string
  avatar?: string
}