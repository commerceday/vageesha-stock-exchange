
import React, { useEffect, useState } from 'react';
import { 
  BarChart, PieChart, BarChart3, Wallet, LineChart,
  ChevronRight, ChevronLeft, Home, Menu, Landmark, Layers, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  adminOnly?: boolean;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: hasRole } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });
        setIsAdmin(!!hasRole);
      }
    };
    checkAdminStatus();
  }, []);
  
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/',
    },
    {
      title: 'Stocks',
      icon: BarChart,
      href: '/stocks',
    },
    {
      title: 'Mutual Funds',
      icon: Landmark,
      href: '/mutual-funds',
    },
    {
      title: 'ETFs',
      icon: Layers,
      href: '/etfs',
    },
    {
      title: 'Markets',
      icon: BarChart3,
      href: '/markets',
    },
    {
      title: 'Portfolio',
      icon: Wallet,
      href: '/portfolio',
    },
    {
      title: 'Performance',
      icon: LineChart,
      href: '/performance',
    },
    {
      title: 'Analysis',
      icon: PieChart,
      href: '/analysis',
    },
    {
      title: 'User Management',
      icon: Users,
      href: '/admin/users',
      adminOnly: true,
    }
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const SidebarContent = () => (
    <>
      <div className="flex h-16 sm:h-18 items-center justify-center border-b border-sidebar-border/50">
        <h2 className={cn(
          "font-bold text-lg tracking-tight transition-opacity duration-200 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
          isCollapsed && !isMobile ? "opacity-0" : "opacity-100"
        )}>
          MarketPulse
        </h2>
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "absolute right-2 text-sidebar-foreground h-9 w-9 rounded-xl hover:bg-sidebar-accent transition-all duration-300",
              isCollapsed ? "right-2 rotate-180" : "right-4"
            )}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 py-6">
        <nav className="grid gap-2 px-3">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-[1.02]",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_4px_12px_hsl(var(--sidebar-primary)/0.15)]",
                  isActive 
                    ? "bg-gradient-to-r from-sidebar-primary/20 to-sidebar-primary/10 text-sidebar-primary font-semibold shadow-[0_4px_12px_hsl(var(--sidebar-primary)/0.2)]" 
                    : "text-sidebar-foreground",
                  isCollapsed && !isMobile && "justify-center px-0",
                  item.adminOnly && "border-l-2 border-danger/50"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                <span className={cn(
                  "text-sm font-medium transition-opacity duration-200",
                  isCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border/50">
        <div className={cn(
          "transition-opacity duration-200 rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-accent/50 p-3 text-xs text-sidebar-accent-foreground border border-sidebar-border/30",
          isCollapsed && !isMobile ? "opacity-0" : "opacity-100"
        )}>
          <p className="font-semibold text-sidebar-primary">Market Status</p>
          <p className="text-sidebar-foreground/90">Markets are open</p>
          <p className="text-[10px] text-sidebar-foreground/70">Closes in 3h 45m</p>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-3.5 left-4 z-50 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
      "bg-sidebar text-sidebar-foreground relative transition-all duration-300 ease-in-out flex flex-col border-r border-sidebar-border hidden md:flex",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <SidebarContent />
    </aside>
  );
}
