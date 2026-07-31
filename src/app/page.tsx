'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PenIcon from '@/components/ui/icons/PenIcon';
import BookIcon from '@/components/ui/icons/BookIcon';
import Embers from '@/components/ui/Embers';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [whatsapp, setWhatsapp] = useState('5511999999999');
  const [services, setServices] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => { 
        if (d.whatsapp) setWhatsapp(d.whatsapp); 
        if (d.services) setServices(d.services.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo('.hero-anim', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
      );
      
      // Scroll reveals
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.fromTo(el, 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

// ... add to imports if missing, but we already have useState and useEffect.
  const books = [
    { src: "/images/WhatsApp Image 2026-07-31 at 08.51.06.jpeg", alt: "Capa do Livro 1" },
    { src: "/images/IMG-20260730-WA0109.jpg.jpeg", alt: "Capa do Livro 2" },
    { src: "/images/Screenshot_20260528-170823.jpg", alt: "Capa do Livro 3" },
  ];

  const [activeBook, setActiveBook] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBook((prev) => (prev + 1) % books.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getBookStyle = (index: number) => {
    if (index === activeBook) {
      return {
        wrapper: "w-56 md:w-64 shadow-[0_20px_50px_-10px_rgba(0,0,0,1)] rotate-0 translate-x-0 translate-y-0 border-accent/30 z-30 opacity-100",
        img: "grayscale-0"
      };
    }
    if (index === (activeBook + 1) % 3) {
      return {
        wrapper: "w-48 md:w-56 shadow-2xl rotate-12 translate-x-20 md:translate-x-24 -translate-y-8 border-white/5 opacity-80 z-20",
        img: "grayscale"
      };
    }
    return {
      wrapper: "w-48 md:w-56 shadow-2xl -rotate-6 -translate-x-16 md:-translate-x-20 translate-y-6 border-white/5 opacity-60 z-10",
      img: "grayscale"
    };
  };

  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;
  const waLinkBook = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o livro Produção Literária e Empreendedorismo.')}`;

  return (
    <div ref={containerRef} className="bg-bg text-text-primary">
      
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative w-full min-h-[90vh] pt-32 pb-24 md:pt-48 md:pb-32 flex items-center justify-center border-b border-white/5 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/images/WhatsApp Image 2026-07-31 at 08.51.32.jpeg"
            alt="Livros"
            fill
            className="object-cover object-center grayscale"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
        {/* Embers animated only in hero */}
        <Embers count={25} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] glow-accent rounded-full pointer-events-none" />

        {/* Floating gold dust (creative touch) */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent rounded-full opacity-50 shadow-[0_0_10px_2px_#D4AF37]" />

        <div className="container relative mx-auto px-6 lg:px-12 text-center max-w-3xl z-10">
          <div className="flex justify-center mb-4 text-accent hero-anim">
            <PenIcon className="w-10 h-10" />
          </div>
          <h1 className="hero-anim font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.2] mb-5 uppercase tracking-[0.15em] gold-foil">
            Transforme seu original em uma <br/><span className="text-white italic font-light lowercase">obra-prima</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed reveal-up mt-8 mb-10 md:mb-12">
            Editora focada em excelência literária. Do manuscrito à estante, tratamos cada livro como arte.
          </p>
          <div className="hero-anim flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="bg-accent text-bg px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
            >
              Publicar meu Livro
            </a>
            <Link
              href="/sobre"
              className="border border-accent/50 text-accent px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-accent/5 hover:border-accent transition-colors"
            >
              Conheça a Editora
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ INSTITUTIONAL ABOUT ═══ */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
            <div className="w-full md:w-5/12 reveal-up">
              {/* Elegant Book Composition */}
              <div className="relative h-[450px] md:h-[500px] w-full flex items-center justify-center">
                {books.map((book, i) => {
                  const style = getBookStyle(i);
                  return (
                    <div 
                      key={book.alt}
                      className={`absolute aspect-[2/3] border transition-all duration-1000 ease-in-out ${style.wrapper}`}
                    >
                      <Image 
                        src={book.src} 
                        alt={book.alt} 
                        fill 
                        className={`object-cover transition-all duration-1000 ease-in-out ${style.img}`} 
                      />
                      {i === activeBook && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-50 pointer-events-none transition-opacity duration-1000" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full md:w-7/12 reveal-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-accent" />
                <h2 className="font-serif text-2xl md:text-3xl text-accent uppercase tracking-wide">A Penas Douradas</h2>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Fundada com a premissa de que toda grande história começa com uma página em branco, somos focados na publicação de obras literárias de alto nível.
              </p>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 font-light">
                Não apenas imprimimos livros. Criamos universos onde o leitor sente a tensão desde a capa até a última palavra. Nossa excelência editorial garante que cada detalhe importe.
              </p>
              <Link href="/sobre" className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-bold group hover:text-white transition-colors">
                Leia nossa história
                <span className="w-6 h-px bg-accent group-hover:bg-white group-hover:w-8 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES PREVIEW ═══ */}
      <section className="py-16 md:py-20 bg-bg border-y border-white/5 relative overflow-hidden">
        {/* Subtle decorative line */}
        <div className="absolute top-0 left-0 w-full gold-line" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12 reveal-up">
            <div className="flex justify-center mb-3 text-accent/80">
              <BookIcon className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide mb-3">Nossos Serviços</h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto font-light">Oferecemos acompanhamento completo para autores que buscam excelência no mercado editorial.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.id} className="group bg-surface p-6 border-t-2 border-transparent hover:border-accent border-x border-b border-white/5 hover:shadow-[0_4px_20px_-10px_rgba(212,175,55,0.2)] transition-all rounded-sm reveal-up flex flex-col" style={{ transitionDelay: `${i * 100}ms` }}>
                <h3 className="font-serif text-lg text-accent mb-2 group-hover:text-white transition-colors">{s.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed mb-5 font-light flex-grow">
                  {s.description}
                </p>
                <Link href={`/servicos/${s.id}`} className="mt-auto text-[10px] uppercase tracking-widest text-accent font-bold group-hover:text-white transition-colors inline-block self-start">Detalhes →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LEARN TO WRITE ═══ */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
            <div className="w-full md:w-1/2 reveal-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-accent" />
                <h2 className="font-serif text-2xl md:text-3xl text-accent uppercase tracking-wide leading-tight">Produção Literária<br/> e Empreendedorismo</h2>
              </div>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 font-light">
                <strong>Da Concepção À Publicação.</strong> O guia definitivo de Alberto Kuzoma para escritores em formação, estreantes e experientes. Descubra os segredos para transformar suas ideias em obras-primas e dominar as estratégias do mercado editorial contemporâneo.
              </p>
              <a href={waLinkBook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-bold group hover:text-white transition-colors">
                Adquirir o Livro
                <span className="w-6 h-px bg-accent group-hover:bg-white group-hover:w-8 transition-all" />
              </a>
            </div>
            <div className="w-full md:w-1/2 reveal-up">
              <div className="w-full max-w-md mx-auto shadow-[0_0_40px_rgba(212,175,55,0.1)] rounded-sm overflow-hidden border border-white/5">
                <img src="/images/IMG-20260730-WA0109.jpg.jpeg" alt="Aprenda a Escrever" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL RESULT PREVIEW ═══ */}
      <section className="py-16 md:py-24 bg-bg relative border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
            <div className="w-full md:w-1/2 reveal-up md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-accent" />
                <h2 className="font-serif text-2xl md:text-3xl text-accent uppercase tracking-wide">O Resultado Final</h2>
              </div>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 font-light">
                Do projeto gráfico impecável ao acabamento físico de alto nível, sua história ganha vida com uma apresentação digna de um best-seller. Nós garantimos que o seu livro seja um objeto de desejo para os leitores.
              </p>
            </div>
            <div className="w-full md:w-1/2 reveal-up md:order-1">
              <div className="w-full max-w-md mx-auto shadow-[0_0_40px_rgba(212,175,55,0.1)] rounded-sm overflow-hidden border border-white/5 group hover:border-accent/30 transition-colors">
                <img src="/images/WhatsApp Image 2026-07-31 at 08.51.32.jpeg" alt="Como ficará seu livro" className="w-full h-auto group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-16 bg-bg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="container mx-auto px-6 text-center reveal-up relative z-10">
          <h2 className="font-serif text-2xl md:text-3xl mb-3 tracking-wide">Pronto para publicar?</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto font-light">
            Nossa equipe editorial está pronta para transformar suas ideias em livros de sucesso.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent text-bg px-8 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-white hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all rounded-sm"
          >
            Falar com a Editora
          </a>
        </div>
      </section>

    </div>
  );
}
