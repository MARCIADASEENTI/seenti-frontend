# Seenti App – Documento Técnico: Padronização de Cadastro de Cliente

## Campos Obrigatórios
- `primeiro_nome`
- `sobrenome`
- `cpf`
- `telefone`
- `data_nascimento`
- `endereco`

## Estrutura do Endereço
- Obrigatórios: rua, numero, bairro, cidade, uf, cep
- Opcionais: complemento, caixa_postal

## Padronização de Dados
- `.strip()` remove espaços em branco
- `.title()` capitaliza nomes e endereços
- `.upper()` para UF

## Validações
- CPF: somente números, 11 dígitos, HTTP 400 se inválido
- Idade: ≥18 anos, HTTP 400 se inválido
- Unicidade CPF: HTTP 409 se duplicado
- Timestamps: `criado_em`, `atualizado_em` UTC

## Recomendação Frontend
- Validar campos obrigatórios
- Padronizar capitalização antes do envio
- Validar CPF
- Bloquear envio se idade < 18 anos
- Tratar respostas 400 e 409 com mensagens amigáveis