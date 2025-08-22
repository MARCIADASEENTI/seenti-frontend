# 🏗️ Arquitetura Técnica do Projeto Seenti App

## 📋 **Visão Geral da Arquitetura**

O **Seenti App** utiliza uma arquitetura moderna de **3 camadas** com separação clara de responsabilidades, sistema WhiteLabel integrado e deploy distribuído.

## 🎨 **Arquitetura do Frontend**

### **Estrutura de Pastas**
```
Frontend/
├── src/
│   ├── components/
│   │   ├── cliente/           # Componentes específicos do cliente
│   │   └── shared/            # Componentes reutilizáveis
│   ├── layouts/               # Layouts principais
│   ├── whiteLabel/            # Sistema WhiteLabel
│   │   ├── config/            # Configurações de marca
│   │   ├── themes/            # Temas disponíveis
│   │   ├── layouts/           # Layouts específicos
│   │   └── utils/             # Utilitários WhiteLabel
│   ├── services/              # Serviços e APIs
│   ├── config/                # Configurações da aplicação
│   └── utils/                 # Utilitários gerais
```

### **Tecnologias Frontend**
- **React 18**: Biblioteca principal para UI
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utilitário
- **React Router DOM**: Roteamento da aplicação
- **Axios**: Cliente HTTP para APIs

### **Padrões de Desenvolvimento**
- **Componentes Funcionais**: Hooks modernos (useState, useEffect, useNavigate)
- **Hooks Customizados**: `useGoogleSession` para gerenciamento de estado OAuth
- **Props Drilling**: Comunicação entre componentes
- **CSS Modules**: Estilos isolados por componente
- **Responsive Design**: Mobile-first com Tailwind
- **Validação em Tempo Real**: Feedback instantâneo para usuários

## 🔧 **Arquitetura do Backend**

### **Estrutura de Pastas**
```
Backend/
├── dev/                       # Ambiente de desenvolvimento
│   └── app.py                # Servidor Flask local
├── prod/                      # Ambiente de produção
│   └── app.py                # Servidor Flask produção
├── requirements.txt           # Dependências Python
└── deploy_backend.sh         # Script de deploy
```

### **Tecnologias Backend**
- **Flask 3.1.1**: Framework web Python
- **Flask-PyMongo**: Integração com MongoDB
- **Flask-CORS**: Cross-Origin Resource Sharing
- **Flask-Bcrypt**: Hash de senhas
- **Gunicorn**: WSGI server para produção

### **Padrões de Desenvolvimento**
- **RESTful API**: Endpoints padronizados
- **JWT Authentication**: Tokens para autenticação
- **Google OAuth 2.0**: Autenticação social integrada
- **MongoDB Collections**: Schema flexível
- **Error Handling**: Tratamento inteligente de erros com códigos específicos
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação de Dados**: Verificação em tempo real de emails e senhas

## 🗄️ **Arquitetura de Dados**

### **MongoDB Collections**
```javascript
// Estrutura das principais collections
usuarios: {
  _id: ObjectId,
  email: String,
  senha: String (hash),
  tipo_usuario: String, // "C" = Cliente, "T" = Terapeuta
  tenant_id: ObjectId,
  created_at: Date
}

clientes: {
  _id: ObjectId,
  usuario_id: ObjectId,
  nome: String,
  telefone: String,
  data_nascimento: Date,
  endereco: Object,
  created_at: Date
}

anamneses: {
  _id: ObjectId,
  cliente_id: ObjectId,
  dados: Object, // Formulário completo
  created_at: Date
}

agendamentos: {
  _id: ObjectId,
  cliente_id: ObjectId,
  terapeuta_id: ObjectId,
  data_hora: Date,
  status: String, // "agendado", "confirmado", "cancelado"
  created_at: Date
}

terapeutas: {
  _id: ObjectId,
  nome: String,
  especialidade: String,
  disponibilidade: Array,
  created_at: Date
}
```

### **Relacionamentos**
- **1:1**: Usuario ↔ Cliente
- **1:N**: Cliente ↔ Anamneses
- **1:N**: Cliente ↔ Agendamentos
- **N:N**: Clientes ↔ Terapeutas (via agendamentos)

## 🎨 **Sistema WhiteLabel**

### **Arquitetura WhiteLabel**
```
whiteLabel/
├── config/
│   └── brandConfig.js        # Configuração da marca atual
├── themes/
│   └── index.js              # Temas disponíveis
├── layouts/
│   ├── WhiteLabelLayout.jsx  # Layout para auth/cadastro
│   └── PerfilClienteLayout.jsx # Layout para área cliente
└── utils/
    └── detectBrand.js        # Detecção automática de marca
```

### **Detecção de Marca**
```javascript
// Lógica de detecção automática
export function detectBrand() {
  const host = window.location.hostname;
  const port = window.location.port;
  
  if (host === 'localhost' || host === '127.0.0.1') {
    if (port === '8080') return 'default'; // Port forwarding
    if (port === '5173') return 'default'; // Dev local
  }
  
  const subdomain = host.split('.')[0];
  return knownBrands.includes(subdomain) ? subdomain : 'default';
}
```

### **Temas Disponíveis**
```javascript
export const themes = {
  default: {
    name: 'Seenti',
    logo: '/logo.png',
    primaryColor: '#1E3A8A',    // Azul
    secondaryColor: '#AC80DD',  // Roxo
    fontFamily: 'Arial, sans-serif'
  },
  parceiroX: {
    name: 'Marcia Alves',
    logo: '/assets/logo-parceirox.png',
    primaryColor: '#FF6600',    // Laranja
    secondaryColor: '#f4f4f4',  // Rosa claro
    fontFamily: 'Roboto, sans-serif'
  }
};
```

