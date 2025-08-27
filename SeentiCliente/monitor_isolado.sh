#!/bin/bash

# 📊 SCRIPT DE MONITORAMENTO ISOLADO
# 🔍 Monitora processos sem interferir

echo "📊 MONITORAMENTO ISOLADO:"
echo "🔍 Verificando status dos processos..."
echo ""

# Função para mostrar status de um processo
show_process_status() {
    local name=$1
    local pattern=$2
    
    echo "🔍 $name:"
    if pgrep -f "$pattern" > /dev/null; then
        local pid=$(pgrep -f "$pattern")
        echo "   ✅ ATIVO - PID: $pid"
        echo "   📊 Uso de memória:"
        ps -p $pid -o pid,ppid,cmd,%mem,%cpu --no-headers 2>/dev/null || echo "   ❌ Não foi possível obter detalhes"
    else
        echo "   ❌ INATIVO"
    fi
    echo ""
}

# Verificar Flask
show_process_status "Flask (Backend)" "python3 app.py"

# Verificar Vite
show_process_status "Vite (Frontend)" "vite"

# Verificar npm
show_process_status "npm run dev" "npm run dev"

# Verificar portas em uso
echo "🌐 PORTAS EM USO:"
echo "   Porta 5001 (Flask):"
if lsof -i :5001 > /dev/null 2>&1; then
    lsof -i :5001 | grep LISTEN || echo "   ❌ Nenhum processo usando"
else
    echo "   ❌ Porta livre"
fi

echo "   Porta 3000 (Vite):"
if lsof -i :3000 > /dev/null 2>&1; then
    lsof -i :3000 | grep LISTEN || echo "   ❌ Nenhum processo usando"
else
    echo "   ❌ Porta livre"
fi

echo ""
echo "📝 LOGS DISPONÍVEIS:"
echo "   Flask: logs/flask.log"
echo "   Vite: logs/vite.log"
echo ""
echo "🔍 Para logs em tempo real:"
echo "   tail -f logs/flask.log  # Flask"
echo "   tail -f logs/vite.log   # Vite" 