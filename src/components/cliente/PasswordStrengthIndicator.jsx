import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, level: '', color: 'gray' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score += checks.length ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.numbers ? 1 : 0;
    score += checks.special ? 1 : 0;
    
    if (score <= 2) return { score, level: 'Fraca', color: 'red' };
    if (score <= 3) return { score, level: 'Média', color: 'orange' };
    if (score <= 4) return { score, level: 'Boa', color: 'yellow' };
    return { score, level: 'Forte', color: 'green' };
  };

  const strength = getPasswordStrength(password);
  const percentage = (strength.score / 5) * 100;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-600">Força da senha:</span>
        <span className={`font-medium ${
          strength.color === 'red' ? 'text-red-600' :
          strength.color === 'orange' ? 'text-orange-600' :
          strength.color === 'yellow' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {strength.level}
        </span>
      </div>
      
      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength.color === 'red' ? 'bg-red-500' :
            strength.color === 'orange' ? 'bg-orange-500' :
            strength.color === 'yellow' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {/* Lista de requisitos */}
      <div className="space-y-1 text-xs">
        <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-2">
            {password.length >= 8 ? '✓' : '○'}
          </span>
          Pelo menos 8 caracteres
        </div>
        <div className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-2">
            {/[a-z]/.test(password) ? '✓' : '○'}
          </span>
          Letra minúscula
        </div>
        <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-2">
            {/[A-Z]/.test(password) ? '✓' : '○'}
          </span>
          Letra maiúscula
        </div>
        <div className={`flex items-center ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-2">
            {/\d/.test(password) ? '✓' : '○'}
          </span>
          Número
        </div>
        <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-2">
            {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}
          </span>
          Caractere especial (!@#$%^&*)
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
