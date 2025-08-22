# 🔐 CONFIGURAÇÃO JWT - SEENTI APP
# Arquivo de configuração para implementação JWT

import os
from datetime import timedelta

class JWTConfig:
    """Configurações JWT para o Seenti App"""
    
    # Chave secreta para assinatura de tokens
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'seenti-jwt-secret-key-change-in-production')
    
    # Configurações de Access Token
    ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)  # 15 minutos
    
    # Configurações de Refresh Token
    REFRESH_TOKEN_EXPIRES = timedelta(days=7)    # 7 dias
    
    # Configurações de Cookies
    JWT_COOKIE_SECURE = False  # True em produção (HTTPS)
    JWT_COOKIE_HTTPONLY = True  # Sempre True para segurança
    JWT_COOKIE_SAMESITE = 'Lax'  # Proteção CSRF
    
    # Configurações de Rate Limiting
    RATE_LIMIT_ATTEMPTS = 5      # 5 tentativas
    RATE_LIMIT_WINDOW = 300      # 5 minutos (300 segundos)
    
    # Configurações de Headers
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # Configurações de Blacklist (para logout)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    
    # Configurações de Erro
    JWT_ERROR_MESSAGE_KEY = 'error'
    
    @classmethod
    def get_config_dict(cls):
        """Retorna configurações como dicionário para Flask-JWT-Extended"""
        return {
            'JWT_SECRET_KEY': cls.SECRET_KEY,
            'JWT_ACCESS_TOKEN_EXPIRES': cls.ACCESS_TOKEN_EXPIRES,
            'JWT_REFRESH_TOKEN_EXPIRES': cls.REFRESH_TOKEN_EXPIRES,
            'JWT_COOKIE_SECURE': cls.JWT_COOKIE_SECURE,
            'JWT_COOKIE_HTTPONLY': cls.JWT_COOKIE_HTTPONLY,
            'JWT_COOKIE_SAMESITE': cls.JWT_COOKIE_SAMESITE,
            'JWT_HEADER_NAME': cls.JWT_HEADER_NAME,
            'JWT_HEADER_TYPE': cls.JWT_HEADER_TYPE,
            'JWT_BLACKLIST_ENABLED': cls.JWT_BLACKLIST_ENABLED,
            'JWT_BLACKLIST_TOKEN_CHECKS': cls.JWT_BLACKLIST_TOKEN_CHECKS,
            'JWT_ERROR_MESSAGE_KEY': cls.JWT_ERROR_MESSAGE_KEY,
        }

# Configurações específicas para desenvolvimento
class DevelopmentConfig(JWTConfig):
    """Configurações para ambiente de desenvolvimento"""
    
    DEBUG = True
    JWT_COOKIE_SECURE = False  # HTTP em desenvolvimento
    
# Configurações específicas para produção
class ProductionConfig(JWTConfig):
    """Configurações para ambiente de produção"""
    
    DEBUG = False
    JWT_COOKIE_SECURE = True   # HTTPS em produção
    
# Função para obter configuração baseada no ambiente
def get_jwt_config():
    """Retorna configuração JWT baseada no ambiente"""
    env = os.getenv('FLASK_ENV', 'development')
    
    if env == 'production':
        return ProductionConfig.get_config_dict()
    else:
        return DevelopmentConfig.get_config_dict()

# Configurações de exemplo para testes
TEST_CONFIG = {
    'JWT_SECRET_KEY': 'test-secret-key',
    'JWT_ACCESS_TOKEN_EXPIRES': timedelta(minutes=1),  # 1 minuto para testes
    'JWT_REFRESH_TOKEN_EXPIRES': timedelta(minutes=5), # 5 minutos para testes
    'JWT_COOKIE_SECURE': False,
    'JWT_COOKIE_HTTPONLY': True,
    'JWT_COOKIE_SAMESITE': 'Lax',
}

