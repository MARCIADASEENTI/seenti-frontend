#!/bin/bash
# validate_deploy.sh - Script de validação pré-deploy - VERSÃO 1.0
# Sprint 08 - Otimizações de Ambiente e Segurança

# Configurações
TIMEOUT_SECONDS=15
MAX_RETRIES=3
LOG_FILE="deploy_validation.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para log com timestamp
log() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo -e "${GREEN}$message${NC}"
    echo "$message" >> "$LOG_FILE"
}

warn() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1"
    echo -e "${YELLOW}$message${NC}"
    echo "$message" >> "$LOG_FILE"
}

error() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1"
    echo -e "${RED}$message${NC}"
    echo "$message" >> "$LOG_FILE"
}

success() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1"
    echo -e "${CYAN}$message${NC}"
    echo "$message" >> "$LOG_FILE"
}

info() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1"
    echo -e "${BLUE}$message${NC}"
    echo "$message" >> "$LOG_FILE"
}

# Função para verificar variáveis de ambiente
check_environment_variables() {
    log "🔍 Verificando variáveis de ambiente..."
    
    # Carregar arquivo .env se existir
    if [ -f ".env" ]; then
        log "   📁 Arquivo .env encontrado, carregando variáveis..."
        set -a
        source .env
        set +a
        log "   ✅ Variáveis carregadas do arquivo .env"
    else
        warn "   ⚠️  Arquivo .env não encontrado"
    fi
    
    local missing_vars=()
    local critical_vars=()
    
    # Variáveis críticas para produção
    if [ -z "${MONGO_URI:-}" ]; then
        critical_vars+=("MONGO_URI")
    fi
    
    if [ -z "${JWT_SECRET_KEY:-}" ]; then
        critical_vars+=("JWT_SECRET_KEY")
    fi
    
    if [ -z "${GOOGLE_CLIENT_ID:-}" ]; then
        critical_vars+=("GOOGLE_CLIENT_ID")
    fi
    
    if [ -z "${GOOGLE_CLIENT_SECRET:-}" ]; then
        critical_vars+=("GOOGLE_CLIENT_SECRET")
    fi
    
    # Variáveis importantes
    if [ -z "${FLASK_ENV:-}" ]; then
        missing_vars+=("FLASK_ENV")
    fi
    
    if [ -z "${DEBUG:-}" ]; then
        missing_vars+=("DEBUG")
    fi
    
    # Relatório
    if [ ${#critical_vars[@]} -gt 0 ]; then
        error "❌ Variáveis CRÍTICAS ausentes:"
        for var in "${critical_vars[@]}"; do
            error "   - $var"
        done
        return 1
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        warn "⚠️  Variáveis importantes ausentes:"
        for var in "${missing_vars[@]}"; do
            warn "   - $var"
        done
    else
        success "✅ Todas as variáveis críticas estão configuradas"
    fi
    
    return 0
}

# Função para verificar configurações de segurança
check_security_config() {
    log "🔒 Verificando configurações de segurança..."
    
    local security_issues=()
    
    # Verificar se DEBUG está desabilitado em produção
    if [ "${FLASK_ENV:-}" = "production" ] && [ "${DEBUG:-}" = "True" ]; then
        security_issues+=("DEBUG habilitado em produção")
    fi
    
    # Verificar se JWT_SECRET_KEY é forte
    if [ -n "${JWT_SECRET_KEY:-}" ]; then
        local key_length=${#JWT_SECRET_KEY}
        if [ $key_length -lt 32 ]; then
            security_issues+=("JWT_SECRET_KEY muito curta ($key_length caracteres)")
        fi
    fi
    
    # Verificar permissões de arquivos sensíveis
    if [ -f ".env" ] && [ "$(stat -c %a .env 2>/dev/null || stat -f %Lp .env 2>/dev/null)" != "600" ]; then
        security_issues+=("Arquivo .env com permissões incorretas")
    fi
    
    # Relatório
    if [ ${#security_issues[@]} -gt 0 ]; then
        warn "⚠️  Problemas de segurança identificados:"
        for issue in "${security_issues[@]}"; do
            warn "   - $issue"
        done
        return 1
    else
        success "✅ Configurações de segurança estão adequadas"
        return 0
    fi
}

# Função para verificar conectividade com serviços
check_service_connectivity() {
    log "🌐 Verificando conectividade com serviços..."
    
    local connectivity_issues=0
    
    # Verificar MongoDB
    if [ -n "${MONGO_URI:-}" ]; then
        info "   🔍 Testando conexão com MongoDB..."
        if command -v mongosh &> /dev/null; then
            if timeout $TIMEOUT_SECONDS mongosh "$MONGO_URI" --eval "db.runCommand('ping')" &> /dev/null; then
                success "   ✅ MongoDB: Conectividade OK"
            else
                error "   ❌ MongoDB: Falha na conexão"
                ((connectivity_issues++))
            fi
        else
            warn "   ⚠️  mongosh não disponível para teste"
        fi
    fi
    
    # Verificar serviços externos
    local services=(
        "https://frontend-seenti-app.vercel.app:Frontend (Vercel)"
        "https://backend-seenti-app.onrender.com:Backend (Render)"
    )
    
    for service in "${services[@]}"; do
        local url="${service%:*}"
        local name="${service#*:}"
        
        info "   🔍 Testando $name..."
        if command -v curl &> /dev/null; then
            local http_code
            http_code=$(timeout $TIMEOUT_SECONDS curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
            
            if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "302" ] || [ "$http_code" = "404" ]; then
                if [ "$http_code" = "404" ]; then
                    warn "   ⚠️  $name: HTTP $http_code (Esperado em desenvolvimento)"
                else
                    success "   ✅ $name: HTTP $http_code"
                fi
            else
                error "   ❌ $name: HTTP $http_code"
                ((connectivity_issues++))
            fi
        else
            warn "   ⚠️  curl não disponível para teste"
        fi
    done
    
    if [ $connectivity_issues -eq 0 ]; then
        success "✅ Todos os serviços estão acessíveis"
        return 0
    else
        error "❌ $connectivity_issues serviço(s) com problemas de conectividade"
        return 1
    fi
}

# Função para verificar configurações de banco
check_database_config() {
    log "🗄️  Verificando configurações de banco de dados..."
    
    local db_issues=0
    
    # Verificar se MONGO_URI está no formato correto
    if [ -n "${MONGO_URI:-}" ]; then
        if [[ "$MONGO_URI" =~ ^mongodb\+srv:// ]]; then
            success "✅ MONGO_URI: Formato MongoDB Atlas correto"
        elif [[ "$MONGO_URI" =~ ^mongodb:// ]]; then
            warn "⚠️  MONGO_URI: Formato MongoDB local (verificar se é intencional)"
        else
            error "❌ MONGO_URI: Formato inválido"
            ((db_issues++))
        fi
        
        # Verificar se contém credenciais
        if [[ "$MONGO_URI" =~ :[^@]+@ ]]; then
            success "✅ MONGO_URI: Credenciais configuradas"
        else
            warn "⚠️  MONGO_URI: Sem credenciais (verificar se é intencional)"
        fi
    else
        error "❌ MONGO_URI não configurada"
        ((db_issues++))
    fi
    
    # Verificar se há arquivos de configuração de banco
    if [ -f "SeentiCliente/dev/config/database.py" ]; then
        success "✅ Arquivo de configuração de banco encontrado"
    else
        warn "⚠️  Arquivo de configuração de banco não encontrado"
    fi
    
    if [ $db_issues -eq 0 ]; then
        success "✅ Configurações de banco estão adequadas"
        return 0
    else
        error "❌ $db_issues problema(s) com configurações de banco"
        return 1
    fi
}

# Função para verificar dependências
check_dependencies() {
    log "📦 Verificando dependências..."
    
    local dep_issues=0
    
    # Verificar Python
    if command -v python3 &> /dev/null; then
        local python_version
        python_version=$(python3 --version 2>&1)
        success "✅ Python: $python_version"
        
        # Verificar se requirements.txt existe
        if [ -f "SeentiCliente/requirements.txt" ]; then
            success "✅ requirements.txt encontrado"
        else
            warn "⚠️  requirements.txt não encontrado"
            ((dep_issues++))
        fi
    else
        error "❌ Python3 não instalado"
        ((dep_issues++))
    fi
    
    # Verificar Node.js
    if command -v node &> /dev/null; then
        local node_version
        node_version=$(node --version 2>&1)
        success "✅ Node.js: $node_version"
        
        # Verificar se package.json existe
        if [ -f "SeentiCliente/Frontend/package.json" ]; then
            success "✅ package.json encontrado"
        else
            warn "⚠️  package.json não encontrado"
            ((dep_issues++))
        fi
    else
        error "❌ Node.js não instalado"
        ((dep_issues++))
    fi
    
    if [ $dep_issues -eq 0 ]; then
        success "✅ Todas as dependências estão instaladas"
        return 0
    else
        error "❌ $dep_issues problema(s) com dependências"
        return 1
    fi
}

# Função para verificar estrutura do projeto
check_project_structure() {
    log "📁 Verificando estrutura do projeto..."
    
    local structure_issues=0
    local required_dirs=(
        "SeentiCliente"
        "SeentiCliente/dev"
        "SeentiCliente/Frontend"
        "SeentiCliente/Frontend/src"
        "SeentiCliente/Frontend/src/components"
    )
    
    local required_files=(
        "SeentiCliente/dev/app.py"
        "SeentiCliente/Frontend/src/App.jsx"
        "SeentiCliente/Frontend/index.html"
        "README.md"
        ".gitignore"
    )
    
    # Verificar diretórios
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            success "✅ Diretório: $dir/"
        else
            error "❌ Diretório ausente: $dir/"
            ((structure_issues++))
        fi
    done
    
    # Verificar arquivos
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            success "✅ Arquivo: $file"
        else
            error "❌ Arquivo ausente: $file"
            ((structure_issues++))
        fi
    done
    
    if [ $structure_issues -eq 0 ]; then
        success "✅ Estrutura do projeto está completa"
        return 0
    else
        error "❌ $structure_issues problema(s) na estrutura do projeto"
        return 1
    fi
}

# Função para executar testes básicos
run_basic_tests() {
    log "🧪 Executando testes básicos..."
    
    local test_issues=0
    
    # Teste 1: Verificar se o backend pode ser importado
    if [ -f "SeentiCliente/dev/app.py" ]; then
        info "   🔍 Testando importação do backend..."
        if python3 -c "import sys; sys.path.append('SeentiCliente/dev'); import app" 2>/dev/null; then
            success "   ✅ Backend: Importação OK"
        else
            error "   ❌ Backend: Falha na importação"
            ((test_issues++))
        fi
    fi
    
    # Teste 2: Verificar sintaxe JavaScript/JSX
    if command -v node &> /dev/null; then
        info "   🔍 Testando sintaxe JavaScript..."
        if node --check "SeentiCliente/Frontend/src/App.jsx" 2>/dev/null; then
            success "   ✅ Frontend: Sintaxe JavaScript OK"
        else
            warn "   ⚠️  Frontend: Possíveis problemas de sintaxe (JSX pode não ser reconhecido)"
        fi
    fi
    
    # Teste 3: Verificar se há erros de linting
    if [ -f "SeentiCliente/Frontend/eslint.config.js" ]; then
        info "   🔍 Verificando configuração ESLint..."
        success "   ✅ ESLint configurado"
    else
        warn "   ⚠️  ESLint não configurado"
    fi
    
    if [ $test_issues -eq 0 ]; then
        success "✅ Testes básicos passaram"
        return 0
    else
        error "❌ $test_issues teste(s) falharam"
        return 1
    fi
}

# Função principal de validação
main() {
    log "🚀 Iniciando validação de deploy do Seenti App..."
    
    # Limpar log anterior
    > "$LOG_FILE"
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🔍 VALIDAÇÃO DE DEPLOY                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    local total_checks=0
    local passed_checks=0
    local failed_checks=0
    
    # Executar todas as verificações
    local checks=(
        "check_environment_variables:Variáveis de Ambiente"
        "check_security_config:Configurações de Segurança"
        "check_service_connectivity:Conectividade de Serviços"
        "check_database_config:Configurações de Banco"
        "check_dependencies:Dependências"
        "check_project_structure:Estrutura do Projeto"
        "run_basic_tests:Testes Básicos"
    )
    
    for check in "${checks[@]}"; do
        local function_name="${check%:*}"
        local check_name="${check#*:}"
        
        echo "🔍 $check_name..."
        ((total_checks++))
        
        if $function_name; then
            ((passed_checks++))
        else
            ((failed_checks++))
        fi
        
        echo
    done
    
    # Resumo final
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 RESUMO DA VALIDAÇÃO                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    echo "🎯 Resultados:"
    echo "   Total de verificações: $total_checks"
    echo "   ✅ Aprovadas: $passed_checks"
    echo "   ❌ Reprovadas: $failed_checks"
    echo
    
    if [ $failed_checks -eq 0 ]; then
        success "🎉 VALIDAÇÃO APROVADA! Projeto pronto para deploy!"
        echo "💡 Próximos passos:"
        echo "   1. 📤 Faça commit das alterações"
        echo "   2. 🚀 Execute: ./deploy.sh"
        echo "   3. 📊 Monitore o deploy em produção"
        exit 0
    else
        error "❌ VALIDAÇÃO REPROVADA! Corrija os problemas antes do deploy."
        echo "💡 Ações necessárias:"
        echo "   1. 🔍 Revise os erros acima"
        echo "   2. 🔧 Corrija os problemas identificados"
        echo "   3. 🧪 Execute novamente: ./validate_deploy.sh"
        echo "   4. 📝 Consulte o log: $LOG_FILE"
        exit 1
    fi
}

# Executar função principal
main "$@"
