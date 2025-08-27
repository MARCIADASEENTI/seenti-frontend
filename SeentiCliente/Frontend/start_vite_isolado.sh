#!/bin/bash

# 🚀 SCRIPT PARA EXECUTAR VITE DE FORMA ISOLADA
# 📍 Localização: /home/marcia/seenti_app/SeentiCliente/Frontend/

echo "🚀 INICIANDO VITE DE FORMA ISOLADA:"
echo "📍 Diretório: $(pwd)"
echo ""

# Verificar se já está rodando
if pgrep -f "vite" > /dev/null; then
    echo "❌ Vite já está rodando!"
    echo "🔄 Parando processo anterior..."
    pkill -f "vite"
    sleep 2
fi

# Criar diretório de logs se não existir
mkdir -p logs

# Executar Vite em background com logs separados
echo "🚀 Iniciando Vite em background..."
nohup npm run dev > logs/vite.log 2>&1 &

# Aguardar inicialização
sleep 5

# Verificar status
if pgrep -f "vite" > /dev/null; then
    echo "✅ Vite iniciado com sucesso!"
    echo "📊 PID: $(pgrep -f 'vite')"
    echo "📝 Logs: logs/vite.log"
    echo "🌐 URL: http://localhost:3000"
else
    echo "❌ Erro ao iniciar Vite!"
    echo "📝 Verificar logs: logs/vite.log"
fi

echo ""
echo "🔍 Para ver logs em tempo real:"
echo "   tail -f logs/vite.log"
echo ""
echo "🛑 Para parar:"
echo "   pkill -f 'vite'" 