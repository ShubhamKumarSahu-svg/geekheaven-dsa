'use client';

import QuestionItem from '@/components/custom/QuestionItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const QuestionsLoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-16 bg-muted rounded-lg w-full"></div>
    <div className="h-16 bg-muted rounded-lg w-full"></div>
    <div className="h-16 bg-muted rounded-lg w-full"></div>
    <div className="h-16 bg-muted rounded-lg w-full"></div>
  </div>
);

export default function QuestionsPage() {
  return (
    <Suspense fallback={<QuestionsLoadingSkeleton />}>
      <QuestionsPageContent />
    </Suspense>
  );
}

function QuestionsPageContent() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('');

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [difficulty, setDifficulty] = useState(
    searchParams.get('difficulty') || 'all'
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'title_asc'
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalResults: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: sortBy,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(difficulty !== 'all' && { difficulty }),
      });

      try {
        const response = await fetch(`/api/v1/content?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const result = await response.json();
        setCategories(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, difficulty, sortBy, page, isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Authenticating...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <main className="flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">GeekHeaven DSA</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}!</p>
          </div>
        </header>

        <Card className="mb-8">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search for a question..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-grow"
            />
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading ? (
          <QuestionsLoadingSkeleton />
        ) : error ? (
          <div className="text-center py-16 text-destructive">{error}</div>
        ) : categories.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            {categories.map((category) => (
              <AccordionItem
                value={category._id}
                key={category._id}
                className="bg-card rounded-lg my-2 border-none"
              >
                <AccordionTrigger className="text-xl hover:no-underline px-4">
                  {category.title}
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  <Accordion type="single" collapsible>
                    {category.questions.map((question) => (
                      <QuestionItem key={question._id} question={question} />
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold">No Questions Found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
              Previous
            </Button>
            <span className="text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} (
              {pagination.totalResults} results)
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
