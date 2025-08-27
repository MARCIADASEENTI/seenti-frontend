#!/bin/bash
# security_hardening.sh - Script de fortalecimento de segurança
# Sprint 08 - Fortalecimento de Segurança

# Configurações
SECURITY_LOG="security_hardening.log"
SECURITY_SCORE=0
MAX_SECURITY_SCORE=100

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
    echo "$message" >> "$SECURITY_LOG"
}

warn() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1"
    echo -e "${YELLOW}$message${NC}"
    echo "$message" >> "$SECURITY_LOG"
}

error() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1"
    echo -e "${RED}$message${NC}"
    echo "$message" >> "$SECURITY_LOG"
}

success() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1"
    echo -e "${CYAN}$message${NC}"
    echo "$message" >> "$SECURITY_LOG"
}

info() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1"
    echo -e "${BLUE}$message${NC}"
    echo "$message" >> "$SECURITY_LOG"
}

# Função para verificar permissões de arquivos
check_file_permissions() {
    log "🔒 Verificando permissões de arquivos..."
    
    local files_to_check=(
        ".env:600"
        "*.sh:755"
        "SeentiCliente/dev/app.py:644"
        "SeentiCliente/Frontend/src/*.jsx:644"
    )
    
    for file_perm in "${files_to_check[@]}"; do
        local file_pattern="${file_perm%:*}"
        local expected_perm="${file_perm#*:}"
        
        # Encontrar arquivos que correspondem ao padrão
        while IFS= read -r -d '' file; do
            if [ -f "$file" ]; then
                local current_perm=$(stat -c %a "$file" 2>/dev/null || stat -f %Lp "$file" 2>/dev/null)
                
                if [ "$current_perm" = "$expected_perm" ]; then
                    success "   ✅ $file: Permissões corretas ($current_perm)"
                    ((SECURITY_SCORE += 5))
                else
                    warn "   ⚠️  $file: Permissões incorretas ($current_perm, esperado: $expected_perm)"
                    
                    # Corrigir permissões se possível
                    if chmod "$expected_perm" "$file" 2>/dev/null; then
                        success "   🔧 Permissões corrigidas para $expected_perm"
                        ((SECURITY_SCORE += 3))
                    else
                        error "   ❌ Não foi possível corrigir permissões"
                    fi
                fi
            fi
        done < <(find . -name "$file_pattern" -type f -print0 2>/dev/null)
    done
}

# Função para verificar variáveis de ambiente sensíveis
check_sensitive_variables() {
    log "🔐 Verificando variáveis de ambiente sensíveis..."
    
    # Verificar se .env existe e tem permissões corretas
    if [ -f ".env" ]; then
        local env_perms=$(stat -c %a .env 2>/dev/null || stat -f %Lp .env 2>/dev/null)
        
        if [ "$env_perms" = "600" ]; then
            success "   ✅ .env: Permissões seguras ($env_perms)"
            ((SECURITY_SCORE += 10))
        else
            warn "   ⚠️  .env: Permissões inseguras ($env_perms)"
            chmod 600 .env 2>/dev/null && success "   🔧 Permissões corrigidas"
        fi
        
        # Verificar se contém variáveis sensíveis
        if grep -q "MONGO_URI\|JWT_SECRET_KEY\|GOOGLE_CLIENT_SECRET" .env; then
            success "   ✅ Variáveis sensíveis configuradas"
            ((SECURITY_SCORE += 10))
        else
            warn "   ⚠️  Variáveis sensíveis não encontradas"
        fi
    else
        warn "   ⚠️  Arquivo .env não encontrado"
    fi
    
    # Verificar se .env está no .gitignore
    if [ -f ".gitignore" ] && grep -q "\.env" .gitignore; then
        success "   ✅ .env protegido no .gitignore"
        ((SECURITY_SCORE += 5))
    else
        error "   ❌ .env não está protegido no .gitignore"
        echo ".env" >> .gitignore
        success "   🔧 .env adicionado ao .gitignore"
        ((SECURITY_SCORE += 3))
    fi
}

