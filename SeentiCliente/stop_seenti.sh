#!/bin/bash

echo "🛑 PARANDO PROJETO SEENTI"
echo "=========================="

# Parar Backend
echo "🌐 Parando Backend Flask..."
if lsof -i :5001 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -ti :5001 | head -1)
    echo "   Parando processo PID: $BACKEND_PID"
    kill $BACKEND_PID 2>/dev/null
    sleep 2
    
    # Verificar se parou
    if lsof -i :5001 > /dev/null 2>&1; then
        echo "   ⚠️ Forçando parada..."
        kill -9 $BACKEND_PID 2>/dev/null
    fi
    
    echo "   ✅ Backend parado"
else
    echo "   ✅ Backend já estava parado"
fi

# Parar Frontend
echo "🎨 Parando Frontend React..."
if lsof -i :3000 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti :3000 | head -1)
    echo "   Parando processo PID: $FRONTEND_PID"
    kill $FRONTEND_PID 2>/dev/null
    sleep 2
    
    # Verificar se parou
    if lsof -i :3000 > /dev/null 2>&1; then
        echo "   ⚠️ Forçando parada..."
        kill -9 $FRONTEND_PID 2>/dev/null
    fi
    
    echo "   ✅ Frontend parado"
else
    echo "   ✅ Frontend já estava parado"
fi

# Verificar portas
echo "🔍 Verificando portas..."
if lsof -i :5001 > /dev/null 2>&1; then
    echo "   ⚠️ Porta 5001 ainda em uso"
else
    echo "   ✅ Porta 5001 livre"
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "   ⚠️ Porta 3000 ainda em uso"
else
    echo "   ✅ Porta 3000 livre"
fi

echo "=========================="
echo "✅ PROJETO SEENTI PARADO!"

