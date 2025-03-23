
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventProps {
  id: number;
  title: string;
  company: string;
  date: Date;
  type: string;
}

interface UpcomingEventsCardProps {
  events: EventProps[];
  compact?: boolean;
}

const UpcomingEventsCard: React.FC<UpcomingEventsCardProps> = ({ events, compact = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
          Upcoming Events
        </CardTitle>
        <CardDescription>Important dates for your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
                <span className="text-primary font-bold text-sm">
                  {event.date.getDate()}
                </span>
                <div className="text-xs">
                  {event.date.toLocaleString('default', { month: 'short' })}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">{event.title}</h4>
                <p className="text-xs text-muted-foreground">{event.company}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        {!compact && (
          <Button variant="ghost" size="sm" className="w-full mt-4">
            View All Events
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsCard;
