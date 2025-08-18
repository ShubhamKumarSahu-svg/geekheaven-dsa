'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggler';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold sm:inline-block">GeekHeaven</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <AuthModal />
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
