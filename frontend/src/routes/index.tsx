// Esse arquivo é responsável por renderizar a página inicial do aplicativo. Ele utiliza o React Router para definir a rota raiz ("/") e exibe um componente de boas-vindas com informações sobre a plataforma Linus. O botão "Iniciar trilha" redireciona o usuário para a página de triagem ("/triagem") quando acionado.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  const handleStartTrail = () => {
    navigate({ to: "/triagem" });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col">
      {/* O header local foi removido para evitar duplicação com o __root.tsx */}

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-[#2D3748] mb-6 max-w-3xl">
          Domine a Teoria Musical de Forma Interativa
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          O Linus é a sua plataforma autônoma para aprender partituras, escalas e modos gregos
          unindo teoria, prática no piano virtual e gamificação.
        </p>

        <Button
          onClick={handleStartTrail}
          className="rounded-lg bg-[#06D6A0] hover:bg-[#06D6A0]/90 text-[#2D3748] text-xl font-bold px-8 py-6 shadow-md transition-transform hover:scale-105"
        >
          Iniciar trilha
        </Button>
      </main>
    </div>
  );
}
