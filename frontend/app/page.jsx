'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/questions');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl w-full text-center">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            Welcome to GeekHeaven
          </h1>
          <p className="text-muted-foreground mt-4 text-lg md:text-xl">
            The ultimate platform to track and conquer your DSA journey.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-8 mb-12 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Curated Problem List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access a hand-picked list of essential DSA questions covering
                all major topics.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Mark questions as complete and visualize your progress on a
                personalized dashboard.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Built for You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A clean, fast, and modern interface designed to keep you focused
                on solving problems.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
