'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ArtistProfile, ArtistService } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArtistProfilePage() {
  const params = useParams();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [services, setServices] = useState<ArtistService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadArtistProfile();
    }
  }, [params.id]);

  const loadArtistProfile = async () => {
    const { data: artistData } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('id', params.id as string)
      .maybeSingle();

    if (artistData) {
      const artist = artistData as ArtistProfile;
      setArtist(artist);

      const { data: servicesData } = await supabase
        .from('artist_services')
        .select('*')
        .eq('artist_id', artist.id)
        .order('created_at', { ascending: false });

      if (servicesData) {
        setServices(servicesData as ArtistService[]);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300 mb-4">Artist not found</h1>
          <Link href="/artists">
            <Button variant="outline">Back to Artists</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/artists">
            <Button variant="outline" className="mb-4">
              ← Back to Artists
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {artist.display_name}
                      {artist.verified && (
                        <span className="ml-2 text-artune-cyan text-xl">✓ Verified</span>
                      )}
                    </CardTitle>
                    {artist.location && (
                      <CardDescription className="text-lg text-gray-400">
                        📍 {artist.location}
                      </CardDescription>
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded ${
                      artist.availability_status === 'available'
                        ? 'bg-green-500/20 text-green-400'
                        : artist.availability_status === 'busy'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {artist.availability_status.charAt(0).toUpperCase() +
                      artist.availability_status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {artist.bio && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-artune-purple">About</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{artist.bio}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  {artist.years_experience !== null && (
                    <div className="bg-artune-dark-gray p-3 rounded">
                      <div className="text-sm text-gray-400">Experience</div>
                      <div className="text-lg font-semibold text-artune-cyan">
                        {artist.years_experience} years
                      </div>
                    </div>
                  )}
                  {artist.hourly_rate !== null && (
                    <div className="bg-artune-dark-gray p-3 rounded">
                      <div className="text-sm text-gray-400">Hourly Rate</div>
                      <div className="text-lg font-semibold text-artune-coral">
                        ${artist.hourly_rate}/hr
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border border-artune-dark-gray p-4 rounded-lg hover:border-artune-purple transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{service.title}</h4>
                            <p className="text-sm text-artune-cyan">{service.category}</p>
                          </div>
                          {service.price !== null && (
                            <div className="text-right">
                              <div className="text-xl font-bold text-artune-coral">
                                ${service.price}
                              </div>
                              <div className="text-xs text-gray-400 capitalize">
                                {service.price_type}
                              </div>
                            </div>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-300 mt-2">{service.description}</p>
                        )}
                        {service.duration_minutes && (
                          <p className="text-xs text-gray-400 mt-2">
                            Duration: {Math.floor(service.duration_minutes / 60)}h{' '}
                            {service.duration_minutes % 60}m
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book This Artist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-artune-coral hover:bg-artune-coral/90">
                  Send Inquiry
                </Button>
                <Button variant="outline" className="w-full border-artune-purple text-artune-purple hover:bg-artune-purple/10">
                  Save to Favorites
                </Button>
                {artist.last_active && (
                  <p className="text-xs text-gray-400 text-center pt-2">
                    Last active: {new Date(artist.last_active).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
