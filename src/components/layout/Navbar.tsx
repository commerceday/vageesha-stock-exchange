
import React, { useEffect, useState } from 'react';
import { Search, Bell, User, LogOut, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/stocksApi';
import { NewsNotification } from './NewsNotification';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(500000);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setBalance(profile.balance);
        }
      }
    };
    
    fetchBalance();
    
    // Set up realtime subscription for balance updates
    const channel = supabase
      .channel('balance-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.new.balance !== undefined) {
            setBalance(payload.new.balance);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      navigate('/auth');
    }
  };

  return (
    <header className={cn(
      "bg-card/90 backdrop-blur-2xl sticky top-0 z-50 border-b border-border/50",
      "shadow-[0_4px_20px_hsl(var(--foreground)/0.08)]",
      className
    )}>
      <div className="container flex items-center justify-between h-16 sm:h-18 px-4">
        <div className="flex items-center gap-2 lg:gap-6 flex-1 md:flex-initial">
          <h1 className="text-base font-bold tracking-tight sm:text-lg lg:text-2xl md:ml-0 ml-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MarketPulse
          </h1>
          
          <div className="relative hidden md:flex items-center h-10 rounded-xl px-4 text-muted-foreground focus-within:text-foreground bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors duration-300 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-4 w-4 mr-2 text-primary" />
            <Input 
              type="search" 
              placeholder="Search stocks, indices..." 
              className="h-10 w-[200px] lg:w-[320px] bg-transparent border-none px-0 py-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatCurrency(balance)}
            </span>
          </div>
          
          <NewsNotification />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-primary/50 cursor-pointer border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 bg-card/95 backdrop-blur-xl border-border/50">
              <DropdownMenuLabel className="text-base font-bold">My Account</DropdownMenuLabel>
              <DropdownMenuLabel className="font-normal text-sm text-muted-foreground flex items-center gap-2">
                <Wallet className="h-3.5 w-3.5" />
                Balance: {formatCurrency(balance)}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
