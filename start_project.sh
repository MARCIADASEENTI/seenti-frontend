#!/bin/bash
# Inicia backend
cd ~/seenti_app/SeentiCliente/dev || exit
source ../e/bin/activate
python3 app.py &
BACKEND_PID=$!

# Inicia frontend
cd ~/seenti_app/SeentiCliente/Frontend || exit
npm run dev &
FRONTEND_PID=$!

# Mensagem
echo "Backend rodando (PID $BACKEND_PID)"
echo "Frontend rodando (PID $FRONTEND_PID)"

# Abrir navegador (opcional, porta padrão do Vite é 5173)
xdg-open http://localhost:5173 >/dev/null 2>&1 &

# Mantém o terminal aberto para encerrar com CTRL+C
wait
