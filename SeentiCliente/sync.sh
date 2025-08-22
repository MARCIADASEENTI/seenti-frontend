#!/bin/bash

# Script rápido de sincronização dev → prod
echo "🔄 Sincronizando dev → prod..."

# Sincronizar apenas arquivos Python principais
cp dev/app.py prod/app.py
cp dev/requirements.txt prod/requirements.txt 2>/dev/null || echo "⚠️ requirements.txt não encontrado"

echo "✅ Sincronização rápida concluída!"
echo "📁 prod/app.py atualizado"
echo "🚀 Render será atualizado automaticamente"
