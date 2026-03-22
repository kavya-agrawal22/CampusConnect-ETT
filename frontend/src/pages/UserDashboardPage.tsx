import { useAuth } from '@/context/AuthContext';
import { MyRegisteredEvents } from '@/components/user/MyRegisteredEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, User, Search } from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your event registrations and explore new opportunities
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Browse Events</CardTitle>
              <CardDescription>Discover upcoming campus events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/events">Explore Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>My Events</CardTitle>
              <CardDescription>View your registered events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => {
                document.getElementById('my-events')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                View Below
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>View and manage your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My Registered Events Section */}
        <div id="my-events" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">My Registered Events</h2>
          <MyRegisteredEvents />
        </div>
      </div>
    </div>
  );
}
