import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const register = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', username: '', email: '', password: '' },
  })

  const onSubmit = (values: RegisterFormValues) => register.mutate(values)

  const serverError = register.error
    ? (() => {
        const msg = (register.error as { response?: { data?: { message?: string | string[] } } })
          .response?.data?.message
        return Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Registration failed. Try again.')
      })()
    : null

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Start your learning journey today</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
