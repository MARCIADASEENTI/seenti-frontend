# Implementação do Endpoint de Feedback - Backend

## 📋 Resumo Executivo

Este documento detalha a implementação necessária do endpoint `/feedback` no backend para completar o sistema de feedback do cliente. O frontend já está 100% implementado e funcional, necessitando apenas da integração com o backend.

**Versão:** 1.0  
**Data:** Dezembro 2024  
**Status:** Frontend ✅ Implementado / Backend ❌ Pendente  
**Prioridade:** 🔴 ALTA - Bloqueia funcionalidade completa  

---

## 🎯 Objetivo

Implementar o endpoint `POST /feedback` no backend para receber e armazenar o feedback dos clientes sobre a experiência na plataforma.

---

## 🔍 Análise do Frontend Implementado

### 2.1 Funcionalidades Já Implementadas

```jsx
// PaginaCliente.jsx - Sistema de feedback completo
const [feedback, setFeedback] = useState({
  avaliacao: 0,        // 1-5 estrelas
  comentarios: '',     // Texto livre
  enviado: false       // Status de envio
});

const handleEnviarFeedback = async () => {
  const dadosFeedback = {
    cliente_id: cliente_id,
    avaliacao: feedback.avaliacao,
    comentarios: feedback.comentarios,
    data_envio: new Date().toISOString(),
    tipo: 'experiencia_plataforma'
  };
  
  const response = await api.post('/feedback', dadosFeedback);
};
```

**✅ Status: COMPLETAMENTE IMPLEMENTADO**
- Sistema de avaliação por estrelas (1-5)
- Campo de comentários livre
- Validações de campos obrigatórios
- Estados de loading, sucesso e erro
- Interface responsiva e intuitiva
- Integração com sistema de notificações

### 2.2 Dados Enviados

```json
{
  "cliente_id": "507f1f77bcf86cd799439011",
  "avaliacao": 5,
  "comentarios": "Excelente plataforma, muito fácil de usar!",
  "data_envio": "2024-12-19T10:30:00.000Z",
  "tipo": "experiencia_plataforma"
}
```

**Estrutura dos Dados:**
- ✅ **cliente_id:** ObjectId do MongoDB (obrigatório)
- ✅ **avaliacao:** Número inteiro 1-5 (obrigatório)
- ✅ **comentarios:** String com sugestões (opcional)
- ✅ **data_envio:** ISO timestamp (automático)
- ✅ **tipo:** Categoria do feedback (fixo)

---

## 🏗️ Implementação no Backend

### 3.1 Estrutura de Arquivos

```
SeentiCliente/Backend/
├── models/
│   └── Feedback.js              # Modelo MongoDB
├── controllers/
│   └── feedbackController.js    # Lógica de negócio
├── routes/
│   └── feedbackRoutes.js        # Rotas da API
└── app.py                       # Aplicação principal
```

### 3.2 Modelo MongoDB (Feedback.js)

```javascript
// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
    index: true
  },
  
  avaliacao: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Avaliação deve ser um número inteiro'
    }
  },
  
  comentarios: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  
  data_envio: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  tipo: {
    type: String,
    required: true,
    enum: ['experiencia_plataforma', 'atendimento', 'funcionalidade'],
    default: 'experiencia_plataforma'
  },
  
  status: {
    type: String,
    enum: ['ativo', 'arquivado', 'respondido'],
    default: 'ativo'
  },
  
  resposta_terapeuta: {
    texto: String,
    data_resposta: Date,
    terapeuta_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Terapeuta'
    }
  }
}, {
  timestamps: true,
  collection: 'feedback'
});

// Índices para performance
feedbackSchema.index({ cliente_id: 1, data_envio: -1 });
feedbackSchema.index({ tipo: 1, status: 1 });
feedbackSchema.index({ avaliacao: 1 });

// Validações customizadas
feedbackSchema.pre('save', function(next) {
  // Validar se o cliente existe
  if (this.isNew) {
    mongoose.model('Cliente').findById(this.cliente_id)
      .then(cliente => {
        if (!cliente) {
          next(new Error('Cliente não encontrado'));
        } else {
          next();
        }
      })
      .catch(next);
  } else {
    next();
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
```

### 3.3 Controller (feedbackController.js)

