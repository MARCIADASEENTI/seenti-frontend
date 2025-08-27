#!/bin/bash
# stop_project.sh - Script para parar ambiente Seenti - VERSÃO MELHORADA
# Sprint 08 - Otimizações de Ambiente e Segurança

# Configurações de segurança
TIMEOUT_SECONDS=30
FORCE_KILL_DELAY=5

# Função para log com timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Função para limpeza de arquivos temporários
cleanup_temp_files() {
    log "🧹 Limpando arquivos temporários..."
    
    # Limpar logs antigos
    if [ -f "backend.log" ]; then
        rm -f backend.log
        log "   ✅ backend.log removido"
    fi
    
    # Limpar arquivos .pid se existirem
    find . -name "*.pid" -type f -delete 2>/dev/null && log "   ✅ Arquivos .pid removidos"
    
    # Limpar arquivos .tmp se existirem
    find . -name "*.tmp" -type f -delete 2>/dev/null && log "   ✅ Arquivos .tmp removidos"
    
    # Limpar arquivos de lock se existirem
    find . -name "*.lock" -type f -delete 2>/dev/null && log "   ✅ Arquivos .lock removidos"
}

# Função para verificar se processo realmente parou
check_process_stopped() {
    local process_name="$1"
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if ! pgrep -f "$process_name" > /dev/null; then
            return 0  # Processo parou
        fi
        
        log "   ⏳ Aguardando processo parar... (tentativa $attempt/$max_attempts)"
        sleep 1
        ((attempt++))
    done
    
    return 1  # Processo não parou
}

# Função para parar processo com timeout
stop_process_with_timeout() {
    local process_name="$1"
    local display_name="$2"
    
    if pgrep -f "$process_name" > /dev/null; then
        log "🔧 Parando $display_name..."
        
        # Tentar parada suave
        pkill -f "$process_name"
        
        # Aguardar processo parar
        if check_process_stopped "$process_name"; then
            log "   ✅ $display_name parado com sucesso"
            return 0
        else
            log "   ⚠️  $display_name não parou, forçando..."
            pkill -9 -f "$process_name" 2>/dev/null
            
            # Verificar novamente
            if check_process_stopped "$process_name"; then
                log "   ✅ $display_name forçado a parar"
                return 0
            else
                log "   ❌ Falha ao parar $display_name"
                return 1
            fi
        fi
    else
        log "   ℹ️  $display_name não estava rodando"
        return 0
    fi
}

# Função principal de parada
main() {
    log "🛑 Iniciando parada do ambiente Seenti..."
    
    # Capturar CTRL+C para parada limpa
    trap 'log "⚠️  Interrupção detectada, finalizando..."; exit 1' INT TERM
    
    # Parar processos principais
    local backend_stopped=false
    local frontend_stopped=false
    
    # Parar backend
    if stop_process_with_timeout "python3 app.py" "Backend"; then
        backend_stopped=true
    fi
    
    # Parar frontend
    if stop_process_with_timeout "vite" "Frontend"; then
        frontend_stopped=true
    fi
    
    # Parar processos Node.js relacionados
    if stop_process_with_timeout "node.*vite" "Processos Node.js"; then
        log "   ✅ Processos Node.js parados"
    fi
    
    # Verificação final
    log ""
    log "🎯 Status Final:"
    
    # Verificar backend
    if pgrep -f "python3 app.py" > /dev/null; then
        log "   Backend:  ❌ AINDA RODANDO (verificar manualmente)"
        backend_stopped=false
    else
        log "   Backend:  ✅ Parado"
        backend_stopped=true
    fi
    
    # Verificar frontend
    if pgrep -f "vite" > /dev/null; then
        log "   Frontend: ❌ AINDA RODANDO (verificar manualmente)"
        frontend_stopped=false
    else
        log "   Frontend: ✅ Parado"
        frontend_stopped=true
    fi
    
    # Limpeza de arquivos temporários
    cleanup_temp_files
    
    # Resumo final
    log ""
    if [ "$backend_stopped" = true ] && [ "$frontend_stopped" = true ]; then
        log "✅ Ambiente Seenti parado com sucesso!"
        log "🎉 Todos os processos foram encerrados corretamente"
        exit 0
    else
        log "⚠️  Ambiente parcialmente parado"
        log "🔍 Verifique manualmente os processos restantes"
        exit 1
    fi
}

# Executar função principal
main "$@"


