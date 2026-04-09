import api from './api'
import type { AuthResponse, RegisterResponse } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<RegisterResponse>('/user/register', payload).then((r) => r.data),
}
