from audit.models import AuditLog

class AuditService:
    """
    Serviço central de registro de auditoria garantindo captura de metadados
    essenciais para rastreabilidade de requisições.
    """

    @staticmethod
    def get_client_ip(request) -> str:
        if not request:
            return '0.0.0.0'
        
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
        return ip

    @staticmethod
    def get_user_agent(request) -> str:
        if not request:
            return 'Unknown'
        return request.META.get('HTTP_USER_AGENT', 'Unknown')[:1000]

    @classmethod
    def log_event(cls, request, user, action: str, payload: dict = None):
        if payload is None:
            payload = {}
            
        ip_address = cls.get_client_ip(request)
        user_agent = cls.get_user_agent(request)
        
        AuditLog.objects.create(
            user=user if user and user.is_authenticated else None,
            action=action,
            ip_address=ip_address,
            user_agent=user_agent,
            payload=payload
        )