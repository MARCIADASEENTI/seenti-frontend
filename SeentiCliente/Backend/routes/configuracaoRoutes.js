const express = require('express');
const router = express.Router();
const configuracaoController = require('../controllers/configuracaoController');

/**
 * @route   GET /configuracoes/cliente/:id
 * @desc    Buscar configurações de um cliente
 * @access  Private
 */
router.get('/cliente/:id', configuracaoController.buscarConfiguracoes);

/**
 * @route   POST /configuracoes/cliente/:id
 * @desc    Criar ou atualizar configurações de um cliente
 * @access  Private
 */
router.post('/cliente/:id', configuracaoController.salvarConfiguracoes);

/**
 * @route   PATCH /configuracoes/cliente/:id
 * @desc    Atualizar configuração específica de um cliente
 * @access  Private
 */
router.patch('/cliente/:id', configuracaoController.atualizarConfiguracao);

/**
 * @route   DELETE /configuracoes/cliente/:id
 * @desc    Deletar configurações de um cliente
 * @access  Private
 */
router.delete('/cliente/:id', configuracaoController.deletarConfiguracoes);

module.exports = router;




