#!/bin/bash
# cleanup_environment.sh - Script de limpeza do ambiente Seenti
# Sprint 08 - Resolução de Problemas de Ambiente

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para log com timestamp
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

success() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Função para mostrar uso de disco
show_disk_usage() {
    log "💾 Status atual do disco:"
    df -h . | tail -1 | awk '{print "   💿 Disco: " $3 " usado de " $2 " (" $5 " usado)"}'
    echo
}

# Função para limpeza de arquivos Python
cleanup_python_cache() {
    log "🐍 Limpando cache Python..."
    
    local total_cleaned=0
    
    # Limpar __pycache__
    if find . -name "__pycache__" -type d 2>/dev/null | grep -q .; then
        local pycache_size=$(du -sh $(find . -name "__pycache__" -type d 2>/dev/null) 2>/dev/null | awk '{sum+=$1} END {print sum}')
        find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
        success "   ✅ __pycache__ removido (economia: ~$pycache_size)"
        ((total_cleaned++))
    else
        info "   ℹ️  Nenhum __pycache__ encontrado"
    fi
    
    # Limpar arquivos .pyc
    if find . -name "*.pyc" -type f 2>/dev/null | grep -q .; then
        local pyc_count=$(find . -name "*.pyc" -type f 2>/dev/null | wc -l)
        find . -name "*.pyc" -type f -delete 2>/dev/null
        success "   ✅ $pyc_count arquivos .pyc removidos"
        ((total_cleaned++))
    else
        info "   ℹ️  Nenhum arquivo .pyc encontrado"
    fi
    
    # Limpar arquivos .pyo
    if find . -name "*.pyo" -type f 2>/dev/null | grep -q .; then
        local pyo_count=$(find . -name "*.pyo" -type f 2>/dev/null | wc -l)
        find . -name "*.pyo" -type f -delete 2>/dev/null
        success "   ✅ $pyo_count arquivos .pyo removidos"
        ((total_cleaned++))
    fi
    
    return $total_cleaned
}

# Função para limpeza de Node.js
cleanup_node_cache() {
    log "🟢 Limpando cache Node.js..."
    
    local total_cleaned=0
    
    # Verificar se há node_modules desnecessários
    if [ -d "seenti-frontend/node_modules" ] && [ ! -f "seenti-frontend/package.json" ]; then
        local size=$(du -sh "seenti-frontend/node_modules" 2>/dev/null | cut -f1)
        rm -rf "seenti-frontend/node_modules"
        success "   ✅ node_modules desnecessário removido (economia: $size)"
        ((total_cleaned++))
    fi
    
    # Limpar npm cache
    if command -v npm &> /dev/null; then
        local npm_cache_size=$(npm cache verify 2>&1 | grep -o '[0-9.]*[KMG]B' | head -1 || echo "0B")
        npm cache clean --force 2>/dev/null
        success "   ✅ NPM cache limpo (economia: $npm_cache_size)"
        ((total_cleaned++))
    fi
    
    return $total_cleaned
}

# Função para limpeza de arquivos temporários
cleanup_temp_files() {
    log "🗑️  Limpando arquivos temporários..."
    
    local total_cleaned=0
    
    # Limpar arquivos de log
    if find . -name "*.log" -type f 2>/dev/null | grep -q .; then
        local log_count=$(find . -name "*.log" -type f 2>/dev/null | wc -l)
        find . -name "*.log" -type f -delete 2>/dev/null
        success "   ✅ $log_count arquivos .log removidos"
        ((total_cleaned++))
    fi
    
    # Limpar arquivos temporários
    if find . -name "*.tmp" -type f 2>/dev/null | grep -q .; then
        local tmp_count=$(find . -name "*.tmp" -type f 2>/dev/null | wc -l)
        find . -name "*.tmp" -type f -delete 2>/dev/null
        success "   ✅ $tmp_count arquivos .tmp removidos"
        ((total_cleaned++))
    fi
    
    # Limpar arquivos de lock
    if find . -name "*.lock" -type f 2>/dev/null | grep -q .; then
        local lock_count=$(find . -name "*.lock" -type f 2>/dev/null | wc -l)
        find . -name "*.lock" -type f -delete 2>/dev/null
        ((total_cleaned++))
    fi
    
    # Limpar arquivos de backup
    if find . -name "*.bak" -type f 2>/dev/null | grep -q .; then
        local bak_count=$(find . -name "*.bak" -type f 2>/dev/null | wc -l)
        find . -name "*.bak" -type f -delete 2>/dev/null
        success "   ✅ $bak_count arquivos .bak removidos"
        ((total_cleaned++))
    fi
    
    return $total_cleaned
}

