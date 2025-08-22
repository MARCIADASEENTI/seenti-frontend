# 🔐 ROTAS JWT - SEENTI APP
# Rotas de teste para validação da implementação JWT

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import datetime
import time

# Blueprint para rotas JWT
jwt_bp = Blueprint('jwt', __name__, url_prefix='/jwt')

# Simulação de banco de dados de usuários para testes
test_users = {
    'teste@teste.com': {
        'id': 'test_user_001',
        'email': 'teste@teste.com',
        'senha': '123',
        'tipo_usuario': 'cliente',
        'nome': 'Usuário Teste'
    },
    'admin@seenti.com': {
        'id': 'admin_user_001',
        'email': 'admin@seenti.com',
        'senha': 'admin123',
        'tipo_usuario': 'admin',
        'nome': 'Administrador'
    }
}

@jwt_bp.route('/login', methods=['POST'])
def jwt_login():
    """Rota de login JWT para testes"""
    try:
        data = request.json or {}
        email = data.get('email')
        senha = data.get('senha')
        
        if not email or not senha:
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        # Verifica se usuário existe
        user = test_users.get(email)
        if not user or user['senha'] != senha:
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Cria tokens JWT
        access_token = create_access_token(
            identity=user['id'],
            additional_claims={
                'email': user['email'],
                'tipo_usuario': user['tipo_usuario'],
                'nome': user['nome']
            }
        )
        
        refresh_token = create_refresh_token(
            identity=user['id'],
            additional_claims={
                'email': user['email'],
                'tipo_usuario': user['tipo_usuario']
            }
        )
        
        # Log de sucesso
        print(f"🔐 LOGIN JWT SUCESSO: {email} - {datetime.now()}")
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'tipo_usuario': user['tipo_usuario'],
                'nome': user['nome']
            }
        }), 200
        
    except Exception as e:
        print(f"❌ ERRO LOGIN JWT: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@jwt_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def jwt_refresh():
    """Rota para renovar access token usando refresh token"""
    try:
        current_user_id = get_jwt_identity()
        jwt_data = get_jwt()
        
        # Busca informações do usuário
        user_email = jwt_data.get('email')
        user = None
        
        for email, user_data in test_users.items():
            if user_data['id'] == current_user_id:
                user = user_data
                break
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        # Cria novo access token
        new_access_token = create_access_token(
            identity=user['id'],
            additional_claims={
                'email': user['email'],
                'tipo_usuario': user['tipo_usuario'],
                'nome': user['nome']
            }
        )
        
        print(f"🔄 REFRESH JWT: {user_email} - {datetime.now()}")
        
        return jsonify({
            'message': 'Token renovado com sucesso',
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        print(f"❌ ERRO REFRESH JWT: {str(e)}")
        return jsonify({'error': 'Erro ao renovar token'}), 500

@jwt_bp.route('/logout', methods=['POST'])
@jwt_required()
def jwt_logout():
    """Rota para logout JWT"""
    try:
        current_user_id = get_jwt_identity()
        jwt_data = get_jwt()
        
        # Em uma implementação real, adicionaria o token à blacklist
        # jwt_middleware.blacklist_token(jwt_data.get('jti'))
        
        print(f"🚪 LOGOUT JWT: {current_user_id} - {datetime.now()}")
        
        return jsonify({
            'message': 'Logout realizado com sucesso'
        }), 200
        
    except Exception as e:
        print(f"❌ ERRO LOGOUT JWT: {str(e)}")
        return jsonify({'error': 'Erro ao fazer logout'}), 500

@jwt_bp.route('/profile', methods=['GET'])
@jwt_required()
def jwt_profile():
    """Rota protegida para obter perfil do usuário"""
    try:
        current_user_id = get_jwt_identity()
        jwt_data = get_jwt()
        
        # Busca informações do usuário
        user_email = jwt_data.get('email')
        user = None
        
        for email, user_data in test_users.items():
            if user_data['id'] == current_user_id:
                user = user_data
                break
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        print(f"👤 PERFIL JWT: {user_email} - {datetime.now()}")
        
        return jsonify({
            'message': 'Perfil obtido com sucesso',
            'user': {
                'id': user['id'],
                'email': user['email'],
                'tipo_usuario': user['tipo_usuario'],
                'nome': user['nome']
            },
            'token_info': {
                'issued_at': jwt_data.get('iat'),
                'expires_at': jwt_data.get('exp'),
                'token_type': 'access'
            }
        }), 200
        
    except Exception as e:
        print(f"❌ ERRO PERFIL JWT: {str(e)}")
        return jsonify({'error': 'Erro ao obter perfil'}), 500

@jwt_bp.route('/test', methods=['GET'])
@jwt_required()
def jwt_test():
    """Rota de teste simples para validar JWT"""
    try:
        current_user_id = get_jwt_identity()
        jwt_data = get_jwt()
        
        print(f"🧪 TESTE JWT: {current_user_id} - {datetime.now()}")
        
        return jsonify({
            'message': 'JWT funcionando perfeitamente!',
            'user_id': current_user_id,
            'timestamp': datetime.now().isoformat(),
            'jwt_data': jwt_data
        }), 200
        
    except Exception as e:
        print(f"❌ ERRO TESTE JWT: {str(e)}")
        return jsonify({'error': 'Erro no teste JWT'}), 500

@jwt_bp.route('/status', methods=['GET'])
def jwt_status():
    """Rota para verificar status do sistema JWT"""
    try:
        return jsonify({
            'message': 'Sistema JWT funcionando',
            'status': 'active',
            'timestamp': datetime.now().isoformat(),
            'endpoints': [
                '/jwt/login - Login JWT',
                '/jwt/refresh - Renovar token',
                '/jwt/logout - Logout',
                '/jwt/profile - Perfil do usuário',
                '/jwt/test - Teste JWT',
                '/jwt/status - Status do sistema'
            ]
        }), 200
        
    except Exception as e:
        print(f"❌ ERRO STATUS JWT: {str(e)}")
        return jsonify({'error': 'Erro ao verificar status'}), 500

# Função para registrar o blueprint
def register_jwt_routes(app):
    """Registra as rotas JWT na aplicação Flask"""
    app.register_blueprint(jwt_bp)
    print("✅ Rotas JWT registradas com sucesso")
    return app

