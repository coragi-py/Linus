import base64
import hashlib
import secrets
import sys
import uuid
from datetime import timedelta
from django.db import migrations
from django.utils import timezone
from django.contrib.auth.hashers import get_hasher


PRIMEIROS_NOMES = [
    "Ana", "Bruno", "Camila", "Daniel", "Eduarda", "Felipe", "Gabriela", "Henrique",
    "Isabela", "João", "Karina", "Lucas", "Mariana", "Nicolas", "Olívia", "Pedro",
    "Rafaela", "Samuel", "Tatiane", "Vinícius", "Amanda", "Beatriz", "Caio", "Diego",
    "Elisa", "Fernanda", "Guilherme", "Helena", "Igor", "Júlia", "Leonardo", "Matheus",
    "Natália", "Otávio", "Patrícia", "Rodrigo", "Sabrina", "Thiago", "Vanessa", "Yasmin",
]

SOBRENOMES = [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
    "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes",
    "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade",
    "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas", "Cardoso", "Ramos",
    "Gonçalves", "Santana", "Teixeira", "Araújo", "Melo", "Cavalcanti", "Moura", "Campos",
]


def gerar_hash_pbkdf2_com_salt_unico(raw_password: str, iterations: int) -> str:
    """
    Gera um hash PBKDF2-SHA256 compatível com o Django utilizando um salt
    criptograficamente seguro e individualizado para cada usuário (Seção 3.8 da Monografia).
    """
    salt = secrets.token_urlsafe(16)[:22]
    dk = hashlib.pbkdf2_hmac(
        "sha256",
        raw_password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    hash_b64 = base64.b64encode(dk).decode("ascii").strip()
    return f"pbkdf2_sha256${iterations}${salt}${hash_b64}"


def seed_1000_users(apps, schema_editor):
    # Evita popular os 1000 usuários durante a execução da suíte de testes unitários
    if "test" in sys.argv:
        return

    CustomUser = apps.get_model("accounts", "CustomUser")
    agora = timezone.now()

    hasher = get_hasher("default")
    iterations = getattr(hasher, "iterations", 310000)

    usuarios_existentes = {
        u.email: u
        for u in CustomUser.objects.filter(email__startswith="estudante")
    }

    novos_usuarios = []
    usuarios_para_atualizar = []

    for i in range(1, 1001):
        email = f"estudante{i:04d}@linus.app.br"
        # Senha individualizada por estudante + salt criptográfico exclusivo
        senha_individual = f"Linus@2026#{i:04d}"
        senha_hash_unico = gerar_hash_pbkdf2_com_salt_unico(senha_individual, iterations)

        if email in usuarios_existentes:
            u_existente = usuarios_existentes[email]
            u_existente.password = senha_hash_unico
            usuarios_para_atualizar.append(u_existente)
            continue

        primeiro_nome = PRIMEIROS_NOMES[(i - 1) % len(PRIMEIROS_NOMES)]
        sobrenome_1 = SOBRENOMES[((i - 1) // len(PRIMEIROS_NOMES)) % len(SOBRENOMES)]
        sobrenome_2 = SOBRENOMES[(i * 7) % len(SOBRENOMES)]
        nome_completo = f"{primeiro_nome} {sobrenome_1} {sobrenome_2}"

        ano_nascimento = 1978 + (i % 33)

        dias_atras_criacao = i % 7
        data_criacao = agora - timedelta(days=dias_atras_criacao, hours=i % 12)
        ultimo_login = agora - timedelta(days=i % 5, hours=i % 8) if (i % 10 != 0) else None

        novos_usuarios.append(
            CustomUser(
                id=uuid.UUID(f"00000000-0000-0000-0009-{i:012d}"),
                email=email,
                nome=nome_completo,
                password=senha_hash_unico,
                ano_nascimento=ano_nascimento,
                role="estudante",
                is_active=(i % 25 != 0),
                is_staff=False,
                is_superuser=False,
                is_2fa_enabled=False,
                terms_accepted=True,
                terms_accepted_at=data_criacao,
                terms_version="v1.0",
                consent_ip="127.0.0.1",
                last_login=ultimo_login,
            )
        )

    if novos_usuarios:
        CustomUser.objects.bulk_create(novos_usuarios, batch_size=500, ignore_conflicts=True)

        for offset in range(7):
            emails_lote = [
                f"estudante{i:04d}@linus.app.br"
                for i in range(1, 1001)
                if (i % 7) == offset
            ]
            CustomUser.objects.filter(email__in=emails_lote).update(
                created_at=agora - timedelta(days=offset)
            )

    if usuarios_para_atualizar:
        CustomUser.objects.bulk_update(usuarios_para_atualizar, ["password"], batch_size=500)


def reverse_seed_1000_users(apps, schema_editor):
    CustomUser = apps.get_model("accounts", "CustomUser")
    CustomUser.objects.filter(email__regex=r"^estudante\d{4}@linus\.app\.br$").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_padronizar_role_estudante"),
    ]

    operations = [
        migrations.RunPython(seed_1000_users, reverse_seed_1000_users),
    ]