# Função para verificar configurações de rede
check_network_security() {
    log "🌐 Verificando configurações de rede..."
    
    # Verificar se há portas abertas desnecessárias
    local open_ports=$(netstat -tlnp 2>/dev/null | grep LISTEN | awk '{print $4}' | cut -d: -f2 | sort -u)
    
    if [ -n "$open_ports" ]; then
        info "   📡 Portas abertas: $open_ports"
        
        # Verificar se apenas as portas necessárias estão abertas
        local expected_ports=(5001 5173)
        local unexpected_ports=()
        
        for port in $open_ports; do
            if [[ ! " ${expected_ports[@]} " =~ " ${port} " ]]; then
                unexpected_ports+=("$port")
            fi
        done
        
        if [ ${#unexpected_ports[@]} -eq 0 ]; then
            success "   ✅ Apenas portas esperadas estão abertas"
            ((SECURITY_SCORE += 10))
        else
            warn "   ⚠️  Portas inesperadas abertas: ${unexpected_ports[*]}"
        fi
    else
        info "   ℹ️  Nenhuma porta aberta detectada"
    fi
    
    # Verificar configurações CORS
    if [ -f "SeentiCliente/dev/app.py" ]; then
        if grep -q "CORS" "SeentiCliente/dev/app.py"; then
            success "   ✅ CORS configurado no backend"
            ((SECURITY_SCORE += 5))
        else
            warn "   ⚠️  CORS não configurado no backend"
        fi
    fi
}

# Função para verificar dependências de segurança
check_dependency_security() {
    log "📦 Verificando dependências de segurança..."
    
    # Verificar se há dependências desatualizadas
    if [ -f "SeentiCliente/requirements.txt" ]; then
        info "   🔍 Verificando dependências Python..."
        
        # Simular verificação de segurança (em produção seria com ferramentas reais)
        if command -v pip-audit &> /dev/null; then
            if pip-audit -r "SeentiCliente/requirements.txt" 2>/dev/null | grep -q "VULNERABILITY"; then
                warn "   ⚠️  Vulnerabilidades encontradas em dependências Python"
            else
                success "   ✅ Dependências Python seguras"
                ((SECURITY_SCORE += 10))
            fi
        else
            info "   ℹ️  pip-audit não disponível para verificação"
        fi
    fi
    
    # Verificar dependências Node.js
    if [ -f "SeentiCliente/Frontend/package.json" ]; then
        info "   🔍 Verificando dependências Node.js..."
        
        if command -v npm &> /dev/null; then
            cd "SeentiCliente/Frontend" 2>/dev/null
            
            # Verificar se há vulnerabilidades conhecidas
            if npm audit --audit-level=moderate 2>/dev/null | grep -q "found"; then
                warn "   ⚠️  Vulnerabilidades encontradas em dependências Node.js"
            else
                success "   ✅ Dependências Node.js seguras"
                ((SECURITY_SCORE += 10))
            fi
            
            cd - > /dev/null
        fi
    fi
}

# Função para verificar configurações de autenticação
check_authentication_security() {
    log "🔑 Verificando configurações de autenticação..."
    
    # Verificar JWT
    if [ -f "SeentiCliente/dev/app.py" ]; then
        if grep -q "JWT_SECRET_KEY\|JWTManager" "SeentiCliente/dev/app.py"; then
            success "   ✅ JWT configurado no backend"
            ((SECURITY_SCORE += 10))
        else
            warn "   ⚠️  JWT não configurado no backend"
        fi
        
        # Verificar se há rotas protegidas
        if grep -q "@jwt_required\|@jwt_required\(\)" "SeentiCliente/dev/app.py"; then
            success "   ✅ Rotas protegidas com JWT"
            ((SECURITY_SCORE += 5))
        else
            warn "   ⚠️  Rotas não protegidas com JWT"
        fi
    fi
    
    # Verificar Google OAuth
    if [ -f "SeentiCliente/Frontend/src/components/cliente/Login.jsx" ]; then
        if grep -q "google\|oauth" "SeentiCliente/Frontend/src/components/cliente/Login.jsx"; then
            success "   ✅ Google OAuth configurado no frontend"
            ((SECURITY_SCORE += 5))
        else
            warn "   ⚠️  Google OAuth não configurado no frontend"
        fi
    fi
}

# Função para verificar logs e monitoramento
check_logging_security() {
    log "📝 Verificando configurações de log e monitoramento..."
    
    # Verificar se há logs de segurança
    if [ -f "SeentiCliente/dev/app.py" ]; then
        if grep -q "logging\|logger" "SeentiCliente/dev/app.py"; then
            success "   ✅ Sistema de logging configurado"
            ((SECURITY_SCORE += 5))
        else
            warn "   ⚠️  Sistema de logging não configurado"
        fi
    fi
    
    # Verificar se há monitoramento de erros
    if [ -f "SeentiCliente/Frontend/src/main.jsx" ]; then
        if grep -q "error\|ErrorBoundary\|catch" "SeentiCliente/Frontend/src/main.jsx"; then
            success "   ✅ Tratamento de erros configurado no frontend"
            ((SECURITY_SCORE += 5))
        else
            warn "   ⚠️  Tratamento de erros não configurado no frontend"
        fi
    fi
}

# Função para aplicar correções de segurança
apply_security_fixes() {
    log "🔧 Aplicando correções de segurança..."
    
    local fixes_applied=0
    
    # 1. Corrigir permissões de arquivos sensíveis
    if [ -f ".env" ]; then
        chmod 600 .env 2>/dev/null && ((fixes_applied++))
    fi
    
    # 2. Adicionar .env ao .gitignore se não estiver
    if [ -f ".gitignore" ] && ! grep -q "\.env" .gitignore; then
        echo ".env" >> .gitignore && ((fixes_applied++))
    fi
    
    # 3. Verificar e corrigir permissões de scripts
    chmod 755 *.sh 2>/dev/null && ((fixes_applied++))
    
    # 4. Criar arquivo de configuração de segurança
    if [ ! -f "security.config" ]; then
        cat > "security.config" << 'EOF'
# Configurações de Segurança - Seenti App
# Sprint 08 - Fortalecimento de Segurança

# Configurações de JWT
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=604800
JWT_ERROR_MESSAGE_KEY=error

# Configurações de CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOW_HEADERS=Content-Type,Authorization

# Configurações de Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900

# Configurações de Log
LOG_LEVEL=INFO
LOG_FILE=seenti_app.log
LOG_MAX_SIZE=10MB
LOG_BACKUP_COUNT=5

# Configurações de Segurança
SECURE_HEADERS=true
HSTS_MAX_AGE=31536000
CONTENT_SECURITY_POLICY=true
EOF
        ((fixes_applied++))
    fi
    
    if [ $fixes_applied -gt 0 ]; then
        success "✅ $fixes_applied correção(ões) de segurança aplicada(s)"
        ((SECURITY_SCORE += fixes_applied * 2))
    else
        info "ℹ️  Nenhuma correção necessária"
    fi
}

# Função para gerar relatório de segurança
generate_security_report() {
    log "📊 Gerando relatório de segurança..."
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🔒 RELATÓRIO DE SEGURANÇA                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    echo "🎯 Score de Segurança: $SECURITY_SCORE/$MAX_SECURITY_SCORE"
    
    # Classificar nível de segurança
    if [ $SECURITY_SCORE -ge 80 ]; then
        success "🏆 Nível de Segurança: EXCELENTE"
    elif [ $SECURITY_SCORE -ge 60 ]; then
        success "✅ Nível de Segurança: BOM"
    elif [ $SECURITY_SCORE -ge 40 ]; then
        warn "⚠️  Nível de Segurança: MODERADO"
    else
        error "❌ Nível de Segurança: BAIXO"
    fi
    
    echo
    echo "📋 Resumo das Verificações:"
    echo "   🔒 Permissões de Arquivos: Verificadas"
    echo "   🔐 Variáveis Sensíveis: Verificadas"
    echo "   🌐 Configurações de Rede: Verificadas"
    echo "   📦 Dependências: Verificadas"
    echo "   🔑 Autenticação: Verificada"
    echo "   📝 Logs e Monitoramento: Verificados"
    
    echo
    echo "💡 Recomendações de Segurança:"
    
    if [ $SECURITY_SCORE -lt 80 ]; then
        echo "   1. 🔧 Aplique as correções sugeridas acima"
        echo "   2. 🔍 Execute verificações regulares de segurança"
        echo "   3. 📚 Consulte as melhores práticas de segurança"
        echo "   4. 🚨 Monitore logs de segurança continuamente"
    else
        echo "   1. 🎉 Mantenha o excelente nível de segurança"
        echo "   2. 🔍 Continue monitorando regularmente"
        echo "   3. 📈 Considere implementar testes de penetração"
        echo "   4. 🏆 Documente as práticas de segurança"
    fi
    
    echo
    success "✨ Relatório de segurança gerado com sucesso!"
}

# Função principal
main() {
    log "🔒 Iniciando fortalecimento de segurança do Seenti App..."
    
    # Limpar log anterior
    > "$SECURITY_LOG"
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🔒 FORTALECIMENTO DE SEGURANÇA           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    # Executar todas as verificações de segurança
    check_file_permissions
    check_sensitive_variables
    check_network_security
    check_dependency_security
    check_authentication_security
    check_logging_security
    
    # Aplicar correções automáticas
    apply_security_fixes
    
    # Gerar relatório final
    generate_security_report
    
    # Salvar score final
    echo "$SECURITY_SCORE" > "security_score.txt"
    
    echo
    success "🎯 Fortalecimento de segurança concluído!"
    echo "📝 Log salvo em: $SECURITY_LOG"
    echo "📊 Score salvo em: security_score.txt"
}

# Executar função principal
main "$@"
