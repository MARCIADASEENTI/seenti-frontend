import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Componente de Vinculação Automática de Anamnese ao Prontuário
 * Sprint 09.1 - T04: Vincular automaticamente anamnese básica ao prontuário
 */
const VinculacaoAnamnese = ({ 
  clienteId, 
  anamneseId, 
  dadosAnamnese, 
  onVinculacaoSucesso,
  onVinculacaoErro 
}) => {
  const [status, setStatus] = useState('idle'); // idle, vinculando, sucesso, erro
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  // Configuração da API
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const API_ENDPOINT = `${API_BASE}/api/v1/vinculacao/vincular-automatico`;

  /**
   * Executa a vinculação automática
   */
  const executarVinculacao = async () => {
    if (!clienteId || !anamneseId || !dadosAnamnese) {
      setErro('Dados insuficientes para vinculação');
      setStatus('erro');
      if (onVinculacaoErro) onVinculacaoErro('Dados insuficientes');
      return;
    }

    setStatus('vinculando');
    setErro(null);

    try {
      const payload = {
        cliente_id: clienteId,
        anamnese_id: anamneseId,
        dados_anamnese: dadosAnamnese
      };

      console.log('🔗 Iniciando vinculação automática:', payload);

      const response = await axios.post(API_ENDPOINT, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos
      });

      if (response.data.success) {
        setResultado(response.data);
        setStatus('sucesso');
        console.log('✅ Vinculação realizada com sucesso:', response.data);
        
        if (onVinculacaoSucesso) {
          onVinculacaoSucesso(response.data);
        }
      } else {
        throw new Error(response.data.error || 'Erro na vinculação');
      }

    } catch (error) {
      console.error('❌ Erro na vinculação:', error);
      
      const mensagemErro = error.response?.data?.error || 
                           error.message || 
                           'Erro interno na vinculação';
      
      setErro(mensagemErro);
      setStatus('erro');
      
      if (onVinculacaoErro) {
        onVinculacaoErro(mensagemErro);
      }
    }
  };

  /**
   * Verifica se pode executar a vinculação
   */
  const podeExecutar = () => {
    return clienteId && anamneseId && dadosAnamnese && status === 'idle';
  };

  /**
   * Renderiza o status atual
   */
  const renderizarStatus = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="text-gray-600 text-sm">
            Pronto para vincular anamnese ao prontuário
          </div>
        );
      
      case 'vinculando':
        return (
          <div className="flex items-center text-blue-600 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Vinculando anamnese...
          </div>
        );
      
      case 'sucesso':
        return (
          <div className="text-green-600 text-sm font-medium">
            ✅ Anamnese vinculada com sucesso!
          </div>
        );
      
      case 'erro':
        return (
          <div className="text-red-600 text-sm">
            ❌ {erro}
          </div>
        );
      
      default:
        return null;
    }
  };

  /**
   * Renderiza informações do resultado
   */
  const renderizarResultado = () => {
    if (status !== 'sucesso' || !resultado) return null;

    return (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">
          Vínculo Criado com Sucesso
        </h4>
        
        <div className="space-y-1 text-sm text-green-700">
          {resultado.prontuario_id && (
            <div>
              <strong>Prontuário:</strong> {resultado.prontuario_id}
            </div>
          )}
          
          {resultado.vinculo_id && (
            <div>
              <strong>Vínculo:</strong> {resultado.vinculo_id}
            </div>
          )}
          
          {resultado.nivel_risco && (
            <div>
              <strong>Nível de Risco:</strong> 
              <span className={`ml-1 px-2 py-1 rounded text-xs ${
                resultado.nivel_risco === 'baixo' ? 'bg-green-100 text-green-800' :
                resultado.nivel_risco === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                resultado.nivel_risco === 'alto' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {resultado.nivel_risco.toUpperCase()}
              </span>
            </div>
          )}
          
          {resultado.mensagem && (
            <div>
              <strong>Mensagem:</strong> {resultado.mensagem}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="vinculacao-anamnese p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          🔗 Vinculação Automática
        </h3>
        
        <button
          onClick={executarVinculacao}
          disabled={!podeExecutar()}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            podeExecutar()
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {status === 'vinculando' ? 'Vinculando...' : 'Vincular Anamnese'}
        </button>
      </div>

      {/* Status da operação */}
      <div className="mb-3">
        {renderizarStatus()}
      </div>

      {/* Resultado da vinculação */}
      {renderizarResultado()}

      {/* Informações de debug (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <strong>Debug:</strong> clienteId={clienteId}, anamneseId={anamneseId}
        </div>
      )}
    </div>
  );
};

export default VinculacaoAnamnese;




