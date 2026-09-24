from django.test import TestCase
from django.contrib.auth import get_user_model
from music.models import Musica

User = get_user_model()

class MusicaModelTests(TestCase):
    def setUp(self):
        # Cria um usuário compositor de testes
        self.user = User.objects.create_user(
            email="compositor@linus.com",
            nome="Mozart",
            password="Password@123"
        )

    def test_criar_musica_com_usuario(self):
        """Verifica a gravação no banco atrelada a um estudante (usuário logado)."""
        musica = Musica.objects.create(
            nome_musica="Sinfonia No. 40",
            notas=["G4", "E4", "F4", "D4"],
            id_usuario=self.user
        )
        self.assertEqual(Musica.objects.count(), 1)
        self.assertIsNotNone(musica.id_musica)
        self.assertEqual(musica.id_usuario, self.user)
        self.assertIsInstance(musica.notas, list)
        
        # Valida a função __str__
        self.assertEqual(str(musica), "Sinfonia No. 40")

    def test_criar_musica_sem_usuario_visitante(self):
        """Verifica se visitantes (não logados) podem salvar criações musicais."""
        musica = Musica.objects.create(
            nome_musica="Brilha Brilha Estrelinha",
            notas=["C4", "C4", "G4", "G4", "A4", "A4", "G4"]
        )
        self.assertIsNone(musica.id_usuario)
        self.assertEqual(musica.nome_musica, "Brilha Brilha Estrelinha")