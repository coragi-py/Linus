import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { from: "linus" | "aluno"; text: string };

const SUGESTOES = [
  "O que é uma escala maior?",
  "Para que serve a clave de Sol?",
  "Como funcionam os modos gregos?",
  "Qual a diferença entre tom e semitom?",
];

const BASE: { chaves: string[]; resposta: string }[] = [
  {
    chaves: ["escala maior", "escala"],
    resposta:
      "A escala maior é uma sequência de 7 notas com o padrão tom–tom–semitom–tom–tom–tom–semitom. Em Dó maior: Dó Ré Mi Fá Sol Lá Si. Toque essa sequência no piano e ouça o degrau menor entre Mi–Fá e Si–Dó: é ele que dá o som 'alegre e resolvido' da escala.",
  },
  {
    chaves: ["clave"],
    resposta:
      "A clave define qual nota mora em qual linha da pauta. A clave de Sol fixa o Sol na 2ª linha (região aguda); a clave de Fá fixa o Fá na 4ª linha (região grave). Sem clave, as bolinhas na pauta não têm altura definida.",
  },
  {
    chaves: ["modo", "grego", "dórico", "lídio"],
    resposta:
      "Os modos gregos nascem quando você começa a escala maior em graus diferentes. Em Dó maior: de Dó = jônio, de Ré = dórico, de Mi = frígio, de Fá = lídio, de Sol = mixolídio, de Lá = eólio, de Si = lócrio. As notas são as mesmas, o centro de gravidade muda — e com ele a cor do som.",
  },
  {
    chaves: ["semitom", "tom"],
    resposta:
      "Semitom é a menor distância do sistema temperado: uma tecla vizinha no piano (Dó → Dó#). Tom são dois semitons (Dó → Ré). Toda a construção de escalas e intervalos é contada nessas duas medidas.",
  },
  {
    chaves: ["intervalo", "terça", "quinta"],
    resposta:
      "Intervalo é a distância entre duas notas, medida em semitons. Terça maior = 4 semitons (Dó–Mi), terça menor = 3 (Dó–Mib), quinta justa = 7 (Dó–Sol). Empilhando uma terça e uma quinta você já tem uma tríade.",
  },
  {
    chaves: ["acorde", "tríade", "campo harmônico"],
    resposta:
      "Uma tríade empilha terças: tônica + terça + quinta. Maior = terça maior (Dó Mi Sol); menor = terça menor (Lá Dó Mi). O campo harmônico é o conjunto de acordes formados sobre cada grau da escala — em Dó maior: C, Dm, Em, F, G, Am, Bº.",
  },
];

function responder(pergunta: string): string {
  const p = pergunta.toLowerCase();
  const hit = BASE.find((b) => b.chaves.some((c) => p.includes(c)));
  if (hit) return hit.resposta;
  return "Boa pergunta! Posso explicar leitura de partitura, intervalos, escalas, modos gregos e acordes. Tente perguntar, por exemplo, 'como monto uma tríade menor?' — ou abra a Prática Livre e experimente as notas no piano enquanto conversamos.";
}

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
      text: "Olá! Eu sou o Linus, seu assistente didático. Me conte qual dúvida de teoria musical está te travando.",
    },
  ]);
  const [input, setInput] = useState("");

  function enviar(texto: string) {
    const t = texto.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "aluno", text: t }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { from: "linus", text: responder(t) }]), 380);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col rounded-lg border-none bg-card p-0 shadow-neu">
        <DialogHeader className="border-b border-border p-5 text-left">
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="size-5 text-gold" aria-hidden />
            Assistente Linus
          </DialogTitle>
          <DialogDescription>Explicações pedagógicas sob demanda, em linguagem simples.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed",
                m.from === "linus"
                  ? "bg-background text-foreground shadow-neu-sm"
                  : "ml-auto bg-primary text-primary-foreground",
              )}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => enviar(s)}
                className="focus-ring rounded-md bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
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
              placeholder="Digite sua dúvida..."
              aria-label="Sua dúvida"
              className="rounded-lg"
            />
            <button
              type="submit"
              aria-label="Enviar pergunta"
              className="focus-ring rounded-lg bg-primary px-4 text-primary-foreground shadow-neu-sm active:translate-y-0.5"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
