#!/bin/bash

# 🐍 SCRIPT PARA EXECUTAR FLASK DE FORMA ISOLADA
# 📍 Localização: /home/marcia/seenti_app/SeentiCliente/Backend/

echo "🐍 INICIANDO FLASK DE FORMA ISOLADA:"
echo "📍 Diretório: $(pwd)"
echo ""

# Verificar se já está rodando
if pgrep -f "python3 app.py" > /dev/null; then
    echo "❌ Flask já está rodando!"
    echo "🔄 Parando processo anterior..."
    pkill -f "python3 app.py"
    sleep 2
fi

# Criar diretório de logs se não existir
mkdir -p logs

# Executar Flask em background com logs separados
echo "🚀 Iniciando Flask em background..."
nohup python3 app.py > logs/flask.log 2>&1 &

# Aguardar inicialização
sleep 3

# Verificar status
if pgrep -f "python3 app.py" > /dev/null; then
    echo "✅ Flask iniciado com sucesso!"
    echo "📊 PID: $(pgrep -f 'python3 app.py')"
    echo "📝 Logs: logs/flask.log"
    echo "🌐 URL: http://localhost:5001"
else
    echo "❌ Erro ao iniciar Flask!"
    echo "📝 Verificar logs: logs/flask.log"
fi

echo ""
echo "🔍 Para ver logs em tempo real:"
echo "   tail -f logs/flask.log"
echo ""
echo "🛑 Para parar:"
echo "   pkill -f 'python3 app.py'" 