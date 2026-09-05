// Esse arquivo é responsável por renderizar a página de triagem, onde os usuários respondem a perguntas para determinar seu nível de habilidade musical.
// Ele utiliza React, React Router e Axios para buscar perguntas da API e enviar respostas.
// A interface é construída com componentes de UI personalizados e inclui feedback visual sobre o progresso do usuário e o resultado final da triagem.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
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

interface TriagemResult {
  nivel: string;
  sessionKey: string;
  estatisticas: {
    acertos: number;
    total_questoes: number;
    pontos: number;
    pontos_maximos: number;
  };
  modulo_recomendado: {
    titulo: string;
    descricao: string;
  };
}

function Triagem() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TriagemResult | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/placement/questions/");
        // Verifica se a API retornou os dados de forma paginada ou direta
        setQuestions(response.data.results || response.data);
      } catch (error) {
        console.error("Erro ao buscar perguntas da triagem:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (optionId: string) => {
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/v1/placement/submit/", {
          respostas: newAnswers,
        });
        setResult(response.data);
      } catch (error) {
        console.error("Erro ao processar triagem:", error);
      }
    }
  };

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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F6] p-4">
        <h2 className="text-2xl font-bold text-[#2D3748] mb-4">Nenhuma pergunta ativa</h2>
        <Button onClick={() => navigate({ to: "/" })} variant="outline">
          Voltar
        </Button>
      </div>
    );
  }

  // TELA DE RESULTADO (Design idêntico ao Mockup)
  if (result) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-xl shadow-sm border border-gray-100 rounded-2xl text-center p-8 bg-white">
          {/* Ícone de Sucesso */}
          <div className="w-16 h-16 bg-[#06D6A0] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Check className="w-10 h-10 text-[#1E2A38]" strokeWidth={3} />
          </div>

          <h2 className="text-3xl font-extrabold text-[#2D3748] mb-2">Seu nível: {result.nivel}</h2>

          <p className="text-base text-gray-500 mb-8">
            Você acertou {result.estatisticas.acertos} de {result.estatisticas.total_questoes}{" "}
            questões.
          </p>

          {/* Card de Recomendação do Módulo */}
          <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-6 text-left mb-8 shadow-inner">
            <h4 className="text-[#2B6CB0] text-xs font-bold uppercase tracking-wider mb-2">
              Comece por aqui
            </h4>
            <h3 className="text-xl font-bold text-[#2D3748] mb-1">
              {result.modulo_recomendado.titulo}
            </h3>
            <p className="text-gray-500 text-sm">{result.modulo_recomendado.descricao}</p>
          </div>

          <Button
            onClick={handleCreateAccount}
            className="w-full rounded-lg bg-[#2B6CB0] hover:bg-[#2B6CB0]/90 text-white text-lg font-bold py-6 shadow-md transition-transform hover:scale-[1.02]"
          >
            Criar conta agora
          </Button>
        </Card>
      </div>
    );
  }

  // TELA DAS PERGUNTAS
  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-sm font-medium text-[#2B6CB0] mb-4 text-center">
          Pergunta {currentIndex + 1} de {questions.length}
        </div>

        <Card className="shadow-md border-0 rounded-2xl p-6 md:p-10">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold text-[#2D3748] mb-8 text-center">
              {currentQuestion.enunciado}
            </h2>

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
                  className="w-full justify-start text-left h-auto py-4 px-6 text-lg rounded-xl border-gray-200 hover:border-[#2B6CB0] hover:bg-[#2B6CB0]/5 whitespace-normal text-gray-700"
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
