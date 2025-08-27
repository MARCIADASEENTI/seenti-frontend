#!/bin/bash
# seenti_ecosystem.sh - Sistema Integrado de Gerenciamento Seenti
# Sprint 08 - Estratégia Completa de Ambiente e Segurança

# Configurações
ECOSYSTEM_LOG="seenti_ecosystem.log"
CONFIG_FILE="ecosystem.config"
BACKUP_DIR="backups/ecosystem"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Função para log com timestamp
log() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo -e "${GREEN}$message${NC}"
    echo "$message" >> "$ECOSYSTEM_LOG"
}

warn() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1"
    echo -e "${YELLOW}$message${NC}"
    echo "$message" >> "$ECOSYSTEM_LOG"
}

error() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1"
    echo -e "${RED}$message${NC}"
    echo "$message" >> "$ECOSYSTEM_LOG"
}

success() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1"
    echo -e "${CYAN}$message${NC}"
    echo "$message" >> "$ECOSYSTEM_LOG"
}

info() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1"
    echo -e "${BLUE}$message${NC}"
    echo "$message" >> "$ECOSYSTEM_LOG"
}

highlight() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo -e "${PURPLE}$message${NC}"
    echo "$message" >> "$ECOSYSTEM_LOG"
}

# Função para mostrar banner
show_banner() {
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 ECOSISTEMA SEENTI                     ║"
    echo "║                Sprint 08 - Sistema Integrado                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
}

# Função para mostrar menu principal
show_main_menu() {
    echo "🎯 MENU PRINCIPAL - ECOSISTEMA SEENTI:"
    echo
    echo "🔧 GESTÃO DE AMBIENTE:"
    echo "   1. 🚀 Iniciar ambiente completo"
    echo "   2. 🛑 Parar ambiente completo"
    echo "   3. 📊 Status do ambiente"
    echo "   4. 🧹 Limpeza de ambiente"
    echo
    echo "🔒 SEGURANÇA E VALIDAÇÃO:"
    echo "   5. 🔒 Fortalecimento de segurança"
    echo "   6. ✅ Validação pré-deploy"
    echo "   7. 🚀 Deploy seguro"
    echo
    echo "📊 MONITORAMENTO:"
    echo "   8. 🏥 Health check completo"
    echo "   9. 🔄 Monitoramento contínuo"
    echo "   10. 📈 Relatórios e métricas"
    echo
    echo "⚙️ CONFIGURAÇÃO E MANUTENÇÃO:"
    echo "   11. ⚙️ Configurar ecossistema"
    echo "   12. 💾 Backup completo"
    echo "   13. 🔄 Restaurar backup"
    echo "   14. 📚 Documentação e ajuda"
    echo
    echo "   0. 🚪 Sair"
    echo
}

# Função para gerenciar ambiente
manage_environment() {
    local choice="$1"
    
    case "$choice" in
        "1")
            log "🚀 Iniciando ambiente completo..."
            if [ -f "./start_project.sh" ]; then
                ./start_project.sh
            else
                error "❌ Script start_project.sh não encontrado"
            fi
            ;;
        "2")
            log "🛑 Parando ambiente completo..."
            if [ -f "./stop_project.sh" ]; then
                ./stop_project.sh
            else
                error "❌ Script stop_project.sh não encontrado"
            fi
            ;;
        "3")
            log "📊 Verificando status do ambiente..."
            if [ -f "./status.sh" ]; then
                ./status.sh
            else
                error "❌ Script status.sh não encontrado"
            fi
            ;;
        "4")
            log "🧹 Executando limpeza de ambiente..."
            if [ -f "./cleanup_environment.sh" ]; then
                ./cleanup_environment.sh
            else
                error "❌ Script cleanup_environment.sh não encontrado"
            fi
            ;;
        *)
            error "❌ Opção inválida para gerenciamento de ambiente"
            ;;
    esac
}

