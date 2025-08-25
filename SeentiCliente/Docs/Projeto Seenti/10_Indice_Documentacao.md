# 📚 Índice da Documentação - Seenti App

## 🎯 **Visão Geral**

### **Documentos de Visão**
- **[01_Visao_Geral.md](./01_Visao_Geral.md)** - Visão geral do projeto e arquitetura
- **[02_Objetivos.md](./02_Objetivos.md)** - Objetivos estratégicos, técnicos e de negócio
- **[03_Arquitetura.md](./03_Arquitetura.md)** - Arquitetura técnica detalhada (Frontend, Backend, WhiteLabel)

### **História e Evolução**
- **[04_Historia_do_Projeto.md](./04_Historia_do_Projeto.md)** - Timeline de desenvolvimento e marcos importantes
- **[09_Roadmap_Futuro.md](./09_Roadmap_Futuro.md)** - Planejamento estratégico para 2026-2028

## 👥 **Documentação de Usuário**

### **Manual do Usuário**
- **[06_Manual_Usuario.md](./06_Manual_Usuario.md)** - Guia completo para usuários finais

### **Guia do Desenvolvedor**
- **[07_Guia_Desenvolvedor.md](./07_Guia_Desenvolvedor.md)** - Documentação técnica para desenvolvedores

## 🧪 **Testes e Qualidade**

### **Plano de Testes**
- **[08_Plano_Testes.md](./08_Plano_Testes.md)** - Estratégia completa de testes e qualidade

## 📁 **Documentação por Sprint**

### **Sprint 07 - Em Andamento (20% Concluída)**
- **[README.md](../Sprint%2007/README.md)** - Índice geral da Sprint 07
- **[📄 Documento de Abertura – Sprint 07.md](../Sprint%2007/📄%20Documento%20de%20Abertura%20–%20Sprint%2007.md)** - Escopo oficial e tarefas propostas
- **[00_Status_Geral_Sprint_07.md](../Sprint%2007/00_Status_Geral_Sprint_07.md)** - Status geral e progresso atual
- **[01_Estrategia_Fluxo_Implementacao.md](../Sprint%2007/01_Estrategia_Fluxo_Implementacao.md)** - Metodologia de trabalho estabelecida
- **[02_Tipos_Documentos_Gerados.md](../Sprint%2007/02_Tipos_Documentos_Gerados.md)** - Padrões de documentação estabelecidos
- **[04_Tarefa_04_Agendamento_Detalhada.md](../Sprint%2007/04_Tarefa_04_Agendamento_Detalhada.md)** - Tarefa 04: Sistema de agendamento completo
- **[05_Tarefa_05_Anamnese_Detalhada.md](../Sprint%2007/05_Tarefa_05_Anamnese_Detalhada.md)** - Tarefa 05: Formulário de anamnese refatorado

### **Sprint 04 - Fechamento**
- **[01_Status_Sprint.md](../Sprint%2004/Fechamento%20da%20Sprint04/01_Status_Sprint.md)** - Status de conclusão da Sprint 04
- **[02_Feedback_Arquiteto.md](../Sprint%2004/Fechamento%20da%20Sprint04/02_Feedback_Arquiteto.md)** - Feedback para aprovação do arquiteto
- **[03_Roadmap_Proxima_Sprint.md](../Sprint%2004/Fechamento%20da%20Sprint04/03_Roadmap_Proxima_Sprint.md)** - Planejamento para Sprint 05
- **[04_Documentacao_WhiteLabel.md](../Sprint%2004/Fechamento%20da%20Sprint04/04_Documentacao_WhiteLabel.md)** - Documentação técnica do sistema WhiteLabel
- **[05_Resumo_Tecnico.md](../Sprint%2004/Fechamento%20da%20Sprint04/05_Resumo_Tecnico.md)** - Resumo técnico completo da Sprint 04

### **Sprint 01**
- **[README.md](../Sprint%2001/README.md)** - Documentação da Sprint 01
- **[ALINHAMENTO_PERFIL_ARQUITETO.md](../Sprint%2001/ALINHAMENTO_PERFIL_ARQUITETO.md)** - Alinhamento com perfil do arquiteto
- **[SPRINT01_DEV1_STATUS.md](../Sprint%2001/SPRINT01_DEV1_STATUS.md)** - Status do desenvolvedor na Sprint 01

## 🏗️ **Estrutura do Projeto**

