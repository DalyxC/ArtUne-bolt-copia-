'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const STEPS = [
  { step: 1, title: 'Basic Information', completed: false },
  { step: 2, title: 'Professional Details', completed: false },
  { step: 3, title: 'Services', completed: false },
];

export default function ArtistOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'artist') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: existingProfile } = await supabase
        .from('artist_profiles')
        .select('id')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (existingProfile) {
        const { error } = await supabase
          .from('artist_profiles')
          .update({
            display_name: displayName,
            location,
          } as any)
          .eq('user_id', user!.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('artist_profiles')
          .insert({
            user_id: user!.id,
            display_name: displayName,
            location,
          } as any);

        if (error) throw error;
      }

      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase
        .from('artist_profiles')
        .update({
          bio,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        } as any)
        .eq('user_id', user!.id);

      if (error) throw error;

      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: artistProfile } = await supabase
        .from('artist_profiles')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (!artistProfile) throw new Error('Artist profile not found');

      const { error } = await supabase
        .from('artist_services')
        .insert({
          artist_id: artistProfile.id,
          category: serviceCategory,
          title: serviceTitle,
          price: servicePrice ? parseFloat(servicePrice) : null,
          price_type: 'fixed',
        } as any);

      if (error) throw error;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal px-4 py-16">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-artune-purple to-artune-coral bg-clip-text text-transparent">
            Complete Your Artist Profile
          </h1>
          <p className="text-gray-400">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step) => (
              <div key={step.step} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.step
                        ? 'bg-artune-purple text-white'
                        : 'bg-artune-dark-gray text-gray-400'
                    }`}
                  >
                    {step.step}
                  </div>
                  {step.step < STEPS.length && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.step ? 'bg-artune-purple' : 'bg-artune-dark-gray'
                      }`}
                    />
                  )}
                </div>
                <p className="text-xs mt-2 text-gray-400">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    placeholder="Your artist name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-artune-coral hover:bg-artune-coral/90"
                >
                  {loading ? 'Saving...' : 'Next'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Share your experience and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell clients about your experience and style..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="75.00"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-artune-coral hover:bg-artune-coral/90"
                  >
                    {loading ? 'Saving...' : 'Next'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Your First Service</CardTitle>
              <CardDescription>What services do you offer?</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceCategory">Category *</Label>
                  <Input
                    id="serviceCategory"
                    placeholder="e.g., Live Performance, Studio Recording"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceTitle">Service Title *</Label>
                  <Input
                    id="serviceTitle"
                    placeholder="e.g., Wedding Performance"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servicePrice">Price ($)</Label>
                  <Input
                    id="servicePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500.00"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-artune-coral hover:bg-artune-coral/90"
                  >
                    {loading ? 'Completing...' : 'Complete Setup'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
