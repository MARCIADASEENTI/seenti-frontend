import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';
import { useAnamneseValidation } from '../../hooks/useAnamneseValidation';
import VinculacaoAnamnese from './VinculacaoAnamnese';
import IconesGlobais from '../globais/IconesGlobais';

const AnamneseCliente = () => {
  // 🔍 TESTE SIMPLES (removido para evitar loop infinito)
  
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [anamneseExistente, setAnamneseExistente] = useState(false);
  const [mensagemAnamnese, setMensagemAnamnese] = useState('');
  const [dadosCliente, setDadosCliente] = useState(null);
  const [anamneseId, setAnamneseId] = useState(null);
  const [vinculacaoSucesso, setVinculacaoSucesso] = useState(false);

  // ✅ PADRONIZADO: Usando tema Seenti oficial
  // Removido hardcoded colors - usando classes CSS do tema

  // NOVA ESTRUTURA DE DADOS - REFATORADA Sprint 07
  const [form, setForm] = useState({
    objetivo: '',
    dor_atual: '',
    nivel_dor: 5,
    historico_saude: {
      pressao_alta: false,
      diabetes: false,
      pressao_alta_controle: '',
      diabetes_controle: '',
      alergias: '',
      sintomas_pernas: ''
    },
    habitos: {
      funcionamento_intestinal: '',
      alimentacao: '',
      anticoncepcional: '',
      gestante: ''
    },
    historico_clinico: {
      estresse: false,
      enxaqueca: false,
      depressao: false,
      insonia: false,
      dor_mandibula: false,
      bruxismo: false,
      disturbio_renal: '',
      antecedente_oncologico: '',
      pedra_rim: false,
      pedra_vesicula: false,
      doenca_cronica: ''
    },
    restricoes: {
      nao_gosta_massagem_em: ''
    },
    conduta_tratamento: '',
    aceite_termo: false
  });

  // ✅ NOVO: Funções para formatação de dados
  const formatarNomeCompleto = (cliente) => {
    if (!cliente) return 'Não informado';
    
    // ✅ CORREÇÃO: Sempre usar primeiro nome + sobrenome (não nome social)
    const primeiroNome = cliente.primeiro_nome || '';
    const sobrenome = cliente.sobrenome || '';
    const nomeCompleto = `${primeiroNome} ${sobrenome}`.trim();
    
    if (!nomeCompleto) return 'Não informado';
    
    // Capitalizar primeira letra de cada palavra
    return nomeCompleto.split(' ').map(nome => 
      nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return 'Não informado';
    
    // Remover caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) return cpf;
    
    // Formatar: 970.609.***.***-87
    return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.***.***-${cpfLimpo.slice(9, 11)}`;
  };

  const formatarTelefone = (cliente) => {
    if (!cliente) return 'Não informado';
    
    const telefone = cliente.contato?.telefone || cliente.telefone || cliente.celular;
    
    if (!telefone) return 'Não informado';
    
    // Remover caracteres não numéricos
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    if (telefoneLimpo.length === 11) {
      // Formato: (31) 98794-4590
      return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 7)}-${telefoneLimpo.slice(7, 11)}`;
    } else if (telefoneLimpo.length === 10) {
      // Formato: (31) 9879-4459
      return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 6)}-${telefoneLimpo.slice(6, 10)}`;
    }
    
    return telefone;
  };

  const formatarDataNascimento = (cliente) => {
    if (!cliente || !cliente.data_nascimento) {
      return 'Não informado';
    }
    
    try {
      // ✅ CORREÇÃO: Tratar diferentes formatos de data
      let data;
      
      if (typeof cliente.data_nascimento === 'string') {
        // Se for string, tentar parsear
        data = new Date(cliente.data_nascimento);
      } else if (cliente.data_nascimento instanceof Date) {
        // Se já for Date
        data = cliente.data_nascimento;
      } else if (cliente.data_nascimento && typeof cliente.data_nascimento === 'object' && cliente.data_nascimento.$date) {
        // ✅ NOVO: Tratar formato MongoDB {"$date": "1972-04-25T00:00:00Z"}
        data = new Date(cliente.data_nascimento.$date);
      } else {
        // Se for objeto com timestamp
        data = new Date(cliente.data_nascimento);
      }
      
      // Verificar se a data é válida
      if (isNaN(data.getTime())) {
        return 'Não informado';
      }
      
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('❌ Erro ao formatar data de nascimento:', error);
      return 'Não informado';
    }
  };

  const formatarDataAnamnese = () => {
    return new Date().toLocaleDateString('pt-BR');
  };

  // Hook de validação de anamnese
  const {
    errors,
    isFormValid,
    validarFormulario,
    handleBlur,
    handleChange: handleValidationChange,
    getCampoError,
    campoTemErro,
    campoEObrigatorio
  } = useAnamneseValidation(form, anamneseExistente);

  // Carregar dados do cliente e verificar anamnese existente
  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (cliente_id) {
          // Buscar dados do cliente
          const responseCliente = await api.get(`/clientes/${cliente_id}`);
          if (responseCliente.status === 200) {
            const cliente = responseCliente.data;
            console.log('🔍 AnamneseCliente: Dados do cliente carregados:', {
              cliente_id,
              primeiro_nome: cliente.primeiro_nome,
              sobrenome: cliente.sobrenome,
              data_nascimento: cliente.data_nascimento,
              tipo_data: typeof cliente.data_nascimento
            });
            setDadosCliente(cliente); // ✅ Armazenar dados do cliente para cabeçalho formal
            
            // Verificar se já existe anamnese para este cliente
            try {
              const responseAnamnese = await api.get(`/anamneses/cliente/${cliente_id}`);
              
              console.log('🔍 DEBUG: Resposta da API anamnese:', {
                status: responseAnamnese.status,
                data: responseAnamnese.data,
                dados: responseAnamnese.data?.dados,
                dadosNull: responseAnamnese.data?.dados === null,
                dadosTruthy: !!responseAnamnese.data?.dados
              });
              
              if (responseAnamnese.status === 200 && responseAnamnese.data && responseAnamnese.data.dados !== null) {
                // Cliente já tem anamnese - CONGELAR FORMULÁRIO
                
                // ✅ CORREÇÃO: Garantir que aceite_termo seja sempre false
                const dadosAnamnese = {
                  ...responseAnamnese.data.dados,
                  aceite_termo: false
                };
                setForm(dadosAnamnese);
                setAnamneseExistente(true);
                console.log('🔍 DEBUG: Anamnese existente detectada!');
                setMensagemAnamnese("✅ Você já possui uma anamnese registrada. Esta é uma anamnese básica que será complementada pelo terapeuta durante o atendimento presencial.");
              } else {
                // Cliente não tem anamnese - FORMULÁRIO LIBERADO
                console.log('🔍 DEBUG: Anamnese NÃO existe! Formulário liberado.');
                setAnamneseExistente(false);
                
                // GARANTIR QUE O FORMULÁRIO ESTEJA INICIALIZADO CORRETAMENTE
                setForm(prev => ({
                  ...prev,
                  objetivo: '',
                  dor_atual: '',
                  nivel_dor: 5,
                  aceite_termo: false
                }));
                
                // DEBUG: Verificar estado após inicialização
                setTimeout(() => {
                  console.log('🔍 DEBUG: Estado após inicialização:', {
                    anamneseExistente: false,
                    loading: false,
                    isFormValid: false,
                    form: {
                      objetivo: '',
                      dor_atual: '',
                      nivel_dor: 5,
                      aceite_termo: false
                    }
                  });
                }, 100);
              }
            } catch (error) {
              console.error('❌ Erro ao buscar anamnese:', error);
              setErro('Erro ao verificar anamnese existente. Tente novamente.');
            }
          } else {
            setErro('Erro ao carregar dados do cliente. Tente novamente.');
          }
        } else {
          setErro('ID do cliente não encontrado. Faça login novamente.');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados. Tente novamente.');
      } finally {
        setInitialLoading(false);
      }
    };

    carregarDadosCliente();
  }, []);

  const handleChange = (e) => {
    if (anamneseExistente) return; // Freeze form
    
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields
      const [grupo, campo] = name.split('.');
      
      if (name.includes('historico_saude.pressao_alta') || name.includes('historico_saude.diabetes')) {
        // Campos booleanos simples para pressão alta e diabetes
        setForm(prev => ({
          ...prev,
          historico_saude: {
            ...prev.historico_saude,
            [campo]: type === 'checkbox' ? checked : value
          }
        }));
      } else {
        setForm(prev => ({
          ...prev,
          [grupo]: {
            ...prev[grupo],
            [campo]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Integrar com validação em tempo real
    if (campoEObrigatorio(name)) {
      handleValidationChange(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleNivelDorChange = (valor) => {
    if (anamneseExistente) return; // Freeze form
    setForm(prev => ({ ...prev, nivel_dor: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚨 BOTÃO CLICADO! handleSubmit executado!', new Date().toISOString());
    
    console.log('🚀 AnamneseCliente: Iniciando submissão da anamnese...');
    console.log('🔍 AnamneseCliente: Estado do formulário:', {
      anamneseExistente,
      aceite_termo: form.aceite_termo,
      objetivo: form.objetivo,
      dor_atual: form.dor_atual
    });
    
    if (anamneseExistente) {
      console.log('❌ AnamneseCliente: Anamnese já existe, bloqueando submissão');
      setErro('Você já possui uma anamnese registrada. Esta será complementada pelo terapeuta durante o atendimento presencial.');
      return;
    }
    
    // Validar formulário antes de enviar
    console.log('🔍 AnamneseCliente: Validando formulário...');
    if (!validarFormulario()) {
      console.log('❌ AnamneseCliente: Validação falhou');
      setErro('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }
    
    // ✅ VALIDAÇÃO ADICIONAL: Verificar aceite_termo
    if (!form.aceite_termo) {
      console.log('❌ AnamneseCliente: Termo não aceito');
      setErro('⚠️ Você precisa marcar a caixa "Aceito e autorizo o tratamento" para continuar. Por favor, clique na caixa de seleção.');
      return;
    }
    
    try {
      console.log('✅ AnamneseCliente: Validações passaram, enviando dados...');
      setLoading(true);
      setErro('');
      
      const cliente_id = localStorage.getItem('cliente_id');
      console.log('🔍 AnamneseCliente: cliente_id:', cliente_id);
      console.log('🔍 AnamneseCliente: Dados a serem enviados:', form);
      
      const response = await api.post('/anamneses', {
        cliente_id,
        dados: form
      });
      
      console.log('✅ AnamneseCliente: Resposta da API recebida:', response.status, response.data);
      
      if (response.status === 201) {
        console.log('🎉 AnamneseCliente: Anamnese criada com sucesso!');
        // Capturar ID da anamnese para vinculação
        const anamneseCriada = response.data;
        if (anamneseCriada._id) {
          console.log('🔗 AnamneseCliente: ID da anamnese:', anamneseCriada._id);
          setAnamneseId(anamneseCriada._id);
          setSucesso('✅ Anamnese enviada com sucesso! Agora vamos vinculá-la ao seu prontuário.');
        } else {
          console.log('ℹ️ AnamneseCliente: Anamnese criada sem ID específico');
          setSucesso('✅ Anamnese enviada com sucesso! O terapeuta irá analisar e complementar durante o atendimento.');
        }
        setAnamneseExistente(true);
        setMensagemAnamnese("✅ Sua anamnese foi registrada com sucesso e será complementada pelo terapeuta durante o atendimento presencial.");
      }
    } catch (error) {
      console.error('❌ AnamneseCliente: Erro ao enviar anamnese:', error);
      console.error('❌ AnamneseCliente: Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      if (error.response?.data?.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro ao enviar anamnese. Tente novamente.');
      }
    } finally {
      console.log('🏁 AnamneseCliente: Finalizando submissão');
      setLoading(false);
    }
  };

  // 🔍 DEBUG: Log do estado do formulário (removido para evitar erro de hooks)

  // Callbacks para vinculação automática
  const handleVinculacaoSucesso = (resultado) => {
    setVinculacaoSucesso(true);
    setSucesso('🎉 Perfeito! Sua anamnese foi vinculada automaticamente ao prontuário. O terapeuta terá acesso completo às suas informações.');
    console.log('✅ Vinculação realizada com sucesso:', resultado);
  };

  const handleVinculacaoErro = (erro) => {
    setErro(`⚠️ Anamnese enviada, mas houve um problema na vinculação: ${erro}. O terapeuta ainda poderá acessar suas informações.`);
    console.error('❌ Erro na vinculação:', erro);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seenti-primary mx-auto"></div>
          <p className="mt-4 seenti-text-secondary">Carregando anamnese...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ PADRONIZADO: Header com Tema Seenti */}
        <div className="mb-6 sm:mb-8">
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
                📋 Formulário de Anamnese
              </h1>
              <p className="font-info-secundaria seenti-text-secondary text-sm sm:text-base">
                Informações essenciais para personalizar seu tratamento
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

        {/* ✅ MELHORADO: Cabeçalho com Dados Formatados do Cliente */}
        {dadosCliente && (
          <div className="mb-4 seenti-card p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium seenti-text-primary/70">👤</span>
                <div>
                  <span className="text-xs font-medium seenti-text-primary/70 block">Nome Completo:</span>
                  <span className="font-cta seenti-text-primary">
                    {formatarNomeCompleto(dadosCliente)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium seenti-text-primary/70">🆔</span>
                <div>
                  <span className="text-xs font-medium seenti-text-primary/70 block">CPF:</span>
                  <span className="font-cta seenti-text-primary">
                    {formatarCPF(dadosCliente.cpf)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium seenti-text-primary/70">📞</span>
                <div>
                  <span className="text-xs font-medium seenti-text-primary/70 block">Telefone:</span>
                  <span className="font-cta seenti-text-primary">
                    {formatarTelefone(dadosCliente)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium seenti-text-primary/70">📅</span>
                <div>
                  <span className="text-xs font-medium seenti-text-primary/70 block">Data de Nascimento:</span>
                  <span className="font-cta seenti-text-primary">
                    {formatarDataNascimento(dadosCliente)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* ✅ NOVO: Data da Anamnese em linha separada */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium seenti-text-primary/70">📋</span>
                <div>
                  <span className="text-xs font-medium seenti-text-primary/70 block">Data da Anamnese:</span>
                  <span className="font-cta seenti-text-primary">
                    {formatarDataAnamnese()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ MELHORADO: Mensagem de Status com Cores da Marca */}
        {anamneseExistente && (
          <div className="mb-6 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-cta text-lg text-green-800 mb-2">
                  Anamnese Básica Registrada
                </h3>
                <p className="font-info-secundaria text-green-700 text-sm sm:text-base leading-relaxed">
                  {mensagemAnamnese}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ MELHORADO: Mensagens de Feedback */}
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

        {/* ✅ MELHORADO: Formulário com Layout Responsivo e Cores da Marca */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* ✅ PADRONIZADO: Seção 1 - Objetivo e Dor Atual */}
          <div className="seenti-card p-4 sm:p-6">
            <h3 className="font-cta text-lg sm:text-xl mb-4 sm:mb-6 seenti-text-primary flex items-center">
              <span className="mr-2">🎯</span>
              Objetivo e Dor Atual
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="font-cta block text-sm seenti-text-primary mb-2 sm:mb-3">
                  Objetivo Principal 
                  <span className="text-red-500 ml-1">*</span>
                  <span className="font-info-secundaria text-xs text-gray-500 ml-2">(Obrigatório)</span>
                </label>
                <input
                  type="text"
                  name="objetivo"
                  value={form.objetivo}
                  onChange={handleChange}
                  onBlur={() => handleBlur('objetivo')}
                  placeholder="Ex: Relaxamento e redução de dores lombares"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    campoTemErro('objetivo') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                  disabled={anamneseExistente}
                />
                {campoTemErro('objetivo') && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getCampoError('objetivo')}
                  </p>
                )}
              </div>
              
              <div>
                <label className="font-cta block text-sm seenti-text-primary mb-2 sm:mb-3">
                  Dor Atual 
                  <span className="text-red-500 ml-1">*</span>
                  <span className="font-info-secundaria text-xs text-gray-500 ml-2">(Obrigatório)</span>
                </label>
                <input
                  type="text"
                  name="dor_atual"
                  value={form.dor_atual}
                  onChange={handleChange}
                  onBlur={() => handleBlur('dor_atual')}
                  placeholder="Ex: Lombar, ombros, pescoço"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    campoTemErro('dor_atual') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                  disabled={anamneseExistente}
                />
                {campoTemErro('dor_atual') && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getCampoError('dor_atual')}
                  </p>
                )}
              </div>
            </div>

            {/* ✅ MELHORADO: Escala de Dor Responsiva */}
            <div className="mt-6 sm:mt-8">
              <label className="font-cta block text-sm seenti-text-primary mb-3">
                Nível de Dor (0-10): <span className="font-bold text-lg seenti-text-accent">{form.nivel_dor}</span>
                <span className="text-red-500 ml-1">*</span>
                <span className="font-info-secundaria text-xs text-gray-500 ml-2">(Obrigatório)</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs seenti-text-primary/70 font-medium">0</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={form.nivel_dor}
                  onChange={(e) => handleNivelDorChange(parseInt(e.target.value))}
                  onBlur={() => handleBlur('nivel_dor')}
                  className={`flex-1 h-3 rounded-lg appearance-none cursor-pointer slider ${
                    anamneseExistente ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  style={{
                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(form.nivel_dor / 10) * 100}%, var(--seenti-accent) ${(form.nivel_dor / 10) * 100}%, var(--seenti-accent) 100%)`
                  }}
                  disabled={anamneseExistente}
                />
                <span className="text-xs seenti-text-primary/70 font-medium">10</span>
              </div>
              <div className="flex justify-between text-xs seenti-text-primary/60 mt-2">
                <span className="font-info-secundaria">Sem dor</span>
                <span className="font-info-secundaria">Dor leve</span>
                <span className="font-info-secundaria">Dor moderada</span>
                <span className="font-info-secundaria">Dor intensa</span>
              </div>
              {campoTemErro('nivel_dor') && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {getCampoError('nivel_dor')}
                </p>
              )}
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 2 - Histórico de Saúde */}
          <div className="seenti-card p-4 sm:p-6">
            <h3 className="font-cta text-lg sm:text-xl mb-4 sm:mb-6 seenti-text-primary flex items-center">
              <span className="mr-2">🏥</span>
              Histórico de Saúde
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* ✅ MELHORADO: Hipertensão */}
              <div className="seenti-card seenti-bg-primary/5 seenti-border-primary/20">
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    name="historico_saude.pressao_alta"
                    checked={form.historico_saude.pressao_alta}
                    onChange={handleChange}
                    className={`w-5 h-5 text-white border-white/50 rounded focus:ring-white focus:ring-2 ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  />
                  <span className="font-cta text-sm seenti-text-primary">Pressão Alta</span>
                </label>
                
                {/* ✅ CORREÇÃO: Sempre mostrar opções de controle */}
                <div className="ml-8 mt-3">
                  <label className="block text-sm seenti-text-primary/80 mb-2">
                    Controle:
                  </label>
                  <select
                    name="historico_saude.pressao_alta_controle"
                    value={form.historico_saude.pressao_alta_controle || ''}
                    onChange={handleChange}
                    className={`w-full h-12 seenti-input text-sm ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  >
                    <option value="">Selecione...</option>
                    <option value="controlada">Controlada</option>
                    <option value="descompensada">Descompensada</option>
                    <option value="não informado">Não informado</option>
                  </select>
                </div>
              </div>
              
              {/* ✅ MELHORADO: Diabetes */}
              <div className="seenti-card seenti-bg-primary/5 seenti-border-primary/20">
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    name="historico_saude.diabetes"
                    checked={form.historico_saude.diabetes}
                    onChange={handleChange}
                    className={`w-5 h-5 text-white border-white/50 rounded focus:ring-white focus:ring-2 ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  />
                  <span className="text-sm font-medium seenti-text-primary">Diabetes</span>
                </label>
                
                {/* ✅ CORREÇÃO: Sempre mostrar opções de controle */}
                <div className="ml-8 mt-3">
                  <label className="block text-sm seenti-text-primary/80 mb-2">
                    Controle:
                  </label>
                  <select
                    name="historico_saude.diabetes_controle"
                    value={form.historico_saude.diabetes_controle || ''}
                    onChange={handleChange}
                    className={`w-full h-12 seenti-input text-sm ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  >
                    <option value="">Selecione...</option>
                    <option value="controlada">Controlada</option>
                    <option value="descompensada">Descompensada</option>
                    <option value="não informado">Não informado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ✅ PADRONIZADO: Campos de texto para detalhes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Detalhes das Alergias:
                </label>
                <input
                  type="text"
                  name="historico_saude.alergias"
                  value={form.historico_saude.alergias}
                  onChange={handleChange}
                  placeholder="Ex: Medicamentos, alimentos, etc."
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Sintomas nas Pernas:
                </label>
                <input
                  type="text"
                  name="historico_saude.sintomas_pernas"
                  value={form.historico_saude.sintomas_pernas}
                  onChange={handleChange}
                  placeholder="Ex: Inchaço, formigamento, etc."
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 3 - Hábitos e Alimentação */}
          <div className="seenti-card p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 seenti-text-primary flex items-center">
              <span className="mr-2">🍽️</span>
              Hábitos e Alimentação
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Funcionamento Intestinal
                </label>
                <select
                  name="habitos.funcionamento_intestinal"
                  value={form.habitos.funcionamento_intestinal || ''}
                  onChange={handleChange}
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                >
                  <option value="">Selecione...</option>
                  <option value="regular">Regular</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Qualidade da Alimentação
                </label>
                <select
                  name="habitos.alimentacao"
                  value={form.habitos.alimentacao || ''}
                  onChange={handleChange}
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                >
                  <option value="">Selecione...</option>
                  <option value="boa">Boa</option>
                  <option value="regular">Regular</option>
                  <option value="ruim">Ruim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Anticoncepcional:
                </label>
                <input
                  type="text"
                  name="habitos.anticoncepcional"
                  value={form.habitos.anticoncepcional}
                  onChange={handleChange}
                  placeholder="Ex: Pílula, DIU, nenhum"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Gestante (semanas):
                </label>
                <input
                  type="number"
                  name="habitos.gestante"
                  value={form.habitos.gestante || ''}
                  onChange={handleChange}
                  placeholder="Ex: 12"
                  min="1"
                  max="40"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 4 - Histórico Clínico */}
          <div className="seenti-card p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 seenti-text-primary flex items-center">
              <span className="mr-2">🩺</span>
              Histórico Clínico
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                { name: 'historico_clinico.estresse', label: 'Estresse' },
                { name: 'historico_clinico.enxaqueca', label: 'Enxaqueca' },
                { name: 'historico_clinico.depressao', label: 'Depressão' },
                { name: 'historico_clinico.insonia', label: 'Insônia' },
                { name: 'historico_clinico.dor_mandibula', label: 'Dor Mandíbula' },
                { name: 'historico_clinico.bruxismo', label: 'Bruxismo' },
                { name: 'historico_clinico.pedra_rim', label: 'Pedra Rim' },
                { name: 'historico_clinico.pedra_vesicula', label: 'Pedra Vesícula' }
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-[#1E3A8A]/5 transition-colors">
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name.split('.')[0]][name.split('.')[1]]}
                    onChange={handleChange}
                    className={`w-4 h-4 text-white border-white/50 rounded focus:ring-white focus:ring-2 ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  />
                  <span className="text-sm seenti-text-primary font-medium">{label}</span>
                </label>
              ))}
            </div>

            {/* ✅ PADRONIZADO: Campos de texto para condições específicas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Distúrbio Renal:
                </label>
                <input
                  type="text"
                  name="historico_clinico.disturbio_renal"
                  value={form.historico_clinico.disturbio_renal}
                  onChange={handleChange}
                  placeholder="Ex: Insuficiência renal"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Antecedente Oncológico:
                </label>
                <input
                  type="text"
                  name="historico_clinico.antecedente_oncologico"
                  value={form.historico_clinico.antecedente_oncologico}
                  onChange={handleChange}
                  placeholder="Ex: Câncer de mama"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Doença Crônica:
                </label>
                <input
                  type="text"
                  name="historico_clinico.doenca_cronica"
                  value={form.historico_clinico.doenca_cronica}
                  onChange={handleChange}
                  placeholder="Ex: Hipertensão"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 5 - Restrições */}
          <div className="seenti-card p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 seenti-text-primary flex items-center">
              <span className="mr-2">⚠️</span>
              Restrições e Áreas Sensíveis
            </h3>
            
            <div>
              <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                Áreas que não gosta de massagem:
              </label>
              <input
                type="text"
                name="restricoes.nao_gosta_massagem_em"
                value={form.restricoes.nao_gosta_massagem_em}
                onChange={handleChange}
                placeholder="Ex: barriga, pés, rosto"
                className={`w-full h-12 seenti-input ${
                  anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={anamneseExistente}
              />
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 6 - Conduta de Tratamento */}
          <div className="border rounded-lg p-4 sm:p-6 seenti-bg-accent/10 border-[#AC80DD]/20">
            <h3 className="font-cta text-lg sm:text-xl mb-4 sm:mb-6 seenti-text-accent flex items-center">
              <span className="mr-2">🎯</span>
              Conduta de Tratamento Sugerida
            </h3>
            
            <div>
              <label className="font-cta block text-sm seenti-text-accent mb-2 sm:mb-3">
                Descreva a conduta sugerida para o tratamento:
              </label>
              <div className="mt-2">
                <textarea
                  name="conduta_tratamento"
                  value={form.conduta_tratamento}
                  onChange={handleChange}
                  placeholder="Ex: Massagem relaxante leve com foco em lombar e cervical, evitar pressão forte, técnicas suaves para relaxamento muscular"
                  rows="5"
                  className={`w-full min-h-32 seenti-input resize-none text-base leading-relaxed ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#AC80DD]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              <p className="font-info-secundaria text-xs seenti-text-accent/70 mt-2">
                💡 Dica: Seja específico sobre técnicas, intensidade e áreas de foco
              </p>
            </div>
          </div>

          {/* ✅ PADRONIZADO: Seção 7 - Aceite dos Termos com Tema Seenti */}
          <div className="seenti-card seenti-bg-primary p-4 sm:p-6">
            <h3 className="font-cta text-lg sm:text-xl mb-4 sm:mb-6 text-white flex items-center">
              <span className="mr-2">📋</span>
              Aceite dos Termos e Condições
            </h3>
            
            <div className="space-y-4">
              {/* ✅ PADRONIZADO: DECLARAÇÃO PRIMEIRO */}
              <div className="text-sm text-white leading-relaxed bg-white/20 p-4 rounded-lg border border-white/30">
                <p className="font-info-secundaria text-white">
                  <strong>Declaro que todas as informações fornecidas são verdadeiras e autorizo o profissional 
                  a realizar o tratamento conforme as informações fornecidas. Entendo que posso 
                  revogar esta autorização a qualquer momento.</strong>
                </p>
              </div>
              
              {/* ✅ CHECKBOX FUNCIONAL: Aceite dos Termos */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="aceite_termo_checkbox"
                  name="aceite_termo"
                  checked={form.aceite_termo}
                  onChange={handleChange}
                  className={`w-5 h-5 text-white border-white/50 rounded focus:ring-white focus:ring-2 ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    campoTemErro('aceite_termo') ? 'border-red-500 ring-red-500' : ''
                  }`}
                  disabled={anamneseExistente}
                />
                <span className="font-cta text-sm text-white">
                  {form.aceite_termo ? '✅' : '⬜'} Aceito e autorizo o tratamento
                  <span className="text-red-300 ml-1">*</span>
                  <span className="font-info-secundaria text-xs text-white/80 ml-2">(Obrigatório)</span>
                </span>
              </label>
              {campoTemErro('aceite_termo') && (
                <p className="text-red-200 text-sm mt-2 flex items-center bg-red-500/20 p-2 rounded">
                  <span className="mr-1">⚠️</span>
                  {getCampoError('aceite_termo')}
                </p>
              )}
              {!form.aceite_termo && !anamneseExistente && (
                <p className="text-yellow-200 text-sm mt-2 flex items-center bg-yellow-500/20 p-2 rounded">
                  <span className="mr-1">💡</span>
                  Clique na caixa de seleção para aceitar os termos e autorizar o tratamento
                </p>
              )}
            </div>
          </div>

          {/* ✅ PADRONIZADO: Botões de Ação com Tema Seenti */}
          <div className="flex justify-end pt-6">
            {/* 🔍 DEBUG: Estado do botão (removido para evitar re-renderizações) */}
            
            <button
              type="submit"
              className={`font-cta seenti-btn-primary px-6 py-3 text-sm sm:text-base ${
                anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                !isFormValid && !anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || anamneseExistente}
              onClick={() => {
                console.log('🔍 DEBUG: Estado do botão:', {
                  loading,
                  anamneseExistente,
                  isFormValid,
                  disabled: loading || anamneseExistente
                });
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </span>
              ) : (
                '📤 Enviar Anamnese'
              )}
            </button>
          </div>
        </form>

        {/* 🔗 COMPONENTE DE VINCULAÇÃO AUTOMÁTICA - T04 */}
        {anamneseId && !vinculacaoSucesso && (
          <div className="mt-8">
            <VinculacaoAnamnese
              clienteId={localStorage.getItem('cliente_id')}
              anamneseId={anamneseId}
              dadosAnamnese={form}
              onVinculacaoSucesso={handleVinculacaoSucesso}
              onVinculacaoErro={handleVinculacaoErro}
            />
          </div>
        )}

        {/* ✅ MENSAGEM DE SUCESSO COMPLETA */}
        {vinculacaoSucesso && (
          <div className="mt-8 seenti-card seenti-bg-success p-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Processo Completo com Sucesso!
            </h3>
            <p className="text-white/90 text-lg">
              Sua anamnese foi enviada e vinculada automaticamente ao prontuário.
              O terapeuta terá acesso completo às suas informações para um tratamento personalizado.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/perfil')}
                className="seenti-btn-secondary px-6 py-3 text-lg font-medium"
              >
                ← Voltar ao Perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnamneseCliente; 