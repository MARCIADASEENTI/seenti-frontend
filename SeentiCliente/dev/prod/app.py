from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import os
import re  # ✅ Adicionado para tratar CPF
import sys

load_dotenv()  # ✅ Carrega as variáveis do .env
print(f"MONGO_URI: {os.getenv('MONGO_URI')}", file=sys.stderr)
import ssl
print("🔐 RENDER - OpenSSL version usada:", ssl.OPENSSL_VERSION)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://frontend-seenti-app.vercel.app"]}}, supports_credentials=True)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

mongo = PyMongo(app)
db = mongo.db
usuarios = db["usuarios"]

# --- Coleções ---
usuarios = db["usuarios"]
clientes = db["clientes"]
anamneses = db["anamneses"]
termos_uso = db["termos_uso"]
progresso_usuario = db["progresso_usuario"]
agendamentos = db["agendamentos"]
terapeutas = db["terapeutas"]
configuracoes_clientes = db["configuracoes_clientes"]


# --- LOGIN ---
@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    # Busca o usuário pelo email
    usuario = usuarios.find_one({"email": email})
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    # Verifica a senha
    if not check_password_hash(usuario["senha"], senha):
        return jsonify({"erro": "Senha incorreta"}), 401

    return jsonify({
        "usuario_id": str(usuario["_id"]),
        "email": usuario["email"],
        "tipo_usuario": usuario["tipo_usuario"]
    }), 200

# --- LOGIN COM GOOGLE ---
@app.route("/login/google", methods=["POST"])
def login_google():
    data = request.json or {}
    credential = data.get("credential")

    if not credential:
        return jsonify({"erro": "Credencial do Google é obrigatória"}), 400

    try:
        # Aqui você validaria o token do Google
        # Por enquanto, vamos simular a validação
        # Em produção, use a biblioteca google-auth-library
        
        # Decodifica o JWT token (simplificado)
        import base64
        import json
        
        # Remove o header do JWT e decodifica o payload
        parts = credential.split('.')
        if len(parts) != 3:
            return jsonify({"erro": "Token inválido"}), 400
        
        # Decodifica o payload (parte do meio)
        payload = parts[1]
        # Adiciona padding se necessário
        payload += '=' * (4 - len(payload) % 4)
        
        try:
            decoded_payload = base64.urlsafe_b64decode(payload)
            user_data = json.loads(decoded_payload)
        except:
            return jsonify({"erro": "Erro ao decodificar token"}), 400
        
        # Extrai informações do usuário
        google_email = user_data.get("email")
        google_name = user_data.get("name")
        google_picture = user_data.get("picture")
        
        if not google_email:
            return jsonify({"erro": "Email não encontrado no token"}), 400
        
        # Verifica se o usuário já existe
        usuario_existente = usuarios.find_one({"email": google_email})
        
        if usuario_existente:
            # Usuário existe, retorna dados para login
            return jsonify({
                "usuario_id": str(usuario_existente["_id"]),
                "email": usuario_existente["email"],
                "tipo_usuario": usuario_existente["tipo_usuario"]
            }), 200
        else:
            # Usuário não existe, cria um novo
            novo_usuario = {
                "email": google_email,
                "senha": "",  # Usuários Google não têm senha
                "tipo_usuario": "C",
                "consentimento": True,  # Google já validou
                "tenant_id": "686af5e0bb776faa73fa8e03",
                "data_criacao": datetime.now(),
                "data_atualizacao": datetime.now(),
                "ativo": True,
                "google_data": {
                    "name": google_name,
                    "picture": google_picture
                }
            }
            
            resultado = usuarios.insert_one(novo_usuario)
            
            return jsonify({
                "usuario_id": str(resultado.inserted_id),
                "email": google_email,
                "tipo_usuario": "C"
            }), 201
            
    except Exception as e:
        print(f"Erro no login Google: {e}")
        return jsonify({"erro": "Erro interno no servidor"}), 500

# --- CADASTRO USUÁRIO ---
@app.route("/usuarios", methods=["POST"])
def criar_usuario():
    data = request.json or {}
    email = data.get("email")
    senha = data.get("senha")
    tipo_usuario = data.get("tipo_usuario", "C")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    # Validação de formato de email
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return jsonify({"erro": "Formato de email inválido"}), 400

    # Validação de senha forte
    if len(senha) < 8:
        return jsonify({"erro": "Senha deve ter pelo menos 8 caracteres"}), 400
    
    if not any(c.isalpha() for c in senha):
        return jsonify({"erro": "Senha deve conter pelo menos 1 letra"}), 400
    
    if not any(c.isdigit() for c in senha):
        return jsonify({"erro": "Senha deve conter pelo menos 1 número"}), 400
    
    caracteres_especiais = r'!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?'
    if not any(c in caracteres_especiais for c in senha):
        return jsonify({"erro": "Senha deve conter pelo menos 1 caractere especial"}), 400

    if usuarios.find_one({"email": email}):
        return jsonify({"erro": "Email já cadastrado"}), 409

    senha_hash = generate_password_hash(senha)
    novo_usuario = {
        "email": email,
        "senha": senha_hash,
        "tipo_usuario": tipo_usuario,
        "consentimento": False,
        "tenant_id": data.get("tenant_id", "686af5e0bb776faa73fa8e03"),
        "data_criacao": datetime.now(),
        "data_atualizacao": datetime.now(),
        "ativo": True
    }
    resultado = usuarios.insert_one(novo_usuario)
    return jsonify({"mensagem": "Usuário criado com sucesso", "usuario_id": str(resultado.inserted_id)}), 201

# --- VERIFICAÇÃO DE EMAIL ---
@app.route("/usuarios/verificar-email/<email>", methods=["GET"])
def verificar_email(email):
    if usuarios.find_one({"email": email}):
        return jsonify({"erro": "Email já cadastrado"}), 409
    return jsonify({"mensagem": "Email disponível"}), 200

# --- TERMO DE USO ---
from datetime import datetime
from bson import ObjectId

