// src/layouts/PerfilClienteLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import { useTheme } from '../hooks/useTheme';
import { getVersionInfo } from '../config/version';
import './PerfilClienteLayout.css';
import api from '../services/api';

export default function PerfilClienteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, isDarkMode } = useTheme();

  // ✅ NOVO: Estado para notificações não lidas
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);

  // Debug: verificar se o layout está sendo renderizado
  useEffect(() => {
    console.log('🔍 PerfilClienteLayout renderizado');
    console.log('📍 Rota atual:', location.pathname);
    console.log('🏷️ Marca detectada:', brand);
    console.log('🖼️ Logo path:', brand?.logo);
    console.log('🎨 Cor primária:', brand?.primaryColor);
    console.log('🎨 Cor secundária:', brand?.secondaryColor);
    
    // Verificar se o usuário está autenticado
    const usuario_id = localStorage.getItem('usuario_id');
    const cliente_id = localStorage.getItem('cliente_id');
    
    console.log('🔍 PerfilClienteLayout: Dados de autenticação:', {
      usuario_id,
      cliente_id
    });
    
    if (!usuario_id || !cliente_id) {
      console.log('❌ PerfilClienteLayout: Usuário não autenticado, redirecionando para login');
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
    console.log('🚪 Iniciando logout...');
    console.log('💾 localStorage antes da limpeza:', {
      usuario_id: localStorage.getItem('usuario_id'),
      cliente_id: localStorage.getItem('cliente_id'),
      cadastro_email: localStorage.getItem('cadastro_email'),
      cadastro_tipo: localStorage.getItem('cadastro_tipo'),
      login_method: localStorage.getItem('login_method'),
      google_token: localStorage.getItem('google_token') ? 'EXISTE' : 'NÃO EXISTE',
      termos_aceitos: localStorage.getItem('termos_aceitos'),
      cliente_cadastrado: localStorage.getItem('cliente_cadastrado')
    });
    
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
      console.log(`🧹 Removido: ${key}`);
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
        console.log(`🧹 Removido extra: ${key}`);
      }
    });
    
    console.log('🧹 LIMPEZA COMPLETA realizada!');
    console.log('💾 localStorage após limpeza:', {
      totalKeys: Object.keys(localStorage).length,
      remainingKeys: Object.keys(localStorage)
    });
    
    console.log('🔄 Redirecionando para login...');
    
    // ✅ REDIRECIONAMENTO SEGURO: Forçar navegação para login
    navigate('/login', { replace: true });
    
    // ✅ FORÇAR RECARREGAMENTO: Garantir que não há dados residuais
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  // ✅ MELHORADO: Toggle do sidebar com melhor funcionalidade
  const toggleSidebar = () => {
    console.log('🍔 Toggle sidebar:', !sidebarOpen);
    console.log('📱 Tamanho da tela:', window.innerWidth);
    console.log('📱 É mobile?', window.innerWidth <= 768);
    setSidebarOpen(!sidebarOpen);
  };

  // ✅ NOVO: Fechar sidebar ao navegar
  const handleNavigation = (path) => {
    console.log('🧭 Navegando para:', path);
    setSidebarOpen(false); // ✅ Fechar sidebar ao navegar
    navigate(path);
  };

  // ✅ NOVO: Fechar sidebar ao clicar fora
  const handleOverlayClick = () => {
    console.log('🖱️ Clicou fora do sidebar, fechando...');
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
        console.log('🔔 Notificações não lidas carregadas:', totalNaoLidas);
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
    console.log('📱 Estado do sidebar:', {
      sidebarOpen,
      windowWidth: window.innerWidth,
      isMobile: window.innerWidth <= 768
    });
    
    // ✅ NOVO: Debug dos estilos aplicados
    if (window.innerWidth <= 768) {
      console.log('🎨 Estilos mobile aplicados:', getSidebarStyle());
      console.log('🎨 Header mobile aplicado:', getHeaderMobileStyle());
    }
  }, [sidebarOpen]);

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
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // ✅ FORÇAR estilos mobile - sobrescrever WhiteLabel
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
        visibility: 'visible !important'
      };
    }
    
    // ✅ Estilos desktop
    return {
      width: '16rem',
      background: `linear-gradient(135deg, ${brand?.primaryColor || '#1E3A8A'} 0%, ${brand?.secondaryColor || '#AC80DD'} 100%)`,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      borderRightColor: brand?.secondaryColor || '#AC80DD'
    };
  };

  // ✅ NOVO: Estilos inline para header mobile
  const getHeaderMobileStyle = () => {
    const isMobile = window.innerWidth <= 768;
    
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
        zIndex: 100,
        // ✅ FORÇAR sobrescrever qualquer CSS do WhiteLabel
        transform: 'none !important',
        opacity: '1 !important',
        visibility: 'visible !important'
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
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
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

      {/* Sidebar mobile e overlay */}
      {sidebarOpen && (
        <>
          {/* Overlay para fechar sidebar mobile */}
          <div 
            className="perfil-mobile-overlay open"
            onClick={handleOverlayClick}
          />
          
          {/* Sidebar mobile */}
          <div className="perfil-mobile-sidebar open" style={sidebarStyle}>
            {/* Header mobile */}
            <div className="perfil-sidebar-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="perfil-sidebar-logo" style={logoStyle}>
                    {brand?.name ? brand.name.charAt(0) : 'S'}
                  </div>
                  <span className="font-semibold text-white">{brand?.name || 'Seenti'}</span>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-white hover:text-white opacity-80"
                  aria-label="Fechar menu"
                >
                  <span className="text-xl">❌</span>
                </button>
              </div>
            </div>

            {/* Menu mobile */}
            <nav className="perfil-sidebar-nav">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
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
                      
                      {/* ✅ NOVO: Badge de notificações não lidas (mobile) */}
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

            {/* Footer mobile */}
            <div className="perfil-sidebar-footer">
              <button
                onClick={handleLogout}
                className="perfil-logout-button"
              >
                <span className="perfil-menu-icon">🚪</span>
                <span>Sair</span>
              </button>
              
              {/* ✅ NOVO: Copyright discreto na sidebar mobile */}
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
          </div>
        </>
      )}

      {/* Conteúdo principal */}
      <div className="perfil-main-content">
        {/* Header mobile com botão de menu - ✅ MOVIDO para área do cliente */}
        <header className="perfil-mobile-header" style={getHeaderMobileStyle()}>
          <div className="flex items-center justify-between">
            {/* ✅ NOVO: Ícone hamburguer na área do cliente */}
            <button
              onClick={toggleSidebar}
              className="perfil-mobile-menu-button"
              aria-label="Abrir menu"
            >
              <span className="text-xl">☰</span>
            </button>
            
            {/* ✅ NOVO: Logo e nome da marca centralizados */}
            <div className="flex items-center space-x-3">
              <img 
                src={brand?.logo || '/logo.png'} 
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
            
            {/* ✅ NOVO: Espaçador para centralizar */}
            <div className="w-10"></div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="perfil-content">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
}
