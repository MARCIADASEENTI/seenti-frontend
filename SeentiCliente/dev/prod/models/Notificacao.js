const mongoose = require('mongoose');

const notificacaoSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  
  // Tipo da notificação
  tipo: {
    type: String,
    enum: ['agendamento', 'sistema', 'lembrete', 'promocao', 'atualizacao'],
    required: true
  },
  
  // Título da notificação
  titulo: {
    type: String,
    required: true,
    maxlength: 100
  },
  
  // Mensagem da notificação
  mensagem: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Status da notificação
  status: {
    type: String,
    enum: ['nao_lida', 'lida', 'arquivada'],
    default: 'nao_lida'
  },
  
  // Dados adicionais (opcional)
  dados_adicional: {
    agendamento_id: mongoose.Schema.Types.ObjectId,
    link: String,
    acao: String
  },
  
  // Metadados
  criado_em: {
    type: Date,
    default: Date.now
  },
  
  lida_em: {
    type: Date,
    default: null
  },
  
  expira_em: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'notificacoes_clientes'
});

// Índices para performance
notificacaoSchema.index({ cliente_id: 1, status: 1 });
notificacaoSchema.index({ cliente_id: 1, criado_em: -1 });
notificacaoSchema.index({ tipo: 1, status: 1 });
notificacaoSchema.index({ expira_em: 1 }, { expireAfterSeconds: 0 });

// Métodos estáticos
notificacaoSchema.statics.buscarPorCliente = function(clienteId, limit = 50) {
  return this.find({ cliente_id: clienteId })
    .sort({ criado_em: -1 })
    .limit(limit);
};

notificacaoSchema.statics.buscarNaoLidas = function(clienteId) {
  return this.find({ 
    cliente_id: clienteId, 
    status: 'nao_lida' 
  }).sort({ criado_em: -1 });
};

notificacaoSchema.statics.criarNotificacao = function(dados) {
  return this.create(dados);
};

// Métodos de instância
notificacaoSchema.methods.marcarComoLida = function() {
  this.status = 'lida';
  this.lida_em = new Date();
  return this.save();
};

notificacaoSchema.methods.arquivar = function() {
  this.status = 'arquivada';
  return this.save();
};

// Middleware para validação
notificacaoSchema.pre('save', function(next) {
  // Se foi marcada como lida, atualizar timestamp
  if (this.isModified('status') && this.status === 'lida' && !this.lida_em) {
    this.lida_em = new Date();
  }
  next();
});

module.exports = mongoose.model('Notificacao', notificacaoSchema);




