import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { from: "linus" | "aluno"; text: string };

const SUGESTOES = [
  "O que é uma escala maior?",
  "Para que serve a clave de Sol?",
  "Como funcionam os modos gregos?",
  "Qual a diferença entre tom e semitom?",
];

export function AiAssistant({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "linus",
      text: "Olá! Meu caro aluno, sou o Linus. Como posso te auxiliar com os mistérios da Teoria Musical hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function enviar(texto: string) {
    const t = texto.trim();
    if (!t || isLoading) return;

    // Adiciona a mensagem do aluno no chat
    setMsgs((m) => [...m, { from: "aluno", text: t }]);
    setInput("");
    setIsLoading(true);

    try {
      // Chamada para o backend Django (ai_gateway)
      const response = await fetch("http://localhost:8000/api/v1/ai/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: t }),
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o servidor.");
      }

      const data = await response.json();
      
      // Adiciona a resposta real do Gemini/Linus
      setMsgs((m) => [...m, { from: "linus", text: data.reply }]);
    } catch (error) {
      console.error("Erro ao falar com o assistente:", error);
      setMsgs((m) => [
        ...m,
        {
          from: "linus",
          text: "Ah, meu caro, parece que houveram turbulências em minhas antigas memórias e não consegui me conectar ao servidor agora. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col rounded-lg border-none bg-card p-0 shadow-neu">
        <DialogHeader className="border-b border-border p-5 text-left">
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="size-5 text-gold" aria-hidden />
            Assistente Linus — Professor de Teoria Musical
          </DialogTitle>
          <DialogDescription>Tire suas dúvidas sobre teoria musical com o nosso tutor especialista.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                m.from === "linus"
                  ? "bg-background text-foreground shadow-neu-sm"
                  : "ml-auto bg-primary text-primary-foreground",
              )}
            >
              {m.text}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 max-w-[85%] rounded-lg px-4 py-3 text-sm bg-background text-muted-foreground shadow-neu-sm">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Linus está refletindo sobre sua dúvida...</span>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => enviar(s)}
                disabled={isLoading}
                className="focus-ring rounded-md bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              enviar(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida de teoria musical..."
              aria-label="Sua dúvida"
              disabled={isLoading}
              className="rounded-lg"
            />
            <button
              type="submit"
              aria-label="Enviar pergunta"
              disabled={isLoading}
              className="focus-ring rounded-lg bg-primary px-4 text-primary-foreground shadow-neu-sm active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}