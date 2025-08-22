#!/bin/bash

# 🚀 Script de Deploy Automatizado - Seenti App
# Este script automatiza o processo de deploy para produção

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

# Verificar se estamos no diretório correto
if [ ! -f "deploy.sh" ]; then
    error "Execute este script do diretório raiz do projeto"
    exit 1
fi

log "🚀 Iniciando deploy do Seenti App..."

# 1. Verificar status do Git
log "📋 Verificando status do repositório Git..."
if [ -d ".git" ]; then
    git_status=$(git status --porcelain)
    if [ -n "$git_status" ]; then
        warn "Existem mudanças não commitadas:"
        echo "$git_status"
        read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Deploy cancelado. Faça commit das mudanças primeiro."
            exit 1
        fi
    fi
    
    # Fazer commit automático se houver mudanças
    if [ -n "$git_status" ]; then
        log "📝 Fazendo commit automático das mudanças..."
        git add .
        git commit -m "🚀 Deploy automático - $(date +'%Y-%m-%d %H:%M:%S')"
    fi
    
    # Fazer push para o repositório remoto
    log "📤 Fazendo push para o repositório remoto..."
    git push origin main || git push origin master
else
    warn "Diretório .git não encontrado. Inicializando repositório..."
    git init
    git add .
    git commit -m "🚀 Commit inicial - Seenti App"
    warn "Configure o repositório remoto manualmente:"
    warn "git remote add origin <URL_DO_REPOSITORIO>"
    warn "git push -u origin main"
fi

# 2. Deploy do Frontend (Vercel)
log "🎨 Deployando Frontend para Vercel..."
if [ -d "SeentiCliente/Frontend" ]; then
    cd SeentiCliente/Frontend
    
    # Verificar se Vercel está configurado
    if [ -f "vercel.json" ] || [ -d ".vercel" ]; then
        log "Vercel configurado. Fazendo deploy..."
        vercel --prod --yes
    else
        warn "Vercel não configurado. Configure manualmente:"
        warn "cd SeentiCliente/Frontend"
        warn "vercel"
    fi
    
    cd ../..
else
    error "Diretório Frontend não encontrado!"
    exit 1
fi

# 3. Deploy do Backend (Render)
log "🔧 Deployando Backend para Render..."
if [ -d "SeentiCliente" ]; then
    cd SeentiCliente
    
    # Verificar se há arquivos de configuração do Render
    if [ -f "render.yaml" ] || [ -f ".render" ]; then
        log "Render configurado. Deploy automático ativado via Git push."
    else
        warn "Render não configurado. Configure manualmente:"
        warn "1. Acesse https://render.com"
        warn "2. Conecte seu repositório Git"
        warn "3. Configure o serviço web"
        warn "4. Configure as variáveis de ambiente"
    fi
    
    cd ..
else
    error "Diretório SeentiCliente não encontrado!"
    exit 1
fi

# 4. Verificação de saúde
log "🏥 Verificando saúde dos serviços..."
sleep 10  # Aguardar deploy

# Verificar Frontend
FRONTEND_URL="https://frontend-seenti-app.vercel.app"
if command -v curl &> /dev/null; then
    if curl -s -f "$FRONTEND_URL" > /dev/null; then
        log "✅ Frontend (Vercel) está funcionando: $FRONTEND_URL"
    else
        warn "⚠️ Frontend pode não estar funcionando: $FRONTEND_URL"
    fi
else
    warn "curl não disponível. Verifique manualmente: $FRONTEND_URL"
fi

# Verificar Backend
BACKEND_URL="https://backend-seenti-app.onrender.com"
if command -v curl &> /dev/null; then
    if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1 || curl -s -f "$BACKEND_URL" > /dev/null; then
        log "✅ Backend (Render) está funcionando: $BACKEND_URL"
    else
        warn "⚠️ Backend pode não estar funcionando: $BACKEND_URL"
    fi
else
    warn "curl não disponível. Verifique manualmente: $BACKEND_URL"
fi

# 5. Resumo final
log "🎉 Deploy concluído com sucesso!"
log "📱 Frontend: $FRONTEND_URL"
log "🔧 Backend: $BACKEND_URL"
log "📋 Próximos passos:"
log "   1. Teste as funcionalidades em produção"
log "   2. Verifique os logs em caso de problemas"
log "   3. Monitore o desempenho dos serviços"

# 6. Limpeza
log "🧹 Limpando arquivos temporários..."
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

log "✨ Deploy finalizado! Seenti App está no ar! 🚀"