@app.route("/termos_uso", methods=["POST"])
def aceitar_termo_uso():
    data = request.json or {}
    usuario_id = data.get("usuario_id")
    consentimento = data.get("consentimento")

    if not usuario_id:
        return jsonify({"erro": "Campo 'usuario_id' é obrigatório."}), 400

    if consentimento is not True:
        return jsonify({"erro": "O consentimento deve ser True."}), 400

    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "ID de usuário inválido."}), 400

    usuario = usuarios.find_one({"_id": usuario_obj_id})
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    # Verifica se já existe registro anterior
    termo_existente = termos_uso.find_one({"usuario_id": usuario_id})
    if termo_existente:
        return jsonify({"mensagem": "Termo já aceito anteriormente."}), 200

    # Salva novo termo
    termos_uso.insert_one({
        "usuario_id": usuario_id,
        "consentimento": True,
        "data_aceite": datetime.utcnow()
    })

    return jsonify({"mensagem": "Termo de uso aceito com sucesso."}), 201


@app.route("/termos_texto", methods=["GET"])
def obter_termos():
    texto_completo = """
    TERMO DE CONSENTIMENTO E USO

    Este aplicativo coleta dados pessoais e de saúde para viabilizar o atendimento personalizado em Terapias Integrativas.
    Ao continuar, você declara estar ciente e de acordo com:

    - O uso dos dados para fins de registro clínico, evolução terapêutica e contato.
    - O armazenamento seguro das informações, em conformidade com a LGPD.
    - A possibilidade de revogar este consentimento a qualquer momento, solicitando a exclusão dos dados.

    Em caso de dúvidas, entre em contato com nossa equipe.

    """

    return jsonify({"termo": texto_completo.strip()}), 200

@app.route("/termo-assinado/<usuario_id>", methods=["GET"])
def verificar_termo_assinado(usuario_id):
    termo = termos_uso.find_one({"usuario_id": usuario_id})

    if not termo:
        return jsonify({"assinado": False}), 200

    return jsonify({"assinado": True}), 200

# --- CLIENTE ---
@app.route("/clientes", methods=["POST"])
def cadastrar_cliente():
    data = request.json or {}
    
    # Debug: imprimir dados recebidos
    print(f"Dados recebidos: {data}")

    # Campos obrigatórios
    campos_obrigatorios = ["usuario_id", "primeiro_nome", "sobrenome", "cpf", "data_nascimento"]
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return jsonify({"erro": f"Campo '{campo}' é obrigatório."}), 400

    # Validação de CPF
    cpf = re.sub(r'[^0-9]', '', data["cpf"])
    if len(cpf) != 11:
        return jsonify({"erro": "CPF inválido"}), 400
    
    # Verifica se todos os dígitos são iguais
    if cpf == cpf[0] * 11:
        return jsonify({"erro": "CPF inválido"}), 400
    
    # Validação dos dígitos verificadores
    for i in range(9, 11):
        value = sum((int(cpf[num]) * ((i + 1) - num) for num in range(0, i)))
        digit = ((value * 10) % 11) % 10
        if int(cpf[i]) != digit:
            return jsonify({"erro": "CPF inválido"}), 400

    # Validação de idade
    try:
        data_nasc = datetime.strptime(data["data_nascimento"], "%Y-%m-%d")
        hoje = datetime.now()
        idade = hoje.year - data_nasc.year
        if hoje.month < data_nasc.month or (hoje.month == data_nasc.month and hoje.day < data_nasc.day):
            idade -= 1
        if idade < 18:
            return jsonify({"erro": "É necessário ter 18 anos ou mais"}), 400
    except (ValueError, TypeError):
        return jsonify({"erro": "Data de nascimento inválida"}), 400

    # Verificar telefone (pode estar no nível raiz ou no subdocumento contato)
    telefone = None
    if data.get("telefone"):
        telefone = data["telefone"]
    elif data.get("contato", {}).get("telefone"):
        telefone = data["contato"]["telefone"]
    else:
        return jsonify({"erro": "Campo 'telefone' é obrigatório."}), 400

    # Validação de endereço (novo)
    endereco = data.get("endereco", {})
    campos_endereco_obrigatorios = ["rua", "numero", "bairro", "cidade", "estado", "cep"]
    for campo in campos_endereco_obrigatorios:
        if not endereco.get(campo):
            return jsonify({"erro": f"Campo de endereço '{campo}' é obrigatório"}), 400
    
    # Validação de CEP (formato brasileiro)
    cep = re.sub(r'[^0-9]', '', endereco.get("cep", ""))
    if not re.match(r'^\d{8}$', cep):
        return jsonify({"erro": "CEP inválido. Use formato: 00000-000"}), 400
    
    # Validação de estado (sigla brasileira)
    estados_validos = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]
    if endereco.get("estado") not in estados_validos:
        return jsonify({"erro": "Estado inválido. Use sigla brasileira (ex: SP, RJ, MG)"}), 400

    # Verificar se CPF já existe
    print(f"🔍 Verificando se CPF {cpf} já existe na base...")
    cpf_existente = clientes.find_one({"cpf": cpf})
    if cpf_existente:
        print(f"❌ CPF {cpf} já existe na base!")
        return jsonify({"erro": "CPF já cadastrado"}), 409
    else:
        print(f"✅ CPF {cpf} não existe na base, pode prosseguir")

    try:
        # Debug: verificar usuario_id
        print(f"usuario_id recebido: {data['usuario_id']}")
        usuario_obj_id = ObjectId(data["usuario_id"])
        print(f"usuario_id convertido: {usuario_obj_id}")
        
        # Preparar dados para inserção com nova estrutura
        dados_cliente = {
            "usuario_id": usuario_obj_id,
            "primeiro_nome": data["primeiro_nome"].strip(),
            "sobrenome": data["sobrenome"].strip(),
            "nome_social": data.get("nome_social", "").strip() or None,
            "cpf": cpf,
            "data_nascimento": data_nasc,
            "genero": data.get("genero") or None,
            
            # Subdocumento contato
            "contato": {
                "telefone": telefone,
                "email_alternativo": data.get("email_alternativo", "").strip() or None
            },
            
            # Subdocumento endereco
            "endereco": {
                "rua": data.get("endereco", {}).get("rua", "").strip(),
                "numero": data.get("endereco", {}).get("numero", "").strip(),
                "complemento": data.get("endereco", {}).get("complemento", "").strip() or None,
                "bairro": data.get("endereco", {}).get("bairro", "").strip(),
                "cidade": data.get("endereco", {}).get("cidade", "").strip(),
                "estado": data.get("endereco", {}).get("estado", "").strip(),
                "cep": data.get("endereco", {}).get("cep", "").strip()
            },
            
            "tenant_id": data.get("tenant_id", "686af5e0bb776faa73fa8e03"),  # Tenant padrão
            "status": "pendente",
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        }
        
        resultado = clientes.insert_one(dados_cliente)
        return jsonify({"mensagem": "Cliente cadastrado", "cliente_id": str(resultado.inserted_id)}), 201
    except Exception as e:
        print(f"Erro detalhado: {str(e)}")
        return jsonify({"erro": f"Erro ao cadastrar cliente: {str(e)}"}), 500

