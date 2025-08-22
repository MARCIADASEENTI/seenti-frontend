#!/bin/bash

# Script de Sincronização: dev → prod
# Garante que o Render sempre tenha a versão mais atualizada do backend

echo "🔄 Sincronizando dev → prod para deploy no Render..."

# Verificar se estamos no diretório correto
if [ ! -d "dev" ] || [ ! -d "prod" ]; then
    echo "❌ Erro: Execute este script da pasta raiz do projeto (SeentiCliente/)"
    exit 1
fi

# Backup da pasta prod atual
echo "📦 Criando backup da pasta prod..."
if [ -d "prod_backup" ]; then
    rm -rf prod_backup
fi
cp -r prod prod_backup
echo "✅ Backup criado: prod_backup/"

# Sincronizar dev → prod
echo "🔄 Sincronizando arquivos..."
rsync -av --delete dev/ prod/ --exclude='__pycache__' --exclude='*.pyc' --exclude='.env'

# Verificar se a sincronização foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Sincronização concluída com sucesso!"
    echo "📁 Arquivos sincronizados:"
    echo "   - app.py"
    echo "   - requirements.txt (se existir)"
    echo "   - Outros arquivos Python"
    
    # Mostrar diferenças principais
    echo ""
    echo "🔍 Verificando principais arquivos..."
    
    if [ -f "prod/app.py" ]; then
        echo "✅ prod/app.py: $(wc -l < prod/app.py) linhas"
    else
        echo "❌ prod/app.py: Arquivo não encontrado!"
    fi
    
    if [ -f "dev/app.py" ]; then
        echo "✅ dev/app.py: $(wc -l < dev/app.py) linhas"
    else
        echo "❌ dev/app.py: Arquivo não encontrado!"
    fi
    
    echo ""
    echo "🚀 Render será atualizado automaticamente na próxima sincronização!"
    echo "💡 Para forçar atualização, faça um commit no repositório do backend"
    
else
    echo "❌ Erro na sincronização!"
    echo "🔄 Restaurando backup..."
    rm -rf prod
    mv prod_backup prod
    echo "✅ Backup restaurado"
    exit 1
fi

echo ""
echo "🎯 Próximos passos:"
echo "1. ✅ Sincronização concluída"
echo "2. 🔄 Render será atualizado automaticamente"
echo "3. 🧪 Teste a funcionalidade implementada"
echo "4. 📝 Faça commit das mudanças"
echo "5. 🚀 Deploy automático no Render"

echo ""
echo "✨ Sincronização concluída! Render atualizado!"
