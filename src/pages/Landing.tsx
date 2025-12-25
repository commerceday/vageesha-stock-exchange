import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Globe, 
  ArrowRight, 
  LineChart,
  Users,
  Zap,
  BookOpen,
  Building2,
  Clock,
  IndianRupee,
  HelpCircle
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Risk-Free Practice',
      description: 'Trade with virtual money in a realistic simulation. Learn without risking real capital.'
    },
    {
      icon: BarChart3,
      title: 'Real Market Data',
      description: 'Practice with actual NSE stock prices and charts to experience real market movements.'
    },
    {
      icon: Shield,
      title: 'Safe Learning Environment',
      description: 'Make mistakes, learn strategies, and build confidence before entering real markets.'
    },
    {
      icon: Globe,
      title: '1000+ Simulated Stocks',
      description: 'Access all major NSE listed companies in our comprehensive mock trading platform.'
    }
  ];

  const stockExchangeInfo = [
    {
      icon: Building2,
      title: 'What is a Mock Stock Exchange?',
      content: 'A mock stock exchange is a simulated trading platform that mirrors real stock market conditions. StockVerse uses real NSE data to provide an authentic learning experience without any financial risk. Perfect for beginners and students.'
    },
    {
      icon: LineChart,
      title: 'How Does Simulated Trading Work?',
      content: 'You start with virtual money (₹5,00,000) and trade just like in real markets. Buy and sell stocks, track your portfolio performance, and learn from your decisions. All trades are simulated - no real money is involved.'
    },
    {
      icon: Clock,
      title: 'Practice Anytime',
      content: 'Unlike real markets with fixed hours (9:15 AM - 3:30 PM IST), our platform lets you practice 24/7. Review historical data, place mock orders, and build your trading strategies at your own pace.'
    },
    {
      icon: IndianRupee,
      title: 'Why Practice Before Investing?',
      content: 'Studies show that 90% of new traders lose money. Our simulator helps you understand market dynamics, test strategies, and avoid costly beginner mistakes before investing real money.'
    }
  ];


  const faqs = [
    {
      question: 'Is this a real stock trading platform?',
      answer: 'No, StockVerse is a mock/simulated trading platform designed for learning and practice. All trades are virtual, and no real money is involved. We use real market data from NSE to provide an authentic experience, but you cannot buy or sell actual stocks here.'
    },
    {
      question: 'How much virtual money do I get to practice?',
      answer: 'Every new user starts with ₹5,00,000 in virtual funds. You can use this to buy and sell stocks, build a portfolio, and track your performance. If you lose it all, you can reset your account and start fresh!'
    },
    {
      question: 'Is the stock data real or fictional?',
      answer: 'We use real stock prices and data from the National Stock Exchange (NSE). This means you are practicing with actual market conditions, real company stocks, and genuine price movements - just without the financial risk.'
    },
    {
      question: 'Can I transition to real trading after practicing here?',
      answer: 'Absolutely! StockVerse is designed to prepare you for real markets. Once you feel confident, you can open a demat account with any SEBI-registered broker (like Zerodha, Groww, or Upstox) to start real trading.'
    },
    {
      question: 'Is this platform free to use?',
      answer: 'Yes! StockVerse is completely free for learning and practice. We believe everyone should have access to quality trading education without financial barriers. No hidden fees or premium subscriptions.'
    },
    {
      question: 'What can I learn from mock trading?',
      answer: 'You will learn how to read stock charts, understand market trends, build diversified portfolios, manage risk, use technical indicators, and develop trading strategies - all without risking real money.'
    },
    {
      question: 'How is this different from paper trading?',
      answer: 'Paper trading traditionally means recording trades on paper. StockVerse automates this with a digital platform, automatic profit/loss calculations, portfolio tracking, and performance analytics - making learning more effective.'
    },
    {
      question: 'Who is this platform for?',
      answer: 'StockVerse is perfect for students, beginners, aspiring traders, finance enthusiasts, and anyone who wants to understand stock markets before investing real money. It is also great for educators teaching investment concepts.'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Simulated Stocks' },
    { value: '₹5L', label: 'Virtual Money' },
    { value: '100%', label: 'Risk Free' },
    { value: '₹0', label: 'Cost to Learn' }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Free Account',
      description: 'Sign up in seconds with just your email. No KYC, no documents, no hassle.'
    },
    {
      step: '02',
      title: 'Get ₹5 Lakh Virtual Money',
      description: 'Start with ₹5,00,000 in your virtual wallet to practice trading.'
    },
    {
      step: '03',
      title: 'Research & Analyze',
      description: 'Browse 1000+ stocks, view charts, and analyze real market data.'
    },
    {
      step: '04',
      title: 'Buy & Sell Stocks',
      description: 'Place mock orders just like real trading. Track your portfolio performance.'
    },
    {
      step: '05',
      title: 'Learn from Mistakes',
      description: 'Review your trades, understand what worked, and refine your strategies.'
    },
    {
      step: '06',
      title: 'Go Live When Ready',
      description: 'Once confident, open a real demat account and start actual investing.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              Mock Trading Simulator • No Real Money
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Learn to Trade</span>
              <br />
              <span className="text-foreground">Risk-Free</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Practice stock trading with virtual money using real NSE data. 
              Build confidence and learn strategies before investing real capital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-8 py-6 text-lg shadow-glow">
                  Start Practicing Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 px-8 py-6 text-lg" asChild>
                <a href="#learn-more">
                  <BookOpen className="h-5 w-5" />
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <AnimatedCounter 
                  value={stat.value} 
                  className="text-3xl md:text-4xl font-bold gradient-text mb-2"
                  duration={2000 + index * 200}
                />
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Practice on <span className="gradient-text">StockVerse</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most realistic mock trading simulator for learning stock market investing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-modern border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Simple Steps
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start your mock trading journey in just a few simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <Card key={index} className="card-modern border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-8xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
                <CardContent className="p-6 relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stock Exchange Education Section */}
      <section id="learn-more" className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Understanding <span className="gradient-text">Mock Trading</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn how our simulated trading platform works and why it is the best way to learn.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {stockExchangeInfo.map((info, index) => (
              <Card key={index} className="glass-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <info.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{info.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{info.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Indices Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Major <span className="gradient-text">Market Indices</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track the pulse of Indian markets through key benchmark indices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-modern bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold gradient-text mb-2">NIFTY 50</div>
                <p className="text-muted-foreground mb-4">
                  The flagship index representing the top 50 companies by market capitalization on NSE.
                </p>
                <div className="text-sm text-success flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Benchmark Index
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern bg-gradient-to-br from-card to-accent/5 border-accent/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2">SENSEX</div>
                <p className="text-muted-foreground mb-4">
                  BSE's 30-stock index tracking the largest and most actively traded companies.
                </p>
                <div className="text-sm text-success flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  30 Companies
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern bg-gradient-to-br from-card to-success/5 border-success/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-success mb-2">BANK NIFTY</div>
                <p className="text-muted-foreground mb-4">
                  Tracks the performance of the most liquid and large capitalized banking stocks.
                </p>
                <div className="text-sm text-success flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Banking Sector
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <HelpCircle className="h-4 w-4" />
              Got Questions?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about stock trading and investing with StockVerse.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border/50 px-6 overflow-hidden data-[state=open]:shadow-lg transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold text-base pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-accent/10" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-8">
            <Users className="h-4 w-4" />
            Join 10,000+ Learners
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Learn
            <br />
            <span className="gradient-text">Stock Trading?</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Create your free account and get ₹5,00,000 in virtual money to start 
            practicing. No credit card required. No real money involved.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="gap-2 px-10 py-6 text-lg shadow-glow">
              Start Mock Trading Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">StockVerse</span>
            </div>
            
            <p className="text-muted-foreground text-sm text-center">
              © 2025 StockVerse. All rights reserved. | Mock Trading Simulator • Not a Real Stock Exchange
            </p>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
