'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
}

import PenIcon from '@/components/ui/icons/PenIcon';
import BookIcon from '@/components/ui/icons/BookIcon';
export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [whatsapp, setWhatsapp] = useState('5511999999999');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => {
        setServices(d.services || []);
        if (d.whatsapp) setWhatsapp(d.whatsapp);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!services.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim-header', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
      );
      gsap.utils.toArray<HTMLElement>('.anim-card').forEach((el, i) => {
        gsap.fromTo(el, 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [services]);

  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;

  return (
    <div ref={containerRef} className="bg-bg text-text-primary pb-16">
      
      {/* ═══ HEADER ═══ */}
      <header className="pt-32 pb-24 md:pt-48 md:pb-32 text-center border-b border-accent/10 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <Image src="/images/WhatsApp Image 2026-07-31 at 08.51.32.jpeg" alt="Texture" fill className="object-cover grayscale" />
        </div>
        <div className="absolute -top-10 -right-10 w-96 h-96 glow-accent rounded-full pointer-events-none" />
        <div className="container relative mx-auto px-6 max-w-2xl z-10">
          <div className="flex justify-center mb-4 text-accent anim-header">
            <PenIcon className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-widest mb-4 anim-header gold-foil">
            Nossos Serviços
          </h1>
          <p className="text-text-secondary text-sm md:text-base font-light anim-header">
            Da avaliação crítica à publicação completa. Modelos desenhados para autores que buscam excelência no gênero thriller e suspense.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full gold-line" />
      </header>

      {/* ═══ SERVICES LIST ═══ */}
      <section className="container mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={s.id} className="anim-card group bg-surface border border-white/5 rounded-sm overflow-hidden flex flex-col hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(212,175,55,0.15)] relative" style={{ transitionDelay: `${i * 100}ms` }}>
              {/* Subtle top border accent */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="bg-black/10 p-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-serif text-lg text-accent tracking-wide">{s.title}</h2>
                <span className="text-white/10 font-serif text-xl font-bold group-hover:text-accent/20 transition-colors">0{i + 1}</span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-text-secondary text-xs leading-relaxed mb-6 font-light">
                  {s.description}
                </p>
                <div className="mt-auto flex flex-col">
                  {s.features && s.features.some(f => f.trim() !== '') && (
                    <>
                      <h4 className="text-[10px] uppercase tracking-widest text-accent mb-3 font-bold opacity-80">O que inclui:</h4>
                      <ul className="space-y-2.5 mb-6">
                        {s.features.filter(Boolean).map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-text-secondary font-light">
                            <span className="text-accent/60 mt-0.5 text-[10px]">◆</span>
                            <span className="leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Link href={`/servicos/${s.id}`} className="mt-auto text-[10px] uppercase tracking-widest text-accent font-bold group-hover:text-white transition-colors inline-flex items-center gap-2 self-start">
                    Detalhes
                    <span className="w-4 h-px bg-accent group-hover:bg-white group-hover:w-6 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="container mx-auto px-6 lg:px-12 anim-card">
        <div className="bg-surface border border-accent/10 p-8 md:p-12 text-center rounded-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-accent rounded-full pointer-events-none" />
          <h2 className="font-serif text-2xl md:text-3xl mb-3 tracking-wide relative z-10">Inicie sua Jornada</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-lg mx-auto font-light relative z-10">
            Fale conosco diretamente pelo WhatsApp para discutir seu projeto literário e receber um orçamento detalhado.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-block bg-accent text-bg px-8 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors rounded-sm"
          >
            Falar com a Equipe
          </a>
        </div>
      </section>

    </div>
  );
}
