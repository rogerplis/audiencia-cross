
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logging.basicConfig(level=logging.DEBUG)

def send_registration_email(recipient_email):

    """Envia um email de confirmação de inscrição."""
    logger = logging.getLogger("email_utils")

    sender_email = os.environ.get('GMAIL_USER')
    sender_password = os.environ.get('GMAIL_PASSWORD')

    logger.debug(f"DEBUG: Tentando enviar email. GMAIL_USER: '{sender_email}'") # Adicionado para depuração

    if not sender_email or not sender_password:
        logger.debug("ERRO: Credenciais de email (GMAIL_USER ou GMAIL_PASSWORD) não configuradas nos environment variables. O email não será enviado.")
        return False

    subject = "Confirmação de Inscrição"
    body = "Sua inscrição foi realizada com sucesso!"

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        logger.debug("DEBUG: Conectando ao servidor SMTP do Gmail...")
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            logger.debug("DEBUG: Realizando login no servidor SMTP...")
            server.login(sender_email, sender_password)
            logger.debug("DEBUG: Enviando o email...")
            server.sendmail(sender_email, recipient_email, message.as_string())
        logger.debug(f"SUCESSO: Email de confirmação enviado para {recipient_email}")
    except smtplib.SMTPAuthenticationError as e:
        logger.debug(f"ERRO DE AUTENTICAÇÃO SMTP: Falha ao fazer login. Verifique GMAIL_USER e GMAIL_PASSWORD. Detalhes: {e}")
    except Exception as e:
        logger.debug(f"ERRO INESPERADO AO ENVIAR EMAIL: {e}")