@app.route("/clientes/<cliente_id>", methods=["GET"])
def buscar_cliente(cliente_id):
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    cliente["_id"] = str(cliente["_id"])
    cliente["usuario_id"] = str(cliente["usuario_id"])
    return jsonify(cliente), 200

#Novo endpoint

@app.route("/clientes/usuario/<usuario_id>", methods=["GET"])
def buscar_cliente_por_usuario(usuario_id):
    try:
        obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "ID de usuário inválido"}), 400

    cliente = clientes.find_one({"usuario_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado para este usuário"}), 404

    cliente["_id"] = str(cliente["_id"])
    cliente["usuario_id"] = str(cliente["usuario_id"])
    return jsonify(cliente), 200

# --- ANAMNESE ---
@app.route("/anamneses", methods=["POST"])
def criar_anamnese():
    data = request.json or {}
    cliente_id = data.get("cliente_id")
    dados_anamnese = data.get("dados")

    if not cliente_id or not dados_anamnese:
        return jsonify({"erro": "cliente_id e dados são obrigatórios"}), 400

    try:
        cliente_obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se cliente existe
    cliente = clientes.find_one({"_id": cliente_obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Verificar se já existe anamnese para este cliente (regra de negócio)
    anamnese_existente = anamneses.find_one({"cliente_id": cliente_obj_id})
    if anamnese_existente:
        return jsonify({"erro": "Cliente já possui uma anamnese registrada"}), 409

    # Validação dos campos obrigatórios
    campos_obrigatorios = [
        "objetivo", "area_enfase", "dor_atual", "funcionamento_intestinal",
        "stress_diario", "enxaqueca", "depressao", "insonia", "dor_mandibula",
        "bruxismo", "disturbio_renal", "antecedente_oncologico", "pedra_rim",
        "pedra_vesicula", "doenca_cronica", "email", "whatsapp"
    ]
    
    for campo in campos_obrigatorios:
        if campo not in dados_anamnese:
            return jsonify({"erro": f"Campo obrigatório '{campo}' não encontrado"}), 400

    # Validação de tipos de dados
    campos_booleanos = [
        "enxaqueca", "depressao", "insonia", "dor_mandibula", "bruxismo",
        "disturbio_renal", "antecedente_oncologico", "pedra_rim",
        "pedra_vesicula", "doenca_cronica"
    ]
    
    for campo in campos_booleanos:
        if not isinstance(dados_anamnese[campo], bool):
            return jsonify({"erro": f"Campo '{campo}' deve ser true ou false"}), 400

    # Validação de email
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    if not re.match(email_regex, dados_anamnese["email"]):
        return jsonify({"erro": "Formato de email inválido"}), 400

    # Validação de WhatsApp (formato brasileiro opcional)
    whatsapp_regex = r'^\(?\d{2}\)? ?\d{4,5}-?\d{4}$'
    if not re.match(whatsapp_regex, dados_anamnese["whatsapp"]):
        return jsonify({"erro": "Formato de WhatsApp inválido. Use: (31) 99999-9999"}), 400

    # Validação de funcionamento intestinal
    valores_validos_intestino = ["normal", "preso", "solto"]
    if dados_anamnese["funcionamento_intestinal"].lower() not in valores_validos_intestino:
        return jsonify({"erro": "Funcionamento intestinal deve ser: normal, preso ou solto"}), 400

    # Validação de stress diário
    valores_validos_stress = ["baixo", "moderado", "alto"]
    if dados_anamnese["stress_diario"].lower() not in valores_validos_stress:
        return jsonify({"erro": "Stress diário deve ser: baixo, moderado ou alto"}), 400

    # Preparar dados para inserção
    anamnese_data = {
        "cliente_id": cliente_obj_id,
        "data_envio": datetime.now(),
        "dados": {
            "objetivo": dados_anamnese["objetivo"].strip(),
            "area_enfase": dados_anamnese["area_enfase"].strip(),
            "dor_atual": dados_anamnese["dor_atual"].strip(),
            "funcionamento_intestinal": dados_anamnese["funcionamento_intestinal"].lower(),
            "anticoncepcional": dados_anamnese.get("anticoncepcional", "").strip() or None,
            "alimentacao": dados_anamnese.get("alimentacao", "").strip() or None,
            "stress_diario": dados_anamnese["stress_diario"].lower(),
            "enxaqueca": dados_anamnese["enxaqueca"],
            "depressao": dados_anamnese["depressao"],
            "insonia": dados_anamnese["insonia"],
            "dor_mandibula": dados_anamnese["dor_mandibula"],
            "bruxismo": dados_anamnese["bruxismo"],
            "disturbio_renal": dados_anamnese["disturbio_renal"],
            "antecedente_oncologico": dados_anamnese["antecedente_oncologico"],
            "pedra_rim": dados_anamnese["pedra_rim"],
            "pedra_vesicula": dados_anamnese["pedra_vesicula"],
            "doenca_cronica": dados_anamnese["doenca_cronica"],
            "observacoes_saude": dados_anamnese.get("observacoes_saude", "").strip() or None,
            "nao_gosta_massagem_em": dados_anamnese.get("nao_gosta_massagem_em", "").strip() or None,
            "email": dados_anamnese["email"].strip(),
            "whatsapp": dados_anamnese["whatsapp"].strip()
        }
    }
    
    resultado = anamneses.insert_one(anamnese_data)
    return jsonify({
        "mensagem": "Anamnese registrada com sucesso", 
        "anamnese_id": str(resultado.inserted_id)
    }), 201

@app.route("/anamneses/cliente/<cliente_id>", methods=["GET"])
def buscar_anamnese(cliente_id):
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    resultado = list(anamneses.find({"cliente_id": obj_id}))
    for doc in resultado:
        doc["_id"] = str(doc["_id"])
        doc["cliente_id"] = str(doc["cliente_id"])
    return jsonify(resultado), 200

# --- PROGRESSO USUÁRIO ---
@app.route("/progresso_usuario", methods=["POST"])
def registrar_progresso():
    """Registra progresso do usuário em uma funcionalidade"""
    data = request.json or {}
    usuario_id = data.get("usuario_id")
    funcionalidade = data.get("funcionalidade")
    etapa = data.get("etapa", 0)
    extra_data = data.get("extra_data", {})

    if not usuario_id or not funcionalidade:
        return jsonify({"erro": "usuario_id e funcionalidade são obrigatórios"}), 400

    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "usuario_id inválido"}), 400

    # Verificar se já existe progresso para esta funcionalidade
    progresso_existente = progresso_usuario.find_one({
        "usuario_id": usuario_obj_id,
        "funcionalidade": funcionalidade
    })

    dados_progresso = {
        "usuario_id": usuario_obj_id,
        "funcionalidade": funcionalidade,
        "etapa": etapa,
        "data_conclusao": datetime.now(),
        "extra_data": extra_data
    }

    if progresso_existente:
        # Atualizar progresso existente
        resultado = progresso_usuario.update_one(
            {"_id": progresso_existente["_id"]},
            {"$set": dados_progresso}
        )
        mensagem = "Progresso atualizado"
    else:
        # Criar novo progresso
        resultado = progresso_usuario.insert_one(dados_progresso)
        mensagem = "Progresso registrado"

    return jsonify({"mensagem": mensagem}), 200