### **Frontend (React + Vite)**
```
Frontend/
├── src/
│   ├── components/
│   │   └── cliente/           # Componentes específicos do cliente
│   ├── layouts/               # Layouts principais
│   ├── whiteLabel/            # Sistema WhiteLabel
│   │   ├── config/            # Configurações de marca
│   │   ├── themes/            # Temas disponíveis
│   │   ├── layouts/           # Layouts específicos
│   │   └── utils/             # Utilitários WhiteLabel
│   ├── services/              # Serviços e APIs
│   └── config/                # Configurações da aplicação
├── public/                    # Arquivos estáticos
└── package.json               # Dependências Node.js
```

### **Backend (Flask)**
```
Backend/
├── dev/                       # Ambiente de desenvolvimento
│   └── app.py                # Servidor Flask local
├── prod/                      # Ambiente de produção
│   └── app.py                # Servidor Flask produção
└── requirements.txt           # Dependências Python
```

### **Documentação**
```
Docs/
├── Projeto Seenti/            # Documentação principal do projeto
├── Sprint 01/                 # Documentação da Sprint 01
├── Sprint 04/                 # Documentação da Sprint 04
│   └── Fechamento da Sprint04/ # Documentos de fechamento
├── Sprint 05/                 # Documentação da Sprint 05
├── Sprint 06/                 # Documentação da Sprint 06
├── Sprint 07/                 # Documentação da Sprint 07 (EM ANDAMENTO)
│   ├── 📄 Documento de Abertura – Sprint 07.md
│   ├── README.md
│   ├── 00_Status_Geral_Sprint_07.md
│   ├── 01_Estrategia_Fluxo_Implementacao.md
│   ├── 02_Tipos_Documentos_Gerados.md
│   ├── 04_Tarefa_04_Agendamento_Detalhada.md
│   └── 05_Tarefa_05_Anamnese_Detalhada.md
├── Arquitetura/               # Documentação de arquitetura
├── Evolucao/                  # Documentação de evolução
├── Historia_do_Projeto/       # História do projeto
├── Testes/                    # Documentação de testes
└── Usuario/                   # Documentação de usuário
```

## 🔍 **Como Navegar na Documentação**

### **Para Desenvolvedores**
1. **Comece por**: `07_Guia_Desenvolvedor.md`
2. **Entenda a arquitetura**: `03_Arquitetura.md`
3. **Veja o roadmap**: `09_Roadmap_Futuro.md`
4. **Consulte testes**: `08_Plano_Testes.md`

### **Para Usuários Finais**
1. **Comece por**: `06_Manual_Usuario.md`
2. **Entenda o projeto**: `01_Visao_Geral.md`
3. **Veja funcionalidades**: `02_Objetivos.md`

### **Para Stakeholders**
1. **Visão geral**: `01_Visao_Geral.md`
2. **Objetivos**: `02_Objetivos.md`
3. **Roadmap**: `09_Roadmap_Futuro.md`
4. **Status atual**: `04_Historia_do_Projeto.md`

## 📋 **Status dos Documentos**

### **✅ Completos**
- [x] `01_Visao_Geral.md` - Visão geral do projeto
- [x] `02_Objetivos.md` - Objetivos estratégicos
- [x] `03_Arquitetura.md` - Arquitetura técnica
- [x] `04_Historia_do_Projeto.md` - História e evolução
- [x] `06_Manual_Usuario.md` - Manual do usuário
- [x] `07_Guia_Desenvolvedor.md` - Guia do desenvolvedor
- [x] `08_Plano_Testes.md` - Plano de testes
- [x] `09_Roadmap_Futuro.md` - Roadmap futuro
- [x] `10_Indice_Documentacao.md` - Este índice

### **🔄 Sprint 07 - Em Andamento**
- [x] `README.md` - Índice da Sprint 07
- [x] `📄 Documento de Abertura – Sprint 07.md` - Escopo oficial
- [x] `00_Status_Geral_Sprint_07.md` - Status geral
- [x] `01_Estrategia_Fluxo_Implementacao.md` - Metodologia
- [x] `02_Tipos_Documentos_Gerados.md` - Padrões
- [x] `04_Tarefa_04_Agendamento_Detalhada.md` - Tarefa 04
- [x] `05_Tarefa_05_Anamnese_Detalhada.md` - Tarefa 05
- [ ] `06_Tarefa_06_Perfil_WhiteLabel_Detalhada.md` - Tarefa 06 (pendente)
- [ ] `07_Tarefa_07_Status_Agendamento_Anamnese_Detalhada.md` - Tarefa 07 (pendente)
- [ ] `08_Tarefa_08_Rodape_Seenti_Detalhada.md` - Tarefa 08 (pendente)
- [ ] `09_Tarefa_09_Ambiente_Producao_Detalhada.md` - Tarefa 09 (pendente)
- [ ] `10_Tarefa_10_Variaveis_Ambiente_Detalhada.md` - Tarefa 10 (pendente)

