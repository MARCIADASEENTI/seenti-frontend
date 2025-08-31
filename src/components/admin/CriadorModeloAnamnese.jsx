import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Componente de Criação de Modelos de Anamnese pelo SeentiAdm
 * Sprint 09.1 - T07: Criar sistema de criação de modelos pelo SeentiAdm
 */
const CriadorModeloAnamnese = ({ 
  onModeloCriado,
  onCancelar 
}) => {
  const [form, setForm] = useState({
    nome: '',
    tipo: 'personalizado',
    descricao: '',
    obrigatorio: false,
    versao: '1.0.0',
    campos: [],
    regras_negocio: {
      contraindicoes_criticas: [],
      bloqueia_agendamento: false,
      max_anamneses_por_cliente: 1,
      validacoes_especiais: {},
      alertas: []
    }
  });

  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Configuração da API
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const API_MODELOS = `${API_BASE}/api/v1/anamnese-modelos`;

  /**
   * Adiciona um novo campo ao modelo
   */
  const adicionarCampo = () => {
    const novoCampo = {
      id: Date.now(),
      nome: '',
      tipo: 'texto',
      obrigatorio: false,
      validacao: {},
      opcoes: [],
      descricao: '',
      placeholder: ''
    };
    setCampos([...campos, novoCampo]);
  };

  /**
   * Remove um campo
   */
  const removerCampo = (id) => {
    setCampos(campos.filter(campo => campo.id !== id));
  };

  /**
   * Atualiza um campo
   */
  const atualizarCampo = (id, campo) => {
    setCampos(campos.map(c => c.id === id ? { ...c, ...campo } : c));
  };

  /**
   * Adiciona opção para campo de múltipla escolha
   */
  const adicionarOpcao = (campoId) => {
    const campo = campos.find(c => c.id === campoId);
    if (campo) {
      const novaOpcao = `opcao_${campo.opcoes.length + 1}`;
      atualizarCampo(campoId, {
        opcoes: [...campo.opcoes, novaOpcao]
      });
    }
  };

  /**
   * Remove opção de campo
   */
  const removerOpcao = (campoId, opcaoIndex) => {
    const campo = campos.find(c => c.id === campoId);
    if (campo) {
      const novasOpcoes = campo.opcoes.filter((_, index) => index !== opcaoIndex);
      atualizarCampo(campoId, { opcoes: novasOpcoes });
    }
  };

  /**
   * Adiciona alerta
   */
  const adicionarAlerta = () => {
    const novoAlerta = `Alerta ${form.regras_negocio.alertas.length + 1}`;
    setForm({
      ...form,
      regras_negocio: {
        ...form.regras_negocio,
        alertas: [...form.regras_negocio.alertas, novoAlerta]
      }
    });
  };

  /**
   * Remove alerta
   */
  const removerAlerta = (index) => {
    const novosAlertas = form.regras_negocio.alertas.filter((_, i) => i !== index);
    setForm({
      ...form,
      regras_negocio: {
        ...form.regras_negocio,
        alertas: novosAlertas
      }
    });
  };

  /**
   * Valida o formulário
   */
  const validarFormulario = () => {
    if (!form.nome.trim()) {
      setErro('Nome do modelo é obrigatório');
      return false;
    }

    if (!form.descricao.trim()) {
      setErro('Descrição é obrigatória');
      return false;
    }

    if (campos.length === 0) {
      setErro('Adicione pelo menos um campo ao modelo');
      return false;
    }

    // Validar campos
    for (const campo of campos) {
      if (!campo.nome.trim()) {
        setErro(`Campo ${campo.id} deve ter um nome`);
        return false;
      }

      if (campo.tipo === 'multipla_escolha' && campo.opcoes.length === 0) {
        setErro(`Campo ${campo.nome} deve ter pelo menos uma opção`);
        return false;
      }
    }

    return true;
  };

  /**
   * Cria o modelo
   */
  const criarModelo = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setSucesso('');

      // Preparar dados do modelo
      const modeloData = {
        ...form,
        campos: campos.map(campo => ({
          nome: campo.nome,
          tipo: campo.tipo,
          obrigatorio: campo.obrigatorio,
          validacao: campo.validacao,
          opcoes: campo.opcoes,
          descricao: campo.descricao,
          placeholder: campo.placeholder
        })),
        tenant_id: 'default', // Será configurável no futuro
        ativo: true
      };

      console.log('🔧 Criando modelo:', modeloData);

      const response = await axios.post(API_MODELOS, modeloData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      if (response.data.status === 'success') {
        setSucesso('✅ Modelo criado com sucesso!');
        console.log('✅ Modelo criado:', response.data.data);
        
        if (onModeloCriado) {
          onModeloCriado(response.data.data);
        }

        // Limpar formulário
        setForm({
          nome: '',
          tipo: 'personalizado',
          descricao: '',
          obrigatorio: false,
          versao: '1.0.0',
          campos: [],
          regras_negocio: {
            contraindicoes_criticas: [],
            bloqueia_agendamento: false,
            max_anamneses_por_cliente: 1,
            validacoes_especiais: {},
            alertas: []
          }
        });
        setCampos([]);
      } else {
        throw new Error(response.data.message || 'Erro ao criar modelo');
      }

    } catch (error) {
      console.error('❌ Erro ao criar modelo:', error);
      setErro(error.response?.data?.message || error.message || 'Erro interno ao criar modelo');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderiza um campo
   */
  const renderizarCampo = (campo) => {
    return (
      <div key={campo.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">Campo: {campo.nome || 'Sem nome'}</h4>
          <button
            onClick={() => removerCampo(campo.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            🗑️ Remover
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome do campo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Campo *
            </label>
            <input
              type="text"
              value={campo.nome}
              onChange={(e) => atualizarCampo(campo.id, { nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: objetivo, nivel_dor"
            />
          </div>

          {/* Tipo do campo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              value={campo.tipo}
              onChange={(e) => atualizarCampo(campo.id, { tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="texto">Texto</option>
              <option value="numero">Número</option>
              <option value="booleano">Booleano (Sim/Não)</option>
              <option value="multipla_escolha">Múltipla Escolha</option>
              <option value="data">Data</option>
              <option value="objeto">Objeto</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={campo.descricao}
              onChange={(e) => atualizarCampo(campo.id, { descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição do campo"
            />
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={campo.placeholder}
              onChange={(e) => atualizarCampo(campo.id, { placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Texto de exemplo"
            />
          </div>
        </div>

        {/* Obrigatório */}
        <div className="mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={campo.obrigatorio}
              onChange={(e) => atualizarCampo(campo.id, { obrigatorio: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Campo obrigatório</span>
          </label>
        </div>

        {/* Opções para múltipla escolha */}
        {campo.tipo === 'multipla_escolha' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opções de Escolha
            </label>
            <div className="space-y-2">
              {campo.opcoes.map((opcao, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opcao}
                    onChange={(e) => {
                      const novasOpcoes = [...campo.opcoes];
                      novasOpcoes[index] = e.target.value;
                      atualizarCampo(campo.id, { opcoes: novasOpcoes });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Opção ${index + 1}`}
                  />
                  <button
                    onClick={() => removerOpcao(campo.id, index)}
                    className="text-red-600 hover:text-red-800 px-2 py-1"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                onClick={() => adicionarOpcao(campo.id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ➕ Adicionar Opção
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="criador-modelo-anamnese p-6 border border-gray-200 rounded-lg bg-white max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔧 Criador de Modelos de Anamnese
        </h2>
        <p className="text-gray-600">
          Crie modelos personalizados de anamnese para diferentes tipos de clientes
        </p>
      </div>

      {/* Formulário Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Nome e Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Modelo *
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Anamnese Especializada"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="personalizado">Personalizado</option>
            <option value="basico">Básico</option>
            <option value="gestante">Gestante</option>
            <option value="esportiva">Esportiva</option>
            <option value="terapeutica">Terapêutica</option>
          </select>
        </div>

        {/* Versão e Obrigatório */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Versão
          </label>
          <input
            type="text"
            value={form.versao}
            onChange={(e) => setForm({ ...form, versao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.0.0"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.obrigatorio}
              onChange={(e) => setForm({ ...form, obrigatorio: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Modelo obrigatório</span>
          </label>
        </div>
      </div>

      {/* Descrição */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva o propósito e características deste modelo"
        />
      </div>

      {/* Campos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📋 Campos do Modelo
          </h3>
          <button
            onClick={adicionarCampo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Adicionar Campo
          </button>
        </div>

        {campos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum campo adicionado ainda</p>
            <p className="text-sm">Clique em "Adicionar Campo" para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campos.map(renderizarCampo)}
          </div>
        )}
      </div>

      {/* Regras de Negócio */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ⚙️ Regras de Negócio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloqueia Agendamento */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.regras_negocio.bloqueia_agendamento}
                onChange={(e) => setForm({
                  ...form,
                  regras_negocio: {
                    ...form.regras_negocio,
                    bloqueia_agendamento: e.target.checked
                  }
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Bloqueia agendamento se não preenchida</span>
            </label>
          </div>

          {/* Máximo de Anamneses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Anamneses por Cliente
            </label>
            <input
              type="number"
              value={form.regras_negocio.max_anamneses_por_cliente}
              onChange={(e) => setForm({
                ...form,
                regras_negocio: {
                  ...form.regras_negocio,
                  max_anamneses_por_cliente: parseInt(e.target.value) || 1
                }
              })}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Alertas */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alertas para o Terapeuta
          </label>
          <div className="space-y-2">
            {form.regras_negocio.alertas.map((alerta, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={alerta}
                  onChange={(e) => {
                    const novosAlertas = [...form.regras_negocio.alertas];
                    novosAlertas[index] = e.target.value;
                    setForm({
                      ...form,
                      regras_negocio: {
                        ...form.regras_negocio,
                        alertas: novosAlertas
                      }
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Verificar contraindicações"
                />
                <button
                  onClick={() => removerAlerta(index)}
                  className="text-red-600 hover:text-red-800 px-2 py-1"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              onClick={adicionarAlerta}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ➕ Adicionar Alerta
            </button>
          </div>
        </div>
      </div>

      {/* Mensagens de Status */}
      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">❌ {erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">✅ {sucesso}</p>
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
          onClick={criarModelo}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Criando...
            </span>
          ) : (
            '🚀 Criar Modelo'
          )}
        </button>
      </div>

      {/* Informações de Debug (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <strong>Debug:</strong> campos={campos.length}, tipo={form.tipo}
        </div>
      )}
    </div>
  );
};

export default CriadorModeloAnamnese;




