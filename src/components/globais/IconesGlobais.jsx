import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificacoes } from '../../contexts/NotificacoesContext';

// ✅ COMPONENTE GLOBAL DE ÍCONES - PADRÃO UNIFICADO
const IconesGlobais = ({ 
  posicao = 'direita', // 'direita', 'centro', 'esquerda'
  tamanho = 'normal',  // 'pequeno', 'normal', 'grande'
  mostrarBadge = true, // se deve mostrar o badge de notificações
  className = ''       // classes CSS adicionais
}) => {
  const navigate = useNavigate();
  const { notificacoesNaoLidas } = useNotificacoes();
  
  // ✅ CSS GLOBAL PARA GARANTIR POSICIONAMENTO DO BADGE
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .seenti-badge {
        position: absolute !important;
        top: -10px !important;
        right: -10px !important;
        width: 22px !important;
        height: 22px !important;
        background-color: #ef4444 !important;
        color: white !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 11px !important;
        font-weight: bold !important;
        z-index: 9999 !important;
        border: 2px solid white !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        transform: translate(0, 0) !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  // ✅ CONFIGURAÇÕES DE POSICIONAMENTO
  const getPosicaoClasses = () => {
    switch (posicao) {
      case 'direita':
        return 'justify-end';
      case 'centro':
        return 'justify-center';
      case 'esquerda':
        return 'justify-start';
      default:
        return 'justify-end';
    }
  };

  // ✅ CONFIGURAÇÕES DE TAMANHO
  const getTamanhoClasses = () => {
    switch (tamanho) {
      case 'pequeno':
        return 'text-lg p-1.5';
      case 'grande':
        return 'text-2xl p-3';
      default:
        return 'text-xl p-2';
    }
  };

  // ✅ CONFIGURAÇÕES DE BADGE
  const getBadgeClasses = () => {
    switch (tamanho) {
      case 'pequeno':
        return 'h-4 w-4 text-xs';
      case 'grande':
        return 'h-6 w-6 text-sm';
      default:
        return 'h-5 w-5 text-xs';
    }
  };



  return (
    <div className={`flex items-center space-x-3 ${getPosicaoClasses()} ${className}`}>
      {/* ✅ ÍCONE DE NOTIFICAÇÕES */}
      <button
        onClick={() => navigate('/notificacoes')}
        className={`relative ${getTamanhoClasses()} text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200`}
        aria-label="Notificações"
        title="Ver notificações"
        style={{ border: 'none', background: 'transparent', position: 'relative' }}
      >
        <span>🔔</span>
        
        {/* ✅ BADGE DE NOTIFICAÇÕES NÃO LIDAS - POSICIONADA CORRETAMENTE */}
        {mostrarBadge && notificacoesNaoLidas > 0 && (
          <div 
            className="seenti-badge"
            style={{
              border: '2px solid transparent',
              backgroundColor: '#ef4444',
              color: 'white',
              position: 'absolute',
              top: '-8px',
              right: '-8px'
            }}
          >
            {notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}
          </div>
        )}
      </button>
      
      {/* ✅ ÍCONE DE CONFIGURAÇÕES */}
      <button
        onClick={() => navigate('/configuracoes')}
        className={`${getTamanhoClasses()} text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200`}
        aria-label="Configurações"
        title="Configurações da conta"
        style={{ border: 'none', background: 'transparent' }}
      >
        <span>⚙️</span>
      </button>
    </div>
  );
};

export default IconesGlobais;
