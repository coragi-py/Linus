# Esse arquivo contém as rotas principais do projeto, incluindo a rota para o painel de administração do Django e a inclusão das rotas da aplicação de triagem de usuários.
# Adicionando rota glossary, por Anny em 07/09
# Adicionando rota learning, por Fabio em 10/09

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/placement/', include('placement.urls')),
    path('api/v1/learning/', include('learning.urls')),
    path('api/v1/glossary/', include('glossary.urls')), 
]