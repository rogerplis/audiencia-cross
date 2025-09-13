import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis de ambiente do arquivo .env

def get_db_connection():
    """Cria e retorna uma conexão com o banco de dados PostgreSQL."""
    try:
        conn = psycopg2.connect(
            host=os.environ.get('POSTGRES_HOST'),
            database=os.environ.get('POSTGRES_DB'),
            user=os.environ.get('POSTGRES_USER'),
            password=os.environ.get('POSTGRES_PASSWORD'),
            port=os.environ.get('POSTGRES_PORT', 5432)
        )
        return conn
    except psycopg2.OperationalError as e:
        print(f"Erro de conexão com o PostgreSQL: {e}")
        raise

def init_db():
    """Inicializa o banco de dados, cria as tabelas se não existirem."""
    print("Tentando inicializar o banco de dados...")
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Tabela de inscrição inicial
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS registrations (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    phone TEXT,
                    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
                    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            # Tabela de cadastro detalhado
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS detailed_registrations (
                    id SERIAL PRIMARY KEY,
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
                    aceite_lgpd BOOLEAN NOT NULL DEFAULT FALSE,
                    aceite_comunicados BOOLEAN NOT NULL DEFAULT FALSE,
                    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (registration_email) REFERENCES registrations (email)
                )
            ''')
        conn.commit()
    print("Banco de dados inicializado com sucesso.")

if __name__ == '__main__':
    init_db()


