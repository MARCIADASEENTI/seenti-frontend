const ConfiguracaoCliente = require('../models/ConfiguracaoCliente');
const Cliente = require('../models/Cliente');

class ConfiguracaoController {
  
  /**
   * Buscar configurações de um cliente
   * GET /configuracoes/cliente/:id
   */
  async buscarConfiguracoes(req, res) {
    try {
      const { id } = req.params;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cliente inválido'
        });
      }
      
      // Verificar se o cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Buscar configurações
      const configuracoes = await ConfiguracaoCliente.buscarPorCliente(id);
      
      if (!configuracoes) {
        return res.status(404).json({
          success: false,
          message: 'Configurações não encontradas para este cliente'
        });
      }
      
      // Retornar configurações encontradas
      res.status(200).json({
        success: true,
        data: {
          notificacoes: configuracoes.notificacoes,
          privacidade: configuracoes.privacidade,
          preferencias: configuracoes.preferencias,
          criado_em: configuracoes.criado_em,
          atualizado_em: configuracoes.atualizado_em
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar configurações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar configurações',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Criar ou atualizar configurações de um cliente
   * POST /configuracoes/cliente/:id
   */
  async salvarConfiguracoes(req, res) {
    try {
      const { id } = req.params;
      const dadosConfiguracao = req.body;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cliente inválido'
        });
      }
      
      // Verificar se o cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Validar dados recebidos
      const { error, value } = this.validarDadosConfiguracao(dadosConfiguracao);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados de configuração inválidos',
          errors: error.details
        });
      }
      
      // Preparar dados para salvamento
      const dadosParaSalvar = this.prepararDadosParaSalvamento(value);
      
      // Criar ou atualizar configurações
      const configuracoes = await ConfiguracaoCliente.criarOuAtualizar(id, dadosParaSalvar);
      
      // Log de sucesso
      console.log(`✅ Configurações salvas para cliente ${id}:`, {
        notificacoes: configuracoes.notificacoes,
        privacidade: configuracoes.privacidade,
        preferencias: configuracoes.preferencias
      });
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Configurações salvas com sucesso',
        data: {
          id: configuracoes._id,
          cliente_id: configuracoes.cliente_id,
          notificacoes: configuracoes.notificacoes,
          privacidade: configuracoes.privacidade,
          preferencias: configuracoes.preferencias,
          criado_em: configuracoes.criado_em,
          atualizado_em: configuracoes.atualizado_em
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao salvar configurações',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Atualizar configuração específica
   * PATCH /configuracoes/cliente/:id
   */
  async atualizarConfiguracao(req, res) {
    try {
      const { id } = req.params;
      const { campo, valor } = req.body;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cliente inválido'
        });
      }
      
      // Validar campo e valor
      if (!campo || valor === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Campo e valor são obrigatórios'
        });
      }
      
      // Verificar se o cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Buscar configurações existentes
      let configuracoes = await ConfiguracaoCliente.buscarPorCliente(id);
      
      // Se não existir, criar com valores padrão
      if (!configuracoes) {
        configuracoes = new ConfiguracaoCliente({ cliente_id: id });
        await configuracoes.save();
      }
      
      // Atualizar configuração específica
      await configuracoes.atualizarConfiguracao(campo, valor);
      
      // Log de sucesso
      console.log(`✅ Configuração atualizada para cliente ${id}:`, { campo, valor });
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Configuração atualizada com sucesso',
        data: {
          campo,
          valor,
          atualizado_em: configuracoes.atualizado_em
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao atualizar configuração',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Deletar configurações de um cliente
   * DELETE /configuracoes/cliente/:id
   */
  async deletarConfiguracoes(req, res) {
    try {
      const { id } = req.params;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cliente inválido'
        });
      }
      
      // Verificar se o cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Deletar configurações
      const resultado = await ConfiguracaoCliente.findOneAndDelete({ cliente_id: id });
      
      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: 'Configurações não encontradas para este cliente'
        });
      }
      
      // Log de sucesso
      console.log(`✅ Configurações deletadas para cliente ${id}`);
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Configurações deletadas com sucesso'
      });
      
    } catch (error) {
      console.error('❌ Erro ao deletar configurações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao deletar configurações',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Validar dados de configuração
   */
  validarDadosConfiguracao(dados) {
    // Validação básica - em produção usar Joi ou similar
    const erros = [];
    
    // Validar notificações
    if (dados.notificacoes) {
      const tiposNotificacao = ['email', 'push', 'agendamentos', 'lembretes', 'promocoes'];
      tiposNotificacao.forEach(tipo => {
        if (dados.notificacoes[tipo] !== undefined && typeof dados.notificacoes[tipo] !== 'boolean') {
          erros.push(`notificacoes.${tipo} deve ser um boolean`);
        }
      });
    }
    
    // Validar privacidade
    if (dados.privacidade) {
      const tiposPrivacidade = ['perfil_publico', 'compartilhar_dados', 'receber_contatos'];
      tiposPrivacidade.forEach(tipo => {
        if (dados.privacidade[tipo] !== undefined && typeof dados.privacidade[tipo] !== 'boolean') {
          erros.push(`privacidade.${tipo} deve ser um boolean`);
        }
      });
    }
    
    // Validar preferências
    if (dados.preferencias) {
      if (dados.preferencias.idioma && !['pt-BR', 'en-US', 'es-ES'].includes(dados.preferencias.idioma)) {
        erros.push('preferencias.idioma deve ser pt-BR, en-US ou es-ES');
      }
      
      if (dados.preferencias.tema && !['claro', 'escuro', 'auto'].includes(dados.preferencias.tema)) {
        erros.push('preferencias.tema deve ser claro, escuro ou auto');
      }
      
      if (dados.preferencias.fuso_horario) {
        const fusoHorariosValidos = [
          'America/Sao_Paulo',
          'America/New_York',
          'Europe/London',
          'Asia/Tokyo'
        ];
        if (!fusoHorariosValidos.includes(dados.preferencias.fuso_horario)) {
          erros.push('preferencias.fuso_horario inválido');
        }
      }
    }
    
    if (erros.length > 0) {
      return { error: { details: erros }, value: null };
    }
    
    return { error: null, value: dados };
  }
  
  /**
   * Preparar dados para salvamento no MongoDB
   */
  prepararDadosParaSalvamento(dados) {
    const dadosPreparados = {};
    
    // Mapear estrutura do frontend para estrutura do MongoDB
    if (dados.notificacoes_email !== undefined) {
      dadosPreparados['notificacoes.email'] = dados.notificacoes_email;
    }
    if (dados.notificacoes_push !== undefined) {
      dadosPreparados['notificacoes.push'] = dados.notificacoes_push;
    }
    if (dados.notificacoes_agendamentos !== undefined) {
      dadosPreparados['notificacoes.agendamentos'] = dados.notificacoes_agendamentos;
    }
    if (dados.notificacoes_lembretes !== undefined) {
      dadosPreparados['notificacoes.lembretes'] = dados.notificacoes_lembretes;
    }
    if (dados.notificacoes_promocoes !== undefined) {
      dadosPreparados['notificacoes.promocoes'] = dados.notificacoes_promocoes;
    }
    
    if (dados.perfil_publico !== undefined) {
      dadosPreparados['privacidade.perfil_publico'] = dados.perfil_publico;
    }
    if (dados.compartilhar_dados !== undefined) {
      dadosPreparados['privacidade.compartilhar_dados'] = dados.compartilhar_dados;
    }
    if (dados.receber_contatos !== undefined) {
      dadosPreparados['privacidade.receber_contatos'] = dados.receber_contatos;
    }
    
    if (dados.idioma !== undefined) {
      dadosPreparados['preferencias.idioma'] = dados.idioma;
    }
    if (dados.tema !== undefined) {
      dadosPreparados['preferencias.tema'] = dados.tema;
    }
    if (dados.fuso_horario !== undefined) {
      dadosPreparados['preferencias.fuso_horario'] = dados.fuso_horario;
    }
    
    return dadosPreparados;
  }
}

module.exports = new ConfiguracaoController();




