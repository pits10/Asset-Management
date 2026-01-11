'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Sliders,
  User,
  Wallet,
  ArrowLeftRight,
  GitCompare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Assets',
    href: '/assets',
    icon: Wallet,
  },
  {
    label: 'Cashflow',
    href: '/cashflow',
    icon: ArrowLeftRight,
  },
  {
    label: 'Trajectory',
    href: '/trajectory',
    icon: TrendingUp,
  },
  {
    label: 'Scenarios',
    href: '/scenarios',
    icon: GitCompare,
  },
  {
    label: 'Adjust',
    href: '/adjust',
    icon: Sliders,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background-secondary/95 backdrop-blur-xl safe-area-inset-bottom">
      <div className="hide-scrollbar overflow-x-auto">
        <div className="mx-auto flex h-16 min-w-max max-w-4xl items-center justify-start gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors min-w-[68px]',
                  isActive ? 'text-accent-growth' : 'text-foreground-muted hover:text-foreground-secondary'
                )}
              >
                <Icon className={cn('h-5 w-5 transition-all', isActive && 'scale-110')} />
                <span className="text-[10px] font-medium leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
