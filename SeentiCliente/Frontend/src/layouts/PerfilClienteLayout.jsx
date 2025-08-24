// src/layouts/PerfilClienteLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import { useTheme } from '../hooks/useTheme';
import './PerfilClienteLayout.css';

export default function PerfilClienteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, isDarkMode } = useTheme();

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
      google_token: localStorage.getItem('google_token') ? 'EXISTE' : 'NÃO EXISTE'
    });
    
    // Limpar dados específicos da sessão
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('cliente_id');
    localStorage.removeItem('cadastro_email');
    localStorage.removeItem('cadastro_tipo');
    localStorage.removeItem('google_token');
    localStorage.removeItem('google_token_expiry');
    localStorage.removeItem('login_method');
    
    console.log('🧹 Dados da sessão Google OAuth limpos');
    console.log('🔄 Redirecionando para login...');
    
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Fechar sidebar mobile se estiver aberta
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Aplicar cores do WhiteLabel
  const sidebarStyle = {
    backgroundColor: brand?.primaryColor || '#1E3A8A',
    borderRightColor: brand?.secondaryColor || '#AC80DD'
  };

  const logoStyle = {
    background: `linear-gradient(135deg, ${brand?.primaryColor || '#1E3A8A'}, ${brand?.secondaryColor || '#AC80DD'})`
  };

  return (
    <div className="perfil-cliente-layout">
      {/* Sidebar para desktop */}
      <aside className="perfil-sidebar" style={sidebarStyle}>
        {/* Header da sidebar */}
        <div className="perfil-sidebar-header">
          <div className="flex items-center space-x-3">
            <img 
              src={brand?.logo || '/assets/logo-parceirox.png'} 
              alt={`Logo ${brand?.name || 'Marcia Alves'}`}
              className="w-10 h-10 rounded-lg object-contain bg-white p-1"
              style={{
                width: '3rem',
                height: '3rem',
                maxWidth: '3rem',
                maxHeight: '3rem',
                objectFit: 'contain'
              }}
              onLoad={() => console.log('✅ Logo carregado com sucesso:', brand?.logo)}
              onError={(e) => {
                console.error('❌ Erro ao carregar logo:', brand?.logo, e);
                console.log('🔄 Usando fallback logo');
              }}
            />
            <div>
              <h2 className="text-lg font-semibold text-white">{brand?.name || 'Marcia Alves'}</h2>
              <p className="text-sm text-white opacity-80">Área do Cliente</p>
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
        </div>
      </aside>

      {/* Sidebar mobile */}
      <div className={`perfil-mobile-sidebar ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className="perfil-mobile-overlay"
          onClick={toggleSidebar}
        />
        
        {/* Sidebar mobile */}
        <div className={`perfil-mobile-sidebar ${sidebarOpen ? 'open' : ''}`} style={sidebarStyle}>
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
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="perfil-main-content">
        {/* Header mobile com botão de menu */}
        <header className="perfil-mobile-header">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="perfil-mobile-menu-button"
            >
              <span className="text-xl">☰</span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src={brand?.logo || '/assets/logo-parceirox.png'} 
                alt={`Logo ${brand?.name || 'Marcia Alves'}`}
                className="w-6 h-6 rounded-lg object-contain bg-white p-1"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  maxWidth: '1.5rem',
                  maxHeight: '1.5rem',
                  objectFit: 'contain'
                }}
              />
              <span className="font-semibold text-white">{brand?.name || 'Marcia Alves'}</span>
            </div>
            <div className="w-10"></div> {/* Espaçador para centralizar */}
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
