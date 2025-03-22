
import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertItem {
  id: string;
  msg: string;
  alertType: 'success' | 'error' | 'warning' | 'info' | 'danger';
}

const AlertComponent = () => {
  const alerts = useSelector((state: any) => state.alert);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      {alerts.map((alert: AlertItem) => {
        let icon;
        let variant: 'default' | 'destructive' = 'default';
        
        switch (alert.alertType) {
          case 'success':
            icon = <CheckCircle className="h-4 w-4" />;
            break;
          case 'danger':
          case 'error':
            icon = <AlertCircle className="h-4 w-4" />;
            variant = 'destructive';
            break;
          default:
            icon = <Info className="h-4 w-4" />;
        }
        
        return (
          <Alert key={alert.id} variant={variant}>
            <div className="flex items-center gap-2">
              {icon}
              <span>{alert.msg}</span>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};

export default AlertComponent;
