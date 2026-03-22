import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/api/axiosConfig';
import { EventDto } from '@/types';
import { Edit, Trash2, Users, Plus } from 'lucide-react';
import { AttendeesModal } from './AttendeesModal';

export const EventManagementTable = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventName, setSelectedEventName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get<EventDto[]>('/api/public/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await axiosInstance.delete(`/api/admin/events/${id}`);
      toast({ title: 'Event deleted successfully' });
      fetchEvents();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  const handleViewAttendees = (event: EventDto) => {
    setSelectedEventId(event.id);
    setSelectedEventName(event.name);
    setIsModalOpen(true);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <Button onClick={() => navigate('/admin/events/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No events yet</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{formatDateTime(event.dateTime)}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.categoryName}</TableCell>
                  <TableCell>
                    {event.registeredAttendeesCount} / {event.maxAttendees}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(event.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewAttendees(event)}
                        title="View Attendees"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AttendeesModal
        eventId={selectedEventId}
        eventName={selectedEventName}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};
