'use client';

import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image 
                src="/Ailogo.png" 
                alt="AI On-Call Engineer Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg text-gray-900">AI On-Call Engineer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 px-2 py-1 rounded-full bg-gray-100">
            Beta
          </span>
        </div>
      </div>
    </nav>
  );
}

