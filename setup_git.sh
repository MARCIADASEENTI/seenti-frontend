#!/bin/bash

# 🔧 Script de Configuração Git - Seenti App
# Este script configura o repositório Git e prepara para deploy

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

log "🔧 Configurando repositório Git para Seenti App..."

# 1. Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    error "Git não está instalado. Instale primeiro:"
    error "sudo apt-get install git (Ubuntu/Debian)"
    error "brew install git (macOS)"
    exit 1
fi

# 2. Verificar se já é um repositório Git
if [ -d ".git" ]; then
    warn "Repositório Git já existe!"
    git status --short
    read -p "Deseja reconfigurar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Configuração cancelada."
        exit 0
    fi
    log "Removendo configuração Git existente..."
    rm -rf .git
fi

# 3. Inicializar repositório Git
log "📁 Inicializando repositório Git..."
git init

# 4. Configurar usuário Git (se não configurado)
if [ -z "$(git config --global user.name)" ]; then
    warn "Usuário Git não configurado globalmente."
    read -p "Digite seu nome: " USER_NAME
    read -p "Digite seu email: " USER_EMAIL
    
    git config user.name "$USER_NAME"
    git config user.email "$USER_EMAIL"
    log "✅ Usuário Git configurado localmente"
else
    log "✅ Usuário Git já configurado: $(git config user.name) <$(git config user.email)>"
fi

# 5. Adicionar arquivos ao repositório
log "📝 Adicionando arquivos ao repositório..."
git add .

# 6. Fazer commit inicial
log "💾 Fazendo commit inicial..."
git commit -m "🚀 Commit inicial - Seenti App v1.0.0

- Sistema de configurações do cliente
- Sistema de notificações
- Sistema de agendamento
- Documentação Sprint 06
- Scripts de deploy e backup
- Arquitetura Flask + React"

# 7. Configurar branch principal
log "🌿 Configurando branch principal..."
git branch -M main

# 8. Solicitar URL do repositório remoto
log "🔗 Configuração do repositório remoto..."
echo
echo "Para conectar ao GitHub/GitLab, você precisará:"
echo "1. Criar um repositório vazio no GitHub/GitLab"
echo "2. Copiar a URL do repositório"
echo
read -p "Digite a URL do repositório remoto (ou pressione Enter para pular): " REMOTE_URL

if [ -n "$REMOTE_URL" ]; then
    log "🔗 Adicionando repositório remoto..."
    git remote add origin "$REMOTE_URL"
    
    log "📤 Fazendo push para o repositório remoto..."
    git push -u origin main
    
    log "✅ Repositório remoto configurado e sincronizado!"
else
    warn "Repositório remoto não configurado."
    warn "Configure manualmente quando estiver pronto:"
    warn "git remote add origin <URL_DO_REPOSITORIO>"
    warn "git push -u origin main"
fi

# 9. Configurar hooks Git (opcional)
log "🎣 Configurando hooks Git..."
mkdir -p .git/hooks

# Hook de pre-commit para verificar sintaxe
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Hook de pre-commit para verificar sintaxe

echo "🔍 Verificando sintaxe dos arquivos..."

# Verificar Python
if command -v python3 &> /dev/null; then
    echo "🐍 Verificando sintaxe Python..."
    find . -name "*.py" -not -path "./SeentiCliente/e/*" -not -path "./SeentiCliente/source/*" -exec python3 -m py_compile {} \;
    if [ $? -ne 0 ]; then
        echo "❌ Erro de sintaxe Python encontrado!"
        exit 1
    fi
    echo "✅ Sintaxe Python OK"
fi

# Verificar JavaScript/JSX
if command -v node &> /dev/null; then
    echo "🟨 Verificando sintaxe JavaScript..."
    find . -name "*.js" -o -name "*.jsx" | head -5 | xargs -I {} node -c {}
    if [ $? -ne 0 ]; then
        echo "❌ Erro de sintaxe JavaScript encontrado!"
        exit 1
    fi
    echo "✅ Sintaxe JavaScript OK"
fi

echo "✅ Verificação de sintaxe concluída!"
EOF

chmod +x .git/hooks/pre-commit
log "✅ Hook de pre-commit configurado"

# 10. Configurar .gitattributes
log "📋 Configurando .gitattributes..."
cat > .gitattributes << 'EOF'
# Configurações de arquivos para Git

# Arquivos de texto
*.md text eol=lf
*.txt text eol=lf
*.py text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.css text eol=lf
*.html text eol=lf
*.sh text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
*.json text eol=lf

# Arquivos binários
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.zip binary
*.tar.gz binary

# Arquivos específicos do projeto
VERSION.txt text eol=lf
requirements.txt text eol=lf
package.json text eol=lf
.gitignore text eol=lf
EOF

# 11. Configurar branches de desenvolvimento
log "🌿 Configurando branches de desenvolvimento..."
git checkout -b develop
git checkout -b staging
git checkout main

# 12. Resumo final
log "🎉 Configuração Git concluída com sucesso!"
log ""
log "📋 Resumo da configuração:"
log "   ✅ Repositório Git inicializado"
log "   ✅ Branch principal: main"
log "   ✅ Branches criados: develop, staging"
log "   ✅ Hook de pre-commit configurado"
log "   ✅ .gitattributes configurado"
log ""
log "🔗 Próximos passos:"
if [ -n "$REMOTE_URL" ]; then
    log "   ✅ Repositório remoto configurado"
    log "   ✅ Código sincronizado"
else
    log "   1. Configure o repositório remoto:"
    log "      git remote add origin <URL_DO_REPOSITORIO>"
    log "   2. Faça push: git push -u origin main"
fi
log "   3. Use: ./deploy.sh para deploy automático"
log "   4. Use: ./backup.sh para backup e versionamento"
log ""
log "🚀 Seenti App está pronto para desenvolvimento colaborativo!"
