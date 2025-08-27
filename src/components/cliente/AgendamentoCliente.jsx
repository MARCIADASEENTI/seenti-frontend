// src/components/cliente/AgendamentoCliente.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';
import './AgendamentoCliente.css'; // ✅ NOVO: CSS para corrigir checkbox estranho

const AgendamentoCliente = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    data_solicitada: '',
    hora_solicitada: '',
    observacoes: ''
  });
  
  // Estado dos agendamentos
  const [agendamentos, setAgendamentos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  
  // Estado da interface
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editObservacoes, setEditObservacoes] = useState('');

  // ✅ SIMPLIFICADO: Removidas variáveis de filtros não utilizadas
  // const [filtroStatus, setFiltroStatus] = useState('todos');
  // const [ordenacao, setOrdenacao] = useState('data_desc');
  // const [buscaTexto, setBuscaTexto] = useState('');

  // ✅ SIMPLIFICADO: Removido viewMode não utilizado
  // const [viewMode, setViewMode] = useState('list');

  // ✅ SIMPLIFICADO: Agendamentos sem filtros - apenas ordenação por data
  const agendamentosOrdenados = useMemo(() => {
    if (!agendamentos || !Array.isArray(agendamentos)) {
      return [];
    }
    
    // Ordenar por data (mais recente primeiro) e pegar apenas os 2 últimos
    return [...agendamentos]
      .sort((a, b) => new Date(b.data_solicitada) - new Date(a.data_solicitada))
      .slice(0, 2); // ✅ NOVO: Apenas os 2 últimos agendamentos
  }, [agendamentos]);

  // ✅ NOVO: Função para verificar se pode solicitar novo agendamento
  const podeSolicitarNovoAgendamento = () => {
    const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'pendente');
    return agendamentosPendentes.length < 2;
  };

  // ✅ NOVO: Função para obter mensagem de limite de agendamentos
  const getMensagemLimiteAgendamentos = () => {
    const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'pendente');
    const limite = 2;
    
    if (agendamentosPendentes.length >= limite) {
      return `⚠️ Você já possui ${agendamentosPendentes.length} agendamento(s) pendente(s). Aguarde a confirmação antes de solicitar novos.`;
    }
    
    return `✅ Você pode solicitar até ${limite - agendamentosPendentes.length} agendamento(s) adicional(is).`;
  };

  // ✅ CORREÇÃO CRÍTICA: Carregar dados do cliente e agendamentos
  useEffect(() => {
    const carregarDadosInicial = async () => {
      try {
        setLoading(true);
        
        // ✅ CORREÇÃO: Buscar dados do cliente do localStorage ANTES de qualquer coisa
        const clienteIdLocal = localStorage.getItem('cliente_id');
        console.log('🔍 AgendamentoCliente: localStorage cliente_id:', clienteIdLocal);
        
        if (!clienteIdLocal) {
          console.error('❌ AgendamentoCliente: cliente_id não encontrado no localStorage');
          setErro('ID do cliente não encontrado');
          setLoading(false);
          return;
        }
        
        // ✅ CORREÇÃO: Definir o clienteId no estado ANTES de carregar agendamentos
        setClienteId(clienteIdLocal);
        console.log('✅ AgendamentoCliente: clienteId configurado com sucesso');
        
        // ✅ CORREÇÃO: Carregar agendamentos APENAS após clienteId estar definido
        await carregarAgendamentos(clienteIdLocal);
        
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados do cliente');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDadosInicial();
  }, []);

  const carregarAgendamentos = async (id) => {
    try {
      console.log('🔍 AgendamentoCliente: Carregando agendamentos para cliente:', id);
      
      if (!id) {
        console.error('❌ AgendamentoCliente: ID do cliente é null/undefined');
        return;
      }
      
      const response = await api.get(`/agendamentos/cliente/${id}`);
      console.log('🔍 AgendamentoCliente: Resposta da API:', response.data);
      
      if (response.status === 200) {
        // ✅ CORREÇÃO: Verificar estrutura da resposta
        let agendamentosData = [];
        
        if (response.data.data && Array.isArray(response.data.data.agendamentos)) {
          agendamentosData = response.data.data.agendamentos;
        } else if (Array.isArray(response.data)) {
          agendamentosData = response.data;
        } else if (response.data.agendamentos && Array.isArray(response.data.agendamentos)) {
          agendamentosData = response.data.agendamentos;
        }
        
        setAgendamentos(agendamentosData);
        console.log('✅ Agendamentos carregados:', agendamentosData.length);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!clienteId) {
      setErro('ID do cliente não encontrado');
      return;
    }
    
    // ✅ NOVO: Verificar limite de agendamentos pendentes
    if (!podeSolicitarNovoAgendamento()) {
      setErro('Você já possui 2 agendamentos pendentes. Aguarde a confirmação antes de solicitar novos.');
      return;
    }
    
    if (!formData.data_solicitada || !formData.hora_solicitada) {
      setErro('Data e hora são obrigatórias');
      return;
    }

    try {
      setSaving(true);
      setErro('');
      
      const response = await api.post(`/agendamentos/cliente/${clienteId}`, formData);
      
      if (response.status === 201) {
        setSucesso('✅ Agendamento solicitado com sucesso!');
        setFormData({
          data_solicitada: '',
          hora_solicitada: '',
          observacoes: ''
        });
        setShowForm(false);
        
        // Recarregar agendamentos
        await carregarAgendamentos(clienteId);
        
        setTimeout(() => setSucesso(''), 3000);
      }
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      setErro(error.response?.data?.erro || 'Erro ao solicitar agendamento');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = async (agendamentoId) => {
    if (!clienteId) {
      setErro('ID do cliente não encontrado');
      return;
    }

    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      const response = await api.patch(`/agendamentos/${agendamentoId}/cancelar`, {
        cliente_id: clienteId
      });
      
      if (response.status === 200) {
        setSucesso('✅ Agendamento cancelado com sucesso!');
        await carregarAgendamentos(clienteId);
        setTimeout(() => setSucesso(''), 3000);
      }
    } catch (error) {
      console.error('❌ Erro ao cancelar agendamento:', error);
      setErro(error.response?.data?.erro || 'Erro ao cancelar agendamento');
    }
  };

  const handleEditarObservacoes = async (agendamentoId) => {
    if (!clienteId) {
      setErro('ID do cliente não encontrado');
      return;
    }

    try {
      const response = await api.patch(`/agendamentos/${agendamentoId}/observacoes`, {
        cliente_id: clienteId,
        observacoes: editObservacoes
      });
      
      if (response.status === 200) {
        setSucesso('✅ Observações atualizadas com sucesso!');
        setEditingId(null);
        setEditObservacoes('');
        await carregarAgendamentos(clienteId);
        setTimeout(() => setSucesso(''), 3000);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar observações:', error);
      setErro(error.response?.data?.erro || 'Erro ao atualizar observações');
    }
  };

  const handleSalvarObservacoes = async () => {
    if (!editingId) return;
    await handleEditarObservacoes(editingId);
  };

  const formatarData = (dataString) => {
    try {
      // Se for um objeto MongoDB com $date
      if (dataString && typeof dataString === 'object' && dataString.$date) {
        const data = new Date(dataString.$date);
        return data.toLocaleDateString('pt-BR');
      }
      
      // Se for uma string ou Date
      if (dataString) {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) {
          return 'Data inválida';
        }
        return data.toLocaleDateString('pt-BR');
      }
      
      return 'Data não informada';
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // ✅ NOVO: Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'status-confirmado px-2 py-1 rounded-full text-xs font-medium';
      case 'pendente':
        return 'status-pendente px-2 py-1 rounded-full text-xs font-medium';
      case 'cancelado':
        return 'status-cancelado px-2 py-1 rounded-full text-xs font-medium';
      case 'rejeitado':
        return 'status-rejeitado px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'status-cancelado px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  // ✅ SIMPLIFICADO: Função limparFiltros removida - não utilizada

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ MELHORADO: Header principal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6">
          {/* ✅ NOVO: Botão Voltar ao Perfil */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/perfil')}
              className="seenti-btn-secondary text-white px-4 py-2 rounded-lg hover:seenti-hover-bg-secondary-dark transition-all duration-200 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Voltar ao Perfil</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-2">
                📅 Meus Agendamentos
              </h1>
              <p className="text-blue-100">
                Gerencie suas solicitações de agendamento de forma organizada
              </p>
            </div>
            
            {/* ✅ NOVO: Botão condicional baseado no limite de agendamentos */}
            {podeSolicitarNovoAgendamento() ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="seenti-btn-primary px-6 py-3 font-medium"
              >
                {showForm ? 'Fechar Formulário' : '+ Novo Agendamento'}
              </button>
            ) : (
              <div className="text-center">
                <div className="seenti-bg-warning seenti-text-warning px-4 py-2 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium">⚠️ Limite de Agendamentos</p>
                  <p className="text-xs">Aguarde confirmação dos pendentes</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ RESTAURADO: Formulário de novo agendamento - POSICIONADO AQUI */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Novo Agendamento</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" style={{ position: 'relative' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data do Agendamento
                  </label>
                  <input
                    type="date"
                    name="data_solicitada"
                    value={formData.data_solicitada}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  <select
                    name="hora_solicitada"
                    value={formData.hora_solicitada}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Selecione o horário</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Descreva suas necessidades para o agendamento..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 seenti-btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Salvando...' : 'Solicitar Agendamento'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ✅ MELHORADO: Mensagens de feedback */}
        {erro && (
          <div className="seenti-card seenti-bg-error text-white px-4 py-3 mb-4">
            <span className="block sm:inline">{erro}</span>
            <button
              onClick={() => setErro('')}
              className="float-right text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {sucesso && (
          <div className="seenti-card seenti-bg-success text-white px-4 py-3 mb-4">
            <span className="block sm:inline">{sucesso}</span>
            <button
              onClick={() => setSucesso('')}
              className="float-right text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ✅ NOVO: Mensagem de limite de agendamentos */}
        <div className="seenti-card seenti-bg-info text-white px-4 py-3 mb-4">
          <p className="text-sm font-medium">{getMensagemLimiteAgendamentos()}</p>
        </div>

        {/* ✅ RESPONSIVO: Lista de agendamentos adaptativa */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header da lista */}
          <div className="seenti-bg-primary px-3 sm:px-6 py-3 sm:py-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">📋 Últimos Agendamentos</h3>
            <p className="agendamento-header-text text-xs sm:text-sm opacity-90">
              Mostrando os 2 agendamentos mais recentes de {agendamentos.length} total
            </p>
          </div>

          {/* Versão Mobile: Cards responsivos */}
          <div className="agendamento-cards-mobile block sm:hidden">
            {agendamentosOrdenados && agendamentosOrdenados.length > 0 ? (
              agendamentosOrdenados.map((agendamento) => (
                <div key={agendamento._id} className="p-3 border-b border-gray-200 last:border-b-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">
                          🗓️ {formatarData(agendamento.data_solicitada)} às {agendamento.hora_solicitada}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          📅 Criado em: {agendamento.criado_em ? formatarData(agendamento.criado_em) : 'N/A'}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                        {agendamento.status}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-700">
                      📝 {agendamento.observacoes || 'Nenhuma observação'}
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingId(agendamento._id);
                          setEditObservacoes(agendamento.observacoes || '');
                        }}
                        className="seenti-btn-secondary text-xs px-2 py-1"
                      >
                        ✏️ Editar
                      </button>
                      {agendamento.status === 'pendente' && (
                        <button
                          onClick={() => handleCancelar(agendamento._id)}
                          className="seenti-btn-accent text-xs px-2 py-1"
                        >
                          ❌ Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                Nenhum agendamento encontrado
              </div>
            )}
          </div>

          {/* Versão Desktop: Tabela tradicional */}
          <div className="agendamento-table-desktop hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    🗓️ Data
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    🕒 Horário
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    📄 Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    📝 Observações
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    📅 Criado em
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ⚙️ Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agendamentosOrdenados && agendamentosOrdenados.length > 0 ? (
                  agendamentosOrdenados.map((agendamento) => (
                    <tr key={agendamento._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatarData(agendamento.data_solicitada)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agendamento.hora_solicitada}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                          {agendamento.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {agendamento.observacoes || 'Nenhuma observação'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agendamento.criado_em ? formatarData(agendamento.criado_em) : 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingId(agendamento._id);
                            setEditObservacoes(agendamento.observacoes || '');
                          }}
                          className="seenti-btn-secondary mr-3"
                        >
                          ✏️ Editar
                        </button>
                        {agendamento.status === 'pendente' && (
                          <button
                            onClick={() => handleCancelar(agendamento._id)}
                            className="seenti-btn-accent"
                          >
                            ❌ Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-gray-500">
                      Nenhum agendamento encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ NOVO: Modal de edição */}
        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Observações</h3>
              
              <textarea
                value={editObservacoes}
                onChange={(e) => setEditObservacoes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Digite suas observações..."
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSalvarObservacoes}
                  className="flex-1 seenti-btn-primary px-4 py-2"
                >
                  💾 Salvar
                </button>
                
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditObservacoes('');
                  }}
                  className="flex-1 seenti-btn-secondary px-4 py-2"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendamentoCliente;
