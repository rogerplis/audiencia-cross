import os
import sqlite3
import psycopg2
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env na raiz do projeto
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- Configurações ---
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_postgres_connection():
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

def migrate_registrations(sqlite_cur, pg_cur):
    """Migra dados da tabela 'registrations'."""
    print("Iniciando migração da tabela 'registrations'...")
    sqlite_cur.execute("SELECT id, name, email, phone, confirmed, timestamp FROM registrations")
    rows = sqlite_cur.fetchall()
    
    if not rows:
        print("Nenhum dado encontrado em 'registrations'.")
        return

    try:
        pg_cur.executemany(
            """
            INSERT INTO registrations (id, name, email, phone, confirmed, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (email) DO NOTHING;
            """,
            rows
        )
        print(f"{len(rows)} registros migrados para 'registrations'.")
    except psycopg2.Error as e:
        print(f"Erro ao inserir dados em 'registrations': {e}")
        raise

def migrate_detailed_registrations(sqlite_cur, pg_cur):
    """Migra dados da tabela 'detailed_registrations'."""
    print("Iniciando migração da tabela 'detailed_registrations'...")
    sqlite_cur.execute("""
        SELECT 
            registration_email, cpf, sexo, participacao, instituicao_nome, cidade,
            area_atuacao, setor, cargo, instit_tel, instit_email, confirmacao_detalhada,
            aceite_lgpd, aceite_comunicados, timestamp
        FROM detailed_registrations
    """)
    rows = sqlite_cur.fetchall()

    if not rows:
        print("Nenhum dado encontrado em 'detailed_registrations'.")
        return

    try:
        pg_cur.executemany(
            """
            INSERT INTO detailed_registrations (
                registration_email, cpf, sexo, participacao, instituicao_nome, cidade,
                area_atuacao, setor, cargo, instit_tel, instit_email, confirmacao_detalhada,
                aceite_lgpd, aceite_comunicados, timestamp
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """,
            rows
        )
        print(f"{len(rows)} registros migrados para 'detailed_registrations'.")
    except psycopg2.Error as e:
        print(f"Erro ao inserir dados em 'detailed_registrations': {e}")
        raise

def main():
    """Função principal para orquestrar a migração."""
    print("--- Iniciando Script de Migração de SQLite para PostgreSQL ---")
    
    try:
        # Conectar aos bancos de dados
        sqlite_conn = sqlite3.connect(SQLITE_DB_PATH)
        pg_conn = get_postgres_connection()
        
        sqlite_cursor = sqlite_conn.cursor()
        pg_cursor = pg_conn.cursor()

        # Migrar as tabelas
        migrate_registrations(sqlite_cursor, pg_cursor)
        migrate_detailed_registrations(sqlite_cursor, pg_cursor)

        # Commit e fechar conexões
        pg_conn.commit()
        print("\nMigração concluída com sucesso!")

    except Exception as e:
        print(f"\nOcorreu um erro durante a migração: {e}")
        if 'pg_conn' in locals() and pg_conn:
            pg_conn.rollback()
            print("Rollback da transação PostgreSQL executado.")
    finally:
        if 'sqlite_conn' in locals() and sqlite_conn:
            sqlite_conn.close()
        if 'pg_conn' in locals() and pg_conn:
            pg_cursor.close()
            pg_conn.close()
        print("--- Script de Migração Finalizado ---")

if __name__ == '__main__':
    main()
