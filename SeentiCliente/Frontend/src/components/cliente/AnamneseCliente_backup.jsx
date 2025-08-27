import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '@white/config/brandConfig';
import api from '../../services/api';

const AnamneseCliente = () => {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [anamneseExistente, setAnamneseExistente] = useState(false);
  const [mensagemAnamnese, setMensagemAnamnese] = useState('');

  // ✅ PADRONIZADO: Usando tema Seenti oficial
  // Removido hardcoded colors - usando classes CSS do tema

  // NOVA ESTRUTURA DE DADOS - REFATORADA Sprint 07
  const [form, setForm] = useState({
    objetivo: '',
    dor_atual: '',
    nivel_dor: 5,
    historico_saude: {
      pressao_alta: {
        tem: false,
        controle: ''
      },
      diabetes: {
        tem: false,
        controle: ''
      },
      alergias: '',
      sintomas_pernas: ''
    },
    habitos: {
      funcionamento_intestinal: 'regular',
      alimentacao: 'boa',
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
            
            // Verificar se já existe anamnese para este cliente
            try {
              const responseAnamnese = await api.get(`/anamneses/cliente/${cliente_id}`);
              console.log('🔍 Resposta da API anamnese:', {
                status: responseAnamnese.status,
                data: responseAnamnese.data,
                temDados: !!responseAnamnese.data?.dados,
                dados: responseAnamnese.data?.dados
              });
              
              if (responseAnamnese.status === 200 && responseAnamnese.data && responseAnamnese.data.dados) {
                // Cliente já tem anamnese - CONGELAR FORMULÁRIO
                console.log('✅ Anamnese existente encontrada:', responseAnamnese.data);
                console.log('✅ Dados da anamnese:', responseAnamnese.data.dados);
                setForm(responseAnamnese.data.dados);
                setAnamneseExistente(true);
                setMensagemAnamnese("✅ Você já possui uma anamnese registrada. Esta é uma anamnese básica que será complementada pelo terapeuta durante o atendimento presencial.");
              } else {
                // Cliente não tem anamnese válida - FORMULÁRIO LIBERADO
                console.log('✅ Cliente não possui anamnese válida - formulário liberado');
                console.log('❌ Estrutura inválida:', responseAnamnese.data);
                
                // GARANTIR QUE O FORMULÁRIO ESTEJA INICIALIZADO CORRETAMENTE
                setForm(prev => ({
                  ...prev,
                  objetivo: '',
                  dor_atual: '',
                  nivel_dor: 5,
                  aceite_termo: false
                }));
              }
            } catch (error) {
              if (error.response?.status === 404) {
                // Cliente não tem anamnese - FORMULÁRIO LIBERADO
                console.log('✅ Cliente não possui anamnese - formulário liberado');
                setForm(prev => ({
                  ...prev,
                  objetivo: '',
                  dor_atual: '',
                  nivel_dor: 5,
                  aceite_termo: false
                }));
              } else {
                console.error('❌ Erro ao buscar anamnese:', error);
                setErro('Erro ao verificar anamnese existente. Tente novamente.');
              }
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
      
      if (name.includes('historico_saude.pressao_alta.tem') || name.includes('historico_saude.diabetes.tem')) {
        const [grupo1, grupo2, campo] = name.split('.');
        setForm(prev => ({
          ...prev,
          [grupo1]: {
            ...prev[grupo1],
            [grupo2]: {
              ...prev[grupo1][grupo2],
              [campo]: type === 'checkbox' ? checked : value
            }
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
  };

  const handleNivelDorChange = (valor) => {
    if (anamneseExistente) return; // Freeze form
    setForm(prev => ({ ...prev, nivel_dor: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (anamneseExistente) {
      setErro('Você já possui uma anamnese registrada. Esta será complementada pelo terapeuta durante o atendimento presencial.');
      return;
    }
    
    if (!form.aceite_termo) {
      setErro('Você deve aceitar os termos e condições para continuar.');
      return;
    }
    
    try {
      setLoading(true);
      setErro('');
      
      const cliente_id = localStorage.getItem('cliente_id');
      const response = await api.post('/anamneses', {
        cliente_id,
        dados: form
      });
      
      if (response.status === 201) {
        setSucesso('✅ Anamnese enviada com sucesso! O terapeuta irá analisar e complementar durante o atendimento.');
        setAnamneseExistente(true);
        setMensagemAnamnese("✅ Sua anamnese foi registrada com sucesso e será complementada pelo terapeuta durante o atendimento presencial.");
      }
    } catch (error) {
      console.error('❌ Erro ao enviar anamnese:', error);
      if (error.response?.data?.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro ao enviar anamnese. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando anamnese...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ PADRONIZADO: Header com Tema Seenti */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold seenti-text-primary mb-2">
            📋 Formulário de Anamnese
          </h1>
          <p className="seenti-text-secondary text-sm sm:text-base">
            Informações essenciais para personalizar seu tratamento
          </p>
        </div>

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
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Anamnese Básica Registrada
                </h3>
                <p className="text-green-700 text-sm sm:text-base leading-relaxed">
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
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 seenti-text-primary flex items-center">
              <span className="mr-2">🎯</span>
              Objetivo e Dor Atual
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Objetivo Principal *
                </label>
                <input
                  type="text"
                  name="objetivo"
                  value={form.objetivo}
                  onChange={handleChange}
                  placeholder="Ex: Relaxamento e redução de dores lombares"
                  className={`w-full h-12 seenti-input ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  required
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium seenti-text-primary mb-2 sm:mb-3">
                  Dor Atual *
                </label>
                <input
                  type="text"
                  name="dor_atual"
                  value={form.dor_atual}
                  onChange={handleChange}
                  placeholder="Ex: Lombar, ombros, pescoço"
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  required
                  disabled={anamneseExistente}
                />
              </div>
            </div>

            {/* ✅ MELHORADO: Escala de Dor Responsiva */}
            <div className="mt-6 sm:mt-8">
              <label className="block text-sm font-medium text-[#1E3A8A] mb-3">
                Nível de Dor (0-10): <span className="font-bold text-lg text-[#AC80DD]">{form.nivel_dor}</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#1E3A8A]/70 font-medium">0</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={form.nivel_dor}
                  onChange={(e) => handleNivelDorChange(parseInt(e.target.value))}
                  className={`flex-1 h-3 rounded-lg appearance-none cursor-pointer slider ${
                    anamneseExistente ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  style={{
                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(form.nivel_dor / 10) * 100}%, ${secondaryColor} ${(form.nivel_dor / 10) * 100}%, ${secondaryColor} 100%)`
                  }}
                  disabled={anamneseExistente}
                />
                <span className="text-xs text-[#1E3A8A]/70 font-medium">10</span>
              </div>
              <div className="flex justify-between text-xs text-[#1E3A8A]/60 mt-2">
                <span>Sem dor</span>
                <span>Dor leve</span>
                <span>Dor moderada</span>
                <span>Dor intensa</span>
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 2 - Histórico de Saúde */}
          <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#1E3A8A] flex items-center">
              <span className="mr-2">🏥</span>
              Histórico de Saúde
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* ✅ MELHORADO: Hipertensão */}
              <div className="border rounded-lg p-4 bg-[#1E3A8A]/5 border-[#1E3A8A]/20">
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    name="historico_saude.pressao_alta.tem"
                    checked={form.historico_saude.pressao_alta.tem}
                    onChange={handleChange}
                    className={`w-5 h-5 text-[#1E3A8A] border-gray-300 rounded focus:ring-[#1E3A8A] focus:ring-2 ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  />
                  <span className="text-sm font-medium text-[#1E3A8A]">Pressão Alta</span>
                </label>
                
                {form.historico_saude.pressao_alta.tem && (
                  <div className="ml-8">
                    <label className="block text-sm text-[#1E3A8A]/80 mb-2">
                      Controle:
                    </label>
                    <select
                      name="historico_saude.pressao_alta.controle"
                      value={form.historico_saude.pressao_alta.controle || ''}
                      onChange={handleChange}
                      className={`w-full h-12 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-colors ${
                        anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                      }`}
                      required
                      disabled={anamneseExistente}
                    >
                      <option value="">Selecione...</option>
                      <option value="controlada">Controlada</option>
                      <option value="descompensada">Descompensada</option>
                      <option value="não informado">Não informado</option>
                    </select>
                  </div>
                )}
              </div>
              
              {/* ✅ MELHORADO: Diabetes */}
              <div className="border rounded-lg p-4 bg-[#1E3A8A]/5 border-[#1E3A8A]/20">
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    name="historico_saude.diabetes.tem"
                    checked={form.historico_saude.diabetes.tem}
                    onChange={handleChange}
                    className={`w-5 h-5 text-[#1E3A8A] border-gray-300 rounded focus:ring-[#1E3A8A] focus:ring-2 ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  />
                  <span className="text-sm font-medium text-[#1E3A8A]">Diabetes</span>
                </label>
                
                {form.historico_saude.diabetes.tem && (
                  <div className="ml-8">
                    <label className="block text-sm text-[#1E3A8A]/80 mb-2">
                      Controle:
                    </label>
                    <select
                      name="historico_saude.diabetes.controle"
                      value={form.historico_saude.diabetes.controle || ''}
                      onChange={handleChange}
                      className={`w-full h-12 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-colors ${
                        anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                      }`}
                      required
                      disabled={anamneseExistente}
                    >
                      <option value="">Selecione...</option>
                      <option value="controlada">Controlada</option>
                      <option value="descompensada">Descompensada</option>
                      <option value="não informado">Não informado</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ MELHORADO: Campos de texto para detalhes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Detalhes das Alergias
                </label>
                <input
                  type="text"
                  name="historico_saude.alergias"
                  value={form.historico_saude.alergias}
                  onChange={handleChange}
                  placeholder="Ex: Medicamentos, alimentos, etc."
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Sintomas nas Pernas
                </label>
                <input
                  type="text"
                  name="historico_saude.sintomas_pernas"
                  value={form.historico_saude.sintomas_pernas}
                  onChange={handleChange}
                  placeholder="Ex: Inchaço, formigamento, etc."
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 3 - Hábitos e Alimentação */}
          <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#1E3A8A] flex items-center">
              <span className="mr-2">🍽️</span>
              Hábitos e Alimentação
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Funcionamento Intestinal
                </label>
                <select
                  name="habitos.funcionamento_intestinal"
                  value={form.habitos.funcionamento_intestinal}
                  onChange={handleChange}
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  required
                  disabled={anamneseExistente}
                >
                  <option value="regular">Regular</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Qualidade da Alimentação
                </label>
                <select
                  name="habitos.alimentacao"
                  value={form.habitos.alimentacao}
                  onChange={handleChange}
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  required
                  disabled={anamneseExistente}
                >
                  <option value="boa">Boa</option>
                  <option value="regular">Regular</option>
                  <option value="ruim">Ruim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Anticoncepcional
                </label>
                <input
                  type="text"
                  name="habitos.anticoncepcional"
                  value={form.habitos.anticoncepcional}
                  onChange={handleChange}
                  placeholder="Ex: Pílula, DIU, nenhum"
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Gestante (semanas)
                </label>
                <input
                  type="number"
                  name="habitos.gestante"
                  value={form.habitos.gestante || ''}
                  onChange={handleChange}
                  placeholder="Ex: 12"
                  min="1"
                  max="40"
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 4 - Histórico Clínico */}
          <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#1E3A8A] flex items-center">
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
                    className={`w-4 h-4 text-[#1E3A8A] border-gray-300 rounded focus:ring-[#1E3A8A] focus:ring-2 ${
                      anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={anamneseExistente}
                  />
                  <span className="text-sm text-[#1E3A8A] font-medium">{label}</span>
                </label>
              ))}
            </div>

            {/* ✅ MELHORADO: Campos de texto para condições específicas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Distúrbio Renal
                </label>
                <input
                  type="text"
                  name="historico_clinico.disturbio_renal"
                  value={form.historico_clinico.disturbio_renal}
                  onChange={handleChange}
                  placeholder="Ex: Insuficiência renal"
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Antecedente Oncológico
                </label>
                <input
                  type="text"
                  name="historico_clinico.antecedente_oncologico"
                  value={form.historico_clinico.antecedente_oncologico}
                  onChange={handleChange}
                  placeholder="Ex: Câncer de mama"
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                  Doença Crônica
                </label>
                <input
                  type="text"
                  name="historico_clinico.doenca_cronica"
                  value={form.historico_clinico.doenca_cronica}
                  onChange={handleChange}
                  placeholder="Ex: Hipertensão"
                  className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 5 - Restrições */}
          <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#1E3A8A] flex items-center">
              <span className="mr-2">⚠️</span>
              Restrições e Áreas Sensíveis
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-[#1E3A8A] mb-2 sm:mb-3">
                Áreas que não gosta de massagem
              </label>
              <input
                type="text"
                name="restricoes.nao_gosta_massagem_em"
                value={form.restricoes.nao_gosta_massagem_em}
                onChange={handleChange}
                placeholder="Ex: barriga, pés, rosto"
                className={`w-full h-12 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-base transition-colors ${
                  anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#1E3A8A]/50'
                }`}
                disabled={anamneseExistente}
              />
            </div>
          </div>

          {/* ✅ MELHORADO: Seção 6 - Conduta de Tratamento */}
          <div className="border rounded-lg p-4 sm:p-6 bg-[#AC80DD]/10 border-[#AC80DD]/20">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#AC80DD] flex items-center">
              <span className="mr-2">🎯</span>
              Conduta de Tratamento Sugerida
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-[#AC80DD] mb-2 sm:mb-3">
                Descreva a conduta sugerida para o tratamento
              </label>
              <div className="mt-2">
                <textarea
                  name="conduta_tratamento"
                  value={form.conduta_tratamento}
                  onChange={handleChange}
                  placeholder="Ex: Massagem relaxante leve com foco em lombar e cervical, evitar pressão forte, técnicas suaves para relaxamento muscular"
                  rows="5"
                  className={`w-full min-h-32 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#AC80DD] focus:border-[#AC80DD] resize-none text-base leading-relaxed transition-colors ${
                    anamneseExistente ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#AC80DD]/50'
                  }`}
                  disabled={anamneseExistente}
                />
              </div>
              <p className="text-xs text-[#AC80DD]/70 mt-2">
                💡 Dica: Seja específico sobre técnicas, intensidade e áreas de foco
              </p>
            </div>
          </div>

          {/* ✅ PADRONIZADO: Seção 7 - Aceite dos Termos com Tema Seenti */}
          <div className="seenti-card seenti-bg-primary p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white flex items-center">
              <span className="mr-2">📋</span>
              Aceite dos Termos e Condições
            </h3>
            
            <div className="space-y-4">
              {/* ✅ PADRONIZADO: DECLARAÇÃO PRIMEIRO */}
              <div className="text-sm text-white leading-relaxed bg-white/20 p-4 rounded-lg border border-white/30">
                <p className="text-white">
                  <strong>Declaro que todas as informações fornecidas são verdadeiras e autorizo o profissional 
                  a realizar o tratamento conforme as informações fornecidas. Entendo que posso 
                  revogar esta autorização a qualquer momento.</strong>
                </p>
              </div>
              
              {/* ✅ PADRONIZADO: CHECKBOX E CONFIRMAÇÃO */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceite_termo"
                  checked={form.aceite_termo}
                  onChange={handleChange}
                  className={`w-5 h-5 text-white border-white/50 rounded focus:ring-white focus:ring-2 ${
                    anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  required
                  disabled={anamneseExistente}
                />
                <span className="text-sm font-semibold text-white">
                  ✅ Aceito e autorizo o tratamento
                </span>
              </label>
            </div>
          </div>

          {/* ✅ PADRONIZADO: Botões de Ação com Tema Seenti */}
          <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="w-full sm:w-auto seenti-btn-secondary px-6 py-3 text-sm sm:text-base font-medium"
            >
              ← Voltar ao Perfil
            </button>
            
            <button
              type="submit"
              className={`w-full sm:w-auto seenti-btn-primary px-6 py-3 text-sm sm:text-base font-medium ${
                anamneseExistente ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || anamneseExistente}
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
      </div>
    </div>
  );
};

export default AnamneseCliente; 