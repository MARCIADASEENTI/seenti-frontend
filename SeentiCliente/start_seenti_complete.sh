#!/bin/bash

echo "🚀 INICIANDO PROJETO SEENTI COMPLETO"
echo "======================================"

# Verificar se as portas estão livres
echo "🔍 Verificando portas..."
if lsof -i :5001 > /dev/null 2>&1; then
    echo "❌ Porta 5001 está em uso!"
    exit 1
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "❌ Porta 3000 está em uso!"
    exit 1
fi

echo "✅ Portas 5001 e 3000 estão livres!"

# Verificar MongoDB
echo "🔍 Verificando MongoDB..."
if ! pgrep -f "mongod" > /dev/null; then
    echo "⚠️ MongoDB não está rodando. Iniciando..."
    sudo systemctl start mongod
    sleep 3
fi

echo "✅ MongoDB está rodando!"

# Iniciar Backend
echo "🚀 Iniciando Backend Flask..."
cd dev
python3 app.py &
BACKEND_PID=$!
echo "✅ Backend iniciado com PID: $BACKEND_PID"

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Verificar se backend está respondendo
if curl -s http://localhost:5001/ > /dev/null; then
    echo "✅ Backend respondendo na porta 5001!"
else
    echo "❌ Backend não está respondendo!"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Iniciar Frontend
echo "🚀 Iniciando Frontend React..."
cd ../Frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend iniciado com PID: $FRONTEND_PID"

# Aguardar frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
sleep 8

# Verificar se frontend está respondendo
echo "⏳ Aguardando frontend inicializar..."
sleep 10

# Verificar se frontend está respondendo (porta 3000 ou 5173)
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Frontend respondendo na porta 3000!"
elif curl -s http://localhost:5173/ > /dev/null; then
    echo "✅ Frontend respondendo na porta 5173!"
    echo "⚠️  Nota: Frontend rodando na porta padrão do Vite (5173)"
else
    echo "❌ Frontend não está respondendo!"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 PROJETO SEENTI INICIADO COM SUCESSO!"
echo "========================================"
echo "🌐 Backend:  http://localhost:5001"
echo "🎨 Frontend: http://localhost:3000"
echo "📊 MongoDB:  Rodando"
echo ""
echo "📝 PIDs dos processos:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 Para parar: kill $BACKEND_PID $FRONTEND_PID"
echo "========================================"