# Função para limpeza de diretórios vazios
cleanup_empty_dirs() {
    log "📁 Removendo diretórios vazios..."
    
    local empty_dirs=0
    
    # Encontrar e remover diretórios vazios
    while IFS= read -r -d '' dir; do
        if [ -z "$(ls -A "$dir" 2>/dev/null)" ]; then
            rmdir "$dir" 2>/dev/null && ((empty_dirs++))
        fi
    done < <(find . -type d -empty -print0 2>/dev/null)
    
    if [ $empty_dirs -gt 0 ]; then
        success "   ✅ $empty_dirs diretórios vazios removidos"
    else
        info "   ℹ️  Nenhum diretório vazio encontrado"
    fi
    
    return $empty_dirs
}

# Função para análise de espaço por diretório
analyze_space_usage() {
    log "📊 Analisando uso de espaço por diretório..."
    
    echo "   📁 Top 10 maiores diretórios:"
    du -sh * 2>/dev/null | sort -hr | head -10 | sed 's/^/      /'
    echo
}

# Função para limpeza inteligente
smart_cleanup() {
    log "🧠 Executando limpeza inteligente..."
    
    local total_cleaned=0
    
    # Limpeza de Python
    cleanup_python_cache
    ((total_cleaned += $?))
    
    # Limpeza de Node.js
    cleanup_node_cache
    ((total_cleaned += $?))
    
    # Limpeza de arquivos temporários
    cleanup_temp_files
    ((total_cleaned += $?))
    
    # Limpeza de diretórios vazios
    cleanup_empty_dirs
    ((total_cleaned += $?))
    
    return $total_cleaned
}

# Função principal
main() {
    log "🧹 Iniciando limpeza do ambiente Seenti..."
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🧹 LIMPEZA DE AMBIENTE                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    # Mostrar status inicial
    show_disk_usage
    
    # Análise de espaço
    analyze_space_usage
    
    # Executar limpeza inteligente
    local cleaned_items
    smart_cleanup
    cleaned_items=$?
    
    echo
    log "🔄 Executando garbage collection..."
    
    # Forçar limpeza de memória
    if command -v python3 &> /dev/null; then
        python3 -c "import gc; gc.collect()" 2>/dev/null
    fi
    
    # Limpeza do sistema
    if command -v sudo &> /dev/null; then
        sudo sync 2>/dev/null
    fi
    
    success "✅ Limpeza concluída!"
    
    echo
    log "📊 Status final do disco:"
    show_disk_usage
    
    # Resumo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 RESUMO DA LIMPEZA                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    if [ $cleaned_items -gt 0 ]; then
        success "🎉 Limpeza realizada com sucesso!"
        echo "   ✅ Itens limpos: $cleaned_items"
        echo "   💾 Espaço liberado: Verificado acima"
        echo "   🔄 Sistema otimizado"
    else
        info "ℹ️  Ambiente já estava limpo"
    fi
    
    echo
    echo "💡 Dicas para manter o ambiente limpo:"
    echo "   1. 🧹 Execute este script regularmente"
    echo "   2. 📦 Remova dependências não utilizadas"
    echo "   3. 🗑️  Limpe logs antigos periodicamente"
    echo "   4. 💾 Monitore o uso de disco"
    
    echo
    success "✨ Ambiente Seenti otimizado com sucesso!"
}

# Executar função principal
main "$@"
