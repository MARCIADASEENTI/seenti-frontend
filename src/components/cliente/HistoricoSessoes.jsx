import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';
import IconesGlobais from '../globais/IconesGlobais';

const HistoricoSessoes = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Estados para dados e filtros
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtros, setFiltros] = useState({
    status: 'todas',
    periodo: 'todas',
    data_inicio: '',
    data_fim: '',
    ordenacao: 'data_desc'
  });
  const [filtrosDisponiveis, setFiltrosDisponiveis] = useState({
    status: [],
    periodos: [],
    ordenacao: []
  });
  const [estatisticas, setEstatisticas] = useState({});
  const [paginacao, setPaginacao] = useState({
    pagina_atual: 1,
    total_paginas: 1,
    total_registros: 0,
    limite: 50
  });

  // Carregar filtros disponíveis
  useEffect(() => {
    const carregarFiltros = async () => {
      try {
        const response = await api.get('/api/v1/historico/filtros');
        if (response.status === 200 && response.data.success) {
          setFiltrosDisponiveis(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao carregar filtros:', error);
      }
    };

    carregarFiltros();
  }, []);

  // Carregar histórico de sessões
  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true);
        setErro('');

        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) {
          setErro('Cliente não autenticado');
          navigate('/login');
          return;
        }

        // Construir parâmetros da query
        const params = new URLSearchParams({
          cliente_id: cliente_id,
          ...filtros,
          pagina: paginacao.pagina_atual,
          limite: paginacao.limite
        });

        const response = await api.get(`/api/v1/historico?${params}`);
        
        if (response.status === 200 && response.data.success) {
          const data = response.data.data;
          setAgendamentos(data.agendamentos);
          setEstatisticas(data.estatisticas);
          setPaginacao(data.paginacao);
        } else {
          setErro('Erro ao carregar dados do histórico');
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        if (error.response?.status === 404) {
          setErro('Endpoint de histórico não encontrado');
        } else if (error.response?.status === 400) {
          setErro('Parâmetros inválidos para busca');
        } else {
          setErro('Erro ao carregar histórico de sessões');
        }
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [navigate, filtros, paginacao.pagina_atual]);

  // Carregar estatísticas
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) return;

        const params = new URLSearchParams({ cliente_id });
        const response = await api.get(`/api/v1/historico/estatisticas?${params}`);
        
        if (response.status === 200 && response.data.success) {
          setEstatisticas(response.data.data.resumo);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    carregarEstatisticas();
  }, []);

  // Atualizar filtros
  const atualizarFiltros = (novosFiltros) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
    setPaginacao(prev => ({ ...prev, pagina_atual: 1 })); // Reset para primeira página
  };

  // Mudar página
  const mudarPagina = (novaPagina) => {
    setPaginacao(prev => ({ ...prev, pagina_atual: novaPagina }));
  };

  // Formatar data
  const formatarData = (dataString, horaString) => {
    if (!dataString) return 'N/A';
    
    try {
      let data;
      if (typeof dataString === 'object' && dataString.$date) {
        // Formato MongoDB ISO
        data = new Date(dataString.$date);
      } else {
        data = new Date(dataString);
      }
      
      const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      if (horaString) {
        return `${dataFormatada} ${horaString}`;
      }
      
      return dataFormatada;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'N/A';
    }
  };

  // Formatar status
  const formatarStatus = (status) => {
    const statusMap = {
      'pendente': { label: 'Pendente', cor: 'text-yellow-600 bg-yellow-100' },
      'confirmada': { label: 'Confirmada', cor: 'text-blue-600 bg-blue-100' },
      'realizada': { label: 'Realizada', cor: 'text-green-600 bg-green-100' },
      'cancelada': { label: 'Cancelada', cor: 'text-red-600 bg-red-100' },
      'rejeitada': { label: 'Rejeitada', cor: 'text-red-600 bg-red-100' }
    };
    
    const statusInfo = statusMap[status] || { label: status, cor: 'text-gray-600 bg-gray-100' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.cor}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Formatar valor
  const formatarValor = (valor) => {
    if (!valor) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando histórico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header principal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6">
          {/* ✅ CORRIGIDO: Header com ícones na mesma linha - CSS EXPLÍCITO */}
          <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* ✅ Ícone de casa (Voltar ao Perfil) */}
            <button
              onClick={() => navigate('/perfil')}
              className="text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
              title="Voltar ao Perfil"
              style={{ flexShrink: 0, border: 'none', background: 'transparent' }}
            >
              <span className="text-xl">🏠</span>
            </button>
            
            {/* ✅ Título centralizado */}
            <div className="text-center flex-1" style={{ flex: 1, textAlign: 'center' }}>
              <h1 className="font-cliente-destaque text-3xl text-white mb-2">
                📊 Histórico de Sessões
              </h1>
              <p className="font-info-secundaria text-blue-100">
                Acompanhe todas as suas sessões de massoterapia
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
        </div>

        {/* Filtros - Layout Compacto */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
              <select
                value={filtros.status}
                onChange={(e) => atualizarFiltros({ status: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {filtrosDisponiveis.status.map(status => (
                  <option key={status.valor} value={status.valor}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Período:</label>
              <select
                value={filtros.periodo}
                onChange={(e) => atualizarFiltros({ periodo: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {filtrosDisponiveis.periodos.map(periodo => (
                  <option key={periodo.valor} value={periodo.valor}>
                    {periodo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Início */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Início:</label>
              <input
                type="date"
                value={filtros.data_inicio}
                onChange={(e) => atualizarFiltros({ data_inicio: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Data Fim */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Fim:</label>
              <input
                type="date"
                value={filtros.data_fim}
                onChange={(e) => atualizarFiltros({ data_fim: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Ordenar:</label>
              <select
                value={filtros.ordenacao}
                onChange={(e) => atualizarFiltros({ ordenacao: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {filtrosDisponiveis.ordenacao.map(ord => (
                  <option key={ord.valor} value={ord.valor}>
                    {ord.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-cta text-lg text-gray-800">
              Sessões ({paginacao.total_registros} total)
            </h3>
          </div>

          {erro ? (
            <div className="p-6 text-center">
              <div className="text-red-600 text-lg mb-2">⚠️ {erro}</div>
              <p className="font-info-secundaria text-gray-600">Não foi possível carregar o histórico de sessões.</p>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-500 text-lg mb-2">📅</div>
              <p className="font-info-secundaria text-gray-600">Nenhuma sessão encontrada.</p>
              <p className="font-info-secundaria text-gray-500 text-sm">Você ainda não possui sessões agendadas.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duração
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agendamentos.map((agendamento) => (
                      <tr key={agendamento._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatarData(agendamento.data_solicitada, agendamento.hora_solicitada)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatarStatus(agendamento.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Massoterapia
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          60 min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ 80,00
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs">
                            {agendamento.observacoes || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {paginacao.total_paginas > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-cta text-gray-700">
                      Mostrando página {paginacao.pagina_atual} de {paginacao.total_paginas}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => mudarPagina(paginacao.pagina_atual - 1)}
                        disabled={paginacao.pagina_atual === 1}
                        className="px-3 py-2 text-sm font-cta text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => mudarPagina(paginacao.pagina_atual + 1)}
                        disabled={paginacao.pagina_atual === paginacao.total_paginas}
                        className="px-3 py-2 text-sm font-cta text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Estatísticas - Movidas para o final */}
        {estatisticas && Object.keys(estatisticas).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
            <h3 className="font-cta text-lg text-gray-800 mb-4">📊 Resumo das Sessões</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="font-cliente-destaque text-2xl text-blue-600">{estatisticas.total_sessoes || 0}</div>
                <div className="font-info-secundaria text-sm text-gray-600">Total de Sessões</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="font-cliente-destaque text-2xl text-green-600">{estatisticas.sessoes_realizadas || 0}</div>
                <div className="font-info-secundaria text-sm text-gray-600">Realizadas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="font-cliente-destaque text-2xl text-yellow-600">{estatisticas.sessoes_pendentes || 0}</div>
                <div className="font-info-secundaria text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="font-cliente-destaque text-2xl text-red-600">{estatisticas.sessoes_canceladas || 0}</div>
                <div className="font-info-secundaria text-sm text-gray-600">Canceladas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoSessoes;
