# 🧪 Plano de Testes - Seenti App

## 📋 **Visão Geral dos Testes**

### **Objetivos**
- **Validar Funcionalidades**: Garantir que todas as features funcionem corretamente
- **Qualidade de Código**: Identificar bugs e problemas de performance
- **Compatibilidade**: Verificar funcionamento em diferentes dispositivos
- **Segurança**: Validar proteção de dados e autenticação
- **Experiência do Usuário**: Garantir interface intuitiva e responsiva

### **Escopo**
- **Frontend**: Componentes React, WhiteLabel, responsividade
- **Backend**: APIs, autenticação, banco de dados
- **Integração**: Comunicação entre frontend e backend
- **Deploy**: Funcionamento em produção (Vercel + Render)

## 🎯 **Estratégia de Testes**

### **Tipos de Teste**
1. **Testes Unitários**: Componentes e funções individuais
2. **Testes de Integração**: APIs e comunicação entre módulos
3. **Testes E2E**: Fluxos completos do usuário
4. **Testes de Compatibilidade**: Diferentes dispositivos e navegadores
5. **Testes de Performance**: Tempo de resposta e carga
6. **Testes de Segurança**: Autenticação e proteção de dados

### **Ambientes de Teste**
- **Desenvolvimento**: `localhost:5173` + `localhost:5000`
- **Port Forwarding**: `10.0.0.167:8080` (Android/iPhone)
- **Produção**: Vercel + Render
- **Staging**: Em desenvolvimento

## 📱 **Testes de Compatibilidade**

### **Dispositivos Testados**

#### **Desktop**
- [x] **Chrome** (Linux, Windows, macOS)
- [x] **Firefox** (Linux, Windows, macOS)
- [x] **Safari** (macOS)
- [x] **Edge** (Windows)

#### **Mobile Android**
- [x] **Chrome** (Android 10+)
- [x] **Firefox** (Android 10+)
- [x] **Samsung Internet** (Android 10+)

#### **Mobile iPhone**
- [ ] **Safari** (iOS 14+)
- [ ] **Chrome** (iOS 14+)
- [ ] **Firefox** (iOS 14+)

#### **Tablet**
- [ ] **iPad** (Safari)
- [ ] **Android Tablet** (Chrome)

### **Resoluções Testadas**
```css
/* Breakpoints Tailwind */
sm: 640px   /* Mobile pequeno */
md: 768px   /* Mobile grande / Tablet pequeno */
lg: 1024px  /* Tablet grande */
xl: 1280px  /* Desktop pequeno */
2xl: 1536px /* Desktop grande */
```

## 🔧 **Testes Funcionais**

### **1. Sistema de Autenticação**

#### **Login**
- [x] **Login válido**: Email e senha corretos
- [x] **Login inválido**: Email ou senha incorretos
- [x] **Campos vazios**: Validação de campos obrigatórios
- [x] **Redirecionamento**: Após login bem-sucedido
- [x] **Token JWT**: Armazenamento e uso correto

#### **Cadastro**
- [x] **Cadastro válido**: Dados completos e corretos
- [x] **Email duplicado**: Validação de unicidade
- [x] **Senha fraca**: Validação de força da senha
- [x] **Confirmação de senha**: Validação de match
- [x] **Criação de cliente**: Automática após cadastro

#### **Logout**
- [x] **Logout manual**: Botão de sair
- [x] **Limpeza de dados**: Remoção de token
- [x] **Redirecionamento**: Para tela de login

### **2. Gestão de Clientes**

#### **Perfil do Cliente**
- [x] **Carregamento**: Dados do cliente carregados
- [x] **Edição**: Modificação de informações
- [x] **Validação**: Campos obrigatórios
- [x] **Salvamento**: Persistência no banco

#### **Anamnese**
- [x] **Formulário**: Todos os campos presentes
- [x] **Validação**: Campos obrigatórios marcados
- [x] **Salvamento**: Dados persistidos
- [x] **Edição**: Modificação de anamnese existente
- [x] **Histórico**: Versões anteriores disponíveis

### **3. Sistema de Agendamentos**

#### **Visualização**
- [x] **Calendário**: Mês atual visível
- [x] **Horários**: Slots disponíveis destacados
- [x] **Status**: Agendado, Disponível, Ocupado

#### **Marcação**
- [x] **Seleção de data**: Calendário funcional
- [x] **Seleção de horário**: Slots disponíveis
- [x] **Confirmação**: Agendamento realizado
- [x] **Validação**: Horários conflitantes

#### **Gerenciamento**
- [x] **Lista**: Consultas marcadas visíveis
- [x] **Cancelamento**: Remoção de agendamento
- [x] **Reagendamento**: Mudança de data/hora

### **4. Sistema WhiteLabel**

#### **Detecção Automática**
- [x] **Localhost**: Tema Seenti (default)
- [x] **Port Forwarding**: Tema correto via IP
- [x] **Produção**: Tema baseado no subdomínio

#### **Temas**
- [x] **Seenti**: Cores azul/roxo, logo correto
- [x] **Marcia Alves**: Cores laranja/rosa, logo correto
- [x] **Transição**: Mudança suave entre temas
- [x] **Fallback**: Tema padrão em caso de erro

#### **Responsividade**
- [x] **Desktop**: Layout completo com sidebar
- [x] **Tablet**: Layout híbrido
- [x] **Mobile**: Sidebar colapsável, header compacto

## 🧪 **Testes Técnicos**

### **1. Performance**

#### **Frontend**
- [ ] **Carregamento inicial**: < 3 segundos
- [ ] **Navegação entre páginas**: < 1 segundo
- [ ] **Formulários**: Resposta imediata
- [ ] **Imagens**: Otimização e lazy loading

