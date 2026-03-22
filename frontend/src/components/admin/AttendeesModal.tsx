import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosInstance from '@/api/axiosConfig';
import { UserDto } from '@/types';
import { Users } from 'lucide-react';

interface AttendeesModalProps {
  eventId: number | null;
  eventName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AttendeesModal = ({ eventId, eventName, open, onOpenChange }: AttendeesModalProps) => {
  const [attendees, setAttendees] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && eventId) {
      fetchAttendees();
    }
  }, [open, eventId]);

  const fetchAttendees = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<UserDto[]>(`/api/admin/events/${eventId}/attendees`);
      setAttendees(response.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Registered Attendees
          </DialogTitle>
          <DialogDescription>
            {eventName} - Total Registrations: {attendees.length}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : attendees.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No attendees registered yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.department}</TableCell>
                  <TableCell>Year {attendee.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};
