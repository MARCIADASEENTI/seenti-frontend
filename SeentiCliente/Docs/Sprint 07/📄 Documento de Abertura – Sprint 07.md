# **📄 Documento de Abertura – Sprint 07**

**Projeto:** Seenti – Plataforma White Label em Saúde Integrativa  
 **Data de Início:** 02/09/2025  
 **Responsável:** Marcia Alves  
 **Versão:** 1.0

---

## **🎯 Objetivo da Sprint 07**

Garantir **estabilidade e experiência aprimorada para o cliente** durante o face-to-face, iniciando a estrutura de **versionamento controlado** e **segmentação mínima** para suportar futuras expansões.

---

## **✅ Escopo Principal**

1. **Versionamento (Git Flow / Tags)**

   * Criar branches claras:

     * `main` → produção estável

     * `develop` → homologação/testes

     * `feature/*` → funcionalidades novas

   * Incluir versionamento semântico (v0.1.0, v0.2.0, …)

   * Configurar rotina de merge e revisão para reduzir riscos.

2. **Segmentação Inicial**

   * Incluir campo `segmento` no modelo de `tenant`.

   * Definir segmento padrão “Terapia Integrativa”.

   * Preparar backend/frontend para validar segmento (mesmo que só 1 por enquanto).

   * Documentar como novos segmentos poderão ser adicionados no futuro.

3. **Experiência do Cliente (Perfil)**

   * Melhorar tela `/perfil` com cores White Label da Seenti.

   * Exibir status de agendamento:

     * “Nenhum agendamento confirmado – Solicite um atendimento.”

     * “Agendamento pendente – aguardando terapeuta.”

   * Exibir status da anamnese:

     * “Preencha sua anamnese inicial para agilizar seu atendimento.”

     * “Anamnese concluída em \[data\].”

   * Adicionar rodapé fixo com marca Seenti.

4. **Infraestrutura e Ambientes**

   * Criar ambiente separado para **produção face-to-face**.

   * Configurar banco de dados e APIs distintas para produção e desenvolvimento.

   * Definir variáveis de ambiente específicas para cada contexto.

---

## **📋 Tarefas Propostas**

| ID | Tarefa | Categoria | Prioridade |
| ----- | ----- | ----- | ----- |
| 01 | Criar branches Git e definir fluxo de versionamento | Versionamento | Alta |
| 02 | Configurar versionamento semântico (tags v0.1.0) | Versionamento | Alta |
| 03 | Incluir campo `segmento` no modelo `tenant` | Segmentação | Alta |
| 04 | Atualizar backend para validar segmento | Segmentação | Média |
| 05 | Ajustar frontend para tratar segmento | Segmentação | Média |
| 06 | Melhorar tela `/perfil` (UI White Label) | UX/UI | Alta |
| 07 | Exibir status de agendamento/anamnese | UX/UI | Alta |
| 08 | Incluir rodapé fixo com marca Seenti | UX/UI | Média |
| 09 | Configurar ambiente separado (produção/teste) | Infraestrutura | Alta |
| 10 | Validar variáveis `.env` distintas (dev/prod) | Infraestrutura | Alta |

---

## **🚦 Critérios de Sucesso**

* Código versionado e organizado com Git Flow.

* Segmentação presente no modelo de dados (mesmo que básica).

* Tela de perfil do cliente clara, intuitiva e responsiva.

* Ambientes distintos funcionando (produção/testes).

* Documentação atualizada no repositório.

---

## **📌 Observações**

* Essa sprint será **base para escalabilidade** → sem versionamento e segmentação, não conseguimos evoluir com parceiros.

* A experiência do cliente deve ser **fluida e confiável**, evitando frustração no face-to-face.

* **Próxima sprint (08)** poderá focar em:

  * Histórico de sessões (com status)

  * Notificações

  * Melhorias no módulo Terapeuta

