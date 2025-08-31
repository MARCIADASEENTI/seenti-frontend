import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VisualizarProntuario = ({ clienteId, onClose }) => {
  const [prontuario, setProntuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [criandoProntuario, setCriandoProntuario] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const API_PRONTUARIO = `${API_BASE}/api/v1/prontuarios`;

  useEffect(() => {
    carregarProntuario();
  }, [clienteId]);

  const carregarProntuario = async () => {
    try {
      setLoading(true);
      setErro('');

      const response = await axios.get(`${API_PRONTUARIO}/cliente/${clienteId}`);
      
      if (response.status === 200) {
        setProntuario(response.data.prontuario);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar prontuário:', error);
      
      if (error.response?.status === 404) {
        setErro('Prontuário não encontrado para este cliente.');
      } else {
        setErro('Erro ao carregar prontuário. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const criarProntuarioTeste = async () => {
    try {
      setCriandoProntuario(true);
      setErro('');

      const response = await axios.post(`${API_PRONTUARIO}/teste/${clienteId}`);
      
      if (response.status === 201 || response.status === 200) {
        setProntuario(response.data.prontuario);
        console.log('✅ Prontuário de teste criado:', response.data);
      }
    } catch (error) {
      console.error('❌ Erro ao criar prontuário de teste:', error);
      setErro('Erro ao criar prontuário de teste. Tente novamente.');
    } finally {
      setCriandoProntuario(false);
    }
  };

  const renderizarProntuario = () => {
    if (!prontuario) return null;

    return (
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="seenti-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">📋 Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80">Data de Abertura:</label>
              <p className="text-white font-semibold">{prontuario.data_abertura}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80">Terapeuta Responsável:</label>
              <p className="text-white font-semibold">{prontuario.terapeuta_responsavel || 'Não definido'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80">Especialidade:</label>
              <p className="text-white font-semibold">{prontuario.especialidade || 'Não definida'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80">Status:</label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                prontuario.status === 'ativo' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {prontuario.status}
              </span>
            </div>
          </div>
        </div>

        {/* Queixa Principal */}
        {prontuario.queixa_principal && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">🏥 Queixa Principal</h3>
            <p className="text-white/90 leading-relaxed">{prontuario.queixa_principal}</p>
          </div>
        )}

        {/* Histórico Médico */}
        {prontuario.historico_medico && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">📚 Histórico Médico</h3>
            <p className="text-white/90 leading-relaxed">{prontuario.historico_medico}</p>
          </div>
        )}

        {/* Medicamentos Atuais */}
        {prontuario.medicamentos_atuais && prontuario.medicamentos_atuais.length > 0 && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">💊 Medicamentos Atuais</h3>
            <ul className="space-y-2">
              {prontuario.medicamentos_atuais.map((medicamento, index) => (
                <li key={index} className="flex items-center text-white/90">
                  <span className="mr-2">•</span>
                  {medicamento}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alergias */}
        {prontuario.alergias && prontuario.alergias.length > 0 && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">⚠️ Alergias</h3>
            <ul className="space-y-2">
              {prontuario.alergias.map((alergia, index) => (
                <li key={index} className="flex items-center text-white/90">
                  <span className="mr-2">•</span>
                  {alergia}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hábitos de Vida */}
        {prontuario.habitos_vida && Object.keys(prontuario.habitos_vida).length > 0 && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">🏃 Hábitos de Vida</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(prontuario.habitos_vida).map(([chave, valor]) => (
                <div key={chave}>
                  <label className="text-sm font-medium text-white/80 capitalize">
                    {chave.replace('_', ' ')}:
                  </label>
                  <p className="text-white font-semibold">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exames Anteriores */}
        {prontuario.exames_anteriores && prontuario.exames_anteriores.length > 0 && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">🔬 Exames Anteriores</h3>
            <ul className="space-y-2">
              {prontuario.exames_anteriores.map((exame, index) => (
                <li key={index} className="flex items-center text-white/90">
                  <span className="mr-2">•</span>
                  {exame}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Observações Gerais */}
        {prontuario.observacoes_gerais && (
          <div className="seenti-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">📝 Observações Gerais</h3>
            <p className="text-white/90 leading-relaxed">{prontuario.observacoes_gerais}</p>
          </div>
        )}

        {/* Informações de Sistema */}
        <div className="seenti-card p-6 bg-gray-800/50">
          <h3 className="text-lg font-bold text-white/80 mb-4">🔧 Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-white/60">ID do Prontuário:</label>
              <p className="text-white/80 font-mono">{prontuario._id}</p>
            </div>
            <div>
              <label className="text-white/60">ID do Cliente:</label>
              <p className="text-white/80 font-mono">{prontuario.cliente_id}</p>
            </div>
            <div>
              <label className="text-white/60">Criado em:</label>
              <p className="text-white/80">
                {new Date(prontuario.criado_em).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <label className="text-white/60">Atualizado em:</label>
              <p className="text-white/80">
                {new Date(prontuario.atualizado_em).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-6 rounded-t-lg border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">📋 Prontuário Clínico</h2>
              <p className="text-white/60 mt-1">Visualização completa do prontuário do cliente</p>
            </div>
            <button
              onClick={onClose}
              className="seenti-btn-secondary px-4 py-2 text-sm"
            >
              ✕ Fechar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-white">Carregando prontuário...</span>
            </div>
          ) : erro ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Prontuário Não Encontrado
              </h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                {erro}
              </p>
              <button
                onClick={criarProntuarioTeste}
                disabled={criandoProntuario}
                className="seenti-btn-primary px-6 py-3 text-lg font-medium disabled:opacity-50"
              >
                {criandoProntuario ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando...
                  </span>
                ) : (
                  '🔧 Criar Prontuário de Teste'
                )}
              </button>
            </div>
          ) : (
            renderizarProntuario()
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizarProntuario;