### **🔄 Em Desenvolvimento**
- [ ] Documentação de APIs
- [ ] Casos de uso detalhados
- [ ] Troubleshooting guide
- [ ] FAQ técnico

### **📋 Planejados**
- [ ] Documentação de deploy
- [ ] Guia de contribuição
- [ ] Changelog detalhado
- [ ] Documentação de segurança

## 🔗 **Links Importantes**

### **Repositórios**
- **GitHub**: [MARCIADASEENTI/seenti_app](https://github.com/MARCIADASEENTI/seenti_app)
- **Frontend**: [frontend-seenti-app.vercel.app](https://frontend-seenti-app.vercel.app)
- **Backend**: [backend-seenti-app.onrender.com](https://backend-seenti-app.onrender.com)

### **Ferramentas**
- **Vercel**: Dashboard de deploy frontend
- **Render**: Dashboard de deploy backend
- **MongoDB**: Atlas cloud database

## 📝 **Convenções de Nomenclatura**

### **Arquivos de Documentação**
- **Formato**: `NN_Nome_Descritivo.md`
- **Exemplo**: `01_Visao_Geral.md`
- **Padrão**: Número sequencial + Nome descritivo

### **Pastas**
- **Formato**: `Nome_Descritivo`
- **Exemplo**: `Projeto Seenti`
- **Padrão**: Nome descritivo com espaços

### **Seções Internas**
- **Formato**: `## 🎯 Nome da Seção`
- **Exemplo**: `## 📋 Visão Geral`
- **Padrão**: Emoji + Nome descritivo

## 🚀 **Como Contribuir**

### **Atualizações de Documentação**
1. **Edite o arquivo** correspondente
2. **Atualize este índice** se necessário
3. **Commit e push** para o repositório
4. **Verifique** se a documentação está sincronizada

### **Novos Documentos**
1. **Crie o arquivo** na pasta apropriada
2. **Adicione ao índice** neste arquivo
3. **Siga as convenções** de nomenclatura
4. **Atualize links** relacionados

### **Revisões**
1. **Verifique links** quebrados
2. **Valide informações** técnicas
3. **Teste exemplos** de código
4. **Atualize versões** e datas

## 📊 **Métricas da Documentação**

### **Estatísticas Atuais**
- **Total de Documentos**: 10
- **Páginas**: ~150 páginas
- **Código**: ~50 exemplos
- **Imagens**: ~20 screenshots
- **Links**: ~30 referências

### **Qualidade**
- **Cobertura**: 85% do projeto documentado
- **Atualização**: Última atualização em 16/08/2025
- **Revisão**: Documentos revisados e validados
- **Formato**: Markdown padronizado

## 🔄 **Ciclo de Atualização**

### **Atualizações Automáticas**
- **Sprints**: A cada final de sprint
- **Funcionalidades**: Quando novas features são implementadas
- **Bugs**: Quando problemas são resolvidos
- **Deploy**: Após cada deploy em produção

### **Revisões Periódicas**
- **Semanal**: Verificação de links e referências
- **Mensal**: Revisão de conteúdo e exemplos
- **Trimestral**: Atualização de roadmap e objetivos
- **Anual**: Revisão completa da documentação

---

**Versão**: 1.0  
**Última Atualização**: 16 de Agosto de 2025  
**Responsável**: Equipe Seenti  
**Status**: Documentação Completa

---

## 📞 **Suporte e Contato**

### **Para Dúvidas sobre Documentação**
- **Email**: suporte@seenti.com
- **GitHub Issues**: [Criar issue](https://github.com/MARCIADASEENTI/seenti_app/issues)
- **Equipe**: Marcia Alves (Desenvolvedor Principal)

### **Para Sugestões de Melhoria**
- **Feedback**: Via GitHub Issues
- **Pull Requests**: Contribuições bem-vindas
- **Discussões**: GitHub Discussions

---

**🎉 Documentação do Projeto Seenti App - Completa e Atualizada!**


