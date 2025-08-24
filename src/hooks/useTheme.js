import { useState, useEffect } from 'react';

// Hook para gerenciar tema do usuário
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('claro');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Aplicar tema globalmente
  const applyTheme = (theme) => {
    console.log('🎨 applyTheme chamado com:', theme);
    
    if (theme === 'escuro') {
      setIsDarkMode(true);
      setCurrentTheme('escuro');
      // Aplicar classes CSS para tema escuro
      document.documentElement.classList.add('theme-escuro');
      document.documentElement.classList.remove('theme-claro');
      console.log('🎨 Classes CSS aplicadas: theme-escuro adicionado, theme-claro removido');
    } else if (theme === 'claro') {
      setIsDarkMode(false);
      setCurrentTheme('claro');
      // Aplicar classes CSS para tema claro
      document.documentElement.classList.add('theme-claro');
      document.documentElement.classList.remove('theme-escuro');
      console.log('🎨 Classes CSS aplicadas: theme-claro adicionado, theme-escuro removido');
    } else if (theme === 'auto') {
      // Detectar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDarkMode(true);
        setCurrentTheme('escuro');
        document.documentElement.classList.add('theme-escuro');
        document.documentElement.classList.remove('theme-claro');
        console.log('🎨 Tema auto detectado: escuro (preferência do sistema)');
      } else {
        setIsDarkMode(false);
        setCurrentTheme('claro');
        document.documentElement.classList.add('theme-claro');
        document.documentElement.classList.remove('theme-escuro');
        console.log('🎨 Tema auto detectado: claro (preferência do sistema)');
      }
    }
    
    // Salvar no localStorage para persistência
    localStorage.setItem('user-theme', theme);
    console.log('💾 Tema salvo no localStorage:', theme);
    
    // Verificar se as classes foram aplicadas
    const hasEscuro = document.documentElement.classList.contains('theme-escuro');
    const hasClaro = document.documentElement.classList.contains('theme-claro');
    console.log('🔍 Verificação das classes CSS:', { hasEscuro, hasClaro });
    
    console.log('🎨 Tema aplicado (local):', theme, 'Dark mode:', isDarkMode);
  };

  // Inicializar tema
  useEffect(() => {
    // Verificar se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('user-theme');
    if (savedTheme) {
      console.log('🎨 Tema carregado do localStorage:', savedTheme);
      applyTheme(savedTheme);
    } else {
      // Usar tema padrão
      console.log('🎨 Usando tema padrão: claro');
      applyTheme('claro');
    }
  }, []);

  // Listener para mudanças de preferência do sistema (tema auto)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  return {
    currentTheme,
    isDarkMode,
    applyTheme,
    toggleTheme: () => applyTheme(isDarkMode ? 'claro' : 'escuro')
  };
};
