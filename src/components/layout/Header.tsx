import { ThemeToggle } from '@/components/ui/theme-toggle';

// Komponen Header minimalis hanya dengan judul dan ThemeToggle
export function Header() {
  return (
    <header className="w-full transition-all duration-300">
      <div className="flex items-center justify-between h-14 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 px-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          QuantaPress
        </h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;