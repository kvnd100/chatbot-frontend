import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => login.mutate(values)

  const serverError = login.error
    ? (login.error as { response?: { data?: { message?: string } } }).response?.data?.message ??
      'Login failed. Please try again.'
    : null

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue learning</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-sm font-medium text-destructive">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
