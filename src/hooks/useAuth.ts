import { useMutation } from '@tanstack/react-query'

import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { LoginPayload } from '@/types/api'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
    },
  })
}
