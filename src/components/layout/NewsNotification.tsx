import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { NewsItem, formatDate, mockStocks } from '@/utils/stocksApi';

export function NewsNotification() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Generate daily news for the 28 companies
    const generateDailyNews = () => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('newsDate');
      
      // Check if we need to generate new news (once per day)
      if (storedDate !== today) {
        const dailyNews = generateNewsForStocks();
        localStorage.setItem('newsDate', today);
        localStorage.setItem('newsData', JSON.stringify(dailyNews));
        localStorage.setItem('unreadCount', String(dailyNews.length));
        setNews(dailyNews);
        setUnreadCount(dailyNews.length);
      } else {
        // Load existing news for today
        const storedNews = localStorage.getItem('newsData');
        const storedUnread = localStorage.getItem('unreadCount');
        if (storedNews) {
          setNews(JSON.parse(storedNews));
          setUnreadCount(Number(storedUnread) || 0);
        }
      }
    };

    generateDailyNews();
  }, []);

  const generateNewsForStocks = (): NewsItem[] => {
    const newsTemplates = [
      {
        titleTemplate: '{company} reports strong quarterly earnings',
        summaryTemplate: '{company} has announced impressive quarterly results, beating market expectations with robust growth across key segments.'
      },
      {
        titleTemplate: '{company} announces strategic expansion plans',
        summaryTemplate: '{company} unveils ambitious expansion strategy targeting new markets and innovative product lines.'
      },
      {
        titleTemplate: 'Analysts upgrade {company} stock rating',
        summaryTemplate: 'Leading financial analysts have upgraded their outlook on {company}, citing strong fundamentals and growth prospects.'
      },
      {
        titleTemplate: '{company} stock shows volatility amid market trends',
        summaryTemplate: '{company} shares experienced fluctuations today as investors digest recent market movements and sector developments.'
      },
      {
        titleTemplate: '{company} announces dividend increase',
        summaryTemplate: '{company} has declared an increased dividend payout, reflecting strong cash flow and commitment to shareholder returns.'
      },
      {
        titleTemplate: 'New partnership announced by {company}',
        summaryTemplate: '{company} has entered into a strategic partnership aimed at enhancing operational efficiency and market reach.'
      },
      {
        titleTemplate: '{company} invests in technology upgrades',
        summaryTemplate: '{company} commits significant resources to technology infrastructure, aiming to boost productivity and innovation.'
      },
      {
        titleTemplate: 'Market experts discuss {company} outlook',
        summaryTemplate: 'Industry experts share positive outlook on {company}, highlighting potential catalysts for future growth.'
      }
    ];

    const sources = ['Economic Times', 'Business Standard', 'Moneycontrol', 'LiveMint', 'Bloomberg Quint'];
    
    // Select 5-8 random companies for daily news
    const numberOfNews = Math.floor(Math.random() * 4) + 5; // 5 to 8 news items
    const shuffledStocks = [...mockStocks].sort(() => Math.random() - 0.5);
    const selectedStocks = shuffledStocks.slice(0, numberOfNews);

    return selectedStocks.map((stock, index) => {
      const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
      const now = new Date();
      const hoursAgo = Math.floor(Math.random() * 12); // News from last 12 hours
      
      return {
        id: `news-${now.toDateString()}-${index}`,
        title: template.titleTemplate.replace('{company}', stock.name),
        summary: template.summaryTemplate.replace('{company}', stock.name),
        source: sources[Math.floor(Math.random() * sources.length)],
        url: '#',
        publishedAt: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
        relatedSymbols: [stock.symbol]
      };
    });
  };

  const handleOpen = () => {
    // Mark all as read when opened
    setUnreadCount(0);
    localStorage.setItem('unreadCount', '0');
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpen()}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Market News</h3>
          <Badge variant="secondary">{news.length} updates</Badge>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="divide-y">
            {news.map((item) => (
              <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm leading-tight pr-2">{item.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(item.publishedAt)}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.summary}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {item.relatedSymbols?.map((symbol) => (
                      <Badge key={symbol} variant="outline" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-primary">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
