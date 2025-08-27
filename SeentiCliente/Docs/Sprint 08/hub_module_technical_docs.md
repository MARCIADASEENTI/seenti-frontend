# 📄 Documentação Técnica – Módulo Hub Dinâmico

## 1. Modelo da Coleção (MongoDB Atlas)

Arquivo: `hub-collection.md`

### Coleção: `hub_pages`

- Cada documento representa uma página dinâmica (hub).
- Estrutura organizada em **dobras**.

### Exemplo de Documento

```json
{
  "_id": "hub_001",
  "slug": "hub-geral",
  "titulo": "Hub Seenti - Setembro",
  "ativo": true,
  "ordem_dobras": ["hero", "video", "catalogo", "conteudo_cientifico", "promocao", "canais"],
  "hero": { ... },
  "video": { ... },
  "catalogo": [ ... ],
  "conteudo_cientifico": [ ... ],
  "promocao": { ... },
  "canais": [ ... ],
  "atualizado_em": "2025-08-26T23:45:00Z"
}
```

### Regras

- `slug`: obrigatório, único.
- `ativo`: booleano, define se a página está visível.
- `ordem_dobras`: define a sequência das dobras no frontend.
- Cada dobra tem campos obrigatórios e opcionais.

---

## 2. Endpoints da API

Arquivo: `hub-api.md`

### GET /api/hub/\:slug

- Busca hub ativo pelo slug.
- Retorna JSON do documento completo.

#### Exemplo de chamada

```js
fetch('https://api.seenti.com/api/hub/hub-geral')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Respostas

- 200 OK → documento hub
- 404 Not Found → hub não encontrado
- 500 Internal Server Error → erro no servidor

### Futuro

- POST/PUT/DELETE para gerenciamento via módulo do terapeuta.

---

## 3. Frontend (React Native / Expo)

Arquivo: `hub-frontend.md`

### Rota

```jsx
<Stack.Screen name="Hub" component={HubScreen} />
```

### Componente HubScreen

```jsx
function HubScreen({ route }) {
  const { slug } = route.params;
  const [hubData, setHubData] = useState(null);

  useEffect(() => {
    fetch(`https://api.seenti.com/api/hub/${slug}`)
      .then(res => res.json())
      .then(setHubData);
  }, [slug]);

  if (!hubData) return <Text>Carregando...</Text>;

  return (
    <ScrollView>
      {hubData.ordem_dobras.map((dobra) => {
        switch(dobra) {
          case "hero": return <HeroSection data={hubData.hero} />;
          case "video": return <VideoSection data={hubData.video} />;
          case "catalogo": return <CatalogSection data={hubData.catalogo} />;
          case "conteudo_cientifico": return <ScientificSection data={hubData.conteudo_cientifico} />;
          case "promocao": return <PromoSection data={hubData.promocao} />;
          case "canais": return <ChannelsSection data={hubData.canais} />;
          default: return null;
        }
      })}
    </ScrollView>
  );
}
```

### Considerações

- Implementar loading, fallback de imagens e mensagens de erro.
- Componentes devem ser reutilizáveis.
- Layout responsivo para telas de diferentes tamanhos.

---

## 4. Checklist de Tarefas (Dev Sprint)

Arquivo: `hub-checklist.md`

### Sprint 1

-

### Sprint 2

-

### Sprint 3

-

### Sprint 4

-

### Sprint 5

-

### Sprint 6

-

---

## 5. Guia de Estilo (Opcional Inicial)

Arquivo: `hub-style-guide.md`

- Definir cores, tipografia, ícones de canais.
- Definir proporção e resolução de imagens.
- Boas práticas de conteúdo: clareza, títulos objetivos, CTAs destacados.

---

✅ Com estes documentos, o dev terá **todas as instruções necessárias para iniciar a implementação do Hub Dinâmico** no app, mesmo antes do módulo do terapeuta estar pronto.