# Função para gerenciar segurança e validação
manage_security_validation() {
    local choice="$1"
    
    case "$choice" in
        "5")
            log "🔒 Executando fortalecimento de segurança..."
            if [ -f "./security_hardening.sh" ]; then
                ./security_hardening.sh
            else
                error "❌ Script security_hardening.sh não encontrado"
            fi
            ;;
        "6")
            log "✅ Executando validação pré-deploy..."
            if [ -f "./validate_deploy.sh" ]; then
                ./validate_deploy.sh
            else
                error "❌ Script validate_deploy.sh não encontrado"
            fi
            ;;
        "7")
            log "🚀 Executando deploy seguro..."
            if [ -f "./deploy_seguro.sh" ]; then
                ./deploy_seguro.sh
            else
                error "❌ Script deploy_seguro.sh não encontrado"
            fi
            ;;
        *)
            error "❌ Opção inválida para segurança e validação"
            ;;
    esac
}

# Função para gerenciar monitoramento
manage_monitoring() {
    local choice="$1"
    
    case "$choice" in
        "8")
            log "🏥 Executando health check completo..."
            if [ -f "./health_monitor.sh" ]; then
                ./health_monitor.sh status
            else
                error "❌ Script health_monitor.sh não encontrado"
            fi
            ;;
        "9")
            log "🔄 Iniciando monitoramento contínuo..."
            if [ -f "./health_monitor.sh" ]; then
                ./health_monitor.sh continuous
            else
                error "❌ Script health_monitor.sh não encontrado"
            fi
            ;;
        "10")
            log "📈 Gerando relatórios e métricas..."
            generate_reports
            ;;
        *)
            error "❌ Opção inválida para monitoramento"
            ;;
    esac
}

# Função para gerenciar configuração e manutenção
manage_config_maintenance() {
    local choice="$1"
    
    case "$choice" in
        "11")
            log "⚙️ Configurando ecossistema..."
            configure_ecosystem
            ;;
        "12")
            log "💾 Criando backup completo..."
            create_complete_backup
            ;;
        "13")
            log "🔄 Restaurando backup..."
            restore_backup
            ;;
        "14")
            log "📚 Mostrando documentação e ajuda..."
            show_help
            ;;
        *)
            error "❌ Opção inválida para configuração e manutenção"
            ;;
    esac
}

# Função para gerar relatórios
generate_reports() {
    log "📊 Gerando relatórios integrados..."
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 RELATÓRIOS INTEGRADOS                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    # 1. Status do sistema
    echo "🔍 Status do Sistema:"
    if [ -f "./status.sh" ]; then
        ./status.sh | head -20
    else
        echo "   ⚠️  Script status.sh não disponível"
    fi
    
    echo
    
    # 2. Score de segurança
    echo "🔒 Score de Segurança:"
    if [ -f "security_score.txt" ]; then
        local security_score=$(cat security_score.txt)
        echo "   🎯 Score atual: $security_score/100"
        
        if [ "$security_score" -ge 80 ]; then
            echo "   🏆 Nível: EXCELENTE"
        elif [ "$security_score" -ge 60 ]; then
            echo "   ✅ Nível: BOM"
        else
            echo "   ⚠️  Nível: PRECISA MELHORAR"
        fi
    else
        echo "   ⚠️  Score de segurança não disponível"
    fi
    
    echo
    
    # 3. Métricas de health check
    echo "🏥 Métricas de Health Check:"
    if [ -f "health_metrics.csv" ]; then
        local total_checks=$(wc -l < health_metrics.csv)
        local last_check=$(tail -1 health_metrics.csv 2>/dev/null | cut -d',' -f1 || echo "Nenhum")
        echo "   📊 Total de verificações: $total_checks"
        echo "   📅 Última verificação: $last_check"
    else
        echo "   ⚠️  Métricas de health check não disponíveis"
    fi
    
    echo
    
    # 4. Espaço em disco
    echo "💾 Espaço em Disco:"
    local disk_info=$(df -h . | tail -1)
    local disk_usage=$(echo "$disk_info" | awk '{print $5}')
    local disk_available=$(echo "$disk_info" | awk '{print $4}')
    echo "   📊 Uso atual: $disk_usage"
    echo "   💾 Disponível: $disk_available"
    
    success "✅ Relatórios gerados com sucesso!"
}

