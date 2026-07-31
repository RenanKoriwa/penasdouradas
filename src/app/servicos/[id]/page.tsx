"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PenIcon from '@/components/ui/icons/PenIcon';
import Image from 'next/image';

export default function ServiceDetail() {
  const params = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        const found = (data.services || []).find((s: any) => s.id === params.id);
        if (found) {
          setService(found);
        }
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (!loading && service) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.anim-header', 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
        );
        gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
          gsap.fromTo(el, 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
          );
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, service]);

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-accent font-serif tracking-widest">Carregando...</div>;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-white">
        <h1 className="font-serif text-3xl text-accent mb-4">Serviço não encontrado</h1>
        <Link href="/servicos" className="border border-accent text-accent px-6 py-2 text-xs uppercase tracking-widest hover:bg-accent hover:text-bg transition-colors">Voltar para Serviços</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-bg text-text-primary pb-16">
      {/* ═══ HEADER ═══ */}
      <header className="pt-32 pb-24 md:pt-48 md:pb-32 text-center border-b border-white/5 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <Image
            src="/images/WhatsApp Image 2026-07-31 at 08.52.00.jpeg"
            alt="Fundo"
            fill
            className="object-cover object-center grayscale"
            priority
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] glow-accent rounded-full pointer-events-none" />
        
        <div className="container relative mx-auto px-6 max-w-3xl z-10">
          <Link href="/servicos" className="inline-flex items-center gap-2 text-accent/60 text-[10px] uppercase tracking-widest mb-8 hover:text-accent transition-colors anim-header">
            ← Voltar para Serviços
          </Link>
          <div className="flex justify-center mb-4 text-accent anim-header">
            <PenIcon className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-widest mb-6 anim-header gold-foil">
            {service.title}
          </h1>
          <p className="text-text-secondary text-sm md:text-base font-light anim-header">
            {service.description}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full gold-line" />
      </header>

      {/* ═══ FEATURES ═══ */}
      {service.features && service.features.some((f: string) => f.trim() !== '') && (
        <section className="py-12 bg-bg relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-up">
              {service.features.map((feat: string, i: number) => feat && (
                <div key={i} className="bg-surface/50 p-6 text-center border border-white/5 rounded-sm">
                  <span className="block text-accent font-serif mb-2 text-xl">0{i+1}</span>
                  <span className="text-text-secondary text-xs uppercase tracking-widest">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTENT ═══ */}
      {service.content && (
        <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl reveal-up">
            <div 
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: service.content }} 
            />
          </div>
        </section>
      )}

    </div>
  );
}
