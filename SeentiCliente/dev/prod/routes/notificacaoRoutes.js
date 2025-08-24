const express = require('express');
const router = express.Router();
const notificacaoController = require('../controllers/notificacaoController');

/**
 * @route   GET /notificacoes/cliente/:id
 * @desc    Buscar notificações de um cliente
 * @access  Private
 */
router.get('/cliente/:id', notificacaoController.buscarNotificacoes);

/**
 * @route   PATCH /notificacoes/:id/ler
 * @desc    Marcar notificação como lida
 * @access  Private
 */
router.patch('/:id/ler', notificacaoController.marcarComoLida);

/**
 * @route   PATCH /notificacoes/cliente/:id/ler-todas
 * @desc    Marcar todas as notificações como lidas
 * @access  Private
 */
router.patch('/cliente/:id/ler-todas', notificacaoController.marcarTodasComoLidas);

/**
 * @route   PATCH /notificacoes/:id/arquivar
 * @desc    Arquivar notificação
 * @access  Private
 */
router.patch('/:id/arquivar', notificacaoController.arquivarNotificacao);

/**
 * @route   DELETE /notificacoes/:id
 * @desc    Deletar notificação
 * @access  Private
 */
router.delete('/:id', notificacaoController.deletarNotificacao);

/**
 * @route   POST /notificacoes/teste
 * @desc    Criar notificação de teste (desenvolvimento)
 * @access  Private
 */
router.post('/teste', notificacaoController.criarNotificacaoTeste);

module.exports = router;




