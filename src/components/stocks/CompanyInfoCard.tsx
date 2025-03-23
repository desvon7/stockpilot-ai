
import React from 'react';
import { useCompanyProfile } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Globe, MapPin, Users, TrendingUp, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatLargeCurrency, formatPercent } from '@/utils/formatters';

interface CompanyInfoCardProps {
  symbol: string;
  className?: string;
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ symbol, className }) => {
  const { data: company, isLoading, error } = useCompanyProfile(symbol);
  
  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !company) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Information not available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load company information for {symbol}.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{company.companyName}</CardTitle>
            <CardDescription>{company.exchange}: {company.symbol} • {company.industry}</CardDescription>
          </div>
          {company.image && (
            <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md border">
              <img 
                src={company.image}
                alt={`${company.companyName} logo`}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm mb-2">{company.description}</p>
          {company.website && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.open(company.website, '_blank')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Visit Website
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground flex items-center">
              <Briefcase className="h-4 w-4 mr-1" /> Sector
            </p>
            <p className="font-medium">{company.sector}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-1" /> Employees
            </p>
            <p className="font-medium">{company.fullTimeEmployees?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> Location
            </p>
            <p className="font-medium">{company.country || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> IPO Date
            </p>
            <p className="font-medium">{company.ipoDate || 'N/A'}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatLargeCurrency(company.mktCap)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Beta</p>
            <p className="font-medium">{company.beta?.toFixed(2) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Volume</p>
            <p className="font-medium">{company.volAvg?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dividend Yield</p>
            <p className="font-medium">
              {company.lastDiv ? formatPercent(company.lastDiv / company.price) : 'N/A'}
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="text-sm text-muted-foreground">
          <p>CEO: {company.ceo || 'N/A'}</p>
          {company.address && (
            <p>{company.address}, {company.city}, {company.state} {company.zip}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