@app.route("/progresso_usuario/<usuario_id>", methods=["GET"])
def buscar_progresso(usuario_id):
    """Busca progresso de um usuário"""
    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "usuario_id inválido"}), 400

    resultado = list(progresso_usuario.find({"usuario_id": usuario_obj_id}))
    for doc in resultado:
        doc["_id"] = str(doc["_id"])
        doc["usuario_id"] = str(doc["usuario_id"])
        doc["data_conclusao"] = doc["data_conclusao"].isoformat()

    return jsonify(resultado), 200

@app.route("/progresso_usuario/<usuario_id>/etapas", methods=["GET"])
def buscar_etapas_concluidas(usuario_id):
    """Retorna etapas concluídas por um usuário"""
    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "usuario_id inválido"}), 400

    etapas_esperadas = [
        {"funcionalidade": "cadastro_usuario", "etapa": 0},
        {"funcionalidade": "aceite_termo", "etapa": 1},
        {"funcionalidade": "cadastro_cliente", "etapa": 2},
        {"funcionalidade": "anamnese_preenchida", "etapa": 3},
        {"funcionalidade": "agendamento", "etapa": 4}
    ]

    progresso_atual = list(progresso_usuario.find({"usuario_id": usuario_obj_id}))
    progresso_dict = {p["funcionalidade"]: p["etapa"] for p in progresso_atual}

    etapas_status = []
    for etapa in etapas_esperadas:
        etapa_atual = progresso_dict.get(etapa["funcionalidade"], -1)
        etapas_status.append({
            "funcionalidade": etapa["funcionalidade"],
            "etapa_esperada": etapa["etapa"],
            "etapa_atual": etapa_atual,
            "concluida": etapa_atual >= etapa["etapa"]
        })

    return jsonify({
        "usuario_id": usuario_id,
        "etapas": etapas_status,
        "total_etapas": len(etapas_esperadas),
        "etapas_concluidas": sum(1 for e in etapas_status if e["concluida"])
    }), 200

