'use client';

import QuestionItem from '@/components/custom/QuestionItem';
import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DashboardLoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-10 bg-muted rounded w-3/4"></div>
    <Card>
      <CardHeader>
        <div className="h-8 bg-muted rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-12 bg-muted rounded w-full"></div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <div className="h-8 bg-muted rounded w-1/3"></div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-14 bg-muted rounded"></div>
        <div className="h-14 bg-muted rounded"></div>
      </CardContent>
    </Card>
  </div>
);

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTotalQuestions = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch('/api/v1/content');
        const result = await response.json();

        if (!result?.data) throw new Error('Invalid API response');

        let total = 0;
        for (const category of result.data) {
          if (Array.isArray(category.questions)) {
            total += category.questions.length;
          }
        }
        setTotalQuestions(total);
      } catch (error) {
        console.error('Failed to fetch total questions count', error);
        setTotalQuestions(0);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTotalQuestions();
  }, [isAuthenticated]);

  if (isAuthLoading || isLoadingData || !user || totalQuestions === null) {
    return (
      <main className="min-h-screen bg-background text-foreground p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <DashboardLoadingSkeleton />
        </div>
      </main>
    );
  }

  const completedCount = user.completedQuestions?.length || 0;
  const progressPercentage =
    totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">
            A summary of your progress and bookmarks.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-2">
              <Progress value={progressPercentage} className="w-full" />
              <span className="font-semibold text-lg">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <p className="text-muted-foreground">
              You have completed {completedCount} out of {totalQuestions}{' '}
              questions. Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmarked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {user.bookmarkedQuestions && user.bookmarkedQuestions.length > 0 ? (
              <Accordion type="multiple" className="space-y-3">
                {user.bookmarkedQuestions.map((question) => (
                  <QuestionItem key={question._id} question={question} />
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">
                You haven&apos;t bookmarked any questions yet. Go to the{' '}
                <Link
                  href="/questions"
                  className="text-primary hover:underline"
                >
                  questions page
                </Link>{' '}
                to save some for later.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
