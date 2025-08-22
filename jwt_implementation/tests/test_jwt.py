# 🧪 TESTES JWT - SEENTI APP
# Testes para validação da implementação JWT

import requests
import json
import time
from datetime import datetime

class JWTTestSuite:
    """Suite de testes para validação JWT"""
    
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
        self.test_results = []
    
    def log_test(self, test_name, success, details=None):
        """Registra resultado de um teste"""
        result = {
            'test_name': test_name,
            'success': success,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"{status} {test_name}")
        if details:
            print(f"   📝 {details}")
    
    def test_jwt_status(self):
        """Testa se o sistema JWT está funcionando"""
        try:
            response = requests.get(f"{self.base_url}/jwt/status")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Status JWT", True, f"Sistema ativo: {data.get('status')}")
                return True
            else:
                self.log_test("Status JWT", False, f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Status JWT", False, f"Erro: {str(e)}")
            return False
    
    def test_jwt_login(self):
        """Testa login JWT"""
        try:
            login_data = {
                "email": "teste@teste.com",
                "senha": "123"
            }
            
            response = requests.post(
                f"{self.base_url}/jwt/login",
                json=login_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.access_token = data.get('access_token')
                self.refresh_token = data.get('refresh_token')
                
                if self.access_token and self.refresh_token:
                    self.log_test("Login JWT", True, f"Usuário: {data.get('user', {}).get('email')}")
                    return True
                else:
                    self.log_test("Login JWT", False, "Tokens não retornados")
                    return False
            else:
                self.log_test("Login JWT", False, f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Login JWT", False, f"Erro: {str(e)}")
            return False
    
    def test_jwt_profile(self):
        """Testa acesso a rota protegida"""
        if not self.access_token:
            self.log_test("Perfil JWT", False, "Sem access token")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.base_url}/jwt/profile",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Perfil JWT", True, f"Usuário: {data.get('user', {}).get('email')}")
                return True
            else:
                self.log_test("Perfil JWT", False, f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Perfil JWT", False, f"Erro: {str(e)}")
            return False
    
    def test_jwt_refresh(self):
        """Testa renovação de token"""
        if not self.refresh_token:
            self.log_test("Refresh JWT", False, "Sem refresh token")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.refresh_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{self.base_url}/jwt/refresh",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                new_access_token = data.get('access_token')
                
                if new_access_token:
                    self.access_token = new_access_token
                    self.log_test("Refresh JWT", True, "Token renovado com sucesso")
                    return True
                else:
                    self.log_test("Refresh JWT", False, "Novo token não retornado")
                    return False
            else:
                self.log_test("Refresh JWT", False, f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Refresh JWT", False, f"Erro: {str(e)}")
            return False
    
    def test_jwt_logout(self):
        """Testa logout JWT"""
        if not self.access_token:
            self.log_test("Logout JWT", False, "Sem access token")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{self.base_url}/jwt/logout",
                headers=headers
            )
            
            if response.status_code == 200:
                self.log_test("Logout JWT", True, "Logout realizado com sucesso")
                return True
            else:
                self.log_test("Logout JWT", False, f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Logout JWT", False, f"Erro: {str(e)}")
            return False
    
    def test_jwt_security(self):
        """Testa segurança JWT"""
        try:
            # Testa acesso sem token
            response = requests.get(f"{self.base_url}/jwt/profile")
            
            if response.status_code == 401:
                self.log_test("Segurança JWT", True, "Rota protegida sem token")
            else:
                self.log_test("Segurança JWT", False, f"Rota não protegida: {response.status_code}")
                return False
            
            # Testa acesso com token inválido
            headers = {
                'Authorization': 'Bearer invalid_token_123',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.base_url}/jwt/profile",
                headers=headers
            )
            
            if response.status_code == 401:
                self.log_test("Segurança JWT", True, "Token inválido rejeitado")
                return True
            else:
                self.log_test("Segurança JWT", False, f"Token inválido aceito: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Segurança JWT", False, f"Erro: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Executa todos os testes"""
        print("🧪 INICIANDO TESTES JWT")
        print("=" * 50)
        
        # Executa testes em sequência
        tests = [
            self.test_jwt_status,
            self.test_jwt_login,
            self.test_jwt_profile,
            self.test_jwt_refresh,
            self.test_jwt_logout,
            self.test_jwt_security
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                self.log_test(test.__name__, False, f"Erro na execução: {str(e)}")
        
        # Resultado final
        print("=" * 50)
        print(f"📊 RESULTADO DOS TESTES: {passed}/{total} PASSARAM")
        
        if passed == total:
            print("🎉 TODOS OS TESTES PASSARAM! JWT funcionando perfeitamente!")
        else:
            print("⚠️  ALGUNS TESTES FALHARAM. Verificar implementação.")
        
        return passed == total
    
    def generate_report(self):
        """Gera relatório detalhado dos testes"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'base_url': self.base_url,
            'total_tests': len(self.test_results),
            'passed_tests': sum(1 for r in self.test_results if r['success']),
            'failed_tests': sum(1 for r in self.test_results if not r['success']),
            'test_results': self.test_results
        }
        
        return report

# Função para executar testes
def run_jwt_tests(base_url="http://localhost:5000"):
    """Executa a suite de testes JWT"""
    test_suite = JWTTestSuite(base_url)
    success = test_suite.run_all_tests()
    
    # Gera relatório
    report = test_suite.generate_report()
    
    # Salva relatório em arquivo
    with open('jwt_test_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"📄 Relatório salvo em: jwt_test_report.json")
    
    return success, report

# Execução direta dos testes
if __name__ == "__main__":
    print("🚀 Executando testes JWT...")
    success, report = run_jwt_tests()
    
    if success:
        print("✅ Implementação JWT validada com sucesso!")
    else:
        print("❌ Implementação JWT precisa de ajustes.")