# --- AGENDAMENTOS ---
@app.route("/agendamentos", methods=["POST"])
def criar_agendamento():
    """Cria um novo agendamento"""
    data = request.json or {}
    cliente_id = data.get("cliente_id")
    terapeuta_id = data.get("terapeuta_id")
    data_agendamento = data.get("data")
    horario = data.get("horario")
    observacoes = data.get("observacoes", "")

    if not all([cliente_id, terapeuta_id, data_agendamento, horario]):
        return jsonify({"erro": "cliente_id, terapeuta_id, data e horario são obrigatórios"}), 400

    try:
        cliente_obj_id = ObjectId(cliente_id)
        terapeuta_obj_id = ObjectId(terapeuta_id)
    except Exception:
        return jsonify({"erro": "IDs inválidos"}), 400

    # Verificar se cliente existe
    cliente = clientes.find_one({"_id": cliente_obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Verificar se terapeuta existe
    terapeuta = terapeutas.find_one({"_id": terapeuta_obj_id})
    if not terapeuta:
        return jsonify({"erro": "Terapeuta não encontrado"}), 404

    # Verificar se o horário está disponível
    data_obj = datetime.strptime(data_agendamento, "%Y-%m-%d")
    if data_obj < datetime.now().replace(hour=0, minute=0, second=0, microsecond=0):
        return jsonify({"erro": "Não é possível agendar para datas passadas"}), 400

    # Verificar conflito de horário
    conflito = agendamentos.find_one({
        "terapeuta_id": terapeuta_obj_id,
        "data": data_obj,
        "horario": horario,
        "status": {"$nin": ["cancelado"]}
    })
    
    if conflito:
        return jsonify({"erro": "Este horário já está ocupado"}), 409

    # Criar agendamento
    novo_agendamento = {
        "cliente_id": cliente_obj_id,
        "terapeuta_id": terapeuta_obj_id,
        "data": data_obj,
        "horario": horario,
        "observacoes": observacoes.strip(),
        "status": "pendente",
        "tenant_id": cliente.get("tenant_id"),
        "data_criacao": datetime.now(),
        "data_atualizacao": datetime.now()
    }

    resultado = agendamentos.insert_one(novo_agendamento)
    return jsonify({
        "mensagem": "Agendamento criado com sucesso",
        "agendamento_id": str(resultado.inserted_id)
    }), 201

# Função removida - duplicata da linha 1190
# Função removida - duplicata da linha 1220

@app.route("/agendamentos/horarios-disponiveis", methods=["GET"])
def obter_horarios_disponiveis():
    """Retorna horários disponíveis para agendamento"""
    horarios = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
    ]
    
    return jsonify(horarios), 200

# --- TERAPEUTAS ---
@app.route("/terapeutas/disponiveis", methods=["GET"])
def buscar_terapeutas_disponiveis():
    """Retorna lista de terapeutas disponíveis para agendamento"""
    try:
        # Buscar terapeutas ativos
        terapeutas_lista = list(terapeutas.find({"ativo": True}))
        
        # Converter ObjectIds para strings
        for terapeuta in terapeutas_lista:
            terapeuta["_id"] = str(terapeuta["_id"])
            if "usuario_id" in terapeuta:
                terapeuta["usuario_id"] = str(terapeuta["usuario_id"])

        return jsonify(terapeutas_lista), 200
    except Exception as e:
        print(f"Erro ao buscar terapeutas: {str(e)}")
        return jsonify({"erro": "Erro ao buscar terapeutas"}), 500

# --- NOTIFICAÇÕES DO CLIENTE ---
@app.route("/notificacoes/cliente/<cliente_id>", methods=["GET"])
def buscar_notificacoes_cliente(cliente_id):
    """Busca notificações de um cliente específico"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Buscar notificações
    notificacoes = list(db["notificacoes_clientes"].find({"cliente_id": obj_id}).sort("criado_em", -1).limit(50))
    
    # Contar não lidas
    total_nao_lidas = db["notificacoes_clientes"].count_documents({
        "cliente_id": obj_id,
        "status": "nao_lida"
    })
    
    # Converter ObjectIds para string
    for notif in notificacoes:
        notif["_id"] = str(notif["_id"])
        notif["cliente_id"] = str(notif["cliente_id"])

    return jsonify({
        "success": True,
        "data": {
            "notificacoes": notificacoes,
            "total": len(notificacoes),
            "total_nao_lidas": total_nao_lidas
        }
    }), 200

@app.route("/notificacoes/<notificacao_id>/ler", methods=["PATCH"])
def marcar_notificacao_como_lida(notificacao_id):
    """Marca uma notificação como lida"""
    try:
        obj_id = ObjectId(notificacao_id)
    except Exception:
        return jsonify({"erro": "ID de notificação inválido"}), 400

    # Buscar e atualizar notificação
    resultado = db["notificacoes_clientes"].update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": "lida",
                "lida_em": datetime.now()
            }
        }
    )
    
    if resultado.matched_count == 0:
        return jsonify({"erro": "Notificação não encontrada"}), 404

    return jsonify({
        "success": True,
        "message": "Notificação marcada como lida"
    }), 200

@app.route("/notificacoes/cliente/<cliente_id>/ler-todas", methods=["PATCH"])
def marcar_todas_notificacoes_como_lidas(cliente_id):
    """Marca todas as notificações de um cliente como lidas"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Marcar todas como lidas
    resultado = db["notificacoes_clientes"].update_many(
        {"cliente_id": obj_id, "status": "nao_lida"},
        {
            "$set": {
                "status": "lida",
                "lida_em": datetime.now()
            }
        }
    )

    return jsonify({
        "success": True,
        "message": "Todas as notificações foram marcadas como lidas",
        "data": {
            "cliente_id": cliente_id,
            "notificacoes_marcadas": resultado.modified_count
        }
    }), 200

@app.route("/notificacoes/teste", methods=["POST"])
def criar_notificacao_teste():
    """Cria uma notificação de teste para desenvolvimento"""
    try:
        dados = request.json or {}
        cliente_id = dados.get("cliente_id")
        
        if not cliente_id:
            return jsonify({"erro": "cliente_id é obrigatório"}), 400
            
        try:
            obj_id = ObjectId(cliente_id)
        except Exception:
            return jsonify({"erro": "ID de cliente inválido"}), 400

        # Verificar se o cliente existe
        cliente = clientes.find_one({"_id": obj_id})
        if not cliente:
            return jsonify({"erro": "Cliente não encontrado"}), 404

        # Criar notificação de teste
        notificacao = {
            "cliente_id": obj_id,
            "tipo": dados.get("tipo", "sistema"),
            "titulo": "Notificação de Teste",
            "mensagem": "Esta é uma notificação de teste para validar o sistema.",
            "status": "nao_lida",
            "criado_em": datetime.now()
        }
        
        resultado = db["notificacoes_clientes"].insert_one(notificacao)
        
        # Converter ObjectId para string
        notificacao["_id"] = str(resultado.inserted_id)
        notificacao["cliente_id"] = str(notificacao["cliente_id"])

        print(f"✅ Notificação de teste criada para cliente {cliente_id}")

        return jsonify({
            "success": True,
            "message": "Notificação de teste criada com sucesso",
            "data": notificacao
        }), 201
        
    except Exception as e:
        print(f"❌ Erro ao criar notificação de teste: {str(e)}")
        return jsonify({"erro": "Erro interno do servidor"}), 500

# --- CONFIGURAÇÕES DO CLIENTE ---
@app.route("/configuracoes/cliente/<cliente_id>", methods=["GET"])
def buscar_configuracoes_cliente(cliente_id):
    """Busca configurações de um cliente específico"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Buscar configurações
    configuracoes = db["configuracoes_clientes"].find_one({"cliente_id": obj_id})
    
    if not configuracoes:
        return jsonify({"erro": "Configurações não encontradas para este cliente"}), 404

    # Converter ObjectId para string
    configuracoes["_id"] = str(configuracoes["_id"])
    configuracoes["cliente_id"] = str(configuracoes["cliente_id"])

    return jsonify(configuracoes), 200

@app.route("/configuracoes/cliente/<cliente_id>", methods=["POST"])
def salvar_configuracoes_cliente(cliente_id):
    """Cria ou atualiza configurações de um cliente"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    dados_configuracao = request.json or {}
    
    # Preparar dados para salvamento
    dados_para_salvar = {}
    
    # Mapear estrutura do frontend para estrutura do MongoDB
    if "notificacoes_email" in dados_configuracao:
        dados_para_salvar["notificacoes.email"] = dados_configuracao["notificacoes_email"]
    if "notificacoes_push" in dados_configuracao:
        dados_para_salvar["notificacoes.push"] = dados_configuracao["notificacoes_push"]
    if "notificacoes_agendamentos" in dados_configuracao:
        dados_para_salvar["notificacoes.agendamentos"] = dados_configuracao["notificacoes_agendamentos"]
    if "notificacoes_lembretes" in dados_configuracao:
        dados_para_salvar["notificacoes.lembretes"] = dados_configuracao["notificacoes_lembretes"]
    if "notificacoes_promocoes" in dados_configuracao:
        dados_para_salvar["notificacoes.promocoes"] = dados_configuracao["notificacoes_promocoes"]
    
    if "perfil_publico" in dados_configuracao:
        dados_para_salvar["privacidade.perfil_publico"] = dados_configuracao["perfil_publico"]
    if "compartilhar_dados" in dados_configuracao:
        dados_para_salvar["privacidade.compartilhar_dados"] = dados_configuracao["compartilhar_dados"]
    if "receber_contatos" in dados_configuracao:
        dados_para_salvar["privacidade.receber_contatos"] = dados_configuracao["receber_contatos"]
    
    if "idioma" in dados_configuracao:
        dados_para_salvar["preferencias.idioma"] = dados_configuracao["idioma"]
    if "tema" in dados_configuracao:
        dados_para_salvar["preferencias.tema"] = dados_configuracao["tema"]
    if "fuso_horario" in dados_configuracao:
        dados_para_salvar["preferencias.fuso_horario"] = dados_configuracao["fuso_horario"]

    # Adicionar metadados
    dados_para_salvar["atualizado_em"] = datetime.now()

    # Criar ou atualizar configurações
    resultado = db["configuracoes_clientes"].update_one(
        {"cliente_id": obj_id},
        {
            "$set": dados_para_salvar,
            "$setOnInsert": {"criado_em": datetime.now()}
        },
        upsert=True
    )

    # Log de sucesso
    print(f"✅ Configurações salvas para cliente {cliente_id}:", dados_para_salvar)

    return jsonify({
        "mensagem": "Configurações salvas com sucesso",
        "cliente_id": cliente_id,
        "configuracoes_salvas": dados_para_salvar
    }), 200

@app.route("/configuracoes/cliente/<cliente_id>", methods=["PATCH"])
def atualizar_configuracao_cliente(cliente_id):
    """Atualiza configuração específica de um cliente"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    dados = request.json or {}
    campo = dados.get("campo")
    valor = dados.get("valor")

    if not campo or valor is None:
        return jsonify({"erro": "Campo e valor são obrigatórios"}), 400

    # Buscar configurações existentes
    configuracoes = db["configuracoes_clientes"].find_one({"cliente_id": obj_id})
    
    # Se não existir, criar com valores padrão
    if not configuracoes:
        configuracoes_padrao = {
            "cliente_id": obj_id,
            "notificacoes": {
                "email": True,
                "push": True,
                "agendamentos": True,
                "lembretes": True,
                "promocoes": False
            },
            "privacidade": {
                "perfil_publico": False,
                "compartilhar_dados": False,
                "receber_contatos": False
            },
            "preferencias": {
                "idioma": "pt-BR",
                "tema": "claro",
                "fuso_horario": "America/Sao_Paulo"
            },
            "criado_em": datetime.now(),
            "atualizado_em": datetime.now()
        }
        db["configuracoes_clientes"].insert_one(configuracoes_padrao)

    # Atualizar configuração específica
    resultado = db["configuracoes_clientes"].update_one(
        {"cliente_id": obj_id},
        {
            "$set": {
                campo: valor,
                "atualizado_em": datetime.now()
            }
        }
    )

    # Log de sucesso
    print(f"✅ Configuração atualizada para cliente {cliente_id}:", {campo, valor})

    return jsonify({
        "mensagem": "Configuração atualizada com sucesso",
        "campo": campo,
        "valor": valor
    }), 200

@app.route("/configuracoes/cliente/<cliente_id>", methods=["DELETE"])
def deletar_configuracoes_cliente(cliente_id):
    """Deleta configurações de um cliente"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Deletar configurações
    resultado = db["configuracoes_clientes"].delete_one({"cliente_id": obj_id})
    
    if resultado.deleted_count == 0:
        return jsonify({"erro": "Configurações não encontradas para este cliente"}), 404

    # Log de sucesso
    print(f"✅ Configurações deletadas para cliente {cliente_id}")

    return jsonify({"mensagem": "Configurações deletadas com sucesso"}), 200

# ===== SISTEMA DE AGENDAMENTOS =====

@app.route("/agendamentos/cliente/<cliente_id>", methods=["POST"])
def criar_agendamento_cliente(cliente_id):
    """Cria nova solicitação de agendamento para um cliente"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    dados = request.json or {}
    data_solicitada = dados.get("data_solicitada")
    hora_solicitada = dados.get("hora_solicitada")
    observacoes = dados.get("observacoes", "")

    # Validações básicas
    if not data_solicitada or not hora_solicitada:
        return jsonify({"erro": "Data e hora são obrigatórias"}), 400

    # Validar formato da data
    try:
        data = datetime.fromisoformat(data_solicitada.replace('Z', '+00:00'))
        if data < datetime.now():
            return jsonify({"erro": "Não é possível solicitar agendamento para datas passadas"}), 400
    except ValueError:
        return jsonify({"erro": "Formato de data inválido"}), 400

    # Validar formato da hora (HH:MM)
    if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', hora_solicitada):
        return jsonify({"erro": "Formato de hora inválido. Use HH:MM"}), 400

    # Verificar se não há conflito de horário para o mesmo cliente
    conflito = agendamentos.find_one({
        "cliente_id": obj_id,
        "data_solicitada": data,
        "hora_solicitada": hora_solicitada,
        "status": {"$in": ["pendente", "confirmado"]}
    })

    if conflito:
        return jsonify({"erro": "Já existe um agendamento para esta data e horário"}), 400

    # Criar o agendamento
    novo_agendamento = {
        "cliente_id": obj_id,
        "data_solicitada": data,
        "hora_solicitada": hora_solicitada,
        "observacoes": observacoes,
        "status": "pendente",
        "criado_em": datetime.now(),
        "atualizado_em": datetime.now()
    }

    resultado = agendamentos.insert_one(novo_agendamento)
    novo_agendamento["_id"] = resultado.inserted_id

    # Log de sucesso
    print(f"✅ Agendamento criado para cliente {cliente_id}:", novo_agendamento["_id"])

    return jsonify({
        "mensagem": "Agendamento solicitado com sucesso!",
        "agendamento": novo_agendamento
    }), 201

@app.route("/agendamentos/cliente/<cliente_id>", methods=["GET"])
def buscar_agendamentos_cliente(cliente_id):
    """Busca agendamentos de um cliente específico"""
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se o cliente existe
    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Buscar agendamentos do cliente
    agendamentos_cliente = list(agendamentos.find({"cliente_id": obj_id})
        .sort([("data_solicitada", 1), ("hora_solicitada", 1)]))
    
    # Converter ObjectIds para string
    for agendamento in agendamentos_cliente:
        agendamento["_id"] = str(agendamento["_id"])
        agendamento["cliente_id"] = str(agendamento["cliente_id"])

    # Log de sucesso
    print(f"✅ {len(agendamentos_cliente)} agendamentos encontrados para cliente {cliente_id}")

    return jsonify({
        "mensagem": "Agendamentos encontrados com sucesso",
        "agendamentos": agendamentos_cliente,
        "total": len(agendamentos_cliente)
    }), 200

@app.route("/agendamentos/<agendamento_id>/cancelar", methods=["PATCH"])
def cancelar_agendamento(agendamento_id):
    """Cancela um agendamento (apenas se pendente)"""
    try:
        obj_id = ObjectId(agendamento_id)
    except Exception:
        return jsonify({"erro": "ID de agendamento inválido"}), 400

    dados = request.json or {}
    cliente_id = dados.get("cliente_id")

    if not cliente_id:
        return jsonify({"erro": "ID do cliente é obrigatório"}), 400

    try:
        cliente_obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Buscar o agendamento
    agendamento = agendamentos.find_one({"_id": obj_id})
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    # Verificar se pertence ao cliente
    if agendamento["cliente_id"] != cliente_obj_id:
        return jsonify({"erro": "Não autorizado a cancelar este agendamento"}), 403

    # Verificar se pode ser cancelado
    if agendamento["status"] != "pendente":
        return jsonify({"erro": "Apenas agendamentos pendentes podem ser cancelados"}), 400

    # Cancelar o agendamento
    resultado = agendamentos.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": "cancelado",
                "atualizado_em": datetime.now()
            }
        }
    )

    if resultado.modified_count == 0:
        return jsonify({"erro": "Erro ao cancelar agendamento"}), 500

    # Log de sucesso
    print(f"✅ Agendamento {agendamento_id} cancelado pelo cliente {cliente_id}")

    return jsonify({
        "mensagem": "Agendamento cancelado com sucesso",
        "agendamento_id": agendamento_id
    }), 200

@app.route("/agendamentos/<agendamento_id>/observacoes", methods=["PATCH"])
def atualizar_observacoes_agendamento(agendamento_id):
    """Atualiza observações de um agendamento"""
    try:
        obj_id = ObjectId(agendamento_id)
    except Exception:
        return jsonify({"erro": "ID de agendamento inválido"}), 400

    dados = request.json or {}
    cliente_id = dados.get("cliente_id")
    observacoes = dados.get("observacoes")

    if not cliente_id or observacoes is None:
        return jsonify({"erro": "ID do cliente e observações são obrigatórios"}), 400

    try:
        cliente_obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Buscar o agendamento
    agendamento = agendamentos.find_one({"_id": obj_id})
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    # Verificar se pertence ao cliente
    if agendamento["cliente_id"] != cliente_obj_id:
        return jsonify({"erro": "Não autorizado a atualizar este agendamento"}), 403

    # Verificar se pode ser editado
    if agendamento["status"] != "pendente":
        return jsonify({"erro": "Apenas agendamentos pendentes podem ser editados"}), 400

    # Atualizar observações
    resultado = agendamentos.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "observacoes": observacoes,
                "atualizado_em": datetime.now()
            }
        }
    )

    if resultado.modified_count == 0:
        return jsonify({"erro": "Erro ao atualizar observações"}), 500

    # Log de sucesso
    print(f"✅ Observações atualizadas para agendamento {agendamento_id}")

    return jsonify({
        "mensagem": "Observações atualizadas com sucesso",
        "agendamento_id": agendamento_id
    }), 200

# ===== ROTAS PARA TERAPEUTAS (PRÓXIMA SPRINT) =====

@app.route("/agendamentos/pendentes", methods=["GET"])
def buscar_agendamentos_pendentes():
    """Busca todos os agendamentos pendentes (para terapeutas)"""
    try:
        # Buscar agendamentos pendentes
        agendamentos_pendentes = list(agendamentos.find({"status": "pendente"})
            .sort([("data_solicitada", 1), ("hora_solicitada", 1)]))
        
        # Converter ObjectIds para string e popular dados do cliente
        for agendamento in agendamentos_pendentes:
            agendamento["_id"] = str(agendamento["_id"])
            agendamento["cliente_id"] = str(agendamento["cliente_id"])
            
            # Buscar dados básicos do cliente
            cliente = clientes.find_one({"_id": ObjectId(agendamento["cliente_id"])})
            if cliente:
                agendamento["cliente"] = {
                    "nome": cliente.get("nome", ""),
                    "email": cliente.get("email", ""),
                    "telefone": cliente.get("telefone", "")
                }

        # Log de sucesso
        print(f"✅ {len(agendamentos_pendentes)} agendamentos pendentes encontrados")

        return jsonify({
            "mensagem": "Agendamentos pendentes encontrados",
            "agendamentos": agendamentos_pendentes,
            "total": len(agendamentos_pendentes)
        }), 200

    except Exception as error:
        print(f"❌ Erro ao buscar agendamentos pendentes: {error}")
        return jsonify({"erro": "Erro interno do servidor"}), 500

@app.route("/agendamentos/<agendamento_id>/confirmar", methods=["PATCH"])
def confirmar_agendamento(agendamento_id):
    """Confirma um agendamento (para terapeutas)"""
    try:
        obj_id = ObjectId(agendamento_id)
    except Exception:
        return jsonify({"erro": "ID de agendamento inválido"}), 400

    dados = request.json or {}
    terapeuta_id = dados.get("terapeuta_id")

    if not terapeuta_id:
        return jsonify({"erro": "ID do terapeuta é obrigatório"}), 400

    try:
        terapeuta_obj_id = ObjectId(terapeuta_id)
    except Exception:
        return jsonify({"erro": "ID de terapeuta inválido"}), 400

    # Buscar o agendamento
    agendamento = agendamentos.find_one({"_id": obj_id})
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    if agendamento["status"] != "pendente":
        return jsonify({"erro": "Apenas agendamentos pendentes podem ser confirmados"}), 400

    # Confirmar o agendamento
    resultado = agendamentos.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": "confirmado",
                "terapeuta_id": terapeuta_obj_id,
                "data_confirmacao": datetime.now(),
                "atualizado_em": datetime.now()
            }
        }
    )

    if resultado.modified_count == 0:
        return jsonify({"erro": "Erro ao confirmar agendamento"}), 500

    # Log de sucesso
    print(f"✅ Agendamento {agendamento_id} confirmado pelo terapeuta {terapeuta_id}")

    return jsonify({
        "mensagem": "Agendamento confirmado com sucesso",
        "agendamento_id": agendamento_id
    }), 200

@app.route("/agendamentos/<agendamento_id>/rejeitar", methods=["PATCH"])
def rejeitar_agendamento(agendamento_id):
    """Rejeita um agendamento (para terapeutas)"""
    try:
        obj_id = ObjectId(agendamento_id)
    except Exception:
        return jsonify({"erro": "ID de agendamento inválido"}), 400

    dados = request.json or {}
    terapeuta_id = dados.get("terapeuta_id")
    motivo = dados.get("motivo")

    if not terapeuta_id or not motivo:
        return jsonify({"erro": "ID do terapeuta e motivo são obrigatórios"}), 400

    try:
        terapeuta_obj_id = ObjectId(terapeuta_id)
    except Exception:
        return jsonify({"erro": "ID de terapeuta inválido"}), 400

    # Buscar o agendamento
    agendamento = agendamentos.find_one({"_id": obj_id})
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    if agendamento["status"] != "pendente":
        return jsonify({"erro": "Apenas agendamentos pendentes podem ser rejeitados"}), 400

    # Rejeitar o agendamento
    resultado = agendamentos.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": "rejeitado",
                "terapeuta_id": terapeuta_obj_id,
                "motivo_rejeicao": motivo,
                "atualizado_em": datetime.now()
            }
        }
    )

    if resultado.modified_count == 0:
        return jsonify({"erro": "Erro ao rejeitar agendamento"}), 500

    # Log de sucesso
    print(f"✅ Agendamento {agendamento_id} rejeitado pelo terapeuta {terapeuta_id}")

    return jsonify({
        "mensagem": "Agendamento rejeitado com sucesso",
        "agendamento_id": agendamento_id
    }), 200

# ===== ROTAS UTILITÁRIAS =====

@app.route("/agendamentos/<agendamento_id>", methods=["GET"])
def buscar_agendamento_por_id(agendamento_id):
    """Busca agendamento específico por ID"""
    try:
        obj_id = ObjectId(agendamento_id)
    except Exception:
        return jsonify({"erro": "ID de agendamento inválido"}), 400

    # Buscar o agendamento
    agendamento = agendamentos.find_one({"_id": obj_id})
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    # Converter ObjectIds para string
    agendamento["_id"] = str(agendamento["_id"])
    agendamento["cliente_id"] = str(agendamento["cliente_id"])

    # Log de sucesso
    print(f"✅ Agendamento {agendamento_id} encontrado")

    return jsonify({
        "mensagem": "Agendamento encontrado com sucesso",
        "agendamento": agendamento
    }), 200

@app.route("/agendamentos/estatisticas/geral", methods=["GET"])
def obter_estatisticas_agendamentos():
    """Obtém estatísticas básicas dos agendamentos"""
    try:
        total = agendamentos.count_documents({})
        pendentes = agendamentos.count_documents({"status": "pendente"})
        confirmados = agendamentos.count_documents({"status": "confirmado"})
        cancelados = agendamentos.count_documents({"status": "cancelado"})
        rejeitados = agendamentos.count_documents({"status": "rejeitado"})

        percentual_confirmacao = (confirmados / total * 100) if total > 0 else 0

        estatisticas = {
            "total": total,
            "pendentes": pendentes,
            "confirmados": confirmados,
            "cancelados": cancelados,
            "rejeitados": rejeitados,
            "percentual_confirmacao": round(percentual_confirmacao, 1)
        }

        # Log de sucesso
        print(f"✅ Estatísticas obtidas: {total} total, {pendentes} pendentes")

        return jsonify({
            "mensagem": "Estatísticas obtidas com sucesso",
            "estatisticas": estatisticas
        }), 200

    except Exception as error:
        print(f"❌ Erro ao obter estatísticas: {error}")
        return jsonify({"erro": "Erro interno do servidor"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)