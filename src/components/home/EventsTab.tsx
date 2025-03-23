
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventProps {
  id: number;
  title: string;
  company: string;
  date: Date;
  type: string;
}

interface EventsTabProps {
  events: EventProps[];
}

const EventsTab: React.FC<EventsTabProps> = ({ events }) => {
  // Double the events array for demo purposes
  const displayEvents = [...events, ...events.map((event, index) => ({...event, id: event.id + 100 + index}))];
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event, index) => (
            <Card key={`${event.id}-${index}`} className="overflow-hidden">
              <div className="bg-primary/10 p-4 flex items-center">
                <div className="bg-background rounded-lg p-3 mr-4 text-center min-w-16">
                  <span className="text-xl font-bold block">
                    {event.date.getDate()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {event.date.toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div>
                  <Badge>{event.type}</Badge>
                  <h4 className="font-medium mt-1">{event.title}</h4>
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{event.company}</p>
                <p className="text-sm mt-2">
                  {event.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  Add to Calendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsTab;
