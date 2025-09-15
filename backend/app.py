from flask import Flask
from flask_cors import CORS
from routes import api_bp
from db import init_db
from dotenv import load_dotenv

load_dotenv()

def create_app():
    """Cria e configura uma instância da aplicação Flask."""
    app = Flask(__name__)
    
    # Configura o CORS para permitir origens específicas
    CORS(app, resources={r"/api/*": {
        "origins": "*"
    }})
    
    # Registra o Blueprint. Todas as rotas definidas no Blueprint
    # terão o prefixo '/api'. Ex: /register se torna /api/register.
    app.register_blueprint(api_bp, url_prefix='/api')

    # Você pode adicionar um comando CLI para inicializar o banco de dados
    # de forma mais controlada. Ex: flask init-db
    @app.cli.command('init-db')
    def init_db_command():
        """Limpa os dados existentes e cria novas tabelas."""
        init_db()
        print('Banco de dados inicializado.')

    return app

if __name__ == '__main__':
    # Este bloco é para execução direta (ex: python app.py)
    # Para produção, use um servidor WSGI como Gunicorn ou Waitress.
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
