// src/components/demo/SeentiThemeDemo.jsx
// Componente de demonstração do tema oficial da Seenti

import React from 'react';
import { useSeentiTheme } from '../../whiteLabel/hooks/useSeentiTheme';

const SeentiThemeDemo = () => {
  const { 
    colors, 
    typography, 
    getButtonStyle, 
    getCardStyle, 
    getInputStyle 
  } = useSeentiTheme();

  return (
    <div className="seenti-theme-demo p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 seenti-text-primary">
        🎨 Tema Oficial da Seenti - Demonstração
      </h1>
      
      {/* 🎨 Seção de Cores */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          🎨 Paleta de Cores Oficial
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cores Principais */}
          <div className="seenti-card">
            <div 
              className="w-full h-20 rounded-lg mb-3"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-gray-600">{colors.primary}</p>
          </div>
          
          <div className="seenti-card">
            <div 
              className="w-full h-20 rounded-lg mb-3"
              style={{ backgroundColor: colors.secondary }}
            ></div>
            <p className="text-sm font-medium">Secondary</p>
            <p className="text-xs text-gray-600">{colors.secondary}</p>
          </div>
          
          <div className="seenti-card">
            <div 
              className="w-full h-20 rounded-lg mb-3"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <p className="text-sm font-medium">Accent</p>
            <p className="text-xs text-gray-600">{colors.accent}</p>
          </div>
          
          <div className="seenti-card">
            <div 
              className="w-full h-20 rounded-lg mb-3"
              style={{ backgroundColor: colors.success }}
            ></div>
            <p className="text-sm font-medium">Success</p>
            <p className="text-xs text-gray-600">{colors.success}</p>
          </div>
        </div>
      </section>

      {/* 🔤 Seção de Tipografia */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          🔤 Tipografia Oficial
        </h2>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold seenti-text-primary">
            Heading 1 - {typography.fontSize['6xl']}
          </h1>
          <h2 className="text-5xl font-bold seenti-text-secondary">
            Heading 2 - {typography.fontSize['5xl']}
          </h2>
          <h3 className="text-4xl font-semibold seenti-text-primary">
            Heading 3 - {typography.fontSize['4xl']}
          </h3>
          <h4 className="text-3xl font-medium seenti-text-secondary">
            Heading 4 - {typography.fontSize['3xl']}
          </h4>
          <h5 className="text-2xl font-normal seenti-text-primary">
            Heading 5 - {typography.fontSize['2xl']}
          </h5>
          <h6 className="text-xl font-light seenti-text-secondary">
            Heading 6 - {typography.fontSize['xl']}
          </h6>
          <p className="text-base seenti-text-primary">
            Parágrafo base - {typography.fontSize.base}
          </p>
          <p className="text-sm seenti-text-secondary">
            Texto pequeno - {typography.fontSize.sm}
          </p>
          <p className="text-xs seenti-text-primary">
            Texto extra pequeno - {typography.fontSize.xs}
          </p>
        </div>
      </section>

      {/* 🔘 Seção de Botões */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          🔘 Botões Oficiais
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button style={getButtonStyle('primary', 'sm')}>
              Botão Primary Small
            </button>
            <button style={getButtonStyle('primary', 'md')}>
              Botão Primary Medium
            </button>
            <button style={getButtonStyle('primary', 'lg')}>
              Botão Primary Large
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button style={getButtonStyle('secondary', 'md')}>
              Botão Secondary
            </button>
            <button style={getButtonStyle('accent', 'md')}>
              Botão Accent
            </button>
            <button style={getButtonStyle('success', 'md')}>
              Botão Success
            </button>
            <button style={getButtonStyle('warning', 'md')}>
              Botão Warning
            </button>
            <button style={getButtonStyle('error', 'md')}>
              Botão Error
            </button>
          </div>
        </div>
      </section>

      {/* 🎨 Seção de Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          🎨 Cards Oficiais
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div style={getCardStyle()}>
            <h3 className="text-lg font-semibold mb-2 seenti-text-primary">
              Card Primário
            </h3>
            <p className="text-gray-600">
              Este é um exemplo de card usando o tema oficial da Seenti.
            </p>
          </div>
          
          <div style={getCardStyle()}>
            <h3 className="text-lg font-semibold mb-2 seenti-text-secondary">
              Card Secundário
            </h3>
            <p className="text-gray-600">
              Todos os cards seguem o mesmo padrão visual oficial.
            </p>
          </div>
          
          <div style={getCardStyle()}>
            <h3 className="text-lg font-semibold mb-2 seenti-text-accent">
              Card Accent
            </h3>
            <p className="text-gray-600">
              Consistência visual em toda a aplicação.
            </p>
          </div>
        </div>
      </section>

      {/* 📝 Seção de Inputs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          📝 Inputs Oficiais
        </h2>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2 seenti-text-primary">
              Input Padrão
            </label>
            <input 
              type="text" 
              placeholder="Digite algo..."
              style={getInputStyle('default')}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 seenti-text-primary">
              Input com Foco
            </label>
            <input 
              type="text" 
              placeholder="Clique para focar..."
              style={getInputStyle('focus')}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 seenti-text-primary">
              Input com Erro
            </label>
            <input 
              type="text" 
              placeholder="Estado de erro..."
              style={getInputStyle('error')}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* 🌟 Seção de Animações */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          🌟 Animações Oficiais
        </h2>
        
        <div className="space-y-4">
          <div className="seenti-card seenti-fade-in">
            <h3 className="text-lg font-semibold mb-2 seenti-text-primary">
              Fade In Animation
            </h3>
            <p>Este card aparece com animação fade in oficial.</p>
          </div>
          
          <div className="seenti-card seenti-slide-up">
            <h3 className="text-lg font-semibold mb-2 seenti-text-secondary">
              Slide Up Animation
            </h3>
            <p>Este card aparece com animação slide up oficial.</p>
          </div>
        </div>
      </section>

      {/* 📱 Seção de Responsividade */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 seenti-text-primary">
          📱 Responsividade Oficial
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="seenti-card seenti-responsive-padding">
            <h4 className="seenti-responsive-text font-semibold mb-2 seenti-text-primary">
              Breakpoint XS
            </h4>
            <p className="text-xs seenti-text-secondary">
              Para dispositivos muito pequenos
            </p>
          </div>
          
          <div className="seenti-card seenti-responsive-padding">
            <h4 className="seenti-responsive-text font-semibold mb-2 seenti-text-primary">
              Breakpoint SM
            </h4>
            <p className="text-xs seenti-text-secondary">
              Para dispositivos pequenos
            </p>
          </div>
          
          <div className="seenti-card seenti-responsive-padding">
            <h4 className="seenti-responsive-text font-semibold mb-2 seenti-text-primary">
              Breakpoint MD
            </h4>
            <p className="text-xs seenti-text-secondary">
              Para tablets
            </p>
          </div>
          
          <div className="seenti-card seenti-responsive-padding">
            <h4 className="seenti-responsive-text font-semibold mb-2 seenti-text-primary">
              Breakpoint LG
            </h4>
            <p className="text-xs seenti-text-secondary">
              Para desktops
            </p>
          </div>
        </div>
      </section>

      {/* 🎯 Resumo */}
      <section className="mb-12">
        <div className="seenti-card bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold mb-4 seenti-text-primary">
            🎯 Tema Oficial da Seenti Implementado com Sucesso!
          </h2>
          <p className="text-gray-700 mb-4">
            O sistema WhiteLabel agora usa a identidade visual oficial da marca Seenti, 
            com cores, tipografia e componentes padronizados baseados na logo oficial.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Paleta de cores oficial da logo implementada</li>
            <li>✅ Tipografia padronizada e responsiva</li>
            <li>✅ Componentes com estilos oficiais</li>
            <li>✅ Animações e transições oficiais</li>
            <li>✅ Sistema responsivo oficial</li>
            <li>✅ Hook personalizado para fácil uso</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default SeentiThemeDemo;


