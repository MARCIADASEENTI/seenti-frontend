import { getLogoPath } from '../utils/detectBrand';
import { seentiOficial } from './seentiOficial';

export const themes = {
  // 🎨 TEMA OFICIAL DA SEENTI (PADRÃO)
  default: {
    name: 'Seenti',
    tagline: 'Terapia Integrativa',
    logo: getLogoPath('/assets/seenti-design/logo-seenti-oficial.png'),
    favicon: getLogoPath('/assets/seenti-design/favicon-seenti-oficial.ico'),
    
    // 🎨 CORES OFICIAIS DA LOGO SEENTI
    primaryColor: seentiOficial.colors.primary,      // #1E3A8A - Azul principal
    secondaryColor: seentiOficial.colors.secondary,  // #AC80DD - Lilás/Roxo
    accentColor: seentiOficial.colors.accent,        // #FF6600 - Laranja
    
    // 🌈 CORES DE ESTADO
    successColor: seentiOficial.colors.success,      // #10B981 - Verde
    warningColor: seentiOficial.colors.warning,      // #F59E0B - Amarelo
    errorColor: seentiOficial.colors.error,          // #EF4444 - Vermelho
    infoColor: seentiOficial.colors.info,            // #3B82F6 - Azul info
    
    // 🔤 TIPOGRAFIA OFICIAL
    fontFamily: seentiOficial.typography.fontFamily.primary,
    fontFamilySecondary: seentiOficial.typography.fontFamily.secondary,
    
    // 🔧 CONFIGURAÇÕES
    poweredBy: 'Seenti®',
    segmento: 'Terapia Integrativa',
    
    // 📱 BREAKPOINTS RESPONSIVOS
    breakpoints: seentiOficial.breakpoints,
    
    // 🎭 COMPONENTES OFICIAIS
    components: seentiOficial.components,
    
    // 🌟 ANIMAÇÕES OFICIAIS
    animations: seentiOficial.animations,
    
    // 🔗 REFERÊNCIA AO TEMA COMPLETO
    theme: seentiOficial
  },
  
  // 🎨 TEMA PARCEIRO (COMPATIBILIDADE)
  parceiroX: {
    name: 'Marcia Alves',
    tagline: 'Terapia Integrativa',
    logo: getLogoPath('/assets/logo-parceirox.png'),
    favicon: getLogoPath('/assets/seenti-design/favicon-seenti-oficial.ico'),
    
    // 🎨 CORES DO PARCEIRO
    primaryColor: '#FF6600',        // Laranja
    secondaryColor: '#f4f4f4',      // Cinza claro
    accentColor: '#1E3A8A',         // Azul Seenti
    
    // 🌈 CORES DE ESTADO (mantendo padrão Seenti)
    successColor: seentiOficial.colors.success,
    warningColor: seentiOficial.colors.warning,
    errorColor: seentiOficial.colors.error,
    infoColor: seentiOficial.colors.info,
    
    // 🔤 TIPOGRAFIA
    fontFamily: 'Roboto, sans-serif',
    fontFamilySecondary: 'Georgia, serif',
    
    // 🔧 CONFIGURAÇÕES
    poweredBy: 'Seenti®',
    segmento: 'Terapia Integrativa',
    
    // 📱 BREAKPOINTS RESPONSIVOS
    breakpoints: seentiOficial.breakpoints,
    
    // 🎭 COMPONENTES (adaptados)
    components: {
      ...seentiOficial.components,
      button: {
        ...seentiOficial.components.button,
        borderRadius: '0.75rem' // Ajuste para parceiro
      }
    },
    
    // 🌟 ANIMAÇÕES OFICIAIS
    animations: seentiOficial.animations
  }
};

// 🎯 TEMA ATUAL (padrão: Seenti oficial)
export const currentTheme = themes.default;
