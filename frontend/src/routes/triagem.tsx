// Esse arquivo é responsável pela tela de triagem do usuário, que determina o nível de habilidade musical antes do registro.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Importe o seu componente de partitura, se houver uma pergunta visual
// import Stave from '@/components/Stave';

export const Route = createFileRoute("/triagem")({
  component: Triagem,
});

// Tipagem baseada no que virá do Django (/api/v1/placement/)
interface Question {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
  tipo: "texto" | "partitura";
  dados_partitura?: any; // Para renderizar o VexFlow, se necessário
}

function Triagem() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ nivel: string; sessionKey: string } | null>(null);

  // 1. Busca as perguntas do Backend (sem hardcode)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Substituir por chamada Axios real: axios.get('/api/v1/placement/questions')
        // Mock temporário para simular o retorno dinâmico do admin:
        const mockBackendResponse: Question[] = [
          {
            id: "q1",
            enunciado: "Qual é o seu nível de experiência com leitura de partituras?",
            tipo: "texto",
            opcoes: [
              { id: "a", texto: "Nunca li uma partitura (Iniciante Absoluto)" },
              { id: "b", texto: "Sei o básico, mas leio devagar (Intermediário)" },
              { id: "c", texto: "Toco de ouvido, mas não leio (Praticante Empírico)" },
            ],
          },
        ];
        setQuestions(mockBackendResponse);
      } catch (error) {
        console.error("Erro ao buscar perguntas da triagem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 2. Lida com a seleção da resposta
  const handleAnswer = async (optionId: string) => {
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 3. Finaliza a triagem e envia respostas para o backend
      // axios.post('/api/v1/placement/submit', { respostas: newAnswers })

      // Mock do resultado processado pelo servidor
      setResult({
        nivel: "Iniciante",
        sessionKey: "sess_12345abcde", // Chave para persistir o nível na criação da conta
      });
    }
  };

  // 4. Redirecionamento CRÍTICO para a tela de Registro
  const handleCreateAccount = () => {
    // Passamos a sessionKey via state ou search params para o formulário de registro
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

  // TELA DE RESULTADO (Final da Triagem)
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

  // TELA DO QUESTIONÁRIO
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

            {/* Renderização condicional para perguntas que exigem VexFlow */}
            {currentQuestion.tipo === "partitura" && (
              <div className="flex justify-center items-center w-full my-6 overflow-hidden">
                {/* O container deve garantir que a clave não seja cortada */}
                {/* <Stave data={currentQuestion.dados_partitura} className="w-full max-w-sm mx-auto" /> */}
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
