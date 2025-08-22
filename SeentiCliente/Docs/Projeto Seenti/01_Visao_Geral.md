# 🎯 Visão Geral do Projeto Seenti App

## 📋 **Resumo Executivo**

O **Seenti App** é uma plataforma de gestão de clientes para profissionais de saúde mental, desenvolvida com arquitetura WhiteLabel para permitir personalização de marca por parceiros.

## 🏗️ **Arquitetura Geral**

### **Frontend**
- **Tecnologia**: React + Vite
- **Estilização**: Tailwind CSS + CSS Customizado
- **Roteamento**: React Router DOM
- **Estado**: React Hooks + Context API
- **Layouts**: Sistema WhiteLabel com temas personalizáveis

### **Backend**
- **Tecnologia**: Flask (Python)
- **Banco de Dados**: MongoDB
- **Autenticação**: JWT + Bcrypt
- **API**: RESTful com CORS habilitado
- **Deploy**: Render (Produção) + Local (Desenvolvimento)

## 🎨 **Sistema WhiteLabel**

### **Características**
- **Temas Dinâmicos**: Cores, logos e fontes personalizáveis
- **Detecção Automática**: Identificação de ambiente e marca
- **Fallbacks Inteligentes**: Logos e estilos de backup
- **Responsividade**: Adaptação automática para mobile/desktop

### **Temas Disponíveis**
1. **Seenti (Default)**: Marca principal com azul/roxo
2. **Marcia Alves**: Tema parceiro com laranja/rosa

## 📱 **Funcionalidades Principais**

### **Gestão de Usuários**
- Cadastro e login de usuários
- Autenticação segura com JWT
- Perfis personalizáveis

### **Gestão de Clientes**
- Cadastro completo de clientes
- Anamnese detalhada
- Histórico de atendimentos
- Termos de uso e consentimento

### **Agendamento**
- Sistema de marcação de consultas
- Calendário integrado
- Notificações automáticas

## 🌐 **Ambientes de Deploy**

### **Desenvolvimento Local**
- **Frontend**: `localhost:5173` (Vite Dev Server)
- **Backend**: `localhost:5000` (Flask Dev Server)
- **Port Forwarding**: `10.0.0.167:8080` (Android/iPhone)

### **Produção**
- **Frontend**: Vercel (`frontend-seenti-app.vercel.app`)
- **Backend**: Render (`backend-seenti-app.onrender.com`)

## 🎯 **Objetivos Estratégicos**

1. **Profissionalização**: Plataforma robusta para profissionais de saúde
2. **Escalabilidade**: Sistema WhiteLabel para múltiplos parceiros
3. **Usabilidade**: Interface intuitiva para mobile e desktop
4. **Segurança**: Proteção de dados sensíveis de saúde
5. **Conformidade**: Adequação às regulamentações de saúde mental

## 📊 **Status Atual**

- **Sprint 04**: ✅ Completada (WhiteLabel + Deploy)
- **Funcionalidades Core**: ✅ Implementadas
- **Testes Mobile**: 🔄 Em desenvolvimento
- **Documentação**: 🔄 Em criação

## 🚀 **Próximos Passos**

1. **Testes iPhone**: Resolver problemas de compatibilidade
2. **Documentação**: Completar toda a base documental
3. **Sprint 05**: Planejamento e implementação
4. **Qualidade**: Testes automatizados e monitoramento

---

**Versão**: 1.0  
**Última Atualização**: 16 de Agosto de 2025  
**Responsável**: Equipe Seenti  
**Status**: Em Desenvolvimento Ativo

