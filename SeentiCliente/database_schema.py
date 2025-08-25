"""
SCHEMA COMPLETO DO BANCO DE DADOS - SEENTI
Definição de todas as coleções e validações antes do desenvolvimento
"""

from datetime import datetime, date
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum

# ============================================================================
# ENUMS E CONSTANTES
# ============================================================================

class TipoUsuario(str, Enum):
    CLIENTE = "C"
    TERAPEUTA = "T"
    ADMIN = "A"

class StatusCliente(str, Enum):
    ATIVO = "ativo"
    INATIVO = "inativo"
    PENDENTE = "pendente"

class StatusAnamnese(str, Enum):
    PENDENTE = "pendente"
    PREENCHIDA = "preenchida"
    BLOQUEADA = "bloqueada"

# ============================================================================
# SCHEMAS DAS COLEÇÕES
# ============================================================================

@dataclass
class SchemaUsuario:
    """Schema da coleção 'usuarios'"""
    _id: str  # ObjectId
    email: str  # único, validado
    senha: str  # hash bcrypt
    tipo_usuario: TipoUsuario  # C, T, A
    consentimento: bool  # LGPD
    tenant_id: str  # para multi-tenant
    data_criacao: datetime
    data_atualizacao: datetime
    ativo: bool = True
    
    # Validações
    @staticmethod
    def validar_email(email: str) -> bool:
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validar_senha(senha: str) -> bool:
        # Mínimo 8 caracteres, pelo menos 1 letra, 1 número e 1 caractere especial
        if len(senha) < 8:
            return False
        
        # Pelo menos 1 letra
        if not any(c.isalpha() for c in senha):
            return False
        
        # Pelo menos 1 número
        if not any(c.isdigit() for c in senha):
            return False
        
        # Pelo menos 1 caractere especial
        caracteres_especiais = r'!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?'
        if not any(c in caracteres_especiais for c in senha):
            return False
        
        return True

@dataclass
class SchemaCliente:
    """Schema da coleção 'clientes'"""
    _id: str  # ObjectId
    usuario_id: str  # ObjectId referência
    primeiro_nome: str
    sobrenome: str
    cpf: str  # único, validado
    data_nascimento: date  # validar ≥18 anos
    telefone: str
    tenant_id: str  # para multi-tenant
    data_criacao: datetime
    data_atualizacao: datetime
    nome_social: Optional[str] = None  # opcional
    genero: Optional[str] = None
    status: StatusCliente = StatusCliente.PENDENTE
    
    # Validações
    @staticmethod
    def validar_cpf(cpf: str) -> bool:
        """Validação de CPF brasileiro"""
        import re
        # Remove caracteres não numéricos
        cpf = re.sub(r'[^0-9]', '', cpf)
        
        if len(cpf) != 11:
            return False
        
        # Verifica se todos os dígitos são iguais
        if cpf == cpf[0] * 11:
            return False
        
        # Validação dos dígitos verificadores
        for i in range(9, 11):
            value = sum((int(cpf[num]) * ((i + 1) - num) for num in range(0, i)))
            digit = ((value * 10) % 11) % 10
            if int(cpf[i]) != digit:
                return False
        return True
    
    @staticmethod
    def validar_idade(data_nascimento: date) -> bool:
        """Valida se a pessoa tem 18 anos ou mais"""
        hoje = date.today()
        idade = hoje.year - data_nascimento.year
        if hoje.month < data_nascimento.month or (hoje.month == data_nascimento.month and hoje.day < data_nascimento.day):
            idade -= 1
        return idade >= 18

@dataclass
class SchemaAnamnese:
    """Schema da coleção 'anamneses' - REFATORADO Sprint 07"""
    _id: str  # ObjectId
    cliente_id: str  # ObjectId referência ao cliente
    data_envio: datetime  # Data/hora do preenchimento
    dados: Dict  # Estrutura organizada e validada
    registrado_por: str  # ObjectId do terapeuta ou usuário responsável
    tenant_id: str  # para multi-tenant
    status: StatusAnamnese = StatusAnamnese.PENDENTE
    data_criacao: datetime = field(default_factory=datetime.now)
    data_atualizacao: datetime = field(default_factory=datetime.now)
    
    # Estrutura esperada dos dados - NOVA ESTRUTURA ORGANIZADA
    @staticmethod
    def get_estrutura_dados() -> Dict:
        return {
            "objetivo": str,  # Objetivo principal da sessão
            "dor_atual": str,  # Descrição da dor atual
            "nivel_dor": int,  # Escala 0-10
            
            "historico_saude": {
                "pressao_alta": {
                    "tem": bool,
                    "controle": Optional[str]  # "controlada", "descompensada", "não informado"
                },
                "diabetes": {
                    "tem": bool,
                    "controle": Optional[str]  # "controlada", "descompensada", "não informado"
                },
                "alergias": Optional[str],  # String ou null
                "sintomas_pernas": Optional[str]  # String ou null
            },
            
            "habitos": {
                "funcionamento_intestinal": str,  # regular/irregular
                "alimentacao": str,  # boa/regular/ruim
                "anticoncepcional": Optional[str],  # String ou null
                "gestante": Optional[int]  # Número de semanas ou null
            },
            
            "historico_clinico": {
                "estresse": bool,
                "enxaqueca": bool,
                "depressao": bool,
                "insonia": bool,
                "dor_mandibula": bool,
                "bruxismo": bool,
                "disturbio_renal": Optional[str],  # String ou null
                "antecedente_oncologico": Optional[str],  # String ou null
                "pedra_rim": bool,
                "pedra_vesicula": bool,
                "doenca_cronica": Optional[str]  # String ou null
            },
            
            "restricoes": {
                "nao_gosta_massagem_em": Optional[str]  # String ou null
            },
            
            "conduta_tratamento": str,  # Conduta sugerida pelo terapeuta
            "aceite_termo": bool  # Aceite dos termos de uso
        }
    
    # Validações específicas para a nova estrutura
    @staticmethod
    def validar_nivel_dor(nivel: int) -> bool:
        """Valida se o nível de dor está entre 0 e 10"""
        return 0 <= nivel <= 10
    
    @staticmethod
    def validar_funcionamento_intestinal(valor: str) -> bool:
        """Valida valores para funcionamento intestinal"""
        valores_validos = ["regular", "irregular"]
        return valor in valores_validos
    
    @staticmethod
    def validar_alimentacao(valor: str) -> bool:
        """Valida valores para alimentação"""
        valores_validos = ["boa", "regular", "ruim"]
        return valor in valores_validos
    
    @staticmethod
    def validar_gestante(valor: Optional[str]) -> bool:
        """Valida valor para gestante (string vazia ou número positivo)"""
        if valor == '' or valor is None:
            return True
        try:
            valor_int = int(valor)
            return valor_int > 0
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validar_controle_doenca(valor: Optional[str]) -> bool:
        """Valida valores para controle de doenças"""
        if valor is None:
            return True
        valores_validos = ["controlada", "descompensada", "não informado"]
        return valor in valores_validos

