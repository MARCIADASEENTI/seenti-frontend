// src/components/cliente/PaginaCliente.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PaginaCliente() {
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const [mostrarDados, setMostrarDados] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [anamnese, setAnamnese] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  
  // ✅ SISTEMA DE FEEDBACK COMPLETO
  const [feedback, setFeedback] = useState({
    avaliacao: 0,
    comentarios: '',
    enviado: false
  });
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);
  const [feedbackSucesso, setFeedbackSucesso] = useState('');
  const [feedbackErro, setFeedbackErro] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      setErro('');
      setLoading(true);

      console.log('🔍 PaginaCliente: Iniciando busca de dados do cliente...');
      
      const cliente_id = localStorage.getItem('cliente_id');
      const usuario_id = localStorage.getItem('usuario_id');
      
      console.log('🔍 PaginaCliente: Dados do localStorage:', {
        cliente_id,
        usuario_id
      });
      
      if (!cliente_id) {
        console.log('❌ PaginaCliente: cliente_id não encontrado no localStorage');
        setErro('⚠️ Cliente não autenticado. Faça login novamente.');
        navigate('/login');
        return;
      }

      try {
        console.log('🔍 PaginaCliente: Buscando dados do cliente:', cliente_id);
        const res = await api.get(`/clientes/${cliente_id}`);
        if (res.status === 200) {
          const data = res.data;
          console.log('✅ PaginaCliente: Dados do cliente carregados:', data);
          setCliente(data);
        } else {
          console.log('❌ PaginaCliente: Resposta não foi 200:', res.status);
          setErro('⚠️ Não foi possível carregar os dados do cliente.');
        }
      } catch (err) {
        console.error('❌ PaginaCliente: Erro ao buscar dados:', err);
        setErro('⚠️ Erro ao buscar dados do cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [navigate]);

  // NOVO: Buscar status de agendamentos e anamnese
  useEffect(() => {
    const fetchStatus = async () => {
      if (!cliente?._id) return;
      
      setLoadingStatus(true);
      try {
        // Buscar agendamentos do cliente
        const resAgendamentos = await api.get(`/agendamentos/cliente/${cliente._id}`);
        if (resAgendamentos.status === 200) {
          // ✅ CORREÇÃO: Garantir que agendamentos seja sempre um array
          const dadosAgendamentos = resAgendamentos.data;
          if (Array.isArray(dadosAgendamentos)) {
            setAgendamentos(dadosAgendamentos);
          } else {
            console.warn('⚠️ PaginaCliente: API retornou agendamentos não-array:', dadosAgendamentos);
            setAgendamentos([]);
          }
        }
        
        // Buscar anamnese do cliente
        const resAnamnese = await api.get(`/anamneses/cliente/${cliente._id}`);
        if (resAnamnese.status === 200) {
          setAnamnese(resAnamnese.data);
        }
      } catch (err) {
        console.error('❌ PaginaCliente: Erro ao buscar status:', err);
        // ✅ CORREÇÃO: Em caso de erro, definir arrays vazios
        setAgendamentos([]);
        setAnamnese(null);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [cliente?._id]);

  const handleNovaAnamnese = () => {
    navigate('/anamnese');
  };

  // ✅ FUNÇÕES DO SISTEMA DE FEEDBACK
  const handleAvaliacaoChange = (estrelas) => {
    setFeedback(prev => ({
      ...prev,
      avaliacao: estrelas
    }));
  };

  const handleComentariosChange = (e) => {
    setFeedback(prev => ({
      ...prev,
      comentarios: e.target.value
    }));
  };

  const handleEnviarFeedback = async () => {
    // Validação
    if (feedback.avaliacao === 0) {
      setFeedbackErro('Por favor, selecione uma avaliação antes de enviar.');
      setTimeout(() => setFeedbackErro(''), 5000);
      return;
    }

    setEnviandoFeedback(true);
    setFeedbackErro('');
    setFeedbackSucesso('');

    try {
      const cliente_id = localStorage.getItem('cliente_id');
      if (!cliente_id) {
        setFeedbackErro('Cliente não autenticado. Faça login novamente.');
        return;
      }

      const dadosFeedback = {
        cliente_id: cliente_id,
        rating: feedback.avaliacao,  // ✅ CORREÇÃO: Mudando de 'avaliacao' para 'rating'
        comentarios: feedback.comentarios
        // ✅ CORREÇÃO: Removendo campos extras que o backend não espera
      };

      console.log('📤 Enviando feedback:', dadosFeedback);

      const response = await api.post('/feedback', dadosFeedback);
      
      if (response.status === 200 || response.status === 201) {
        setFeedbackSucesso('✅ Feedback enviado com sucesso! Obrigado por sua opinião.');
        setFeedback(prev => ({
          ...prev,
          enviado: true
        }));
        
        setTimeout(() => setFeedbackSucesso(''), 5000);
        console.log('✅ Feedback enviado com sucesso:', response.data);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar feedback:', error);
      setFeedbackErro('❌ Erro ao enviar feedback. Tente novamente.');
      setTimeout(() => setFeedbackErro(''), 5000);
    } finally {
      setEnviandoFeedback(false);
    }
  };

  const resetarFeedback = () => {
    setFeedback({
      avaliacao: 0,
      comentarios: '',
      enviado: false
    });
    setFeedbackSucesso('');
    setFeedbackErro('');
  };

  // NOVO: Funções para status condicional
  const getStatusAgendamento = () => {
    if (loadingStatus) return null;
    
    // ✅ CORREÇÃO: Garantir que agendamentos seja um array
    if (!Array.isArray(agendamentos)) {
      console.warn('⚠️ PaginaCliente: agendamentos não é um array:', agendamentos);
      return {
        tipo: 'erro',
        mensagem: 'Erro ao carregar agendamentos',
        cor: 'red'
      };
    }
    
    const agendamentoConfirmado = agendamentos.find(ag => ag.status === 'confirmada');
    const agendamentoPendente = agendamentos.find(ag => ag.status === 'agendada');
    
    if (agendamentoConfirmado) {
      // ✅ CORREÇÃO: Validar data antes de formatar
      let dataFormatada = 'Data não disponível';
      if (agendamentoConfirmado.data) {
        const data = new Date(agendamentoConfirmado.data);
        if (!isNaN(data.getTime())) {
          dataFormatada = data.toLocaleDateString('pt-BR');
        }
      }
      
      return {
        tipo: 'confirmado',
        mensagem: `Agendamento confirmado para ${dataFormatada}`,
        cor: 'green'
      };
    }
    
    if (agendamentoPendente) {
      return {
        tipo: 'pendente',
        mensagem: 'Agendamento pendente - aguardando terapeuta',
        cor: 'yellow'
      };
    }
    
    return {
      tipo: 'nenhum',
      mensagem: 'Nenhum agendamento confirmado - Solicite um atendimento',
      cor: 'gray'
    };
  };

  const getStatusAnamnese = () => {
    if (loadingStatus) return null;
    
    if (anamnese) {
      // ✅ CORREÇÃO: Validar data antes de formatar
      let dataFormatada = 'Data não disponível';
      if (anamnese.data_criacao) {
        const data = new Date(anamnese.data_criacao);
        if (!isNaN(data.getTime())) {
          dataFormatada = data.toLocaleDateString('pt-BR');
        }
      }
      
      return {
        tipo: 'concluida',
        mensagem: `Anamnese concluída em ${dataFormatada}`,
        cor: 'green'
      };
    }
    
    return {
      tipo: 'pendente',
      mensagem: 'Preencha sua anamnese inicial para agilizar seu atendimento',
      cor: 'yellow'
    };
  };

  // Formatação
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    if (telefone.length === 11) return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };
  const formatarData = (data) => {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-full">
      {/* Controles de dados pessoais */}
      <div className="mb-3 md:mb-4 flex justify-center">
        <button
          onClick={() => setMostrarDados(!mostrarDados)}
          className="w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm font-medium"
        >
          {mostrarDados ? '👁️‍🗨️ Ocultar Dados' : '👁️ Mostrar Dados Pessoais'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-6 md:py-8">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-green-600 mx-auto mb-3 md:mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Carregando dados...</p>
        </div>
      )}
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-lg mb-4 md:mb-6 text-center text-sm md:text-base">
          {erro}
        </div>
      )}

      {cliente && (
        <>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-center text-green-700 px-2">
            Olá, {cliente.primeiro_nome}! Bem-vindo(a) de volta à sua jornada de bem-estar! ✅
            <br />
            <span className="text-sm text-gray-500">Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
          </h2>

          {/* ✅ REMOVIDO: Seção de Status - Sprint 07 */}

          {mostrarDados && (
            <section
              aria-labelledby="dados-pessoais-title"
              className="bg-green-50 border border-green-200 p-3 md:p-4 rounded-lg mb-3 md:mb-4"
            >
              <h3 id="dados-pessoais-title" className="font-bold mb-3 md:mb-4 text-green-700 text-base md:text-lg">
                📋 Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-gray-800 text-sm md:text-base">
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>Nome:</strong> {cliente.primeiro_nome} {cliente.sobrenome}
                </div>
                {cliente.nome_social && (
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Nome Social:</strong> {cliente.nome_social}
                  </div>
                )}
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>CPF:</strong> {formatarCPF(cliente.cpf)}
                </div>
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>Data de Nascimento:</strong> {formatarData(cliente.data_nascimento)}
                </div>
                {cliente.genero && (
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Gênero:</strong> {cliente.genero}
                  </div>
                )}
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>Telefone:</strong> {formatarTelefone(cliente.contato?.telefone)}
                </div>
                {cliente.contato?.email_alternativo && (
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Email Alternativo:</strong> {cliente.contato.email_alternativo}
                  </div>
                )}
              </div>

              {/* Endereço */}
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-green-200">
                <h4 className="font-semibold mb-2 md:mb-3 text-green-700 text-sm md:text-base">📍 Endereço</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Rua:</strong> {cliente.endereco?.rua}, {cliente.endereco?.numero}
                  </div>
                  {cliente.endereco?.complemento && (
                    <div className="p-2 md:p-3 bg-white rounded border">
                      <strong>Complemento:</strong> {cliente.endereco.complemento}
                    </div>
                  )}
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Bairro:</strong> {cliente.endereco?.bairro}
                  </div>
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Cidade:</strong> {cliente.endereco?.cidade} - {cliente.endereco?.estado}
                  </div>
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>CEP:</strong> {cliente.endereco?.cep}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Seção de Feedback para o Usuário */}
          <section className="bg-[#1E3A8A]/10 border border-[#1E3A8A]/30 p-3 md:p-4 rounded-lg mb-3 md:mb-4">
            <h3 className="font-bold mb-3 md:mb-4 text-[#1E3A8A] text-base md:text-lg">
              💬 Sua Opinião é Importante
            </h3>
            
            {feedback.enviado ? (
              <div className="text-center py-3 md:py-4">
                <p className="text-green-700 font-medium mb-3 text-sm md:text-base">Obrigado pelo seu feedback!</p>
                <button
                  onClick={resetarFeedback}
                  className="px-3 py-2 bg-[#1E3A8A] text-white rounded-md hover:bg-[#1E3A8A]/80 transition-colors text-sm"
                >
                  Enviar Novo Feedback
                </button>
              </div>
            ) : (
              <>
                <p className="text-[#1E3A8A] mb-3 md:mb-4 text-xs md:text-sm">
                  Ajude-nos a melhorar sua experiência na plataforma. Como está sendo sua jornada até agora?
                </p>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <span className="text-xs md:text-sm text-[#AC80DD] font-medium">Experiência geral:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleAvaliacaoChange(star)}
                          className={`text-yellow-400 hover:text-yellow-500 text-lg md:text-xl transition-colors ${
                            feedback.avaliacao >= star ? 'opacity-100' : 'opacity-50'
                          }`}
                          title={`${star} estrela${star > 1 ? 's' : ''}`}
                          disabled={enviandoFeedback}
                        >
                          {feedback.avaliacao >= star ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                    {feedback.avaliacao > 0 && (
                      <span className="text-xs text-[#AC80DD]">
                        ({feedback.avaliacao} estrela{feedback.avaliacao > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[#1E3A8A] mb-2">
                      Comentários ou sugestões:
                    </label>
                    <textarea
                      className="w-full p-2 md:p-3 border border-[#1E3A8A]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none text-xs md:text-sm"
                      rows="2"
                      placeholder="Conte-nos como podemos melhorar..."
                      value={feedback.comentarios}
                      onChange={handleComentariosChange}
                      disabled={enviandoFeedback}
                    />
                  </div>
                  
                  {/* Mensagens de feedback */}
                  {feedbackSucesso && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-xs md:text-sm">
                      {feedbackSucesso}
                    </div>
                  )}
                  
                  {feedbackErro && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs md:text-sm">
                      {feedbackErro}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleEnviarFeedback}
                      disabled={enviandoFeedback || feedback.avaliacao === 0}
                      className={`px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                        enviandoFeedback || feedback.avaliacao === 0
                          ? 'bg-[#1E3A8A] cursor-not-allowed text-white'
                          : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white'
                      }`}
                    >
                      {enviandoFeedback ? (
                        <>
                          <span className="animate-spin inline-block w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Feedback'
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          <section
            aria-labelledby="funcionalidades-title"
            className="bg-white border border-[#1E3A8A]/30 p-3 md:p-4 rounded-lg shadow-sm"
          >
            <h3 id="funcionalidades-title" className="font-bold mb-3 md:mb-4 text-[#1E3A8A] text-base md:text-lg">
              🚀 Funcionalidades Disponíveis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              <button
                onClick={handleNovaAnamnese}
                className="p-2 md:p-3 border border-[#1E3A8A]/30 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-sm md:text-base">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1E3A8A] group-hover:text-green-700 text-sm md:text-base">Nova Anamnese</h4>
                    <p className="text-xs md:text-sm text-[#AC80DD]">Atualizar dados de saúde</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/agendamentos')}
                className="p-2 md:p-3 border border-[#1E3A8A]/30 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-sm md:text-base">📅</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1E3A8A] group-hover:text-blue-700 text-sm md:text-base">Agendamentos</h4>
                    <p className="text-xs md:text-sm text-[#AC80DD]">Gerenciar consultas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/historico')}
                className="p-2 md:p-3 border border-[#1E3A8A]/30 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-purple-600 text-sm md:text-base">📊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1E3A8A] group-hover:text-purple-700 text-sm md:text-base">Histórico</h4>
                    <p className="text-xs md:text-sm text-[#AC80DD]">Sessões realizadas</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
