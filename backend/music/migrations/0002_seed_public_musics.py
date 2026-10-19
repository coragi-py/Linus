import sys
import uuid
from django.db import migrations


MUSICAS_AMOSTRA_PUBLICA = [
    {
        "id_musica": uuid.UUID("00000000-0000-0000-0006-000000000001"),
        "nome_musica": "🌟 Brilha, Brilha Estrelinha (Amostra)",
        "notas": [
            "C4", "C4", "G4", "G4", "A4", "A4", "G4",
            "F4", "F4", "E4", "E4", "D4", "D4", "C4",
        ],
    },
    {
        "id_musica": uuid.UUID("00000000-0000-0000-0006-000000000002"),
        "nome_musica": "🎻 Ode à Alegria — Beethoven (Amostra)",
        "notas": [
            "E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4",
            "C4", "C4", "D4", "E4", "E4", "D4", "D4",
        ],
    },
    {
        "id_musica": uuid.UUID("00000000-0000-0000-0006-000000000003"),
        "nome_musica": "🎈 Cai, Cai Balão — Folclore (Amostra)",
        "notas": [
            "G4", "G4", "F4", "E4", "G4", "G4", "F4", "E4",
            "G4", "A4", "G4", "F4", "E4", "D4", "C4",
        ],
    },
]


def seed_public_musics(apps, schema_editor):
    # Evita interferir nos testes unitários isolados de music
    if "test" in sys.argv:
        return

    Musica = apps.get_model("music", "Musica")

    for item in MUSICAS_AMOSTRA_PUBLICA:
        Musica.objects.update_or_create(
            id_musica=item["id_musica"],
            defaults={
                "nome_musica": item["nome_musica"],
                "notas": item["notas"],
                "id_usuario": None,  # None = Música Pública (Amostra da Plataforma)
            },
        )


def reverse_seed_public_musics(apps, schema_editor):
    Musica = apps.get_model("music", "Musica")
    ids = [item["id_musica"] for item in MUSICAS_AMOSTRA_PUBLICA]
    Musica.objects.filter(id_musica__in=ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("music", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_public_musics, reverse_seed_public_musics),
    ]