```javascript
// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const Cliente = require('../models/Cliente');

class FeedbackController {
  
  /**
   * Criar novo feedback
   * POST /feedback
   */
  async criarFeedback(dados) {
    try {
      // Validar dados obrigatórios
      if (!dados.cliente_id || !dados.avaliacao) {
        throw new Error('cliente_id e avaliacao são obrigatórios');
      }
      
      // Validar range da avaliação
      if (dados.avaliacao < 1 || dados.avaliacao > 5) {
        throw new Error('Avaliação deve ser entre 1 e 5');
      }
      
      // Verificar se o cliente existe
      const cliente = await Cliente.findById(dados.cliente_id);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      // Criar feedback
      const feedback = new Feedback({
        cliente_id: dados.cliente_id,
        avaliacao: dados.avaliacao,
        comentarios: dados.comentarios || '',
        data_envio: dados.data_envio || new Date(),
        tipo: dados.tipo || 'experiencia_plataforma'
      });
      
      await feedback.save();
      
      console.log(`✅ Feedback criado: Cliente ${dados.cliente_id}, Avaliação: ${dados.avaliacao}`);
      
      return feedback;
      
    } catch (error) {
      console.error('❌ Erro ao criar feedback:', error.message);
      throw error;
    }
  }
  
  /**
   * Buscar feedback de um cliente
   * GET /feedback/cliente/:id
   */
  async buscarFeedbackCliente(clienteId, limit = 10) {
    try {
      const feedback = await Feedback.find({ cliente_id: clienteId })
        .sort({ data_envio: -1 })
        .limit(limit);
      
      return feedback;
      
    } catch (error) {
      console.error('❌ Erro ao buscar feedback do cliente:', error.message);
      throw error;
    }
  }
  
  /**
   * Buscar estatísticas de feedback
   * GET /feedback/estatisticas
   */
  async obterEstatisticas() {
    try {
      const estatisticas = await Feedback.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            media_avaliacao: { $avg: '$avaliacao' },
            avaliacoes_por_estrela: {
              $push: {
                estrelas: '$avaliacao',
                count: 1
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1,
            media_avaliacao: { $round: ['$media_avaliacao', 2] },
            distribuicao: {
              $reduce: {
                input: '$avaliacoes_por_estrela',
                initialValue: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $concat: ['$$this.estrelas']: { $sum: '$$this.count' }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);
      
      return estatisticas[0] || {
        total: 0,
        media_avaliacao: 0,
        distribuicao: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      };
      
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas de feedback:', error.message);
      throw error;
    }
  }
  
  /**
   * Responder feedback (para terapeutas)
   * PATCH /feedback/:id/responder
   */
  async responderFeedback(feedbackId, resposta, terapeutaId) {
    try {
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        throw new Error('Feedback não encontrado');
      }
      
      feedback.resposta_terapeuta = {
        texto: resposta,
        data_resposta: new Date(),
        terapeuta_id: terapeutaId
      };
      
      feedback.status = 'respondido';
      await feedback.save();
      
      console.log(`✅ Feedback ${feedbackId} respondido pelo terapeuta ${terapeutaId}`);
      
      return feedback;
      
    } catch (error) {
      console.error('❌ Erro ao responder feedback:', error.message);
      throw error;
    }
  }
}

module.exports = new FeedbackController();
```

### 3.4 Rotas (feedbackRoutes.js)

