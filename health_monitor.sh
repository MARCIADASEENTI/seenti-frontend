#!/bin/bash
# health_monitor.sh - Sistema de monitoramento contínuo
# Sprint 08 - Sistema de Monitoramento

# Configurações
MONITOR_LOG="health_monitor.log"
ALERT_LOG="alerts.log"
CONFIG_FILE="monitor.config"
CHECK_INTERVAL=300  # 5 minutos
MAX_FAILURES=3
ALERT_EMAIL="admin@seenti.com.br"
ALERT_SLACK_WEBHOOK=""

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
    echo "$message" >> "$MONITOR_LOG"
}

warn() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1"
    echo -e "${YELLOW}$message${NC}"
    echo "$message" >> "$MONITOR_LOG"
}

error() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1"
    echo -e "${RED}$message${NC}"
    echo "$message" >> "$MONITOR_LOG"
}

success() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1"
    echo -e "${CYAN}$message${NC}"
    echo "$message" >> "$MONITOR_LOG"
}

info() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1"
    echo -e "${BLUE}$message${NC}"
    echo "$message" >> "$MONITOR_LOG"
}

# Função para carregar configuração
load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
        success "✅ Configuração carregada: $CONFIG_FILE"
    else
        warn "⚠️  Arquivo de configuração não encontrado, usando padrões"
        create_default_config
    fi
}

# Função para criar configuração padrão
create_default_config() {
    cat > "$CONFIG_FILE" << 'EOF'
# Configuração de Monitoramento - Seenti App
# Sprint 08 - Sistema de Monitoramento

# Configurações de Health Check
CHECK_INTERVAL=300
MAX_FAILURES=3
ENABLE_EMAIL_ALERTS=true
ENABLE_SLACK_ALERTS=false

# URLs para monitoramento
FRONTEND_URL="https://frontend-seenti-app.vercel.app"
BACKEND_URL="https://backend-seenti-app.onrender.com"
MONGODB_URL="mongodb+srv://App_mdb:nJkn86jYvUjlwpJ@ps-terapia.8dgyy1d.mongodb.net/seenti_db"

# Configurações de alerta
ALERT_EMAIL="admin@seenti.com.br"
ALERT_SLACK_WEBHOOK=""

# Thresholds de performance
RESPONSE_TIME_THRESHOLD=5000  # 5 segundos
MEMORY_THRESHOLD=80           # 80%
DISK_THRESHOLD=90             # 90%

# Configurações de log
LOG_RETENTION_DAYS=30
LOG_LEVEL="INFO"
EOF
    success "✅ Configuração padrão criada: $CONFIG_FILE"
}

# Função para health check do frontend
check_frontend_health() {
    local url="${FRONTEND_URL:-https://frontend-seenti-app.vercel.app}"
    local start_time=$(date +%s%N)
    
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$url" 2>/dev/null || echo "000")
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        if [ $response_time -lt ${RESPONSE_TIME_THRESHOLD:-5000} ]; then
            success "🎨 Frontend: Online (HTTP $http_code, ${response_time}ms)"
            return 0
        else
            warn "🎨 Frontend: Lento (HTTP $http_code, ${response_time}ms)"
            return 1
        fi
    else
        error "🎨 Frontend: Offline (HTTP $http_code)"
        return 1
    fi
}

# Função para health check do backend
check_backend_health() {
    local url="${BACKEND_URL:-https://backend-seenti-app.onrender.com}"
    local start_time=$(date +%s%N)
    
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$url" 2>/dev/null || echo "000")
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        if [ $response_time -lt ${RESPONSE_TIME_THRESHOLD:-5000} ]; then
            success "🔧 Backend: Online (HTTP $http_code, ${response_time}ms)"
            return 0
        else
            warn "🔧 Backend: Lento (HTTP $http_code, ${response_time}ms)"
            return 1
        fi
    else
        error "🔧 Backend: Offline (HTTP $http_code)"
        return 1
    fi
}

# Função para health check do banco de dados
check_database_health() {
    local url="${MONGODB_URL:-mongodb+srv://App_mdb:nJkn86jYvUjlwpJ@ps-terapia.8dgyy1d.mongodb.net/seenti_db}"
    
    if command -v mongosh &> /dev/null; then
        if timeout 10 mongosh "$url" --eval "db.runCommand('ping')" &> /dev/null; then
            success "🗄️  MongoDB: Conectividade OK"
            return 0
        else
            error "🗄️  MongoDB: Falha na conexão"
            return 1
        fi
    else
        warn "🗄️  mongosh não disponível para teste de MongoDB"
        return 0  # Não falha se a ferramenta não estiver disponível
    fi
}

