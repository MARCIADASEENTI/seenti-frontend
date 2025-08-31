import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconesGlobais from '../globais/IconesGlobais';
import { Mail, Instagram, MessageCircle } from "lucide-react";

const FaleComTerapeuta = () => {
  const navigate = useNavigate();
  const [hubData, setHubData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dados mockados para teste (futuramente virão da API MongoDB)
  const mockHubData = {
    slug: "hub-geral",
    titulo: "Hub Seenti - Centro de Terapia",
    ativo: true,
    ordem_dobras: ["hero", "catalogo", "conteudo_cientifico", "canais"],
    hero: {
      titulo: "Seenti",
      subtitulo: "Cuidando da sua saúde com excelência e dedicação",
      descricao: "Estamos prontos para oferecer tratamentos humanizados e eficazes para suas necessidades específicas.",
      imagem: "/assets/seenti-design/logo-seenti.png",
      cta: "Agendar Consulta"
    },
    catalogo: [
      {
        id: 1,
        titulo: "✨ Top Corpus",
        descricao: "Massagem corporal exclusiva para remodelar e promover bem-estar integral.",
        duracao: "60 min",
        preco: "R$ 100,00",
        beneficios: ["Auxilia na tonificação", "Melhora da circulação", "Redução de edemas", "Sensação de leveza no corpo"]
      },
      {
        id: 2,
        titulo: "✨ Top Face",
        descricao: "Massagem facial para revitalizar, drenar e relaxar a expressão, trazendo frescor imediato.",
        duracao: "45 min",
        preco: "R$ 100,00",
        beneficios: ["Reduz inchaço e olheiras", "Suaviza linhas de expressão", "Melhora a circulação", "Devolve viço à pele"]
      },
      {
        id: 3,
        titulo: "✨ Top Relax",
        descricao: "Massagem relaxante para aliviar tensões, reduzir estresse e restaurar energia.",
        duracao: "50 min",
        preco: "R$ 100,00",
        beneficios: ["Relaxa corpo e mente", "Reduz ansiedade", "Melhora a qualidade do sono", "Proporciona bem-estar profundo"]
      }
    ],
    conteudo_cientifico: [
      {
        id: 1,
        titulo: "Benefícios da Terapia Manual na Saúde",
        resumo: "Estudos comprovam a eficácia da terapia manual no tratamento de dores crônicas e melhora da qualidade de vida.",
        categoria: "Saúde e Bem-estar",
        data: "2025-08-26"
      },
      {
        id: 2,
        titulo: "Prevenção de Lesões no Esporte",
        resumo: "Como a fisioterapia preventiva pode reduzir significativamente o risco de lesões em atletas amadores e profissionais.",
        categoria: "Esporte e Reabilitação",
        data: "2025-08-25"
      }
    ],
    canais: [
      {
        tipo: "whatsapp",
        valor: "+55 11 99999-9999",
        label: "WhatsApp",
        destaque: true
      },
      {
        tipo: "telefone",
        valor: "+55 11 3333-3333",
        label: "Telefone"
      },
      {
        tipo: "email",
        valor: "contato@seenti.com.br",
        label: "E-mail"
      },
      {
        tipo: "endereco",
        valor: "Rua das Flores, 123 - São Paulo/SP",
        label: "Endereço"
      },
      {
        tipo: "horario",
        valor: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
        label: "Horário de Atendimento"
      }
    ],
    redes_sociais: [
      {
        tipo: "instagram",
        url: "https://instagram.com/seenti_terapia",
        label: "Instagram",
        cor: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        tipo: "facebook",
        url: "https://facebook.com/seenti.terapia",
        label: "Facebook",
        cor: "bg-blue-600"
      },
      {
        tipo: "pinterest",
        url: "https://pinterest.com/seenti_terapia",
        label: "Pinterest",
        cor: "bg-red-600"
      },
      {
        tipo: "linkedin",
        url: "https://linkedin.com/company/seenti-terapia",
        label: "LinkedIn",
        cor: "bg-blue-700"
      }
    ]
  };

  useEffect(() => {
    // Simulando carregamento da API
    setTimeout(() => {
      setHubData(mockHubData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAgendarConsulta = () => {
    navigate('/agendamentos');
  };

  const handleWhatsApp = () => {
    const telefone = mockHubData.canais.find(c => c.tipo === 'whatsapp')?.valor;
    if (telefone) {
      const mensagem = "Olá! Gostaria de agendar uma consulta no Centro de Terapia Seenti.";
      const url = `https://wa.me/${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center seenti-bg-gradient">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 seenti-border-primary mx-auto mb-4"></div>
          <p className="seenti-text-primary text-lg">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!hubData) {
    return (
      <div className="min-h-screen flex items-center justify-center seenti-bg-gradient">
        <div className="text-center">
          <p className="seenti-text-primary text-lg">Erro ao carregar informações</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen seenti-bg-white">
      {/* ✅ NOVO: Header com ícones na mesma linha */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* ✅ Ícone de casa (Voltar ao Perfil) */}
            <button
              onClick={() => navigate('/perfil')}
              className="text-seenti-primary p-2 rounded-lg hover:bg-seenti-primary/10 transition-all duration-200 flex items-center space-x-2"
              title="Voltar ao Perfil"
              style={{ flexShrink: 0, border: 'none', background: 'transparent' }}
            >
              <span className="text-xl">🏠</span>
            </button>
            
            {/* ✅ Ícones globais na mesma linha */}
            <div className="flex-shrink-0" style={{ flexShrink: 0 }}>
              <IconesGlobais 
                posicao="direita" 
                tamanho="normal" 
                mostrarBadge={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Destaques de Contato - NOVO TOPO DA PÁGINA */}
      <section className="py-10 text-center seenti-bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cliente-destaque text-2xl mb-6 seenti-text-primary">Entre em Contato</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5531999999999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 text-white text-2xl shadow-md hover:scale-110 transition-transform"
            >
              <MessageCircle size={28} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/seuperfil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 text-white text-2xl shadow-md hover:scale-110 transition-transform"
            >
              <Instagram size={28} />
            </a>

            {/* E-mail */}
            <a
              href="mailto:seuemail@exemplo.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="E-mail"
              className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl shadow-md hover:scale-110 transition-transform"
            >
              <Mail size={28} />
            </a>
          </div>
        </div>
      </section>

      {/* Catálogo Section */}
      <section className="py-16 px-4 seenti-bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cliente-destaque text-center mb-12 seenti-text-primary">
            Nossos Protocolos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hubData.catalogo.map((protocolo) => (
              <div key={protocolo.id} className="seenti-card hover:seenti-hover-shadow-lg transition-all duration-300">
                <div className="p-6">
                  <h3 className="font-cta text-xl mb-3 seenti-text-primary">
                    {protocolo.titulo}
                  </h3>
                  <p className="font-info-secundaria seenti-text-secondary mb-4">
                    {protocolo.descricao}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-cta seenti-text-primary">
                      {protocolo.duracao}
                    </span>
                    <span className="font-cta seenti-text-success text-lg">
                      {protocolo.preco}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-cta seenti-text-primary mb-2">Benefícios:</h4>
                    <ul className="space-y-1">
                      {protocolo.beneficios.map((beneficio, index) => (
                        <li key={index} className="flex items-center font-info-secundaria seenti-text-secondary">
                          <span className="seenti-text-success mr-2">✓</span>
                          {beneficio}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo Científico Section */}
      <section className="py-16 px-4 seenti-bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cliente-destaque text-center mb-12 seenti-text-primary">
            Conteúdo Científico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hubData.conteudo_cientifico.map((artigo) => (
              <div key={artigo.id} className="seenti-card hover:seenti-hover-shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cta seenti-bg-primary/10 seenti-text-primary px-3 py-1 rounded-full text-sm">
                      {artigo.categoria}
                    </span>
                    <span className="font-info-secundaria seenti-text-secondary text-sm">
                      {new Date(artigo.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h3 className="font-cta text-xl mb-3 seenti-text-primary">
                    {artigo.titulo}
                  </h3>
                  <p className="font-info-secundaria seenti-text-secondary">
                    {artigo.resumo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canais Section */}
      <section className="py-16 px-4 seenti-bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cliente-destaque text-center mb-12 seenti-text-primary">
            Entre em Contato
          </h2>
          
          {/* Informações de contato em container único e compacto */}
          <div className="seenti-card p-6">
            <div className="space-y-3">
              {/* Telefone e Email na mesma linha */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <span className="font-cta seenti-text-primary">Telefone:</span>
                    <span className="font-info-secundaria ml-2 seenti-text-secondary">+55 11 3333-3333</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <span className="font-cta seenti-text-primary">E-mail:</span>
                    <span className="font-info-secundaria ml-2 seenti-text-secondary">contato@seenti.com.br</span>
                  </div>
                </div>
              </div>

              {/* Endereço e Horário na mesma linha */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-xl mt-1">📍</span>
                  <div>
                    <span className="font-cta seenti-text-primary">Endereço:</span>
                    <span className="font-info-secundaria ml-2 seenti-text-secondary">Rua das Flores, 123 - São Paulo/SP</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-xl mt-1">🕒</span>
                  <div>
                    <span className="font-cta seenti-text-primary">Horário:</span>
                    <span className="font-info-secundaria ml-2 seenti-text-secondary">Seg-Sex: 8h-18h | Sáb: 8h-12h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsApp}
          className="seenti-bg-success text-white p-4 rounded-full hover:seenti-hover-bg-success-dark transition-all duration-300 seenti-shadow-lg hover:scale-110 transform"
          title="Fale conosco no WhatsApp"
        >
          <div className="text-3xl">📱</div>
        </button>
      </div>
    </div>
  );
};

export default FaleComTerapeuta;
