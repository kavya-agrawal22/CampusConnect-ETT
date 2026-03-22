import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/api/axiosConfig';
import { EventDto } from '@/types';
import { CalendarDays, MapPin, XCircle } from 'lucide-react';

export const MyRegisteredEvents = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await axiosInstance.get<EventDto[]>('/api/user/my-events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async (eventId: number) => {
    try {
      await axiosInstance.delete(`/api/user/events/${eventId}/unregister`);
      toast({
        title: 'Unregistered Successfully',
        description: 'You have been removed from the event.',
      });
      // Refresh the list
      fetchMyEvents();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to unregister from event',
        variant: 'destructive',
      });
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">You haven't registered for any events yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2">{event.name}</CardTitle>
              <Badge variant="secondary">{event.categoryName}</Badge>
            </div>
            <CardDescription className="line-clamp-2">{event.description}</CardDescription>
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
          </CardContent>
          <CardFooter>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleUnregister(event.id)}
              className="w-full"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Unregister
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
