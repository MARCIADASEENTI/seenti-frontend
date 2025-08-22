const mongoose = require('mongoose');

const configuracaoClienteSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
    unique: true
  },
  
  // Configurações de Notificação
  notificacoes: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    agendamentos: {
      type: Boolean,
      default: true
    },
    lembretes: {
      type: Boolean,
      default: true
    },
    promocoes: {
      type: Boolean,
      default: false
    }
  },
  
  // Configurações de Privacidade
  privacidade: {
    perfil_publico: {
      type: Boolean,
      default: false
    },
    compartilhar_dados: {
      type: Boolean,
      default: false
    },
    receber_contatos: {
      type: Boolean,
      default: false
    }
  },
  
  // Preferências Gerais
  preferencias: {
    idioma: {
      type: String,
      enum: ['pt-BR', 'en-US', 'es-ES'],
      default: 'pt-BR'
    },
    tema: {
      type: String,
      enum: ['claro', 'escuro', 'auto'],
      default: 'claro'
    },
    fuso_horario: {
      type: String,
      default: 'America/Sao_Paulo'
    }
  },
  
  // Metadados
  criado_em: {
    type: Date,
    default: Date.now
  },
  atualizado_em: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'configuracoes_clientes'
});

// Middleware para atualizar timestamp
configuracaoClienteSchema.pre('save', function(next) {
  this.atualizado_em = new Date();
  next();
});

// Índices para performance
configuracaoClienteSchema.index({ cliente_id: 1 });
configuracaoClienteSchema.index({ 'notificacoes.email': 1 });
configuracaoClienteSchema.index({ 'preferencias.idioma': 1 });

// Métodos estáticos
configuracaoClienteSchema.statics.buscarPorCliente = function(clienteId) {
  return this.findOne({ cliente_id: clienteId });
};

configuracaoClienteSchema.statics.criarOuAtualizar = function(clienteId, dados) {
  return this.findOneAndUpdate(
    { cliente_id: clienteId },
    { 
      $set: dados,
      $setOnInsert: { criado_em: new Date() }
    },
    { 
      new: true, 
      upsert: true,
      runValidators: true 
    }
  );
};

// Métodos de instância
configuracaoClienteSchema.methods.atualizarConfiguracao = function(campo, valor) {
  this.set(campo, valor);
  this.atualizado_em = new Date();
  return this.save();
};

configuracaoClienteSchema.methods.obterConfiguracaoNotificacao = function(tipo) {
  return this.notificacoes[tipo] || false;
};

configuracaoClienteSchema.methods.obterPreferencia = function(tipo) {
  return this.preferencias[tipo];
};

// Validações customizadas
configuracaoClienteSchema.path('preferencias.fuso_horario').validate(function(value) {
  const fusoHorariosValidos = [
    'America/Sao_Paulo',
    'America/New_York', 
    'Europe/London',
    'Asia/Tokyo'
  ];
  return fusoHorariosValidos.includes(value);
}, 'Fuso horário inválido');

module.exports = mongoose.model('ConfiguracaoCliente', configuracaoClienteSchema);




