import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        titulo: "Terapia Manual",
        descricao: "Técnicas manuais para alívio de dores e tensões musculares",
        duracao: "60 min",
        preco: "R$ 120,00",
        beneficios: ["Alívio imediato", "Melhora da mobilidade", "Redução do estresse"]
      },
      {
        id: 2,
        titulo: "Fisioterapia Esportiva",
        descricao: "Reabilitação e prevenção de lesões esportivas",
        duracao: "45 min",
        preco: "R$ 100,00",
        beneficios: ["Recuperação rápida", "Prevenção de lesões", "Melhora do desempenho"]
      },
      {
        id: 3,
        titulo: "Pilates Terapêutico",
        descricao: "Exercícios para fortalecimento e reeducação postural",
        duracao: "50 min",
        preco: "R$ 90,00",
        beneficios: ["Fortalecimento muscular", "Correção postural", "Bem-estar geral"]
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
        valor: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
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

  const handleRedeSocial = (url) => {
    window.open(url, '_blank');
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
      {/* ✅ NOVO: Botão Voltar ao Perfil */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/perfil')}
            className="seenti-btn-secondary px-4 py-2 rounded-lg hover:seenti-hover-bg-secondary-dark transition-all duration-200 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Voltar ao Perfil</span>
          </button>
        </div>
      </div>
      
      {/* Título da Página */}
      <div className="py-8 px-4 seenti-bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 seenti-text-primary">
            {hubData.hero.titulo}
          </h1>
          <p className="text-lg text-center mb-8 max-w-3xl mx-auto seenti-text-secondary">
            {hubData.hero.descricao}
          </p>
          <div className="text-center">
            <button 
              onClick={handleAgendarConsulta}
              className="seenti-btn-primary text-lg px-8 py-4 hover:seenti-hover-bg-primary-dark transition-all duration-300 seenti-shadow-lg"
            >
              {hubData.hero.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Catálogo Section */}
      <section className="py-16 px-4 seenti-bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 seenti-text-primary">
            Nossos Protocolos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hubData.catalogo.map((protocolo) => (
              <div key={protocolo.id} className="seenti-card hover:seenti-hover-shadow-lg transition-all duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 seenti-text-primary">
                    {protocolo.titulo}
                  </h3>
                  <p className="seenti-text-secondary mb-4">
                    {protocolo.descricao}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="seenti-text-primary font-semibold">
                      {protocolo.duracao}
                    </span>
                    <span className="seenti-text-success font-bold text-lg">
                      {protocolo.preco}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold seenti-text-primary mb-2">Benefícios:</h4>
                    <ul className="space-y-1">
                      {protocolo.beneficios.map((beneficio, index) => (
                        <li key={index} className="flex items-center seenti-text-secondary">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 seenti-text-primary">
            Conteúdo Científico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hubData.conteudo_cientifico.map((artigo) => (
              <div key={artigo.id} className="seenti-card hover:seenti-hover-shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="seenti-bg-primary/10 seenti-text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {artigo.categoria}
                    </span>
                    <span className="seenti-text-secondary text-sm">
                      {new Date(artigo.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 seenti-text-primary">
                    {artigo.titulo}
                  </h3>
                  <p className="seenti-text-secondary">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 seenti-text-primary">
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
                    <span className="font-medium seenti-text-primary">Telefone:</span>
                    <span className="ml-2 seenti-text-secondary">+55 11 3333-3333</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <span className="font-medium seenti-text-primary">E-mail:</span>
                    <span className="ml-2 seenti-text-secondary">contato@seenti.com.br</span>
                  </div>
                </div>
              </div>

              {/* Endereço e Horário na mesma linha */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-xl mt-1">📍</span>
                  <div>
                    <span className="font-medium seenti-text-primary">Endereço:</span>
                    <span className="ml-2 seenti-text-secondary">Rua das Flores, 123 - São Paulo/SP</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-xl mt-1">🕒</span>
                  <div>
                    <span className="font-medium seenti-text-primary">Horário:</span>
                    <span className="ml-2 seenti-text-secondary">Seg-Sex: 8h-18h | Sáb: 8h-12h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociais Section */}
      <section className="py-16 px-4 seenti-bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 seenti-text-primary">
            Siga-nos nas Redes Sociais
          </h2>
          
          <div className="flex justify-center space-x-6">
            {hubData.redes_sociais.map((rede) => (
              <button
                key={rede.tipo}
                onClick={() => handleRedeSocial(rede.url)}
                className={`${rede.cor} text-white p-4 rounded-full hover:opacity-90 transition-all duration-300 seenti-shadow-lg hover:scale-110 transform`}
                title={`Siga-nos no ${rede.label}`}
              >
                <div className="text-2xl">
                  {rede.tipo === 'instagram' && '📸'}
                  {rede.tipo === 'facebook' && '📘'}
                  {rede.tipo === 'pinterest' && '📌'}
                  {rede.tipo === 'linkedin' && '💼'}
                </div>
              </button>
            ))}
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
