import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import { useTheme } from '../../hooks/useTheme';
import api from '../../services/api';
import IconesGlobais from '../globais/IconesGlobais';
import './ConfiguracoesCliente.css';

const ConfiguracoesCliente = () => {
  const navigate = useNavigate();
  const { currentTheme, isDarkMode, applyTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // ✅ NOVO: Estado para mostrar dados pessoais
  const [mostrarDados, setMostrarDados] = useState(false);
  const [dadosCliente, setDadosCliente] = useState(null);

  // Estado das configurações
  const [configuracoes, setConfiguracoes] = useState({
    // Notificações
    notificacoes_email: true,
    notificacoes_push: true,
    notificacoes_agendamentos: true,
    notificacoes_lembretes: true,
    notificacoes_promocoes: false,
    
    // Privacidade
    perfil_publico: false,
    compartilhar_dados: false,
    receber_contatos: false,
    
    // Preferências
    idioma: 'pt-BR',
    tema: 'claro',
    fuso_horario: 'America/Sao_Paulo'
  });

  // ✅ NOVO: Carregar dados do cliente
  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) return;

        const response = await api.get(`/clientes/${cliente_id}`);
        if (response.status === 200) {
          setDadosCliente(response.data);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do cliente:', error);
      }
    };

    carregarDadosCliente();
  }, []);

  // Carregar configurações existentes
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) {
          setErro('Cliente não autenticado');
          navigate('/login');
          return;
        }

        // Tentar carregar configurações existentes
        const response = await api.get(`/configuracoes/cliente/${cliente_id}`);
        if (response.status === 200 && response.data) {
          // Mapear dados do backend para estrutura do frontend
          const dadosBackend = response.data;
          const configuracoesMapeadas = {
            // Notificações
            notificacoes_email: dadosBackend.notificacoes_email || true,
            notificacoes_push: dadosBackend.notificacoes_push || true,
            notificacoes_agendamentos: dadosBackend.notificacoes_agendamentos || true,
            notificacoes_lembretes: dadosBackend.notificacoes_lembretes || true,
            notificacoes_promocoes: dadosBackend.notificacoes_promocoes || false,
            
            // Privacidade
            perfil_publico: dadosBackend.perfil_publico || false,
            compartilhar_dados: dadosBackend.compartilhar_dados || false,
            receber_contatos: dadosBackend.receber_contatos || false,
            
            // Preferências
            idioma: dadosBackend.idioma || 'pt-BR',
            tema: dadosBackend.tema || 'claro',
            fuso_horario: dadosBackend.fuso_horario || 'America/Sao_Paulo'
          };
          
          setConfiguracoes(prev => ({ ...prev, ...configuracoesMapeadas }));
          console.log('✅ Configurações carregadas do backend:', configuracoesMapeadas);
          
            // Aplicar tema se estiver nas configurações E se não houver tema no localStorage
  const temaLocalStorage = localStorage.getItem('user-theme');
  console.log('🔍 Debug tema:', { 
    temaBackend: configuracoesMapeadas.tema, 
    temaLocalStorage, 
    temaAtual: currentTheme 
  });
  
  if (configuracoesMapeadas.tema && !temaLocalStorage) {
    console.log('🎨 Tema encontrado nas configurações do backend (primeira vez):', configuracoesMapeadas.tema);
    applyTheme(configuracoesMapeadas.tema);
  } else if (temaLocalStorage) {
    console.log('🎨 Usando tema do localStorage (prioridade):', temaLocalStorage);
    applyTheme(temaLocalStorage);
  }
        }
      } catch (error) {
        console.log('📋 Configurações não encontradas, usando padrões');
        console.log('❌ Erro detalhado:', error);
        console.log('🔍 Status da resposta:', error.response?.status);
        console.log('📄 Dados da resposta:', error.response?.data);
        // Usar configurações padrão se não existirem
      } finally {
        setLoading(false);
      }
    };

    carregarConfiguracoes();
  }, [navigate]);

  // Salvar configurações
  const salvarConfiguracoes = async () => {
    try {
      setSaving(true);
      setErro('');
      setSucesso('');

      const cliente_id = localStorage.getItem('cliente_id');
      if (!cliente_id) {
        setErro('Cliente não autenticado');
        return;
      }

      // Preparar dados para o backend (formato esperado pelo backend)
      const dadosBackend = {
        notificacoes_email: configuracoes.notificacoes_email,
        notificacoes_push: configuracoes.notificacoes_push,
        notificacoes_agendamentos: configuracoes.notificacoes_agendamentos,
        notificacoes_lembretes: configuracoes.notificacoes_lembretes,
        notificacoes_promocoes: configuracoes.notificacoes_promocoes,
        perfil_publico: configuracoes.perfil_publico,
        compartilhar_dados: configuracoes.compartilhar_dados,
        receber_contatos: configuracoes.receber_contatos,
        idioma: configuracoes.idioma,
        tema: configuracoes.tema,
        fuso_horario: configuracoes.fuso_horario
      };

      console.log('💾 Salvando configurações:', dadosBackend);

      // Enviar para o backend
      const response = await api.post(`/configuracoes/cliente/${cliente_id}`, dadosBackend);
      
      if (response.status === 200 || response.status === 201) {
        setSucesso('✅ Configurações salvas com sucesso!');
        
        // Aplicar tema se foi alterado
        if (configuracoes.tema) {
          console.log('🎨 Aplicando tema após salvar:', configuracoes.tema);
          applyTheme(configuracoes.tema);
          
          // Salvar também no localStorage para persistência local
          localStorage.setItem('user-theme', configuracoes.tema);
          console.log('💾 Tema salvo no localStorage:', configuracoes.tema);
        }
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSucesso(''), 3000);
        
        console.log('✅ Configurações salvas com sucesso:', response.data);
      } else {
        throw new Error('Resposta inesperada do servidor');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      setErro('❌ Erro ao salvar configurações. Tente novamente.');
      
      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => setErro(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Atualizar configuração individual
  const atualizarConfiguracao = (chave, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }));
    
    // Aplicar tema imediatamente se for alteração de tema
    if (chave === 'tema') {
      console.log('🎨 Tema alterado em tempo real:', valor);
      applyTheme(valor);
      localStorage.setItem('user-theme', valor);
    }
  };

  // Aplicar cores do WhiteLabel
  const primaryColor = brand?.primaryColor || '#1E3A8A';
  const secondaryColor = brand?.secondaryColor || '#AC80DD';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  // ✅ NOVO: Funções auxiliares para formatação de dados
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatarData = (data) => {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Página */}
        <div className="page-header mb-8">
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
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="header-icon">
                  <span>⚙️</span>
                </div>
                <h1 className="font-cliente-destaque">Configurações</h1>
              </div>
              <p className="font-info-secundaria text-lg text-gray-600">Personalize sua experiência no Seenti</p>
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

        {/* ✅ NOVO: Botão Mostrar Dados Pessoais */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setMostrarDados(!mostrarDados)}
            className="font-cta px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>{mostrarDados ? '👁️‍🗨️ Ocultar Dados' : '👁️ Mostrar Dados Pessoais'}</span>
          </button>
        </div>

        {/* ✅ NOVO: Seção de Dados Pessoais */}
        {mostrarDados && dadosCliente && (
          <div className="config-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <span className="text-white text-2xl">📋</span>
                <h2 className="font-cta text-xl text-white">Dados Pessoais</h2>
              </div>
              <p className="font-info-secundaria text-green-100 text-sm mt-1">Suas informações pessoais e de contato</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded border">
                  <strong className="font-cta">Nome:</strong> <span className="font-info-secundaria">{dadosCliente.primeiro_nome} {dadosCliente.sobrenome}</span>
                </div>
                {dadosCliente.nome_social && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>Nome Social:</strong> {dadosCliente.nome_social}
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>CPF:</strong> {formatarCPF(dadosCliente.cpf)}
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Data de Nascimento:</strong> {formatarData(dadosCliente.data_nascimento)}
                </div>
                {dadosCliente.genero && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>Gênero:</strong> {dadosCliente.genero}
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Telefone:</strong> {formatarTelefone(dadosCliente.contato?.telefone)}
                </div>
                {dadosCliente.contato?.email_alternativo && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>Email Alternativo:</strong> {dadosCliente.contato.email_alternativo}
                  </div>
                )}
              </div>

              {/* Endereço */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-cta mb-3 text-green-700">📍 Endereço</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>Rua:</strong> {dadosCliente.endereco?.rua}, {dadosCliente.endereco?.numero}
                  </div>
                  {dadosCliente.endereco?.complemento && (
                    <div className="p-3 bg-gray-50 rounded border">
                      <strong>Complemento:</strong> {dadosCliente.endereco.complemento}
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>Bairro:</strong> {dadosCliente.endereco?.bairro}
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>Cidade:</strong> {dadosCliente.endereco?.cidade} - {dadosCliente.endereco?.estado}
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <strong>CEP:</strong> {dadosCliente.endereco?.cep}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensagens de Status */}
        {erro && (
          <div className="status-message error mb-6">
            {erro}
          </div>
        )}
        
        {sucesso && (
          <div className="status-message success mb-6">
            {sucesso}
          </div>
        )}

        {/* Grid de Configurações */}
        <div className="config-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Card: Notificações */}
          <div className="config-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <span className="text-white text-2xl">🔔</span>
                <h2 className="font-cta text-xl text-white">Notificações</h2>
              </div>
              <p className="font-info-secundaria text-blue-100 text-sm mt-1">Gerencie como você recebe informações</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Notificações por Email */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-cta text-gray-900">📧 Email</h3>
                  <p className="font-info-secundaria text-sm text-gray-600">Notificações importantes por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.notificacoes_email}
                    onChange={(e) => atualizarConfiguracao('notificacoes_email', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Notificações Push */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">📱 Push</h3>
                  <p className="text-sm text-gray-600">Notificações no navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.notificacoes_push}
                    onChange={(e) => atualizarConfiguracao('notificacoes_push', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Lembretes de Agendamento */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">📅 Agendamentos</h3>
                  <p className="text-sm text-gray-600">Lembretes antes das consultas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.notificacoes_agendamentos}
                    onChange={(e) => atualizarConfiguracao('notificacoes_agendamentos', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Lembretes Gerais */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">⏰ Lembretes</h3>
                  <p className="text-sm text-gray-600">Lembretes de atividades</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.notificacoes_lembretes}
                    onChange={(e) => atualizarConfiguracao('notificacoes_lembretes', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Promoções */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">🎁 Promoções</h3>
                  <p className="text-sm text-gray-600">Ofertas especiais e promoções</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.notificacoes_promocoes}
                    onChange={(e) => atualizarConfiguracao('notificacoes_promocoes', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card: Privacidade */}
          <div className="config-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <span className="text-white text-2xl">🔒</span>
                <h2 className="text-xl font-semibold text-white">Privacidade</h2>
              </div>
              <p className="text-green-100 text-sm mt-1">Controle sua visibilidade e dados</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Perfil Público */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">👤 Perfil Público</h3>
                  <p className="text-sm text-gray-600">Outros usuários podem ver seu perfil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.perfil_publico}
                    onChange={(e) => atualizarConfiguracao('perfil_publico', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Compartilhar Dados */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">📊 Compartilhar Dados</h3>
                  <p className="text-sm text-gray-600">Dados para pesquisa científica</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.compartilhar_dados}
                    onChange={(e) => atualizarConfiguracao('compartilhar_dados', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Receber Contatos */}
              <div className="config-item flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">💬 Receber Contatos</h3>
                  <p className="text-sm text-gray-600">Profissionais podem entrar em contato</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.receber_contatos}
                    onChange={(e) => atualizarConfiguracao('receber_contatos', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Preferências (Largura Total) */}
        <div className="config-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <span className="text-white text-2xl">🎨</span>
              <h2 className="text-xl font-semibold text-white">Preferências</h2>
            </div>
            <p className="text-purple-100 text-sm mt-1">Personalize a aparência e comportamento</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Idioma */}
              <div className="space-y-2">
                <label className="select-label">
                  🌍 Idioma
                </label>
                <select
                  value={configuracoes.idioma}
                  onChange={(e) => atualizarConfiguracao('idioma', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="es-ES">🇪🇸 Español</option>
                </select>
              </div>

              {/* Tema */}
              <div className="space-y-2">
                <label className="select-label">
                  🌙 Tema
                </label>
                <select
                  value={configuracoes.tema}
                  onChange={(e) => atualizarConfiguracao('tema', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  <option value="claro">☀️ Claro</option>
                  <option value="escuro">🌙 Escuro</option>
                  <option value="auto">🔄 Automático</option>
                </select>
              </div>

              {/* Fuso Horário */}
              <div className="space-y-2">
                <label className="select-label">
                  🕐 Fuso Horário
                </label>
                <select
                  value={configuracoes.fuso_horario}
                  onChange={(e) => atualizarConfiguracao('fuso_horario', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  <option value="America/Sao_Paulo">🇧🇷 São Paulo (GMT-3)</option>
                  <option value="America/New_York">🇺🇸 Nova York (GMT-5)</option>
                  <option value="Europe/London">🇬🇧 Londres (GMT+0)</option>
                  <option value="Asia/Tokyo">🇯🇵 Tóquio (GMT+9)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="btn-group flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/perfil')}
            className="btn-secondary"
          >
            ← Voltar ao Perfil
          </button>

          {/* Botão Salvar */}
          <button
            onClick={salvarConfiguracoes}
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
          >
            {saving ? (
              <>
                <div className="loading-spinner rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              '💾 Salvar Configurações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesCliente;
