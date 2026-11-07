import sys
import uuid
from datetime import timedelta
from django.db import migrations
from django.utils import timezone


def substituir_uuids_sequenciais(apps, schema_editor):
    if "test" in sys.argv:
        return

    CustomUser = apps.get_model("accounts", "CustomUser")
    agora = timezone.now()

    usuarios_seed = list(
        CustomUser.objects.filter(email__regex=r"^estudante\d{4}@linus\.app\.br$")
    )

    # Filtra apenas os que estão com o UUID sequencial antigo (00000000-0000-0000-0009-...)
    usuarios_sequenciais = [
        u for u in usuarios_seed if str(u.id).startswith("00000000-0000-0000-0009-")
    ]

    if not usuarios_sequenciais:
        return

    ids_antigos = [u.id for u in usuarios_sequenciais]
    CustomUser.objects.filter(id__in=ids_antigos).delete()

    for u in usuarios_sequenciais:
        u.id = uuid.uuid4()

    CustomUser.objects.bulk_create(usuarios_sequenciais, batch_size=500)

    # Restaura a distribuição histórica de created_at dos últimos 7 dias
    for offset in range(7):
        emails_lote = [
            f"estudante{i:04d}@linus.app.br"
            for i in range(1, 1001)
            if (i % 7) == offset
        ]
        CustomUser.objects.filter(email__in=emails_lote).update(
            created_at=agora - timedelta(days=offset)
        )


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_customuser_avatar_options"),
    ]

    operations = [
        migrations.RunPython(substituir_uuids_sequenciais, migrations.RunPython.noop),
    ]