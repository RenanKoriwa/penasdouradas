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
    <footer className="bg-[#050505] py-24 px-6 mt-auto border-t border-accent/20 relative overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Image
          src="/images/WhatsApp Image 2026-07-31 at 08.51.32.jpeg"
          alt="Texture"
          fill
          className="object-cover object-center grayscale"
        />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">

        <Link href="/" className="flex flex-col items-center gap-4 group mb-12">
          <div className="relative w-24 h-24 transition-transform group-hover:scale-105 duration-700">
            <Image 
              src="/images/logo-png.png" 
              alt="Penas Douradas Logo" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-accent leading-none gold-foil">
              PENAS DOURADAS
            </span>
            <span className="font-serif text-xs md:text-sm tracking-[0.5em] text-accent-muted mt-4 leading-none">
              EDITORA
            </span>
          </div>
        </Link>

        <p className="font-serif italic text-text-secondary/70 text-sm md:text-base max-w-lg mb-10">
          "A verdadeira arte da literatura está naquilo que nos faz sentir."
        </p>

        <div className="gold-line mb-10 max-w-sm" />

        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-12 font-serif text-xs md:text-sm tracking-[0.2em] text-text-secondary uppercase">
          <Link href="/servicos" className="hover:text-accent transition-colors">Serviços</Link>
          <Link href="/sobre" className="hover:text-accent transition-colors">A Editora</Link>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            WhatsApp
          </a>
        </nav>

        <div className="flex flex-col items-center gap-2">
          <p className="text-text-muted text-[10px] tracking-widest font-light uppercase">
            {location}
          </p>
          <p className="text-text-muted/40 text-[9px] tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Penas Douradas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
