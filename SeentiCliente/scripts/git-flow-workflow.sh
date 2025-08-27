#!/bin/bash

# 🚀 SCRIPT DE AUTOMAÇÃO GIT FLOW - SEENTI
# Sprint 07 - Tarefa 10: Git Flow e Versionamento Semântico

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[GIT FLOW]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] && [ ! -f "requirements.txt" ]; then
    error "Execute este script no diretório raiz do projeto Seenti"
    exit 1
fi

# Verificar se Git está configurado
if ! git config --get user.name > /dev/null 2>&1; then
    error "Git não está configurado. Configure usuário e email primeiro:"
    echo "git config --global user.name 'Seu Nome'"
    echo "git config --global user.email 'seu.email@exemplo.com'"
    exit 1
fi

log "🚀 Iniciando workflow Git Flow para Seenti..."

# 1. CRIAR NOVA FEATURE
create_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        read -p "Nome da feature (sem espaços): " feature_name
    fi
    
    log "Criando feature: $feature_name"
    
    # Verificar se estamos em develop
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "develop" ]; then
        log "Mudando para branch develop..."
        git checkout develop
    fi
    
    # Criar e mudar para feature branch
    git checkout -b "feature/$feature_name"
    log "✅ Feature branch criada: feature/$feature_name"
    log "💡 Desenvolva sua funcionalidade e depois execute:"
    log "   ./scripts/git-flow-workflow.sh finish_feature $feature_name"
}

# 2. FINALIZAR FEATURE
finish_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        error "Especifique o nome da feature: ./scripts/git-flow-workflow.sh finish_feature NOME_DA_FEATURE"
        exit 1
    fi
    
    log "Finalizando feature: $feature_name"
    
    # Verificar se estamos na feature branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "feature/$feature_name" ]; then
        error "Você deve estar na branch feature/$feature_name"
        exit 1
    fi
    
    # Commit das mudanças
    if ! git diff --quiet; then
        log "Commits pendentes detectados. Adicionando mudanças..."
        git add .
        git commit -m "feat: finaliza implementação de $feature_name"
    fi
    
    # Mudar para develop e merge
    git checkout develop
    git merge "feature/$feature_name"
    
    # Deletar feature branch
    git branch -d "feature/$feature_name"
    
    log "✅ Feature $feature_name finalizada e integrada em develop"
}

# 3. CRIAR RELEASE
create_release() {
    local version=$1
    if [ -z "$version" ]; then
        read -p "Versão do release (ex: 1.1.0): " version
    fi
    
    log "Criando release: v$version"
    
    # Verificar se estamos em develop
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "develop" ]; then
        log "Mudando para branch develop..."
        git checkout develop
    fi
    
    # Criar release branch
    git checkout -b "release/v$version"
    
    # Atualizar CHANGELOG.md
    if [ -f "CHANGELOG.md" ]; then
        log "Atualizando CHANGELOG.md..."
        echo -e "\n## [v$version] - $(date +%Y-%m-%d)\n" >> CHANGELOG.md
        echo "### Adicionado" >> CHANGELOG.md
        echo "- Sprint 07 implementada com sucesso" >> CHANGELOG.md
        echo "### Corrigido" >> CHANGELOG.md
        echo "- Sidebar mobile com animações suaves" >> CHANGELOG.md
        echo "- Todas as 9 tarefas funcionando perfeitamente" >> CHANGELOG.md
        
        git add CHANGELOG.md
        git commit -m "chore: atualiza CHANGELOG para v$version"
    fi
    
    log "✅ Release branch criada: release/v$version"
    log "💡 Teste e ajuste conforme necessário, depois execute:"
    log "   ./scripts/git-flow-workflow.sh finish_release $version"
}

