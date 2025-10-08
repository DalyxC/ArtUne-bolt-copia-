'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<'artist' | 'client' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp } = useAuth();

  const handleRoleSelect = (selectedRole: 'artist' | 'client') => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, role);

    if (error) {
      setError(error.message || 'Failed to create account');
      setLoading(false);
      return;
    }

    if (role === 'artist') {
      router.push('/onboarding/artist');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {step === 'role' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-artune-purple to-artune-coral bg-clip-text text-transparent">
                Join ArtUne
              </h1>
              <p className="text-gray-400">Choose how you want to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="cursor-pointer transition-all hover:border-artune-purple hover:shadow-lg hover:shadow-artune-purple/20"
                onClick={() => handleRoleSelect('artist')}
              >
                <CardHeader>
                  <CardTitle className="text-artune-purple">I'm an Artist</CardTitle>
                  <CardDescription className="text-gray-400">
                    Showcase your talent and get hired for gigs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center">
                      <span className="text-artune-cyan mr-2">✓</span>
                      Create a stunning profile
                    </li>
                    <li className="flex items-center">
                      <span className="text-artune-cyan mr-2">✓</span>
                      Set your own rates
                    </li>
                    <li className="flex items-center">
                      <span className="text-artune-cyan mr-2">✓</span>
                      Connect with clients
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-artune-coral hover:shadow-lg hover:shadow-artune-coral/20"
                onClick={() => handleRoleSelect('client')}
              >
                <CardHeader>
                  <CardTitle className="text-artune-coral">I'm a Client</CardTitle>
                  <CardDescription className="text-gray-400">
                    Find and hire talented artists for your events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center">
                      <span className="text-artune-cyan mr-2">✓</span>
                      Browse verified artists
                    </li>
                    <li className="flex items-center">
                      <span className="text-artune-cyan mr-2">✓</span>
                      Secure payments
                    </li>
                    <li className="flex items-center">
                      <span className="text-artune-cyan mr-2">✓</span>
                      Easy booking process
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-artune-purple hover:text-artune-purple/80">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Create your {role === 'artist' ? 'Artist' : 'Client'} Account
              </CardTitle>
              <CardDescription>
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
                    onClick={() => {
                      setStep('role');
                      setRole(null);
                      setError('');
                    }}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-artune-coral hover:bg-artune-coral/90"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
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
