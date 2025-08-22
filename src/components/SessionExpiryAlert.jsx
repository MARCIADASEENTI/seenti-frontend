// src/components/SessionExpiryAlert.jsx
import React, { useState, useEffect } from 'react';
import { useGoogleSession } from '../hooks/useGoogleSession';

export default function SessionExpiryAlert() {
  const { isSessionExpiringSoon, sessionData } = useGoogleSession();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isSessionExpiringSoon()) {
      setShowAlert(true);
      
      // Auto-hide após 10 segundos
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isSessionExpiringSoon]);

  if (!showAlert) return null;

  const timeUntilExpiry = sessionData?.tokenExpiry - Date.now();
  const minutesLeft = Math.ceil(timeUntilExpiry / (1000 * 60));

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-yellow-600 text-xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Sessão expirando em breve
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Sua sessão Google OAuth expira em {minutesLeft} minuto{minutesLeft !== 1 ? 's' : ''}.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => setShowAlert(false)}
              className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
            >
              Entendi
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Renovar Sessão
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowAlert(false)}
          className="text-yellow-400 hover:text-yellow-600 transition-colors"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
}
