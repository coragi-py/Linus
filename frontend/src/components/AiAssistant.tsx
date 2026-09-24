import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { from: "linus" | "aluno"; text: string };

const SUGESTOES = [
  "O que é uma pauta?",
  "Para que serve a clave de Sol?",
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

    setMsgs((m) => [...m, { from: "aluno", text: t }]);
    setInput("");
    setIsLoading(true);

    try {
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
      setMsgs((m) => [...m, { from: "linus", text: data.reply }]);
    } catch (error) {
      console.error("Erro ao falar com o assistente:", error);
      setMsgs((m) => [
        ...m,
        {
          from: "linus",
          text: "Ah, meu caro, ocorreu um pequeno contratempo ao consultar minhas antigas partituras. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Se estiver fechado, não renderiza nada na tela
  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col rounded-2xl bg-card shadow-2xl border border-border/60 animate-in fade-in slide-in-from-bottom-5">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-background/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-gold" aria-hidden />
          <h3 className="font-display text-base font-bold text-foreground">Assistente Linus</h3>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Corpo das Mensagens (Scrollável) */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap shadow-neu-sm",
              m.from === "linus"
                ? "bg-background text-foreground border border-border/40"
                : "ml-auto bg-primary text-primary-foreground",
            )}
          >
            {m.text}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs bg-background text-muted-foreground border border-border/40 shadow-neu-sm">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>Linus está refletindo...</span>
          </div>
        )}
      </div>

      {/* Sugestões rápidas e Input */}
      <div className="border-t border-border p-3 bg-background/30 rounded-b-2xl">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGESTOES.slice(0, 2).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => enviar(s)}
              disabled={isLoading}
              className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50 truncate max-w-[170px] cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="flex gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida..."
            aria-label="Sua dúvida"
            disabled={isLoading}
            className="h-9 rounded-lg text-xs"
          />
          <button
            type="submit"
            aria-label="Enviar pergunta"
            disabled={isLoading}
            className="flex items-center justify-center h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-foreground shadow-neu-sm active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <Send className="size-3.5" aria-hidden />
          </button>
        </form>
      </div>
    </div>
  );
}