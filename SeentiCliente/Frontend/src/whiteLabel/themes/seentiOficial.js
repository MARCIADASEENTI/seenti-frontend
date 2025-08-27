// src/whiteLabel/themes/seentiOficial.js
// Tema oficial da marca Seenti com paleta de cores e configurações oficiais

export const seentiOficial = {
  name: 'Seenti',
  tagline: 'Terapia Integrativa',
  logo: '/assets/seenti-design/logo-seenti-oficial.png',
  favicon: '/assets/seenti-design/favicon-seenti-oficial.ico',
  
  // 🎨 PALETA DE CORES OFICIAL
  colors: {
    // Cores Principais
    primary: '#1E3A8A',      // Azul principal
    secondary: '#AC80DD',     // Roxo/lilás
    accent: '#FF6600',        // Laranja de destaque
    
    // Cores de Estado
    success: '#10B981',       // Verde
    warning: '#F59E0B',       // Amarelo
    error: '#EF4444',         // Vermelho
    info: '#3B82F6',          // Azul info
    
    // Cores Neutras
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
    },
    
    // Cores de Fundo
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      accent: '#FEF3C7'
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
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
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
  },
  
  // 🔧 CONFIGURAÇÕES ESPECÍFICAS
  config: {
    segmento: 'Terapia Integrativa',
    poweredBy: 'Seenti®',
    version: 'v1.1.0',
    environment: process.env.NODE_ENV || 'development'
  }
};

// Debug: verificar se o tema oficial está sendo carregado
console.log('🎨 Tema oficial Seenti carregado:', seentiOficial);
console.log('🎨 Cores oficiais:', seentiOficial.colors);
console.log('🔤 Tipografia oficial:', seentiOficial.typography);


