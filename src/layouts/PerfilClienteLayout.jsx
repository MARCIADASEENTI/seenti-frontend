// src/layouts/PerfilClienteLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import { useTheme } from '../hooks/useTheme';
import { getVersionInfo } from '../config/version';
import './PerfilClienteLayout.css';
import api from '../services/api';
import IconesGlobais from '../components/globais/IconesGlobais';

export default function PerfilClienteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, isDarkMode } = useTheme();

  // ✅ NOVO: Estado para notificações não lidas
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ MELHORADO: Detecção de mobile mais robusta
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      console.log('📱 Detecção mobile:', mobile, 'Largura:', window.innerWidth);
    };

    // Verificar imediatamente
    checkMobile();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debug: verificar se o layout está sendo renderizado
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const usuario_id = localStorage.getItem('usuario_id');
    const cliente_id = localStorage.getItem('cliente_id');
    
    if (!usuario_id || !cliente_id) {
      navigate('/login');
      return;
    }
  }, [location.pathname, navigate]);

  const menuItems = [
    {
      label: 'Meu Perfil',
      icon: '👤',
      path: '/perfil',
      description: 'Dados pessoais e informações'
    },
    {
      label: 'Agendamentos',
      icon: '📅',
      path: '/agendamentos',
      description: 'Minhas consultas agendadas'
    },
    {
      label: 'Anamnese',
      icon: '📋',
      path: '/anamnese',
      description: 'Histórico de saúde'
    },
    {
      label: 'Histórico',
      icon: '📊',
      path: '/historico',
      description: 'Sessões realizadas'
    },
    {
      label: 'Notificações',
      icon: '🔔',
      path: '/notificacoes',
      description: 'Minhas notificações'
    },
    {
      label: 'Configurações',
      icon: '⚙️',
      path: '/configuracoes',
      description: 'Preferências da conta'
    },
    {
      label: 'Fale Com Terapeuta',
      icon: '💬',
      path: '/fale-com-terapeuta',
      description: 'Informações e contatos'
    }
  ];

  const handleLogout = () => {
    // ✅ LIMPEZA COMPLETA: Todos os dados de autenticação e sessão
    const keysToRemove = [
      'usuario_id',
      'cliente_id', 
      'cadastro_email',
      'cadastro_tipo',
      'google_token',
      'google_token_expiry',
      'login_method',
      'termos_aceitos',
      'cliente_cadastrado',
      'auth_token',
      'refresh_token',
      'user_session',
      'cliente_session',
      'perfil_completo',
      'anamnese_completa',
      'agendamentos_ativos'
    ];
    
    // Limpar cada chave do localStorage
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // ✅ LIMPEZA EXTRA: Verificar e remover outras chaves relacionadas
    Object.keys(localStorage).forEach(key => {
      if (key.includes('usuario') || 
          key.includes('cliente') || 
          key.includes('auth') || 
          key.includes('session') ||
          key.includes('token') ||
          key.includes('cadastro') ||
          key.includes('termo')) {
        localStorage.removeItem(key);
      }
    });
    
    // ✅ REDIRECIONAMENTO SEGURO: Forçar navegação para login
    navigate('/login', { replace: true });
    
    // ✅ FORÇAR RECARREGAMENTO: Garantir que não há dados residuais
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  // ✅ MELHORADO: Toggle do sidebar com melhor funcionalidade
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    console.log('🎯 Toggle sidebar:', newState, 'Mobile:', isMobile);
  };

  // ✅ NOVO: Fechar sidebar ao navegar
  const handleNavigation = (path) => {
    setSidebarOpen(false); // ✅ Fechar sidebar ao navegar
    navigate(path);
  };

  // ✅ NOVO: Fechar sidebar ao clicar fora
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // ✅ NOVO: Verificar se rota está ativa
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // ✅ NOVO: Carregar notificações não lidas
  const carregarNotificacoesNaoLidas = async () => {
    try {
      const cliente_id = localStorage.getItem('cliente_id');
      if (!cliente_id) return;

      setLoadingNotificacoes(true);
      const response = await api.get(`/notificacoes/cliente/${cliente_id}`);
      
      if (response.status === 200 && response.data?.data) {
        const totalNaoLidas = response.data.data.total_nao_lidas || 0;
        setNotificacoesNaoLidas(totalNaoLidas);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar notificações:', error);
    } finally {
      setLoadingNotificacoes(false);
    }
  };

  // ✅ NOVO: Carregar notificações ao montar componente
  useEffect(() => {
    carregarNotificacoesNaoLidas();
    
    // ✅ NOVO: Atualizar notificações a cada 30 segundos
    const interval = setInterval(carregarNotificacoesNaoLidas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // ✅ NOVO: Debug do estado do sidebar
  useEffect(() => {
    // ✅ NOVO: Debug dos estilos aplicados
    if (window.innerWidth <= 768) {
      console.log('🎨 Header mobile deve ser renderizado:', isMobile);
      console.log('🎨 Estilos do header:', getHeaderMobileStyle());
    }
  }, [sidebarOpen, isMobile]);

  // ✅ REMOVIDO: useEffect duplicado que causava conflito

  // Aplicar cores do WhiteLabel - PADRONIZADO com tela de termo
  const sidebarStyle = {
    background: `linear-gradient(135deg, ${brand?.primaryColor || '#1E3A8A'} 0%, ${brand?.secondaryColor || '#AC80DD'} 100%)`,
    borderRightColor: brand?.secondaryColor || '#AC80DD'
  };

  const logoStyle = {
    background: `linear-gradient(135deg, ${brand?.primaryColor || '#1E3A8A'}, ${brand?.secondaryColor || '#AC80DD'})`
  };

        // ✅ NOVO: Estilos inline para forçar funcionalidade mobile
  const getSidebarStyle = () => {
    if (isMobile) {
      // ✅ FORÇAR estilos mobile - drawer sobrepondo conteúdo
      return {
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? '0' : '-100%',
        width: '100%',
        maxWidth: '320px',
        height: '100vh',
        background: `linear-gradient(135deg, ${brand?.primaryColor || '#1E3A8A'} 0%, ${brand?.secondaryColor || '#AC80DD'} 100%)`,
        zIndex: 1000,
        transition: 'all 0.3s ease-in-out',
        overflowY: 'auto',
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.2)',
        // ✅ FORÇAR sobrescrever qualquer CSS do WhiteLabel
        transform: 'none !important',
        opacity: '1 !important',
        visibility: 'visible !important',
        display: 'flex !important',
        flexDirection: 'column !important'
      };
    }
    
    // ✅ Desktop: retornar objeto vazio para usar CSS original
    return {};
  };



  // ✅ NOVO: Estilos inline para header mobile
  const getHeaderMobileStyle = () => {
    if (isMobile) {
      // ✅ FORÇAR header mobile - sobrescrever WhiteLabel
      return {
        display: 'flex !important',                    // ✅ FORÇAR mostrar
        backgroundColor: 'white !important',           // ✅ FORÇAR fundo branco
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1) !important',
        borderBottom: '1px solid #e5e7eb !important',
        padding: '1rem !important',
        alignItems: 'center !important',
        justifyContent: 'space-between !important',
        position: 'sticky !important',
        top: 0,
        zIndex: 1000, // ✅ AUMENTADO para garantir que fique acima de outros elementos
        width: '100% !important',
        minHeight: '4rem !important',
        // ✅ FORÇAR sobrescrever qualquer CSS do WhiteLabel
        transform: 'none !important',
        opacity: '1 !important',
        visibility: 'visible !important',
        // ✅ FORÇAR layout flexbox
        flexDirection: 'row !important',
        flexWrap: 'nowrap !important'
      };
    }
    
    // ✅ Esconder no desktop
    return {
      display: 'none !important'
    };
  };

  return (
    <div className="perfil-cliente-layout">
      {/* Sidebar para desktop */}
      <aside className="perfil-sidebar" style={getSidebarStyle()}>
        {/* Header da sidebar */}
        <div className="perfil-sidebar-header">
          <div className="flex items-center space-x-2">
            <div className="perfil-logo-container">
              <img 
                src={brand?.logo || '/assets/logo-parceirox.png'} 
                alt={`Logo ${brand?.name || 'Marcia Alves'}`}
                className="perfil-sidebar-logo"
                onLoad={() => console.log('✅ Logo carregado com sucesso:', brand?.logo)}
                onError={(e) => {
                  console.error('❌ Erro ao carregar logo:', brand?.logo, e);
                  console.log('🔄 Usando fallback logo');
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white drop-shadow-lg font-bold">{brand?.name || 'Seenti'}</h2>
            </div>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="perfil-sidebar-nav">
          <ul className="space-y-2" style={{
            listStyle: 'none',
            listStyleType: 'none',
            margin: 0,
            padding: 0
          }}>
            {menuItems.map((item) => (
              <li key={item.path} style={{
                listStyle: 'none',
                listStyleType: 'none',
                margin: 0,
                padding: 0
              }}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`perfil-menu-item ${
                    isActivePath(item.path) ? 'active' : ''
                  }`}
                >
                  <span className="perfil-menu-icon">{item.icon}</span>
                  <div className="perfil-menu-text">
                    <div className="perfil-menu-label">{item.label}</div>
                    <div className="perfil-menu-description">{item.description}</div>
                  </div>
                  
                  {/* ✅ NOVO: Badge de notificações não lidas */}
                  {item.path === '/notificacoes' && notificacoesNaoLidas > 0 && (
                    <div className="perfil-notificacao-badge">
                      <span className="perfil-notificacao-count">
                        {notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}
                      </span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer da sidebar */}
        <div className="perfil-sidebar-footer">
          <button
            onClick={handleLogout}
            className="perfil-logout-button"
          >
            <span className="perfil-menu-icon">🚪</span>
            <span>Sair</span>
          </button>
          
          {/* ✅ NOVO: Copyright discreto na sidebar */}
          <div className="perfil-copyright">
            <p className="text-xs text-white opacity-90 text-center leading-tight">
              © 2025 Seenti® - Todos os direitos reservados.
            </p>
            {/* ✅ NOVO: Versão do sistema */}
            <p className="text-xs text-white opacity-70 text-center leading-tight mt-1">
              {getVersionInfo().full}
            </p>
          </div>
        </div>
      </aside>

      {/* Drawer mobile - ISOLADO do WhiteLabel */}
      {isMobile && (
        <div id="mobile-sidebar-container" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: sidebarOpen ? 'auto' : 'none'
        }}>
          {/* Overlay para fechar drawer */}
          {sidebarOpen && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999
              }}
              onClick={toggleSidebar}
            />
          )}
          
          {/* Drawer lateral - COMPLETAMENTE ISOLADO */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: sidebarOpen ? 0 : '-100%',
            width: '280px',
            height: '100vh',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #AC80DD 100%)',
            zIndex: 10000,
            transition: 'left 0.3s ease-in-out',
            overflowY: 'auto',
            boxShadow: '4px 0 15px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
          }}>
            {/* Header do drawer */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={brand?.logo || '/assets/logo-parceirox.png'} 
                  alt={`Logo ${brand?.name || 'Seenti'}`}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    objectFit: 'contain',
                    backgroundColor: 'white',
                    padding: '0.25rem'
                  }}
                />
                <span style={{ 
                  fontWeight: '600', 
                  color: 'white',
                  fontSize: '1.125rem'
                }}>
                  {brand?.name || 'Seenti'}
                </span>
              </div>
              <button
                onClick={toggleSidebar}
                style={{
                  padding: '0.5rem',
                  color: 'white',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  opacity: 0.8
                }}
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </div>

            {/* Menu do drawer */}
            <nav style={{
              flex: 1,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {menuItems.map((item) => (
                  <li key={item.path} style={{ margin: 0, padding: 0 }}>
                    <button
                      onClick={() => {
                        handleNavigation(item.path);
                        toggleSidebar();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: isActivePath(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        color: 'white',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        fontSize: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = isActivePath(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: '500',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}>
                          {item.label}
                        </div>
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.75rem',
                          marginTop: '0.125rem'
                        }}>
                          {item.description}
                        </div>
                      </div>
                      
                      {/* Badge de notificações */}
                      {item.path === '/notificacoes' && notificacoesNaoLidas > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          minWidth: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          border: '2px solid #1e293b'
                        }}>
                          {notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer do drawer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>🚪</span>
                <span>Sair</span>
              </button>
              
              {/* Copyright */}
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  lineHeight: 1.2,
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  © 2025 Seenti® - Todos os direitos reservados.
                </p>
                <p style={{
                  margin: '0.25rem 0 0 0',
                  lineHeight: 1.2,
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {getVersionInfo().full}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="perfil-main-content">
        {/* Header mobile com botão de menu - APENAS em mobile */}
        {isMobile && (
          <header className="perfil-mobile-header" style={getHeaderMobileStyle()}>
            <div className="flex items-center justify-between">
              {/* ✅ Ícone hamburguer na área do cliente */}
              <button
                onClick={toggleSidebar}
                className="perfil-mobile-menu-button"
                aria-label="Abrir menu"
                style={{
                  padding: '0.5rem',
                  color: '#1E3A8A',
                  borderRadius: '0.375rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}
              >
                <span className="text-xl">☰</span>
              </button>
              
              {/* ✅ Logo e nome da marca centralizados */}
              <div className="flex items-center space-x-3">
                <img 
                  src={brand?.logo || '/assets/logo-parceirox.png'} 
                  alt={`Logo ${brand?.name || 'Seenti'}`}
                  className="w-6 h-6 rounded-lg object-contain bg-white p-1"
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    maxWidth: '1.5rem',
                    maxHeight: '1.5rem',
                    objectFit: 'contain'
                  }}
                />
                <span className="font-semibold text-gray-800">{brand?.name || 'Seenti'}</span>
              </div>
              
              {/* ✅ REMOVIDO: Ícones globais do header mobile (WhiteLabel) */}
              {/* ✅ Espaçador para manter layout equilibrado */}
              <div className="w-10"></div>
            </div>
          </header>
        )}

        {/* Conteúdo da página */}
        <main className="perfil-content">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 🔄 BOTTOM NAVIGATION REMOVIDO - Mantendo apenas sidebar funcional */}
      {/* ✅ Funcionalidade será implementada em sprint futura após pesquisa técnica */}
      
    </div>
  );
}
