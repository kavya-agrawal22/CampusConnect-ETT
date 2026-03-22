import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { EventDto } from '@/types';

interface EventCardProps {
  event: EventDto;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const spotsRemaining = event.maxAttendees - event.registeredAttendeesCount;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={event.posterUrl || '/placeholder.svg'}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <Badge className="shrink-0">{event.categoryName}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{formatDateTime(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{spotsRemaining} spots remaining</span>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">
            {event.registrationPrice > 0 ? `₹${event.registrationPrice}` : 'Free'}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
