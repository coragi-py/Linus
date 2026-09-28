from django.contrib.auth.hashers import Argon2PasswordHasher

class LinusArgon2PasswordHasher(Argon2PasswordHasher):
    """
    Configuração customizada do Argon2id de acordo com os requisitos de segurança.
    Custo de memória: 64 MiB (65536 KB)
    Tempo de iteração (time_cost): 3
    Paralelismo: 4
    """
    time_cost = 3
    memory_cost = 65536
    parallelism = 4