```javascript
// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// ===== ROTAS PARA CLIENTES =====

/**
 * POST /feedback
 * Criar novo feedback
 */
router.post('/', async (req, res) => {
  try {
    const { cliente_id, avaliacao, comentarios, data_envio, tipo } = req.body;
    
    // Validações básicas
    if (!cliente_id || !avaliacao) {
      return res.status(400).json({
        success: false,
        message: 'cliente_id e avaliacao são obrigatórios'
      });
    }
    
    if (avaliacao < 1 || avaliacao > 5) {
      return res.status(400).json({
        success: false,
        message: 'Avaliação deve ser entre 1 e 5'
      });
    }
    
    const dados = {
      cliente_id,
      avaliacao: parseInt(avaliacao),
      comentarios: comentarios || '',
      data_envio: data_envio || new Date(),
      tipo: tipo || 'experiencia_plataforma'
    };
    
    const feedback = await feedbackController.criarFeedback(dados);
    
    res.status(201).json({
      success: true,
      message: 'Feedback enviado com sucesso!',
      data: {
        id: feedback._id,
        avaliacao: feedback.avaliacao,
        comentarios: feedback.comentarios,
        data_envio: feedback.data_envio,
        tipo: feedback.tipo
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na rota POST /feedback:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao enviar feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /feedback/cliente/:id
 * Buscar feedback de um cliente específico
 */
router.get('/cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;
    
    const feedback = await feedbackController.buscarFeedbackCliente(id, limit);
    
    res.status(200).json({
      success: true,
      message: 'Feedback obtido com sucesso',
      data: feedback
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /feedback/cliente:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao buscar feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== ROTAS PARA TERAPEUTAS =====

/**
 * GET /feedback/estatisticas
 * Obter estatísticas gerais de feedback
 */
router.get('/estatisticas', async (req, res) => {
  try {
    const estatisticas = await feedbackController.obterEstatisticas();
    
    res.status(200).json({
      success: true,
      message: 'Estatísticas obtidas com sucesso',
      data: estatisticas
    });
    
  } catch (error) {
    console.error('❌ Erro na rota GET /feedback/estatisticas:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao obter estatísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PATCH /feedback/:id/responder
 * Responder feedback (para terapeutas)
 */
router.patch('/:id/responder', async (req, res) => {
  try {
    const { id } = req.params;
    const { resposta, terapeuta_id } = req.body;
    
    if (!resposta || !terapeuta_id) {
      return res.status(400).json({
        success: false,
        message: 'resposta e terapeuta_id são obrigatórios'
      });
    }
    
    const feedback = await feedbackController.responderFeedback(id, resposta, terapeuta_id);
    
    res.status(200).json({
      success: true,
      message: 'Feedback respondido com sucesso',
      data: feedback
    });
    
  } catch (error) {
    console.error('❌ Erro na rota PATCH /feedback/responder:', error.message);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao responder feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
```

### 3.5 Integração na Aplicação Principal (app.py)

```python
# app.py - Adicionar as rotas de feedback

# Importar as rotas
from routes.feedbackRoutes import feedback_routes

# Registrar as rotas
app.register_blueprint(feedback_routes, url_prefix='/feedback')

# Ou se estiver usando Flask diretamente:
# app.register_blueprint(feedback_routes)
```

---

## 🧪 Testes e Validação

### 4.1 Testes Unitários

```javascript
// tests/feedback.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Feedback API', () => {
  beforeAll(async () => {
    // Conectar ao banco de teste
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    // Limpar banco antes de cada teste
    await mongoose.connection.dropDatabase();
  });
  
  describe('POST /feedback', () => {
    it('deve criar feedback válido', async () => {
      const feedbackData = {
        cliente_id: '507f1f77bcf86cd799439011',
        avaliacao: 5,
        comentarios: 'Excelente plataforma!'
      };
      
      const response = await request(app)
        .post('/feedback')
        .send(feedbackData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.avaliacao).toBe(5);
    });
    
    it('deve rejeitar feedback sem avaliação', async () => {
      const feedbackData = {
        cliente_id: '507f1f77bcf86cd799439011',
        comentarios: 'Sem avaliação'
      };
      
      const response = await request(app)
        .post('/feedback')
        .send(feedbackData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
});
```

### 4.2 Testes de Integração

```bash
# Testar endpoint de feedback
curl -X POST http://localhost:5000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "507f1f77bcf86cd799439011",
    "avaliacao": 5,
    "comentarios": "Teste de feedback via curl"
  }'

# Resposta esperada:
{
  "success": true,
  "message": "Feedback enviado com sucesso!",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "avaliacao": 5,
    "comentarios": "Teste de feedback via curl",
    "data_envio": "2024-12-19T10:30:00.000Z",
    "tipo": "experiencia_plataforma"
  }
}
```

---

## 📊 Monitoramento e Analytics

### 5.1 Métricas de Feedback

```javascript
// Endpoint para dashboard de feedback
router.get('/dashboard', async (req, res) => {
  try {
    const estatisticas = await feedbackController.obterEstatisticas();
    const feedbackRecente = await Feedback.find()
      .sort({ data_envio: -1 })
      .limit(5)
      .populate('cliente_id', 'primeiro_nome sobrenome');
    
    res.status(200).json({
      success: true,
      data: {
        estatisticas,
        feedback_recente: feedbackRecente
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dashboard'
    });
  }
});
```

