#!/usr/bin/env python3
"""
📋 SCRIPT DE BACKUP - COLEÇÃO ANAMNESE ATUAL
Sprint 07 - Refatoração do Formulário de Anamnese

Este script faz backup da coleção atual antes de implementar a nova estrutura.
"""

import os
import sys
import json
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId, json_util

# Configurações
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://App_mdb:nJkn86qjYvUjlwpJ@ps-terapia.8dgyy1d.mongodb.net/seenti_db?retryWrites=true&w=majority')
DB_NAME = 'seenti_db'
COLLECTION_NAME = 'anamneses'

def conectar_mongodb():
    """Conecta ao MongoDB e retorna a conexão"""
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        print(f"✅ Conectado ao MongoDB: {DB_NAME}")
        return client, db
    except Exception as e:
        print(f"❌ Erro ao conectar ao MongoDB: {e}")
        sys.exit(1)

def verificar_vinculos(db):
    """Verifica vínculos da coleção anamneses com outras coleções"""
    print("\n🔍 VERIFICANDO VÍNCULOS DA COLEÇÃO ANAMNESES...")
    
    anamneses = db[COLLECTION_NAME]
    
    # Contar total de anamneses
    total_anamneses = anamneses.count_documents({})
    print(f"📊 Total de anamneses: {total_anamneses}")
    
    if total_anamneses == 0:
        print("ℹ️  Nenhuma anamnese encontrada. Pode prosseguir com a refatoração.")
        return
    
    # Verificar vínculos com clientes
    try:
        clientes = db['clientes']
        anamneses_sem_cliente = anamneses.count_documents({"cliente_id": {"$exists": False}})
        print(f"🔗 Anamneses sem cliente_id: {anamneses_sem_cliente}")
        
        # Verificar se todos os cliente_id são válidos
        anamneses_invalidas = []
        for anamnese in anamneses.find({}, {"cliente_id": 1}):
            if anamnese.get('cliente_id'):
                try:
                    cliente = clientes.find_one({"_id": ObjectId(anamnese['cliente_id'])})
                    if not cliente:
                        anamneses_invalidas.append(anamnese['_id'])
                except:
                    anamneses_invalidas.append(anamnese['_id'])
        
        print(f"⚠️  Anamneses com cliente_id inválido: {len(anamneses_invalidas)}")
        
    except Exception as e:
        print(f"❌ Erro ao verificar vínculos com clientes: {e}")
    
    # Verificar vínculos com tenants
    try:
        tenants = db['tenants']
        anamneses_sem_tenant = anamneses.count_documents({"tenant_id": {"$exists": False}})
        print(f"🏢 Anamneses sem tenant_id: {anamneses_sem_tenant}")
        
    except Exception as e:
        print(f"❌ Erro ao verificar vínculos com tenants: {e}")

def fazer_backup(db):
    """Faz backup completo da coleção anamneses"""
    print(f"\n💾 FAZENDO BACKUP DA COLEÇÃO {COLLECTION_NAME.upper()}...")
    
    anamneses = db[COLLECTION_NAME]
    
    # Criar diretório de backup se não existir
    backup_dir = "backup_anamnese"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"📁 Diretório de backup criado: {backup_dir}")
    
    # Nome do arquivo de backup com timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"{backup_dir}/anamnese_backup_{timestamp}.json"
    
    try:
        # Buscar todas as anamneses
        anamneses_data = list(anamneses.find({}))
        
        if not anamneses_data:
            print("ℹ️  Nenhuma anamnese para fazer backup.")
            return
        
        # Converter ObjectId para string para JSON
        anamneses_json = json.loads(json_util.dumps(anamneses_data))
        
        # Salvar backup
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(anamneses_json, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Backup salvo em: {backup_file}")
        print(f"📊 Total de documentos no backup: {len(anamneses_data)}")
        
        # Criar arquivo de resumo
        resumo_file = f"{backup_dir}/resumo_backup_{timestamp}.txt"
        with open(resumo_file, 'w', encoding='utf-8') as f:
            f.write(f"BACKUP COLEÇÃO ANAMNESES - {timestamp}\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Total de documentos: {len(anamneses_data)}\n")
            f.write(f"Data/hora do backup: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")
            
            # Resumo por estrutura
            estruturas = {}
            for anamnese in anamneses_data:
                if 'dados' in anamnese:
                    estrutura = list(anamnese['dados'].keys())
                    estrutura_str = ", ".join(sorted(estrutura))
                    estruturas[estrutura_str] = estruturas.get(estrutura_str, 0) + 1
            
            f.write("ESTRUTURAS DE DADOS ENCONTRADAS:\n")
            f.write("-" * 40 + "\n")
            for estrutura, count in estruturas.items():
                f.write(f"{estrutura}: {count} documento(s)\n")
        
        print(f"📋 Resumo do backup salvo em: {resumo_file}")
        
    except Exception as e:
        print(f"❌ Erro ao fazer backup: {e}")

def analisar_estrutura_atual(db):
    """Analisa a estrutura atual dos dados de anamnese"""
    print(f"\n🔬 ANALISANDO ESTRUTURA ATUAL DOS DADOS...")
    
    anamneses = db[COLLECTION_NAME]
    
    # Buscar algumas anamneses para análise
    amostras = list(anamneses.find({}).limit(5))
    
    if not amostras:
        print("ℹ️  Nenhuma anamnese para análise.")
        return
    
    print(f"📊 Analisando {len(amostras)} amostras...")
    
    for i, anamnese in enumerate(amostras, 1):
        print(f"\n--- AMOSTRA {i} ---")
        print(f"ID: {anamnese.get('_id')}")
        print(f"Cliente ID: {anamnese.get('cliente_id')}")
        print(f"Status: {anamnese.get('status', 'N/A')}")
        print(f"Data Criação: {anamnese.get('data_criacao', 'N/A')}")
        
        if 'dados' in anamnese:
            dados = anamnese['dados']
            print(f"Campos em 'dados': {list(dados.keys())}")
            
            # Mostrar alguns valores de exemplo
            for campo, valor in list(dados.items())[:3]:
                if isinstance(valor, str) and len(valor) > 50:
                    valor = valor[:50] + "..."
                print(f"  {campo}: {valor}")
        else:
            print("❌ Campo 'dados' não encontrado")

def main():
    """Função principal"""
    print("🚀 SCRIPT DE BACKUP - COLEÇÃO ANAMNESE")
    print("=" * 50)
    
    # Conectar ao MongoDB
    client, db = conectar_mongodb()
    
    try:
        # Verificar vínculos
        verificar_vinculos(db)
        
        # Fazer backup
        fazer_backup(db)
        
        # Analisar estrutura atual
        analisar_estrutura_atual(db)
        
        print("\n" + "=" * 50)
        print("✅ BACKUP CONCLUÍDO COM SUCESSO!")
        print("🎯 Agora você pode prosseguir com a refatoração.")
        print("📁 Verifique os arquivos na pasta 'backup_anamnese'")
        
    except Exception as e:
        print(f"\n❌ Erro durante o processo: {e}")
    
    finally:
        # Fechar conexão
        client.close()
        print("\n🔌 Conexão com MongoDB fechada.")

if __name__ == "__main__":
    main()






