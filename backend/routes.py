import psycopg2
from flask import Blueprint, request, jsonify
from db import get_db_connection

# Cria um Blueprint. O primeiro argumento é o nome do Blueprint.
# O segundo é o nome do módulo, usado para localizar recursos.
api_bp = Blueprint('api', __name__)

@api_bp.route('/register', methods=['POST'])
def register():
    """Recebe os dados da inscrição inicial e salva no banco de dados."""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        confirmed = bool(data.get('confirmed', False))
        
        if not name or not email:
            return jsonify({'error': 'Nome e email são campos obrigatórios.'}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO registrations (name, email, phone, confirmed) VALUES (%s, %s, %s, %s)",
                    (name, email, phone, confirmed)
                )
            conn.commit()

        return jsonify({'message': 'Inscrição realizada com sucesso!'}), 201

    except psycopg2.Error as e:
        print(f"Erro de banco de dados em /register: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500
    except Exception as e:
        print(f"Erro inesperado em /register: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500

@api_bp.route('/areas', methods=['GET'])
def get_areas():
    """Retorna a lista de áreas de atuação."""
    areas = ["Atenção Básica", "Vigilância em Saúde", "Urgência e Emergência", "Gestão", "Hospitalar", "Outra"]
    return jsonify(areas)

@api_bp.route('/setores', methods=['GET'])
def get_setores():
    """Retorna a lista de setores de trabalho."""
    setores = ["Gabinete", "Administração", "RH", "Compras", "Almoxarifado", "TI", "Transporte", "Farmácia", "Faturamento", "Regulação", "Outra"]
    return jsonify(setores)

@api_bp.route('/complete-registration', methods=['POST'])
def complete_registration():
    """Recebe os dados do formulário de cadastro completo."""
    try:
        data = request.get_json()
        required_fields = ['registration_email', 'cpf', 'sexo', 'participacao', 'confirmacao_detalhada']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Campos obrigatórios ausentes.'}), 400
        
        if not bool(data.get('aceite_lgpd')):
            return jsonify({'error': 'O aceite dos termos da LGPD é obrigatório.'}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO detailed_registrations (
                        registration_email, cpf, sexo, participacao, instituicao_nome, cidade,
                        area_atuacao, setor, cargo, instit_tel, instit_email, confirmacao_detalhada,
                        aceite_lgpd, aceite_comunicados
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    data.get('registration_email'), data.get('cpf'), data.get('sexo'),
                    data.get('participacao'), data.get('instituicao_nome'), data.get('cidade'),
                    data.get('area_atuacao'), data.get('setor'), data.get('cargo'),
                    data.get('instit_tel'), data.get('instit_email'), data.get('confirmacao_detalhada'),
                    bool(data.get('aceite_lgpd', False)),
                    bool(data.get('aceite_comunicados', False))
                ))
            conn.commit()

        return jsonify({'message': 'Cadastro completo realizado com sucesso!'}), 201

    except psycopg2.Error as e:
        print(f"Erro de banco de dados em /complete-registration: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor ao completar o cadastro.'}), 500
    except Exception as e:
        print(f"Erro inesperado em /complete-registration: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor ao completar o cadastro.'}), 500

@api_bp.route('/registrations', methods=['GET'])
def get_registrations():
    """Retorna a lista de inscrições, com filtro opcional por 'confirmed'."""
    try:
        confirmed_param = request.args.get('confirmed')
        
        query = "SELECT id, name, email, phone, confirmed, timestamp FROM registrations"
        params = []

        if confirmed_param is not None:
            confirmed_value = confirmed_param.lower() == 'true'
            query += " WHERE confirmed = %s"
            params.append(confirmed_value)
        
        query += " ORDER BY timestamp DESC"

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                columns = [desc[0] for desc in cursor.description]
                registrations = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return jsonify(registrations), 200

    except psycopg2.Error as e:
        print(f"Erro de banco de dados em /registrations: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500
    except Exception as e:
        print(f"Erro inesperado em /registrations: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500

@api_bp.route('/detailed_registrations', methods=['GET'])
def get_detailed_registrations():
    """Retorna a lista completa de cadastros detalhados."""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT id, registration_email, cpf, sexo, participacao, instituicao_nome, cidade,
                           area_atuacao, setor, cargo, instit_tel, instit_email, confirmacao_detalhada,
                           aceite_lgpd, aceite_comunicados, timestamp 
                    FROM detailed_registrations 
                    ORDER BY timestamp DESC
                """)
                columns = [desc[0] for desc in cursor.description]
                detailed_registrations = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return jsonify(detailed_registrations), 200

    except psycopg2.Error as e:
        print(f"Erro de banco de dados em /detailed_registrations: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500
    except Exception as e:
        print(f"Erro inesperado em /detailed_registrations: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500
