#!/bin/bash

# 📊 Script de Status - Seenti App - VERSÃO MELHORADA
# Este script verifica o status de todos os serviços e repositórios

# Configurações de segurança
TIMEOUT_SECONDS=10
MAX_RETRIES=3
CURL_TIMEOUT=5

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

# Função para verificar serviço com timeout e retry
check_service_with_retry() {
    local url="$1"
    local service_name="$2"
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if command -v curl &> /dev/null; then
            # Usar timeout para evitar travamento
            HTTP_CODE=$(timeout $CURL_TIMEOUT curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
            
            if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
                success "   ✅ Online - HTTP $HTTP_CODE"
                return 0
            elif [ "$HTTP_CODE" = "000" ]; then
                warn "   ⚠️  Tentativa $((retry_count + 1))/$MAX_RETRIES - Timeout"
            else
                warn "   ⚠️  Tentativa $((retry_count + 1))/$MAX_RETRIES - HTTP $HTTP_CODE"
            fi
        else
            warn "   ⚠️  curl não disponível para teste"
            return 1
        fi
        
        ((retry_count++))
        if [ $retry_count -lt $MAX_RETRIES ]; then
            sleep 2
        fi
    done
    
    error "   ❌ Offline após $MAX_RETRIES tentativas"
    return 1
}

# Função para verificar performance de serviço
check_service_performance() {
    local url="$1"
    local service_name="$2"
    
    if command -v curl &> /dev/null; then
        # Medir tempo de resposta
        START_TIME=$(date +%s%N)
        HTTP_CODE=$(timeout $CURL_TIMEOUT curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        END_TIME=$(date +%s%N)
        
        if [ "$HTTP_CODE" != "000" ]; then
            RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))  # em milissegundos
            if [ $RESPONSE_TIME -lt 1000 ]; then
                success "   ⚡ Tempo de resposta: ${RESPONSE_TIME}ms (Excelente)"
            elif [ $RESPONSE_TIME -lt 3000 ]; then
                info "   ⚡ Tempo de resposta: ${RESPONSE_TIME}ms (Bom)"
            else
                warn "   ⚡ Tempo de resposta: ${RESPONSE_TIME}ms (Lento)"
            fi
        fi
    fi
}

# Função para verificar conectividade de rede
check_network_connectivity() {
    info "🌐 Verificando conectividade de rede..."
    
    # Verificar conectividade com internet
    if ping -c 1 8.8.8.8 &> /dev/null; then
        success "   ✅ Conectividade com internet OK"
    else
        warn "   ⚠️  Problemas de conectividade com internet"
    fi
    
    # Verificar DNS
    if nslookup google.com &> /dev/null; then
        success "   ✅ Resolução DNS OK"
    else
        warn "   ⚠️  Problemas com resolução DNS"
    fi
}

# Função para verificar recursos do sistema
check_system_resources() {
    info "💻 Verificando recursos do sistema..."
    
    # Verificar espaço em disco
    DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    DISK_AVAILABLE=$(df -h . | tail -1 | awk '{print $4}')
    
    if [ "$DISK_USAGE" -lt 80 ]; then
        success "   💾 Disco: $DISK_USAGE% usado, $DISK_AVAILABLE disponível"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        warn "   💾 Disco: $DISK_USAGE% usado, $DISK_AVAILABLE disponível (Atenção)"
    else
        error "   💾 Disco: $DISK_USAGE% usado, $DISK_AVAILABLE disponível (CRÍTICO)"
    fi
    
    # Verificar memória
    if command -v free &> /dev/null; then
        MEMORY_TOTAL=$(free -m | grep Mem | awk '{print $2}')
        MEMORY_USED=$(free -m | grep Mem | awk '{print $3}')
        MEMORY_PERCENT=$(( MEMORY_USED * 100 / MEMORY_TOTAL ))
        
        if [ "$MEMORY_PERCENT" -lt 80 ]; then
            success "   🧠 Memória: $MEMORY_PERCENT% usado (${MEMORY_USED}MB/${MEMORY_TOTAL}MB)"
        elif [ "$MEMORY_PERCENT" -lt 90 ]; then
            warn "   🧠 Memória: $MEMORY_PERCENT% usado (${MEMORY_USED}MB/${MEMORY_TOTAL}MB) (Atenção)"
        else
            error "   🧠 Memória: $MEMORY_PERCENT% usado (${MEMORY_USED}MB/${MEMORY_TOTAL}MB) (CRÍTICO)"
        fi
    fi
    
    # Verificar uptime
    UPTIME=$(uptime -p 2>/dev/null || echo "N/A")
    info "   ⏰ Uptime: $UPTIME"
}

# Função para verificar processos locais
check_local_processes() {
    info "🔍 Verificando processos locais..."
    
    # Verificar se há processos rodando
    if pgrep -f "python3 app.py" > /dev/null; then
        BACKEND_PID=$(pgrep -f "python3 app.py" | head -1)
        success "   ✅ Backend rodando (PID: $BACKEND_PID)"
    else
        info "   ℹ️  Backend não está rodando"
    fi
    
    if pgrep -f "vite" > /dev/null; then
        FRONTEND_PID=$(pgrep -f "vite" | head -1)
        success "   ✅ Frontend rodando (PID: $FRONTEND_PID)"
    else
        info "   ℹ️  Frontend não está rodando"
    fi
}

# Função principal
main() {
    log "📊 Verificando status completo do Seenti App..."

    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 SEENTI APP STATUS                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo

    # Verificar conectividade de rede primeiro
    check_network_connectivity
    echo

    # Verificar recursos do sistema
    check_system_resources
    echo

    # Verificar processos locais
    check_local_processes
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

    # Verificar stop_project.sh
    if [ -f "stop_project.sh" ] && [ -x "stop_project.sh" ]; then
        success "✅ stop_project.sh - Disponível e executável"
    else
        warn "⚠️ stop_project.sh - Não disponível ou não executável"
    fi

    echo

    # 3. Status dos Serviços de Deploy
    echo "🌐 SERVIÇOS DE DEPLOY"
    echo "─────────────────────"

    # Verificar Vercel (Frontend)
    echo "🎨 Frontend (Vercel):"
    check_service_with_retry "https://frontend-seenti-app.vercel.app" "Frontend"
    check_service_performance "https://frontend-seenti-app.vercel.app" "Frontend"

    # Verificar Render (Backend)
    echo "🔧 Backend (Render):"
    check_service_with_retry "https://backend-seenti-app.onrender.com" "Backend"
    check_service_performance "https://backend-seenti-app.onrender.com" "Backend"

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

    # 7. Resumo e Recomendações
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
}

# Executar função principal
main "$@"
