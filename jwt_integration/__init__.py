# 🔐 INTEGRAÇÃO JWT - SEENTI APP
# Arquivo principal para integração JWT com sistema atual

from .config.jwt_config import get_jwt_config
from .middleware.jwt_middleware import init_jwt_middleware
from .routes.jwt_routes import register_jwt_routes

def init_jwt_system(app):
    """
    Inicializa o sistema JWT na aplicação Flask
    
    Args:
        app: Instância da aplicação Flask
        
    Returns:
        app: Aplicação Flask com JWT configurado
    """
    
    print("🚀 INICIANDO INTEGRAÇÃO JWT - SEENTI APP")
    print("=" * 50)
    
    try:
        # 1. Configurar JWT
        print("1️⃣ Configurando JWT...")
        jwt_config = get_jwt_config()
        app.config.update(jwt_config)
        print("   ✅ Configuração JWT aplicada")
        
        # 2. Inicializar Flask-JWT-Extended
        print("2️⃣ Inicializando Flask-JWT-Extended...")
        from flask_jwt_extended import JWTManager
        jwt = JWTManager(app)
        print("   ✅ JWTManager inicializado")
        
        # 3. Inicializar middleware personalizado
        print("3️⃣ Inicializando middleware JWT...")
        init_jwt_middleware(app)
        print("   ✅ Middleware JWT inicializado")
        
        # 4. Registrar rotas JWT
        print("4️⃣ Registrando rotas JWT...")
        register_jwt_routes(app)
        print("   ✅ Rotas JWT registradas")
        
        print("=" * 50)
        print("🎉 SISTEMA JWT INTEGRADO COM SUCESSO!")
        print("=" * 50)
        
        return app
        
    except Exception as e:
        print(f"❌ ERRO NA INTEGRAÇÃO JWT: {str(e)}")
        print("🔧 Verificar dependências e configurações")
        raise e

# Funções de conveniência para importação
def get_jwt_config_dict():
    """Retorna configuração JWT como dicionário"""
    return get_jwt_config()

def get_jwt_middleware():
    """Retorna instância do middleware JWT"""
    from .middleware.jwt_middleware import jwt_middleware
    return jwt_middleware

def get_jwt_decorators():
    """Retorna decorators JWT para uso em rotas"""
    from .middleware.jwt_middleware import require_jwt, require_user_type, rate_limit_check
    return {
        'require_jwt': require_jwt,
        'require_user_type': require_user_type,
        'rate_limit_check': rate_limit_check
    }
