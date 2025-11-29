'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart2,
  Briefcase,
  FileText,
  Home,
  Lightbulb,
  LogIn,
  LogOut,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import ThemeToggle from './ThemeToggle';

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/predict-trend', label: 'Job Trend Prediction', icon: TrendingUp },
  { href: '/skill-gap', label: 'Skill Gap Analyzer', icon: Lightbulb },
  { href: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
  { href: '/market-insights', label: 'Market Insights', icon: BarChart2 },
];

const userNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/login', label: 'Login', icon: LogIn },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const isAuthenticated = true; // Placeholder for auth state

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-50 flex h-full items-center py-4">
        <div className="flex h-full max-h-[700px] flex-col justify-between items-center gap-4 py-6 px-3 ml-4 rounded-2xl glassmorphic shadow-lg">
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="group">
              <div className="bg-primary/80 p-3 rounded-xl group-hover:bg-primary transition-colors">
                <Briefcase className="text-primary-foreground" />
              </div>
            </Link>
            <Separator className="w-8/12" />
            <nav className="flex flex-col items-center gap-4">
              {mainNavItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                        pathname === item.href
                          ? 'bg-primary/90 text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-center gap-4">
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                    pathname === '/profile'
                      ? 'bg-primary/90 text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={isAuthenticated ? "/api/auth/logout" : "/login"}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {isAuthenticated ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                  <span className="sr-only">{isAuthenticated ? "Logout" : "Login"}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{isAuthenticated ? "Logout" : "Login"}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
