const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  // Referência ao cliente que solicitou
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  
  // Data solicitada pelo cliente
  data_solicitada: {
    type: Date,
    required: true
  },
  
  // Hora solicitada (formato HH:MM)
  hora_solicitada: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // Validação formato HH:MM
  },
  
  // Status do agendamento
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'cancelado', 'rejeitado'],
    default: 'pendente'
  },
  
  // Observações do cliente (opcional)
  observacoes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Referência ao terapeuta (quando confirmado)
  terapeuta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terapeuta',
    default: null
  },
  
  // Data de confirmação (quando aprovado)
  data_confirmacao: {
    type: Date,
    default: null
  },
  
  // Motivo de rejeição (se aplicável)
  motivo_rejeicao: {
    type: String,
    maxlength: 200,
    default: ''
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  collection: 'agendamentos'
});

// Índices para performance
agendamentoSchema.index({ cliente_id: 1, status: 1 });
agendamentoSchema.index({ data_solicitada: 1, status: 1 });
agendamentoSchema.index({ terapeuta_id: 1, status: 1 });

// Métodos estáticos
agendamentoSchema.statics.buscarPorCliente = function(clienteId) {
  return this.find({ cliente_id: clienteId })
    .sort({ data_solicitada: 1, hora_solicitada: 1 })
    .populate('cliente_id', 'nome email');
};

agendamentoSchema.statics.buscarPendentes = function() {
  return this.find({ status: 'pendente' })
    .sort({ data_solicitada: 1, hora_solicitada: 1 })
    .populate('cliente_id', 'nome email telefone');
};

agendamentoSchema.statics.buscarPorData = function(dataInicio, dataFim) {
  return this.find({
    data_solicitada: {
      $gte: dataInicio,
      $lte: dataFim
    }
  }).sort({ data_solicitada: 1, hora_solicitada: 1 });
};

// Métodos de instância
agendamentoSchema.methods.confirmar = function(terapeutaId) {
  this.status = 'confirmado';
  this.terapeuta_id = terapeutaId;
  this.data_confirmacao = new Date();
  return this.save();
};

agendamentoSchema.methods.rejeitar = function(motivo) {
  this.status = 'rejeitado';
  this.motivo_rejeicao = motivo;
  return this.save();
};

agendamentoSchema.methods.cancelar = function() {
  if (this.status === 'pendente') {
    this.status = 'cancelado';
    return this.save();
  }
  throw new Error('Apenas agendamentos pendentes podem ser cancelados');
};

// Validações customizadas
agendamentoSchema.pre('save', function(next) {
  // Validar que a data solicitada não é no passado
  if (this.data_solicitada < new Date()) {
    next(new Error('Não é possível solicitar agendamento para datas passadas'));
  }
  
  // Validar que hora está no formato correto
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this.hora_solicitada)) {
    next(new Error('Formato de hora inválido. Use HH:MM'));
  }
  
  next();
});

// Virtual para data completa (data + hora)
agendamentoSchema.virtual('data_hora_completa').get(function() {
  if (this.data_solicitada && this.hora_solicitada) {
    const [horas, minutos] = this.hora_solicitada.split(':');
    const dataCompleta = new Date(this.data_solicitada);
    dataCompleta.setHours(parseInt(horas), parseInt(minutos), 0, 0);
    return dataCompleta;
  }
  return null;
});

// Configurar para incluir virtuals no JSON
agendamentoSchema.set('toJSON', { virtuals: true });
agendamentoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Agendamento', agendamentoSchema);



