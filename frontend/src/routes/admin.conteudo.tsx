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
  CheckCircle,
  XCircle,
  Music,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Stave from "@/components/Stave";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminConteudoPage,
});

const API_BASE = "http://127.0.0.1:8000/api/v1";

// Categorias padronizadas do Glossário
const CATEGORIAS_GLOSSARIO = [
  "Pautas e Claves",
  "Fórmulas de Compasso",
  "Figuras de Nota",
  "Pausas",
  "Acidentes",
];

interface OpcaoForm {
  id?: string;
  texto: string;
  peso_perfil: number;
}

export default function AdminConteudoPage() {
  const [activeTab, setActiveTab] = useState("unidades");

  // Estados dos Conteúdos
  const [modulos, setModulos] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [glossario, setGlossario] = useState<any[]>([]);

  // Estados dos Formulários
  const [novoModulo, setNovoModulo] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    ordem: 1,
    ativo: true,
  });
  const [novaAula, setNovaAula] = useState({
    modulo: "",
    titulo: "",
    ordem: 1,
    conteudo_teorico: "",
    ativa: true,
  });

  // Formulário do Glossário
  const [novoTermo, setNovoTermo] = useState({
    termo: "",
    categoria: CATEGORIAS_GLOSSARIO[0],
    definicao: "",
    figura_svg: "",
  });

  // Formulário da Triagem (Criação e Edição)
  const [editingPerguntaId, setEditingPerguntaId] = useState<string | null>(null);
  const [perguntaForm, setPerguntaForm] = useState({
    enunciado: "",
    tipo: "texto" as "texto" | "partitura",
    ordem: 1,
    ativo: true,
    dados_partitura_str:
      '{\n  "clef": "treble",\n  "timeSignature": "4/4",\n  "notes": "C4/w",\n  "width": 300,\n  "height": 130\n}',
    opcoes: [
      { texto: "", peso_perfil: 1 },
      { texto: "", peso_perfil: 2 },
    ] as OpcaoForm[],
  });

  // Carregamento de dados
  const fetchData = async () => {
    try {
      const [resMod, resAul, resTri, resGlo] = await Promise.allSettled([
        axios.get(`${API_BASE}/learning/modulos/`),
        axios.get(`${API_BASE}/learning/aulas/`),
        axios.get(`${API_BASE}/placement/admin/questoes/`),
        axios.get(`${API_BASE}/glossary/termos/`),
      ]);

      if (resMod.status === "fulfilled") setModulos(resMod.value.data.results || resMod.value.data);
      if (resAul.status === "fulfilled") setAulas(resAul.value.data.results || resAul.value.data);
      if (resTri.status === "fulfilled")
        setPerguntas(resTri.value.data.results || resTri.value.data);
      if (resGlo.status === "fulfilled")
        setGlossario(resGlo.value.data.results || resGlo.value.data);
    } catch (err) {
      console.error("Erro ao carregar conteúdos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Parser do JSON de partitura para pré-visualização com VexFlow
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

  // ================= MÓDULOS & AULAS =================
  const handleCriarModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/learning/modulos/`, novoModulo);
      setNovoModulo({
        titulo: "",
        descricao: "",
        categoria: "",
        ordem: modulos.length + 1,
        ativo: true,
      });
      fetchData();
    } catch (err) {
      alert("Falha ao criar unidade.");
    }
  };

  const handleExcluirModulo = async (id: string) => {
    if (!confirm("Excluir esta unidade apagará as lições vinculadas. Confirmar?")) return;
    try {
      await axios.delete(`${API_BASE}/learning/modulos/${id}/`);
      fetchData();
    } catch (err) {
      alert("Erro ao remover unidade.");
    }
  };

  const handleCriarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/learning/aulas/`, novaAula);
      setNovaAula({
        modulo: "",
        titulo: "",
        ordem: aulas.length + 1,
        conteudo_teorico: "",
        ativa: true,
      });
      fetchData();
    } catch (err) {
      alert("Falha ao criar lição. Verifique se selecionou uma unidade válida.");
    }
  };

  const handleExcluirAula = async (id: string) => {
    if (!confirm("Confirmar exclusão da lição?")) return;
    try {
      await axios.delete(`${API_BASE}/learning/aulas/${id}/`);
      fetchData();
    } catch (err) {
      alert("Erro ao remover lição.");
    }
  };

  // ================= GLOSSÁRIO =================
  const handleCriarTermo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/glossary/termos/`, novoTermo);
      setNovoTermo({
        termo: "",
        categoria: CATEGORIAS_GLOSSARIO[0],
        definicao: "",
        figura_svg: "",
      });
      fetchData();
    } catch (err) {
      alert("Erro ao salvar verbete no glossário.");
    }
  };

  const handleExcluirTermo = async (id: string) => {
    if (!confirm("Confirmar exclusão deste termo do glossário?")) return;
    try {
      await axios.delete(`${API_BASE}/glossary/termos/${id}/`);
      fetchData();
    } catch (err) {
      alert("Erro ao excluir termo.");
    }
  };

  // ================= TRIAGEM (CRUD COMPLETO) =================
  const resetPerguntaForm = () => {
    setEditingPerguntaId(null);
    setPerguntaForm({
      enunciado: "",
      tipo: "texto",
      ordem: perguntas.length + 1,
      ativo: true,
      dados_partitura_str:
        '{\n  "clef": "treble",\n  "timeSignature": "4/4",\n  "notes": "C4/w",\n  "width": 300,\n  "height": 130\n}',
      opcoes: [
        { texto: "", peso_perfil: 1 },
        { texto: "", peso_perfil: 2 },
      ],
    });
  };

  const handleEditarPerguntaClick = (p: any) => {
    setEditingPerguntaId(p.id);
    setPerguntaForm({
      enunciado: p.enunciado,
      tipo: p.tipo,
      ordem: p.ordem,
      ativo: p.ativo,
      dados_partitura_str: p.dados_partitura ? JSON.stringify(p.dados_partitura, null, 2) : "",
      opcoes:
        p.opcoes && p.opcoes.length > 0
          ? p.opcoes.map((op: any) => ({ id: op.id, texto: op.texto, peso_perfil: op.peso_perfil }))
          : [
              { texto: "", peso_perfil: 1 },
              { texto: "", peso_perfil: 2 },
            ],
    });
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleAddOpcao = () => {
    setPerguntaForm({
      ...perguntaForm,
      opcoes: [...perguntaForm.opcoes, { texto: "", peso_perfil: 1 }],
    });
  };

  const handleRemoveOpcao = (index: number) => {
    if (perguntaForm.opcoes.length <= 2) {
      alert("A questão precisa ter ao menos duas alternativas.");
      return;
    }
    const novasOpcoes = perguntaForm.opcoes.filter((_, idx) => idx !== index);
    setPerguntaForm({ ...perguntaForm, opcoes: novasOpcoes });
  };

  const handleOpcaoChange = (index: number, field: "texto" | "peso_perfil", value: any) => {
    const novasOpcoes = [...perguntaForm.opcoes];
    novasOpcoes[index] = { ...novasOpcoes[index], [field]: value };
    setPerguntaForm({ ...perguntaForm, opcoes: novasOpcoes });
  };

  const handleSalvarPergunta = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    for (const op of perguntaForm.opcoes) {
      if (!op.texto.trim()) {
        alert("Preencha o texto de todas as alternativas.");
        return;
      }
    }

    let dados_partitura = null;
    if (perguntaForm.tipo === "partitura") {
      try {
        dados_partitura = JSON.parse(perguntaForm.dados_partitura_str);
      } catch {
        alert("O JSON de partitura fornecido é inválido.");
        return;
      }
    }

    const payload = {
      enunciado: perguntaForm.enunciado,
      tipo: perguntaForm.tipo,
      ordem: perguntaForm.ordem,
      ativo: perguntaForm.ativo,
      dados_partitura: dados_partitura,
      opcoes: perguntaForm.opcoes.map((op) => ({
        texto: op.texto,
        peso_perfil: Number(op.peso_perfil),
      })),
    };

    try {
      if (editingPerguntaId) {
        await axios.put(`${API_BASE}/placement/admin/questoes/${editingPerguntaId}/`, payload);
      } else {
        await axios.post(`${API_BASE}/placement/admin/questoes/`, payload);
      }
      resetPerguntaForm();
      fetchData();
    } catch (err) {
      alert("Erro ao salvar questão de triagem.");
    }
  };

  const handleToggleAtivoPergunta = async (p: any) => {
    try {
      await axios.patch(`${API_BASE}/placement/admin/questoes/${p.id}/`, { ativo: !p.ativo });
      fetchData();
    } catch {
      alert("Erro ao atualizar status da questão.");
    }
  };

  const handleExcluirPergunta = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta questão e suas alternativas?")) return;
    try {
      await axios.delete(`${API_BASE}/placement/admin/questoes/${id}/`);
      if (editingPerguntaId === id) resetPerguntaForm();
      fetchData();
    } catch {
      alert("Erro ao excluir questão.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Gestão de Conteúdo Didático
        </h1>
        <p className="text-gray-500 text-sm">
          Gerencie unidades, lições, questões de triagem e termos teóricos com persistência direta
          no banco.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="unidades" className="flex items-center gap-2">
            <Layers className="w-4 h-4" /> Unidades ({modulos.length})
          </TabsTrigger>
          <TabsTrigger value="licoes" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Lições ({aulas.length})
          </TabsTrigger>
          <TabsTrigger value="triagem" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Triagem ({perguntas.length})
          </TabsTrigger>
          <TabsTrigger value="glossario" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" /> Glossário ({glossario.length})
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: UNIDADES ================= */}
        <TabsContent value="unidades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cadastrar Nova Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCriarModulo} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Título da Unidade"
                  value={novoModulo.titulo}
                  onChange={(e) => setNovoModulo({ ...novoModulo, titulo: e.target.value })}
                  required
                />
                <Input
                  placeholder="Categoria (ex: Leitura, Ritmo)"
                  value={novoModulo.categoria}
                  onChange={(e) => setNovoModulo({ ...novoModulo, categoria: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Ordem"
                  value={novoModulo.ordem}
                  onChange={(e) =>
                    setNovoModulo({ ...novoModulo, ordem: parseInt(e.target.value) || 1 })
                  }
                  required
                />
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
                <div className="md:col-span-4">
                  <Textarea
                    placeholder="Descrição da unidade..."
                    value={novoModulo.descricao}
                    onChange={(e) => setNovoModulo({ ...novoModulo, descricao: e.target.value })}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {modulos.map((m) => (
              <div
                key={m.id}
                className="p-4 border rounded-lg bg-white flex justify-between items-center shadow-sm"
              >
                <div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Ordem: {m.ordem}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded ml-2">
                    {m.categoria}
                  </span>
                  <h3 className="text-base font-bold text-gray-800 mt-1">{m.titulo}</h3>
                  <p className="text-sm text-gray-500">{m.descricao}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExcluirModulo(m.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 2: LIÇÕES ================= */}
        <TabsContent value="licoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cadastrar Nova Lição</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCriarAula} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="border rounded-md px-3 py-2 text-sm bg-white"
                  value={novaAula.modulo}
                  onChange={(e) => setNovaAula({ ...novaAula, modulo: e.target.value })}
                  required
                >
                  <option value="">Selecione a Unidade</option>
                  {modulos.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.ordem} - {mod.titulo}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Título da Lição"
                  value={novaAula.titulo}
                  onChange={(e) => setNovaAula({ ...novaAula, titulo: e.target.value })}
                  required
                />
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar Aula
                </Button>
                <div className="md:col-span-3">
                  <Textarea
                    placeholder="Conteúdo teórico da aula..."
                    value={novaAula.conteudo_teorico}
                    onChange={(e) => setNovaAula({ ...novaAula, conteudo_teorico: e.target.value })}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {aulas.map((a) => (
              <div
                key={a.id}
                className="p-4 border rounded-lg bg-white flex justify-between items-center shadow-sm"
              >
                <div>
                  <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded">
                    Ordem: {a.ordem}
                  </span>
                  <h3 className="text-base font-bold text-gray-800 mt-1">{a.titulo}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{a.conteudo_teorico}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExcluirAula(a.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 3: TRIAGEM (CRUD COMPLETO) ================= */}
        <TabsContent value="triagem" className="space-y-6">
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {editingPerguntaId ? (
                  <>
                    <Edit className="w-5 h-5 text-blue-600" />
                    Alterar Questão de Triagem
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-blue-600" />
                    Cadastrar Nova Questão de Triagem
                  </>
                )}
              </CardTitle>
              {editingPerguntaId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetPerguntaForm}
                  className="flex items-center gap-1 text-gray-500"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Cancelar Edição
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSalvarPergunta} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Ordem:</label>
                    <Input
                      type="number"
                      value={perguntaForm.ordem}
                      onChange={(e) =>
                        setPerguntaForm({ ...perguntaForm, ordem: parseInt(e.target.value) || 1 })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Tipo da Questão:
                    </label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                      value={perguntaForm.tipo}
                      onChange={(e) =>
                        setPerguntaForm({ ...perguntaForm, tipo: e.target.value as any })
                      }
                    >
                      <option value="texto">Apenas Texto</option>
                      <option value="partitura">Partitura (VexFlow)</option>
                    </select>
                  </div>
                  <div className="md:col-span-7">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Enunciado da Questão:
                    </label>
                    <Input
                      placeholder="Ex: Qual é a nota representada na pauta abaixo?"
                      value={perguntaForm.enunciado}
                      onChange={(e) =>
                        setPerguntaForm({ ...perguntaForm, enunciado: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* CAMPO CONDICIONAL DE PARTITURA / VEXFLOW */}
                {perguntaForm.tipo === "partitura" && (
                  <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-[#2B6CB0]" />
                        Estrutura JSON da Partitura (VexFlow):
                      </label>
                      <span className="text-xs text-gray-500">
                        Formato EasyScore (notas, clave e compasso)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <Textarea
                        rows={6}
                        className="font-mono text-xs bg-white"
                        value={perguntaForm.dados_partitura_str}
                        onChange={(e) =>
                          setPerguntaForm({ ...perguntaForm, dados_partitura_str: e.target.value })
                        }
                        placeholder='{"clef": "treble", "timeSignature": "4/4", "notes": "C4/w", "width": 300, "height": 130}'
                      />

                      {/* Prévia dinâmica do Vexflow */}
                      <div className="border rounded-md bg-white p-3 min-h-[140px] flex flex-col items-center justify-center shadow-inner">
                        {parsedPartituraPreview ? (
                          <>
                            <span className="text-[11px] font-semibold text-gray-400 mb-1">
                              Pré-visualização ao vivo:
                            </span>
                            <Stave data={parsedPartituraPreview} />
                          </>
                        ) : (
                          <div className="text-xs text-amber-600 text-center px-4">
                            JSON inválido ou incompleto. Forneça chaves como <code>clef</code>,{" "}
                            <code>timeSignature</code> e <code>notes</code> (ex: <code>C4/w</code>).
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* GERENCIADOR DE ALTERNATIVAS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <label className="text-sm font-bold text-gray-700">
                      Alternativas da Questão:
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOpcao}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Alternativa
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {perguntaForm.opcoes.map((opcao, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border"
                      >
                        <span className="text-xs font-bold text-gray-400 w-6 text-center">
                          #{idx + 1}
                        </span>
                        <Input
                          placeholder={`Texto da alternativa ${idx + 1}`}
                          value={opcao.texto}
                          onChange={(e) => handleOpcaoChange(idx, "texto", e.target.value)}
                          className="bg-white flex-1"
                          required
                        />
                        <div className="w-56">
                          <select
                            className="w-full border rounded-md px-2.5 py-2 text-xs bg-white"
                            value={opcao.peso_perfil}
                            onChange={(e) =>
                              handleOpcaoChange(idx, "peso_perfil", parseInt(e.target.value) || 1)
                            }
                          >
                            <option value={1}>Peso 1: Errada (Iniciante)</option>
                            <option value={2}>Peso 2: Correta (Intermediário)</option>
                            <option value={3}>Peso 3: Correta Difícil (Empírico)</option>
                          </select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOpcao(idx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {editingPerguntaId && (
                    <Button type="button" variant="outline" onClick={resetPerguntaForm}>
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" className="bg-[#2B6CB0] hover:bg-[#2B6CB0]/90 text-white">
                    {editingPerguntaId ? "Salvar Alterações" : "Cadastrar Questão"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* LISTAGEM DE QUESTÕES */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Questões Cadastradas na Triagem</h3>
            {perguntas.map((p) => (
              <div key={p.id} className="p-5 border rounded-xl bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                        Ordem: {p.ordem}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded flex items-center gap-1">
                        {p.tipo === "partitura" ? (
                          <Music className="w-3 h-3" />
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                        {p.tipo === "partitura" ? "Partitura" : "Texto"}
                      </span>
                      <button
                        onClick={() => handleToggleAtivoPergunta(p)}
                        className={`text-xs font-medium px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          p.ativo
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {p.ativo ? "✓ Ativa" : "✕ Inativa"}
                      </button>
                    </div>
                    <h4 className="text-base font-bold text-gray-800 pt-1">{p.enunciado}</h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarPerguntaClick(p)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExcluirPergunta(p.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Exibição da Partitura salva */}
                {p.tipo === "partitura" && p.dados_partitura && (
                  <div className="p-3 bg-gray-50 border rounded-lg flex justify-center max-w-md mx-auto">
                    <Stave data={p.dados_partitura} />
                  </div>
                )}

                {/* Alternativas salvas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  {p.opcoes?.map((op: any) => (
                    <div
                      key={op.id}
                      className="p-2.5 rounded-lg border bg-gray-50 text-xs flex justify-between items-center"
                    >
                      <span className="text-gray-800">{op.texto}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold shrink-0 ml-2 ${
                          op.peso_perfil === 1
                            ? "bg-gray-200 text-gray-700"
                            : op.peso_perfil === 2
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {op.peso_perfil === 1
                          ? "Errada (1)"
                          : op.peso_perfil === 2
                            ? "Correta (2)"
                            : "Difícil (3)"}
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Termo ao Glossário</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCriarTermo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Termo / Conceito"
                  value={novoTermo.termo}
                  onChange={(e) => setNovoTermo({ ...novoTermo, termo: e.target.value })}
                  required
                />

                {/* LISTA SUSPENSA FIXA DE CATEGORIAS */}
                <select
                  className="border rounded-md px-3 py-2 text-sm bg-white"
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

                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Salvar Verbete
                </Button>

                {/* CAMPO FIGURA SVG */}
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Figura SVG (Código vetorial SVG bruto):
                  </label>
                  <Textarea
                    rows={3}
                    placeholder='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">...</svg>'
                    value={novoTermo.figura_svg}
                    onChange={(e) => setNovoTermo({ ...novoTermo, figura_svg: e.target.value })}
                    className="font-mono text-xs"
                  />
                  {novoTermo.figura_svg && novoTermo.figura_svg.trim().startsWith("<svg") && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded-md flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-semibold">Prévia:</span>
                      <div
                        className="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-gray-800"
                        dangerouslySetInnerHTML={{ __html: novoTermo.figura_svg }}
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Textarea
                    placeholder="Definição teórica e explicação..."
                    value={novoTermo.definicao}
                    onChange={(e) => setNovoTermo({ ...novoTermo, definicao: e.target.value })}
                    required
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {glossario.map((g) => {
              const termo = g.termo || g.term;
              const categoria = g.categoria || g.category;
              const definicao = g.definicao || g.definition;
              const figura = g.figura_svg || g.diagram || "";

              return (
                <div
                  key={g.id}
                  className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-gray-800">{termo}</h4>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-semibold capitalize">
                          {categoria}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{definicao}</p>
                    </div>

                    {/* Suporte a SVG bruto ou identificador textual (stave, treble, etc.) */}
                    {figura && (
                      <div className="w-16 h-16 p-1.5 border rounded-lg bg-gray-50 shrink-0 flex items-center justify-center text-gray-800 shadow-inner">
                        {figura.trim().startsWith("<svg") ? (
                          <div
                            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: figura }}
                          />
                        ) : (
                          <span className="text-[11px] font-mono text-gray-500 font-bold bg-white px-1.5 py-0.5 border rounded">
                            {figura}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExcluirTermo(g.id)}
                      className="text-red-500 hover:bg-red-50 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir Verbete
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
