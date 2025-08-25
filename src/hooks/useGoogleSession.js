// src/hooks/useGoogleSession.js
import { useState, useEffect, useCallback } from 'react';

export const useGoogleSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  // Verificar sessão
  const checkSession = useCallback(() => {
    const googleToken = localStorage.getItem('google_token');
    const tokenExpiry = localStorage.getItem('google_token_expiry');
    const usuarioId = localStorage.getItem('usuario_id');
    const loginMethod = localStorage.getItem('login_method');

    if (googleToken && tokenExpiry && usuarioId && loginMethod === 'google') {
      const isExpired = Date.now() > parseInt(tokenExpiry);
      
      if (!isExpired) {
        setIsAuthenticated(true);
        setSessionData({
          usuarioId,
          loginMethod,
          tokenExpiry: parseInt(tokenExpiry)
        });
        return true;
      } else {
        // Token expirado, limpar sessão
        clearSession();
        return false;
      }
    }
    
    setIsAuthenticated(false);
    setSessionData(null);
    return false;
  }, []);

  // Limpar sessão
  const clearSession = useCallback(() => {
    localStorage.removeItem('google_token');
    localStorage.removeItem('google_token_expiry');
    localStorage.removeItem('login_method');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('cliente_id');
    localStorage.removeItem('cadastro_email');
    localStorage.removeItem('cadastro_tipo');
    
    setIsAuthenticated(false);
    setSessionData(null);
    
    console.log('🧹 Sessão Google OAuth limpa');
  }, []);

  // Verificar sessão periodicamente (a cada 5 minutos)
  useEffect(() => {
    checkSession();
    setIsLoading(false);

    const interval = setInterval(() => {
      const isValid = checkSession();
      if (!isValid) {
        console.log('⏰ Sessão expirada, redirecionando para login...');
        // Redirecionar para login se sessão expirou
        window.location.href = '/login';
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [checkSession]);

  // Verificar se sessão está próxima de expirar (últimos 10 minutos)
  const isSessionExpiringSoon = useCallback(() => {
    if (!sessionData?.tokenExpiry) return false;
    
    const timeUntilExpiry = sessionData.tokenExpiry - Date.now();
    const tenMinutes = 10 * 60 * 1000; // 10 minutos
    
    return timeUntilExpiry < tenMinutes;
  }, [sessionData]);

  return {
    isAuthenticated,
    isLoading,
    sessionData,
    checkSession,
    clearSession,
    isSessionExpiringSoon
  };
};
