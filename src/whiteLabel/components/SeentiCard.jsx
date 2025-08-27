// src/whiteLabel/components/SeentiCard.jsx
// Componente de card oficial da Seenti usando o tema oficial

import React from 'react';
import { useSeentiTheme } from '../hooks/useSeentiTheme';

const SeentiCard = ({ 
  children, 
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  hover = true,
  className = '',
  ...props 
}) => {
  const { getCardStyle, colors } = useSeentiTheme();

  // 🎨 Estilo base do card
  const cardStyle = getCardStyle();
  
  // 🎭 Variantes de padding
  const paddingMap = {
    none: '0',
    small: '1rem',
    default: '1.5rem',
    large: '2rem',
    xl: '2.5rem'
  };

  // 🌟 Variantes de sombra
  const shadowMap = {
    none: 'none',
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  // 🎨 Variantes de cor
  const variantMap = {
    default: {
      backgroundColor: colors.white,
      borderColor: colors.gray[200]
    },
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: colors.white
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
      color: colors.white
    },
    accent: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      color: colors.white
    },
    success: {
      backgroundColor: colors.success,
      borderColor: colors.success,
      color: colors.white
    },
    warning: {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
      color: colors.white
    },
    error: {
      backgroundColor: colors.error,
      borderColor: colors.error,
      color: colors.white
    }
  };

  // 🎯 Estilos finais
  const finalStyle = {
    ...cardStyle,
    padding: paddingMap[padding] || paddingMap.default,
    boxShadow: shadowMap[shadow] || shadowMap.default,
    ...variantMap[variant] || variantMap.default
  };

  // 🎭 Classes condicionais
  const cardClasses = `
    seenti-card 
    seenti-card-${variant}
    seenti-card-${padding}
    seenti-card-${shadow}
    ${hover ? 'seenti-card-hover' : ''}
    ${className}
  `.trim();

  return (
    <div
      style={finalStyle}
      className={cardClasses}
      {...props}
    >
      {children}
    </div>
  );
};

// 🎨 Variantes disponíveis
SeentiCard.Primary = (props) => <SeentiCard variant="primary" {...props} />;
SeentiCard.Secondary = (props) => <SeentiCard variant="secondary" {...props} />;
SeentiCard.Accent = (props) => <SeentiCard variant="accent" {...props} />;
SeentiCard.Success = (props) => <SeentiCard variant="success" {...props} />;
SeentiCard.Warning = (props) => <SeentiCard variant="warning" {...props} />;
SeentiCard.Error = (props) => <SeentiCard variant="error" {...props} />;

// 📱 Tamanhos de padding disponíveis
SeentiCard.None = (props) => <SeentiCard padding="none" {...props} />;
SeentiCard.Small = (props) => <SeentiCard padding="small" {...props} />;
SeentiCard.Large = (props) => <SeentiCard padding="large" {...props} />;
SeentiCard.XL = (props) => <SeentiCard padding="xl" {...props} />;

// 🌟 Níveis de sombra disponíveis
SeentiCard.NoShadow = (props) => <SeentiCard shadow="none" {...props} />;
SeentiCard.SmallShadow = (props) => <SeentiCard shadow="small" {...props} />;
SeentiCard.LargeShadow = (props) => <SeentiCard shadow="large" {...props} />;
SeentiCard.XLShadow = (props) => <SeentiCard shadow="xl" {...props} />;

export default SeentiCard;



