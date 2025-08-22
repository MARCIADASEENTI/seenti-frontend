const Notificacao = require('../models/Notificacao');
const Cliente = require('../models/Cliente');

class NotificacaoController {
  
  /**
   * Buscar notificações de um cliente
   * GET /notificacoes/cliente/:id
   */
  async buscarNotificacoes(req, res) {
    try {
      const { id } = req.params;
      const { status, tipo, limit = 50 } = req.query;
      
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
      
      // Preparar filtros
      const filtros = { cliente_id: id };
      if (status) filtros.status = status;
      if (tipo) filtros.tipo = tipo;
      
      // Buscar notificações
      const notificacoes = await Notificacao.find(filtros)
        .sort({ criado_em: -1 })
        .limit(parseInt(limit));
      
      // Contar total de não lidas
      const totalNaoLidas = await Notificacao.countDocuments({
        cliente_id: id,
        status: 'nao_lida'
      });
      
      // Log de sucesso
      console.log(`✅ Notificações buscadas para cliente ${id}:`, {
        total: notificacoes.length,
        nao_lidas: totalNaoLidas,
        filtros
      });
      
      // Retornar notificações
      res.status(200).json({
        success: true,
        data: {
          notificacoes,
          total: notificacoes.length,
          total_nao_lidas: totalNaoLidas,
          filtros_aplicados: filtros
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar notificações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar notificações',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Marcar notificação como lida
   * PATCH /notificacoes/:id/ler
   */
  async marcarComoLida(req, res) {
    try {
      const { id } = req.params;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da notificação inválido'
        });
      }
      
      // Buscar notificação
      const notificacao = await Notificacao.findById(id);
      if (!notificacao) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada'
        });
      }
      
      // Marcar como lida
      await notificacao.marcarComoLida();
      
      // Log de sucesso
      console.log(`✅ Notificação ${id} marcada como lida`);
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Notificação marcada como lida',
        data: {
          id: notificacao._id,
          status: notificacao.status,
          lida_em: notificacao.lida_em
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao marcar notificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Marcar todas as notificações como lidas
   * PATCH /notificacoes/cliente/:id/ler-todas
   */
  async marcarTodasComoLidas(req, res) {
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
      
      // Marcar todas como lidas
      const resultado = await Notificacao.updateMany(
        { cliente_id: id, status: 'nao_lida' },
        { 
          status: 'lida',
          lida_em: new Date()
        }
      );
      
      // Log de sucesso
      console.log(`✅ ${resultado.modifiedCount} notificações marcadas como lidas para cliente ${id}`);
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Todas as notificações foram marcadas como lidas',
        data: {
          cliente_id: id,
          notificacoes_marcadas: resultado.modifiedCount
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao marcar todas as notificações como lidas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao marcar notificações',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Arquivar notificação
   * PATCH /notificacoes/:id/arquivar
   */
  async arquivarNotificacao(req, res) {
    try {
      const { id } = req.params;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da notificação inválido'
        });
      }
      
      // Buscar notificação
      const notificacao = await Notificacao.findById(id);
      if (!notificacao) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada'
        });
      }
      
      // Arquivar notificação
      await notificacao.arquivar();
      
      // Log de sucesso
      console.log(`✅ Notificação ${id} arquivada`);
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Notificação arquivada com sucesso',
        data: {
          id: notificacao._id,
          status: notificacao.status
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao arquivar notificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao arquivar notificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Deletar notificação
   * DELETE /notificacoes/:id
   */
  async deletarNotificacao(req, res) {
    try {
      const { id } = req.params;
      
      // Validar se o ID é válido
      if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da notificação inválido'
        });
      }
      
      // Deletar notificação
      const resultado = await Notificacao.findByIdAndDelete(id);
      
      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada'
        });
      }
      
      // Log de sucesso
      console.log(`✅ Notificação ${id} deletada`);
      
      // Retornar sucesso
      res.status(200).json({
        success: true,
        message: 'Notificação deletada com sucesso'
      });
      
    } catch (error) {
      console.error('❌ Erro ao deletar notificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao deletar notificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Criar notificação de teste (para desenvolvimento)
   * POST /notificacoes/teste
   */
  async criarNotificacaoTeste(req, res) {
    try {
      const { cliente_id, tipo = 'sistema' } = req.body;
      
      // Validar se o ID é válido
      if (!cliente_id || !require('mongoose').Types.ObjectId.isValid(cliente_id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cliente inválido'
        });
      }
      
      // Verificar se o cliente existe
      const cliente = await Cliente.findById(cliente_id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Criar notificação de teste
      const notificacao = await Notificacao.create({
        cliente_id,
        tipo,
        titulo: 'Notificação de Teste',
        mensagem: 'Esta é uma notificação de teste para validar o sistema.',
        status: 'nao_lida'
      });
      
      // Log de sucesso
      console.log(`✅ Notificação de teste criada para cliente ${cliente_id}:`, {
        id: notificacao._id,
        tipo: notificacao.tipo
      });
      
      // Retornar sucesso
      res.status(201).json({
        success: true,
        message: 'Notificação de teste criada com sucesso',
        data: notificacao
      });
      
    } catch (error) {
      console.error('❌ Erro ao criar notificação de teste:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar notificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new NotificacaoController();




