# 🔐 MIDDLEWARE JWT - SEENTI APP
# Middleware para autenticação e autorização JWT

from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import (
    verify_jwt_in_request, 
    get_jwt_identity, 
    get_jwt,
    jwt_required
)
from datetime import datetime
import time

class JWTMiddleware:
    """Middleware para autenticação e autorização JWT"""
    
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        """Inicializa o middleware com a aplicação Flask"""
        self.app = app
        
        # Configurações de rate limiting
        self.rate_limit_store = {}
        self.rate_limit_attempts = 5
        self.rate_limit_window = 300  # 5 minutos
        
        # Configurações de blacklist
        self.token_blacklist = set()
    
    def rate_limit_check(self, ip_address):
        """Verifica se o IP não excedeu o limite de tentativas"""
        current_time = time.time()
        
        if ip_address not in self.rate_limit_store:
            self.rate_limit_store[ip_address] = {
                'attempts': 0,
                'reset_time': current_time + self.rate_limit_window
            }
        
        # Reset se passou a janela de tempo
        if current_time > self.rate_limit_store[ip_address]['reset_time']:
            self.rate_limit_store[ip_address] = {
                'attempts': 0,
                'reset_time': current_time + self.rate_limit_window
            }
        
        # Verifica se excedeu o limite
        if self.rate_limit_store[ip_address]['attempts'] >= self.rate_limit_attempts:
            return False
        
        return True
    
    def increment_rate_limit(self, ip_address):
        """Incrementa o contador de tentativas para um IP"""
        if ip_address in self.rate_limit_store:
            self.rate_limit_store[ip_address]['attempts'] += 1
    
    def blacklist_token(self, token):
        """Adiciona token à blacklist (para logout)"""
        self.token_blacklist.add(token)
    
    def is_token_blacklisted(self, token):
        """Verifica se token está na blacklist"""
        return token in self.token_blacklist
    
    def require_jwt(self, f):
        """Decorator para rotas que requerem autenticação JWT"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Verifica se o token JWT é válido
                verify_jwt_in_request()
                
                # Obtém informações do token
                current_user_id = get_jwt_identity()
                jwt_data = get_jwt()
                
                # Verifica se o token não está na blacklist
                if self.is_token_blacklisted(jwt_data.get('jti')):
                    return jsonify({'error': 'Token invalidado'}), 401
                
                # Adiciona informações do usuário ao request
                request.current_user_id = current_user_id
                request.jwt_data = jwt_data
                
                return f(*args, **kwargs)
                
            except Exception as e:
                return jsonify({'error': 'Token inválido ou expirado'}), 401
        
        return decorated_function
    
    def require_user_type(self, required_type):
        """Decorator para verificar tipo de usuário"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                try:
                    # Verifica se o token JWT é válido
                    verify_jwt_in_request()
                    
                    # Obtém informações do token
                    current_user_id = get_jwt_identity()
                    jwt_data = get_jwt()
                    
                    # Verifica tipo de usuário
                    user_type = jwt_data.get('tipo_usuario')
                    if user_type != required_type:
                        return jsonify({'error': 'Tipo de usuário não autorizado'}), 403
                    
                    # Adiciona informações do usuário ao request
                    request.current_user_id = current_user_id
                    request.jwt_data = jwt_data
                    
                    return f(*args, **kwargs)
                    
                except Exception as e:
                    return jsonify({'error': 'Token inválido ou expirado'}), 401
            
            return decorated_function
        return decorator
    
    def log_authentication_attempt(self, ip_address, success, user_id=None):
        """Registra tentativa de autenticação para auditoria"""
        timestamp = datetime.now().isoformat()
        log_entry = {
            'timestamp': timestamp,
            'ip_address': ip_address,
            'success': success,
            'user_id': user_id,
            'endpoint': request.endpoint,
            'method': request.method
        }
        
        # Em produção, salvaria no banco de dados
        print(f"🔐 LOG AUTENTICAÇÃO: {log_entry}")
        
        return log_entry

# Instância global do middleware
jwt_middleware = JWTMiddleware()

# Decorators de conveniência
def require_jwt(f):
    """Decorator para rotas que requerem autenticação JWT"""
    return jwt_middleware.require_jwt(f)

def require_user_type(required_type):
    """Decorator para verificar tipo de usuário"""
    return jwt_middleware.require_user_type(required_type)

def rate_limit_check():
    """Decorator para verificar rate limiting"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            ip_address = request.remote_addr
            
            if not jwt_middleware.rate_limit_check(ip_address):
                return jsonify({
                    'error': 'Muitas tentativas. Tente novamente em 5 minutos.'
                }), 429
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Função para inicializar o middleware
def init_jwt_middleware(app):
    """Inicializa o middleware JWT na aplicação Flask"""
    jwt_middleware.init_app(app)
    return jwt_middleware

