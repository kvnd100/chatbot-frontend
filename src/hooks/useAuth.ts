import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      navigate('/chat')
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      navigate('/login')
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  return () => {
    logout()
    navigate('/login')
  }
}
