import { Header } from '@/components/layout/Header';
import { SidebarWrapper } from '@/components/layout/SidebarWrapper';
import { MainContent } from '@/components/layout/MainContent';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Sidebar */}
      <SidebarWrapper />
      
      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-6 py-4">
            <Header />
          </div>
        </div>
        <div className="flex-1 px-4 md:px-6 py-6">
          <MainContent />
        </div>
      </div>
    </main>
  );
}
