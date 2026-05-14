import { Outlet } from 'react-router';
import { Navigation } from './Navigation';
import { WhatsAppButton } from './WhatsAppButton';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <WhatsAppButton />
      <footer className="bg-primary text-primary-foreground py-6 text-center">
        <p>© 2026 OCTOPUS Stickers Designer. All rights reserved.</p>
      </footer>
    </div>
  );
}
