import { LoginForm } from '@/components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">LearnBot</h1>
          <p className="mt-2 text-muted-foreground">Your AI-powered learning companion</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
