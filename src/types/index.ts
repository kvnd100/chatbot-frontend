export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
export type MessageRole = 'user' | 'assistant'

export interface User {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  title: string | null
  createdAt: string
  messages?: Message[]
}

export interface Message {
  id: string
  content: string
  role: MessageRole
  createdAt: string
}

// Auth
export interface AuthResponse {
  access_token: string
  user: User
}

export interface RegisterResponse {
  message: string
  user: User
}

// API error shape returned by backend
export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
}