# Função para verificar recursos do sistema
check_system_resources() {
    log "💻 Verificando recursos do sistema..."
    
    # Verificar espaço em disco
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    local disk_available=$(df -h . | tail -1 | awk '{print $4}')
    
    if [ "$disk_usage" -lt "${DISK_THRESHOLD:-90}" ]; then
        success "   💾 Disco: $disk_usage% usado, $disk_available disponível"
    else
        warn "   💾 Disco: $disk_usage% usado, $disk_available disponível (CRÍTICO)"
        return 1
    fi
    
    # Verificar memória
    if command -v free &> /dev/null; then
        local memory_total=$(free -m | grep Mem | awk '{print $2}')
        local memory_used=$(free -m | grep Mem | awk '{print $3}')
        local memory_percent=$(( memory_used * 100 / memory_total ))
        
        if [ "$memory_percent" -lt "${MEMORY_THRESHOLD:-80}" ]; then
            success "   🧠 Memória: $memory_percent% usado (${memory_used}MB/${memory_total}MB)"
        else
            warn "   🧠 Memória: $memory_percent% usado (${memory_used}MB/${memory_total}MB) (ALTO)"
            return 1
        fi
    fi
    
    # Verificar processos
    local backend_processes=$(pgrep -f "python3 app.py" | wc -l)
    local frontend_processes=$(pgrep -f "vite" | wc -l)
    
    if [ "$backend_processes" -gt 0 ]; then
        success "   🔧 Backend: $backend_processes processo(s) rodando"
    else
        warn "   🔧 Backend: Nenhum processo rodando"
    fi
    
    if [ "$frontend_processes" -gt 0 ]; then
        success "   🎨 Frontend: $frontend_processes processo(s) rodando"
    else
        warn "   🎨 Frontend: Nenhum processo rodando"
    fi
    
    return 0
}

# Função para verificar funcionalidades críticas
check_critical_functionality() {
    log "🧪 Verificando funcionalidades críticas..."
    
    local critical_checks=0
    local total_checks=0
    
    # 1. Verificar se o backend pode ser importado
    if [ -f "SeentiCliente/dev/app.py" ]; then
        ((total_checks++))
        if python3 -c "import sys; sys.path.append('SeentiCliente/dev'); import app" 2>/dev/null; then
            success "   ✅ Backend: Importação OK"
            ((critical_checks++))
        else
            error "   ❌ Backend: Falha na importação"
        fi
    fi
    
    # 2. Verificar se há arquivos críticos
    local critical_files=(
        "SeentiCliente/dev/app.py"
        "SeentiCliente/Frontend/src/App.jsx"
        ".env"
        "SeentiCliente/requirements.txt"
        "SeentiCliente/Frontend/package.json"
    )
    
    for file in "${critical_files[@]}"; do
        ((total_checks++))
        if [ -f "$file" ]; then
            success "   ✅ $file: Presente"
            ((critical_checks++))
        else
            error "   ❌ $file: Ausente"
        fi
    done
    
    # Calcular percentual de sucesso
    local success_rate=$(( critical_checks * 100 / total_checks ))
    
    if [ $success_rate -ge 80 ]; then
        success "   🎯 Funcionalidades críticas: $success_rate% OK"
        return 0
    else
        warn "   ⚠️  Funcionalidades críticas: $success_rate% OK"
        return 1
    fi
}

