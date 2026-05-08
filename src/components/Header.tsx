"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const insta = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "emily_creaciones9122";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Nombre */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="Emily Creaciones" width={40} height={40} className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-brand-pink group-hover:text-brand-wood transition-colors">
            Emily Creaciones
          </span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors">
            Inicio
          </Link>
          <Link href="/productos" className="text-gray-600 hover:text-brand-pink transition-colors">
            Productos
          </Link>
          <a
            href={`https://instagram.com/${insta}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-brand-pink transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg> Instagram
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-600 hover:text-brand-pink transition-colors"
          aria-label="Menú"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="md:hidden bg-white border-t border-pink-50 px-4 py-4 space-y-3 animate-fade-in">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block text-gray-700 hover:text-brand-pink font-medium transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            onClick={() => setOpen(false)}
            className="block text-gray-700 hover:text-brand-pink font-medium transition-colors"
          >
            Productos
          </Link>
          <a
            href={`https://instagram.com/${insta}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-700 hover:text-brand-pink font-medium transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg> Instagram
          </a>
        </nav>
      )}
    </header>
  );
}
