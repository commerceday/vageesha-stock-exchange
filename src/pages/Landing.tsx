import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  IndianRupee
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Trading',
      description: 'Execute trades instantly with live market data and real-time price updates from NSE.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive charts, technical indicators, and AI-powered market analysis.'
    },
    {
      icon: Shield,
      title: 'Secure & Regulated',
      description: 'Your investments are protected with bank-grade security and SEBI regulations.'
    },
    {
      icon: Globe,
      title: '1000+ Stocks',
      description: 'Access to all major NSE listed companies across diverse sectors.'
    }
  ];

  const stockExchangeInfo = [
    {
      icon: Building2,
      title: 'What is a Stock Exchange?',
      content: 'A stock exchange is a regulated marketplace where securities like stocks, bonds, and derivatives are bought and sold. The National Stock Exchange (NSE) of India is one of the largest stock exchanges in the world, providing a transparent and efficient platform for trading.'
    },
    {
      icon: LineChart,
      title: 'How Does Trading Work?',
      content: 'When you buy a stock, you purchase a small ownership stake in a company. Stock prices fluctuate based on supply and demand, company performance, and market conditions. Traders aim to buy low and sell high to generate profits.'
    },
    {
      icon: Clock,
      title: 'Market Hours',
      content: 'The Indian stock market operates Monday to Friday, 9:15 AM to 3:30 PM IST. Pre-market sessions run from 9:00 AM to 9:15 AM. Markets remain closed on weekends and national holidays.'
    },
    {
      icon: IndianRupee,
      title: 'Why Invest in Stocks?',
      content: 'Stocks historically offer higher returns compared to traditional savings. They provide ownership in growing companies, dividend income, and help build long-term wealth. Diversification across sectors reduces risk.'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Listed Stocks' },
    { value: '₹450L Cr', label: 'Market Cap' },
    { value: '24/7', label: 'Platform Access' },
    { value: '0%', label: 'Hidden Fees' }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              Welcome to the Future of Trading
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Master the</span>
              <br />
              <span className="text-foreground">Stock Market</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Your gateway to the National Stock Exchange. Trade smarter with real-time data, 
              advanced analytics, and AI-powered insights across 1000+ stocks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-8 py-6 text-lg shadow-glow">
                  Get Started
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
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
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
              Why Choose <span className="gradient-text">StockVerse</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the most advanced trading platform with features designed for both beginners and professionals.
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

      {/* Stock Exchange Education Section */}
      <section id="learn-more" className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Understanding the <span className="gradient-text">Stock Exchange</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn the fundamentals of stock market investing and how the exchange works.
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

      {/* CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-accent/10" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-8">
            <Users className="h-4 w-4" />
            Join 10,000+ Active Traders
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Your
            <br />
            <span className="gradient-text">Investment Journey?</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Create your free account today and get access to real-time market data, 
            advanced charts, and AI-powered trading insights.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="gap-2 px-10 py-6 text-lg shadow-glow">
              Create Free Account
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
              © 2025 StockVerse. All rights reserved. | NSE Trading Platform
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
