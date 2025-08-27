// environment.js - Configurações de ambiente centralizadas
// Sprint 08 - Otimizações de Ambiente

const ENV = import.meta.env.MODE || 'development';

const config = {
  development: {
    API_BASE_URL: 'http://localhost:5001',
    DEBUG: true,
    LOG_LEVEL: 'debug',
    ENABLE_HOT_RELOAD: true,
    ENABLE_SOURCE_MAPS: true,
  },
  production: {
    API_BASE_URL: 'https://api.seenti.com.br', // URL de produção
    DEBUG: false,
    LOG_LEVEL: 'error',
    ENABLE_HOT_RELOAD: false,
    ENABLE_SOURCE_MAPS: false,
  },
  test: {
    API_BASE_URL: 'http://localhost:5001',
    DEBUG: true,
    LOG_LEVEL: 'debug',
    ENABLE_HOT_RELOAD: false,
    ENABLE_SOURCE_MAPS: true,
  }
};

// Configurações específicas do ambiente atual
export const environment = config[ENV] || config.development;

// Configurações globais
export const globalConfig = {
  APP_NAME: 'Seenti Cliente',
  VERSION: '1.0.0',
  BUILD_DATE: new Date().toISOString(),
  ENVIRONMENT: ENV,
  
  // Configurações de performance
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutos
    MAX_RETRIES: 3,
  },
  
  // Configurações de UI
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 5000,
    LOADING_TIMEOUT: 10000,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Configurações de API
  API: {
    TIMEOUT: 10000,
    RETRY_DELAY: 1000,
    MAX_CONCURRENT_REQUESTS: 5,
  }
};

// Função para obter configuração
export const getConfig = (key) => {
  return environment[key] || globalConfig[key];
};

// Função para verificar se está em desenvolvimento
export const isDevelopment = () => ENV === 'development';

// Função para verificar se está em produção
export const isProduction = () => ENV === 'production';

// Função para verificar se está em teste
export const isTest = () => ENV === 'test';

export default environment;


