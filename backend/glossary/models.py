import uuid
from django.db import models

class Glossario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    termo = models.CharField(max_length=100, unique=True)
    definicao = models.TextField()
    figura_svg = models.TextField(null=True, blank=True)
    categoria = models.CharField(max_length=100)

    class Meta:
        db_table = "TB_GLOSSARIO"