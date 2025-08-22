# 🚀 Plano de Implementação – Sprint 05

**Projeto:** Seenti – Plataforma de Terapia Integrativa  
**Sprint:** 05  
**Data de Início:** 17/08/2025  
**Previsão de Conclusão:** 23/08/2025  
**Responsável:** Dev1  

---

## 🎯 Objetivos da Sprint

- Melhorar o fluxo do Módulo Cliente.  
- Garantir integração estável com backend.  
- Implementar Splash Screen com logo personalizada.  
- Focar em usabilidade e confiabilidade antes da evolução de novos módulos.  

---

## 📋 Backlog da Sprint 05

| ID | Item | Categoria | Prioridade | Critérios de Aceitação |
|----|------|-----------|------------|------------------------|
| 1  | Verificação de e-mails no cadastro | Segurança | Alta | Bloquear cadastros duplicados |
| 2  | Validação de senha forte | Segurança | Alta | Regras: letras, número, caractere especial |
| 3  | Login com conta Google (OAuth) | Autenticação | Média | Fluxo Google funcionando |
| 4  | Redirecionamento para perfil se já cadastrado | UX | Alta | Exibir mensagem de boas-vindas |
| 5  | Botão "Voltar" no cadastro | UX | Média | Voltar para tela anterior com segurança |
| 6  | Splash Screen com logo Seenti | Branding | Alta | Remover logo do Vite, aplicar identidade visual |
| 7  | Ajustes de layout do perfil (responsividade) | UX/UI | Alta | Layout adaptável e organizado |
| 8  | Correção de termos de uso em mobile | UX/UI | Alta | Texto ajustado sem quebra nas bordas |

---

## 🔐 Notas Técnicas

- Reforçar persistência de sessão via **tokens seguros** em vez de apenas LocalStorage.  
- Validar integração OAuth com Google.  
- Garantir build consistente em ambiente de produção.  

---

## ✅ Critérios de Conclusão

- Todas as funcionalidades listadas entregues e testadas.  
- Testes manuais realizados em desktop e mobile.  
- Documentação atualizada no repositório.  
