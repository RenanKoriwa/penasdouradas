'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PenIcon from '@/components/ui/icons/PenIcon';

gsap.registerPlugin(ScrollTrigger);

export default function Sobre() {
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.about) setAboutText(data.about);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
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
  }, [loading]);

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-accent font-serif tracking-widest">Carregando...</div>;
  }

  return (
    <div ref={containerRef} className="bg-bg text-text-primary pb-16">

      {/* ═══ HEADER ═══ */}
      <header className="pt-32 pb-24 md:pt-48 md:pb-32 text-center border-b border-white/5 bg-surface relative overflow-hidden">
        {/* Subtle Background */}
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
        
        <div className="container relative mx-auto px-6 max-w-2xl z-10">
          <div className="flex justify-center mb-4 text-accent anim-header">
            <PenIcon className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-widest mb-4 anim-header gold-foil">
            A Editora
          </h1>
          <p className="text-text-secondary text-sm md:text-base font-light anim-header max-w-xl mx-auto">
            Descubra quem somos e por que a literatura é a nossa paixão.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full gold-line" />
      </header>

      {/* ═══ STORY ═══ */}
      <section className="py-24 md:py-32 bg-bg relative">
        <div className="absolute left-0 top-20 w-px h-32 bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden md:block" />
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
            <div className="md:w-1/3 shrink-0 reveal-up">
              <h2 className="font-serif text-2xl md:text-3xl text-accent uppercase tracking-wide border-l border-accent pl-4 py-1">
                Nossa<br />História
              </h2>
            </div>
            <div className="md:w-2/3 text-text-secondary text-sm md:text-base font-light leading-relaxed reveal-up rich-text-content" dangerouslySetInnerHTML={{ __html: aboutText || "<p>A PENAS DOURADAS – Editora é uma editora sedeada no bairro Jardim São Paulo na cidade de São Paulo. Ela nasceu com o propósito de democratizar a publicação de livros, tornando o mercado editorial mais acessível aos escritores.</p><p>Nossa filosofia baseia-se na valorização do autor. Entendemos que cada obra representa anos de dedicação, pesquisa e criatividade. Por isso, buscamos estabelecer uma relação de confiança, respeito e transparência durante todo o processo editorial.</p><p>Trabalhamos também com publicação híbrida, modelo que permite ao autor participar ativamente da produção do livro, reduzindo custos e mantendo total liberdade sobre seu projeto.</p><p>Mais do que publicar livros, ajudamos autores a concretizar sonhos.</p>" }} />
          </div>
        </div>
      </section>

      {/* ═══ MISSION & VISION ═══ */}
      <section className="py-24 md:py-32 bg-surface border-t border-white/5 relative overflow-hidden">
        {/* Subtle decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-accent/20 to-transparent" />

        <div className="container mx-auto px-6 lg:px-12 max-w-4xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-up">
            {/* Missão */}
            <div className="group bg-bg p-8 border border-white/5 rounded-sm hover:border-accent/30 transition-all duration-300 hover:shadow-[0_4px_20px_-10px_rgba(212,175,55,0.1)]">
              <h3 className="font-serif text-xl text-accent uppercase mb-4 flex items-center gap-3">
                <PenIcon className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                A Missão
              </h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                Descobrir talentos literários excepcionais e lapidar seus originais até atingirem a perfeição editorial, entregando ao leitor obras que prendem do início ao fim.
              </p>
            </div>
            {/* Visão */}
            <div className="group bg-bg p-8 border border-white/5 rounded-sm hover:border-accent/30 transition-all duration-300 hover:shadow-[0_4px_20px_-10px_rgba(212,175,55,0.1)]">
              <h3 className="font-serif text-xl text-accent uppercase mb-4 flex items-center gap-3">
                <PenIcon className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                A Visão
              </h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                Tornar-se a principal referência no mercado lusófono na publicação de literatura contemporânea, com um padrão-ouro em design, qualidade gráfica e narrativa.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
