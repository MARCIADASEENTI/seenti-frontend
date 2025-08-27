# 📄 Visão Geral da Implementação – Módulo Hub Dinâmico

## 🎯 Objetivo

Criar dentro do app uma **rota dinâmica (/hub/****:slug****)** que renderiza conteúdos em formato de **dobras**, utilizando dados armazenados em uma coleção do MongoDB Atlas. O módulo terá função de **central de conteúdos** (educação, catálogos, vídeos, promoções e canais), permitindo exibir informações de forma padronizada e inteligente.

O foco principal é oferecer ao cliente final:

- **Acesso centralizado** a conteúdos e serviços.
- **Educação em saúde baseada em evidências científicas.**
- **Experiência fluida** (como uma "revista digital" dentro do app).

E ao administrador/terapeuta:

- Capacidade de **criar e atualizar hubs sem codificação**.
- Padrão visual consistente (dobras).
- Escalabilidade para múltiplos profissionais no futuro.

---

## 🧩 Estrutura do Módulo

### 1. Coleção `hub_pages` (MongoDB Atlas)

- Cada documento representa uma página dinâmica (hub).
- Estrutura organizada em **dobras** (hero, vídeo, catálogo, conteúdo científico, promoção, canais).
- Campo `ordem_dobras` define a sequência de renderização.

### 2. Backend (Node/Express)

- Endpoint principal: `GET /api/hub/:slug`.
- Retorna documento JSON completo da página solicitada.
- Possibilidade futura de endpoints `POST/PUT` para edição.

### 3. Frontend (React Native / Expo)

- Nova rota no app: `/hub/:slug`.
- Componente `HubScreen` faz fetch da API e renderiza as dobras.
- Cada dobra possui um componente dedicado (`HeroSection`, `VideoSection`, `CatalogSection`, etc.).

### 4. Renderização por Ordem

O array `ordem_dobras` define a sequência:

```json
"ordem_dobras": ["hero", "video", "catalogo", "conteudo_cientifico", "promocao", "canais"]
```

No frontend, esse array é percorrido e cada dobra é renderizada conforme sua chave.

---

## 📊 Fluxo de Dados

1. **MongoDB Atlas** → Documento `hub_pages` é criado/atualizado.
2. **API Node/Express** → Exposição do endpoint `/api/hub/:slug`.
3. **App (React Native)** → Tela `HubScreen` consome o endpoint.
4. **Usuário final** → Visualiza dobras renderizadas em sequência.

---

## 🚀 Benefícios da Abordagem

- **Flexibilidade**: novas dobras podem ser adicionadas sem alterar o app inteiro.
- **Centralização**: todos os canais, conteúdos e promoções em um único lugar.
- **Credibilidade**: seção de conteúdo científico garante diferenciação no setor de saúde.
- **Escalabilidade**: modelo pronto para múltiplos terapeutas futuramente.
- **Marketing invisível**: cliente percebe valor educativo, não apenas promoção.

---

## 📌 Primeira Entrega Recomendada

1. Criar coleção `hub_pages` no Atlas.
2. Popular com documento de teste (`hub-geral`).
3. Implementar endpoint `GET /api/hub/:slug`.
4. Criar rota no app e tela `HubScreen`.
5. Renderizar 3 dobras iniciais: `hero`, `video`, `catalogo`.

Etapas seguintes: adicionar `conteudo_cientifico`, `promocao`, `canais`.

---

## 🔮 Futuro

- Integração com **módulo do terapeuta** (cada terapeuta gerencia seus hubs).
- Analytics: medir visualizações, cliques em CTAs e acessos a canais.
- Possibilidade de exportar hubs como **landing pages web** além do app.

---

✅ Esse documento deve ser usado como referência inicial de visão e arquitetura. Detalhes técnicos específicos serão documentados nos arquivos complementares:

- `hub-collection.md`
- `hub-api.md`
- `hub-frontend.md`
- `hub-checklist.md`
- `hub-style-guide.md`