## 🌐 **Arquitetura de Deploy**

### **Frontend (Vercel)**
- **Build**: Vite build → pasta `dist/`
- **Deploy**: Automático via GitHub
- **Configuração**: `vercel.json` com rewrites e headers
- **Domínio**: `frontend-seenti-app.vercel.app`

### **Backend (Render)**
- **Runtime**: Python 3.10
- **Build**: `pip install -r requirements.txt`
- **Start**: `gunicorn prod.app:app --bind=0.0.0.0:$PORT`
- **Domínio**: `backend-seenti-app.onrender.com`

### **Configuração Vercel**
```json
{
  "version": 2,
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "dist" }
  }],
  "rewrites": [
    { "source": "/assets/(.*)", "destination": "/assets/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/assets/(.*)", "headers": [
      { "key": "Content-Type", "value": "application/javascript" },
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]}
  ]
}
```

## 🔒 **Arquitetura de Segurança**

### **Autenticação**
- **JWT Tokens**: Stateless authentication
- **Bcrypt**: Hash seguro de senhas
- **CORS**: Configurado para domínios específicos
- **HTTPS**: Forçado em produção

### **Validação de Dados**
- **Frontend**: Validação em tempo real
- **Backend**: Validação de entrada e sanitização
- **MongoDB**: Schema validation (opcional)

### **Proteção de Rotas**
- **Middleware**: Verificação de JWT
- **Autorização**: Baseada em tipo de usuário
- **Rate Limiting**: Proteção contra ataques

## 📱 **Arquitetura Responsiva**

### **Breakpoints Tailwind**
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### **Layouts Adaptativos**
- **Mobile**: Sidebar colapsável, header compacto
- **Tablet**: Sidebar parcial, layout híbrido
- **Desktop**: Sidebar fixa, layout expandido

### **Componentes Responsivos**
```jsx
// Exemplo de componente responsivo
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-3 sm:p-4 lg:p-6">
    {/* Conteúdo adaptativo */}
  </div>
</div>
```

## 🔄 **Fluxo de Dados**

### **Fluxo de Autenticação**
```
1. Login → POST /login
2. Validação → Bcrypt + MongoDB
3. Resposta → JWT Token
4. Storage → localStorage
5. Requests → Authorization Header
```

### **Fluxo de Cliente**
```
1. Cadastro → POST /usuarios
2. Criação → POST /clientes
3. Termos → POST /termos_uso
4. Anamnese → POST /anamneses
5. Agendamento → POST /agendamentos
```

## 🧪 **Arquitetura de Testes**

### **Estrutura de Testes**
```
tests/
├── unit/                      # Testes unitários
├── integration/               # Testes de integração
├── e2e/                      # Testes end-to-end
└── fixtures/                 # Dados de teste
```

### **Ferramentas de Teste**
- **Jest**: Framework de testes JavaScript
- **React Testing Library**: Testes de componentes
- **Supertest**: Testes de API
- **Playwright**: Testes E2E

## 🔐 **Arquitetura de Segurança e Validação**

### **Sistema de Validação de Senha**
```javascript
// Critérios de senha forte implementados
const passwordRequirements = {
  length: password.length >= 8,           // Mínimo 8 caracteres
  lowercase: /[a-z]/.test(password),     // Letra minúscula
  uppercase: /[A-Z]/.test(password),     // Letra maiúscula
  numbers: /\d/.test(password),          // Número
  special: /[!@#$%^&*(),.?":{}|<>]/.test(password) // Caractere especial
};
```

### **Validação de Emails em Tempo Real**
- **Frontend**: Debounce de 500ms para verificações
- **Backend**: API `/usuarios/verificar-email/<email>`
- **Feedback**: Cores e mensagens claras para o usuário
- **Prevenção**: Bloqueio de cadastros duplicados

### **Sistema de Login Inteligente**
- **Tratamento de Erros**: Códigos específicos (400, 401, 404, 409, 500)
- **Sugestões Contextuais**: Botão de cadastro para usuários não encontrados
- **Mensagens Claras**: Diferenciação entre erros de rede e de aplicação
- **UX Aprimorada**: Redirecionamento inteligente baseado no status

### **Persistência de Sessão Google OAuth**
- **Hook Customizado**: `useGoogleSession` para gerenciamento de estado
- **Expiração Automática**: Tokens com TTL configurável
- **Alertas de Sessão**: Notificações antes da expiração
- **Cleanup Automático**: Limpeza de dados expirados

### **Proteção de Rotas e Middleware**
- **Verificação de JWT**: Middleware de autenticação
- **Autorização Baseada em Tipo**: Cliente vs Terapeuta
- **CORS Configurado**: Domínios específicos permitidos
- **HTTPS Forçado**: Em ambiente de produção

## 📊 **Monitoramento e Logs**

### **Logs de Aplicação**
- **Frontend**: Console logs para debug
- **Backend**: Logs estruturados com timestamps
- **Deploy**: Logs de build e runtime

### **Métricas de Performance**
- **Core Web Vitals**: LCP, FID, CLS
- **API Response Time**: Tempo de resposta
- **Error Rate**: Taxa de erros
- **Uptime**: Disponibilidade do serviço

---

**Versão**: 2.0  
**Última Atualização**: 18 de Agosto de 2025  
**Responsável**: Equipe Seenti  
**Status**: Implementado e Funcionando - Sprint 05 Completa


