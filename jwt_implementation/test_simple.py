#!/usr/bin/env python3
# 🧪 TESTE SIMPLES JWT - SEENTI APP
# Teste básico para validar implementação JWT

import requests
import json
from datetime import datetime

def test_jwt_simple():
    """Teste simples do sistema JWT"""
    
    base_url = "http://localhost:5000"
    
    print("🧪 TESTE SIMPLES JWT - SEENTI APP")
    print("=" * 50)
    
    # Teste 1: Status do sistema
    print("1️⃣ Testando status do sistema...")
    try:
        response = requests.get(f"{base_url}/jwt/status")
        if response.status_code == 200:
            print("   ✅ Sistema JWT ativo")
            data = response.json()
            print(f"   📊 Status: {data.get('status')}")
        else:
            print(f"   ❌ Erro: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Erro de conexão: {e}")
        return False
    
    # Teste 2: Login JWT
    print("\n2️⃣ Testando login JWT...")
    try:
        login_data = {
            "email": "teste@teste.com",
            "senha": "123"
        }
        
        response = requests.post(
            f"{base_url}/jwt/login",
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            access_token = data.get('access_token')
            refresh_token = data.get('refresh_token')
            
            if access_token and refresh_token:
                print("   ✅ Login realizado com sucesso")
                print(f"   👤 Usuário: {data.get('user', {}).get('email')}")
                print(f"   🔑 Access Token: {access_token[:20]}...")
                print(f"   🔄 Refresh Token: {refresh_token[:20]}...")
                
                # Teste 3: Acesso a rota protegida
                print("\n3️⃣ Testando acesso a rota protegida...")
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.get(
                    f"{base_url}/jwt/profile",
                    headers=headers
                )
                
                if response.status_code == 200:
                    print("   ✅ Rota protegida acessada com sucesso")
                    profile_data = response.json()
                    print(f"   👤 Perfil: {profile_data.get('user', {}).get('nome')}")
                else:
                    print(f"   ❌ Erro ao acessar perfil: {response.status_code}")
                    return False
                
                # Teste 4: Refresh token
                print("\n4️⃣ Testando refresh token...")
                refresh_headers = {
                    'Authorization': f'Bearer {refresh_token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.post(
                    f"{base_url}/jwt/refresh",
                    headers=refresh_headers
                )
                
                if response.status_code == 200:
                    new_token = response.json().get('access_token')
                    if new_token:
                        print("   ✅ Token renovado com sucesso")
                        print(f"   🔑 Novo Token: {new_token[:20]}...")
                    else:
                        print("   ❌ Novo token não retornado")
                        return False
                else:
                    print(f"   ❌ Erro ao renovar token: {response.status_code}")
                    return False
                
                # Teste 5: Logout
                print("\n5️⃣ Testando logout...")
                logout_headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.post(
                    f"{base_url}/jwt/logout",
                    headers=logout_headers
                )
                
                if response.status_code == 200:
                    print("   ✅ Logout realizado com sucesso")
                else:
                    print(f"   ❌ Erro no logout: {response.status_code}")
                    return False
                
            else:
                print("   ❌ Tokens não retornados")
                return False
        else:
            print(f"   ❌ Erro no login: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Erro no teste: {e}")
        return False
    
    # Teste 6: Segurança
    print("\n6️⃣ Testando segurança...")
    try:
        # Teste sem token
        response = requests.get(f"{base_url}/jwt/profile")
        if response.status_code == 401:
            print("   ✅ Rota protegida sem token")
        else:
            print(f"   ❌ Rota não protegida: {response.status_code}")
            return False
        
        # Teste com token inválido
        invalid_headers = {
            'Authorization': 'Bearer invalid_token_123',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f"{base_url}/jwt/profile",
            headers=invalid_headers
        )
        
        if response.status_code == 401:
            print("   ✅ Token inválido rejeitado")
        else:
            print(f"   ❌ Token inválido aceito: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Erro no teste de segurança: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 TODOS OS TESTES PASSARAM! JWT funcionando perfeitamente!")
    print("=" * 50)
    
    return True

if __name__ == "__main__":
    print("🚀 Iniciando teste simples JWT...")
    success = test_jwt_simple()
    
    if success:
        print("\n✅ SISTEMA JWT VALIDADO COM SUCESSO!")
        print("🎯 Próximo passo: Integrar com sistema atual")
    else:
        print("\n❌ SISTEMA JWT PRECISA DE AJUSTES")
        print("🔧 Verificar implementação antes de prosseguir")
