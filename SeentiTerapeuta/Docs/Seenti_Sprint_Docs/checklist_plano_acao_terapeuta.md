# Seenti App – Checklist e Plano de Ação: Painel do Terapeuta

## Estrutura de Pastas
```
src/
├── components/terapeuta/
│   ├── CardNavegacao.jsx
│   └── Clientes/
│       ├── ListaClientes.jsx
│       └── CadastroCliente.jsx
├── pages/terapeuta/
│   └── PainelTerapeuta.jsx
├── routes/
│   └── terapeutaRoutes.jsx
```
## Checklist de Implementação – Frontend

| Ordem | Tarefa | Status | Critério de Aceite |
|-------|-------|--------|------------------|
| 1 | Organização de pastas (`components/terapeuta/`, `pages/terapeuta/`) | ✅ | Navegação limpa, imports funcionais |
| 2 | Criação de `<CardNavegacao />` | 🚧 | Props `titulo`, `icon`, `onClick`, acessível, estilizado |
| 3 | Refatorar `PainelTerapeuta.jsx` | 🚧 | Grid responsivo, saudação personalizada |
| 4 | Inserir ícones modernos (`lucide-react`) | ✅ | Contraste adequado, legibilidade |
| 5 | Configurar roteamento SPA (`react-router-dom`) | 🚧 | Navegação entre cards sem reload |
| 6 | Melhorar acessibilidade | 🚧 | role="button", aria-label, tamanho mínimo 44x44px, navegável via teclado |
| 7 | Testes de responsividade | 🔄 | Mobile e desktop, sem overflows |
| 8 | Documentação de componentes | Planejado | README curto, props documentadas |