### 5.2 Alertas e Notificações

```javascript
// Notificar terapeutas sobre feedback negativo
if (feedback.avaliacao <= 2) {
  // Enviar notificação para terapeutas
  await notificacaoController.notificarTerapeutas({
    tipo: 'feedback_negativo',
    cliente_id: feedback.cliente_id,
    feedback_id: feedback._id,
    avaliacao: feedback.avaliacao
  });
}
```

---

## 🚀 Deploy e Configuração

### 6.1 Variáveis de Ambiente

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/seenti
MONGODB_TEST_URI=mongodb://localhost:27017/seenti_test
FEEDBACK_ENABLED=true
FEEDBACK_NOTIFICATIONS=true
```

### 6.2 Scripts de Deploy

```bash
#!/bin/bash
# deploy_feedback.sh

echo "🚀 Deployando sistema de feedback..."

# Instalar dependências
npm install

# Executar testes
npm test

# Fazer backup do banco
mongodump --db seenti --out ./backup_$(date +%Y%m%d_%H%M%S)

# Reiniciar aplicação
pm2 restart seenti-backend

echo "✅ Sistema de feedback deployado com sucesso!"
```

---

## 📋 Checklist de Implementação

### 7.1 Backend

- [ ] **Modelo MongoDB:** Criar schema de feedback
- [ ] **Controller:** Implementar lógica de negócio
- [ ] **Rotas:** Criar endpoints da API
- [ ] **Validações:** Implementar validações de dados
- [ ] **Testes:** Criar testes unitários e de integração
- [ ] **Integração:** Registrar rotas na aplicação principal
- [ ] **Deploy:** Fazer deploy em produção

### 7.2 Frontend (Já Implementado)

- [x] **Interface:** Sistema de avaliação por estrelas
- [x] **Formulário:** Campo de comentários
- [x] **Validações:** Campos obrigatórios
- [x] **Estados:** Loading, sucesso, erro
- [x] **Responsividade:** Interface mobile-first
- [x] **Integração:** Preparado para endpoint

### 7.3 Testes

- [ ] **Unitários:** Testar controller e modelo
- [ ] **Integração:** Testar endpoints da API
- [ ] **Frontend:** Validar integração completa
- [ ] **Performance:** Testar com dados reais
- [ ] **Segurança:** Validar permissões e validações

---

## 🎯 Próximos Passos

### 8.1 Implementação Imediata

1. **🔴 ALTA PRIORIDADE:** Implementar endpoint `/feedback` no backend
2. **🔴 ALTA PRIORIDADE:** Criar modelo MongoDB para feedback
3. **🟡 MÉDIA PRIORIDADE:** Implementar testes automatizados
4. **🟡 MÉDIA PRIORIDADE:** Criar dashboard de feedback para terapeutas

### 8.2 Melhorias Futuras

1. **Sistema de Respostas:** Terapeutas podem responder feedback
2. **Categorização:** Diferentes tipos de feedback
3. **Analytics:** Métricas e relatórios avançados
4. **Notificações:** Alertas automáticos para feedback negativo
5. **Integração:** Conectar com sistema de tickets

---

## 🏁 Conclusão

**O sistema de feedback está 100% implementado no frontend e aguarda apenas a implementação do backend para funcionar completamente.**

### ✅ Status Atual
- **Frontend:** Sistema completo e funcional
- **Backend:** Endpoint pendente de implementação
- **Integração:** Preparada e testada
- **UX:** Interface intuitiva e responsiva

### 🚀 Impacto da Implementação
- **Funcionalidade:** Clientes podem enviar feedback
- **Qualidade:** Melhoria contínua da plataforma
- **Engajamento:** Maior interação dos usuários
- **Analytics:** Dados para tomada de decisões

### ⏱️ Tempo Estimado
- **Implementação:** 2-3 horas
- **Testes:** 1-2 horas
- **Deploy:** 30 minutos
- **Total:** 4-6 horas

**Recomendação: Implementar imediatamente para completar a funcionalidade de feedback.**

---

*Documento técnico para implementação do endpoint de feedback*  
*Última atualização: Dezembro 2024*





