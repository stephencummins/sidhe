import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-sidhe-gold/20 bg-sidhe-deep-blue/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/The Fool.png"
              alt="The Fool"
              className="h-12 w-auto object-contain opacity-80"
            />
            <h1 className="text-xl font-serif text-sidhe-gold">Sídhe Tarot</h1>
          </div>
          <div className="flex items-center gap-4">
            <img
              src="/The Fool.png"
              alt="The Fool"
              className="h-12 w-auto object-contain opacity-80 transform scale-x-[-1]"
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="w-full border-t border-sidhe-gold/20 bg-sidhe-deep-blue/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-8">
            <img
              src="/The Fool.png"
              alt="The Fool"
              className="h-16 w-auto object-contain opacity-60"
            />
            <div className="text-center">
              <p className="text-sidhe-cream/70 text-sm">
                Journey with the wisdom of the cards
              </p>
            </div>
            <img
              src="/The Fool.png"
              alt="The Fool"
              className="h-16 w-auto object-contain opacity-60 transform scale-x-[-1]"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
