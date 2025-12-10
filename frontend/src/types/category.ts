export interface Category {
  _id: string
  name: string
  description: string
  color: string
  user: string
  snippetCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  color?: string
}