
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';

interface StockPlaceholderTabProps {
  title: string;
  description: string;
  message: string;
}

const StockPlaceholderTab: React.FC<StockPlaceholderTabProps> = ({ 
  title, 
  description, 
  message 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPlaceholderTab;
