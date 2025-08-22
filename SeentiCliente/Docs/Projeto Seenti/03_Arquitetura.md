# 🏗️ Arquitetura do Projeto Seenti App

## 📋 **Visão Geral da Arquitetura**

O Seenti App segue uma arquitetura **Full-Stack Moderna** com separação clara de responsabilidades, sistema WhiteLabel integrado e deploy multi-ambiente.

## 🏛️ **Arquitetura de Alto Nível**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Flask)       │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • WhiteLabel    │    │ • REST API      │    │ • Collections   │
│ • Responsivo    │    │ • Auth JWT      │    │ • Indexes       │
│ • PWA Ready     │    │ • CORS          │    │ • Aggregations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │     Render      │    │   MongoDB       │
│   (Frontend)    │    │   (Backend)     │    │   Atlas         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 **Sistema WhiteLabel**

### **Arquitetura de Temas**
```
src/whiteLabel/
├── config/
│   └── brandConfig.js          # Configuração central da marca
├── themes/
│   └── index.js                # Definição dos temas disponíveis
├── utils/
│   └── detectBrand.js          # Detecção automática de ambiente
└── layouts/
    └── WhiteLabelLayout.jsx    # Layout base com tema aplicado
```

### **Fluxo de Aplicação de Tema**
1. **Detecção**: `detectBrand()` identifica ambiente e marca
2. **Configuração**: `brandConfig.js` carrega tema apropriado
3. **Aplicação**: CSS variables e componentes recebem tema
4. **Fallback**: Sistema de backup para logos e estilos

## 🏗️ **Arquitetura Frontend**

### **Estrutura de Componentes**
```
src/
├── components/
│   ├── cliente/                 # Componentes específicos do cliente
│   │   ├── Login.jsx           # Autenticação
│   │   ├── CadastroCliente.jsx # Cadastro de clientes
│   │   ├── AnamneseCliente.jsx # Formulário de anamnese
│   │   └── PaginaCliente.jsx   # Perfil do cliente
│   └── layouts/                 # Layouts da aplicação
│       ├── WhiteLabelLayout.jsx # Layout para auth/onboarding
│       └── PerfilClienteLayout.jsx # Layout para área logada
├── whiteLabel/                  # Sistema WhiteLabel
├── services/
│   └── api.js                  # Cliente API centralizado
└── App.jsx                     # Componente raiz
```

### **Padrões de Design**
- **Componentes Funcionais**: Hooks e Context API
- **Props Drilling Minimizado**: Context para estado global
- **Separação de Responsabilidades**: Cada componente tem uma função específica
- **Reutilização**: Componentes genéricos e específicos bem definidos

## 🔧 **Arquitetura Backend**

### **Estrutura Flask**
```
dev/ ou prod/
├── app.py                      # Aplicação principal
├── routes/                     # Endpoints da API
│   ├── auth.py                # Autenticação
│   ├── clientes.py            # Gestão de clientes
│   ├── anamnese.py            # Gestão de anamnese
│   └── usuarios.py            # Gestão de usuários
├── models/                     # Modelos de dados
├── utils/                      # Utilitários
└── requirements.txt            # Dependências Python
```

### **Padrões de API**
- **RESTful**: Endpoints bem definidos e consistentes
- **JWT Authentication**: Tokens seguros para sessões
- **CORS**: Cross-origin habilitado para frontend
- **Error Handling**: Respostas de erro padronizadas
- **Validation**: Validação de dados de entrada

## 🗄️ **Arquitetura de Dados**

### **MongoDB Collections**
```javascript
// Usuários
usuarios: {
  _id: ObjectId,
  email: String,
  senha_hash: String,
  nome: String,
  tipo: String, // 'admin', 'profissional', 'cliente'
  criado_em: Date
}

// Clientes
clientes: {
  _id: ObjectId,
  usuario_id: ObjectId,
  nome: String,
  cpf: String,
  data_nascimento: Date,
  telefone: String,
  endereco: Object,
  criado_em: Date
}

// Anamnese
anamneses: {
  _id: ObjectId,
  cliente_id: ObjectId,
  dados: Object, // Formulário completo
  criado_em: Date,
  atualizado_em: Date
}
```

### **Índices e Performance**
- **Índices Únicos**: Email, CPF
- **Índices Compostos**: Usuário + Cliente
- **TTL Indexes**: Para dados temporários
- **Text Search**: Para busca em campos de texto

## 🌐 **Arquitetura de Deploy**

### **Ambiente de Desenvolvimento**
```
Local Development:
├── Frontend: localhost:5173 (Vite Dev Server)
├── Backend: localhost:5000 (Flask Dev Server)
└── Database: MongoDB Atlas (Cloud)

Port Forwarding:
├── Frontend: 10.0.0.167:8080
└── Backend: 10.0.0.167:5000
```

### **Ambiente de Produção**
```
Production:
├── Frontend: Vercel (CDN Global)
├── Backend: Render (Serverless)
└── Database: MongoDB Atlas (Cloud)
```

### **Configurações de Ambiente**
- **Variáveis de Ambiente**: `.env` para configurações sensíveis
- **Feature Flags**: Controle de funcionalidades por ambiente
- **Logs**: Sistema de logging estruturado
- **Monitoramento**: Métricas de performance e erro

## 🔒 **Arquitetura de Segurança**

### **Camadas de Segurança**
1. **Transporte**: HTTPS/TLS em produção
2. **Autenticação**: JWT com expiração
3. **Autorização**: Controle de acesso por tipo de usuário
4. **Validação**: Sanitização de inputs
5. **CORS**: Controle de origens permitidas
6. **Rate Limiting**: Proteção contra ataques

### **Proteção de Dados**
- **Senhas**: Hash com Bcrypt
- **Tokens**: Expiração automática
- **Logs**: Sem dados sensíveis
- **Backup**: Estratégia de backup regular

## 📱 **Arquitetura Mobile-First**

### **Responsividade**
- **Mobile-First**: Design iniciado para mobile
- **Breakpoints**: Tailwind CSS para diferentes tamanhos
- **Touch-Friendly**: Elementos otimizados para toque
- **Performance**: Otimizações específicas para mobile

### **PWA Ready**
- **Service Worker**: Cache offline
- **Manifest**: Instalação como app
- **Push Notifications**: Notificações push (futuro)

## 🔄 **Arquitetura de Integração**

### **APIs Externas**
- **Calendários**: Google Calendar, Outlook (futuro)
- **Pagamentos**: Stripe, PayPal (futuro)
- **Notificações**: Firebase, Twilio (futuro)
- **Storage**: AWS S3, Google Cloud (futuro)

### **Webhooks**
- **Eventos**: Notificações de mudanças
- **Integrações**: Sincronização com sistemas externos
- **Auditoria**: Log de todas as operações

## 📊 **Monitoramento e Observabilidade**

### **Métricas de Sistema**
- **Performance**: Tempo de resposta, throughput
- **Disponibilidade**: Uptime, downtime
- **Erros**: Taxa de erro, tipos de erro
- **Recursos**: CPU, memória, disco

### **Logs Estruturados**
- **Níveis**: DEBUG, INFO, WARNING, ERROR
- **Contexto**: Usuário, sessão, operação
- **Rastreamento**: Request ID para debugging
- **Agregação**: Centralização e análise

---

**Versão**: 1.0  
**Última Atualização**: 16 de Agosto de 2025  
**Responsável**: Equipe Seenti  
**Status**: Implementação Ativa
