
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
  onClick,
}: StatsCardProps) {
  const formattedTrend = trend !== undefined ? (trend > 0 ? `+${trend.toFixed(2)}%` : `${trend.toFixed(2)}%`) : null;
  const isTrendPositive = trend !== undefined ? trend > 0 : null;
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "hover:scale-[1.02] hover:shadow-[0_12px_40px_hsl(var(--foreground)/0.15)]",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold tracking-tight truncate mb-2" style={{ lineHeight: '1.2' }}>
          <span className={valueClassName}>{value}</span>
        </div>
        
        {(description || trend !== undefined) && (
          <div className="flex items-center text-xs">
            {trend !== undefined && (
              <span className={cn(
                "inline-flex items-center mr-2 font-semibold px-2 py-1 rounded-lg",
                isTrendPositive 
                  ? "text-success bg-success/10" 
                  : "text-danger bg-danger/10"
              )}>
                {isTrendPositive ? <ArrowUpIcon className="h-3.5 w-3.5 mr-1" /> : <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />}
                {formattedTrend}
              </span>
            )}
            {trendLabel && <span className="text-muted-foreground ml-1 truncate">{trendLabel}</span>}
            {description && (
              <p className={cn("text-muted-foreground", trend !== undefined ? "ml-2" : "")}>
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
