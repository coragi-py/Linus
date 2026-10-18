import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import {
  Layers,
  BookOpen,
  HelpCircle,
  Bookmark,
  Plus,
  Trash2,
  Edit,
  Music,
  FileText,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Stave from "@/components/Stave";
import { GlossaryDiagram } from "@/components/GlossaryDiagram";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminConteudoPage,
});

const API_BASE = "http://localhost:8000/api/v1";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const NIVEIS_UNIDADE = ["Iniciante", "Intermediário", "Praticante Empírico"] as const;

const CATEGORIAS_GLOSSARIO = [
  "Pautas e Claves",
  "Fórmulas de Compasso",
  "Figuras de Nota",
  "Pausas",
  "Acidentes",
];

const SIMBOLOS_GLOSSARIO_PRESETS: { label: string; value: string; grupo: string }[] = [
  { label: "Clave de Sol", value: "treble", grupo: "Claves" },
  { label: "Clave de Fá", value: "bass", grupo: "Claves" },
  { label: "Clave de Dó (Alto)", value: "alto", grupo: "Claves" },
  { label: "Compasso 4/4", value: "time-4/4", grupo: "Compassos" },
  { label: "Compasso 3/4", value: "time-3/4", grupo: "Compassos" },
  { label: "Compasso 2/4", value: "time-2/4", grupo: "Compassos" },
  { label: "Semibreve", value: "whole", grupo: "Figuras" },
  { label: "Mínima", value: "half", grupo: "Figuras" },
  { label: "Semínima", value: "quarter", grupo: "Figuras" },
  { label: "Colcheia", value: "eighth", grupo: "Figuras" },
  { label: "Semicolcheia", value: "sixteenth", grupo: "Figuras" },
  { label: "Pausa Semibreve", value: "whole-rest", grupo: "Pausas" },
  { label: "Pausa Semínima", value: "quarter-rest", grupo: "Pausas" },
  { label: "Sustenido (#)", value: "sharp", grupo: "Acidentes" },
  { label: "Bemol (b)", value: "flat", grupo: "Acidentes" },
  { label: "Bequadro", value: "natural", grupo: "Acidentes" },
];

interface OpcaoForm {
  id?: string;
  texto: string;
  peso_perfil: number;
}

