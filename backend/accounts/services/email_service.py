from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags

class EmailService:
    """
    Serviço de disparo de e-mails transacionais configurado para integração
    com o SMTP/API da Brevo.
    """

    @staticmethod
    def send_2fa_email(email: str, otp: str):
        subject = "Código de Segurança - LINUS"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>Verificação em Duas Etapas</h2>
                <p>Uma tentativa de acesso foi detectada na sua conta LINUS.</p>
                <p>Use o código de 6 dígitos abaixo para concluir o login:</p>
                <p><strong style="font-size: 28px; color: #2c3e50; letter-spacing: 5px;">{otp}</strong></p>
                <p>Este código expira em <strong>5 minutos</strong>.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #7f8c8d;">
                    <strong>Aviso de Segurança:</strong> Nossa equipe jamais solicitará este código por telefone ou mensagem. Se você não tentou fazer login, altere sua senha imediatamente.
                </p>
            </body>
        </html>
        """
        text_content = strip_tags(html_content)
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)

    @staticmethod
    def send_password_reset_email(email: str, reset_link: str):
        subject = "Recuperação de Senha - LINUS"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>Recuperação de Acesso</h2>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                <p>Acesse o link abaixo para registrar uma nova senha segura:</p>
                <p><a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background-color: #2980b9; color: #fff; text-decoration: none; border-radius: 4px;">Redefinir Minha Senha</a></p>
                <p>Este link possui validade de <strong>15 minutos</strong> e só pode ser utilizado uma única vez.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #7f8c8d;">
                    <strong>Aviso de Segurança:</strong> Se você não solicitou a redefinição de senha, ignore este e-mail. Nenhuma alteração foi feita em sua conta.
                </p>
            </body>
        </html>
        """
        text_content = strip_tags(html_content)
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)