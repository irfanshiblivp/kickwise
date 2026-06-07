
"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    const initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!theme) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-pop">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggle}
        className="rounded-full w-14 h-14 bg-background/80 backdrop-blur-md shadow-2xl border-primary/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95 group"
      >
        {theme === 'light' ? (
          <Moon className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
        ) : (
          <Sun className="h-6 w-6 text-primary transition-transform group-hover:rotate-45" />
        )}
      </Button>
    </div>
  );
}
