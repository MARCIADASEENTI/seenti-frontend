#!/bin/bash
# start_project.sh - Otimizado para Sprint 08 - VERSÃO CORRIGIDA
# Script de inicialização do ambiente Seenti

echo "🚀 Iniciando ambiente Seenti..."

# Verificar se estamos no diretório correto
if [ ! -d "./SeentiCliente" ]; then
    echo "❌ Diretório ./SeentiCliente não encontrado!"
    echo "   Execute este script a partir de /home/marcia/seenti_app"
    exit 1
fi

# Verificar se o ambiente virtual existe
if [ ! -f "./SeentiCliente/e/bin/activate" ]; then
    echo "❌ Ambiente virtual não encontrado!"
    echo "   Execute: python3 -m venv SeentiCliente/e"
    exit 1
fi

# Verificar se o diretório dev existe
if [ ! -d "./SeentiCliente/dev" ]; then
    echo "❌ Diretório ./SeentiCliente/dev não encontrado!"
    exit 1
fi

# Verificar se o diretório Frontend existe
if [ ! -d "./SeentiCliente/Frontend" ]; then
    echo "❌ Diretório ./SeentiCliente/Frontend não encontrado!"
    exit 1
fi

# Verificar se as portas estão livres
if lsof -i :5001 > /dev/null 2>&1; then
    echo "❌ Porta 5001 (Backend) já está em uso!"
    echo "   Processo: $(lsof -i :5001 | grep LISTEN)"
    exit 1
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo "❌ Porta 5173 (Frontend) já está em uso!"
    echo "   Processo: $(lsof -i :5173 | grep LISTEN)"
    exit 1
fi

# Verificar se já há processos rodando
if pgrep -f "python3 app.py" > /dev/null; then
    echo "⚠️  Backend já está rodando!"
    BACKEND_PID=$(pgrep -f "python3 app.py" | head -1)
    echo "   PID: $BACKEND_PID"
else
    echo "🔧 Iniciando backend..."
    cd ./SeentiCliente/dev || exit
    source ../e/bin/activate
    python3 app.py &
    BACKEND_PID=$!
    echo "✅ Backend iniciado (PID: $BACKEND_PID)"
    cd ../..
fi

# Verificar se já há processos Vite rodando
if pgrep -f "vite" > /dev/null; then
    echo "⚠️  Frontend já está rodando!"
    FRONTEND_PID=$(pgrep -f "vite" | head -1)
    echo "   PID: $FRONTEND_PID"
else
    echo "🎨 Iniciando frontend..."
    cd ./SeentiCliente/Frontend || exit
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
    cd ../..
fi

echo ""
echo "🎯 Status do Ambiente:"
echo "   Backend:  http://localhost:5001 (PID: $BACKEND_PID)"
echo "   Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "💡 Para parar: CTRL+C ou ./stop_project.sh"
echo "🌐 Abrindo navegador..."

# Abrir navegador
xdg-open http://localhost:5173 >/dev/null 2>&1 &

# Função de limpeza
cleanup() {
    echo ""
    echo "🛑 Encerrando ambiente Seenti..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   Backend encerrado"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   Frontend encerrado"
    fi
    echo "✅ Ambiente encerrado com sucesso!"
    exit 0
}

# Capturar CTRL+C
trap cleanup SIGINT

# Aguardar
echo "⏳ Pressione CTRL+C para encerrar..."
wait
