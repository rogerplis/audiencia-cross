import os
import sys
from dotenv import load_dotenv

# Adiciona o diretório 'backend' ao path para permitir importações relativas
# Isso é necessário para encontrar o módulo 'db'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import get_db_connection

def test_connection():
    """
    Tenta conectar ao banco de dados PostgreSQL e executa uma consulta de teste.
    """
    print("--- Iniciando teste de conexão com o PostgreSQL ---")
    
    # Carrega as variáveis de ambiente do arquivo .env na raiz do projeto
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if not os.path.exists(dotenv_path):
        print(f"Erro: Arquivo .env não encontrado em '{os.path.dirname(dotenv_path)}'")
        print("Por favor, crie o arquivo .env com as credenciais do banco de dados.")
        sys.exit(1)
        
    load_dotenv(dotenv_path=dotenv_path)

    conn = None
    try:
        # Tenta obter a conexão
        conn = get_db_connection()
        
        # Se a conexão for bem-sucedida, cria um cursor para executar uma consulta
        cursor = conn.cursor()
        
        # Executa uma consulta simples para verificar a versão do PostgreSQL
        print("Executando 'SELECT version();'...")
        cursor.execute("SELECT version();")
        
        # Busca o resultado
        db_version = cursor.fetchone()
        
        # Fecha o cursor
        cursor.close()
        
        print("\n✅ Conexão com o PostgreSQL bem-sucedida!")
        print(f"Versão do Banco de Dados: {db_version[0]}")

    except Exception as e:
        print(f"\n❌ Falha ao conectar ao PostgreSQL.")
        print(f"Erro: {e}")
        sys.exit(1) # Termina o script com um código de erro
        
    finally:
        # Garante que a conexão seja fechada, mesmo se ocorrer um erro
        if conn is not None:
            conn.close()
            print("\nConexão fechada.")
        
        print("--- Teste de conexão finalizado ---")

if __name__ == '__main__':
    test_connection()
