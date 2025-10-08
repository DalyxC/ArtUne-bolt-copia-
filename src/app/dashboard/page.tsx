'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-artune-purple to-artune-coral bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.full_name || user.email}</CardTitle>
              <CardDescription className="capitalize">
                Role: {user.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Your ArtUne dashboard is ready. Start exploring the platform!
              </p>
            </CardContent>
          </Card>

          {user.role === 'artist' && (
            <>
              <Card className="border-artune-purple">
                <CardHeader>
                  <CardTitle className="text-artune-purple">Profile</CardTitle>
                  <CardDescription>Manage your artist profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-artune-purple text-artune-purple hover:bg-artune-purple/10"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-artune-coral">
                <CardHeader>
                  <CardTitle className="text-artune-coral">Services</CardTitle>
                  <CardDescription>Manage your services</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-artune-coral text-artune-coral hover:bg-artune-coral/10"
                  >
                    Manage Services
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === 'client' && (
            <>
              <Card className="border-artune-cyan">
                <CardHeader>
                  <CardTitle className="text-artune-cyan">Browse Artists</CardTitle>
                  <CardDescription>Find the perfect artist</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push('/artists')}
                    className="w-full bg-artune-cyan hover:bg-artune-cyan/90"
                  >
                    Explore Artists
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-artune-purple">
                <CardHeader>
                  <CardTitle className="text-artune-purple">My Bookings</CardTitle>
                  <CardDescription>View your bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-artune-purple text-artune-purple hover:bg-artune-purple/10"
                  >
                    View Bookings
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
