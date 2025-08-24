// src/components/cliente/AgendamentoCliente.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';

const AgendamentoCliente = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
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

  // Carregar dados do cliente e agendamentos
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do cliente do localStorage
      const clienteId = localStorage.getItem('cliente_id');
      if (!clienteId) {
        setErro('ID do cliente não encontrado');
        return;
      }
      
      setClienteId(clienteId);
      
      // Buscar agendamentos existentes
      await carregarAgendamentos(clienteId);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados do cliente');
    } finally {
      setLoading(false);
    }
  };

  const carregarAgendamentos = async (id) => {
    try {
      const response = await api.get(`/agendamentos/cliente/${id}`);
      if (response.status === 200) {
        setAgendamentos(response.data.agendamentos || []);
        console.log('✅ Agendamentos carregados:', response.data.agendamentos);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      // Não mostrar erro aqui, apenas log
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
      console.error('❌ Erro ao formatar data:', error, dataString);
      return 'Erro na data';
    }
  };

  const formatarHora = (hora) => {
    return hora;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rejeitado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente':
        return '⏳ Aguarde o retorno do terapeuta';
      case 'confirmado':
        return '✅ Confirmado pelo terapeuta';
      case 'cancelado':
        return '❌ Cancelado';
      case 'rejeitado':
        return '🚫 Rejeitado pelo terapeuta';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botão Voltar */}
              <button
                onClick={() => navigate('/perfil')}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Voltar ao Perfil</span>
              </button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  📅 Meus Agendamentos
                </h1>
                <p className="mt-2 text-gray-600">
                  Gerencie suas solicitações de agendamento
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                showForm 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showForm ? '❌ Cancelar' : '➕ Novo Agendamento'}
            </button>
          </div>
        </div>

        {/* Mensagens de feedback */}
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

        {/* Formulário de novo agendamento */}
        {showForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📝 Solicitar Novo Agendamento
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Desejada *
                  </label>
                  <input
                    type="date"
                    name="data_solicitada"
                    value={formData.data_solicitada}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Desejado *
                  </label>
                  <input
                    type="time"
                    name="hora_solicitada"
                    value={formData.hora_solicitada}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Descreva suas necessidades ou preferências..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Salvando...' : 'Solicitar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de agendamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              📋 Histórico de Agendamentos
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {agendamentos.length} agendamento(s) encontrado(s)
            </p>
          </div>
          
          {agendamentos.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600">
                Você ainda não possui agendamentos. Clique em "Novo Agendamento" para começar.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {agendamentos.map((agendamento) => (
                <div key={agendamento._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(agendamento.status)}`}>
                          {getStatusText(agendamento.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Criado em {formatarData(agendamento.criado_em)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Data</p>
                          <p className="text-lg text-gray-900">
                            {formatarData(agendamento.data_solicitada)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Horário</p>
                          <p className="text-lg text-gray-900">
                            {formatarHora(agendamento.hora_solicitada)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Status</p>
                          <p className="text-lg text-gray-900">
                            {getStatusText(agendamento.status)}
                          </p>
                        </div>
                      </div>
                      
                      {agendamento.observacoes && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Observações</p>
                          <p className="text-gray-900">{agendamento.observacoes}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Ações */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {agendamento.status === 'pendente' && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(agendamento._id);
                              setEditObservacoes(agendamento.observacoes || '');
                            }}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          >
                            ✏️ Editar
                          </button>
                          
                          <button
                            onClick={() => handleCancelar(agendamento._id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            ❌ Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Modal de edição inline */}
                  {editingId === agendamento._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <textarea
                          value={editObservacoes}
                          onChange={(e) => setEditObservacoes(e.target.value)}
                          rows="2"
                          placeholder="Digite suas observações..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditObservacoes('');
                            }}
                            className="px-3 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleEditarObservacoes(agendamento._id)}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendamentoCliente;
