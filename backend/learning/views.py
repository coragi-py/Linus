from datetime import timedelta
from decimal import Decimal
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import CustomUser
from audit.services.audit_service import AuditService
from exercises.models import Exercicio, TentativaExercicio
from exercises.serializers import ExercicioSerializer, TentativaExercicioSerializer
from gamification.models import GamificacaoPerfil, Badge, UsuarioBadge
from gamification.services.notification_service import StreakNotificationService
from placement.models import TriagemInicial
from progress.models import ProgressoAula
from .models import Modulo, Aula
from .serializers import ModuloSerializer, AulaSerializer


class IsAdminConteudoOrReadOnly(permissions.BasePermission):
    """
    Permite leitura (GET, HEAD, OPTIONS) a qualquer usuário e restringe
    escrita (POST, PUT, PATCH, DELETE) a ADMIN_CONTEUDO, ADMIN_SISTEMA ou staff.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return (
            user.is_staff
            or user.is_superuser
            or getattr(user, 'role', None) in (
                CustomUser.Role.ADMIN_CONTEUDO,
                CustomUser.Role.ADMIN_SISTEMA,
            )
        )


def _calcular_erros_por_topico(usuario):
    """
    Agrega o total de tentativas e erros por tag_topico para o RF05 (Foco de Estudo).
    """
    agregado = (
        TentativaExercicio.objects.filter(usuario=usuario)
        .values('exercicio__tag_topico')
        .annotate(
            total=Count('id'),
            erros=Count('id', filter=Q(acertou=False)),
        )
    )
    resultado = {}
    for item in agregado:
        topico = item['exercicio__tag_topico'] or 'Geral'
        resultado[topico] = {
            'erros': item['erros'],
            'total': item['total'],
        }
    return resultado


def _conceder_badge_se_elegivel(usuario, codigo, nome, descricao):
    badge, _ = Badge.objects.get_or_create(
        codigo=codigo,
        defaults={
            'nome': nome,
            'descricao': descricao,
            'icone_url': 'star',
        },
    )
    UsuarioBadge.objects.get_or_create(usuario=usuario, badge=badge)


class ModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all().order_by('ordem')
    serializer_class = ModuloSerializer
    permission_classes = [IsAdminConteudoOrReadOnly]
    pagination_class = None

    def perform_create(self, serializer):
        instancia = serializer.save()
        AuditService.log_event(
            self.request,
            self.request.user,
            'MODULO_CREATED',
            {'modulo_id': str(instancia.id), 'titulo': instancia.titulo},
        )

    def perform_update(self, serializer):
        instancia = serializer.save()
        AuditService.log_event(
            self.request,
            self.request.user,
            'MODULO_UPDATED',
            {'modulo_id': str(instancia.id), 'titulo': instancia.titulo},
        )

    def perform_destroy(self, instance):
        modulo_id = str(instance.id)
        titulo = instance.titulo
        instance.delete()
        AuditService.log_event(
            self.request,
            self.request.user,
            'MODULO_DELETED',
            {'modulo_id': modulo_id, 'titulo': titulo},
        )


class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all().order_by('modulo__ordem', 'ordem')
    serializer_class = AulaSerializer
    permission_classes = [IsAdminConteudoOrReadOnly]
    pagination_class = None

    def perform_create(self, serializer):
        instancia = serializer.save()
        AuditService.log_event(
            self.request,
            self.request.user,
            'AULA_CREATED',
            {'aula_id': str(instancia.id), 'titulo': instancia.titulo},
        )

    def perform_update(self, serializer):
        instancia = serializer.save()
        AuditService.log_event(
            self.request,
            self.request.user,
            'AULA_UPDATED',
            {'aula_id': str(instancia.id), 'titulo': instancia.titulo},
        )

    def perform_destroy(self, instance):
        aula_id = str(instance.id)
        titulo = instance.titulo
        instance.delete()
        AuditService.log_event(
            self.request,
            self.request.user,
            'AULA_DELETED',
            {'aula_id': aula_id, 'titulo': titulo},
        )

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticated],
        url_path='concluir',
    )
    def concluir(self, request, pk=None):
        """
        Marca a lição como concluída para o aluno autenticado, atualiza taxa de acerto,
        streak diário (RF06) e concede medalhas dentro de uma transação atômica.
        """
        aula = self.get_object()
        usuario = request.user

        acertos = request.data.get('acertos')
        total = request.data.get('total')
        taxa_informada = request.data.get('taxa_acerto')

        if taxa_informada is not None:
            taxa = Decimal(str(round(float(taxa_informada), 2)))
        elif acertos is not None and total:
            taxa = Decimal(str(round((float(acertos) / max(float(total), 1.0)) * 100.0, 2)))
        else:
            taxa = Decimal('100.00')

        hoje = timezone.localdate()

        with transaction.atomic():
            progresso, created = ProgressoAula.objects.get_or_create(
                usuario=usuario,
                aula=aula,
                defaults={'concluida': True, 'taxa_acerto': taxa},
            )
            if not created:
                progresso.concluida = True
                progresso.taxa_acerto = taxa
                progresso.save()

            perfil, _ = GamificacaoPerfil.objects.get_or_create(usuario=usuario)
            if perfil.ultimo_acesso_estudo != hoje:
                if perfil.ultimo_acesso_estudo == hoje - timedelta(days=1):
                    perfil.streak_atual += 1
                else:
                    perfil.streak_atual = 1
                perfil.ultimo_acesso_estudo = hoje

            if perfil.streak_atual > perfil.melhor_streak:
                perfil.melhor_streak = perfil.streak_atual

            perfil.pontuacao_total += 10
            perfil.save()

            total_concluidas = ProgressoAula.objects.filter(
                usuario=usuario, concluida=True
            ).count()

            if total_concluidas >= 1:
                _conceder_badge_se_elegivel(
                    usuario,
                    'primeira-nota',
                    'Primeira Nota',
                    'Concluiu a primeira lição na trilha do Linus.',
                )
            if total_concluidas >= 3:
                _conceder_badge_se_elegivel(
                    usuario,
                    'tres-licoes',
                    'Três Lições',
                    'Concluiu 3 lições na trilha de aprendizado.',
                )
            if perfil.streak_atual >= 5:
                _conceder_badge_se_elegivel(
                    usuario,
                    'ofensiva-5-dias',
                    'Consistência (5 dias)',
                    'Manteve uma ofensiva de estudos por 5 dias consecutivos.',
                )

            AuditService.log_event(
                request,
                usuario,
                'LESSON_COMPLETED',
                {
                    'aula_id': str(aula.id),
                    'taxa_acerto': float(taxa),
                    'streak_atual': perfil.streak_atual,
                },
            )

        badges_codigos = list(
            UsuarioBadge.objects.filter(usuario=usuario)
            .select_related('badge')
            .values_list('badge__codigo', flat=True)
        )
        completed_ids = [
            str(aid)
            for aid in ProgressoAula.objects.filter(
                usuario=usuario, concluida=True
            ).values_list('aula_id', flat=True)
        ]

        return Response(
            {
                'aula_id': str(aula.id),
                'concluida': True,
                'taxa_acerto': float(progresso.taxa_acerto),
                'streak': perfil.streak_atual,
                'melhor_streak': perfil.melhor_streak,
                'pontuacao_total': perfil.pontuacao_total,
                'completedLessons': completed_ids,
                'badges': badges_codigos,
            },
            status=status.HTTP_200_OK,
        )


class ExercicioViewSet(viewsets.ModelViewSet):
    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer
    permission_classes = [IsAdminConteudoOrReadOnly]
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        aula_id = self.request.query_params.get('aula')
        if aula_id:
            qs = qs.filter(aula_id=aula_id)
        return qs

    def perform_create(self, serializer):
        instancia = serializer.save()
        AuditService.log_event(
            self.request,
            self.request.user,
            'EXERCICIO_CREATED',
            {'exercicio_id': str(instancia.id), 'aula_id': str(instancia.aula_id)},
        )


class RegistrarTentativaView(APIView):
    """
    Endpoint (POST /api/v1/learning/tentativas/) para registrar cada resposta
    do aluno em tempo real (RF04 e RF05).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        exercicio_id = request.data.get('exercicio')
        acertou = bool(request.data.get('acertou', False))
        tempo_resposta_ms = int(request.data.get('tempo_resposta_ms', 0))
        resposta_aluno = request.data.get('resposta')

        if not exercicio_id:
            return Response(
                {'error': 'O campo exercicio é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            exercicio = Exercicio.objects.get(id=exercicio_id)
        except (Exercicio.DoesNotExist, ValueError):
            return Response(
                {'error': 'Exercício não encontrado.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Se resposta_aluno foi enviada, valida contra o gabarito do banco
        gabarito = exercicio.gabarito_dados if isinstance(exercicio.gabarito_dados, dict) else {}
        if resposta_aluno is not None and 'answer' in gabarito:
            acertou = str(resposta_aluno).strip() == str(gabarito['answer']).strip()

        tentativa = TentativaExercicio.objects.create(
            usuario=request.user,
            exercicio=exercicio,
            acertou=acertou,
            tempo_resposta_ms=max(tempo_resposta_ms, 0),
        )

        return Response(
            {
                'tentativa': TentativaExercicioSerializer(tentativa).data,
                'acertou': acertou,
                'answer': gabarito.get('answer', ''),
                'explanation': gabarito.get('explanation', ''),
                'errorsByTopic': _calcular_erros_por_topico(request.user),
            },
            status=status.HTTP_201_CREATED,
        )


class MeuProgressoView(APIView):
    """
    Endpoint (GET /api/v1/learning/progresso/) que retorna o estado consolidado
    do aluno autenticado para sincronizar trilha.tsx, painel.tsx e LinusContext.tsx.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        usuario = request.user
        perfil, _ = GamificacaoPerfil.objects.get_or_create(usuario=usuario)

        completed_ids = [
            str(aid)
            for aid in ProgressoAula.objects.filter(
                usuario=usuario, concluida=True
            ).values_list('aula_id', flat=True)
        ]

        badges_codigos = list(
            UsuarioBadge.objects.filter(usuario=usuario)
            .select_related('badge')
            .values_list('badge__codigo', flat=True)
        )

        triagem = (
            TriagemInicial.objects.filter(usuario=usuario)
            .order_by('-realizada_em')
            .first()
        )

        return Response(
            {
                'nome': usuario.nome,
                'role': usuario.role,
                'streak': perfil.streak_atual,
                'melhor_streak': perfil.melhor_streak,
                'pontuacao_total': perfil.pontuacao_total,
                'completedLessons': completed_ids,
                'badges': badges_codigos,
                'errorsByTopic': _calcular_erros_por_topico(usuario),
                'placement': triagem.nivel_atribuido if triagem else None,
            },
            status=status.HTTP_200_OK,
        )
    
class DispararLembretesStreakView(APIView):
    """
    Endpoint administrativo (POST /api/v1/learning/streak-reminders/) para
    acionar o envio de lembretes de ofensiva via Brevo.
    """
    permission_classes = [IsAdminConteudoOrReadOnly]

    def post(self, request):
        resultado = StreakNotificationService.notificar_usuarios_em_risco(request=request)
        return Response(resultado, status=status.HTTP_200_OK)