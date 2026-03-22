import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bell, Shield, Zap, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-campus.jpg';

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Registration',
      description: 'Register for events with just a few clicks. No hassle, no paperwork.',
    },
    {
      icon: Bell,
      title: 'Event Updates',
      description: 'Get real-time notifications about upcoming events and important changes.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with fellow students and build your campus network.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with industry-standard security measures.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Final Year Student',
      content: 'Campus Connect made it so easy to discover and attend events. I never miss out on anything now!',
    },
    {
      name: 'Rahul Verma',
      role: 'Event Organizer',
      content: 'Managing events has never been simpler. The platform is intuitive and powerful.',
    },
    {
      name: 'Ananya Patel',
      role: 'Club President',
      content: 'Our club events get much better attendance now. Campus Connect is a game-changer!',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Campus Connect - Students collaborating" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Welcome to Campus Connect
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Your ultimate platform for discovering, organizing, and joining college events. 
              Stay connected with your campus community like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Button asChild size="lg" variant="hero">
                <Link to="/events">
                  <Zap className="mr-2 h-5 w-5" />
                  Browse Events
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">About Campus Connect</h2>
            <p className="text-lg text-muted-foreground">
              Campus Connect is designed to bridge the gap between event organizers and attendees. 
              Whether you're looking to attend workshops, cultural events, or tech talks, 
              we've got you covered. Our platform makes event discovery and registration seamless, 
              helping you make the most of your college experience.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Campus Connect?</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to stay connected with your campus
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-lg text-muted-foreground">
              Hear from our community members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-accent fill-accent" />
                    <Heart className="h-4 w-4 text-accent fill-accent" />
                    <Heart className="h-3 w-3 text-accent fill-accent" />
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students already using Campus Connect to enhance their college experience.
            </p>
            <Button asChild size="lg" variant="hero">
              <Link to="/register">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
