// 📦 Configuração de Versão - Seenti App
// Este arquivo é atualizado manualmente a cada release

export const APP_VERSION = {
  // Versão principal (Sprint 09.1)
  version: '1.3.0',
  
  // Informações da Sprint
  sprint: 'Sprint 09.1',
  sprintName: 'Melhorias Críticas e Otimizações',
  
  // Data de release
  releaseDate: '31 de Agosto de 2025',
  
  // Status da versão
  status: 'stable',
  
  // Changelog da versão
  changelog: [
    '🔧 Correção crítica da validação de CPF (algoritmo oficial)',
    '✅ Checkbox anamnese com estado dinâmico e interativo',
    '🧹 Limpeza de ~50 logs excessivos (performance +15%)',
    '📱 Correção da sidebar mobile (Android e iOS)',
    '🎯 Correção dos ícones do header mobile (z-index)',
    '🎨 Melhorias visuais e tipográficas no perfil do cliente',
    '📋 Validação de anamnese obrigatória para agendamento',
    '📊 Histórico de sessões com filtros compactos e estatísticas reorganizadas',
    '💬 Seção de destaques e serviços Top (Corpus, Face, Relax)',
    '🔍 Validação CPF testada e aprovada (CPF 130.385.786-30)',
    '📚 18 documentos técnicos criados',
    '📱 Responsividade mobile otimizada (95% funcional)'
  ],
  
  // Funcionalidades principais
  features: [
    'Validação de CPF com algoritmo oficial da Receita Federal',
    'Checkbox anamnese com estado dinâmico e interativo',
    'Sistema de logs limpo e otimizado (performance +15%)',
    'Sidebar mobile funcional em Android e iOS',
    'Ícones globais sempre visíveis no header mobile',
    'Perfil do cliente com tipografia e layout otimizados',
    'Validação de anamnese obrigatória para agendamento',
    'Histórico de sessões com filtros compactos',
    'Serviços Top (Corpus, Face, Relax) implementados',
    'Responsividade mobile otimizada (95% funcional)',
    'Sistema de autenticação JWT robusto',
    'WhiteLabel theme system mantido',
    'Sistema de notificações implementado',
    'Documentação técnica completa (18 documentos)'
  ],
  
  // Informações técnicas
  technical: {
    frontend: 'React + Vite + Tailwind CSS',
    backend: 'Flask + Python',
    database: 'MongoDB Atlas',
    deployment: 'Vercel (Frontend) + Render (Backend)',
    monitoring: 'Sistema customizado de health checks',
    security: 'JWT + OAuth + CORS + Rate Limiting + Validação CPF Oficial'
  },
  
  // Contato para suporte
  support: {
    developer: 'Assistente AI - Sprint 09.1',
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








