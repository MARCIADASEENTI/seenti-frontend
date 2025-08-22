# 👨‍💻 Guia do Desenvolvedor - Seenti App

## 🚀 **Configuração do Ambiente**

### **Pré-requisitos**
- **Node.js**: Versão 18+ (recomendado LTS)
- **Python**: Versão 3.10+
- **Git**: Versão mais recente
- **MongoDB**: Local ou Atlas
- **Editor**: VS Code (recomendado)

### **Instalação das Dependências**

#### **Frontend (React + Vite)**
```bash
cd SeentiCliente/Frontend
npm install
```

#### **Backend (Flask)**
```bash
cd SeentiCliente/dev
pip install -r requirements.txt
```

### **Variáveis de Ambiente**
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000

# Backend (.env)
MONGO_URI=mongodb://localhost:27017/seenti_db
JWT_SECRET=your_secret_key
```

## 🏗️ **Estrutura do Projeto**

### **Organização das Pastas**
```
SeentiCliente/
├── Frontend/                  # Aplicação React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── layouts/           # Layouts da aplicação
│   │   ├── whiteLabel/        # Sistema WhiteLabel
│   │   ├── services/          # Serviços e APIs
│   │   └── utils/             # Utilitários
│   ├── public/                # Arquivos estáticos
│   └── package.json           # Dependências Node.js
├── dev/                       # Backend desenvolvimento
├── prod/                      # Backend produção
└── Docs/                      # Documentação
```

### **Convenções de Nomenclatura**
- **Componentes**: PascalCase (ex: `AnamneseCliente.jsx`)
- **Arquivos**: camelCase (ex: `detectBrand.js`)
- **Pastas**: camelCase (ex: `whiteLabel`)
- **Variáveis**: camelCase (ex: `primaryColor`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_BASE_URL`)

## 🎨 **Sistema WhiteLabel**

### **Arquitetura WhiteLabel**
```javascript
// src/whiteLabel/config/brandConfig.js
export const brand = detectBrand();

// src/whiteLabel/themes/index.js
export const themes = {
  default: { /* tema Seenti */ },
  parceiroX: { /* tema parceiro */ }
};

// src/whiteLabel/utils/detectBrand.js
export function detectBrand() {
  // Lógica de detecção automática
}
```

### **Adicionando Novo Tema**
1. **Criar logo** em `public/assets/`
2. **Adicionar tema** em `themes/index.js`
3. **Configurar cores** e fontes
4. **Testar** em diferentes ambientes

```javascript
// Exemplo de novo tema
export const themes = {
  // ... temas existentes
  novoParceiro: {
    name: 'Nome do Parceiro',
    logo: '/assets/logo-novo.png',
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    fontFamily: 'Georgia, serif'
  }
};
```

### **Componentes WhiteLabel**
```jsx
// Exemplo de uso
import { brand } from '@white/config/brandConfig';
import { themes } from '@white/themes';

const theme = themes[brand];

return (
  <div style={{ backgroundColor: theme.primaryColor }}>
    <img src={theme.logo} alt={theme.name} />
  </div>
);
```

## 🔧 **Desenvolvimento Frontend**

### **Comandos de Desenvolvimento**
```bash
# Desenvolvimento local
npm run dev          # Servidor Vite (localhost:5173)

# Build para produção
npm run build        # Gera pasta dist/

# Preview do build
npm run preview      # Testa build localmente

# Linting
npm run lint         # Verifica código
```

### **Componentes React**
```jsx
// Estrutura padrão de componente
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MeuComponente = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/endpoint');
        setData(response.data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Conteúdo do componente */}
    </div>
  );
};

export default MeuComponente;
```

### **Estilização com Tailwind**
```jsx
// Classes responsivas
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4 
  sm:p-6 
  lg:p-8
">
  {/* Conteúdo */}
</div>

// Cores dinâmicas
<div className="bg-blue-500 hover:bg-blue-600">
  {/* Conteúdo */}
</div>
```

### **Roteamento**
```jsx
// src/components/cliente/RouterCliente.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

const RouterCliente = () => {
  return (
    <Routes>
      <Route path="/perfil" element={<PaginaCliente />} />
      <Route path="/anamnese" element={<AnamneseCliente />} />
      <Route path="/agendamentos" element={<AgendamentoCliente />} />
      <Route path="/" element={<Navigate to="/perfil" replace />} />
    </Routes>
  );
};
```

## 🐍 **Desenvolvimento Backend**

### **Comandos de Desenvolvimento**
```bash
# Desenvolvimento local
cd dev
python3 app.py

# Produção
cd prod
gunicorn app:app --bind=0.0.0.0:$PORT
```