#### **Backend**
- [ ] **APIs**: Response time < 500ms
- [ ] **Banco de dados**: Queries otimizadas
- [ ] **Concorrência**: Múltiplos usuários simultâneos

### **2. Segurança**

#### **Autenticação**
- [x] **JWT**: Tokens válidos e seguros
- [x] **Bcrypt**: Hash seguro de senhas
- [x] **CORS**: Configuração correta
- [x] **HTTPS**: Forçado em produção

#### **Validação**
- [x] **Frontend**: Validação em tempo real
- [x] **Backend**: Validação de entrada
- [x] **Sanitização**: Dados limpos
- [x] **SQL Injection**: Proteção implementada

### **3. Banco de Dados**

#### **MongoDB**
- [x] **Conexão**: Estável e confiável
- [x] **CRUD**: Operações básicas funcionando
- [x] **Relacionamentos**: Referências corretas
- [x] **Índices**: Performance otimizada

#### **Integridade**
- [x] **Dados**: Persistência correta
- [x] **Relacionamentos**: Referências válidas
- [x] **Validação**: Schema validation
- [x] **Backup**: Estratégia implementada

## 📊 **Métricas de Qualidade**

### **Cobertura de Testes**
- **Frontend**: 60% (em desenvolvimento)
- **Backend**: 40% (em desenvolvimento)
- **Integração**: 70% (testes manuais)
- **E2E**: 50% (fluxos principais)

### **Bugs e Issues**
- **Críticos**: 0
- **Alto**: 2 (iPhone compatibilidade)
- **Médio**: 5 (responsividade mobile)
- **Baixo**: 8 (melhorias de UX)

### **Performance**
- **Carregamento**: 2.5s (meta: < 3s)
- **APIs**: 300ms (meta: < 500ms)
- **Uptime**: 99.9% (meta: > 99.9%)

## 🚀 **Plano de Implementação**

### **Fase 1: Testes Básicos (Sprint 05)**
- [ ] **Setup Jest**: Configuração de testes unitários
- [ ] **Testes Frontend**: Componentes principais
- [ ] **Testes Backend**: APIs básicas
- [ ] **Testes iPhone**: Resolver problemas de compatibilidade

### **Fase 2: Testes Avançados (Sprint 06)**
- [ ] **Testes E2E**: Fluxos completos do usuário
- [ ] **Testes de Performance**: Métricas e otimizações
- [ ] **Testes de Segurança**: Validação de vulnerabilidades
- [ ] **Testes de Carga**: Múltiplos usuários

### **Fase 3: Automação (Sprint 07)**
- [ ] **CI/CD**: Integração contínua
- [ ] **Deploy Automático**: Testes antes do deploy
- [ ] **Monitoramento**: Métricas em tempo real
- [ ] **Alertas**: Notificações de problemas

## 🛠️ **Ferramentas de Teste**

### **Frontend**
- **Jest**: Framework de testes JavaScript
- **React Testing Library**: Testes de componentes
- **MSW**: Mock Service Worker para APIs
- **Playwright**: Testes E2E

### **Backend**
- **Pytest**: Framework de testes Python
- **Supertest**: Testes de API Flask
- **MongoDB Memory Server**: Banco de teste
- **Coverage**: Cobertura de código

### **Integração**
- **Postman**: Testes de API
- **Newman**: Testes automatizados Postman
- **Docker**: Ambientes isolados
- **GitHub Actions**: CI/CD

## 📝 **Casos de Teste**

### **Exemplo: Login de Usuário**
```javascript
describe('Login de Usuário', () => {
  test('deve fazer login com credenciais válidas', async () => {
    // Arrange
    const email = 'teste@exemplo.com';
    const senha = '123456';
    
    // Act
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: senha } });
    fireEvent.click(screen.getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Login realizado com sucesso')).toBeInTheDocument();
    });
  });
});
```

### **Exemplo: API de Clientes**
```python
def test_get_cliente_by_id(client):
    # Arrange
    cliente_id = "507f1f77bcf86cd799439011"
    
    # Act
    response = client.get(f'/api/clientes/{cliente_id}')
    
    # Assert
    assert response.status_code == 200
    assert 'nome' in response.json
    assert 'email' in response.json
```

## 🔍 **Debugging e Troubleshooting**

### **Problemas Comuns**

#### **Frontend**
- **Layout "estourando"**: CSS conflitante ou responsividade
- **Componentes não renderizam**: Props ou estado incorretos
- **APIs não funcionam**: CORS ou configuração incorreta

#### **Backend**
- **APIs retornam erro**: Validação ou banco de dados
- **Conexão MongoDB**: URI ou credenciais incorretas
- **CORS**: Configuração de domínios permitidos

#### **Mobile**
- **iPhone**: Problemas de conexão (investigando)
- **Android**: Layout responsivo (resolvido)
- **Port Forwarding**: Configuração de rede

### **Estratégias de Debug**
1. **Console Logs**: Frontend e backend
2. **DevTools**: Chrome DevTools para mobile
3. **Logs de Deploy**: Vercel e Render
4. **Testes Incrementais**: Pequenas mudanças por vez

## 📈 **Relatórios e Métricas**

### **Relatórios de Teste**
- **Diário**: Status dos testes executados
- **Semanal**: Resumo de bugs encontrados
- **Sprint**: Cobertura e qualidade geral
- **Mensal**: Tendências e melhorias

### **Dashboards**
- **GitHub**: Issues e pull requests
- **Vercel**: Deploy e performance
- **Render**: Backend e logs
- **MongoDB**: Métricas de banco

---

**Versão**: 1.0  
**Última Atualização**: 16 de Agosto de 2025  
**Responsável**: Equipe Seenti  
**Status**: Em Implementação


