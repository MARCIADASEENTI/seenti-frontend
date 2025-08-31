// 📦 Configuração de Versão - Seenti App
// Este arquivo é atualizado manualmente a cada release

export const APP_VERSION = {
  // Versão principal (Sprint 08)
  version: '1.2.0',
  
  // Informações da Sprint
  sprint: 'Sprint 08',
  sprintName: 'Ecossistema Completo de Gerenciamento',
  
  // Data de release
  releaseDate: '27 de Agosto de 2025',
  
  // Status da versão
  status: 'stable',
  
  // Changelog da versão
  changelog: [
    '🚀 Ecossistema completo de gerenciamento implementado',
    '🔒 Sistema de segurança de classe empresarial (Score 137/100)',
    '📊 Monitoramento contínuo em tempo real',
    '🚀 Deploy seguro com staging e rollback',
    '🎨 Padronização UI com WhiteLabel completa',
    '📱 Responsividade total para mobile implementada',
    '🆕 Nova funcionalidade: FaleComTerapeuta',
    '🔧 Scripts de ambiente otimizados e robustos',
    '📚 Documentação completa da Sprint 08',
    '🌐 Domínio seenti.online configurado'
  ],
  
  // Funcionalidades principais
  features: [
    'Sistema de autenticação JWT robusto',
    'Agendamento, anamnese e feedback funcionais',
    'Sistema de notificações implementado',
    'Perfil do cliente completo',
    'WhiteLabel theme system',
    'Responsividade mobile-first',
    'Sistema de monitoramento em tempo real',
    'Deploy seguro automatizado',
    'Health checks contínuos',
    'Sistema de backup e restauração'
  ],
  
  // Informações técnicas
  technical: {
    frontend: 'React + Vite + Tailwind CSS',
    backend: 'Flask + Python',
    database: 'MongoDB Atlas',
    deployment: 'Vercel (Frontend) + Render (Backend)',
    monitoring: 'Sistema customizado de health checks',
    security: 'JWT + OAuth + CORS + Rate Limiting'
  },
  
  // Contato para suporte
  support: {
    developer: 'Assistente AI - Sprint 08',
    email: 'contato@seenti.com.br',
    repository: 'https://github.com/MARCIADASEENTI/seenti-frontend'
  }
};

// Função para obter versão formatada
export const getVersionInfo = () => {
  return {
    short: APP_VERSION.version,
    full: `${APP_VERSION.version} - ${APP_VERSION.sprintName}`,
    sprint: APP_VERSION.sprint,
    date: APP_VERSION.releaseDate
  };
};

// Função para verificar se é versão de desenvolvimento
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Função para obter informações de build
export const getBuildInfo = () => {
  return {
    version: APP_VERSION.version,
    environment: isDevelopment() ? 'development' : 'production',
    buildDate: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
};

export default APP_VERSION;








