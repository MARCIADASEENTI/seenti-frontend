#!/bin/bash

# 📊 Script de Status - Seenti App
# Este script verifica o status de todos os serviços e repositórios

set -e  # Para execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

success() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

# Configurações
FRONTEND_URL="https://frontend-seenti-app.vercel.app"
BACKEND_URL="https://backend-seenti-app.onrender.com"

log "📊 Verificando status completo do Seenti App..."

echo
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 SEENTI APP STATUS                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

# 1. Status do Repositório Git
echo "🔧 REPOSITÓRIO GIT"
echo "───────────────────"

if [ -d ".git" ]; then
    success "✅ Repositório Git configurado"
    
    # Verificar branch atual
    CURRENT_BRANCH=$(git branch --show-current)
    echo "   📍 Branch atual: $CURRENT_BRANCH"
    
    # Verificar status
    GIT_STATUS=$(git status --porcelain)
    if [ -z "$GIT_STATUS" ]; then
        success "   ✅ Repositório limpo (sem mudanças pendentes)"
    else
        warn "   ⚠️ Mudanças pendentes:"
        echo "$GIT_STATUS" | sed 's/^/      /'
    fi
    
    # Verificar repositório remoto
    if git remote -v | grep -q origin; then
        REMOTE_URL=$(git remote get-url origin)
        success "   🔗 Repositório remoto: $REMOTE_URL"
    else
        warn "   ⚠️ Nenhum repositório remoto configurado"
    fi
    
    # Verificar último commit
    LAST_COMMIT=$(git log -1 --oneline)
    echo "   📝 Último commit: $LAST_COMMIT"
    
else
    error "❌ Repositório Git não configurado"
    echo "   💡 Execute: ./setup_git.sh"
fi

echo

# 2. Status dos Scripts
echo "📜 SCRIPTS DE AUTOMAÇÃO"
echo "────────────────────────"

# Verificar deploy.sh
if [ -f "deploy.sh" ] && [ -x "deploy.sh" ]; then
    success "✅ deploy.sh - Disponível e executável"
else
    warn "⚠️ deploy.sh - Não disponível ou não executável"
fi

# Verificar backup.sh
if [ -f "backup.sh" ] && [ -x "backup.sh" ]; then
    success "✅ backup.sh - Disponível e executável"
else
    warn "⚠️ backup.sh - Não disponível ou não executável"
fi

# Verificar setup_git.sh
if [ -f "setup_git.sh" ] && [ -x "setup_git.sh" ]; then
    success "✅ setup_git.sh - Disponível e executável"
else
    warn "⚠️ setup_git.sh - Não disponível ou não executável"
fi

# Verificar start_project.sh
if [ -f "start_project.sh" ] && [ -x "start_project.sh" ]; then
    success "✅ start_project.sh - Disponível e executável"
else
    warn "⚠️ start_project.sh - Não disponível ou não executável"
fi

echo

# 3. Status dos Serviços de Deploy
echo "🌐 SERVIÇOS DE DEPLOY"
echo "─────────────────────"

# Verificar Vercel (Frontend)
echo "🎨 Frontend (Vercel):"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        success "   ✅ Online - HTTP $HTTP_CODE"
    elif [ "$HTTP_CODE" = "000" ]; then
        error "   ❌ Offline - Sem resposta"
    else
        warn "   ⚠️ Status HTTP: $HTTP_CODE"
    fi
else
    warn "   ⚠️ curl não disponível para teste"
fi

# Verificar Render (Backend)
echo "🔧 Backend (Render):"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        success "   ✅ Online - HTTP $HTTP_CODE"
    elif [ "$HTTP_CODE" = "000" ]; then
        error "   ❌ Offline - Sem resposta"
    else
        warn "   ⚠️ Status HTTP: $HTTP_CODE"
    fi
else
    warn "   ⚠️ curl não disponível para teste"
fi

echo

# 4. Status dos Arquivos de Configuração
echo "⚙️ ARQUIVOS DE CONFIGURAÇÃO"
echo "───────────────────────────"

# Verificar .gitignore
if [ -f ".gitignore" ]; then
    success "✅ .gitignore - Configurado"
else
    warn "⚠️ .gitignore - Não encontrado"
fi

# Verificar .gitattributes
if [ -f ".gitattributes" ]; then
    success "✅ .gitattributes - Configurado"
else
    warn "⚠️ .gitattributes - Não encontrado"