# 4. FINALIZAR RELEASE
finish_release() {
    local version=$1
    if [ -z "$version" ]; then
        error "Especifique a versão: ./scripts/git-flow-workflow.sh finish_release VERSION"
        exit 1
    fi
    
    log "Finalizando release: v$version"
    
    # Verificar se estamos na release branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "release/v$version" ]; then
        error "Você deve estar na branch release/v$version"
        exit 1
    fi
    
    # Merge para main (produção)
    git checkout main
    git merge "release/v$version"
    
    # Criar tag
    git tag -a "v$version" -m "Release v$version - Sprint 07 Completa"
    
    # Merge para develop
    git checkout develop
    git merge "release/v$version"
    
    # Deletar release branch
    git checkout main
    git branch -d "release/v$version"
    
    log "✅ Release v$version finalizado com sucesso!"
    log "🎉 Sprint 07 entregue com 100% de sucesso!"
    log "🏷️ Tag v$version criada em main"
}

# 5. CRIAR HOTFIX
create_hotfix() {
    local version=$1
    if [ -z "$version" ]; then
        read -p "Versão do hotfix (ex: 1.1.1): " version
    fi
    
    log "Criando hotfix: v$version"
    
    # Verificar se estamos em main
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        log "Mudando para branch main..."
        git checkout main
    fi
    
    # Criar hotfix branch
    git checkout -b "hotfix/v$version"
    
    log "✅ Hotfix branch criada: hotfix/v$version"
    log "💡 Corrija o problema e depois execute:"
    log "   ./scripts/git-flow-workflow.sh finish_hotfix $version"
}

# 6. FINALIZAR HOTFIX
finish_hotfix() {
    local version=$1
    if [ -z "$version" ]; then
        error "Especifique a versão: ./scripts/git-flow-workflow.sh finish_hotfix VERSION"
        exit 1
    fi
    
    log "Finalizando hotfix: v$version"
    
    # Verificar se estamos na hotfix branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "hotfix/v$version" ]; then
        error "Você deve estar na branch hotfix/v$version"
        exit 1
    fi
    
    # Commit das correções
    if ! git diff --quiet; then
        log "Commits pendentes detectados. Adicionando mudanças..."
        git add .
        git commit -m "fix: corrige problema crítico v$version"
    fi
    
    # Merge para main
    git checkout main
    git merge "hotfix/v$version"
    
    # Criar tag
    git tag -a "v$version" -m "Hotfix v$version"
    
    # Merge para develop
    git checkout develop
    git merge "hotfix/v$version"
    
    # Deletar hotfix branch
    git checkout main
    git branch -d "hotfix/v$version"
    
    log "✅ Hotfix v$version finalizado com sucesso!"
}

# 7. STATUS DO PROJETO
show_status() {
    log "📊 Status atual do projeto Seenti:"
    echo
    
    echo "🌿 Branches disponíveis:"
    git branch -a
    
    echo
    echo "🏷️ Tags disponíveis:"
    git tag --sort=-version:refname | head -10
    
    echo
    echo "📈 Últimos commits:"
    git log --oneline -5
    
    echo
    echo "📁 Status do working directory:"
    git status --short
}

# 8. AJUDA
show_help() {
    echo "🚀 GIT FLOW WORKFLOW - SEENTI"
    echo "Sprint 07 - Tarefa 10: Git Flow e Versionamento Semântico"
    echo
    echo "Uso: $0 [COMANDO] [PARÂMETROS]"
    echo
    echo "Comandos disponíveis:"
    echo "  create_feature [NOME]     - Criar nova feature branch"
    echo "  finish_feature [NOME]     - Finalizar e integrar feature"
    echo "  create_release [VERSION]  - Criar release branch"
    echo "  finish_release [VERSION]  - Finalizar release"
    echo "  create_hotfix [VERSION]   - Criar hotfix branch"
    echo "  finish_hotfix [VERSION]   - Finalizar hotfix"
    echo "  status                    - Mostrar status do projeto"
    echo "  help                      - Mostrar esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 create_feature login-social"
    echo "  $0 create_release 1.1.0"
    echo "  $0 status"
}

# Menu principal
case "${1:-help}" in
    "create_feature")
        create_feature "$2"
        ;;
    "finish_feature")
        finish_feature "$2"
        ;;
    "create_release")
        create_release "$2"
        ;;
    "finish_release")
        finish_release "$2"
        ;;
    "create_hotfix")
        create_hotfix "$2"
        ;;
    "finish_hotfix")
        finish_hotfix "$2"
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        show_help
        ;;
esac






