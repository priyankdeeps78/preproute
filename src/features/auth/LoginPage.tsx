import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/layout/Logo'
import { useLogin } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    })
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-primary-50 lg:flex">
        <svg viewBox="0 0 400 320" className="w-3/4 max-w-md">
          <rect x="20" y="240" width="360" height="10" rx="5" fill="#6b7280" opacity="0.4" />
          {[60, 340].map((x) => (
            <line key={x} x1={x} y1="250" x2={x} y2="300" stroke="#6b7280" strokeWidth="2" opacity="0.4" />
          ))}
          <rect x="30" y="150" width="130" height="90" rx="4" fill="#e2e8f0" transform="skewX(-8)" />
          <rect x="160" y="60" width="50" height="180" rx="20" fill="#eef1fe" stroke="#5b6ef0" strokeWidth="2" />
          <rect x="168" y="40" width="34" height="24" rx="6" fill="#7c8cf0" />
          <circle cx="178" cy="140" r="3.5" fill="#171f3d" />
          <circle cx="194" cy="140" r="3.5" fill="#171f3d" />
          <path d="M178 152q8 6 16 0" stroke="#171f3d" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="168" y="205" width="34" height="22" rx="6" fill="#7c8cf0" />
          <circle cx="250" cy="120" r="4" fill="#5b6ef0" opacity="0.6" />
          <path d="M90 60h16M98 52v16" stroke="#5b6ef0" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo className="mb-10" />
          <h1 className="text-2xl font-bold text-ink-900">Login</h1>
          <p className="mt-1 text-sm text-ink-500">
            Use your company provided Login credentials
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
            <Field label="User ID" error={errors.userId?.message}>
              <Input
                placeholder="Enter User ID"
                invalid={Boolean(errors.userId)}
                {...register('userId')}
              />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <Input
                type="password"
                placeholder="Enter Password"
                invalid={Boolean(errors.password)}
                {...register('password')}
              />
            </Field>

            {loginMutation.isError && (
              <p className="text-sm text-rose-600">
                Login failed. Check your User ID and password and try again.
              </p>
            )}

            <button type="button" className="w-fit text-sm text-primary-600 hover:underline">
              Forgot password?
            </button>

            <Button type="submit" loading={loginMutation.isPending} className="mt-2 w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