# Função para configurar ecossistema
configure_ecosystem() {
    log "⚙️ Configurando ecossistema Seenti..."
    
    if [ ! -f "$CONFIG_FILE" ]; then
        cat > "$CONFIG_FILE" << 'EOF'
# Configuração do Ecossistema Seenti
# Sprint 08 - Sistema Integrado

# Configurações de Ambiente
ENVIRONMENT_MODE="development"
AUTO_START=false
AUTO_MONITORING=true
BACKUP_RETENTION_DAYS=30

# Configurações de Segurança
SECURITY_SCAN_INTERVAL=3600
AUTO_SECURITY_UPDATES=true
SECURITY_ALERTS=true

# Configurações de Monitoramento
HEALTH_CHECK_INTERVAL=300
MONITORING_ENABLED=true
ALERT_EMAIL="admin@seenti.com.br"

# Configurações de Deploy
DEPLOY_AUTO_VALIDATION=true
DEPLOY_BACKUP_BEFORE=true
DEPLOY_ROLLBACK_AUTO=true

# Configurações de Log
LOG_LEVEL="INFO"
LOG_RETENTION_DAYS=30
LOG_COMPRESSION=true
EOF
        success "✅ Arquivo de configuração criado: $CONFIG_FILE"
    else
        success "✅ Arquivo de configuração já existe: $CONFIG_FILE"
    fi
    
    echo
    echo "💡 Para personalizar as configurações:"
    echo "   - Edite o arquivo: $CONFIG_FILE"
    echo "   - Reinicie o ecossistema para aplicar mudanças"
}

# Função para criar backup completo
create_complete_backup() {
    log "💾 Criando backup completo do ecossistema..."
    
    mkdir -p "$BACKUP_DIR"
    
    local backup_name="ecosystem_backup_$(date +'%Y%m%d_%H%M%S').tar.gz"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    # Criar backup de todos os arquivos importantes
    tar -czf "$backup_path" \
        --exclude='node_modules' \
        --exclude='__pycache__' \
        --exclude='*.log' \
        --exclude='.git' \
        --exclude='backups' \
        SeentiCliente/ \
        *.sh \
        *.md \
        *.config \
        .env \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        local backup_size=$(du -h "$backup_path" | cut -f1)
        success "✅ Backup criado com sucesso: $backup_name"
        echo "   📦 Tamanho: $backup_size"
        echo "   📍 Localização: $backup_path"
        
        # Salvar referência do último backup
        echo "$backup_path" > "$BACKUP_DIR/latest_backup.txt"
    else
        error "❌ Falha ao criar backup"
    fi
}

# Função para restaurar backup
restore_backup() {
    log "🔄 Restaurando backup..."
    
    if [ ! -f "$BACKUP_DIR/latest_backup.txt" ]; then
        error "❌ Nenhum backup disponível para restauração"
        return 1
    fi
    
    local backup_path=$(cat "$BACKUP_DIR/latest_backup.txt")
    
    if [ ! -f "$backup_path" ]; then
        error "❌ Arquivo de backup não encontrado: $backup_path"
        return 1
    fi
    
    echo "⚠️  ATENÇÃO: Esta operação irá sobrescrever arquivos existentes!"
    echo "   📦 Backup: $(basename "$backup_path")"
    echo "   📍 Caminho: $backup_path"
    echo
    read -p "🤔 Confirma a restauração? (s/N): " confirm
    
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
        log "🔄 Iniciando restauração..."
        
        # Parar ambiente se estiver rodando
        if [ -f "./stop_project.sh" ]; then
            ./stop_project.sh > /dev/null 2>&1
        fi
        
        # Restaurar backup
        tar -xzf "$backup_path" -C . 2>/dev/null
        
        if [ $? -eq 0 ]; then
            success "✅ Backup restaurado com sucesso!"
            echo "   🔄 Sistema restaurado para o estado do backup"
            echo "   💡 Reinicie o ambiente se necessário"
        else
            error "❌ Falha na restauração do backup"
        fi
    else
        info "🔄 Restauração cancelada pelo usuário"
    fi
}

