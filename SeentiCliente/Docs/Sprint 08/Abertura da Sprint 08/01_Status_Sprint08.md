# 📌 Status – Sprint 08

**Projeto:** Seenti – P.S. Terapia Integrativa  
**Data de Início:** [preencher]  
**Data Prevista de Conclusão:** [preencher]  
**Responsável:** Marcia Alves  
**Sprint:** 08  

---

## 🎯 Objetivo Principal
Consolidar a **experiência do cliente** no app, garantindo leveza, clareza e consistência no fluxo de **Perfil → Agendamento → Anamnese**.

---

## ✅ Itens Prioritários

1. **Melhoria Tela de Perfil do Cliente**
   - Ajustar layout (cores claras, fontes sensíveis, rodapé com marca Seenti).
   - Exibir instruções personalizadas de acordo com status.

2. **Anamnese Simplificada**
   - Implementar formulário novo (modelo básico para face-to-face).
   - Salvar na coleção `anamneses_basicas`, vinculada ao cliente.

3. **Agendamento**
   - Refinar submissão → data, hora, status = "pendente".
   - Exibir mensagem clara no perfil ("Aguardando confirmação do terapeuta").

4. **Página "Contato com Terapeuta"**
   - Nova rota no perfil → ícone dedicado.
   - Links externos para WhatsApp, redes sociais, e conteúdos do terapeuta.

5. **Feedback do Cliente**
   - Criar endpoint e tela simples para cliente deixar comentário.
   - Armazenar em `feedbacks`, vinculado ao cliente_id.

---

## 🛠️ Tarefas Técnicas

- [ ] Ajustar responsividade em telas principais (perfil, anamnese, agendamento).
- [ ] **Separar ambiente de produção (base real ≠ base de testes).**
- [ ] **Revisar autenticação (migrar de localStorage → JWT).**
- [ ] Documentar coleções atualizadas (`anamneses_basicas`, `feedbacks`).

---

## 📊 Critérios de Sucesso

- Cliente acessa o perfil e entende claramente seu status.  
- Consegue solicitar agendamento e preencher anamnese em < 5 minutos.  
- Feedback salvo corretamente no banco.  
- UX fluida, leve, dentro da identidade visual da Seenti.  

---
