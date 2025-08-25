import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import { useTheme } from '../../hooks/useTheme';
import api from '../../services/api';

const ConfiguracoesCliente = () => {
  const navigate = useNavigate();
  const { currentTheme, isDarkMode, applyTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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
            notificacoes_email: dadosBackend.notificacoes?.email || true,
            notificacoes_push: dadosBackend.notificacoes?.push || true,
            notificacoes_agendamentos: dadosBackend.notificacoes?.agendamentos || true,
            notificacoes_lembretes: dadosBackend.notificacoes?.lembretes || true,
            notificacoes_promocoes: dadosBackend.notificacoes?.promocoes || false,
            
            // Privacidade
            perfil_publico: dadosBackend.privacidade?.perfil_publico || false,
            compartilhar_dados: dadosBackend.privacidade?.compartilhar_dados || false,
            receber_contatos: dadosBackend.privacidade?.receber_contatos || false,
            
            // Preferências
            idioma: dadosBackend.preferencias?.idioma || 'pt-BR',
            tema: dadosBackend.preferencias?.tema || 'claro',
            fuso_horario: dadosBackend.preferencias?.fuso_horario || 'America/Sao_Paulo'
          };
          
          setConfiguracoes(prev => ({ ...prev, ...configuracoesMapeadas }));
          console.log('✅ Configurações carregadas do backend:', configuracoesMapeadas);
          
          // Aplicar tema se estiver nas configurações
          if (configuracoesMapeadas.tema) {
            applyTheme(configuracoesMapeadas.tema);
            console.log('🎨 Tema aplicado ao carregar configurações:', configuracoesMapeadas.tema);
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

      const response = await api.post(`/configuracoes/cliente/${cliente_id}`, configuracoes);
      
      if (response.status === 200 || response.status === 201) {
        setSucesso('✅ Configurações salvas com sucesso!');
        console.log('✅ Configurações salvas no backend:', response.data);
        
        // Aplicar tema imediatamente após salvar
        if (configuracoes.tema) {
          applyTheme(configuracoes.tema);
          console.log('🎨 Tema aplicado após salvar:', configuracoes.tema);
        }
        
        setTimeout(() => setSucesso(''), 3000);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      setErro('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Aplicar cores do WhiteLabel
  const primaryColor = brand?.primaryColor || '#1E3A8A';
  const secondaryColor = brand?.secondaryColor || '#AC80DD';

  // Atualizar configuração
  const atualizarConfiguracao = (chave, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }));
    
    // Aplicar tema em tempo real se for alteração de tema
    if (chave === 'tema') {
      applyTheme(valor);
      console.log('🎨 Tema alterado em tempo real:', valor);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  // Aplicar tema apenas ao conteúdo específico
  const contentThemeClass = `user-theme-content theme-${currentTheme === 'escuro' ? 'escuro' : 'claro'}`;
  
  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${contentThemeClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚙️ Configurações
          </h1>
          <p className="text-gray-600">
            Personalize sua experiência no Seenti
          </p>
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

        {/* Formulário de Configurações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Seção: Notificações */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔔 Notificações
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Notificações por Email</h3>
                  <p className="text-sm text-gray-500">Receber notificações importantes por email</p>
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

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Notificações Push</h3>
                  <p className="text-sm text-gray-500">Receber notificações no navegador</p>
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

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Lembretes de Agendamento</h3>
                  <p className="text-sm text-gray-500">Receber lembretes antes das consultas</p>
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

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Lembretes Gerais</h3>
                  <p className="text-sm text-gray-500">Receber lembretes de atividades</p>
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

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Promoções e Ofertas</h3>
                  <p className="text-sm text-gray-500">Receber ofertas especiais e promoções</p>
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

          {/* Seção: Privacidade */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔒 Privacidade
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Perfil Público</h3>
                  <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu perfil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.perfil_publico}
                    onChange={(e) => atualizarConfiguracao('perfil_publico', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Compartilhar Dados</h3>
                  <p className="text-sm text-gray-500">Permitir compartilhamento de dados para pesquisa</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.compartilhar_dados}
                    onChange={(e) => atualizarConfiguracao('compartilhar_dados', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Receber Contatos</h3>
                  <p className="text-sm text-gray-500">Permitir que profissionais entrem em contato</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configuracoes.receber_contatos}
                    onChange={(e) => atualizarConfiguracao('receber_contatos', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Seção: Preferências */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎨 Preferências
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select
                  value={configuracoes.idioma}
                  onChange={(e) => atualizarConfiguracao('idioma', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={configuracoes.tema}
                  onChange={(e) => atualizarConfiguracao('tema', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="claro">Claro</option>
                  <option value="escuro">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuso Horário
                </label>
                <select
                  value={configuracoes.fuso_horario}
                  onChange={(e) => atualizarConfiguracao('fuso_horario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">Nova York (GMT-5)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                  <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={salvarConfiguracoes}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            style={{ backgroundColor: primaryColor }}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              '💾 Salvar Configurações'
            )}
          </button>

          <button
            onClick={() => navigate('/perfil')}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            ← Voltar ao Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesCliente;
