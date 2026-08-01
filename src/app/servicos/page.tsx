'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PenIcon from '@/components/ui/icons/PenIcon';

gsap.registerPlugin(ScrollTrigger);

interface Genre {
  id: string;
  title: string;
  items: string[];
}

export default function ServicosPage() {
  const [whatsapp, setWhatsapp] = useState('5511999999999');
  const [optionalPrice, setOptionalPrice] = useState('300,00');
  const [genres, setGenres] = useState<Genre[]>([
    { id: 'literatura', title: 'Literatura', items: ['Romances', 'Poesia', 'Contos infantis'] },
    { id: 'conhecimento', title: 'Conhecimento', items: ['Livros técnicos', '(aprendizagem de línguas, literatura etc)'] },
    { id: 'espiritualidade', title: 'Espiritualidade', items: ['Espiritualidade cristã'] }
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => {
        if (d.whatsapp) setWhatsapp(d.whatsapp);
        if (d.optionalServicesPrice) {
          const price = String(d.optionalServicesPrice).replace(',', '.');
          setOptionalPrice(Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
        }
        if (d.genres && Array.isArray(d.genres)) {
          setGenres(d.genres);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
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
  }, []);

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
            Serviços
          </h1>
          <p className="text-text-secondary text-sm md:text-base font-light anim-header">
            Oferecemos soluções editoriais completas para transformar seu manuscrito em uma obra pronta para publicação.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full gold-line" />
      </header>

      {/* ═══ SERVICES CONTENT ═══ */}
      <section className="container mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-16 anim-card">
            <h2 className="font-serif text-xl sm:text-2xl text-accent mb-6 uppercase tracking-wider sm:tracking-widest">Para as obras selecionadas, disponibilizamos:</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group hover:border-accent/30 transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors" />
                <h3 className="font-serif text-xl text-white mb-2">Revisão de texto grátis</h3>
                <p className="text-text-secondary text-sm font-light">Correção ortográfica, gramatical e estilística realizada por profissionais qualificados.</p>
              </div>
              <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group hover:border-accent/30 transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors" />
                <h3 className="font-serif text-xl text-white mb-2">Tradução grátis</h3>
                <p className="text-text-secondary text-sm font-light">Serviços de tradução para ampliar o alcance nacional e internacional de sua obra.</p>
              </div>
              <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group hover:border-accent/30 transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors" />
                <h3 className="font-serif text-xl text-white mb-2">Impressão</h3>
                <p className="text-text-secondary text-sm font-light">Impressão sob responsabilidade da editora. Produção gráfica com excelente padrão de qualidade.</p>
              </div>
              <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group hover:border-accent/30 transition-all flex items-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors" />
                <h3 className="font-serif text-xl text-accent mb-0">Apoio editorial garantido</h3>
              </div>
            </div>
          </div>

          <div className="mb-24 anim-card bg-surface/50 border border-white/5 p-8 relative">
            <h2 className="font-serif text-lg sm:text-xl text-accent mb-4 uppercase tracking-wider sm:tracking-widest">Caso o autor deseje, também realizamos:</h2>
            <ul className="list-none space-y-3 mb-6 text-text-secondary text-sm font-light">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-accent rotate-45" /> criação da capa;</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-accent rotate-45" /> diagramação profissional;</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-accent rotate-45" /> registros autorais.</li>
            </ul>
            <p className="text-sm font-light text-white italic">Cada um desses serviços possui o investimento de <strong className="text-accent not-italic">R$ {optionalPrice}</strong>, quando executado pela editora.</p>
          </div>

          {/* ═══ MODELO HÍBRIDO ═══ */}
          <div className="mb-24 anim-card">
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-6 uppercase tracking-wider sm:tracking-widest text-center border-b border-accent/20 pb-6">Nosso Modelo de Publicação</h2>
            <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12 font-light">
              A PENAS DOURADAS – Editora adota um conceito moderno de publicação híbrida. Nesse modelo, o autor pode participar diretamente da produção do livro, reduzindo custos e mantendo maior controle sobre sua obra.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent/40 text-accent uppercase text-xs tracking-widest">
                    <th className="py-4 px-5">Etapa</th>
                    <th className="py-4 px-5 text-center">Autor</th>
                    <th className="py-4 px-5 text-center">Editora</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-text-secondary">
                  <tr className="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                    <td className="py-4 px-5 text-white">Concepção da capa</td>
                    <td className="py-4 px-5 text-center"><span className="text-accent text-lg font-sans">✓</span></td>
                    <td className="py-4 px-5 text-center text-text-muted text-xs">Opcional</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                    <td className="py-4 px-5 text-white">Diagramação</td>
                    <td className="py-4 px-5 text-center"><span className="text-accent text-lg font-sans">✓</span></td>
                    <td className="py-4 px-5 text-center text-text-muted text-xs">Opcional</td>
                  </tr>
                  <tr className="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                    <td className="py-4 px-5 text-white">Registros autorais</td>
                    <td className="py-4 px-5 text-center"><span className="text-accent text-lg font-sans">✓</span></td>
                    <td className="py-4 px-5 text-center text-text-muted text-xs">Opcional</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                    <td className="py-4 px-5 text-white">Revisão do texto</td>
                    <td className="py-4 px-5 text-center"></td>
                    <td className="py-4 px-5 text-center"><span className="text-accent text-lg font-sans">✓</span></td>
                  </tr>
                  <tr className="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                    <td className="py-4 px-5 text-white">Tradução</td>
                    <td className="py-4 px-5 text-center"></td>
                    <td className="py-4 px-5 text-center"><span className="text-accent text-lg font-sans">✓</span></td>
                  </tr>
                  <tr className="border-b border-accent/10 hover:bg-white/[0.05] transition-colors">
                    <td className="py-4 px-5 text-white">Impressão</td>
                    <td className="py-4 px-5 text-center"></td>
                    <td className="py-4 px-5 text-center"><span className="text-accent text-lg font-sans">✓</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-secondary mt-4 font-light text-center">
              * Caso o autor prefira, a editora poderá executar também a criação da capa, a diagramação e os registros autorais.
            </p>
          </div>

          {/* ═══ GÊNEROS EDITORIAIS ═══ */}
          <div className="anim-card text-center mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-10 uppercase tracking-wider sm:tracking-widest border-b border-accent/20 pb-6">Gêneros Editoriais</h2>
            <p className="text-text-secondary mb-12 font-light">Publicamos obras nas seguintes categorias:</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {genres.map((genre) => (
                <div key={genre.id} className="bg-surface border border-white/5 p-8 flex flex-col items-center h-full">
                  <h3 className="font-serif text-xl text-accent mb-6">{genre.title}</h3>
                  <ul className="text-sm text-text-secondary font-light space-y-3 text-center mt-6">
                    {genre.items.map((item, idx) => (
                      <li key={idx} className={item.startsWith('(') ? 'text-xs opacity-70' : ''}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="container mx-auto px-6 lg:px-12 anim-card">
        <div className="bg-surface border border-accent/10 p-8 md:p-12 text-center rounded-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-accent rounded-full pointer-events-none" />
          <h2 className="font-serif text-2xl md:text-3xl mb-3 tracking-wide relative z-10">Inicie sua Jornada</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-lg mx-auto font-light relative z-10">
            Fale conosco diretamente pelo WhatsApp para submeter seu projeto literário.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-block text-accent border border-accent px-10 py-3 font-serif text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-bg hover:scale-105 transition-all duration-500"
          >
            Falar com a Equipe
          </a>
        </div>
      </section>

    </div>
  );
}
