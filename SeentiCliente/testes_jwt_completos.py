#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔐 TESTES COMPLETOS DO SISTEMA JWT - SEENTI APP
Script para testar todas as funcionalidades JWT implementadas
"""

import requests
import json
import time
from datetime import datetime

class TesteJWTCompleto:
    """Classe para testes completos do sistema JWT"""
    
    def __init__(self):
        self.base_url = "http://localhost:5001"
        self.access_token = None
        self.refresh_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, details=""):
        """Registra resultado de um teste"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        status = "✅ PASSOU" if success else "❌ FALHOU"
        result = {
            "timestamp": timestamp,
            "test": test_name,
            "status": status,
            "details": details
        }
        self.test_results.append(result)
        print(f"{status} {test_name} - {details}")
        
    def test_01_conexao_backend(self):
        """Teste 01: Verificar se o backend está rodando"""
        try:
            response = requests.get(f"{self.base_url}/jwt/status", timeout=5)
            if response.status_code == 200:
                self.log_test("01. Conexão Backend", True, "Backend respondendo")
                return True
            else:
                self.log_test("01. Conexão Backend", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("01. Conexão Backend", False, f"Erro: {str(e)}")
            return False
    
    def test_02_rota_jwt_status(self):
        """Teste 02: Verificar rota JWT de status"""
        try:
            response = requests.get(f"{self.base_url}/jwt/status", timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.log_test("02. Rota JWT Status", True, "Rota funcionando")
                return True
            else:
                self.log_test("02. Rota JWT Status", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("02. Rota JWT Status", False, f"Erro: {str(e)}")
            return False
    
    def test_03_login_jwt_sucesso(self):
        """Teste 03: Login JWT com credenciais válidas"""
        try:
            login_data = {
                "email": "teste@teste.com",
                "senha": "123"
            }
            response = requests.post(
                f"{self.base_url}/jwt/login",
                json=login_data,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "refresh_token" in data:
                    self.access_token = data["access_token"]
                    self.refresh_token = data["refresh_token"]
                    self.log_test("03. Login JWT Sucesso", True, "Tokens gerados")
                    return True
                else:
                    self.log_test("03. Login JWT Sucesso", False, "Tokens não encontrados")
                    return False
            else:
                self.log_test("03. Login JWT Sucesso", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("03. Login JWT Sucesso", False, f"Erro: {str(e)}")
            return False
    
    def test_04_login_jwt_credenciais_invalidas(self):
        """Teste 04: Login JWT com credenciais inválidas"""
        try:
            login_data = {
                "email": "invalido@teste.com",
                "senha": "senha_errada"
            }
            response = requests.post(
                f"{self.base_url}/jwt/login",
                json=login_data,
                timeout=5
            )
            
            if response.status_code == 401:
                self.log_test("04. Login JWT Credenciais Inválidas", True, "Erro 401 retornado")
                return True
            else:
                self.log_test("04. Login JWT Credenciais Inválidas", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("04. Login JWT Credenciais Inválidas", False, f"Erro: {str(e)}")
            return False
    
    def test_05_acesso_rota_protegida_com_token(self):
        """Teste 05: Acesso a rota protegida com token válido"""
        if not self.access_token:
            self.log_test("05. Acesso Rota Protegida", False, "Token não disponível")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}"
            }
            response = requests.get(
                f"{self.base_url}/jwt/test",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "JWT funcionando" in data["message"]:
                    self.log_test("05. Acesso Rota Protegida", True, "Acesso autorizado")
                    return True
                else:
                    self.log_test("05. Acesso Rota Protegida", False, "Resposta inesperada")
                    return False
            else:
                self.log_test("05. Acesso Rota Protegida", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("05. Acesso Rota Protegida", False, f"Erro: {str(e)}")
            return False
    
    def test_06_acesso_rota_protegida_sem_token(self):
        """Teste 06: Tentativa de acesso sem token"""
        try:
            response = requests.get(f"{self.base_url}/jwt/test", timeout=5)
            
            if response.status_code == 401:
                self.log_test("06. Acesso Sem Token", True, "Erro 401 retornado")
                return True
            else:
                self.log_test("06. Acesso Sem Token", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("06. Acesso Sem Token", False, f"Erro: {str(e)}")
            return False
    
    def test_07_refresh_token(self):
        """Teste 07: Renovação de access token"""
        if not self.refresh_token:
            self.log_test("07. Refresh Token", False, "Refresh token não disponível")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.refresh_token}"
            }
            response = requests.post(
                f"{self.base_url}/jwt/refresh",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.access_token = data["access_token"]
                    self.log_test("07. Refresh Token", True, "Token renovado")
                    return True
                else:
                    self.log_test("07. Refresh Token", False, "Novo token não retornado")
                    return False
            else:
                self.log_test("07. Refresh Token", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("07. Refresh Token", False, f"Erro: {str(e)}")
            return False
    
    def test_08_logout(self):
        """Teste 08: Logout e invalidação de token"""
        if not self.access_token:
            self.log_test("08. Logout", False, "Token não disponível")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}"
            }
            response = requests.post(
                f"{self.base_url}/jwt/logout",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                self.log_test("08. Logout", True, "Logout realizado")
                return True
            else:
                self.log_test("08. Logout", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("08. Logout", False, f"Erro: {str(e)}")
            return False
    
    def test_09_token_invalidado_apos_logout(self):
        """Teste 09: Verificar se token foi invalidado após logout"""
        if not self.access_token:
            self.log_test("09. Token Invalidado", False, "Token não disponível")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}"
            }
            response = requests.get(
                f"{self.base_url}/jwt/test",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 401:
                self.log_test("09. Token Invalidado", True, "Token rejeitado após logout")
                return True
            else:
                self.log_test("09. Token Invalidado", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("09. Token Invalidado", False, f"Erro: {str(e)}")
            return False
    
    def test_10_rate_limiting(self):
        """Teste 10: Verificar rate limiting"""
        try:
            # Tentar login múltiplas vezes
            login_data = {
                "email": "teste@teste.com",
                "senha": "senha_errada"
            }
            
            for i in range(6):  # Mais que o limite de 5 tentativas
                response = requests.post(
                    f"{self.base_url}/jwt/login",
                    json=login_data,
                    timeout=5
                )
                
                if i < 5 and response.status_code == 401:
                    continue  # Esperado para tentativas inválidas
                elif i == 5 and response.status_code == 429:
                    self.log_test("10. Rate Limiting", True, "Rate limiting funcionando")
                    return True
                else:
                    self.log_test("10. Rate Limiting", False, f"Tentativa {i+1}: Status {response.status_code}")
                    return False
                    
        except Exception as e:
            self.log_test("10. Rate Limiting", False, f"Erro: {str(e)}")
            return False
    
    def executar_todos_testes(self):
        """Executa todos os testes em sequência"""
        print("🚀 INICIANDO TESTES COMPLETOS DO SISTEMA JWT")
        print("=" * 60)
        
        # Executar testes em sequência
        testes = [
            self.test_01_conexao_backend,
            self.test_02_rota_jwt_status,
            self.test_03_login_jwt_sucesso,
            self.test_04_login_jwt_credenciais_invalidas,
            self.test_05_acesso_rota_protegida_com_token,
            self.test_06_acesso_rota_protegida_sem_token,
            self.test_07_refresh_token,
            self.test_08_logout,
            self.test_09_token_invalidado_apos_logout,
            self.test_10_rate_limiting
        ]
        
        resultados = []
        for teste in testes:
            try:
                resultado = teste()
                resultados.append(resultado)
                time.sleep(0.5)  # Pausa entre testes
            except Exception as e:
                self.log_test(teste.__name__, False, f"Erro na execução: {str(e)}")
                resultados.append(False)
        
        # Resumo dos resultados
        self.gerar_relatorio(resultados)
        
    def gerar_relatorio(self, resultados):
        """Gera relatório completo dos testes"""
        print("\n" + "=" * 60)
        print("📊 RELATÓRIO COMPLETO DOS TESTES JWT")
        print("=" * 60)
        
        total_testes = len(resultados)
        testes_passaram = sum(resultados)
        testes_falharam = total_testes - testes_passaram
        
        print(f"📈 TOTAL DE TESTES: {total_testes}")
        print(f"✅ TESTES PASSARAM: {testes_passaram}")
        print(f"❌ TESTES FALHARAM: {testes_falharam}")
        print(f"📊 TAXA DE SUCESSO: {(testes_passaram/total_testes)*100:.1f}%")
        
        print("\n📋 DETALHAMENTO DOS TESTES:")
        for i, resultado in enumerate(self.test_results, 1):
            print(f"{i:2d}. {resultado['timestamp']} - {resultado['test']}: {resultado['status']}")
            if resultado['details']:
                print(f"    📝 {resultado['details']}")
        
        print("\n" + "=" * 60)
        
        if testes_falharam == 0:
            print("🎉 TODOS OS TESTES PASSARAM! SISTEMA JWT FUNCIONANDO PERFEITAMENTE!")
            print("✅ PRÓXIMO PASSO: VALIDAÇÃO E DOCUMENTAÇÃO")
        else:
            print("⚠️ ALGUNS TESTES FALHARAM! NECESSÁRIO CORRIGIR ANTES DE AVANÇAR!")
            print("🔧 PRÓXIMO PASSO: CORRIGIR PROBLEMAS IDENTIFICADOS")
        
        print("=" * 60)

if __name__ == "__main__":
    # Executar testes completos
    tester = TesteJWTCompleto()
    tester.executar_todos_testes()