# Função para mostrar ajuda
show_help() {
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📚 AJUDA E DOCUMENTAÇÃO                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    echo "🚀 ECOSISTEMA SEENTI - SPRINT 08"
    echo "   Sistema integrado de gerenciamento completo"
    echo
    
    echo "📋 FUNCIONALIDADES PRINCIPAIS:"
    echo "   🔧 GESTÃO DE AMBIENTE: Controle completo do ambiente de desenvolvimento"
    echo "   🔒 SEGURANÇA: Fortalecimento e validação automática"
    echo "   📊 MONITORAMENTO: Health checks e alertas em tempo real"
    echo "   🚀 DEPLOY: Sistema seguro com rollback automático"
    echo
    
    echo "📁 ARQUIVOS IMPORTANTES:"
    echo "   • start_project.sh - Inicia ambiente completo"
    echo "   • stop_project.sh - Para ambiente com limpeza"
    echo "   • status.sh - Status detalhado do sistema"
    echo "   • security_hardening.sh - Fortalecimento de segurança"
    echo "   • validate_deploy.sh - Validação pré-deploy"
    echo "   • deploy_seguro.sh - Deploy seguro com staging"
    echo "   • health_monitor.sh - Monitoramento contínuo"
    echo "   • cleanup_environment.sh - Limpeza de ambiente"
    echo
    
    echo "💡 DICAS DE USO:"
    echo "   • Execute sempre a validação antes do deploy"
    echo "   • Monitore regularmente com health checks"
    echo "   • Mantenha backups atualizados"
    echo "   • Verifique o score de segurança periodicamente"
    echo
    
    echo "🔗 DOCUMENTAÇÃO COMPLETA:"
    echo "   📁 SeentiCliente/Docs/Sprint 08/"
    echo "   📊 Controle de tarefas e implementações"
    echo
}

