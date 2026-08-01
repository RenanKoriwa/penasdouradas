"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [waLink, setWaLink] = useState("#");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => { if (d.whatsapp) setWaLink(`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`); })
      .catch(() => {});
  }, []);

  const links = [
    { name: "Início", href: "/" },
    { name: "Serviços", href: "/servicos" },
    { name: "A Editora", href: "/sobre" },
  ];

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled ? "bg-[#050505]/95 backdrop-blur-md py-3 border-accent/20 shadow-xl" : "bg-gradient-to-b from-bg/90 to-transparent py-4 border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 relative flex items-center justify-between h-14">
        
        {/* DESKTOP NAV (LEFT) */}
        <nav className="hidden md:flex items-center gap-8 w-1/3">
          {links.map((l) => (
            <Link 
              key={l.name} 
              href={l.href} 
              className="text-text-secondary hover:text-accent font-serif text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-accent hover:after:w-full after:transition-all"
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* MOBILE TOGGLE (LEFT) */}
        <div className="md:hidden w-1/3 flex justify-start">
          <button className="z-50 text-accent hover:text-white transition-colors" onClick={() => setIsMobileOpen(true)}>
            <Menu size={24} strokeWidth={1} />
          </button>
        </div>

        {/* LOGO (CENTER) */}
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-50">
          <div className="relative w-10 h-10 md:w-16 md:h-16 transition-transform group-hover:scale-105">
            <Image 
              src="/images/logo-png.png" 
              alt="Penas Douradas Logo" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="flex flex-col mt-0.5 md:hidden">
            <span className="font-serif text-[10px] tracking-[0.25em] text-accent leading-none text-center">
              PENAS DOURADAS
            </span>
          </div>
        </Link>

        {/* DESKTOP CTA (RIGHT) */}
        <div className="hidden md:flex justify-end w-1/3">
          <a 
            href={waLink} 
            target="_blank" 
            rel="noreferrer" 
            className="text-accent border border-accent/40 px-5 py-2 font-serif text-[10px] lg:text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-bg hover:border-accent transition-all"
          >
            Fale Conosco
          </a>
        </div>
        
      </div>
    </header>
    
    {/* MOBILE MENU (Moved outside header to avoid backdrop-filter stacking context confinement) */}
    <div className={`fixed inset-0 bg-bg z-[60] flex flex-col items-center justify-center transition-all duration-700 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <button className="absolute top-6 left-6 text-accent" onClick={() => setIsMobileOpen(false)}>
        <X size={28} strokeWidth={1} />
      </button>
      
      <div className={`w-16 h-16 relative mb-8 transition-all duration-500 delay-100 ${isMobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <Image src="/images/logo-png.png" alt="Logo" fill className="object-contain" />
      </div>
      <span className={`font-serif text-sm tracking-[0.25em] text-accent leading-none mb-12 transition-all duration-500 delay-200 ${isMobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        PENAS DOURADAS
      </span>

      <nav className="flex flex-col items-center gap-8">
        {links.map((l, i) => (
          <Link 
            key={l.name} 
            href={l.href} 
            onClick={() => setIsMobileOpen(false)} 
            className={`text-lg font-serif uppercase tracking-[0.2em] text-text-secondary hover:text-accent transition-all duration-500 ${isMobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: isMobileOpen ? `${300 + i * 100}ms` : '0ms' }}
          >
            {l.name}
          </Link>
        ))}
        <div className={`w-8 h-px bg-accent/30 my-4 transition-all duration-500 ${isMobileOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} style={{ transitionDelay: isMobileOpen ? '600ms' : '0ms' }} />
        <a 
          href={waLink} 
          target="_blank" 
          rel="noreferrer" 
          onClick={() => setIsMobileOpen(false)} 
          className={`text-accent border border-accent px-8 py-3 font-serif text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-bg hover:scale-105 transition-all duration-500 ${isMobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isMobileOpen ? '700ms' : '0ms' }}
        >
          Fale Conosco
        </a>
      </nav>
    </div>
    </>
  );
}
