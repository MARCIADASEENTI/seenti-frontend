#!/bin/bash

# 💾 Script de Backup e Versionamento - Seenti App
# Este script cria backups e gerencia versões do projeto

set -e  # Para execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configurações
BACKUP_DIR="./backups"
DATE=$(date +'%Y%m%d_%H%M%S')
PROJECT_NAME="seenti_app"
VERSION_FILE="VERSION.txt"

# Verificar se estamos no diretório correto
if [ ! -f "backup.sh" ]; then
    error "Execute este script do diretório raiz do projeto"
    exit 1
fi

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

log "💾 Iniciando backup e versionamento do Seenti App..."

# 1. Verificar versão atual
if [ -f "$VERSION_FILE" ]; then
    CURRENT_VERSION=$(cat "$VERSION_FILE")
    log "📋 Versão atual: $CURRENT_VERSION"
else
    CURRENT_VERSION="1.0.0"
    log "📋 Versão inicial: $CURRENT_VERSION"
fi

# 2. Criar backup completo
BACKUP_NAME="${PROJECT_NAME}_v${CURRENT_VERSION}_${DATE}"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

log "📦 Criando backup: $BACKUP_NAME"

# Criar backup excluindo arquivos desnecessários
tar --exclude='./backups' \
    --exclude='./node_modules' \
    --exclude='./SeentiCliente/e' \
    --exclude='./SeentiCliente/source' \
    --exclude='./SeentiCliente/Frontend/node_modules' \
    --exclude='./SeentiCliente/Frontend/dist' \
    --exclude='./SeentiCliente/Frontend/build' \
    --exclude='./__pycache__' \
    --exclude='./*.pyc' \
    --exclude='./.git' \
    --exclude='./*.log' \
    --exclude='./.vercel' \
    --exclude='./.render' \
    -czf "$BACKUP_PATH.tar.gz" .

if [ $? -eq 0 ]; then
    log "✅ Backup criado com sucesso: $BACKUP_PATH.tar.gz"
    
    # Calcular tamanho do backup
    BACKUP_SIZE=$(du -h "$BACKUP_PATH.tar.gz" | cut -f1)
    log "📊 Tamanho do backup: $BACKUP_SIZE"
else
    error "❌ Falha ao criar backup"
    exit 1
fi

# 3. Criar backup incremental (apenas mudanças)
log "🔄 Criando backup incremental..."
INCREMENTAL_BACKUP="${BACKUP_PATH}_incremental.tar.gz"

# Listar arquivos modificados nas últimas 24 horas
find . -type f -mtime -1 \
    -not -path "./backups/*" \
    -not -path "./node_modules/*" \
    -not -path "./SeentiCliente/e/*" \
    -not -path "./SeentiCliente/source/*" \
    -not -path "./SeentiCliente/Frontend/node_modules/*" \
    -not -path "./SeentiCliente/Frontend/dist/*" \
    -not -path "./SeentiCliente/Frontend/build/*" \
    -not -name "*.pyc" \
    -not -name "*.log" > /tmp/modified_files.txt

if [ -s /tmp/modified_files.txt ]; then
    tar -czf "$INCREMENTAL_BACKUP" -T /tmp/modified_files.txt
    INCREMENTAL_SIZE=$(du -h "$INCREMENTAL_BACKUP" | cut -f1)
    log "✅ Backup incremental criado: $INCREMENTAL_SIZE"
else
    log "ℹ️ Nenhum arquivo modificado nas últimas 24 horas"
fi

# 4. Limpeza de backups antigos (manter apenas os últimos 10)
log "🧹 Limpando backups antigos..."
cd "$BACKUP_DIR"
ls -t | tail -n +11 | xargs -r rm -f
cd ..

# 5. Criar arquivo de metadados do backup
METADATA_FILE="${BACKUP_PATH}_metadata.txt"
cat > "$METADATA_FILE" << EOF
# Metadados do Backup - Seenti App
Data/Hora: $(date)
Versão: $CURRENT_VERSION
Tipo: Backup completo
Tamanho: $BACKUP_SIZE
Arquivo: $BACKUP_NAME.tar.gz

## Conteúdo do Backup:
- Código fonte completo
- Documentação
- Configurações
- Scripts de deploy

## Exclusões:
- Ambientes virtuais
- node_modules
- Arquivos de build
- Logs
- Cache

## Como restaurar:
1. Extrair o arquivo: tar -xzf $BACKUP_NAME.tar.gz
2. Instalar dependências: npm install && pip install -r requirements.txt
3. Configurar variáveis de ambiente
4. Executar: ./start_project.sh

## Notas:
- Este backup foi criado automaticamente
- Mantenha backups em local seguro
- Teste a restauração periodicamente
EOF

log "📝 Metadados criados: $METADATA_FILE"

# 6. Verificar integridade do backup
log "🔍 Verificando integridade do backup..."
if tar -tzf "$BACKUP_PATH.tar.gz" > /dev/null 2>&1; then
    log "✅ Backup verificado com sucesso"
else
    error "❌ Backup corrompido!"
    exit 1
fi

# 7. Criar arquivo de índice de backups
INDEX_FILE="$BACKUP_DIR/backup_index.txt"
cat > "$INDEX_FILE" << EOF
# Índice de Backups - Seenti App
Última atualização: $(date)

## Backups Disponíveis:
$(ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null | awk '{print $9, $5, $6, $7, $8}' || echo "Nenhum backup encontrado")

## Informações:
- Total de backups: $(ls "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
- Espaço utilizado: $(du -sh "$BACKUP_DIR" | cut -f1)
- Último backup: $BACKUP_NAME.tar.gz

## Manutenção:
- Backups antigos são removidos automaticamente
- Mantidos apenas os últimos 10 backups
- Verifique a integridade periodicamente
EOF

log "📋 Índice de backups atualizado: $INDEX_FILE"

# 8. Resumo final
log "🎉 Backup e versionamento concluídos!"
log "📦 Backup completo: $BACKUP_PATH.tar.gz ($BACKUP_SIZE)"
if [ -f "$INCREMENTAL_BACKUP" ]; then
    log "🔄 Backup incremental: $INCREMENTAL_BACKUP ($INCREMENTAL_SIZE)"
fi
log "📁 Diretório de backups: $BACKUP_DIR"
log "📝 Metadados: $METADATA_FILE"
log "📋 Índice: $INDEX_FILE"

# 9. Sugestões de manutenção
log "💡 Sugestões de manutenção:"
log "   1. Teste a restauração do backup periodicamente"
log "   2. Mantenha backups em local seguro (nuvem/externo)"
log "   3. Monitore o espaço em disco"
log "   4. Configure backup automático via cron"

# 10. Limpeza de arquivos temporários
rm -f /tmp/modified_files.txt

log "✨ Processo de backup finalizado com sucesso! 💾"
