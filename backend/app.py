import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Isso habilitará o CORS para todas as rotas

DATABASE = '/home/rogerio/dev/public-hearing-registration/backend/database.db'

def init_db():
    """Inicializa o banco de dados, cria e atualiza as tabelas conforme necessário."""
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        # Tabela de inscrição inicial
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                confirmed BOOLEAN NOT NULL DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Tabela de cadastro detalhado
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS detailed_registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                registration_email TEXT NOT NULL,
                cpf TEXT,
                sexo TEXT,
                participacao TEXT,
                instituicao_nome TEXT,
                cidade TEXT,
                area_atuacao TEXT,
                setor TEXT,
                cargo TEXT,
                instit_tel TEXT,
                instit_email TEXT,
                confirmacao_detalhada TEXT,
                aceite_lgpd BOOLEAN NOT NULL DEFAULT 0,
                aceite_comunicados BOOLEAN NOT NULL DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (registration_email) REFERENCES registrations (email)
            )
        ''')

        # --- Bloco de Migração de Colunas ---
        # Adiciona colunas de forma segura, sem gerar erros se já existirem
        def add_column_if_not_exists(table, column, col_type):
            try:
                cursor.execute(f'ALTER TABLE {table} ADD COLUMN {column} {col_type}')
            except sqlite3.OperationalError as e:
                if 'duplicate column name' not in str(e):
                    raise
        
        add_column_if_not_exists('registrations', 'confirmed', 'BOOLEAN NOT NULL DEFAULT 0')
        add_column_if_not_exists('detailed_registrations', 'aceite_lgpd', 'BOOLEAN NOT NULL DEFAULT 0')
        add_column_if_not_exists('detailed_registrations', 'aceite_comunicados', 'BOOLEAN NOT NULL DEFAULT 0')

        conn.commit()

@app.route('/api/register', methods=['POST'])
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

        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO registrations (name, email, phone, confirmed) VALUES (?, ?, ?, ?)",
                (name, email, phone, confirmed)
            )
            conn.commit()

        return jsonify({'message': 'Inscrição realizada com sucesso!'}), 201

    except Exception as e:
        print(f"Erro ao processar a requisição /api/register: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor.'}), 500

@app.route('/api/areas', methods=['GET'])
def get_areas():
    """Retorna a lista de áreas de atuação."""
    areas = ["Atenção Básica", "Vigilância em Saúde", "Urgência e Emergência", "Gestão", "Hospitalar", "Outra"]
    return jsonify(areas)

@app.route('/api/setores', methods=['GET'])
def get_setores():
    """Retorna a lista de setores de trabalho."""
    setores = ["Gabinete", "Administração", "RH", "Compras", "Almoxarifado", "TI", "Transporte", "Farmácia", "Faturamento", "Regulação", "Outra"]
    return jsonify(setores)

@app.route('/api/complete-registration', methods=['POST'])
def complete_registration():
    """Recebe os dados do formulário de cadastro completo."""
    try:
        data = request.get_json()
        # O email da inscrição original deve ser passado para vincular os registros
        required_fields = ['registration_email', 'cpf', 'sexo', 'participacao', 'confirmacao_detalhada']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Campos obrigatórios ausentes.'}), 400
        
        if not bool(data.get('aceite_lgpd')):
            return jsonify({'error': 'O aceite dos termos da LGPD é obrigatório.'}), 400

        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO detailed_registrations (
                    registration_email, cpf, sexo, participacao, instituicao_nome, cidade,
                    area_atuacao, setor, cargo, instit_tel, instit_email, confirmacao_detalhada,
                    aceite_lgpd, aceite_comunicados
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    except Exception as e:
        print(f"Erro ao processar a requisição /api/complete-registration: {e}")
        return jsonify({'error': 'Ocorreu um erro no servidor ao completar o cadastro.'}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
