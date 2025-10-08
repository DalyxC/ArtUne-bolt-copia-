import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-artune-charcoal via-artune-dark-gray to-artune-charcoal">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-artune-purple via-artune-coral to-artune-cyan bg-clip-text text-transparent">
            ArtUne
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl">
            Connect Artists with Clients
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-xl">
            The platform for hiring talented artists for your events and gigs
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-artune-coral hover:bg-artune-coral/90 text-white px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/artists">
              <Button size="lg" variant="outline" className="border-artune-purple text-artune-purple hover:bg-artune-purple/10 px-8">
                Browse Artists
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
