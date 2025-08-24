# Seenti Backend API

Backend da aplicação Seenti, desenvolvido em Flask com MongoDB.

## 🚀 Tecnologias

- **Python 3.8+**
- **Flask** - Framework web
- **PyMongo** - Driver MongoDB
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Werkzeug** - Utilitários de segurança

## 📁 Estrutura do Projeto

```
├── app.py                 # Aplicação principal Flask
├── models/                # Modelos MongoDB
│   ├── ConfiguracaoCliente.js
│   ├── Notificacao.js
│   └── Agendamento.js
├── controllers/           # Lógica de negócio
│   ├── configuracaoController.js
│   ├── notificacaoController.js
│   └── agendamentoController.js
├── routes/                # Rotas da API
│   ├── configuracaoRoutes.js
│   ├── notificacaoRoutes.js
│   └── agendamentoRoutes.js
└── requirements.txt       # Dependências Python
```

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/MARCIADASEENTI/seenti-backend.git
cd seenti-backend
```

2. **Crie um ambiente virtual:**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente:**
```bash
export MONGODB_URI="sua_uri_mongodb"
export FLASK_ENV="development"
```

5. **Execute a aplicação:**
```bash
python app.py
```

## 🌐 Endpoints da API

### Configurações do Cliente
- `GET /configuracoes/cliente/<cliente_id>` - Buscar configurações
- `POST /configuracoes/cliente/<cliente_id>` - Criar configurações
- `PATCH /configuracoes/cliente/<cliente_id>` - Atualizar configurações
- `DELETE /configuracoes/cliente/<cliente_id>` - Deletar configurações

### Notificações
- `GET /notificacoes/cliente/<cliente_id>` - Buscar notificações
- `PATCH /notificacoes/cliente/<cliente_id>` - Atualizar notificações
- `POST /notificacoes/cliente/<cliente_id>` - Criar notificação

### Agendamentos
- `POST /agendamentos/cliente/<cliente_id>` - Criar agendamento
- `GET /agendamentos/cliente/<cliente_id>` - Buscar agendamentos
- `PATCH /agendamentos/cliente/<cliente_id>` - Atualizar agendamento

## 🚀 Deploy

O backend está configurado para deploy no **Render**.

## 📝 Sprint 06

- ✅ Sistema de configurações do cliente
- ✅ Sistema de notificações
- ✅ Sistema de agendamento
- ✅ Integração com MongoDB Atlas
- ✅ API RESTful completa

## 👥 Desenvolvimento

- **Arquitetura:** MVC (Model-View-Controller)
- **Banco de Dados:** MongoDB Atlas
- **Autenticação:** Google OAuth
- **CORS:** Habilitado para frontend
