import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
// Importa o piano virtual gerado pelo Lovable para a demonstração
import { VirtualPiano } from "@/components/VirtualPiano";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  const handleStartTrail = () => {
    navigate({ to: "/triagem" });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col relative overflow-x-hidden">
      {/* 
        IMAGEM DE FUNDO (Background da Hero)
        Coloque uma imagem chamada 'hero-bg.jpg' dentro da pasta 'public/' do seu frontend.
        A opacidade em 5% (opacity-5) garante que o texto continue perfeitamente legível.
      */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      <main className="flex-1 flex flex-col items-center pt-20 pb-24 px-4 relative z-10">
        {/* SEÇÃO HERO */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <h1 className="text-5xl font-extrabold text-[#2D3748] mb-8 leading-tight">
            Aprenda teoria musical na prática com o Linus!
          </h1>

          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Explore partituras, escalas e modos gregos com exercícios interativos, piano virtual e
            feedback imediato.
          </p>

          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Descubra seu nível, avance no seu ritmo e transforme conceitos musicais em prática.
          </p>

          <Button
            onClick={handleStartTrail}
            className="rounded-lg bg-[#06D6A0] hover:bg-[#06D6A0]/90 text-[#2D3748] text-xl font-bold px-10 py-7 shadow-lg transition-transform hover:scale-105"
          >
            Descobrir meu nível
          </Button>
        </div>

        {/* SEÇÃO DO PLAYGROUND (Demonstração do Piano) */}
        <section className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#2D3748]">Experimente a prática livre</h2>
            <p className="text-gray-500 mt-2 text-lg">
              Use o teclado do seu computador ou clique nas teclas virtuais.
            </p>
          </div>

          {/* Container do Piano */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col items-center">
            <VirtualPiano />
          </div>
        </section>
      </main>
    </div>
  );
}
