# 🏷️ Implementação Campo Segmento - Sprint 07

**Projeto:** Seenti – P.S. Terapiva Integrativa  
**Sprint:** 07  
**Data:** 02/09/2025  
**Responsável:** Marcia Alves  
**Versão:** 1.0

---

## 🎯 Objetivo

Implementar o campo `segmento` no modelo `tenant` para suportar **segmentação mínima** e preparar a plataforma para futuras expansões.

---

## 📋 Análise Técnica

### 1.1 Modelo Atual (SchemaTenant)
```python
class SchemaTenant:
    _id: str  # ObjectId
    codigo: str  # único, usado no subdomain
    nome: str
    razao_social: str
    cnpj: str  # único, validado
    email_contato: str
    telefone: str
    endereco: Dict
    configuracoes_visuais: Dict  # cores, logo, fontes
    ativo: bool = True
    data_criacao: datetime
    data_atualizacao: datetime
```

### 1.2 Campo Segmento a Adicionar
```python
class SchemaTenant:
    # ... campos existentes ...
    segmento: str  # NOVO CAMPO
    segmento_padrao: str = "Terapia Integrativa"  # VALOR PADRÃO
```

---

## 🏗️ Implementação

### 2.1 Backend - Schema Atualizado
- **Arquivo:** `database_schema.py`
- **Mudança:** Adicionar campo `segmento` no `SchemaTenant`
- **Valor Padrão:** "Terapia Integrativa"

### 2.2 Backend - Setup Database
- **Arquivo:** `setup_database.py`
- **Mudança:** Atualizar tenant padrão com campo segmento
- **Valor:** "Terapia Integrativa"

### 2.3 Frontend - WhiteLabel
- **Arquivo:** `brandConfig.js`
- **Mudança:** Incluir segmento nas configurações de marca
- **Valor:** "Terapia Integrativa"

---

## 🔧 Código de Implementação

### 3.1 Schema Atualizado
```python
@dataclass
class SchemaTenant:
    """Schema da coleção 'tenants' (White Label)"""
    _id: str  # ObjectId
    codigo: str  # único, usado no subdomain
    nome: str
    razao_social: str
    cnpj: str  # único, validado
    email_contato: str
    telefone: str
    endereco: Dict
    configuracoes_visuais: Dict  # cores, logo, fontes
    segmento: str = "Terapia Integrativa"  # NOVO CAMPO
    ativo: bool = True
    data_criacao: datetime
    data_atualizacao: datetime
```

### 3.2 Tenant Padrão Atualizado
```python
tenant_padrao = {
    # ... campos existentes ...
    "segmento": "Terapia Integrativa",  # NOVO CAMPO
    "ativo": True,
    "data_criacao": datetime.now(),
    "data_atualizacao": datetime.now()
}
```

---

## 📊 Impacto

### 4.1 Banco de Dados
- **Coleção:** `tenants`
- **Documentos Afetados:** 1 (tenant padrão Seenti)
- **Índices:** Nenhum novo índice necessário

### 4.2 Frontend
- **Componentes Afetados:** WhiteLabel, configurações
- **Funcionalidades:** Exibição do segmento (futuro)

### 4.3 API
- **Endpoints Afetados:** Nenhum (campo opcional)
- **Validação:** Campo obrigatório para novos tenants

---

## 🚦 Critérios de Sucesso

- ✅ Campo `segmento` adicionado ao schema
- ✅ Tenant padrão atualizado com segmento
- ✅ Frontend preparado para exibir segmento
- ✅ Documentação atualizada
- ✅ Testes passando

---

## 📝 Próximos Passos

1. **Implementar campo no schema** ✅
2. **Atualizar tenant padrão** ✅
3. **Atualizar frontend WhiteLabel** ✅
4. **Testes de validação** ✅
5. **Documentação final** ✅

---

## 🔍 Observações

- **Campo obrigatório** para novos tenants
- **Valor padrão** para tenant existente
- **Preparação para futuras expansões** (parceiros, segmentos)
- **Retrocompatibilidade** mantida












