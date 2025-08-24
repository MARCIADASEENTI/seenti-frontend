const Agendamento = require('../models/Agendamento');
const Cliente = require('../models/Cliente');

class AgendamentoController {
  
  // ===== MÉTODOS PARA CLIENTES =====
  
  /**
   * Criar nova solicitação de agendamento
   */
  static async criarAgendamento(dados) {
    try {
      // Validar se o cliente existe
      const cliente = await Cliente.findById(dados.cliente_id);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      // Validar se não há conflito de horário para o mesmo cliente
      const conflito = await Agendamento.findOne({
        cliente_id: dados.cliente_id,
        data_solicitada: dados.data_solicitada,
        hora_solicitada: dados.hora_solicitada,
        status: { $in: ['pendente', 'confirmado'] }
      });
      
      if (conflito) {
        throw new Error('Já existe um agendamento para esta data e horário');
      }
      
      // Criar o agendamento
      const agendamento = new Agendamento({
        cliente_id: dados.cliente_id,
        data_solicitada: dados.data_solicitada,
        hora_solicitada: dados.hora_solicitada,
        observacoes: dados.observacoes || '',
        status: 'pendente'
      });
      
      const resultado = await agendamento.save();
      console.log('✅ Agendamento criado:', resultado._id);
      
      return resultado;
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error.message);
      throw error;
    }
  }
  
  /**
   * Buscar agendamentos de um cliente específico
   */
  static async buscarAgendamentosCliente(clienteId) {
    try {
      const agendamentos = await Agendamento.buscarPorCliente(clienteId);
      console.log(`✅ ${agendamentos.length} agendamentos encontrados para cliente ${clienteId}`);
      return agendamentos;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos do cliente:', error.message);
      throw error;
    }
  }
  
  /**
   * Cancelar agendamento (apenas se pendente)
   */
  static async cancelarAgendamento(agendamentoId, clienteId) {
    try {
      const agendamento = await Agendamento.findById(agendamentoId);
      
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }
      
      // Verificar se pertence ao cliente
      if (agendamento.cliente_id.toString() !== clienteId) {
        throw new Error('Não autorizado a cancelar este agendamento');
      }
      
      // Verificar se pode ser cancelado
      if (agendamento.status !== 'pendente') {
        throw new Error('Apenas agendamentos pendentes podem ser cancelados');
      }
      
      await agendamento.cancelar();
      console.log('✅ Agendamento cancelado:', agendamentoId);
      
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao cancelar agendamento:', error.message);
      throw error;
    }
  }
  
  /**
   * Atualizar observações de um agendamento
   */
  static async atualizarObservacoes(agendamentoId, clienteId, observacoes) {
    try {
      const agendamento = await Agendamento.findById(agendamentoId);
      
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }
      
      // Verificar se pertence ao cliente
      if (agendamento.cliente_id.toString() !== clienteId) {
        throw new Error('Não autorizado a atualizar este agendamento');
      }
      
      // Verificar se pode ser editado
      if (agendamento.status !== 'pendente') {
        throw new Error('Apenas agendamentos pendentes podem ser editados');
      }
      
      agendamento.observacoes = observacoes;
      await agendamento.save();
      
      console.log('✅ Observações atualizadas:', agendamentoId);
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao atualizar observações:', error.message);
      throw error;
    }
  }
  
  // ===== MÉTODOS PARA TERAPEUTAS (PRÓXIMA SPRINT) =====
  
  /**
   * Buscar todos os agendamentos pendentes (para terapeutas)
   */
  static async buscarAgendamentosPendentes() {
    try {
      const agendamentos = await Agendamento.buscarPendentes();
      console.log(`✅ ${agendamentos.length} agendamentos pendentes encontrados`);
      return agendamentos;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos pendentes:', error.message);
      throw error;
    }
  }
  
  /**
   * Confirmar agendamento (para terapeutas)
   */
  static async confirmarAgendamento(agendamentoId, terapeutaId) {
    try {
      const agendamento = await Agendamento.findById(agendamentoId);
      
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }
      
      if (agendamento.status !== 'pendente') {
        throw new Error('Apenas agendamentos pendentes podem ser confirmados');
      }
      
      await agendamento.confirmar(terapeutaId);
      console.log('✅ Agendamento confirmado:', agendamentoId);
      
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao confirmar agendamento:', error.message);
      throw error;
    }
  }
  
  /**
   * Rejeitar agendamento (para terapeutas)
   */
  static async rejeitarAgendamento(agendamentoId, terapeutaId, motivo) {
    try {
      const agendamento = await Agendamento.findById(agendamentoId);
      
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }
      
      if (agendamento.status !== 'pendente') {
        throw new Error('Apenas agendamentos pendentes podem ser rejeitados');
      }
      
      await agendamento.rejeitar(motivo);
      console.log('✅ Agendamento rejeitado:', agendamentoId);
      
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao rejeitar agendamento:', error.message);
      throw error;
    }
  }
  
  // ===== MÉTODOS UTILITÁRIOS =====
  
  /**
   * Buscar agendamento por ID
   */
  static async buscarPorId(agendamentoId) {
    try {
      const agendamento = await Agendamento.findById(agendamentoId)
        .populate('cliente_id', 'nome email telefone');
      
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }
      
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamento por ID:', error.message);
      throw error;
    }
  }
  
  /**
   * Buscar agendamentos por período
   */
  static async buscarPorPeriodo(dataInicio, dataFim) {
    try {
      const agendamentos = await Agendamento.buscarPorData(dataInicio, dataFim);
      console.log(`✅ ${agendamentos.length} agendamentos encontrados no período`);
      return agendamentos;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos por período:', error.message);
      throw error;
    }
  }
  
  /**
   * Estatísticas básicas (para dashboard)
   */
  static async obterEstatisticas() {
    try {
      const total = await Agendamento.countDocuments();
      const pendentes = await Agendamento.countDocuments({ status: 'pendente' });
      const confirmados = await Agendamento.countDocuments({ status: 'confirmado' });
      const cancelados = await Agendamento.countDocuments({ status: 'cancelado' });
      
      return {
        total,
        pendentes,
        confirmados,
        cancelados,
        percentual_confirmacao: total > 0 ? ((confirmados / total) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error.message);
      throw error;
    }
  }
}

module.exports = AgendamentoController;



