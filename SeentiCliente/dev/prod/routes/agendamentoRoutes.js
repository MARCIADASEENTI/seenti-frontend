const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');

// ===== ROTAS PARA CLIENTES =====

/**
 * POST /agendamentos/cliente/:cliente_id
 * Criar nova solicitação de agendamento
 */
router.post('/cliente/:cliente_id', async (req, res) => {
  try {
    const { cliente_id } = req.params;
    const { data_solicitada, hora_solicitada, observacoes } = req.body;
    
    // Validações básicas
    if (!data_solicitada || !hora_solicitada) {
      return res.status(400).json({
        success: false,
        message: 'Data e hora são obrigatórias'
      });
    }
    
    // Validar formato da data
    const data = new Date(data_solicitada);
    if (isNaN(data.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Formato de data inválido'
      });
    }
    
    // Validar formato da hora (HH:MM)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora_solicitada)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de hora inválido. Use HH:MM'
      });
    }
    
    const dados = {
      cliente_id,
      data_solicitada: data,
      hora_solicitada,
      observacoes: observacoes || ''
    };
    
    const agendamento = await AgendamentoController.criarAgendamento(dados);
    
    res.status(201).json({
      success: true,
      message: 'Agendamento solicitado com sucesso!',
      data: agendamento
    });
    
  } catch (error) {
    console.error('❌ Erro na rota POST /agendamentos/cliente:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar agendamento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /agendamentos/cliente/:cliente_id
 * Buscar agendamentos de um cliente específico
 */
router.get('/cliente/:cliente_id', async (req, res) => {
  try {
    const { cliente_id } = req.params;
    
    const agendamentos = await AgendamentoController.buscarAgendamentosCliente(cliente_id);
    
    res.status(200).json({
      success: true,
      message: 'Agendamentos encontrados com sucesso',
      data: agendamentos,
      total: agendamentos.length
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /agendamentos/cliente:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao buscar agendamentos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PATCH /agendamentos/:agendamento_id/cancelar
 * Cancelar agendamento (apenas se pendente)
 */
router.patch('/:agendamento_id/cancelar', async (req, res) => {
  try {
    const { agendamento_id } = req.params;
    const { cliente_id } = req.body; // Cliente que está cancelando
    
    if (!cliente_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do cliente é obrigatório'
      });
    }
    
    const agendamento = await AgendamentoController.cancelarAgendamento(agendamento_id, cliente_id);
    
    res.status(200).json({
      success: true,
      message: 'Agendamento cancelado com sucesso',
      data: agendamento
    });
    
  } catch (error) {
    console.error('❌ Erro na rota PATCH /agendamentos/cancelar:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao cancelar agendamento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PATCH /agendamentos/:agendamento_id/observacoes
 * Atualizar observações de um agendamento
 */
router.patch('/:agendamento_id/observacoes', async (req, res) => {
  try {
    const { agendamento_id } = req.params;
    const { cliente_id, observacoes } = req.body;
    
    if (!cliente_id || observacoes === undefined) {
      return res.status(400).json({
        success: false,
        message: 'ID do cliente e observações são obrigatórios'
      });
    }
    
    const agendamento = await AgendamentoController.atualizarObservacoes(
      agendamento_id, 
      cliente_id, 
      observacoes
    );
    
    res.status(200).json({
      success: true,
      message: 'Observações atualizadas com sucesso',
      data: agendamento
    });
    
  } catch (error) {
    console.error('❌ Erro na rota PATCH /agendamentos/observacoes:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar observações',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== ROTAS PARA TERAPEUTAS (PRÓXIMA SPRINT) =====

/**
 * GET /agendamentos/pendentes
 * Buscar todos os agendamentos pendentes (para terapeutas)
 */
router.get('/pendentes', async (req, res) => {
  try {
    const agendamentos = await AgendamentoController.buscarAgendamentosPendentes();
    
    res.status(200).json({
      success: true,
      message: 'Agendamentos pendentes encontrados',
      data: agendamentos,
      total: agendamentos.length
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /agendamentos/pendentes:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao buscar agendamentos pendentes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PATCH /agendamentos/:agendamento_id/confirmar
 * Confirmar agendamento (para terapeutas)
 */
router.patch('/:agendamento_id/confirmar', async (req, res) => {
  try {
    const { agendamento_id } = req.params;
    const { terapeuta_id } = req.body;
    
    if (!terapeuta_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do terapeuta é obrigatório'
      });
    }
    
    const agendamento = await AgendamentoController.confirmarAgendamento(agendamento_id, terapeuta_id);
    
    res.status(200).json({
      success: true,
      message: 'Agendamento confirmado com sucesso',
      data: agendamento
    });
    
  } catch (error) {
    console.error('❌ Erro na rota PATCH /agendamentos/confirmar:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao confirmar agendamento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PATCH /agendamentos/:agendamento_id/rejeitar
 * Rejeitar agendamento (para terapeutas)
 */
router.patch('/:agendamento_id/rejeitar', async (req, res) => {
  try {
    const { agendamento_id } = req.params;
    const { terapeuta_id, motivo } = req.body;
    
    if (!terapeuta_id || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'ID do terapeuta e motivo são obrigatórios'
      });
    }
    
    const agendamento = await AgendamentoController.rejeitarAgendamento(agendamento_id, terapeuta_id, motivo);
    
    res.status(200).json({
      success: true,
      message: 'Agendamento rejeitado com sucesso',
      data: agendamento
    });
    
  } catch (error) {
    console.error('❌ Erro na rota PATCH /agendamentos/rejeitar:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao rejeitar agendamento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== ROTAS UTILITÁRIAS =====

/**
 * GET /agendamentos/:agendamento_id
 * Buscar agendamento específico por ID
 */
router.get('/:agendamento_id', async (req, res) => {
  try {
    const { agendamento_id } = req.params;
    
    const agendamento = await AgendamentoController.buscarPorId(agendamento_id);
    
    res.status(200).json({
      success: true,
      message: 'Agendamento encontrado com sucesso',
      data: agendamento
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /agendamentos/:id:', error.message);
    
    res.status(404).json({
      success: false,
      message: error.message || 'Agendamento não encontrado',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /agendamentos/estatisticas
 * Obter estatísticas básicas dos agendamentos
 */
router.get('/estatisticas/geral', async (req, res) => {
  try {
    const estatisticas = await AgendamentoController.obterEstatisticas();
    
    res.status(200).json({
      success: true,
      message: 'Estatísticas obtidas com sucesso',
      data: estatisticas
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /agendamentos/estatisticas:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao obter estatísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /agendamentos/periodo
 * Buscar agendamentos por período específico
 */
router.get('/periodo', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    if (!data_inicio || !data_fim) {
      return res.status(400).json({
        success: false,
        message: 'Data início e data fim são obrigatórias'
      });
    }
    
    const dataInicio = new Date(data_inicio);
    const dataFim = new Date(data_fim);
    
    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Formato de data inválido'
      });
    }
    
    const agendamentos = await AgendamentoController.buscarPorPeriodo(dataInicio, dataFim);
    
    res.status(200).json({
      success: true,
      message: 'Agendamentos do período encontrados',
      data: agendamentos,
      total: agendamentos.length,
      periodo: { data_inicio, data_fim }
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /agendamentos/periodo:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao buscar agendamentos por período',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;