# Função para enviar alertas
send_alert() {
    local alert_type="$1"
    local message="$2"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    
    # Log do alerta
    echo "[$timestamp] $alert_type: $message" >> "$ALERT_LOG"
    
    # Alerta por email (se configurado)
    if [ "${ENABLE_EMAIL_ALERTS:-true}" = "true" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "ALERTA SEENTI: $alert_type" "$ALERT_EMAIL" 2>/dev/null
        info "📧 Alerta enviado por email"
    fi
    
    # Alerta por Slack (se configurado)
    if [ "${ENABLE_SLACK_WEBHOOK:-false}" = "true" ] && [ -n "$ALERT_SLACK_WEBHOOK" ]; then
        local slack_payload="{\"text\":\"🚨 ALERTA SEENTI: $alert_type - $message\"}"
        curl -X POST -H 'Content-type: application/json' --data "$slack_payload" "$ALERT_SLACK_WEBHOOK" 2>/dev/null
        info "💬 Alerta enviado para Slack"
    fi
}

# Função para executar health check completo
run_health_check() {
    local check_time=$(date +'%Y-%m-%d %H:%M:%S')
    local failures=0
    local total_checks=0
    
    log "🏥 Executando health check completo..."
    
    # 1. Frontend
    ((total_checks++))
    if check_frontend_health; then
        success "✅ Frontend: Health check aprovado"
    else
        ((failures++))
        send_alert "FRONTEND_OFFLINE" "Frontend não está respondendo"
    fi
    
    # 2. Backend
    ((total_checks++))
    if check_backend_health; then
        success "✅ Backend: Health check aprovado"
    else
        ((failures++))
        send_alert "BACKEND_OFFLINE" "Backend não está respondendo"
    fi
    
    # 3. Banco de dados
    ((total_checks++))
    if check_database_health; then
        success "✅ MongoDB: Health check aprovado"
    else
        ((failures++))
        send_alert "DATABASE_OFFLINE" "MongoDB não está respondendo"
    fi
    
    # 4. Recursos do sistema
    ((total_checks++))
    if check_system_resources; then
        success "✅ Sistema: Health check aprovado"
    else
        ((failures++))
        send_alert "SYSTEM_RESOURCES" "Recursos do sistema em estado crítico"
    fi
    
    # 5. Funcionalidades críticas
    ((total_checks++))
    if check_critical_functionality; then
        success "✅ Funcionalidades: Health check aprovado"
    else
        ((failures++))
        send_alert "CRITICAL_FUNCTIONALITY" "Funcionalidades críticas com problemas"
    fi
    
    # Resumo do health check
    local success_rate=$(( (total_checks - failures) * 100 / total_checks ))
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 RESUMO DO HEALTH CHECK                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    echo "🎯 Resultados:"
    echo "   Total de verificações: $total_checks"
    echo "   ✅ Aprovadas: $((total_checks - failures))"
    echo "   ❌ Reprovadas: $failures"
    echo "   📊 Taxa de Sucesso: $success_rate%"
    
    # Classificar status geral
    if [ $success_rate -ge 90 ]; then
        success "🏆 Status Geral: EXCELENTE"
    elif [ $success_rate -ge 70 ]; then
        success "✅ Status Geral: BOM"
    elif [ $success_rate -ge 50 ]; then
        warn "⚠️  Status Geral: MODERADO"
    else
        error "❌ Status Geral: CRÍTICO"
    fi
    
    # Salvar métricas
    echo "$check_time,$total_checks,$failures,$success_rate" >> "health_metrics.csv"
    
    return $failures
}

# Função para monitoramento contínuo
continuous_monitoring() {
    log "🔄 Iniciando monitoramento contínuo..."
    
    local consecutive_failures=0
    
    while true; do
        log "⏰ Executando health check programado..."
        
        if run_health_check; then
            consecutive_failures=0
            success "✅ Health check bem-sucedido, aguardando próximo ciclo..."
        else
            ((consecutive_failures++))
            warn "⚠️  Health check falhou ($consecutive_failures/$MAX_FAILURES)"
            
            if [ $consecutive_failures -ge $MAX_FAILURES ]; then
                error "🚨 CRÍTICO: $consecutive_failures falhas consecutivas!"
                send_alert "CRITICAL_FAILURE" "Sistema com $consecutive_failures falhas consecutivas"
                consecutive_failures=0  # Reset para evitar spam
            fi
        fi
        
        log "⏳ Aguardando $CHECK_INTERVAL segundos para próximo health check..."
        sleep $CHECK_INTERVAL
    done
}

# Função para mostrar status atual
show_status() {
    log "📊 Mostrando status atual do sistema..."
    
    echo
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 STATUS DO SISTEMA                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo
    
    # Executar health check único
    run_health_check
    
    echo
    echo "📈 Métricas históricas:"
    if [ -f "health_metrics.csv" ]; then
        echo "   📊 Total de registros: $(wc -l < health_metrics.csv)"
        echo "   📅 Última verificação: $(tail -1 health_metrics.csv | cut -d',' -f1)"
    else
        echo "   ℹ️  Nenhuma métrica histórica disponível"
    fi
    
    echo
    echo "🔔 Alertas:"
    if [ -f "$ALERT_LOG" ]; then
        echo "   📝 Total de alertas: $(wc -l < "$ALERT_LOG")"
        echo "   🚨 Último alerta: $(tail -1 "$ALERT_LOG" 2>/dev/null || echo "Nenhum")"
    else
        echo "   ℹ️  Nenhum alerta registrado"
    fi
}

# Função principal
main() {
    log "🏥 Iniciando Sistema de Monitoramento Seenti..."
    
    # Verificar argumentos
    case "${1:-}" in
        "status")
            load_config
            show_status
            ;;
        "continuous"|"")
            load_config
            continuous_monitoring
            ;;
        "config")
            create_default_config
            ;;
        *)
            echo "Uso: $0 [status|continuous|config]"
            echo "  status     - Mostrar status atual"
            echo "  continuous - Iniciar monitoramento contínuo (padrão)"
            echo "  config     - Criar configuração padrão"
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"
