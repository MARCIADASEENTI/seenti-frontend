import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// ✅ CONTEXTO GLOBAL PARA NOTIFICAÇÕES - PADRÃO UNIFICADO
const NotificacoesContext = createContext();

export const useNotificacoes = () => {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error('useNotificacoes deve ser usado dentro de NotificacoesProvider');
  }
  return context;
};

export const NotificacoesProvider = ({ children }) => {
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FUNÇÃO PARA CARREGAR NOTIFICAÇÕES NÃO LIDAS
  const carregarNotificacoesNaoLidas = async () => {
    try {
      const cliente_id = localStorage.getItem('cliente_id');
      if (!cliente_id) return;

      setLoading(true);
      setError(null);
      
      const response = await api.get(`/notificacoes/cliente/${cliente_id}`);
      
      if (response.status === 200 && response.data?.data) {
        const totalNaoLidas = response.data.data.total_nao_lidas || 0;
        setNotificacoesNaoLidas(totalNaoLidas);
      }
    } catch (error) {
      console.error('❌ NotificacoesContext: Erro ao carregar notificações:', error);
      setError('Erro ao carregar notificações');
      setNotificacoesNaoLidas(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO PARA ATUALIZAR NOTIFICAÇÕES (chamada externamente)
  const atualizarNotificacoes = () => {
    carregarNotificacoesNaoLidas();
  };

  // ✅ FUNÇÃO PARA MARCAR NOTIFICAÇÃO COMO LIDA
  const marcarComoLida = async (notificacaoId) => {
    try {
      const cliente_id = localStorage.getItem('cliente_id');
      if (!cliente_id) return;

      const response = await api.put(`/notificacoes/${notificacaoId}/ler`, {
        cliente_id: cliente_id
      });

      if (response.status === 200) {
        // ✅ Atualizar contador local
        setNotificacoesNaoLidas(prev => Math.max(0, prev - 1));
        console.log('✅ NotificacaoContext: Notificação marcada como lida');
      }
    } catch (error) {
      console.error('❌ NotificacoesContext: Erro ao marcar como lida:', error);
    }
  };

  // ✅ CARREGAR NOTIFICAÇÕES AO MONTAR
  useEffect(() => {
    carregarNotificacoesNaoLidas();
    
    // ✅ ATUALIZAR A CADA 30 SEGUNDOS
    const interval = setInterval(carregarNotificacoesNaoLidas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // ✅ VALOR DO CONTEXTO
  const value = {
    notificacoesNaoLidas,
    loading,
    error,
    carregarNotificacoesNaoLidas,
    atualizarNotificacoes,
    marcarComoLida
  };

  return (
    <NotificacoesContext.Provider value={value}>
      {children}
    </NotificacoesContext.Provider>
  );
};
