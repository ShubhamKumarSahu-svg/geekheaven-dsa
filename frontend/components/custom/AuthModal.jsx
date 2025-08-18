'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function AuthModal() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [open, setOpen] = useState(false);
  const { login } = useAuth();

  const form = useForm({
    defaultValues: { name: '', email: '', password: '' },
  });

  const validate = (values) => {
    const errors = {};
    if (!isLoginView && (!values.name || values.name.length < 2)) {
      errors.name = 'Name must be at least 2 characters.';
    }
    if (!values.email || !values.email.includes('@')) {
      errors.email = 'Please enter a valid email.';
    }
    if (!values.password || values.password.length < (isLoginView ? 1 : 6)) {
      errors.password = isLoginView
        ? 'Password is required.'
        : 'Password must be at least 6 characters.';
    }
    return errors;
  };

  const onSubmit = async (values) => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        form.setError(field, { type: 'manual', message });
      });
      return;
    }

    const endpoint = isLoginView ? 'login' : 'register';
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/auth/${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      login(data.user, data.token);
      setOpen(false);

      toast.success(`Welcome, ${data.user.name}!`, {
        description: isLoginView
          ? "You've successfully logged in."
          : 'Your account has been created.',
      });
    } catch (error) {
      toast.error('Authentication Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Login / Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLoginView ? 'Login' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription>
            {isLoginView
              ? 'Welcome back! Please enter your details.'
              : 'Join us! It only takes a minute.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isLoginView && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? 'Processing...'
                : isLoginView
                ? 'Login'
                : 'Create Account'}
            </Button>
          </form>
        </Form>

        <DialogFooter className="pt-4">
          <Button variant="link" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView
              ? 'Need an account? Register'
              : 'Already have an account? Login'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
