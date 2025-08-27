// src/whiteLabel/components/SeentiButton.jsx
// Componente de botão oficial da Seenti usando o tema oficial

import React from 'react';
import { useSeentiTheme } from '../hooks/useSeentiTheme';

const SeentiButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  const { getButtonStyle, colors } = useSeentiTheme();

  // 🎨 Estilo base do botão
  const buttonStyle = getButtonStyle(variant, size);
  
  // 🎭 Classes condicionais
  const buttonClasses = `
    seenti-button 
    seenti-button-${variant} 
    seenti-button-${size}
    ${disabled ? 'seenti-button-disabled' : ''}
    ${className}
  `.trim();

  // 🎯 Estilos inline para compatibilidade
  const inlineStyle = {
    ...buttonStyle,
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transform: disabled ? 'none' : buttonStyle.transform
  };

  return (
    <button
      type={type}
      style={inlineStyle}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// 🎨 Variantes disponíveis
SeentiButton.Primary = (props) => <SeentiButton variant="primary" {...props} />;
SeentiButton.Secondary = (props) => <SeentiButton variant="secondary" {...props} />;
SeentiButton.Accent = (props) => <SeentiButton variant="accent" {...props} />;
SeentiButton.Success = (props) => <SeentiButton variant="success" {...props} />;
SeentiButton.Warning = (props) => <SeentiButton variant="warning" {...props} />;
SeentiButton.Error = (props) => <SeentiButton variant="error" {...props} />;

// 📱 Tamanhos disponíveis
SeentiButton.Small = (props) => <SeentiButton size="sm" {...props} />;
SeentiButton.Medium = (props) => <SeentiButton size="md" {...props} />;
SeentiButton.Large = (props) => <SeentiButton size="lg" {...props} />;

export default SeentiButton;


