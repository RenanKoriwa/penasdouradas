'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [whatsapp, setWhatsapp] = useState('5511999999999');
  const [location, setLocation] = useState('São Paulo, SP');

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => {
        if (d.whatsapp) setWhatsapp(d.whatsapp.replace(/\D/g, ''));
        if (d.location) setLocation(d.location);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#050505] py-10 px-6 mt-auto border-t border-accent/20">
      <div className="max-w-5xl mx-auto">
        
        {/* Top row: Logo + Nav + Contacts */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
          
          {/* Logo + Slogan */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105 duration-500">
              <Image src="/images/logo-png.png" alt="Penas Douradas Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm tracking-[0.2em] text-accent leading-none gold-foil">
                PENAS DOURADAS
              </span>
              <span className="font-serif text-[9px] tracking-[0.3em] text-accent-muted mt-1 leading-none">
                EDITORA
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-serif text-[10px] tracking-[0.2em] text-text-secondary uppercase">
            <Link href="/servicos" className="hover:text-accent transition-colors">Serviços</Link>
            <Link href="/sobre" className="hover:text-accent transition-colors">A Editora</Link>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
          </nav>

          {/* Contact links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-[10px] tracking-widest text-text-muted font-light">
            <a href="mailto:livrosdourados230@gmail.com" className="hover:text-accent transition-colors">livrosdourados230@gmail.com</a>
            <a href="https://instagram.com/livrosdourados8" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">@livrosdourados8</a>
          </div>
        </div>

        {/* Divider */}
        <div className="gold-line mb-5" />
        
        {/* Bottom row: Slogan + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-serif italic text-text-secondary/50 text-xs">
            "Com a nossa pena, sua pena torna-se história."
          </p>
          <div className="flex items-center gap-4 text-text-muted/40 text-[9px] tracking-widest uppercase">
            <span>{location}</span>
            <span>&copy; {new Date().getFullYear()} Penas Douradas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

