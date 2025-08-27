# 📊 Comando MongoDB para Teste do Hub Dinâmico

## 🎯 Objetivo

Inserir dados de teste na coleção `hub_pages` do MongoDB Atlas para validar a implementação do componente `FaleComTerapeuta`.

---

## 🗄️ Comando MongoDB

### 1. Conectar ao MongoDB Atlas

```bash
# Via MongoDB Compass ou linha de comando
mongosh "sua_connection_string_aqui"
```

### 2. Selecionar Database

```javascript
use seenti_database
```

### 3. Inserir Documento de Teste

```javascript
db.hub_pages.insertOne({
  "_id": "hub_001",
  "slug": "hub-geral",
  "titulo": "Hub Seenti - Centro de Terapia",
  "ativo": true,
  "ordem_dobras": ["hero", "catalogo", "conteudo_cientifico", "canais"],
  "hero": {
    "titulo": "Centro de Terapia Seenti",
    "subtitulo": "Cuidando da sua saúde com excelência e dedicação",
    "descricao": "Nossa equipe de terapeutas especializados está pronta para oferecer tratamentos personalizados e eficazes para suas necessidades específicas.",
    "imagem": "/assets/seenti-design/logo-seenti.png",
    "cta": "Agendar Consulta"
  },
  "catalogo": [
    {
      "id": 1,
      "titulo": "Terapia Manual",
      "descricao": "Técnicas manuais para alívio de dores e tensões musculares",
      "duracao": "60 min",
      "preco": "R$ 120,00",
      "beneficios": ["Alívio imediato", "Melhora da mobilidade", "Redução do estresse"]
    },
    {
      "id": 2,
      "titulo": "Fisioterapia Esportiva",
      "descricao": "Reabilitação e prevenção de lesões esportivas",
      "duracao": "45 min",
      "preco": "R$ 100,00",
      "beneficios": ["Recuperação rápida", "Prevenção de lesões", "Melhora do desempenho"]
    },
    {
      "id": 3,
      "titulo": "Pilates Terapêutico",
      "descricao": "Exercícios para fortalecimento e reeducação postural",
      "duracao": "50 min",
      "preco": "R$ 90,00",
      "beneficios": ["Fortalecimento muscular", "Correção postural", "Bem-estar geral"]
    }
  ],
  "conteudo_cientifico": [
    {
      "id": 1,
      "titulo": "Benefícios da Terapia Manual na Saúde",
      "resumo": "Estudos comprovam a eficácia da terapia manual no tratamento de dores crônicas e melhora da qualidade de vida.",
      "categoria": "Saúde e Bem-estar",
      "data": "2025-08-26"
    },
    {
      "id": 2,
      "titulo": "Prevenção de Lesões no Esporte",
      "resumo": "Como a fisioterapia preventiva pode reduzir significativamente o risco de lesões em atletas amadores e profissionais.",
      "categoria": "Esporte e Reabilitação",
      "data": "2025-08-25"
    }
  ],
  "canais": [
    {
      "tipo": "whatsapp",
      "valor": "+55 11 99999-9999",
      "label": "WhatsApp",
      "destaque": true
    },
    {
      "tipo": "telefone",
      "valor": "+55 11 3333-3333",
      "label": "Telefone"
    },
    {
      "tipo": "email",
      "valor": "contato@seenti.com.br",
      "label": "E-mail"
    },
    {
      "tipo": "endereco",
      "valor": "Rua das Flores, 123 - São Paulo/SP",
      "label": "Endereço"
    },
    {
      "tipo": "horario",
      "valor": "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
      "label": "Horário de Atendimento"
    }
  ],
  "atualizado_em": new Date()
})
```

---

## 🔍 Verificar Inserção

### 1. Consultar Documento Inserido

```javascript
db.hub_pages.findOne({ "slug": "hub-geral" })
```

### 2. Listar Todos os Hubs

```javascript
db.hub_pages.find({}).pretty()
```

### 3. Verificar Estrutura

```javascript
db.hub_pages.findOne({}, { "ordem_dobras": 1, "hero.titulo": 1, "catalogo": 1 })
```

---

## 🚀 Próximos Passos

1. **✅ Inserir dados** via MongoDB Atlas
2. **🧪 Testar componente** com dados reais
3. **🔍 Validar responsividade** e tema
4. **📱 Testar funcionalidades** (WhatsApp, navegação)
5. **📋 Documentar melhorias** necessárias

---

## 📝 Notas

- **Dados mockados**: Atualmente o componente usa dados mockados para teste
- **API futura**: Estrutura preparada para integração com endpoint `/api/hub/:slug`
- **Flexibilidade**: Fácil modificação de conteúdo via MongoDB sem alterar código
- **Escalabilidade**: Modelo preparado para múltiplos terapeutas no futuro


