import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Tipos de feedback
const FEEDBACK_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Componente de Toast individual
const Toast = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ease-in-out transform";
    
    switch (type) {
      case FEEDBACK_TYPES.SUCCESS:
        return `${baseStyles} bg-green-500 text-white border-l-4 border-green-600`;
      case FEEDBACK_TYPES.ERROR:
        return `${baseStyles} bg-red-500 text-white border-l-4 border-red-600`;
      case FEEDBACK_TYPES.WARNING:
        return `${baseStyles} bg-yellow-500 text-white border-l-4 border-yellow-600`;
      case FEEDBACK_TYPES.INFO:
        return `${baseStyles} bg-blue-500 text-white border-l-4 border-blue-600`;
      default:
        return `${baseStyles} bg-gray-500 text-white border-l-4 border-gray-600`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case FEEDBACK_TYPES.SUCCESS:
        return '✅';
      case FEEDBACK_TYPES.ERROR:
        return '❌';
      case FEEDBACK_TYPES.WARNING:
        return '⚠️';
      case FEEDBACK_TYPES.INFO:
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <span className="text-lg mr-2 flex-shrink-0">{getIcon()}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-200 transition-colors flex-shrink-0"
          aria-label="Fechar notificação"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Sistema principal de feedback
const FeedbackSystem = () => {
  const [toasts, setToasts] = useState([]);

  // Adicionar novo toast
  const addToast = (message, type = FEEDBACK_TYPES.INFO, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Remover toast após duração
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  // Remover toast específico
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Limpar todos os toasts
  const clearAllToasts = () => {
    setToasts([]);
  };

  // Métodos de conveniência
  const success = (message, duration) => addToast(message, FEEDBACK_TYPES.SUCCESS, duration);
  const error = (message, duration) => addToast(message, FEEDBACK_TYPES.ERROR, duration);
  const warning = (message, duration) => addToast(message, FEEDBACK_TYPES.WARNING, duration);
  const info = (message, duration) => addToast(message, FEEDBACK_TYPES.INFO, duration);

  // Expor métodos globalmente para uso em outros componentes
  useEffect(() => {
    // Verificar se já existe um sistema de feedback para evitar conflitos
    if (!window.feedback) {
      window.feedback = {
        success,
        error,
        warning,
        info,
        addToast,
        removeToast,
        clearAllToasts
      };
    }

    return () => {
      // Não remover o sistema global ao desmontar o componente
      // para manter compatibilidade com outros componentes
    };
  }, []);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

// Hook personalizado para usar o sistema de feedback
export const useFeedback = () => {
  const [feedbackSystem] = useState(() => {
    if (typeof window !== 'undefined' && window.feedback) {
      return window.feedback;
    }
    
    // Fallback se o sistema não estiver disponível
    return {
      success: (msg) => console.log('✅', msg),
      error: (msg) => console.error('❌', msg),
      warning: (msg) => console.warn('⚠️', msg),
      info: (msg) => console.info('ℹ️', msg),
      addToast: () => {},
      removeToast: () => {},
      clearAllToasts: () => {}
    };
  });

  return feedbackSystem;
};

// Componente de notificação inline
export const InlineFeedback = ({ message, type, onClose, className = "" }) => {
  const getStyles = () => {
    const baseStyles = "p-3 rounded-lg border-l-4 transition-all duration-200";
    
    switch (type) {
      case FEEDBACK_TYPES.SUCCESS:
        return `${baseStyles} bg-green-50 border-green-400 text-green-800 ${className}`;
      case FEEDBACK_TYPES.ERROR:
        return `${baseStyles} bg-red-50 border-red-400 text-red-800 ${className}`;
      case FEEDBACK_TYPES.WARNING:
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800 ${className}`;
      case FEEDBACK_TYPES.INFO:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800 ${className}`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-400 text-gray-800 ${className}`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case FEEDBACK_TYPES.SUCCESS:
        return '✅';
      case FEEDBACK_TYPES.ERROR:
        return '❌';
      case FEEDBACK_TYPES.WARNING:
        return '⚠️';
      case FEEDBACK_TYPES.INFO:
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  if (!message) return null;

  return (
    <div className={getStyles()}>
      <div className="flex items-start">
        <span className="text-lg mr-2 flex-shrink-0">{getIcon()}</span>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-current hover:opacity-70 transition-opacity flex-shrink-0"
            aria-label="Fechar mensagem"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// Componente de loading
export const LoadingSpinner = ({ size = 'md', text = 'Carregando...', className = "" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${getSizeClasses()}`}></div>
      {text && <p className="text-gray-600 text-sm mt-2">{text}</p>}
    </div>
  );
};

// Componente de confirmação
export const ConfirmationDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  onConfirm, 
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      ></div>
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${getTypeStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FeedbackSystem;
export { FEEDBACK_TYPES };