# Função para executar verificação completa do ecossistema
ecosystem_health_check() {
    log "🏥 Executando verificação completa do ecossistema..."
    
    local ecosystem_score=0
    local max_score=100
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🏥 VERIFICAÇÃO DO ECOSISTEMA              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    # 1. Verificar scripts essenciais
    local essential_scripts=(
        "start_project.sh"
        "stop_project.sh"
        "status.sh"
        "security_hardening.sh"
        "validate_deploy.sh"
        "deploy_seguro.sh"
        "health_monitor.sh"
        "cleanup_environment.sh"
    )
    
    local scripts_found=0
    for script in "${essential_scripts[@]}"; do
        if [ -f "$script" ] && [ -x "$script" ]; then
            success "✅ $script: Disponível e executável"
            ((scripts_found++))
        else
            error "❌ $script: Não disponível ou não executável"
        fi
    done
    
    local scripts_score=$(( scripts_found * 100 / ${#essential_scripts[@]} ))
    ecosystem_score=$(( ecosystem_score + scripts_score * 30 / 100 ))
    
    echo
    echo "📊 Scripts Essenciais: $scripts_found/${#essential_scripts[@]} ($scripts_score%)"
    
    # 2. Verificar configurações
    local config_files=(
        ".env"
        "monitor.config"
        "ecosystem.config"
    )
    
    local configs_found=0
    for config in "${config_files[@]}"; do
        if [ -f "$config" ]; then
            success "✅ $config: Configurado"
            ((configs_found++))
        else
            warn "⚠️  $config: Não configurado"
        fi
    done
    
    local config_score=$(( configs_found * 100 / ${#config_files[@]} ))
    ecosystem_score=$(( ecosystem_score + config_score * 20 / 100 ))
    
    echo
    echo "📊 Configurações: $configs_found/${#config_files[@]} ($config_score%)"
    
    # 3. Verificar ambiente
    local env_score=0
    if [ -d "SeentiCliente" ] && [ -d "SeentiCliente/Frontend" ] && [ -d "SeentiCliente/dev" ]; then
        success "✅ Estrutura do projeto: Completa"
        env_score=100
    else
        error "❌ Estrutura do projeto: Incompleta"
        env_score=0
    fi
    
    ecosystem_score=$(( ecosystem_score + env_score * 30 / 100 ))
    
    echo
    echo "📊 Estrutura do Projeto: $env_score%"
    
    # 4. Verificar segurança
    local security_score=0
    if [ -f "security_score.txt" ]; then
        security_score=$(cat security_score.txt)
        if [ "$security_score" -ge 80 ]; then
            success "✅ Segurança: Excelente ($security_score/100)"
        elif [ "$security_score" -ge 60 ]; then
            success "✅ Segurança: Boa ($security_score/100)"
        else
            warn "⚠️  Segurança: Precisa melhorar ($security_score/100)"
        fi
    else
        warn "⚠️  Score de segurança não disponível"
        security_score=50
    fi
    
    ecosystem_score=$(( ecosystem_score + security_score * 20 / 100 ))
    
    echo
    echo "📊 Segurança: $security_score/100"
    
    # Resumo final
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 RESUMO DO ECOSISTEMA                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    echo "🎯 Score Geral do Ecossistema: $ecosystem_score/$max_score"
    
    # Classificar status
    if [ $ecosystem_score -ge 90 ]; then
        success "🏆 Status: EXCELENTE - Ecossistema funcionando perfeitamente!"
    elif [ $ecosystem_score -ge 70 ]; then
        success "✅ Status: BOM - Ecossistema funcionando bem"
    elif [ $ecosystem_score -ge 50 ]; then
        warn "⚠️  Status: MODERADO - Algumas melhorias necessárias"
    else
        error "❌ Status: CRÍTICO - Muitas correções necessárias"
    fi
    
    # Salvar score
    echo "$ecosystem_score" > "ecosystem_score.txt"
    
    return $ecosystem_score
}

# Função principal
main() {
    log "🚀 Iniciando Ecossistema Seenti..."
    
    # Limpar log anterior
    > "$ECOSYSTEM_LOG"
    
    show_banner
    
    # Verificar se é primeira execução
    if [ ! -f "$CONFIG_FILE" ]; then
        log "⚙️ Primeira execução detectada, configurando ecossistema..."
        configure_ecosystem
    fi
    
    # Loop principal do menu
    while true; do
        show_main_menu
        
        read -p "🎯 Escolha uma opção (0-14): " choice
        
        case "$choice" in
            "0")
                log "🚪 Saindo do ecossistema..."
                success "👋 Obrigado por usar o Ecossistema Seenti!"
                exit 0
                ;;
            [1-4])
                manage_environment "$choice"
                ;;
            [5-7])
                manage_security_validation "$choice"
                ;;
            [8-10])
                manage_monitoring "$choice"
                ;;
            [11-14])
                manage_config_maintenance "$choice"
                ;;
            *)
                error "❌ Opção inválida: $choice"
                ;;
        esac
        
        echo
        read -p "⏳ Pressione ENTER para continuar..."
        echo
    done
}

# Verificar argumentos especiais
case "${1:-}" in
    "health")
        ecosystem_health_check
        ;;
    "help")
        show_help
        ;;
    "config")
        configure_ecosystem
        ;;
    "backup")
        create_complete_backup
        ;;
    "restore")
        restore_backup
        ;;
    "reports")
        generate_reports
        ;;
    *)
        main
        ;;
esac
