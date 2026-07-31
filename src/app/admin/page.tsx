"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Importa o ReactQuill dinamicamente apenas no client-side para evitar erro de SSR
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p className="text-white/50">Carregando editor...</p> });

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  content: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [config, setConfig] = useState({
    whatsapp: "",
    location: "",
    about: "",
    password: "",
    services: [] as Service[]
  });

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error("API Error:", data.error);
        } else {
          const services = (data.services || []).map((s: any) => ({
            ...s,
            content: s.content || "",
          }));
          setConfig({ ...data, services });
        }
      })
      .catch(err => {
        console.error("Failed to fetch config:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert("Senha incorreta");
      }
    } catch (e) {
      alert("Erro ao validar senha");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": password
        },
        body: JSON.stringify(config),
      });
      if (res.ok) alert("Alterações salvas com sucesso!");
      else alert("Erro ao salvar. Verifique se a sessão expirou.");
    } catch (e) {
      alert("Erro de rede ao salvar.");
    }
    setSaving(false);
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: "Novo Serviço",
      description: "",
      features: ["", "", ""],
      content: ""
    };
    setConfig({ ...config, services: [...config.services, newService] });
  };

  const removeService = (index: number) => {
    if(confirm("Tem certeza que deseja remover este serviço?")) {
      const newServices = [...config.services];
      newServices.splice(index, 1);
      setConfig({ ...config, services: newServices });
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  }), []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg text-accent font-serif tracking-widest">Carregando painel...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <form onSubmit={handleLogin} className="bg-surface p-10 border border-white/10 flex flex-col gap-6 w-full max-w-md shadow-2xl">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-accent mb-2">Penas Douradas</h1>
            <p className="text-text-secondary text-sm">Painel Administrativo</p>
          </div>
          <input
            type="password"
            placeholder="Senha"
            className="w-full bg-bg border border-white/20 p-3 text-white outline-none focus:border-accent transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-accent text-bg font-bold py-3 uppercase tracking-widest text-sm hover:bg-white transition-colors">
            Acessar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <h1 className="font-serif text-3xl text-white">Painel <span className="text-accent italic">Admin</span></h1>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-accent text-bg font-bold py-2 px-6 uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </header>

        <div className="space-y-12">
          {/* Informações Gerais */}
          <section className="bg-surface p-8 border border-white/5 rounded-sm">
            <h2 className="text-accent font-serif text-xl mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-accent"></span> Informações Gerais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary text-sm mb-2">Número do WhatsApp</label>
                <input 
                  type="text" 
                  className="w-full bg-bg border border-white/20 p-3 text-white outline-none focus:border-accent transition-colors"
                  value={config.whatsapp}
                  onChange={(e) => setConfig({...config, whatsapp: e.target.value})}
                  placeholder="Ex: 5511999999999"
                />
                <p className="text-xs text-text-muted mt-1">Apenas números, inclua DDI (55) e DDD.</p>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Localização</label>
                <input 
                  type="text" 
                  className="w-full bg-bg border border-white/20 p-3 text-white outline-none focus:border-accent transition-colors"
                  value={config.location}
                  onChange={(e) => setConfig({...config, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Senha do Administrador</label>
                <input 
                  type="text" 
                  className="w-full bg-bg border border-white/20 p-3 text-white outline-none focus:border-accent transition-colors placeholder:text-white/30"
                  value={config.password}
                  onChange={(e) => setConfig({...config, password: e.target.value})}
                  placeholder="Deixe em branco para manter a atual"
                />
              </div>
            </div>
          </section>

          {/* Sobre a Editora */}
          <section className="bg-surface p-8 border border-white/5 rounded-sm">
            <h2 className="text-accent font-serif text-xl mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-accent"></span> Sobre a Editora
            </h2>
            <div>
              <label className="block text-text-secondary text-sm mb-2">Texto da página 'A Editora'</label>
              <div className="bg-bg border border-white/20 text-white quill-dark-theme rounded-sm overflow-hidden">
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={config.about}
                  onChange={(content) => setConfig({...config, about: content})}
                  className="min-h-[250px]"
                />
              </div>
            </div>
          </section>

          {/* Serviços */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-accent font-serif text-xl flex items-center gap-2">
                <span className="w-6 h-px bg-accent"></span> Editar Serviços
              </h2>
              <button 
                onClick={addService}
                className="border border-accent text-accent px-4 py-2 text-xs uppercase tracking-widest hover:bg-accent hover:text-bg transition-colors"
              >
                + Adicionar Serviço
              </button>
            </div>
            
            <div className="space-y-8">
              {config.services.map((service, index) => (
                <div key={service.id} className="bg-surface p-8 border border-white/5 rounded-sm relative group">
                  <button 
                    onClick={() => removeService(index)}
                    className="absolute top-8 right-8 text-white/40 hover:text-red-400 text-sm tracking-widest uppercase transition-colors"
                  >
                    Remover
                  </button>
                  <h3 className="text-white mb-6 font-serif text-lg">Serviço 0{index + 1}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Título do Serviço</label>
                      <input 
                        type="text" 
                        className="w-full bg-bg border border-white/20 p-3 text-white outline-none focus:border-accent transition-colors"
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...config.services];
                          newServices[index].title = e.target.value;
                          setConfig({...config, services: newServices});
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Descrição Curta (Resumo no Card)</label>
                      <textarea 
                        className="w-full bg-bg border border-white/20 p-3 text-white outline-none focus:border-accent transition-colors h-20 resize-none"
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...config.services];
                          newServices[index].description = e.target.value;
                          setConfig({...config, services: newServices});
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Tópicos (Três principais benefícios)</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {service.features.map((feature, fIndex) => (
                          <input 
                            key={fIndex}
                            type="text" 
                            className="w-full bg-bg border border-white/20 p-2 text-white outline-none focus:border-accent text-sm transition-colors"
                            value={feature}
                            onChange={(e) => {
                              const newServices = [...config.services];
                              newServices[index].features[fIndex] = e.target.value;
                              setConfig({...config, services: newServices});
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Texto Completo da Página Interna</label>
                      <div className="bg-bg border border-white/20 text-white quill-dark-theme rounded-sm overflow-hidden">
                        <ReactQuill 
                          theme="snow"
                          modules={quillModules}
                          value={service.content}
                          onChange={(content) => {
                            const newServices = [...config.services];
                            newServices[index].content = content;
                            setConfig({...config, services: newServices});
                          }}
                          className="min-h-[250px]"
                        />
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
              
              {config.services.length === 0 && (
                <div className="text-center text-text-muted py-12 border border-white/5 border-dashed">
                  Nenhum serviço cadastrado. Adicione um para começar.
                </div>
              )}
            </div>
          </section>
        </div>

      </div>
      
      {/* Estilos customizados para o Quill ficar no tema Dark/Old Money */}
      <style jsx global>{`
        .quill-dark-theme .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
          background: rgba(255,255,255,0.02);
        }
        .quill-dark-theme .ql-container {
          border: none !important;
          font-family: var(--font-inter), sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: #d4d4d4;
          min-height: 250px;
        }
        .quill-dark-theme .ql-editor {
          min-height: 250px;
        }
        .quill-dark-theme .ql-stroke {
          stroke: #cba358 !important;
        }
        .quill-dark-theme .ql-fill {
          fill: #cba358 !important;
        }
        .quill-dark-theme .ql-picker {
          color: #cba358 !important;
        }
        .quill-dark-theme .ql-picker-options {
          background-color: #1a1a1a !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .quill-dark-theme .ql-editor p {
          margin-bottom: 1em;
        }
        .quill-dark-theme .ql-editor h2, .quill-dark-theme .ql-editor h3 {
          font-family: var(--font-cinzel), serif;
          color: #cba358;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
}
