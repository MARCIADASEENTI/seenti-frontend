import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Componente de Seleção Dinâmica de Modelo de Anamnese pelo Terapeuta
 * Sprint 09.1 - T06: Implementar sistema de seleção dinâmica pelo terapeuta
 */
const SelecaoModeloAnamnese = ({ 
  clienteId, 
  clienteNome,
  onModeloSelecionado,
  onCancelar 
}) => {
  const [modelos, setModelos] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [carregandoModelos, setCarregandoModelos] = useState(true);

  // Configuração da API
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const API_MODELOS = `${API_BASE}/api/v1/anamnese-modelos`;

  /**
   * Carrega os modelos disponíveis
   */
  useEffect(() => {
    carregarModelos();
  }, []);

  const carregarModelos = async () => {
    try {
      setCarregandoModelos(true);
      setErro('');

      const response = await axios.get(API_MODELOS, {
        params: { ativo: true },
        timeout: 10000
      });

      if (response.data.status === 'success') {
        setModelos(response.data.data);
        console.log('✅ Modelos carregados:', response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao carregar modelos');
      }

    } catch (error) {
      console.error('❌ Erro ao carregar modelos:', error);
      setErro('Erro ao carregar modelos disponíveis. Tente novamente.');
      
      // Fallback: usar modelos padrão se a API falhar
      setModelos([
        {
          _id: 'modelo_basico',
          nome: 'Anamnese Básica (Padrão)',
          tipo: 'basico',
          descricao: 'Modelo básico padrão para todos os clientes',
          obrigatorio: true
        },
        {
          _id: 'modelo_gestante',
          nome: 'Anamnese Gestante',
          tipo: 'gestante',
          descricao: 'Modelo específico para gestantes',
          obrigatorio: false
        },
        {
          _id: 'modelo_esportiva',
          nome: 'Anamnese Esportiva',
          tipo: 'esportiva',
          descricao: 'Modelo específico para atletas e praticantes de esportes',
          obrigatorio: false
        }
      ]);
    } finally {
      setCarregandoModelos(false);
    }
  };

  /**
   * Seleciona um modelo
   */
  const selecionarModelo = (modelo) => {
    setModeloSelecionado(modelo);
    console.log('🔍 Modelo selecionado:', modelo);
  };

  /**
   * Confirma a seleção
   */
  const confirmarSelecao = async () => {
    if (!modeloSelecionado) {
      setErro('Por favor, selecione um modelo de anamnese');
      return;
    }

    try {
      setLoading(true);
      setErro('');

      // Simular aplicação do modelo (aqui seria integrado com o sistema)
      console.log('✅ Modelo aplicado:', modeloSelecionado);
      
      // Chamar callback com o modelo selecionado
      if (onModeloSelecionado) {
        onModeloSelecionado(modeloSelecionado);
      }

    } catch (error) {
      console.error('❌ Erro ao aplicar modelo:', error);
      setErro('Erro ao aplicar modelo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderiza informações do modelo
   */
  const renderizarInfoModelo = (modelo) => {
    return (
      <div className="text-sm text-gray-600 space-y-1">
        <p>{modelo.descricao}</p>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            modelo.obrigatorio 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {modelo.obrigatorio ? 'Obrigatório' : 'Opcional'}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {modelo.tipo}
          </span>
        </div>
      </div>
    );
  };

  /**
   * Renderiza o modelo selecionado
   */
  const renderizarModeloSelecionado = () => {
    if (!modeloSelecionado) return null;

    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">
          🎯 Modelo Selecionado
        </h4>
        <div className="space-y-2">
          <div className="font-medium text-blue-900">
            {modeloSelecionado.nome}
          </div>
          <div className="text-sm text-blue-700">
            {modeloSelecionado.descricao}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              modeloSelecionado.obrigatorio 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {modeloSelecionado.obrigatorio ? 'Obrigatório' : 'Opcional'}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {modeloSelecionado.tipo}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="selecao-modelo-anamnese p-6 border border-gray-200 rounded-lg bg-white max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔍 Seleção de Modelo de Anamnese
        </h2>
        <p className="text-gray-600">
          Selecione o modelo de anamnese mais adequado para o cliente
        </p>
        
        {/* Informações do Cliente */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-lg">👤</span>
            <div>
              <div className="font-medium text-gray-800">
                Cliente: {clienteNome || 'Nome não informado'}
              </div>
              <div className="text-sm text-gray-600">
                ID: {clienteId || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Modelos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📋 Modelos Disponíveis
        </h3>

        {carregandoModelos ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando modelos...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modelos.map((modelo) => (
              <div
                key={modelo._id}
                onClick={() => selecionarModelo(modelo)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  modeloSelecionado?._id === modelo._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    {modelo.nome}
                  </h4>
                  {modeloSelecionado?._id === modelo._id && (
                    <span className="text-blue-600 text-xl">✅</span>
                  )}
                </div>
                
                {renderizarInfoModelo(modelo)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modelo Selecionado */}
      {renderizarModeloSelecionado()}

      {/* Mensagem de Erro */}
      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">❌ {erro}</p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onCancelar}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        
        <button
          onClick={confirmarSelecao}
          disabled={!modeloSelecionado || loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            modeloSelecionado && !loading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Aplicando...
            </span>
          ) : (
            'Aplicar Modelo'
          )}
        </button>
      </div>

      {/* Informações de Debug (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <strong>Debug:</strong> clienteId={clienteId}, modelos={modelos.length}
        </div>
      )}
    </div>
  );
};

export default SelecaoModeloAnamnese;