fi

# Verificar VERSION.txt
if [ -f "VERSION.txt" ]; then
    VERSION=$(cat "VERSION.txt")
    success "✅ VERSION.txt - Versão $VERSION"
else
    warn "⚠️ VERSION.txt - Não encontrado"
fi

# Verificar requirements.txt
if [ -f "SeentiCliente/requirements.txt" ]; then
    success "✅ requirements.txt - Configurado"
else
    warn "⚠️ requirements.txt - Não encontrado"
fi

# Verificar package.json
if [ -f "SeentiCliente/Frontend/package.json" ]; then
    success "✅ package.json - Configurado"
else
    warn "⚠️ package.json - Não encontrado"
fi

echo

# 5. Status dos Diretórios
echo "📁 ESTRUTURA DE DIRETÓRIOS"
echo "───────────────────────────"

# Verificar SeentiCliente
if [ -d "SeentiCliente" ]; then
    success "✅ SeentiCliente/ - Diretório principal"
    
    # Verificar subdiretórios
    if [ -d "SeentiCliente/dev" ]; then
        success "   ✅ dev/ - Backend Flask"
    else
        warn "   ⚠️ dev/ - Não encontrado"
    fi
    
    if [ -d "SeentiCliente/Frontend" ]; then
        success "   ✅ Frontend/ - Frontend React"
    else
        warn "   ⚠️ Frontend/ - Não encontrado"
    fi
else
    error "❌ SeentiCliente/ - Diretório principal não encontrado"
fi

# Verificar backups
if [ -d "backups" ]; then
    BACKUP_COUNT=$(ls -1 "backups"/*.tar.gz 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt 0 ]; then
        success "✅ backups/ - $BACKUP_COUNT backup(s) disponível(is)"
    else
        warn "⚠️ backups/ - Diretório vazio"
    fi
else
    warn "⚠️ backups/ - Diretório não encontrado"
fi

echo

# 6. Status das Dependências
echo "📦 DEPENDÊNCIAS"
echo "───────────────"

# Verificar Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    success "✅ Python: $PYTHON_VERSION"
else
    error "❌ Python3 não instalado"
fi

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "✅ Node.js: $NODE_VERSION"
else
    error "❌ Node.js não instalado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "✅ npm: $NPM_VERSION"
else
    error "❌ npm não instalado"
fi

# Verificar Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    success "✅ Git: $GIT_VERSION"
else
    error "❌ Git não instalado"
fi

echo

# 7. Status do Sistema
echo "💻 SISTEMA"
echo "───────────"

# Verificar espaço em disco
DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}')
DISK_AVAILABLE=$(df -h . | tail -1 | awk '{print $4}')
echo "💾 Espaço em disco: $DISK_USAGE usado, $DISK_AVAILABLE disponível"

# Verificar memória
if command -v free &> /dev/null; then
    MEMORY=$(free -h | grep Mem | awk '{print $3 "/" $2}')
    echo "🧠 Memória: $MEMORY"
fi

# Verificar uptime
UPTIME=$(uptime -p 2>/dev/null || echo "N/A")
echo "⏰ Uptime: $UPTIME"

echo

# 8. Resumo e Recomendações
echo "📋 RESUMO E RECOMENDAÇÕES"
echo "──────────────────────────"

echo "🎯 Status Geral:"
if [ -d ".git" ] && [ -f "deploy.sh" ] && [ -f "backup.sh" ]; then
    success "   ✅ Projeto configurado e pronto para deploy"
else
    warn "   ⚠️ Projeto precisa de configuração adicional"
fi

echo
echo "💡 Próximos Passos:"

if [ ! -d ".git" ]; then
    echo "   1. 🔧 Execute: ./setup_git.sh"
fi

if [ ! -x "deploy.sh" ]; then
    echo "   2. 🚀 Configure: chmod +x deploy.sh"
fi

if [ ! -x "backup.sh" ]; then
    echo "   3. 💾 Configure: chmod +x backup.sh"
fi

echo "   4. 🌐 Configure Vercel e Render para deploy automático"
echo "   5. 📤 Faça push para o repositório remoto"
echo "   6. 🚀 Execute deploy: ./deploy.sh"

echo
echo "🔍 Para mais detalhes, consulte: README_DEPLOY.md"

echo
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📊 VERIFICAÇÃO CONCLUÍDA                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

log "✨ Status do projeto verificado com sucesso!"
