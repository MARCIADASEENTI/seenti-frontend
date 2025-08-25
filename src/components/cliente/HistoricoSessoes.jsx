import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';

const HistoricoSessoes = () => {
  const navigate = useNavigate();
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroData, setFiltroData] = useState('todas');

  // Carregar histórico de sessões
  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) {
          setErro('Cliente não autenticado');
          navigate('/login');
          return;
        }

        const response = await api.get(`/sessoes/cliente/${cliente_id}`);
        if (response.status === 200) {
          setSessoes(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        if (error.response?.status === 404) {
          setErro('Nenhuma sessão encontrada');
        } else {
          setErro('Erro ao carregar histórico de sessões');
        }
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [navigate]);

  // Aplicar cores do WhiteLabel
  const primaryColor = brand?.primaryColor || '#1E3A8A';
  const secondaryColor = brand?.secondaryColor || '#AC80DD';

  // Filtrar sessões
  const sessoesFiltradas = sessoes.filter(sessao => {
    // Filtro por status
    if (filtroStatus !== 'todas' && sessao.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por data
    if (filtroData !== 'todas') {
      const hoje = new Date();
      const dataSessao = new Date(sessao.data_agendada);
      
      switch (filtroData) {
        case 'hoje':
          return dataSessao.toDateString() === hoje.toDateString();
        case 'semana':
          const umaSemanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
          return dataSessao >= umaSemanaAtras;
        case 'mes':
          const umMesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
          return dataSessao >= umMesAtras;
        default:
          return true;
      }
    }
    
    return true;
  });

  // Formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatar status
  const formatarStatus = (status) => {
    const statusMap = {
      'agendada': { label: 'Agendada', cor: 'bg-blue-100 text-blue-800' },
      'confirmada': { label: 'Confirmada', cor: 'bg-green-100 text-green-800' },
      'realizada': { label: 'Realizada', cor: 'bg-purple-100 text-purple-800' },
      'cancelada': { label: 'Cancelada', cor: 'bg-red-100 text-red-800' },
      'remarcada': { label: 'Remarcada', cor: 'bg-yellow-100 text-yellow-800' }
    };
    
    const statusInfo = statusMap[status] || { label: status, cor: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.cor}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Calcular duração da sessão
  const calcularDuracao = (duracaoMinutos) => {
    if (duracaoMinutos < 60) {
      return `${duracaoMinutos} min`;
    }
    const horas = Math.floor(duracaoMinutos / 60);
    const minutos = duracaoMinutos % 60;
    return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          📅 Histórico de Sessões
        </h2>
        <p className="text-gray-600">Acompanhe todas as suas sessões de massoterapia</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas as sessões</option>
              <option value="agendada">Agendadas</option>
              <option value="confirmada">Confirmadas</option>
              <option value="realizada">Realizadas</option>
              <option value="cancelada">Canceladas</option>
              <option value="remarcada">Remarcadas</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas as datas</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensagens de erro ou sucesso */}
      {erro && (
        <div className="text-red-600 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          ⚠️ {erro}
        </div>
      )}

      {/* Lista de sessões */}
      {sessoesFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {erro ? 'Nenhuma sessão encontrada' : 'Nenhuma sessão para os filtros selecionados'}
          </h3>
          <p className="text-gray-500">
            {erro ? 'Você ainda não possui sessões agendadas.' : 'Tente ajustar os filtros para ver mais sessões.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessoesFiltradas.map((sessao) => (
            <div
              key={sessao._id}
              className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {sessao.tipo_massagem || 'Sessão de Massoterapia'}
                      </h3>
                      <p className="text-gray-600">
                        {sessao.terapeuta?.nome || 'Terapeuta não definido'}
                      </p>
                    </div>
                    {formatarStatus(sessao.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">📅 Data:</span>
                      <p className="text-gray-600">{formatarData(sessao.data_agendada)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">⏱️ Duração:</span>
                      <p className="text-gray-600">
                        {sessao.duracao ? calcularDuracao(sessao.duracao) : 'Não definida'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">💰 Valor:</span>
                      <p className="text-gray-600">
                        {sessao.valor ? `R$ ${sessao.valor.toFixed(2)}` : 'Não definido'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {sessao.status === 'agendada' && (
                    <>
                      <button
                        onClick={() => navigate(`/agendamento/editar/${sessao._id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => navigate(`/agendamento/cancelar/${sessao._id}`)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        ❌ Cancelar
                      </button>
                    </>
                  )}
                  
                  {sessao.status === 'realizada' && (
                    <button
                      onClick={() => navigate(`/avaliacao/${sessao._id}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      ⭐ Avaliar
                    </button>
                  )}
                </div>
              </div>

              {/* Observações */}
              {sessao.observacoes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="font-medium text-gray-700 text-sm">📝 Observações:</span>
                  <p className="text-gray-600 text-sm mt-1">{sessao.observacoes}</p>
                </div>
              )}

              {/* Feedback da sessão */}
              {sessao.feedback && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="font-medium text-gray-700 text-sm">💬 Seu feedback:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= (sessao.feedback.avaliacao || 0) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {sessao.feedback.avaliacao}/5
                    </span>
                  </div>
                  {sessao.feedback.comentario && (
                    <p className="text-gray-600 text-sm mt-1">{sessao.feedback.comentario}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botão voltar */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/perfil')}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-base font-medium"
        >
          ← Voltar ao Perfil
        </button>
      </div>
    </div>
  );
};

export default HistoricoSessoes;
