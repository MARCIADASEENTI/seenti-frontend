// src/components/cliente/PaginaCliente.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import IconesGlobais from '../globais/IconesGlobais';

export default function PaginaCliente() {
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
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

      const cliente_id = localStorage.getItem('cliente_id');
      const usuario_id = localStorage.getItem('usuario_id');
      
      if (!cliente_id) {
        setErro('⚠️ Cliente não autenticado. Faça login novamente.');
        navigate('/login');
        return;
      }

      try {
        const res = await api.get(`/clientes/${cliente_id}`);
        if (res.status === 200) {
          const data = res.data;
          setCliente(data);
        } else {
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

      {loading && (
        <div className="text-center py-6 md:py-8">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-green-600 mx-auto mb-3 md:mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Carregando dados...</p>
        </div>
      )}
      
      {erro && (
        <div className="seenti-card seenti-bg-error text-white px-3 py-2 md:px-4 md:py-3 mb-4 md:mb-6 text-center text-sm md:text-base">
          {erro}
        </div>
      )}

      {cliente && (
        <>
          <div className="mb-4 md:mb-8" style={{ textAlign: 'left' }}>
            {/* ✅ CORREÇÃO: Mensagem de boas-vindas com ícones globais na mesma linha */}
            <div className="flex items-center justify-between mb-3 md:mb-4" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%'
            }}>
              {/* ✅ Título centralizado com hierarquia tipográfica */}
              <div className="flex-1" style={{ flex: 1, textAlign: 'left' }}>
                <h1 className="font-cliente-destaque seenti-text-primary leading-tight">
                  Olá, {cliente?.nome_social ? cliente.nome_social.toUpperCase() : cliente?.primeiro_nome ? cliente.primeiro_nome.toUpperCase() : 'Cliente'}! Bem-vindo à sua jornada de bem-estar! ✅
                </h1>
                {/* ✅ NOVA: Mensagem adicional de acolhimento com fonte secundária */}
                <p className="font-info-secundaria seenti-text-secondary mt-2 md:mt-3">
                  Como está se sentindo hoje?
                </p>
              </div>
              
              {/* ✅ Ícones globais na mesma linha */}
              <div className="flex-shrink-0" style={{ flexShrink: 0, marginLeft: '1rem' }}>
                <IconesGlobais 
                  posicao="direita" 
                  tamanho="normal" 
                  mostrarBadge={true}
                />
              </div>
            </div>
            {/* ✅ REMOVIDO: Nome Social - Comentado para análise futura */}
            {/* 
            {cliente?.nome_social ? (
              <p className="text-lg seenti-text-secondary mb-2">
                Nome Social: {cliente.nome_social}
              </p>
            ) : cliente?.primeiro_nome && cliente?.sobrenome ? (
              <p className="text-lg seenti-text-secondary mb-2">
                {cliente.primeiro_nome} {cliente.sobrenome}
              </p>
            ) : null}
            */}
            
            {/* ✅ REMOVIDO: Última atualização - Horário disponível no dispositivo */}
          </div>

          {/* ✅ REMOVIDO: Seção de Status - Sprint 07 */}
          {/* ✅ REMOVIDO: Seção de Dados Pessoais - Movida para Configurações */}

          {/* ✅ REMOVIDO: Seção de Feedback movida para depois das funcionalidades */}

          {/* ✅ CORRIGIDO: Seção de Funcionalidades - Layout original com bordas pretas */}
          <section className="mb-8 md:mb-12">
            <h2 className="font-cta text-lg md:text-xl seenti-text-primary mb-4 md:mb-6 flex items-center">
              <span className="mr-2 md:mr-3">📋</span>
              O que você deseja fazer?
            </h2>
            
            <div className="flex flex-col space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6 md:space-y-0">
              {/* ✅ Card Anamnese - Layout original */}
              <button
                onClick={handleNovaAnamnese}
                className="w-full p-4 md:p-5 rounded-lg border-2 border-black hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group bg-white"
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-lg md:text-xl">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cta seenti-text-primary group-hover:text-green-700 text-sm md:text-base mb-1">
                      Anamnese
                    </h4>
                    <p className="font-info-secundaria text-xs md:text-sm seenti-text-secondary">
                      Preencher Anamnese
                    </p>
                  </div>
                </div>
              </button>

              {/* ✅ Card Agendamentos - Layout original */}
              <button
                onClick={() => navigate('/agendamentos')}
                className="w-full p-4 md:p-5 rounded-lg border-2 border-black hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group bg-white"
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-lg md:text-xl">📅</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cta seenti-text-primary group-hover:text-blue-700 text-sm md:text-base mb-1">
                      Agendamentos
                    </h4>
                    <p className="font-info-secundaria text-xs md:text-sm seenti-text-secondary">
                      Agendar sessão
                    </p>
                  </div>
                </div>
              </button>

              {/* ✅ Card Falar com o Terapeuta - Layout original */}
              <button
                onClick={() => navigate('/fale-com-terapeuta')}
                className="w-full p-4 md:p-5 rounded-lg border-2 border-black hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group bg-white"
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-purple-600 text-lg md:text-xl">💬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cta seenti-text-primary group-hover:text-purple-700 text-sm md:text-base mb-1">
                      Falar com o Terapeuta
                    </h4>
                    <p className="font-info-secundaria text-xs md:text-sm seenti-text-secondary">
                      Contatos e Saber mais
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* ✅ MELHORADO: Título da seção de feedback com fonte menor e ícone diferenciado */}
          <div className="text-center mb-4 md:mb-6">
            <h3 className="font-cta seenti-text-primary text-base md:text-lg">
              ✨ Sua opinião é muito importante! Faça seu comentário ou deixe sua sugestão!
            </h3>
          </div>

          {/* ✅ MELHORADO: Seção de Feedback sem título interno */}
          <section className="bg-white p-4 md:p-5 rounded-lg shadow-sm border-2 border-black">
            
            {feedback.enviado ? (
              <div className="text-center py-4 md:py-5">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-green-600 text-xl md:text-2xl">✅</span>
                </div>
                <p className="text-green-700 font-medium mb-4 text-sm md:text-base">
                  Obrigado pelo seu feedback!
                </p>
                <button
                  onClick={resetarFeedback}
                  className="px-4 py-2 seenti-btn-secondary text-sm md:text-base"
                >
                  Enviar Novo Feedback
                </button>
              </div>
            ) : (
              <>
                <p className="font-info-secundaria seenti-text-secondary mb-4 md:mb-5 text-sm md:text-base">
                  Ajude-nos a melhorar sua experiência na plataforma. Como está sendo sua jornada até agora?
                </p>
                
                <div className="space-y-4 md:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="text-sm md:text-base seenti-text-secondary font-medium">Experiência geral:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleAvaliacaoChange(star)}
                          className={`text-yellow-400 hover:text-yellow-500 text-xl md:text-2xl transition-colors ${
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
                      <span className="text-sm seenti-text-secondary">
                        ({feedback.avaliacao} estrela{feedback.avaliacao > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    {/* ✅ MELHORADO: Textarea sem label específico */}
                    <textarea
                      className="w-full p-4 md:p-5 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-seenti-primary focus:border-seenti-primary resize-none text-sm md:text-base"
                      rows="6"
                      placeholder="Conte-nos como podemos melhorar..."
                      value={feedback.comentarios}
                      onChange={handleComentariosChange}
                      disabled={enviandoFeedback}
                    />
                  </div>
                  
                  {/* Mensagens de feedback */}
                  {feedbackSucesso && (
                    <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm md:text-base">
                      {feedbackSucesso}
                    </div>
                  )}
                  
                  {feedbackErro && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm md:text-base">
                      {feedbackErro}
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleEnviarFeedback}
                      disabled={enviandoFeedback || feedback.avaliacao === 0}
                      className={`font-cta px-4 py-2 rounded-lg text-sm md:text-base transition-colors ${
                        enviandoFeedback || feedback.avaliacao === 0
                          ? 'seenti-btn-primary cursor-not-allowed'
                          : 'seenti-btn-primary hover:opacity-80'
                      }`}
                    >
                      {enviandoFeedback ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
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
        </>
      )}
    </div>
  );
}