export default function AdminConteudoPage() {
  const [activeTab, setActiveTab] = useState("unidades");

  // Dados carregados da API
  const [modulos, setModulos] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [glossario, setGlossario] = useState<any[]>([]);

  // ================= ESTADO: UNIDADES (MÓDULOS) =================
  const [editingModuloId, setEditingModuloId] = useState<string | null>(null);
  const [moduloForm, setModuloForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "Iniciante",
    ordem: 1,
    ativo: true,
  });

  // ================= ESTADO: LIÇÕES (AULAS) & EXERCÍCIOS =================
  const [editingAulaId, setEditingAulaId] = useState<string | null>(null);
  const [filtroModuloId, setFiltroModuloId] = useState<string>("todos");
  const [expandedAulaId, setExpandedAulaId] = useState<string | null>(null);
  const [aulaForm, setAulaForm] = useState({
    modulo: "",
    titulo: "",
    ordem: 1,
    conteudo_teorico: "",
    ativa: true,
  });

  const [exercicioForm, setExercicioForm] = useState({
    tipo: "multiple-choice" as "note-reading" | "multiple-choice" | "keyboard" | "builder",
    enunciado: "",
    ordem: 1,
    staveStr: "C4",
    optionsStr: "Dó, Ré, Mi, Fá",
    answer: "",
    sequenceStr: "C4, D4, E4",
    explanation: "",
  });

  // ================= ESTADO: TRIAGEM =================
  const [editingPerguntaId, setEditingPerguntaId] = useState<string | null>(null);
  const [modoJsonAvancado, setModoJsonAvancado] = useState(false);
  const [partituraBuilder, setPartituraBuilder] = useState({
    clef: "treble",
    timeSignature: "4/4",
    notes: "C4/w",
  });
  const [perguntaForm, setPerguntaForm] = useState({
    enunciado: "",
    tipo: "texto" as "texto" | "partitura",
    ordem: 1,
    ativo: true,
    dados_partitura_str:
      '{\n  "clef": "treble",\n  "timeSignature": "4/4",\n  "notes": "C4/w",\n  "width": 300,\n  "height": 130\n}',
    opcoes: [
      { texto: "", peso_perfil: 2 },
      { texto: "", peso_perfil: 1 },
      { texto: "", peso_perfil: 1 },
      { texto: "", peso_perfil: 1 },
    ] as OpcaoForm[],
  });

  // ================= ESTADO: GLOSSÁRIO =================
  const [editingTermoId, setEditingTermoId] = useState<string | null>(null);
  const [novoTermo, setNovoTermo] = useState({
    termo: "",
    categoria: CATEGORIAS_GLOSSARIO[0],
    definicao: "",
    figura_svg: "treble",
  });

  // Carregamento inicial
  const fetchData = async () => {
    try {
      const [resMod, resAul, resTri, resGlo] = await Promise.allSettled([
        axios.get(`${API_BASE}/learning/modulos/`),
        axios.get(`${API_BASE}/learning/aulas/`),
        axios.get(`${API_BASE}/placement/admin/questoes/`),
        axios.get(`${API_BASE}/glossary/termos/`),
      ]);

      if (resMod.status === "fulfilled") {
        const listaMod = resMod.value.data.results || resMod.value.data || [];
        setModulos(listaMod);
      }
      if (resAul.status === "fulfilled") {
        const listaAul = resAul.value.data.results || resAul.value.data || [];
        setAulas(listaAul);
      }
      if (resTri.status === "fulfilled") {
        const listaTri = resTri.value.data.results || resTri.value.data || [];
        setPerguntas(listaTri);
      }
      if (resGlo.status === "fulfilled") {
        const listaGlo = resGlo.value.data.results || resGlo.value.data || [];
        setGlossario(listaGlo);
      }
    } catch (err) {
      console.error("Erro ao carregar conteúdos:", err);
      toast.error("Falha ao sincronizar conteúdos com o servidor.");
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // Sincroniza construtor visual de partitura da Triagem com o JSON
  const atualizarPartituraBuilder = (patch: Partial<typeof partituraBuilder>) => {
    const atualizado = { ...partituraBuilder, ...patch };
    setPartituraBuilder(atualizado);
    const jsonObj = {
      clef: atualizado.clef,
      timeSignature: atualizado.timeSignature,
      notes: atualizado.notes,
      width: 300,
      height: 130,
    };
    setPerguntaForm((prev) => ({
      ...prev,
      dados_partitura_str: JSON.stringify(jsonObj, null, 2),
    }));
  };

  const parsedPartituraPreview = useMemo(() => {
    if (perguntaForm.tipo !== "partitura" || !perguntaForm.dados_partitura_str.trim()) return null;
    try {
      const parsed = JSON.parse(perguntaForm.dados_partitura_str);
      if (parsed && typeof parsed === "object" && parsed.notes) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [perguntaForm.tipo, perguntaForm.dados_partitura_str]);

  // Mapa rápido de ID do Módulo -> Objeto Módulo
  const mapaModulos = useMemo(() => {
    const map: Record<string, any> = {};
    for (const m of modulos) {
      map[String(m.id)] = m;
    }
    return map;
  }, [modulos]);

  const aulasFiltradas = useMemo(() => {
    if (filtroModuloId === "todos") return aulas;
    return aulas.filter((a) => String(a.modulo) === filtroModuloId);
  }, [aulas, filtroModuloId]);

  // ================= HANDLERS: UNIDADES =================
  const resetModuloForm = () => {
    setEditingModuloId(null);
    setModuloForm({
      titulo: "",
      descricao: "",
      categoria: "Iniciante",
      ordem: modulos.length + 1,
      ativo: true,
    });
  };

  const handleEditarModuloClick = (m: any) => {
    setEditingModuloId(m.id);
    setModuloForm({
      titulo: m.titulo || "",
      descricao: m.descricao || "",
      categoria: m.categoria || "Iniciante",
      ordem: m.ordem || 1,
      ativo: m.ativo !== false,
    });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSalvarModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModuloId) {
        await axios.put(`${API_BASE}/learning/modulos/${editingModuloId}/`, moduloForm);
        toast.success("Unidade atualizada com sucesso!");
      } else {
        await axios.post(`${API_BASE}/learning/modulos/`, moduloForm);
        toast.success("Nova unidade cadastrada!");
      }
      resetModuloForm();
      void fetchData();
    } catch {
      toast.error("Não foi possível salvar a unidade.");
    }
  };

  const handleToggleAtivoModulo = async (m: any) => {
    try {
      await axios.patch(`${API_BASE}/learning/modulos/${m.id}/`, { ativo: !m.ativo });
      toast.success(`Unidade ${!m.ativo ? "ativada" : "inativada"}.`);
      void fetchData();
    } catch {
      toast.error("Erro ao alterar status da unidade.");
    }
  };

  const handleExcluirModulo = async (id: string) => {
    if (!confirm("Excluir esta unidade apagará as lições vinculadas. Confirmar?")) return;
    try {
      await axios.delete(`${API_BASE}/learning/modulos/${id}/`);
      if (editingModuloId === id) resetModuloForm();
      toast.success("Unidade removida.");
      void fetchData();
    } catch {
      toast.error("Erro ao remover unidade.");
    }
  };

  // ================= HANDLERS: LIÇÕES E EXERCÍCIOS =================
  const resetAulaForm = () => {
    setEditingAulaId(null);
    setAulaForm({
      modulo: "",
      titulo: "",
      ordem: 1,
      conteudo_teorico: "",
      ativa: true,
    });
  };

  const handleEditarAulaClick = (a: any) => {
    setEditingAulaId(a.id);
    setAulaForm({
      modulo: String(a.modulo),
      titulo: a.titulo || "",
      ordem: a.ordem || 1,
      conteudo_teorico: a.conteudo_teorico || "",
      ativa: a.ativa !== false,
    });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSalvarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAulaId) {
        await axios.put(`${API_BASE}/learning/aulas/${editingAulaId}/`, aulaForm);
        toast.success("Lição atualizada com sucesso!");
      } else {
        await axios.post(`${API_BASE}/learning/aulas/`, aulaForm);
        toast.success("Nova lição cadastrada!");
      }
      resetAulaForm();
      void fetchData();
    } catch {
      toast.error("Falha ao salvar lição. Verifique se selecionou uma unidade válida.");
    }
  };

  const handleExcluirAula = async (id: string) => {
    if (!confirm("Confirmar exclusão desta lição e de seus exercícios?")) return;
    try {
      await axios.delete(`${API_BASE}/learning/aulas/${id}/`);
      if (editingAulaId === id) resetAulaForm();
      toast.success("Lição excluída.");
      void fetchData();
    } catch {
      toast.error("Erro ao remover lição.");
    }
  };

  const handleCriarExercicio = async (e: React.FormEvent, aula: any) => {
    e.preventDefault();
    const unidadePai = mapaModulos[String(aula.modulo)];
    const tagTopico = unidadePai
      ? String(unidadePai.titulo).replace(/^Unidade \d+:\s*/i, "")
      : "Teoria Musical";

    const gabarito: Record<string, any> = {
      ordem: exercicioForm.ordem,
      answer: exercicioForm.answer.trim(),
      explanation: exercicioForm.explanation.trim(),
    };

    if (exercicioForm.tipo === "note-reading" || exercicioForm.tipo === "keyboard") {
      gabarito.stave = exercicioForm.staveStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (exercicioForm.tipo === "note-reading" || exercicioForm.tipo === "multiple-choice") {
      gabarito.options = exercicioForm.optionsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (exercicioForm.tipo === "keyboard") {
      gabarito.targetNote = exercicioForm.answer.trim();
    }
    if (exercicioForm.tipo === "builder") {
      const seq = exercicioForm.sequenceStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      gabarito.sequence = seq;
      if (!gabarito.answer) {
        gabarito.answer = seq.join(",");
      }
    }

    try {
      await axios.post(`${API_BASE}/learning/exercicios/`, {
        aula: aula.id,
        tipo: exercicioForm.tipo,
        enunciado: exercicioForm.enunciado,
        gabarito_dados: gabarito,
        tag_topico: tagTopico,
        ativo: true,
      });
      toast.success("Exercício adicionado à lição!");
      setExercicioForm({
        ...exercicioForm,
        enunciado: "",
        ordem: (aula.exercicios?.length || 0) + 2,
        answer: "",
        explanation: "",
      });
      void fetchData();
    } catch {
      toast.error("Erro ao adicionar exercício.");
    }
  };

  const handleExcluirExercicio = async (exercicioId: string) => {
    if (!confirm("Remover este exercício da lição?")) return;
    try {
      await axios.delete(`${API_BASE}/learning/exercicios/${exercicioId}/`);
      toast.success("Exercício removido.");
      void fetchData();
    } catch {
      toast.error("Erro ao excluir exercício.");
    }
  };

  // ================= HANDLERS: TRIAGEM =================
  const resetPerguntaForm = () => {
    setEditingPerguntaId(null);
    setPartituraBuilder({ clef: "treble", timeSignature: "4/4", notes: "C4/w" });
    setPerguntaForm({
      enunciado: "",
      tipo: "texto",
      ordem: perguntas.length + 1,
      ativo: true,
      dados_partitura_str:
        '{\n  "clef": "treble",\n  "timeSignature": "4/4",\n  "notes": "C4/w",\n  "width": 300,\n  "height": 130\n}',
      opcoes: [
        { texto: "", peso_perfil: 2 },
        { texto: "", peso_perfil: 1 },
        { texto: "", peso_perfil: 1 },
        { texto: "", peso_perfil: 1 },
      ],
    });
  };

  const handleEditarPerguntaClick = (p: any) => {
    setEditingPerguntaId(p.id);
    if (p.dados_partitura && typeof p.dados_partitura === "object") {
      setPartituraBuilder({
        clef: p.dados_partitura.clef || "treble",
        timeSignature: p.dados_partitura.timeSignature || "4/4",
        notes: p.dados_partitura.notes || "C4/w",
      });
    }
    setPerguntaForm({
      enunciado: p.enunciado,
      tipo: p.tipo,
      ordem: p.ordem,
      ativo: p.ativo,
      dados_partitura_str: p.dados_partitura
        ? JSON.stringify(p.dados_partitura, null, 2)
        : '{\n  "clef": "treble",\n  "timeSignature": "4/4",\n  "notes": "C4/w",\n  "width": 300,\n  "height": 130\n}',
      opcoes:
        p.opcoes && p.opcoes.length > 0
          ? p.opcoes.map((op: any) => ({
              id: op.id,
              texto: op.texto,
              peso_perfil: op.peso_perfil,
            }))
          : [
              { texto: "", peso_perfil: 2 },
              { texto: "", peso_perfil: 1 },
              { texto: "", peso_perfil: 1 },
              { texto: "", peso_perfil: 1 },
            ],
    });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleAddOpcao = () => {
    setPerguntaForm({
      ...perguntaForm,
      opcoes: [...perguntaForm.opcoes, { texto: "", peso_perfil: 1 }],
    });
  };

  const handleRemoveOpcao = (index: number) => {
    if (perguntaForm.opcoes.length <= 2) {
      toast.warning("A questão precisa ter ao menos duas alternativas.");
      return;
    }
    const novasOpcoes = perguntaForm.opcoes.filter((_, idx) => idx !== index);
    setPerguntaForm({ ...perguntaForm, opcoes: novasOpcoes });
  };

  const handleOpcaoChange = (index: number, field: "texto" | "peso_perfil", value: any) => {
    const novasOpcoes = [...perguntaForm.opcoes];
    novasOpcoes[index] = { ...novasOpcoes[index]!, [field]: value };
    setPerguntaForm({ ...perguntaForm, opcoes: novasOpcoes });
  };

  const handleSalvarPergunta = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const op of perguntaForm.opcoes) {
      if (!op.texto.trim()) {
        toast.warning("Preencha o texto de todas as alternativas.");
        return;
      }
    }

    let dados_partitura = null;
    if (perguntaForm.tipo === "partitura") {
      try {
        dados_partitura = JSON.parse(perguntaForm.dados_partitura_str);
      } catch {
        toast.error("A configuração da partitura contém JSON inválido.");
        return;
      }
    }

    const payload = {
      enunciado: perguntaForm.enunciado,
      tipo: perguntaForm.tipo,
      ordem: perguntaForm.ordem,
      ativo: perguntaForm.ativo,
      dados_partitura,
      opcoes: perguntaForm.opcoes.map((op) => ({
        texto: op.texto,
        peso_perfil: Number(op.peso_perfil),
      })),
    };

    try {
      if (editingPerguntaId) {
        await axios.put(`${API_BASE}/placement/admin/questoes/${editingPerguntaId}/`, payload);
        toast.success("Questão de triagem atualizada!");
      } else {
        await axios.post(`${API_BASE}/placement/admin/questoes/`, payload);
        toast.success("Nova questão adicionada à triagem!");
      }
      resetPerguntaForm();
      void fetchData();
    } catch {
      toast.error("Erro ao salvar questão de triagem.");
    }
  };

  const handleToggleAtivoPergunta = async (p: any) => {
    try {
      await axios.patch(`${API_BASE}/placement/admin/questoes/${p.id}/`, { ativo: !p.ativo });
      toast.success(`Questão ${!p.ativo ? "ativada" : "inativada"}.`);
      void fetchData();
    } catch {
      toast.error("Erro ao atualizar status da questão.");
    }
  };

  const handleExcluirPergunta = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta questão e suas alternativas?")) return;
    try {
      await axios.delete(`${API_BASE}/placement/admin/questoes/${id}/`);
      if (editingPerguntaId === id) resetPerguntaForm();
      toast.success("Questão excluída.");
      void fetchData();
    } catch {
      toast.error("Erro ao excluir questão.");
    }
  };

  // ================= HANDLERS: GLOSSÁRIO =================
  const resetTermoForm = () => {
    setEditingTermoId(null);
    setNovoTermo({
      termo: "",
      categoria: CATEGORIAS_GLOSSARIO[0]!,
      definicao: "",
      figura_svg: "treble",
    });
  };

  const handleEditarTermoClick = (g: any) => {
    setEditingTermoId(g.id);
    setNovoTermo({
      termo: g.termo || g.term || "",
      categoria: g.categoria || g.category || CATEGORIAS_GLOSSARIO[0]!,
      definicao: g.definicao || g.definition || "",
      figura_svg: (g.figura_svg || g.diagram || "treble").trim(),
    });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSalvarTermo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        termo: novoTermo.termo,
        categoria: novoTermo.categoria,
        definicao: novoTermo.definicao,
        figura_svg: novoTermo.figura_svg.trim(),
      };

      if (editingTermoId) {
        await axios.put(`${API_BASE}/glossary/termos/${editingTermoId}/`, payload);
        toast.success("Verbete atualizado no glossário!");
      } else {
        await axios.post(`${API_BASE}/glossary/termos/`, payload);
        toast.success("Novo verbete salvo no glossário!");
      }

      resetTermoForm();
      void fetchData();
    } catch {
      toast.error("Erro ao salvar verbete no glossário.");
    }
  };

  const handleExcluirTermo = async (id: string) => {
    if (!confirm("Confirmar exclusão deste termo do glossário?")) return;
    try {
      await axios.delete(`${API_BASE}/glossary/termos/${id}/`);
      if (editingTermoId === id) resetTermoForm();
      toast.success("Verbete excluído.");
      void fetchData();
    } catch {
      toast.error("Erro ao excluir termo.");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Curadoria Pedagógica
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Gestão de Conteúdo Didático
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Estruture unidades, lições, exercícios interativos, triagem de nivelamento e glossário
            visual.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted p-1">
          <TabsTrigger value="unidades" className="flex items-center gap-2 font-semibold">
            <Layers className="h-4 w-4" /> Unidades ({modulos.length})
          </TabsTrigger>
          <TabsTrigger value="licoes" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-4 w-4" /> Lições & Exercícios ({aulas.length})
          </TabsTrigger>
          <TabsTrigger value="triagem" className="flex items-center gap-2 font-semibold">
            <HelpCircle className="h-4 w-4" /> Triagem ({perguntas.length})
          </TabsTrigger>
          <TabsTrigger value="glossario" className="flex items-center gap-2 font-semibold">
            <Bookmark className="h-4 w-4" /> Glossário ({glossario.length})
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: UNIDADES ================= */}
        <TabsContent value="unidades" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {editingModuloId ? (
                  <>
                    <Edit className="h-5 w-5 text-primary" /> Editar Unidade Didática
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" /> Cadastrar Nova Unidade
                  </>
                )}
              </CardTitle>
              {editingModuloId && (
                <Button variant="ghost" size="sm" onClick={resetModuloForm}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Cancelar Edição
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSalvarModulo} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Ordem na Trilha
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={moduloForm.ordem}
                      onChange={(e) =>
                        setModuloForm({ ...moduloForm, ordem: parseInt(e.target.value) || 1 })
                      }
                      required
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Título da Unidade
                    </label>
                    <Input
                      placeholder="Ex: Unidade 1: Leitura de Partituras"
                      value={moduloForm.titulo}
                      onChange={(e) => setModuloForm({ ...moduloForm, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Nível Pedagógico (Triagem)
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={moduloForm.categoria}
                      onChange={(e) => setModuloForm({ ...moduloForm, categoria: e.target.value })}
                    >
                      {NIVEIS_UNIDADE.map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Objetivo / Descrição da Unidade
                  </label>
                  <Textarea
                    rows={2}
                    placeholder="Descreva o que o estudante aprenderá nesta unidade..."
                    value={moduloForm.descricao}
                    onChange={(e) => setModuloForm({ ...moduloForm, descricao: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {editingModuloId && (
                    <Button type="button" variant="outline" onClick={resetModuloForm}>
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    {editingModuloId ? "Salvar Alterações" : "Adicionar Unidade"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {modulos.map((m) => {
              const qtdLicoes = (m.aulas || m.lessons || []).length;
              return (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        Unidade #{m.ordem}
                      </span>
                      <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        Nível: {m.categoria}
                      </span>
                      <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {qtdLicoes} {qtdLicoes === 1 ? "lição" : "lições"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAtivoModulo(m)}
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                          m.ativo !== false
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {m.ativo !== false ? "✓ Visível na Trilha" : "✕ Oculta"}
                      </button>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{m.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{m.descricao}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFiltroModuloId(String(m.id));
                        setAulaForm((prev) => ({ ...prev, modulo: String(m.id) }));
                        setActiveTab("licoes");
                      }}
                      className="text-xs"
                    >
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Ver Lições
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarModuloClick(m)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit className="mr-1 h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExcluirModulo(m.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ================= TAB 2: LIÇÕES & EXERCÍCIOS ================= */}
        <TabsContent value="licoes" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {editingAulaId ? (
                  <>
                    <Edit className="h-5 w-5 text-primary" /> Editar Lição
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" /> Cadastrar Nova Lição
                  </>
                )}
              </CardTitle>
              {editingAulaId && (
                <Button variant="ghost" size="sm" onClick={resetAulaForm}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Cancelar Edição
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSalvarAula} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Unidade Didática
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={aulaForm.modulo}
                      onChange={(e) => setAulaForm({ ...aulaForm, modulo: e.target.value })}
                      required
                    >
                      <option value="">Selecione a Unidade...</option>
                      {modulos.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          #{mod.ordem} — {mod.titulo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Título da Lição
                    </label>
                    <Input
                      placeholder="Ex: As notas na clave de Sol"
                      value={aulaForm.titulo}
                      onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Ordem na Unidade
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={aulaForm.ordem}
                      onChange={(e) =>
                        setAulaForm({ ...aulaForm, ordem: parseInt(e.target.value) || 1 })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Subtítulo / Resumo Teórico da Lição
                  </label>
                  <Textarea
                    rows={2}
                    placeholder="Ex: Reconheça as notas nas linhas e espaços da clave de Sol..."
                    value={aulaForm.conteudo_teorico}
                    onChange={(e) => setAulaForm({ ...aulaForm, conteudo_teorico: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {editingAulaId && (
                    <Button type="button" variant="outline" onClick={resetAulaForm}>
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    {editingAulaId ? "Salvar Lição" : "Adicionar Lição"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Filtro por Unidade */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-foreground">
              Lições Cadastradas ({aulasFiltradas.length})
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Filtrar por Unidade:
              </span>
              <select
                className="h-9 rounded-md border border-input bg-card px-3 text-xs font-semibold"
                value={filtroModuloId}
                onChange={(e) => setFiltroModuloId(e.target.value)}
              >
                <option value="todos">Todas as Unidades ({aulas.length})</option>
                {modulos.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    #{m.ordem} — {m.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {aulasFiltradas.map((a) => {
              const modPai = mapaModulos[String(a.modulo)];
              const listaExercicios = a.exercicios || a.exercises || [];
              const isExpanded = expandedAulaId === String(a.id);

              return (
                <div
                  key={a.id}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {modPai ? `Unidade #${modPai.ordem}: ${modPai.titulo}` : "Unidade"}
                        </span>
                        <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                          Lição #{a.ordem}
                        </span>
                        <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          {listaExercicios.length} exercício(s)
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-foreground">{a.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{a.conteudo_teorico}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedAulaId(isExpanded ? null : String(a.id))}
                        className="text-xs font-semibold"
                      >
                        <ListChecks className="mr-1.5 h-4 w-4 text-primary" />
                        Exercícios ({listaExercicios.length})
                        {isExpanded ? (
                          <ChevronUp className="ml-1 h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="ml-1 h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarAulaClick(a)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit className="mr-1 h-4 w-4" /> Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExcluirAula(a.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Painel Expansível de Exercícios da Lição */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/30 p-5 space-y-5">
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Exercícios desta Lição
                        </h5>
                        {listaExercicios.length === 0 ? (
                          <p className="text-xs italic text-muted-foreground">
                            Nenhum exercício cadastrado nesta lição ainda.
                          </p>
                        ) : (
                          <div className="grid gap-2">
                            {listaExercicios.map((ex: any, idx: number) => (
                              <div
                                key={ex.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary">#{idx + 1}</span>
                                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold">
                                      {ex.tipo || ex.kind}
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {ex.enunciado || ex.prompt}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">
                                    Gabarito: <strong>{ex.answer}</strong> · {ex.explanation}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleExcluirExercicio(ex.id)}
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Formulário rápido para adicionar Exercício na Lição */}
                      <form
                        onSubmit={(e) => handleCriarExercicio(e, a)}
                        className="rounded-xl border border-border bg-card p-4 space-y-3"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">
                          + Adicionar Novo Exercício em “{a.titulo}”
                        </p>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                          <div className="md:col-span-3">
                            <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                              Formato Interativo
                            </label>
                            <select
                              className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs"
                              value={exercicioForm.tipo}
                              onChange={(e) =>
                                setExercicioForm({ ...exercicioForm, tipo: e.target.value as any })
                              }
                            >
                              <option value="multiple-choice">Múltipla Escolha (Texto)</option>
                              <option value="note-reading">Leitura de Partitura (VexFlow)</option>
                              <option value="keyboard">Prática no Piano Virtual</option>
                              <option value="builder">Construtor de Escala / Acorde</option>
                            </select>
                          </div>

                          <div className="md:col-span-7">
                            <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                              Enunciado da Atividade
                            </label>
                            <Input
                              className="h-9 text-xs"
                              placeholder="Ex: Qual nota está escrita na pauta?"
                              value={exercicioForm.enunciado}
                              onChange={(e) =>
                                setExercicioForm({ ...exercicioForm, enunciado: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                              Ordem
                            </label>
                            <Input
                              type="number"
                              min={1}
                              className="h-9 text-xs"
                              value={exercicioForm.ordem}
                              onChange={(e) =>
                                setExercicioForm({
                                  ...exercicioForm,
                                  ordem: parseInt(e.target.value) || 1,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                          {(exercicioForm.tipo === "note-reading" ||
                            exercicioForm.tipo === "keyboard") && (
                            <div className="md:col-span-4">
                              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                                Notas na Pauta (separadas por vírgula)
                              </label>
                              <Input
                                className="h-9 font-mono text-xs"
                                placeholder="Ex: C4 ou C4, E4"
                                value={exercicioForm.staveStr}
                                onChange={(e) =>
                                  setExercicioForm({ ...exercicioForm, staveStr: e.target.value })
                                }
                              />
                            </div>
                          )}

                          {(exercicioForm.tipo === "note-reading" ||
                            exercicioForm.tipo === "multiple-choice") && (
                            <div className="md:col-span-5">
                              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                                Alternativas (separadas por vírgula)
                              </label>
                              <Input
                                className="h-9 text-xs"
                                placeholder="Ex: Dó, Ré, Mi, Fá"
                                value={exercicioForm.optionsStr}
                                onChange={(e) =>
                                  setExercicioForm({ ...exercicioForm, optionsStr: e.target.value })
                                }
                              />
                            </div>
                          )}

                          {exercicioForm.tipo === "builder" && (
                            <div className="md:col-span-5">
                              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                                Sequência Esperada (separada por vírgula)
                              </label>
                              <Input
                                className="h-9 font-mono text-xs"
                                placeholder="Ex: C4, D4, E4, F4, G4, A4, B4"
                                value={exercicioForm.sequenceStr}
                                onChange={(e) =>
                                  setExercicioForm({
                                    ...exercicioForm,
                                    sequenceStr: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )}

                          <div className="md:col-span-3">
                            <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                              Resposta Correta (Gabarito)
                            </label>
                            <Input
                              className="h-9 text-xs"
                              placeholder={
                                exercicioForm.tipo === "keyboard"
                                  ? "Ex: E4"
                                  : exercicioForm.tipo === "builder"
                                    ? "Ex: C4,D4,E4"
                                    : "Ex: Dó"
                              }
                              value={exercicioForm.answer}
                              onChange={(e) =>
                                setExercicioForm({ ...exercicioForm, answer: e.target.value })
                              }
                              required={exercicioForm.tipo !== "builder"}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
                          <div className="flex-1">
                            <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                              Explicação Didática (exibida após a resposta do aluno)
                            </label>
                            <Input
                              className="h-9 text-xs"
                              placeholder="Ex: Dó central fica na linha suplementar abaixo da pauta, na clave de Sol."
                              value={exercicioForm.explanation}
                              onChange={(e) =>
                                setExercicioForm({
                                  ...exercicioForm,
                                  explanation: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-primary text-primary-foreground"
                          >
                            <Plus className="mr-1 h-3.5 w-3.5" /> Salvar Exercício
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ================= TAB 3: TRIAGEM ================= */}
        <TabsContent value="triagem" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {editingPerguntaId ? (
                  <>
                    <Edit className="h-5 w-5 text-primary" /> Alterar Questão de Triagem
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" /> Cadastrar Nova Questão de Triagem
                  </>
                )}
              </CardTitle>
              {editingPerguntaId && (
                <Button variant="ghost" size="sm" onClick={resetPerguntaForm}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Cancelar Edição
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSalvarPergunta} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Ordem
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={perguntaForm.ordem}
                      onChange={(e) =>
                        setPerguntaForm({
                          ...perguntaForm,
                          ordem: parseInt(e.target.value) || 1,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Formato da Questão
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={perguntaForm.tipo}
                      onChange={(e) =>
                        setPerguntaForm({ ...perguntaForm, tipo: e.target.value as any })
                      }
                    >
                      <option value="texto">Apenas Texto</option>
                      <option value="partitura">Com Partitura (VexFlow)</option>
                    </select>
                  </div>
                  <div className="md:col-span-7">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Enunciado da Questão
                    </label>
                    <Input
                      placeholder="Ex: Na clave de Sol, qual nota fica na segunda linha da pauta?"
                      value={perguntaForm.enunciado}
                      onChange={(e) =>
                        setPerguntaForm({ ...perguntaForm, enunciado: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* CONSTRUTOR VISUAL DE PARTITURA (VEXFLOW) */}
                {perguntaForm.tipo === "partitura" && (
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Music className="h-4 w-4 text-primary" />
                        Configuração Visual da Partitura
                      </span>
                      <button
                        type="button"
                        onClick={() => setModoJsonAvancado(!modoJsonAvancado)}
                        className="text-xs font-semibold text-primary underline"
                      >
                        {modoJsonAvancado ? "Usar Construtor Visual" : "Editar JSON Avançado"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                      <div className="md:col-span-7 space-y-3">
                        {!modoJsonAvancado ? (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                                  Clave
                                </label>
                                <select
                                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs"
                                  value={partituraBuilder.clef}
                                  onChange={(e) =>
                                    atualizarPartituraBuilder({ clef: e.target.value })
                                  }
                                >
                                  <option value="treble">Clave de Sol (treble)</option>
                                  <option value="bass">Clave de Fá (bass)</option>
                                </select>
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                                  Fórmula de Compasso
                                </label>
                                <select
                                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs"
                                  value={partituraBuilder.timeSignature}
                                  onChange={(e) =>
                                    atualizarPartituraBuilder({ timeSignature: e.target.value })
                                  }
                                >
                                  <option value="4/4">4/4 (Quaternário)</option>
                                  <option value="3/4">3/4 (Ternário)</option>
                                  <option value="2/4">2/4 (Binário)</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                                Notas na Pauta (Notação VexFlow EasyScore)
                              </label>
                              <Input
                                className="h-9 font-mono text-xs"
                                value={partituraBuilder.notes}
                                onChange={(e) =>
                                  atualizarPartituraBuilder({ notes: e.target.value })
                                }
                                placeholder="Ex: C4/w ou C4/q, E4/q, G4/h"
                              />
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {[
                                  { label: "Dó (C4/w)", val: "C4/w" },
                                  { label: "Mi (E4/w)", val: "E4/w" },
                                  { label: "Sol (G4/w)", val: "G4/w" },
                                  { label: "Lá (A4/w)", val: "A4/w" },
                                  { label: "Terça (C4/h, E4/h)", val: "C4/h, E4/h" },
                                  {
                                    label: "Tríade Dó (C4/q, E4/q, G4/h)",
                                    val: "C4/q, E4/q, G4/h",
                                  },
                                ].map((preset) => (
                                  <button
                                    key={preset.val}
                                    type="button"
                                    onClick={() => atualizarPartituraBuilder({ notes: preset.val })}
                                    className="rounded border border-border bg-background px-2 py-1 text-[11px] font-semibold hover:bg-primary/10 hover:text-primary"
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <Textarea
                            rows={5}
                            className="font-mono text-xs bg-background"
                            value={perguntaForm.dados_partitura_str}
                            onChange={(e) =>
                              setPerguntaForm({
                                ...perguntaForm,
                                dados_partitura_str: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>

                      {/* Prévia ao vivo */}
                      <div className="md:col-span-5 flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-inner">
                        {parsedPartituraPreview ? (
                          <>
                            <span className="mb-1 text-[11px] font-semibold text-muted-foreground">
                              Pré-visualização ao vivo:
                            </span>
                            <Stave data={parsedPartituraPreview} />
                          </>
                        ) : (
                          <p className="px-4 text-center text-xs text-amber-600">
                            Verifique a sintaxe das notas informadas (ex: <code>C4/w</code>).
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* GERENCIADOR DE ALTERNATIVAS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <label className="text-sm font-bold text-foreground">
                      Alternativas e Pesos de Nivelamento
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOpcao}
                      className="text-xs"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Alternativa
                    </Button>
                  </div>

                  <div className="grid gap-2.5">
                    {perguntaForm.opcoes.map((opcao, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 p-2.5"
                      >
                        <span className="w-7 text-center text-xs font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>
                        <Input
                          placeholder={`Texto da alternativa ${idx + 1}`}
                          value={opcao.texto}
                          onChange={(e) => handleOpcaoChange(idx, "texto", e.target.value)}
                          className="flex-1 bg-background"
                          required
                        />
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-xs font-semibold"
                          value={opcao.peso_perfil}
                          onChange={(e) =>
                            handleOpcaoChange(idx, "peso_perfil", parseInt(e.target.value) || 1)
                          }
                        >
                          <option value={1}>Peso 1 — Incorreta / Iniciante</option>
                          <option value={2}>Peso 2 — Correta (Nível Intermediário)</option>
                          <option value={3}>Peso 3 — Correta Avançada (Empírico)</option>
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOpcao(idx)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {editingPerguntaId && (
                    <Button type="button" variant="outline" onClick={resetPerguntaForm}>
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    {editingPerguntaId ? "Salvar Alterações" : "Cadastrar Questão"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">
              Questões Cadastradas na Triagem ({perguntas.length})
            </h3>
            {perguntas.map((p) => (
              <div
                key={p.id}
                className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        Questão #{p.ordem}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold">
                        {p.tipo === "partitura" ? (
                          <Music className="h-3 w-3 text-primary" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        {p.tipo === "partitura" ? "Partitura" : "Texto"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAtivoPergunta(p)}
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                          p.ativo
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {p.ativo ? "✓ Ativa" : "✕ Inativa"}
                      </button>
                    </div>
                    <h4 className="font-display text-base font-bold text-foreground pt-1">
                      {p.enunciado}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarPerguntaClick(p)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit className="mr-1 h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExcluirPergunta(p.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {p.tipo === "partitura" && p.dados_partitura && (
                  <div className="mx-auto flex max-w-md justify-center rounded-lg border border-border bg-muted/20 p-3">
                    <Stave data={p.dados_partitura} />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 pt-1 md:grid-cols-2">
                  {p.opcoes?.map((op: any) => (
                    <div
                      key={op.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs"
                    >
                      <span className="font-medium text-foreground">{op.texto}</span>
                      <span
                        className={`ml-2 shrink-0 rounded px-2 py-0.5 font-bold ${
                          op.peso_perfil === 1
                            ? "bg-muted text-muted-foreground"
                            : op.peso_perfil === 2
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {op.peso_perfil === 1
                          ? "Iniciante (1)"
                          : op.peso_perfil === 2
                            ? "Correta (2)"
                            : "Avançada (3)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 4: GLOSSÁRIO ================= */}
        <TabsContent value="glossario" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {editingTermoId ? (
                  <>
                    <Edit className="h-5 w-5 text-primary" /> Alterar Verbete do Glossário
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" /> Adicionar Termo ao Glossário
                  </>
                )}
              </CardTitle>
              {editingTermoId && (
                <Button type="button" variant="ghost" size="sm" onClick={resetTermoForm}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Cancelar Edição
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSalvarTermo} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Termo / Conceito Musical
                    </label>
                    <Input
                      placeholder="Ex: Clave de Sol"
                      value={novoTermo.termo}
                      onChange={(e) => setNovoTermo({ ...novoTermo, termo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Categoria Temática
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={novoTermo.categoria}
                      onChange={(e) => setNovoTermo({ ...novoTermo, categoria: e.target.value })}
                      required
                    >
                      {CATEGORIAS_GLOSSARIO.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3 flex items-end gap-2">
                    {editingTermoId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetTermoForm}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="w-full flex-1 bg-primary text-primary-foreground"
                    >
                      {editingTermoId ? "Atualizar Verbete" : "Salvar Verbete"}
                    </Button>
                  </div>
                </div>

                {/* SELETOR DE SÍMBOLO + PRÉVIA AO VIVO DO GLOSSÁRIO */}
                <div className="grid grid-cols-1 items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-12">
                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Símbolo Musical Padrão (clique para selecionar) ou Código SVG:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {SIMBOLOS_GLOSSARIO_PRESETS.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setNovoTermo({ ...novoTermo, figura_svg: item.value })}
                            className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                              novoTermo.figura_svg.trim() === item.value
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:bg-primary/10"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                        Identificador VexFlow (ex: <code>treble</code>, <code>bass</code>) ou código{" "}
                        <code>&lt;svg&gt;</code>:
                      </label>
                      <Input
                        className="font-mono text-xs bg-background"
                        placeholder='Ex: treble, bass, whole, sharp ou <svg viewBox="0 0 100 100">...</svg>'
                        value={novoTermo.figura_svg}
                        onChange={(e) => setNovoTermo({ ...novoTermo, figura_svg: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* PRÉ-VISUALIZAÇÃO AO VIVO CORRIGIDA */}
                  <div className="md:col-span-5 flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-inner overflow-hidden">
                    <span className="mb-1 text-[11px] font-semibold text-muted-foreground">
                      Pré-visualização do Símbolo:
                    </span>
                    {novoTermo.figura_svg && novoTermo.figura_svg.trim().startsWith("<svg") ? (
                      <div
                        className="flex h-24 w-24 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                        dangerouslySetInnerHTML={{ __html: novoTermo.figura_svg }}
                      />
                    ) : (
                      <GlossaryDiagram diagram={novoTermo.figura_svg || "treble"} />
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Definição Teórica e Explicação Didática
                  </label>
                  <Textarea
                    rows={2}
                    placeholder="Explique o termo de forma clara e objetiva para o estudante..."
                    value={novoTermo.definicao}
                    onChange={(e) => setNovoTermo({ ...novoTermo, definicao: e.target.value })}
                    required
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* LISTAGEM DOS TERMOS COM DIAGRAMA RENDERIZADO */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {glossario.map((g) => {
              const termo = g.termo || g.term;
              const categoria = g.categoria || g.category;
              const definicao = g.definicao || g.definition;
              const figura = (g.figura_svg || g.diagram || "").trim();

              return (
                <div
                  key={g.id}
                  className="flex flex-col justify-between space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-base font-bold text-foreground">
                          {termo}
                        </h4>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {categoria}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{definicao}</p>
                    </div>

                    {figura && (
                      <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 p-1.5 shadow-inner">
                        {figura.startsWith("<svg") ? (
                          <div
                            className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                            dangerouslySetInnerHTML={{ __html: figura }}
                          />
                        ) : (
                          <GlossaryDiagram diagram={figura} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-border pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarTermoClick(g)}
                      className="text-xs text-primary hover:bg-primary/10"
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExcluirTermo(g.id)}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Excluir
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
