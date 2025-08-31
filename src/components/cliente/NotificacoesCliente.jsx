import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';
import IconesGlobais from '../globais/IconesGlobais';

const NotificacoesCliente = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notificacoes, setNotificacoes] = useState([]);
  const [totalNaoLidas, setTotalNaoLidas] = useState(0);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Carregar notificações
  useEffect(() => {
    const carregarNotificacoes = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) {
          setErro('Cliente não autenticado');
          navigate('/login');
          return;
        }

        const response = await api.get(`/notificacoes/cliente/${cliente_id}`);
        if (response.status === 200 && response.data) {
          const notificacoesData = response.data.data || response.data;
          const notificacoesList = notificacoesData.notificacoes || [];
          const totalNaoLidasCount = notificacoesData.total_nao_lidas || 0;
          
          setNotificacoes(notificacoesList);
          setTotalNaoLidas(totalNaoLidasCount);
          
          // ✅ NOVO: Log detalhado para debug
          console.log('✅ Notificações carregadas:', {
            total: notificacoesList.length,
            nao_lidas: totalNaoLidasCount,
            estrutura: response.data
          });
        }
      } catch (error) {
        console.error('❌ Erro ao carregar notificações:', error);
        setErro('Erro ao carregar notificações. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarNotificacoes();
  }, [navigate]);

  // Marcar notificação como lida
  const marcarComoLida = async (notificacaoId) => {
    try {
      const response = await api.patch(`/notificacoes/${notificacaoId}/ler`);
      if (response.status === 200) {
        // Atualizar estado local
        setNotificacoes(prev => 
          prev.map(notif => 
            notif._id === notificacaoId 
              ? { ...notif, status: 'lida', lida_em: new Date() }
              : notif
          )
        );
        setTotalNaoLidas(prev => Math.max(0, prev - 1));
        console.log('✅ Notificação marcada como lida:', notificacaoId);
      }
    } catch (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error);
      setErro('Erro ao marcar notificação como lida.');
    }
  };

  // Marcar todas como lidas
  const marcarTodasComoLidas = async () => {
    try {
      const cliente_id = localStorage.getItem('cliente_id');
      const response = await api.patch(`/notificacoes/cliente/${cliente_id}/ler-todas`);
      
      if (response.status === 200) {
        // Atualizar estado local
        setNotificacoes(prev => 
          prev.map(notif => ({ ...notif, status: 'lida', lida_em: new Date() }))
        );
        setTotalNaoLidas(0);
        setSucesso('✅ Todas as notificações foram marcadas como lidas!');
        setTimeout(() => setSucesso(''), 3000);
        console.log('✅ Todas as notificações marcadas como lidas');
      }
    } catch (error) {
      console.error('❌ Erro ao marcar todas como lidas:', error);
      setErro('Erro ao marcar notificações como lidas.');
    }
  };

  // Deletar notificação
  const deletarNotificacao = async (notificacaoId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta notificação?')) {
      return;
    }

    try {
      const response = await api.delete(`/notificacoes/${notificacaoId}`);
      if (response.status === 200) {
        // Remover da lista local
        setNotificacoes(prev => prev.filter(notif => notif._id !== notificacaoId));
        
        // Atualizar contador se não estava lida
        const notif = notificacoes.find(n => n._id === notificacaoId);
        if (notif && notif.status === 'nao_lida') {
          setTotalNaoLidas(prev => Math.max(0, prev - 1));
        }
        
        setSucesso('✅ Notificação deletada com sucesso!');
        setTimeout(() => setSucesso(''), 3000);
        console.log('✅ Notificação deletada:', notificacaoId);
      }
    } catch (error) {
      console.error('❌ Erro ao deletar notificação:', error);
      setErro('Erro ao deletar notificação.');
    }
  };

  // ✅ REMOVIDO: Função de criação de notificação de teste (não apropriada para produção)

  // ✅ MELHORADO: Formatar data com validação robusta
  const formatarData = (dataString) => {
    try {
      let data;
      
      // ✅ NOVO: Lidar com diferentes formatos de data
      if (typeof dataString === 'string') {
        // Se for string, tentar diferentes formatos
        if (dataString.includes('$date')) {
          // Formato MongoDB
          const match = dataString.match(/"\$date":\s*"([^"]+)"/);
          if (match) {
            data = new Date(match[1]);
          } else {
            data = new Date(dataString);
          }
        } else {
          data = new Date(dataString);
        }
      } else if (dataString && typeof dataString === 'object' && dataString.$date) {
        // Objeto MongoDB direto
        data = new Date(dataString.$date);
      } else {
        data = new Date(dataString);
      }
      
      // ✅ NOVO: Validar se a data é válida
      if (isNaN(data.getTime())) {
        console.warn('⚠️ Data inválida recebida:', dataString);
        return 'Data inválida';
      }
      
      const agora = new Date();
      const diffMs = agora - data;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMs < 0) return 'Futuro';
      if (diffMins < 1) return 'Agora mesmo';
      if (diffMins < 60) return `${diffMins} min atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays < 7) return `${diffDays} dias atrás`;
      
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error, 'Data recebida:', dataString);
      return 'Data inválida';
    }
  };

  // Obter ícone por tipo
  const getIconePorTipo = (tipo) => {
    const icones = {
      agendamento: '📅',
      sistema: '🔔',
      lembrete: '⏰',
      promocao: '🎉',
      atualizacao: '🔄'
    };
    return icones[tipo] || '🔔';
  };

  // Obter cor por tipo
  const getCorPorTipo = (tipo) => {
    const cores = {
      agendamento: 'bg-blue-100 text-blue-800',
      sistema: 'seenti-bg-gray-100 seenti-text-gray-800',
      lembrete: 'bg-yellow-100 text-yellow-800',
      promocao: 'bg-green-100 text-green-800',
      atualizacao: 'bg-purple-100 text-purple-800'
    };
    return cores[tipo] || 'seenti-bg-gray-100 seenti-text-gray-800';
  };

  // ✅ PADRONIZADO: Usando tema Seenti oficial
  // Removido hardcoded colors - usando classes CSS do tema

  if (loading) {
    return (
      <div className="min-h-screen seenti-bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 seenti-text-secondary">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen seenti-bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* ✅ CORRIGIDO: Header com ícones na mesma linha - CSS EXPLÍCITO */}
          <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* ✅ Ícone de casa (Voltar ao Perfil) */}
            <button
              onClick={() => navigate('/perfil')}
              className="text-seenti-primary p-2 rounded-lg hover:bg-seenti-primary/10 transition-all duration-200 flex items-center space-x-2"
              title="Voltar ao Perfil"
              style={{ flexShrink: 0, border: 'none', background: 'transparent' }}
            >
              <span className="text-xl">🏠</span>
            </button>
            
            {/* ✅ Título centralizado com hierarquia tipográfica */}
            <div className="text-center flex-1" style={{ flex: 1, textAlign: 'center' }}>
              <h1 className="font-cliente-destaque seenti-text-primary mb-2">
                🔔 Notificações
              </h1>
              <p className="font-info-secundaria seenti-text-secondary">
                {totalNaoLidas > 0 
                  ? `${totalNaoLidas} notificação${totalNaoLidas > 1 ? 'es' : ''} não lida${totalNaoLidas > 1 ? 's' : ''}`
                  : 'Todas as notificações foram lidas'
                }
              </p>
            </div>
            
            {/* ✅ Ícones globais na mesma linha */}
            <div className="flex-shrink-0" style={{ flexShrink: 0 }}>
              <IconesGlobais 
                posicao="direita" 
                tamanho="normal" 
                mostrarBadge={true}
              />
            </div>
          </div>
          
          {/* ✅ Botão Marcar todas como lidas centralizado */}
          <div className="flex justify-center">
            {totalNaoLidas > 0 && (
              <button
                onClick={marcarTodasComoLidas}
                className="font-cta px-4 py-2 seenti-btn-secondary focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                ✅ Marcar todas como lidas
              </button>
            )}
          </div>
        </div>

        {/* Mensagens de Status */}
        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{erro}</p>
          </div>
        )}

        {sucesso && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{sucesso}</p>
          </div>
        )}

        {/* Lista de Notificações */}
        <div className="seenti-card">
          {notificacoes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="font-cta text-lg seenti-text-primary mb-2">
                Nenhuma notificação
              </h3>
              <p className="font-info-secundaria seenti-text-secondary">
                Você não tem notificações no momento.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notificacoes.map((notificacao) => (
                <div 
                  key={notificacao._id} 
                  className={`p-6 hover:seenti-bg-gray-50 transition-colors ${
                    notificacao.status === 'nao_lida' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">
                          {getIconePorTipo(notificacao.tipo)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorPorTipo(notificacao.tipo)}`}>
                          {notificacao.tipo}
                        </span>
                        {notificacao.status === 'nao_lida' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Nova
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-cta text-lg seenti-text-primary mb-1">
                        {notificacao.titulo}
                      </h3>
                      
                      <p className="font-info-secundaria seenti-text-secondary mb-3">
                        {notificacao.mensagem}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm seenti-text-secondary">
                        <span className="font-info-secundaria">📅 {formatarData(notificacao.criado_em)}</span>
                        {notificacao.lida_em && (
                          <span className="font-info-secundaria">👁️ Lida em {formatarData(notificacao.lida_em)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {notificacao.status === 'nao_lida' && (
                        <button
                          onClick={() => marcarComoLida(notificacao._id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Marcar como lida"
                        >
                          ✅
                        </button>
                      )}
                      
                      <button
                        onClick={() => deletarNotificacao(notificacao._id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        title="Deletar notificação"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default NotificacoesCliente;




