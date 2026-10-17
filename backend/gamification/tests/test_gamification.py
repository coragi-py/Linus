from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from django.core import mail
from accounts.models import CustomUser
from learning.models import Aula
from audit.models import AuditLog
from gamification.models import GamificacaoPerfil, Badge, UsuarioBadge
from gamification.services.notification_service import StreakNotificationService


class GamificationModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.aluno = CustomUser.objects.create_user(
            email="aluno.game@teste.com",
            password="PasswordForte!123",
            nome="Aluno Gamificado",
            role=CustomUser.Role.USUARIO,
            terms_accepted=True,
        )
        self.client.force_authenticate(user=self.aluno)
        self.aulas = list(Aula.objects.order_by("modulo__ordem", "ordem")[:3])

    def test_streak_nao_incrementa_duas_vezes_no_mesmo_dia_civil(self):
        """RF06: O Streak só deve aumentar uma vez por dia civil."""
        aula1, aula2 = self.aulas[0], self.aulas[1]

        res1 = self.client.post(f"/api/v1/learning/aulas/{aula1.id}/concluir/", {"acertos": 3, "total": 3}, format="json")
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertEqual(res1.data["streak"], 1)

        # Concluir segunda aula no mesmo dia mantém streak em 1, mas soma pontos
        res2 = self.client.post(f"/api/v1/learning/aulas/{aula2.id}/concluir/", {"acertos": 3, "total": 3}, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data["streak"], 1)
        self.assertEqual(res2.data["pontuacao_total"], 20)

    def test_streak_incrementa_em_dia_consecutivo_e_emite_badge_5_dias(self):
        """RF06: Ao completar atividade no 5º dia seguido, emite badge ofensiva-5-dias."""
        hoje = timezone.localdate()
        perfil = GamificacaoPerfil.objects.create(
            usuario=self.aluno,
            streak_atual=4,
            melhor_streak=4,
            ultimo_acesso_estudo=hoje - timedelta(days=1),
            pontuacao_total=40,
        )

        aula = self.aulas[0]
        res = self.client.post(f"/api/v1/learning/aulas/{aula.id}/concluir/", {"acertos": 3, "total": 3}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["streak"], 5)
        self.assertEqual(res.data["melhor_streak"], 5)
        self.assertIn("ofensiva-5-dias", res.data["badges"])

        perfil.refresh_from_db()
        self.assertEqual(perfil.streak_atual, 5)
        self.assertTrue(
            UsuarioBadge.objects.filter(usuario=self.aluno, badge__codigo="ofensiva-5-dias").exists()
        )

    def test_streak_reinicia_apos_hiato_mas_preserva_melhor_streak(self):
        """Se o último estudo foi há mais de 1 dia, streak_atual volta para 1 e melhor_streak é preservado."""
        hoje = timezone.localdate()
        GamificacaoPerfil.objects.create(
            usuario=self.aluno,
            streak_atual=6,
            melhor_streak=6,
            ultimo_acesso_estudo=hoje - timedelta(days=3),
            pontuacao_total=60,
        )

        aula = self.aulas[0]
        res = self.client.post(f"/api/v1/learning/aulas/{aula.id}/concluir/", {"acertos": 3, "total": 3}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["streak"], 1)
        self.assertEqual(res.data["melhor_streak"], 6)

    def test_conquista_badge_tres_licoes(self):
        """Ao concluir 3 aulas distintas, o aluno conquista a medalha 'tres-licoes'."""
        for aula in self.aulas:
            res = self.client.post(f"/api/v1/learning/aulas/{aula.id}/concluir/", {"acertos": 3, "total": 3}, format="json")
            self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertIn("primeira-nota", res.data["badges"])
        self.assertIn("tres-licoes", res.data["badges"])
        self.assertEqual(Badge.objects.filter(codigo="tres-licoes").count(), 1)

    def test_notificar_usuarios_em_risco_envia_email_apenas_para_quem_nao_estudou_hoje(self):
        hoje = timezone.localdate()
        ontem = hoje - timedelta(days=1)

        # Aluno em risco: estudou ontem e ainda não estudou hoje
        GamificacaoPerfil.objects.create(
            usuario=self.aluno,
            streak_atual=3,
            melhor_streak=3,
            ultimo_acesso_estudo=ontem,
        )

        # Outro aluno que já estudou hoje (não deve receber e-mail)
        aluno_em_dia = CustomUser.objects.create_user(
            email="emdia@teste.com",
            password="PasswordForte!123",
            nome="Aluno Em Dia",
            role=CustomUser.Role.USUARIO,
            terms_accepted=True,
        )
        GamificacaoPerfil.objects.create(
            usuario=aluno_em_dia,
            streak_atual=5,
            melhor_streak=5,
            ultimo_acesso_estudo=hoje,
        )

        resultado = StreakNotificationService.notificar_usuarios_em_risco()
        self.assertEqual(resultado["elegiveis"], 1)
        self.assertEqual(resultado["enviados"], 1)
        self.assertEqual(resultado["falhas"], 0)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["aluno.game@teste.com"])
        self.assertTrue(AuditLog.objects.filter(action="STREAK_REMINDER_EMAIL_SENT").exists())

    @patch("accounts.services.email_service.EmailService.send_streak_reminder_email")
    def test_notificar_usuarios_em_risco_registra_auditoria_se_smtp_falhar(self, mock_send):
        mock_send.side_effect = Exception("Falha de conexão SMTP Brevo")
        ontem = timezone.localdate() - timedelta(days=1)

        GamificacaoPerfil.objects.create(
            usuario=self.aluno,
            streak_atual=2,
            melhor_streak=2,
            ultimo_acesso_estudo=ontem,
        )

        resultado = StreakNotificationService.notificar_usuarios_em_risco()
        self.assertEqual(resultado["enviados"], 0)
        self.assertEqual(resultado["falhas"], 1)
        self.assertTrue(AuditLog.objects.filter(action="STREAK_REMINDER_EMAIL_FAILED").exists())