@dataclass
class SchemaTenant:
    """Schema da coleção 'tenants' (White Label)"""
    _id: str  # ObjectId
    codigo: str  # único, usado no subdomain
    nome: str
    razao_social: str
    cnpj: str  # único, validado
    email_contato: str
    telefone: str
    endereco: Dict
    configuracoes_visuais: Dict  # cores, logo, fontes
    segmento: str = "Terapia Integrativa"  # NOVO CAMPO - Sprint 07
    ativo: bool = True
    data_criacao: datetime
    data_atualizacao: datetime
    
    @staticmethod
    def get_estrutura_configuracoes() -> Dict:
        return {
            "cores": {
                "primaria": str,  # hex color
                "secundaria": str,  # hex color
                "texto": str,  # hex color
                "fundo": str  # hex color
            },
            "logo": {
                "url": str,
                "altura": int,
                "largura": int
            },
            "fonte": {
                "familia": str,
                "tamanho_base": int
            },
            "textos": {
                "nome_plataforma": str,
                "slogan": str,
                "termo_uso": str
            }
        }

@dataclass
class SchemaTermoUso:
    """Schema da coleção 'termos_uso'"""
    _id: str  # ObjectId
    tenant_id: str  # ObjectId referência
    versao: str  # ex: "1.0.0"
    titulo: str
    conteudo: str
    ativo: bool = True
    data_criacao: datetime
    data_atualizacao: datetime

# ============================================================================
# ÍNDICES NECESSÁRIOS
# ============================================================================

INDICES_MONGODB = {
    "usuarios": [
        {"email": 1, "tenant_id": 1},  # único por tenant
        {"tenant_id": 1},
        {"tipo_usuario": 1}
    ],
    "clientes": [
        {"cpf": 1, "tenant_id": 1},  # único por tenant
        {"usuario_id": 1},  # único
        {"tenant_id": 1}
    ],
    "anamneses": [
        {"cliente_id": 1},  # único por cliente
        {"tenant_id": 1},
        {"status": 1}
    ],
    "agendamentos": [
        {"cliente_id": 1},  # múltiplos agendamentos por cliente
        {"terapeuta_id": 1},  # múltiplos agendamentos por terapeuta
        {"data": 1},  # ordenação por data
        {"status": 1},  # filtro por status
        {"tenant_id": 1}  # filtro por tenant
    ],
    "tenants": [
        {"codigo": 1},  # único
        {"cnpj": 1}  # único
    ],
    "termos_uso": [
        {"tenant_id": 1, "ativo": 1},
        {"versao": 1}
    ]
}

# ============================================================================
# VALIDAÇÕES GLOBAIS
# ============================================================================

def validar_tenant_id(tenant_id: str) -> bool:
    """Valida se o tenant_id existe e está ativo"""
    # Implementar verificação no banco
    return bool(tenant_id and len(tenant_id) == 24)

def validar_object_id(object_id: str) -> bool:
    """Valida se é um ObjectId válido do MongoDB"""
    import re
    pattern = r'^[0-9a-fA-F]{24}$'
    return bool(re.match(pattern, object_id))

# ============================================================================
# MENSAGENS DE ERRO PADRONIZADAS
# ============================================================================

MENSAGENS_ERRO = {
    "campo_obrigatorio": "Campo '{campo}' é obrigatório",
    "email_invalido": "Formato de email inválido",
    "email_ja_cadastrado": "Email já cadastrado",
    "senha_fraca": "Senha deve ter pelo menos 8 caracteres, 1 letra e 1 número",
    "cpf_invalido": "CPF inválido",
    "cpf_ja_cadastrado": "CPF já cadastrado",
    "idade_insuficiente": "É necessário ter 18 anos ou mais",
    "tenant_inexistente": "Clínica não encontrada",
    "usuario_inexistente": "Usuário não encontrado",
    "cliente_inexistente": "Cliente não encontrado",
    "anamnese_ja_preenchida": "Anamnese já foi preenchida",
    "consentimento_obrigatorio": "Aceite do termo de uso é obrigatório"
} 