### **Estrutura de Endpoint**
```python
# Exemplo de endpoint
@app.route('/api/endpoint', methods=['GET'])
@jwt_required
def get_data():
    try:
        # Lógica do endpoint
        data = collection.find()
        return jsonify(list(data)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### **Validação de Dados**
```python
# Exemplo de validação
def validate_user_data(data):
    required_fields = ['email', 'senha']
    
    for field in required_fields:
        if field not in data:
            return False, f'Campo {field} é obrigatório'
    
    if len(data['senha']) < 6:
        return False, 'Senha deve ter pelo menos 6 caracteres'
    
    return True, 'Dados válidos'
```

### **MongoDB Operations**
```python
# Exemplos de operações
from bson import ObjectId

# Inserir documento
result = collection.insert_one(document)

# Buscar por ID
document = collection.find_one({'_id': ObjectId(id)})

# Atualizar documento
result = collection.update_one(
    {'_id': ObjectId(id)},
    {'$set': update_data}
)

# Deletar documento
result = collection.delete_one({'_id': ObjectId(id)})
```

## 🧪 **Testes**

### **Estrutura de Testes**
```bash
# Criar estrutura
mkdir -p tests/{unit,integration,e2e}

# Instalar dependências de teste
npm install --save-dev jest @testing-library/react
```

### **Teste de Componente**
```jsx
// tests/unit/MeuComponente.test.jsx
import { render, screen } from '@testing-library/react';
import MeuComponente from '../../src/components/MeuComponente';

describe('MeuComponente', () => {
  test('renderiza corretamente', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
```

### **Teste de API**
```python
# tests/test_api.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_endpoint(client):
    response = client.get('/api/endpoint')
    assert response.status_code == 200
```

## 🚀 **Deploy**

### **Frontend (Vercel)**
```bash
# Build local
npm run build

# Deploy automático via GitHub
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### **Backend (Render)**
```bash
# Deploy via script
./deploy_backend.sh

# Ou manualmente
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### **Configuração Vercel**
```json
// vercel.json
{
  "version": 2,
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "dist" }
  }],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🔍 **Debugging**

### **Frontend**
```javascript
// Console logs
console.log('🔍 Debug:', data);
console.error('❌ Erro:', error);

// React DevTools
// Instalar extensão do navegador

// Vite DevTools
// Disponível em localhost:5173
```

### **Backend**
```python
# Logs estruturados
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.info('🔍 Operação iniciada')
logger.error('❌ Erro encontrado: %s', error)
```

### **MongoDB**
```bash
# Conectar ao MongoDB
mongosh "mongodb://localhost:27017/seenti_db"

# Consultas de debug
db.usuarios.find().pretty()
db.clientes.find().pretty()
```

## 📱 **Testes Mobile**

### **Port Forwarding (Android/iPhone)**
```bash
# Configurar port forwarding
ssh -L 8080:localhost:5173 marcia@10.0.0.167

# Acessar via IP local
http://10.0.0.167:8080
```

### **DevTools Mobile**
```javascript
// Console logs visíveis no Chrome DevTools
console.log('📱 Mobile Debug:', window.innerWidth, window.innerHeight);

// Detectar dispositivo
const isMobile = window.innerWidth < 768;
console.log('📱 É mobile?', isMobile);
```

## 🔧 **Manutenção**

### **Atualizações de Dependências**
```bash
# Frontend
npm update
npm audit fix

# Backend
pip install --upgrade -r requirements.txt
```

### **Backup do Projeto**
```bash
# Script de backup
./backup_git.sh

# Backup manual
tar -czf seenti_backup_$(date +%Y%m%d).tar.gz SeentiCliente/
```

### **Limpeza de Cache**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
rm -rf __pycache__ *.pyc
```

## 📚 **Recursos e Referências**

### **Documentação Oficial**
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind**: https://tailwindcss.com/
- **Flask**: https://flask.palletsprojects.com/
- **MongoDB**: https://docs.mongodb.com/

### **Ferramentas Úteis**
- **Postman**: Teste de APIs
- **MongoDB Compass**: Interface gráfica MongoDB
- **Chrome DevTools**: Debug frontend
- **VS Code Extensions**: React, Python, Tailwind

### **Comunidade**
- **GitHub Issues**: Reportar bugs
- **Stack Overflow**: Perguntas técnicas
- **Discord**: Comunidade desenvolvedores

---

**Versão**: 1.0  
**Última Atualização**: 16 de Agosto de 2025  
**Responsável**: Equipe Seenti  
**Status**: Em Desenvolvimento Ativo


