import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import Stave from "@/components/Stave";

export const Route = createFileRoute("/triagem")({
  component: Triagem,
});

interface Question {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
  tipo: "texto" | "partitura";
  dados_partitura?: any;
}

function Triagem() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ nivel: string; sessionKey: string } | null>(null);

  // Busca as perguntas cadastradas no painel admin do Django
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/placement/questions/");
        setQuestions(response.data);
      } catch (error) {
        console.error("Erro ao buscar perguntas da triagem:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Registra a resposta e avança ou finaliza a triagem
  const handleAnswer = async (optionId: string) => {
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        // Envia as respostas para o backend calcular o nível e gerar a sessão
        const response = await axios.post("http://127.0.0.1:8000/api/v1/placement/submit/", {
          respostas: newAnswers,
        });
        setResult(response.data);
      } catch (error) {
        console.error("Erro ao processar triagem:", error);
      }
    }
  };

  // Roteamento crítico: envia o usuário para o cadastro com a chave da sessão
  const handleCreateAccount = () => {
    navigate({
      to: "/registro",
      search: { placement_session: result?.sessionKey },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F6]">
        Carregando avaliação...
      </div>
    );
  }

  // Se não houver perguntas cadastradas no banco
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F6] p-4">
        <h2 className="text-2xl font-bold text-[#2D3748] mb-4">Nenhuma pergunta cadastrada</h2>
        <p className="text-gray-600 mb-6">
          Acesse o painel do Django Admin para cadastrar as perguntas da triagem.
        </p>
        <Button onClick={() => navigate({ to: "/" })} variant="outline">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  // Tela Final (Resultado do Nivelamento)
  if (result) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-lg border-0 rounded-lg text-center p-8">
          <h2 className="text-3xl font-bold text-[#2D3748] mb-4">Triagem Concluída!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Com base nas suas respostas, seu nível recomendado é:{" "}
            <strong className="text-[#2B6CB0]">{result.nivel}</strong>.
          </p>
          <Button
            onClick={handleCreateAccount}
            className="w-full rounded-lg bg-[#06D6A0] hover:bg-[#06D6A0]/90 text-[#2D3748] text-xl font-bold py-6"
          >
            Criar conta agora
          </Button>
        </Card>
      </div>
    );
  }

  // Tela das Perguntas
  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-sm font-medium text-[#2B6CB0] mb-4 text-center">
          Pergunta {currentIndex + 1} de {questions.length}
        </div>

        <Card className="shadow-md border-0 rounded-lg p-6 md:p-10">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold text-[#2D3748] mb-8 text-center">
              {currentQuestion.enunciado}
            </h2>

            {/* Renderiza o VexFlow apenas se o tipo for 'partitura' e houver dados */}
            {currentQuestion.tipo === "partitura" && currentQuestion.dados_partitura && (
              <div className="flex justify-center items-center w-full my-6 overflow-hidden">
                <Stave data={currentQuestion.dados_partitura} className="w-full max-w-sm mx-auto" />
              </div>
            )}

            <div className="flex flex-col gap-4">
              {currentQuestion.opcoes.map((opcao) => (
                <Button
                  key={opcao.id}
                  variant="outline"
                  onClick={() => handleAnswer(opcao.id)}
                  className="w-full justify-start text-left h-auto py-4 px-6 text-lg rounded-lg border-gray-300 hover:border-[#2B6CB0] hover:bg-[#2B6CB0]/5 whitespace-normal"
                >
                  {opcao.texto}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
