#!/bin/bash

echo "🔄 MIGRANDO PARA NOVOS REPOSITÓRIOS SEPARADOS"
echo "=============================================="

# Verificar se estamos no diretório correto
if [ ! -d "dev" ] || [ ! -d "Frontend" ]; then
    echo "❌ Execute este script do diretório SeentiCliente/"
    exit 1
fi

echo "✅ Diretório correto detectado"

# Backup dos repositórios atuais
echo "💾 Criando backup dos repositórios atuais..."
cp -r .git .git.backup 2>/dev/null || echo "⚠️ Backup .git não criado"

# MIGRAR BACKEND
echo ""
echo "🐍 MIGRANDO BACKEND..."
cd dev

# Verificar se é um repositório git
if [ -d ".git" ]; then
    echo "   Removendo repositório git atual..."
    rm -rf .git
fi

# Inicializar novo repositório
echo "   Inicializando novo repositório git..."
git init
git remote add origin https://github.com/MARCIADASEENTI/seenti-backend.git

# Configurar usuário
git config user.name "MARCIADASEENTI"
git config user.email "marcia@seenti.com"

# Primeiro commit
echo "   Criando primeiro commit..."
git add .
git commit -m "🚀 Migração para repositório separado - Backend Seenti"

echo "   ✅ Backend migrado para seenti-backend"

cd ..

# MIGRAR FRONTEND
echo ""
echo "⚛️ MIGRANDO FRONTEND..."
cd Frontend

# Verificar se é um repositório git
if [ -d ".git" ]; then
    echo "   Removendo repositório git atual..."
    rm -rf .git
fi

# Inicializar novo repositório
echo "   Inicializando novo repositório git..."
git init
git remote add origin https://github.com/MARCIADASEENTI/seenti-frontend.git

# Configurar usuário
git config user.name "MARCIADASEENTI"
git config user.email "marcia@seenti.com"

# Primeiro commit
echo "   Criando primeiro commit..."
git add .
git commit -m "🚀 Migração para repositório separado - Frontend Seenti"

echo "   ✅ Frontend migrado para seenti-frontend"

cd ..

echo ""
echo "🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!"
echo "===================================="
echo "🐍 Backend:  https://github.com/MARCIADASEENTI/seenti-backend.git"
echo "⚛️ Frontend: https://github.com/MARCIADASEENTI/seenti-frontend.git"
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo "   1. Push dos repositórios:"
echo "      cd dev && git push -u origin main"
echo "      cd Frontend && git push -u origin main"
echo "   2. Deploy automático ativado em ambos"
echo "   3. Verificar status no GitHub"
echo "===================================="

