from django.db import migrations, models


def converter_usuario_para_estudante(apps, schema_editor):
    CustomUser = apps.get_model('accounts', 'CustomUser')
    CustomUser.objects.filter(role='usuario').update(role='estudante')


def reverter_estudante_para_usuario(apps, schema_editor):
    CustomUser = apps.get_model('accounts', 'CustomUser')
    CustomUser.objects.filter(role='estudante').update(role='usuario')


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_customuser_nome'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(
                choices=[
                    ('estudante', 'Estudante'),
                    ('admin-conteudo', 'Admin Conteúdo'),
                    ('admin-sistema', 'Admin Sistema'),
                ],
                default='estudante',
                max_length=20,
            ),
        ),
        migrations.RunPython(
            converter_usuario_para_estudante,
            reverter_estudante_para_usuario,
        ),
    ]