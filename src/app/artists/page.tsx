'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ArtistProfile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setArtists(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-artune-purple via-artune-coral to-artune-cyan bg-clip-text text-transparent">
            Discover Artists
          </h1>
          <p className="text-xl text-gray-300">
            Find the perfect artist for your event
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading artists...</div>
        ) : artists.length === 0 ? (
          <div className="text-center text-gray-400">
            <p className="mb-4">No artists found yet.</p>
            <p className="text-sm">Be the first to join as an artist!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.id}`}>
                <Card className="h-full transition-all hover:border-artune-purple hover:shadow-lg hover:shadow-artune-purple/20 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {artist.display_name}
                          {artist.verified && (
                            <span className="ml-2 text-artune-cyan text-sm">✓</span>
                          )}
                        </CardTitle>
                        {artist.location && (
                          <CardDescription className="text-gray-400">
                            {artist.location}
                          </CardDescription>
                        )}
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs ${
                          artist.availability_status === 'available'
                            ? 'bg-green-500/20 text-green-400'
                            : artist.availability_status === 'busy'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {artist.availability_status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {artist.bio && (
                      <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                        {artist.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                      {artist.years_experience && (
                        <span className="text-artune-cyan">
                          {artist.years_experience} yrs exp
                        </span>
                      )}
                      {artist.hourly_rate && (
                        <span className="text-artune-coral">
                          ${artist.hourly_rate}/hr
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
