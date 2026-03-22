import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/api/axiosConfig';
import { EventDto, OrderResponse, RazorpayResponse } from '@/types';
import { CalendarDays, MapPin, Users, DollarSign, Building, ArrowLeft } from 'lucide-react';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axiosInstance.get<EventDto>(`/api/public/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (response: RazorpayResponse) => {
    try {
      await axiosInstance.post('/api/payment/verify', {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
      
      toast({
        title: 'Registration Confirmed!',
        description: 'Your payment was successful and you are now registered for this event.',
      });
      
      fetchEvent();
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      toast({
        title: 'Payment Verification Failed',
        description: error.response?.data?.message || 'Please contact support if amount was deducted.',
        variant: 'destructive',
      });
    }
  };

  const openRazorpayCheckout = (orderId: string) => {
    if (!event || !user) return;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: event.registrationPrice * 100,
      currency: 'INR',
      name: 'Campus Connect',
      description: `Registration for ${event.name}`,
      order_id: orderId,
      handler: (response: RazorpayResponse) => {
        verifyPayment(response);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.mobileNumber,
      },
      theme: {
        color: '#7c3aed',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!event) return;

    setIsRegistering(true);
    try {
      const response = await axiosInstance.post<OrderResponse>(`/api/user/events/${id}/register`);
      const { orderId } = response.data;

      if (event.registrationPrice > 0 && orderId) {
        openRazorpayCheckout(orderId);
      } else {
        toast({
          title: 'Registration Successful!',
          description: 'You have been registered for this event.',
        });
        fetchEvent();
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Failed to register for event',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const spotsRemaining = event.maxAttendees - event.registeredAttendeesCount;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={event.posterUrl || '/placeholder.svg'}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl">{event.name}</CardTitle>
                    <CardDescription className="text-base">
                      Organized by {event.organizingClub}
                    </CardDescription>
                  </div>
                  <Badge className="text-sm">{event.categoryName}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(event.dateTime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Venue</p>
                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Organizing Club</p>
                    <p className="text-sm text-muted-foreground">{event.organizingClub}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm text-muted-foreground">
                      {spotsRemaining} / {event.maxAttendees} spots remaining
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Registration Fee</p>
                    <p className="text-sm text-muted-foreground">
                      {event.registrationPrice > 0 ? `₹${event.registrationPrice}` : 'Free'}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isRegistering || spotsRemaining === 0}
                  className="w-full"
                  size="lg"
                >
                  {isRegistering
                    ? 'Processing...'
                    : spotsRemaining === 0
                    ? 'Event Full'
                    : isAuthenticated
                    ? event.registrationPrice > 0
                      ? `Pay ₹${event.registrationPrice} & Register`
                      : 'Register for Event'
                    : 'Login to Register'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}