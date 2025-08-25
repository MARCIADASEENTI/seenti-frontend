import { useState, useEffect } from 'react';

// Hook para gerenciar tema do usuário
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('claro');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Aplicar tema apenas ao conteúdo específico (não ao documento inteiro)
  const applyTheme = (theme) => {
    if (theme === 'escuro') {
      setIsDarkMode(true);
      setCurrentTheme('escuro');
    } else if (theme === 'claro') {
      setIsDarkMode(false);
      setCurrentTheme('claro');
    } else if (theme === 'auto') {
      // Detectar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDarkMode(true);
        setCurrentTheme('escuro');
      } else {
        setIsDarkMode(false);
        setCurrentTheme('claro');
      }
    }
    
    // Salvar no localStorage para persistência
    localStorage.setItem('user-theme', theme);
    
    console.log('🎨 Tema aplicado (local):', theme, 'Dark mode:', isDarkMode);
  };

  // Inicializar tema
  useEffect(() => {
    // Verificar se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('user-theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // Usar tema padrão
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
