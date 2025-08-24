#!/bin/bash

echo "🔍 VERIFICANDO STATUS DO PROJETO SEENTI"
echo "========================================"

# Verificar MongoDB
echo "📊 MongoDB:"
if pgrep -f "mongod" > /dev/null; then
    echo "   ✅ Rodando"
else
    echo "   ❌ Parado"
fi

# Verificar Backend
echo "🌐 Backend Flask:"
if lsof -i :5001 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -ti :5001 | head -1)
    echo "   ✅ Rodando na porta 5001 (PID: $BACKEND_PID)"
    
    # Testar resposta
    if curl -s http://localhost:5001/ > /dev/null; then
        echo "   ✅ Respondendo corretamente"
    else
        echo "   ⚠️ Porta aberta mas não respondendo"
    fi
else
    echo "   ❌ Parado (porta 5001 livre)"
fi

# Verificar Frontend
echo "🎨 Frontend React:"
if lsof -i :3000 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti :3000 | head -1)
    echo "   ✅ Rodando na porta 3000 (PID: $FRONTEND_PID)"
    
    # Testar resposta
    if curl -s http://localhost:3000/ > /dev/null; then
        echo "   ✅ Respondendo corretamente"
    else
        echo "   ⚠️ Porta aberta mas não respondendo"
    fi
elif lsof -i :5173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti :5173 | head -1)
    echo "   ✅ Rodando na porta 5173 (PID: $FRONTEND_PID) - Vite padrão"
    
    # Testar resposta
    if curl -s http://localhost:5173/ > /dev/null; then
        echo "   ✅ Respondendo corretamente"
    else
        echo "   ⚠️ Porta aberta mas não respondendo"
    fi
else
    echo "   ❌ Parado (portas 3000 e 5173 livres)"
fi

# Verificar portas conflitantes
echo "🔍 Portas em uso:"
echo "   5000: $(lsof -i :5000 2>/dev/null | wc -l) processos"
echo "   5001: $(lsof -i :5001 2>/dev/null | wc -l) processos"
echo "   3000: $(lsof -i :3000 2>/dev/null | wc -l) processos"

# Verificar containers Docker
echo "🐳 Containers Docker:"
if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(5000|5001|3000)" > /dev/null; then
    echo "   ⚠️ Containers usando portas conflitantes:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(5000|5001|3000)"
else
    echo "   ✅ Nenhum container conflitando"
fi

echo "========================================"
