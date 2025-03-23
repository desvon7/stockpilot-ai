
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardSettings from '@/components/dashboard/DashboardSettings';

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'Investor'}</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/portfolio')}>
          Portfolio Details
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        <DashboardSettings />
      </div>
    </div>
  );
};

export default WelcomeHeader;
