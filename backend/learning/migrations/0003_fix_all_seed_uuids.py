import uuid
from django.db import migrations


def substituir_uuids_sequenciais_por_uuid4(apps, schema_editor):
    """
    Converte todos os UUIDs determinísticos de seed (00000000-0000-...)
    em UUIDv4 aleatórios reais em TB_MODULO, TB_AULA, TB_EXERCICIO,
    TB_BADGE, TB_PERGUNTA_TRIAGEM, TB_OPCAO_TRIAGEM, TB_GLOSSARIO e TB_MUSICA,
    mantendo intactas todas as ForeignKeys (ProgressoAula, TentativaExercicio, etc.).
    """
    with schema_editor.connection.cursor() as cursor:
        # 1. TB_GLOSSARIO (sem FKs dependentes)
        cursor.execute(
            'SELECT id FROM "TB_GLOSSARIO" WHERE CAST(id AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for (old_id,) in cursor.fetchall():
            cursor.execute(
                'UPDATE "TB_GLOSSARIO" SET id = %s WHERE id = %s',
                [uuid.uuid4(), old_id],
            )

        # 2. TB_OPCAO_TRIAGEM (folha da triagem)
        cursor.execute(
            'SELECT id FROM "TB_OPCAO_TRIAGEM" WHERE CAST(id AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for (old_id,) in cursor.fetchall():
            cursor.execute(
                'UPDATE "TB_OPCAO_TRIAGEM" SET id = %s WHERE id = %s',
                [uuid.uuid4(), old_id],
            )

        # 3. TB_PERGUNTA_TRIAGEM (atualiza TB_OPCAO_TRIAGEM.pergunta_id)
        cursor.execute(
            'SELECT id, enunciado, tipo, dados_partitura, ordem, ativo FROM "TB_PERGUNTA_TRIAGEM" WHERE CAST(id AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for old_id, enunciado, tipo, dados_partitura, ordem, ativo in cursor.fetchall():
            new_id = uuid.uuid4()
            cursor.execute(
                'INSERT INTO "TB_PERGUNTA_TRIAGEM" (id, enunciado, tipo, dados_partitura, ordem, ativo) VALUES (%s, %s, %s, %s, %s, %s)',
                [new_id, enunciado, tipo, dados_partitura, ordem, ativo],
            )
            cursor.execute(
                'UPDATE "TB_OPCAO_TRIAGEM" SET pergunta_id = %s WHERE pergunta_id = %s',
                [new_id, old_id],
            )
            cursor.execute('DELETE FROM "TB_PERGUNTA_TRIAGEM" WHERE id = %s', [old_id])

        # 4. TB_EXERCICIO (atualiza TB_TENTATIVA_EXERCICIO.exercicio_id)
        cursor.execute(
            'SELECT id, aula_id, tipo, enunciado, gabarito_dados, tag_topico, ativo FROM "TB_EXERCICIO" WHERE CAST(id AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for old_id, aula_id, tipo, enunciado, gabarito_dados, tag_topico, ativo in cursor.fetchall():
            new_id = uuid.uuid4()
            cursor.execute(
                'INSERT INTO "TB_EXERCICIO" (id, aula_id, tipo, enunciado, gabarito_dados, tag_topico, ativo) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                [new_id, aula_id, tipo, enunciado, gabarito_dados, tag_topico, ativo],
            )
            cursor.execute(
                'UPDATE "TB_TENTATIVA_EXERCICIO" SET exercicio_id = %s WHERE exercicio_id = %s',
                [new_id, old_id],
            )
            cursor.execute('DELETE FROM "TB_EXERCICIO" WHERE id = %s', [old_id])

        # 5. TB_AULA (atualiza TB_EXERCICIO.aula_id e TB_PROGRESSO_AULA.aula_id)
        cursor.execute(
            'SELECT id, modulo_id, ordem, titulo, conteudo_teorico, partitura_dados, ativa FROM "TB_AULA" WHERE CAST(id AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for old_id, modulo_id, ordem, titulo, conteudo_teorico, partitura_dados, ativa in cursor.fetchall():
            new_id = uuid.uuid4()
            cursor.execute(
                'INSERT INTO "TB_AULA" (id, modulo_id, ordem, titulo, conteudo_teorico, partitura_dados, ativa) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                [new_id, modulo_id, ordem, titulo, conteudo_teorico, partitura_dados, ativa],
            )
            cursor.execute(
                'UPDATE "TB_EXERCICIO" SET aula_id = %s WHERE aula_id = %s',
                [new_id, old_id],
            )
            cursor.execute(
                'UPDATE "TB_PROGRESSO_AULA" SET aula_id = %s WHERE aula_id = %s',
                [new_id, old_id],
            )
            cursor.execute('DELETE FROM "TB_AULA" WHERE id = %s', [old_id])

        # 6. TB_MODULO (atualiza TB_AULA.modulo_id)
        cursor.execute(
            'SELECT id, ordem, titulo, descricao, categoria, ativo FROM "TB_MODULO" WHERE CAST(id AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for old_id, ordem, titulo, descricao, categoria, ativo in cursor.fetchall():
            new_id = uuid.uuid4()
            cursor.execute(
                'INSERT INTO "TB_MODULO" (id, ordem, titulo, descricao, categoria, ativo) VALUES (%s, %s, %s, %s, %s, %s)',
                [new_id, ordem, titulo, descricao, categoria, ativo],
            )
            cursor.execute(
                'UPDATE "TB_AULA" SET modulo_id = %s WHERE modulo_id = %s',
                [new_id, old_id],
            )
            cursor.execute('DELETE FROM "TB_MODULO" WHERE id = %s', [old_id])

        # 7. TB_MUSICA (se houver músicas públicas do seed com ID sequencial)
        cursor.execute(
            'SELECT id_musica FROM "TB_MUSICA" WHERE CAST(id_musica AS TEXT) LIKE %s',
            ["00000000-0000-%"],
        )
        for (old_id,) in cursor.fetchall():
            cursor.execute(
                'UPDATE "TB_MUSICA" SET id_musica = %s WHERE id_musica = %s',
                [uuid.uuid4(), old_id],
            )


class Migration(migrations.Migration):

    dependencies = [
        ("learning", "0002_seed_curriculum"),
        ("placement", "0002_seed_triagem"),
        ("glossary", "0002_seed_glossario"),
        ("exercises", "0001_initial"),
        ("progress", "0001_initial"),
        ("music", "0002_seed_public_musics"),
    ]

    operations = [
        migrations.RunPython(
            substituir_uuids_sequenciais_por_uuid4,
            migrations.RunPython.noop,
        ),
    ]