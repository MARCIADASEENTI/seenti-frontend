// src/whiteLabel/hooks/useSeentiTheme.js
// Hook personalizado para facilitar o uso do tema oficial da Seenti

import { useMemo } from 'react';
import { brand } from '../config/brandConfig';

export const useSeentiTheme = () => {
  const theme = useMemo(() => {
    // 🎨 TEMA OFICIAL DA SEENTI
    const seentiTheme = {
      // 🎨 CORES PRINCIPAIS DA LOGO
      colors: {
        primary: '#1E3A8A',      // Azul principal da logo
        secondary: '#AC80DD',     // Lilás/Roxo da logo
        accent: '#FF6600',        // Laranja de destaque
        
        // 🌈 CORES DE ESTADO
        success: '#10B981',       // Verde
        warning: '#F59E0B',       // Amarelo
        error: '#EF4444',         // Vermelho
        info: '#3B82F6',          // Azul info
        
        // ⚪ CORES NEUTRAS
        white: '#FFFFFF',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      
      // 🔤 TIPOGRAFIA OFICIAL
      typography: {
        fontFamily: {
          primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          secondary: 'Georgia, serif',
          mono: 'JetBrains Mono, Consolas, Monaco, monospace'
        },
        
        fontSize: {
          xs: '0.75rem',      // 12px
          sm: '0.875rem',     // 14px
          base: '1rem',       // 16px
          lg: '1.125rem',     // 18px
          xl: '1.25rem',      // 20px
          '2xl': '1.5rem',    // 24px
          '3xl': '1.875rem',  // 30px
          '4xl': '2.25rem',   // 36px
          '5xl': '3rem',      // 48px
          '6xl': '3.75rem'    // 60px
        },
        
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800
        }
      },
      
      // 📱 BREAKPOINTS RESPONSIVOS
      breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      
      // 🎭 COMPONENTES OFICIAIS
      components: {
        button: {
          borderRadius: '0.5rem',
          padding: {
            sm: '0.5rem 1rem',
            md: '0.75rem 1.5rem',
            lg: '1rem 2rem'
          },
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out'
        },
        
        card: {
          borderRadius: '1rem',
          padding: '1.5rem',
          shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        },
        
        input: {
          borderRadius: '0.5rem',
          border: '2px solid',
          padding: '0.75rem 1rem',
          transition: 'border-color 0.2s ease-in-out'
        }
      },
      
      // 🌟 ANIMAÇÕES OFICIAIS
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        
        easing: {
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    };

    return seentiTheme;
  }, []);

  // 🎨 FUNÇÕES UTILITÁRIAS
  const getColor = (colorName) => {
    return theme.colors[colorName] || theme.colors.primary;
  };

  const getFontSize = (size) => {
    return theme.typography.fontSize[size] || theme.typography.fontSize.base;
  };

  const getBreakpoint = (breakpoint) => {
    return theme.breakpoints[breakpoint] || theme.breakpoints.md;
  };

  // 🎭 FUNÇÕES DE COMPONENTES
  const getButtonStyle = (variant = 'primary', size = 'md') => {
    const baseStyle = {
      borderRadius: theme.components.button.borderRadius,
      padding: theme.components.button.padding[size],
      boxShadow: theme.components.button.shadow,
      transition: theme.components.button.transition,
      fontWeight: theme.typography.fontWeight.semibold,
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none'
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
          color: theme.colors.white
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
          color: theme.colors.white
        };
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.accent,
          color: theme.colors.white
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.success,
          color: theme.colors.white
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.warning,
          color: theme.colors.white
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.error,
          color: theme.colors.white
        };
      default:
        return baseStyle;
    }
  };

  const getCardStyle = () => {
    return {
      backgroundColor: theme.colors.white,
      borderRadius: theme.components.card.borderRadius,
      padding: theme.components.card.padding,
      boxShadow: theme.components.card.shadow,
      border: theme.components.card.border
    };
  };

  const getInputStyle = (state = 'default') => {
    const baseStyle = {
      borderRadius: theme.components.input.borderRadius,
      padding: theme.components.input.padding,
      border: `2px solid ${theme.colors.gray[300]}`,
      transition: theme.components.input.transition,
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.base
    };

    switch (state) {
      case 'focus':
        return {
          ...baseStyle,
          borderColor: theme.colors.primary,
          outline: 'none',
          boxShadow: `0 0 0 3px ${theme.colors.primary}20`
        };
      case 'error':
        return {
          ...baseStyle,
          borderColor: theme.colors.error
        };
      case 'success':
        return {
          ...baseStyle,
          borderColor: theme.colors.success
        };
      default:
        return baseStyle;
    }
  };

  return {
    theme,
    getColor,
    getFontSize,
    getBreakpoint,
    getButtonStyle,
    getCardStyle,
    getInputStyle,
    
    // 🎨 ACESSO DIRETO AOS VALORES
    colors: theme.colors,
    typography: theme.typography,
    breakpoints: theme.breakpoints,
    components: theme.components,
    animations: theme.animations
  };
};


