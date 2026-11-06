import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as LinusProvider } from "./LinusContext-DAkHNv3o.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { c as HeadContent, d as createRouter$1, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as BookOpen, K as ChevronUp, M as ListChecks, N as Layers, Q as Bookmark, W as CircleQuestionMark, Y as ChevronDown, b as RotateCcw, c as Trash2, d as SquarePen, w as Music, x as Plus, z as FileText } from "../_libs/lucide-react.mjs";
import { n as Input, t as AppShell } from "./AppShell-D_4FkkNF.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as GlossaryDiagram } from "./GlossaryDiagram-AwwHRgox.mjs";
import { t as Stave$1 } from "./Stave-CK4aE8Y8.mjs";
import { t as Route$13 } from "./licao._lessonId-Dx6o9dNr.mjs";
import { n as GoogleOAuthProvider } from "../_libs/react-oauth__google.mjs";
import { i as stringType, n as numberType, r as objectType, t as booleanType } from "../_libs/zod.mjs";
import { t as blacklistNicknames } from "./blacklist-BJ_VOC_P.mjs";
import { t as Route$14 } from "./recuperar-senha-CtrFUi8g.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C6Ip4Cd3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BsmY9E9i.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl font-bold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Essa página não existe ou foi movida para outro local."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl tracking-tight text-foreground",
					children: "Essa página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Algo saiu do tom por aqui. Tente recarregar ou volte ao início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tentar de novo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-accent",
						children: "Ir ao início"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Linus — Aprenda teoria musical na prática!" },
			{
				name: "description",
				content: "Explore partituras, escalas e modos gregos com exercícios interativos, piano virtual e feedback imediato."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GoogleOAuthProvider, {
			clientId: "",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinusProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-right",
				richColors: true
			})]
		})
	});
}
var $$splitComponentImporter$10 = () => import("./routes-D7_tIV2i.mjs");
var Route$11 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./glossario-C0fNb_7K.mjs");
var Route$10 = createFileRoute("/glossario")({
	head: () => ({ meta: [
		{ title: "Glossário Visual de Música — Linus" },
		{
			name: "description",
			content: "Consulte termos e símbolos musicais — pautas, figuras de duração e acidentes — com definições e diagramas vetoriais."
		},
		{
			property: "og:title",
			content: "Glossário Visual de Música — Linus"
		},
		{
			property: "og:description",
			content: "Pautas, figuras e acidentes explicados com texto e diagramas, sem áudio."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./login-SBZa391W.mjs");
var Route$9 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
objectType({
	email: stringType().email("E-mail inválido"),
	password: stringType().min(1, "A senha é obrigatória")
});
objectType({ otp: stringType().length(6, "O código de segurança deve ter exatamente 6 dígitos") });
objectType({ email: stringType().email("E-mail inválido") });
var $$splitComponentImporter$7 = () => import("./painel-DdsuJIHO.mjs");
var Route$8 = createFileRoute("/painel")({
	head: () => ({ meta: [
		{ title: "Meu Painel — Progresso e conquistas | Linus" },
		{
			name: "description",
			content: "Acompanhe ofensiva diária, taxa de conclusão das lições, conquistas e recomendações de prática."
		},
		{
			property: "og:title",
			content: "Meu Painel — Progresso e conquistas | Linus"
		},
		{
			property: "og:description",
			content: "Streak, medalhas e a próxima prática recomendada para você."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./perfil-DFzKWRSD.mjs");
var Route$7 = createFileRoute("/perfil")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var validarNomeApropriado$1 = (nome) => {
	const nomeLower = nome.toLowerCase().trim();
	return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};
objectType({ nome: stringType().min(3, "O nome deve ter pelo menos 3 caracteres").refine(validarNomeApropriado$1, "O nome escolhido contém termos não permitidos.") });
objectType({
	senhaAtual: stringType().min(1, "A senha atual é obrigatória"),
	novaSenha: stringType().min(8, "A senha deve ter pelo menos 8 caracteres").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
	confirmaSenha: stringType().min(1, "Confirme sua nova senha")
}).refine((data) => data.novaSenha === data.confirmaSenha, {
	message: "As senhas não coincidem",
	path: ["confirmaSenha"]
});
var $$splitComponentImporter$5 = () => import("./pratica-D_2-zTCb.mjs");
var Route$6 = createFileRoute("/pratica")({
	head: () => ({ meta: [
		{ title: "Playground — Piano virtual | Linus" },
		{
			name: "description",
			content: "Nesta área, você pode criar melodias com base no seu conhecimento e explorar sua criatividade musical."
		},
		{
			property: "og:title",
			content: "Playground — Piano virtual | Linus"
		},
		{
			property: "og:description",
			content: "Toque com o teclado do computador e veja a partitura renderizar em tempo real."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./registro-D6ueFyaU.mjs");
var Route$5 = createFileRoute("/registro")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var minBirthYear = (/* @__PURE__ */ new Date()).getFullYear() - 12;
var validarNomeApropriado = (nome) => {
	const nomeLower = nome.toLowerCase().trim();
	return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};
var regrasBase = {
	nome: stringType().min(3, "O nome deve ter pelo menos 3 caracteres").refine(validarNomeApropriado, "O nome escolhido contém termos não permitidos."),
	anoNascimento: numberType({ invalid_type_error: "O ano de nascimento é obrigatório" }).int().min(1900, "Ano inválido").max(minBirthYear, `Você deve ter pelo menos 12 anos para se cadastrar (nascido até ${minBirthYear})`),
	aceiteTermos: booleanType().refine((val) => val === true, { message: "Você deve aceitar os Termos de Uso" })
};
objectType({
	email: stringType().email("E-mail inválido"),
	senha: stringType().min(8, "A senha deve ter pelo menos 8 caracteres").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
	confirmaSenha: stringType().min(1, "Confirme sua senha"),
	...regrasBase
}).refine((data) => data.senha === data.confirmaSenha, {
	message: "As senhas não coincidem",
	path: ["confirmaSenha"]
});
var $$splitComponentImporter$3 = () => import("./termos-Byajnlck.mjs");
var Route$4 = createFileRoute("/termos")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./triagem-DUIDoA7y.mjs");
var Route$3 = createFileRoute("/triagem")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./trilha-Q11SyVga.mjs");
var Route$2 = createFileRoute("/trilha")({
	head: () => ({ meta: [
		{ title: "Trilha Didática — Linus" },
		{
			name: "description",
			content: "Progressão gamificada em quatro unidades: leitura de partituras, intervalos e escalas, modos gregos e acordes."
		},
		{
			property: "og:title",
			content: "Trilha Didática — Linus"
		},
		{
			property: "og:description",
			content: "Avance pelos nós da trilha e desbloqueie unidades de teoria musical."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Route$1 = createFileRoute("/admin/conteudo")({ component: AdminConteudoPage });
var API_BASE = "${API_BASE_URL}/api/v1";
axios.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
}, (error) => Promise.reject(error));
var NIVEIS_UNIDADE = [
	"Iniciante",
	"Intermediário",
	"Praticante Empírico"
];
var CATEGORIAS_GLOSSARIO = [
	"Pautas e Claves",
	"Fórmulas de Compasso",
	"Figuras de Nota",
	"Pausas",
	"Acidentes"
];
var SIMBOLOS_GLOSSARIO_PRESETS = [
	{
		label: "Clave de Sol",
		value: "treble",
		grupo: "Claves"
	},
	{
		label: "Clave de Fá",
		value: "bass",
		grupo: "Claves"
	},
	{
		label: "Clave de Dó (Alto)",
		value: "alto",
		grupo: "Claves"
	},
	{
		label: "Compasso 4/4",
		value: "time-4/4",
		grupo: "Compassos"
	},
	{
		label: "Compasso 3/4",
		value: "time-3/4",
		grupo: "Compassos"
	},
	{
		label: "Compasso 2/4",
		value: "time-2/4",
		grupo: "Compassos"
	},
	{
		label: "Semibreve",
		value: "whole",
		grupo: "Figuras"
	},
	{
		label: "Mínima",
		value: "half",
		grupo: "Figuras"
	},
	{
		label: "Semínima",
		value: "quarter",
		grupo: "Figuras"
	},
	{
		label: "Colcheia",
		value: "eighth",
		grupo: "Figuras"
	},
	{
		label: "Semicolcheia",
		value: "sixteenth",
		grupo: "Figuras"
	},
	{
		label: "Pausa Semibreve",
		value: "whole-rest",
		grupo: "Pausas"
	},
	{
		label: "Pausa Semínima",
		value: "quarter-rest",
		grupo: "Pausas"
	},
	{
		label: "Sustenido (#)",
		value: "sharp",
		grupo: "Acidentes"
	},
	{
		label: "Bemol (b)",
		value: "flat",
		grupo: "Acidentes"
	},
	{
		label: "Bequadro",
		value: "natural",
		grupo: "Acidentes"
	}
];
function AdminConteudoPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("unidades");
	const [modulos, setModulos] = (0, import_react.useState)([]);
	const [aulas, setAulas] = (0, import_react.useState)([]);
	const [perguntas, setPerguntas] = (0, import_react.useState)([]);
	const [glossario, setGlossario] = (0, import_react.useState)([]);
	const [editingModuloId, setEditingModuloId] = (0, import_react.useState)(null);
	const [moduloForm, setModuloForm] = (0, import_react.useState)({
		titulo: "",
		descricao: "",
		categoria: "Iniciante",
		ordem: 1,
		ativo: true
	});
	const [editingAulaId, setEditingAulaId] = (0, import_react.useState)(null);
	const [filtroModuloId, setFiltroModuloId] = (0, import_react.useState)("todos");
	const [expandedAulaId, setExpandedAulaId] = (0, import_react.useState)(null);
	const [aulaForm, setAulaForm] = (0, import_react.useState)({
		modulo: "",
		titulo: "",
		ordem: 1,
		conteudo_teorico: "",
		ativa: true
	});
	const [exercicioForm, setExercicioForm] = (0, import_react.useState)({
		tipo: "multiple-choice",
		enunciado: "",
		ordem: 1,
		staveStr: "C4",
		optionsStr: "Dó, Ré, Mi, Fá",
		answer: "",
		sequenceStr: "C4, D4, E4",
		explanation: ""
	});
	const [editingPerguntaId, setEditingPerguntaId] = (0, import_react.useState)(null);
	const [modoJsonAvancado, setModoJsonAvancado] = (0, import_react.useState)(false);
	const [partituraBuilder, setPartituraBuilder] = (0, import_react.useState)({
		clef: "treble",
		timeSignature: "4/4",
		notes: "C4/w"
	});
	const [perguntaForm, setPerguntaForm] = (0, import_react.useState)({
		enunciado: "",
		tipo: "texto",
		ordem: 1,
		ativo: true,
		dados_partitura_str: "{\n  \"clef\": \"treble\",\n  \"timeSignature\": \"4/4\",\n  \"notes\": \"C4/w\",\n  \"width\": 300,\n  \"height\": 130\n}",
		opcoes: [
			{
				texto: "",
				peso_perfil: 2
			},
			{
				texto: "",
				peso_perfil: 1
			},
			{
				texto: "",
				peso_perfil: 1
			},
			{
				texto: "",
				peso_perfil: 1
			}
		]
	});
	const [editingTermoId, setEditingTermoId] = (0, import_react.useState)(null);
	const [novoTermo, setNovoTermo] = (0, import_react.useState)({
		termo: "",
		categoria: CATEGORIAS_GLOSSARIO[0],
		definicao: "",
		figura_svg: "treble"
	});
	const fetchData = async () => {
		try {
			const [resMod, resAul, resTri, resGlo] = await Promise.allSettled([
				axios.get(`${API_BASE}/learning/modulos/`),
				axios.get(`${API_BASE}/learning/aulas/`),
				axios.get(`${API_BASE}/placement/admin/questoes/`),
				axios.get(`${API_BASE}/glossary/termos/`)
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
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const atualizarPartituraBuilder = (patch) => {
		const atualizado = {
			...partituraBuilder,
			...patch
		};
		setPartituraBuilder(atualizado);
		const jsonObj = {
			clef: atualizado.clef,
			timeSignature: atualizado.timeSignature,
			notes: atualizado.notes,
			width: 300,
			height: 130
		};
		setPerguntaForm((prev) => ({
			...prev,
			dados_partitura_str: JSON.stringify(jsonObj, null, 2)
		}));
	};
	const parsedPartituraPreview = (0, import_react.useMemo)(() => {
		if (perguntaForm.tipo !== "partitura" || !perguntaForm.dados_partitura_str.trim()) return null;
		try {
			const parsed = JSON.parse(perguntaForm.dados_partitura_str);
			if (parsed && typeof parsed === "object" && parsed.notes) return parsed;
			return null;
		} catch {
			return null;
		}
	}, [perguntaForm.tipo, perguntaForm.dados_partitura_str]);
	const mapaModulos = (0, import_react.useMemo)(() => {
		const map = {};
		for (const m of modulos) map[String(m.id)] = m;
		return map;
	}, [modulos]);
	const aulasFiltradas = (0, import_react.useMemo)(() => {
		if (filtroModuloId === "todos") return aulas;
		return aulas.filter((a) => String(a.modulo) === filtroModuloId);
	}, [aulas, filtroModuloId]);
	const resetModuloForm = () => {
		setEditingModuloId(null);
		setModuloForm({
			titulo: "",
			descricao: "",
			categoria: "Iniciante",
			ordem: modulos.length + 1,
			ativo: true
		});
	};
	const handleEditarModuloClick = (m) => {
		setEditingModuloId(m.id);
		setModuloForm({
			titulo: m.titulo || "",
			descricao: m.descricao || "",
			categoria: m.categoria || "Iniciante",
			ordem: m.ordem || 1,
			ativo: m.ativo !== false
		});
		window.scrollTo({
			top: 150,
			behavior: "smooth"
		});
	};
	const handleSalvarModulo = async (e) => {
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
			fetchData();
		} catch {
			toast.error("Não foi possível salvar a unidade.");
		}
	};
	const handleToggleAtivoModulo = async (m) => {
		try {
			await axios.patch(`${API_BASE}/learning/modulos/${m.id}/`, { ativo: !m.ativo });
			toast.success(`Unidade ${!m.ativo ? "ativada" : "inativada"}.`);
			fetchData();
		} catch {
			toast.error("Erro ao alterar status da unidade.");
		}
	};
	const handleExcluirModulo = async (id) => {
		if (!confirm("Excluir esta unidade apagará as lições vinculadas. Confirmar?")) return;
		try {
			await axios.delete(`${API_BASE}/learning/modulos/${id}/`);
			if (editingModuloId === id) resetModuloForm();
			toast.success("Unidade removida.");
			fetchData();
		} catch {
			toast.error("Erro ao remover unidade.");
		}
	};
	const resetAulaForm = () => {
		setEditingAulaId(null);
		setAulaForm({
			modulo: "",
			titulo: "",
			ordem: 1,
			conteudo_teorico: "",
			ativa: true
		});
	};
	const handleEditarAulaClick = (a) => {
		setEditingAulaId(a.id);
		setAulaForm({
			modulo: String(a.modulo),
			titulo: a.titulo || "",
			ordem: a.ordem || 1,
			conteudo_teorico: a.conteudo_teorico || "",
			ativa: a.ativa !== false
		});
		window.scrollTo({
			top: 150,
			behavior: "smooth"
		});
	};
	const handleSalvarAula = async (e) => {
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
			fetchData();
		} catch {
			toast.error("Falha ao salvar lição. Verifique se selecionou uma unidade válida.");
		}
	};
	const handleExcluirAula = async (id) => {
		if (!confirm("Confirmar exclusão desta lição e de seus exercícios?")) return;
		try {
			await axios.delete(`${API_BASE}/learning/aulas/${id}/`);
			if (editingAulaId === id) resetAulaForm();
			toast.success("Lição excluída.");
			fetchData();
		} catch {
			toast.error("Erro ao remover lição.");
		}
	};
	const handleCriarExercicio = async (e, aula) => {
		e.preventDefault();
		const unidadePai = mapaModulos[String(aula.modulo)];
		const tagTopico = unidadePai ? String(unidadePai.titulo).replace(/^Unidade \d+:\s*/i, "") : "Teoria Musical";
		const gabarito = {
			ordem: exercicioForm.ordem,
			answer: exercicioForm.answer.trim(),
			explanation: exercicioForm.explanation.trim()
		};
		if (exercicioForm.tipo === "note-reading" || exercicioForm.tipo === "keyboard") gabarito.stave = exercicioForm.staveStr.split(",").map((s) => s.trim()).filter(Boolean);
		if (exercicioForm.tipo === "note-reading" || exercicioForm.tipo === "multiple-choice") gabarito.options = exercicioForm.optionsStr.split(",").map((s) => s.trim()).filter(Boolean);
		if (exercicioForm.tipo === "keyboard") gabarito.targetNote = exercicioForm.answer.trim();
		if (exercicioForm.tipo === "builder") {
			const seq = exercicioForm.sequenceStr.split(",").map((s) => s.trim()).filter(Boolean);
			gabarito.sequence = seq;
			if (!gabarito.answer) gabarito.answer = seq.join(",");
		}
		try {
			await axios.post(`${API_BASE}/learning/exercicios/`, {
				aula: aula.id,
				tipo: exercicioForm.tipo,
				enunciado: exercicioForm.enunciado,
				gabarito_dados: gabarito,
				tag_topico: tagTopico,
				ativo: true
			});
			toast.success("Exercício adicionado à lição!");
			setExercicioForm({
				...exercicioForm,
				enunciado: "",
				ordem: (aula.exercicios?.length || 0) + 2,
				answer: "",
				explanation: ""
			});
			fetchData();
		} catch {
			toast.error("Erro ao adicionar exercício.");
		}
	};
	const handleExcluirExercicio = async (exercicioId) => {
		if (!confirm("Remover este exercício da lição?")) return;
		try {
			await axios.delete(`${API_BASE}/learning/exercicios/${exercicioId}/`);
			toast.success("Exercício removido.");
			fetchData();
		} catch {
			toast.error("Erro ao excluir exercício.");
		}
	};
	const resetPerguntaForm = () => {
		setEditingPerguntaId(null);
		setPartituraBuilder({
			clef: "treble",
			timeSignature: "4/4",
			notes: "C4/w"
		});
		setPerguntaForm({
			enunciado: "",
			tipo: "texto",
			ordem: perguntas.length + 1,
			ativo: true,
			dados_partitura_str: "{\n  \"clef\": \"treble\",\n  \"timeSignature\": \"4/4\",\n  \"notes\": \"C4/w\",\n  \"width\": 300,\n  \"height\": 130\n}",
			opcoes: [
				{
					texto: "",
					peso_perfil: 2
				},
				{
					texto: "",
					peso_perfil: 1
				},
				{
					texto: "",
					peso_perfil: 1
				},
				{
					texto: "",
					peso_perfil: 1
				}
			]
		});
	};
	const handleEditarPerguntaClick = (p) => {
		setEditingPerguntaId(p.id);
		if (p.dados_partitura && typeof p.dados_partitura === "object") setPartituraBuilder({
			clef: p.dados_partitura.clef || "treble",
			timeSignature: p.dados_partitura.timeSignature || "4/4",
			notes: p.dados_partitura.notes || "C4/w"
		});
		setPerguntaForm({
			enunciado: p.enunciado,
			tipo: p.tipo,
			ordem: p.ordem,
			ativo: p.ativo,
			dados_partitura_str: p.dados_partitura ? JSON.stringify(p.dados_partitura, null, 2) : "{\n  \"clef\": \"treble\",\n  \"timeSignature\": \"4/4\",\n  \"notes\": \"C4/w\",\n  \"width\": 300,\n  \"height\": 130\n}",
			opcoes: p.opcoes && p.opcoes.length > 0 ? p.opcoes.map((op) => ({
				id: op.id,
				texto: op.texto,
				peso_perfil: op.peso_perfil
			})) : [
				{
					texto: "",
					peso_perfil: 2
				},
				{
					texto: "",
					peso_perfil: 1
				},
				{
					texto: "",
					peso_perfil: 1
				},
				{
					texto: "",
					peso_perfil: 1
				}
			]
		});
		window.scrollTo({
			top: 150,
			behavior: "smooth"
		});
	};
	const handleAddOpcao = () => {
		setPerguntaForm({
			...perguntaForm,
			opcoes: [...perguntaForm.opcoes, {
				texto: "",
				peso_perfil: 1
			}]
		});
	};
	const handleRemoveOpcao = (index) => {
		if (perguntaForm.opcoes.length <= 2) {
			toast.warning("A questão precisa ter ao menos duas alternativas.");
			return;
		}
		const novasOpcoes = perguntaForm.opcoes.filter((_, idx) => idx !== index);
		setPerguntaForm({
			...perguntaForm,
			opcoes: novasOpcoes
		});
	};
	const handleOpcaoChange = (index, field, value) => {
		const novasOpcoes = [...perguntaForm.opcoes];
		novasOpcoes[index] = {
			...novasOpcoes[index],
			[field]: value
		};
		setPerguntaForm({
			...perguntaForm,
			opcoes: novasOpcoes
		});
	};
	const handleSalvarPergunta = async (e) => {
		e.preventDefault();
		for (const op of perguntaForm.opcoes) if (!op.texto.trim()) {
			toast.warning("Preencha o texto de todas as alternativas.");
			return;
		}
		let dados_partitura = null;
		if (perguntaForm.tipo === "partitura") try {
			dados_partitura = JSON.parse(perguntaForm.dados_partitura_str);
		} catch {
			toast.error("A configuração da partitura contém JSON inválido.");
			return;
		}
		const payload = {
			enunciado: perguntaForm.enunciado,
			tipo: perguntaForm.tipo,
			ordem: perguntaForm.ordem,
			ativo: perguntaForm.ativo,
			dados_partitura,
			opcoes: perguntaForm.opcoes.map((op) => ({
				texto: op.texto,
				peso_perfil: Number(op.peso_perfil)
			}))
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
			fetchData();
		} catch {
			toast.error("Erro ao salvar questão de triagem.");
		}
	};
	const handleToggleAtivoPergunta = async (p) => {
		try {
			await axios.patch(`${API_BASE}/placement/admin/questoes/${p.id}/`, { ativo: !p.ativo });
			toast.success(`Questão ${!p.ativo ? "ativada" : "inativada"}.`);
			fetchData();
		} catch {
			toast.error("Erro ao atualizar status da questão.");
		}
	};
	const handleExcluirPergunta = async (id) => {
		if (!confirm("Tem certeza que deseja excluir esta questão e suas alternativas?")) return;
		try {
			await axios.delete(`${API_BASE}/placement/admin/questoes/${id}/`);
			if (editingPerguntaId === id) resetPerguntaForm();
			toast.success("Questão excluída.");
			fetchData();
		} catch {
			toast.error("Erro ao excluir questão.");
		}
	};
	const resetTermoForm = () => {
		setEditingTermoId(null);
		setNovoTermo({
			termo: "",
			categoria: CATEGORIAS_GLOSSARIO[0],
			definicao: "",
			figura_svg: "treble"
		});
	};
	const handleEditarTermoClick = (g) => {
		setEditingTermoId(g.id);
		setNovoTermo({
			termo: g.termo || g.term || "",
			categoria: g.categoria || g.category || CATEGORIAS_GLOSSARIO[0],
			definicao: g.definicao || g.definition || "",
			figura_svg: (g.figura_svg || g.diagram || "treble").trim()
		});
		window.scrollTo({
			top: 150,
			behavior: "smooth"
		});
	};
	const handleSalvarTermo = async (e) => {
		e.preventDefault();
		try {
			const payload = {
				termo: novoTermo.termo,
				categoria: novoTermo.categoria,
				definicao: novoTermo.definicao,
				figura_svg: novoTermo.figura_svg.trim()
			};
			if (editingTermoId) {
				await axios.put(`${API_BASE}/glossary/termos/${editingTermoId}/`, payload);
				toast.success("Verbete atualizado no glossário!");
			} else {
				await axios.post(`${API_BASE}/glossary/termos/`, payload);
				toast.success("Novo verbete salvo no glossário!");
			}
			resetTermoForm();
			fetchData();
		} catch {
			toast.error("Erro ao salvar verbete no glossário.");
		}
	};
	const handleExcluirTermo = async (id) => {
		if (!confirm("Confirmar exclusão deste termo do glossário?")) return;
		try {
			await axios.delete(`${API_BASE}/glossary/termos/${id}/`);
			if (editingTermoId === id) resetTermoForm();
			toast.success("Verbete excluído.");
			fetchData();
		} catch {
			toast.error("Erro ao excluir termo.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto max-w-6xl space-y-6 px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider text-primary",
					children: "Curadoria Pedagógica"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold tracking-tight text-foreground",
					children: "Gestão de Conteúdo Didático"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Estruture unidades, lições, exercícios interativos, triagem de nivelamento e glossário visual."
				})
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: setActiveTab,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-4 rounded-xl bg-muted p-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "unidades",
							className: "flex items-center gap-2 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }),
								" Unidades (",
								modulos.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "licoes",
							className: "flex items-center gap-2 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }),
								" Lições & Exercícios (",
								aulas.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "triagem",
							className: "flex items-center gap-2 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4" }),
								" Triagem (",
								perguntas.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "glossario",
							className: "flex items-center gap-2 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" }),
								" Glossário (",
								glossario.length,
								")"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "unidades",
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "flex items-center gap-2 text-lg",
								children: editingModuloId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-5 w-5 text-primary" }), " Editar Unidade Didática"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5 text-primary" }), " Cadastrar Nova Unidade"] })
							}), editingModuloId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: resetModuloForm,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), " Cancelar Edição"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSalvarModulo,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 md:grid-cols-12",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Ordem na Trilha"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												value: moduloForm.ordem,
												onChange: (e) => setModuloForm({
													...moduloForm,
													ordem: parseInt(e.target.value) || 1
												}),
												required: true
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Título da Unidade"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: Unidade 1: Leitura de Partituras",
												value: moduloForm.titulo,
												onChange: (e) => setModuloForm({
													...moduloForm,
													titulo: e.target.value
												}),
												required: true
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Nível Pedagógico (Triagem)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
												value: moduloForm.categoria,
												onChange: (e) => setModuloForm({
													...moduloForm,
													categoria: e.target.value
												}),
												children: NIVEIS_UNIDADE.map((nivel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: nivel,
													children: nivel
												}, nivel))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Objetivo / Descrição da Unidade"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									placeholder: "Descreva o que o estudante aprenderá nesta unidade...",
									value: moduloForm.descricao,
									onChange: (e) => setModuloForm({
										...moduloForm,
										descricao: e.target.value
									}),
									required: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [editingModuloId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: resetModuloForm,
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "bg-primary text-primary-foreground",
										children: editingModuloId ? "Salvar Alterações" : "Adicionar Unidade"
									})]
								})
							]
						}) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: modulos.map((m) => {
							const qtdLicoes = (m.aulas || m.lessons || []).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
													children: ["Unidade #", m.ordem]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground",
													children: ["Nível: ", m.categoria]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-md bg-muted px-2.5 py-0.5 text-xs text-muted-foreground",
													children: [
														qtdLicoes,
														" ",
														qtdLicoes === 1 ? "lição" : "lições"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleToggleAtivoModulo(m),
													className: `rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${m.ativo !== false ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`,
													children: m.ativo !== false ? "✓ Visível na Trilha" : "✕ Oculta"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-bold text-foreground",
											children: m.titulo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: m.descricao
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => {
												setFiltroModuloId(String(m.id));
												setAulaForm((prev) => ({
													...prev,
													modulo: String(m.id)
												}));
												setActiveTab("licoes");
											},
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "mr-1.5 h-3.5 w-3.5" }), " Ver Lições"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => handleEditarModuloClick(m),
											className: "text-primary hover:bg-primary/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-1 h-4 w-4" }), " Editar"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => handleExcluirModulo(m.id),
											className: "text-destructive hover:bg-destructive/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})]
							}, m.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "licoes",
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center justify-between pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "flex items-center gap-2 text-lg",
									children: editingAulaId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-5 w-5 text-primary" }), " Editar Lição"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5 text-primary" }), " Cadastrar Nova Lição"] })
								}), editingAulaId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: resetAulaForm,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), " Cancelar Edição"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSalvarAula,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-4 md:grid-cols-12",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "md:col-span-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-1 block text-xs font-semibold text-muted-foreground",
													children: "Unidade Didática"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
													value: aulaForm.modulo,
													onChange: (e) => setAulaForm({
														...aulaForm,
														modulo: e.target.value
													}),
													required: true,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Selecione a Unidade..."
													}), modulos.map((mod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: mod.id,
														children: [
															"#",
															mod.ordem,
															" — ",
															mod.titulo
														]
													}, mod.id))]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "md:col-span-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-1 block text-xs font-semibold text-muted-foreground",
													children: "Título da Lição"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Ex: As notas na clave de Sol",
													value: aulaForm.titulo,
													onChange: (e) => setAulaForm({
														...aulaForm,
														titulo: e.target.value
													}),
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "md:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-1 block text-xs font-semibold text-muted-foreground",
													children: "Ordem na Unidade"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 1,
													value: aulaForm.ordem,
													onChange: (e) => setAulaForm({
														...aulaForm,
														ordem: parseInt(e.target.value) || 1
													}),
													required: true
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-semibold text-muted-foreground",
										children: "Subtítulo / Resumo Teórico da Lição"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										placeholder: "Ex: Reconheça as notas nas linhas e espaços da clave de Sol...",
										value: aulaForm.conteudo_teorico,
										onChange: (e) => setAulaForm({
											...aulaForm,
											conteudo_teorico: e.target.value
										}),
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2",
										children: [editingAulaId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											onClick: resetAulaForm,
											children: "Cancelar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "bg-primary text-primary-foreground",
											children: editingAulaId ? "Salvar Lição" : "Adicionar Lição"
										})]
									})
								]
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg font-bold text-foreground",
								children: [
									"Lições Cadastradas (",
									aulasFiltradas.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Filtrar por Unidade:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-9 rounded-md border border-input bg-card px-3 text-xs font-semibold",
									value: filtroModuloId,
									onChange: (e) => setFiltroModuloId(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "todos",
										children: [
											"Todas as Unidades (",
											aulas.length,
											")"
										]
									}), modulos.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: String(m.id),
										children: [
											"#",
											m.ordem,
											" — ",
											m.titulo
										]
									}, m.id))]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: aulasFiltradas.map((a) => {
								const modPai = mapaModulos[String(a.modulo)];
								const listaExercicios = a.exercicios || a.exercises || [];
								const isExpanded = expandedAulaId === String(a.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-4 p-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
															children: modPai ? `Unidade #${modPai.ordem}: ${modPai.titulo}` : "Unidade"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900",
															children: ["Lição #", a.ordem]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground",
															children: [listaExercicios.length, " exercício(s)"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-display text-lg font-bold text-foreground",
													children: a.titulo
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: a.conteudo_teorico
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													variant: "outline",
													size: "sm",
													onClick: () => setExpandedAulaId(isExpanded ? null : String(a.id)),
													className: "text-xs font-semibold",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "mr-1.5 h-4 w-4 text-primary" }),
														"Exercícios (",
														listaExercicios.length,
														")",
														isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "ml-1 h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "ml-1 h-3.5 w-3.5" })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => handleEditarAulaClick(a),
													className: "text-primary hover:bg-primary/10",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-1 h-4 w-4" }), " Editar"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => handleExcluirAula(a.id),
													className: "text-destructive hover:bg-destructive/10",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})]
									}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border bg-muted/30 p-5 space-y-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
												children: "Exercícios desta Lição"
											}), listaExercicios.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs italic text-muted-foreground",
												children: "Nenhum exercício cadastrado nesta lição ainda."
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid gap-2",
												children: listaExercicios.map((ex, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "font-bold text-primary",
																	children: ["#", idx + 1]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold",
																	children: ex.tipo || ex.kind
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold text-foreground",
																	children: ex.enunciado || ex.prompt
																})
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-muted-foreground",
															children: [
																"Gabarito: ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ex.answer }),
																" · ",
																ex.explanation
															]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														onClick: () => handleExcluirExercicio(ex.id),
														className: "h-7 w-7 text-destructive hover:bg-destructive/10",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})]
												}, ex.id))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: (e) => handleCriarExercicio(e, a),
											className: "rounded-xl border border-border bg-card p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs font-bold uppercase tracking-wider text-primary",
													children: [
														"+ Adicionar Novo Exercício em “",
														a.titulo,
														"”"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-1 gap-3 md:grid-cols-12",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Formato Interativo"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																className: "h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs",
																value: exercicioForm.tipo,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	tipo: e.target.value
																}),
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "multiple-choice",
																		children: "Múltipla Escolha (Texto)"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "note-reading",
																		children: "Leitura de Partitura (VexFlow)"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "keyboard",
																		children: "Prática no Piano Virtual"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "builder",
																		children: "Construtor de Escala / Acorde"
																	})
																]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-7",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Enunciado da Atividade"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-9 text-xs",
																placeholder: "Ex: Qual nota está escrita na pauta?",
																value: exercicioForm.enunciado,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	enunciado: e.target.value
																}),
																required: true
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Ordem"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																type: "number",
																min: 1,
																className: "h-9 text-xs",
																value: exercicioForm.ordem,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	ordem: parseInt(e.target.value) || 1
																}),
																required: true
															})]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-1 gap-3 md:grid-cols-12",
													children: [
														(exercicioForm.tipo === "note-reading" || exercicioForm.tipo === "keyboard") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-4",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Notas na Pauta (separadas por vírgula)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-9 font-mono text-xs",
																placeholder: "Ex: C4 ou C4, E4",
																value: exercicioForm.staveStr,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	staveStr: e.target.value
																})
															})]
														}),
														(exercicioForm.tipo === "note-reading" || exercicioForm.tipo === "multiple-choice") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Alternativas (separadas por vírgula)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-9 text-xs",
																placeholder: "Ex: Dó, Ré, Mi, Fá",
																value: exercicioForm.optionsStr,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	optionsStr: e.target.value
																})
															})]
														}),
														exercicioForm.tipo === "builder" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Sequência Esperada (separada por vírgula)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-9 font-mono text-xs",
																placeholder: "Ex: C4, D4, E4, F4, G4, A4, B4",
																value: exercicioForm.sequenceStr,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	sequenceStr: e.target.value
																})
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "md:col-span-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
																children: "Resposta Correta (Gabarito)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-9 text-xs",
																placeholder: exercicioForm.tipo === "keyboard" ? "Ex: E4" : exercicioForm.tipo === "builder" ? "Ex: C4,D4,E4" : "Ex: Dó",
																value: exercicioForm.answer,
																onChange: (e) => setExercicioForm({
																	...exercicioForm,
																	answer: e.target.value
																}),
																required: exercicioForm.tipo !== "builder"
															})]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-end gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
															children: "Explicação Didática (exibida após a resposta do aluno)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															className: "h-9 text-xs",
															placeholder: "Ex: Dó central fica na linha suplementar abaixo da pauta, na clave de Sol.",
															value: exercicioForm.explanation,
															onChange: (e) => setExercicioForm({
																...exercicioForm,
																explanation: e.target.value
															}),
															required: true
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "submit",
														size: "sm",
														className: "bg-primary text-primary-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3.5 w-3.5" }), " Salvar Exercício"]
													})]
												})
											]
										})]
									})]
								}, a.id);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "triagem",
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "flex items-center gap-2 text-lg",
								children: editingPerguntaId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-5 w-5 text-primary" }), " Alterar Questão de Triagem"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5 text-primary" }), " Cadastrar Nova Questão de Triagem"] })
							}), editingPerguntaId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: resetPerguntaForm,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), " Cancelar Edição"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSalvarPergunta,
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 md:grid-cols-12",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Ordem"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												value: perguntaForm.ordem,
												onChange: (e) => setPerguntaForm({
													...perguntaForm,
													ordem: parseInt(e.target.value) || 1
												}),
												required: true
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Formato da Questão"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
												value: perguntaForm.tipo,
												onChange: (e) => setPerguntaForm({
													...perguntaForm,
													tipo: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "texto",
													children: "Apenas Texto"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "partitura",
													children: "Com Partitura (VexFlow)"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-7",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Enunciado da Questão"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: Na clave de Sol, qual nota fica na segunda linha da pauta?",
												value: perguntaForm.enunciado,
												onChange: (e) => setPerguntaForm({
													...perguntaForm,
													enunciado: e.target.value
												}),
												required: true
											})]
										})
									]
								}),
								perguntaForm.tipo === "partitura" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/30 p-4 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-xs font-bold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-4 w-4 text-primary" }), "Configuração Visual da Partitura"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setModoJsonAvancado(!modoJsonAvancado),
											className: "text-xs font-semibold text-primary underline",
											children: modoJsonAvancado ? "Usar Construtor Visual" : "Editar JSON Avançado"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 items-center gap-4 md:grid-cols-12",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "md:col-span-7 space-y-3",
											children: !modoJsonAvancado ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-1 block text-xs font-semibold text-muted-foreground",
													children: "Clave"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs",
													value: partituraBuilder.clef,
													onChange: (e) => atualizarPartituraBuilder({ clef: e.target.value }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "treble",
														children: "Clave de Sol (treble)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "bass",
														children: "Clave de Fá (bass)"
													})]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-1 block text-xs font-semibold text-muted-foreground",
													children: "Fórmula de Compasso"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs",
													value: partituraBuilder.timeSignature,
													onChange: (e) => atualizarPartituraBuilder({ timeSignature: e.target.value }),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "4/4",
															children: "4/4 (Quaternário)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "3/4",
															children: "3/4 (Ternário)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "2/4",
															children: "2/4 (Binário)"
														})
													]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-1 block text-xs font-semibold text-muted-foreground",
													children: "Notas na Pauta (Notação VexFlow EasyScore)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													className: "h-9 font-mono text-xs",
													value: partituraBuilder.notes,
													onChange: (e) => atualizarPartituraBuilder({ notes: e.target.value }),
													placeholder: "Ex: C4/w ou C4/q, E4/q, G4/h"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 flex flex-wrap gap-1.5",
													children: [
														{
															label: "Dó (C4/w)",
															val: "C4/w"
														},
														{
															label: "Mi (E4/w)",
															val: "E4/w"
														},
														{
															label: "Sol (G4/w)",
															val: "G4/w"
														},
														{
															label: "Lá (A4/w)",
															val: "A4/w"
														},
														{
															label: "Terça (C4/h, E4/h)",
															val: "C4/h, E4/h"
														},
														{
															label: "Tríade Dó (C4/q, E4/q, G4/h)",
															val: "C4/q, E4/q, G4/h"
														}
													].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => atualizarPartituraBuilder({ notes: preset.val }),
														className: "rounded border border-border bg-background px-2 py-1 text-[11px] font-semibold hover:bg-primary/10 hover:text-primary",
														children: preset.label
													}, preset.val))
												})
											] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 5,
												className: "font-mono text-xs bg-background",
												value: perguntaForm.dados_partitura_str,
												onChange: (e) => setPerguntaForm({
													...perguntaForm,
													dados_partitura_str: e.target.value
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "md:col-span-5 flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-inner",
											children: parsedPartituraPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mb-1 text-[11px] font-semibold text-muted-foreground",
												children: "Pré-visualização ao vivo:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, { data: parsedPartituraPreview })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "px-4 text-center text-xs text-amber-600",
												children: [
													"Verifique a sintaxe das notas informadas (ex: ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "C4/w" }),
													")."
												]
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b border-border pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-sm font-bold text-foreground",
											children: "Alternativas e Pesos de Nivelamento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: handleAddOpcao,
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3.5 w-3.5" }), " Adicionar Alternativa"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-2.5",
										children: perguntaForm.opcoes.map((opcao, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 p-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "w-7 text-center text-xs font-bold text-muted-foreground",
													children: ["#", idx + 1]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: `Texto da alternativa ${idx + 1}`,
													value: opcao.texto,
													onChange: (e) => handleOpcaoChange(idx, "texto", e.target.value),
													className: "flex-1 bg-background",
													required: true
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "h-10 rounded-md border border-input bg-background px-3 text-xs font-semibold",
													value: opcao.peso_perfil,
													onChange: (e) => handleOpcaoChange(idx, "peso_perfil", parseInt(e.target.value) || 1),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: 1,
															children: "Peso 1 — Incorreta / Iniciante"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: 2,
															children: "Peso 2 — Correta (Nível Intermediário)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: 3,
															children: "Peso 3 — Correta Avançada (Empírico)"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "icon",
													onClick: () => handleRemoveOpcao(idx),
													className: "text-muted-foreground hover:text-destructive",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										}, idx))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [editingPerguntaId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: resetPerguntaForm,
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "bg-primary text-primary-foreground",
										children: editingPerguntaId ? "Salvar Alterações" : "Cadastrar Questão"
									})]
								})
							]
						}) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold text-foreground",
							children: [
								"Questões Cadastradas na Triagem (",
								perguntas.length,
								")"
							]
						}), perguntas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
													children: ["Questão #", p.ordem]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold",
													children: [p.tipo === "partitura" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3 w-3" }), p.tipo === "partitura" ? "Partitura" : "Texto"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleToggleAtivoPergunta(p),
													className: `rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${p.ativo ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`,
													children: p.ativo ? "✓ Ativa" : "✕ Inativa"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display text-base font-bold text-foreground pt-1",
											children: p.enunciado
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => handleEditarPerguntaClick(p),
											className: "text-primary hover:bg-primary/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-1 h-4 w-4" }), " Editar"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => handleExcluirPergunta(p.id),
											className: "text-destructive hover:bg-destructive/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})]
								}),
								p.tipo === "partitura" && p.dados_partitura && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto flex max-w-md justify-center rounded-lg border border-border bg-muted/20 p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, { data: p.dados_partitura })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 gap-2 pt-1 md:grid-cols-2",
									children: p.opcoes?.map((op) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: op.texto
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `ml-2 shrink-0 rounded px-2 py-0.5 font-bold ${op.peso_perfil === 1 ? "bg-muted text-muted-foreground" : op.peso_perfil === 2 ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"}`,
											children: op.peso_perfil === 1 ? "Iniciante (1)" : op.peso_perfil === 2 ? "Correta (2)" : "Avançada (3)"
										})]
									}, op.id))
								})
							]
						}, p.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "glossario",
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "flex items-center gap-2 text-lg",
								children: editingTermoId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-5 w-5 text-primary" }), " Alterar Verbete do Glossário"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5 text-primary" }), " Adicionar Termo ao Glossário"] })
							}), editingTermoId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: resetTermoForm,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), " Cancelar Edição"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSalvarTermo,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 md:grid-cols-12",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Termo / Conceito Musical"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: Clave de Sol",
												value: novoTermo.termo,
												onChange: (e) => setNovoTermo({
													...novoTermo,
													termo: e.target.value
												}),
												required: true
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-semibold text-muted-foreground",
												children: "Categoria Temática"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
												value: novoTermo.categoria,
												onChange: (e) => setNovoTermo({
													...novoTermo,
													categoria: e.target.value
												}),
												required: true,
												children: CATEGORIAS_GLOSSARIO.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: cat,
													children: cat
												}, cat))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-3 flex items-end gap-2",
											children: [editingTermoId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												onClick: resetTermoForm,
												className: "flex-1",
												children: "Cancelar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "submit",
												className: "w-full flex-1 bg-primary text-primary-foreground",
												children: editingTermoId ? "Atualizar Verbete" : "Salvar Verbete"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-12",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "md:col-span-7 space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-semibold text-muted-foreground",
											children: "Símbolo Musical Padrão (clique para selecionar) ou Código SVG:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5",
											children: SIMBOLOS_GLOSSARIO_PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setNovoTermo({
													...novoTermo,
													figura_svg: item.value
												}),
												className: `rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${novoTermo.figura_svg.trim() === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-primary/10"}`,
												children: item.label
											}, item.value))
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mb-1 block text-[11px] font-semibold text-muted-foreground",
											children: [
												"Identificador VexFlow (ex: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "treble" }),
												", ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "bass" }),
												") ou código",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "<svg>" }),
												":"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											className: "font-mono text-xs bg-background",
											placeholder: "Ex: treble, bass, whole, sharp ou <svg viewBox=\"0 0 100 100\">...</svg>",
											value: novoTermo.figura_svg,
											onChange: (e) => setNovoTermo({
												...novoTermo,
												figura_svg: e.target.value
											})
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "md:col-span-5 flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-inner overflow-hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mb-1 text-[11px] font-semibold text-muted-foreground",
											children: "Pré-visualização do Símbolo:"
										}), novoTermo.figura_svg && novoTermo.figura_svg.trim().startsWith("<svg") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-24 w-24 items-center justify-center [&>svg]:h-full [&>svg]:w-full",
											dangerouslySetInnerHTML: { __html: novoTermo.figura_svg }
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlossaryDiagram, { diagram: novoTermo.figura_svg || "treble" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Definição Teórica e Explicação Didática"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									placeholder: "Explique o termo de forma clara e objetiva para o estudante...",
									value: novoTermo.definicao,
									onChange: (e) => setNovoTermo({
										...novoTermo,
										definicao: e.target.value
									}),
									required: true
								})] })
							]
						}) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: glossario.map((g) => {
							const termo = g.termo || g.term;
							const categoria = g.categoria || g.category;
							const definicao = g.definicao || g.definition;
							const figura = (g.figura_svg || g.diagram || "").trim();
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-base font-bold text-foreground",
												children: termo
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary",
												children: categoria
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: definicao
										})]
									}), figura && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 p-1.5 shadow-inner",
										children: figura.startsWith("<svg") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full",
											dangerouslySetInnerHTML: { __html: figura }
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlossaryDiagram, { diagram: figura })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2 border-t border-border pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => handleEditarTermoClick(g),
										className: "text-xs text-primary hover:bg-primary/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-1 h-3.5 w-3.5" }), " Editar"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => handleExcluirTermo(g.id),
										className: "text-xs text-destructive hover:bg-destructive/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), " Excluir"]
									})]
								})]
							}, g.id);
						})
					})]
				})
			]
		})]
	});
}
var $$splitComponentImporter = () => import("./admin.sistema-N9jYcoJ2.mjs");
var Route = createFileRoute("/admin/sistema")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	GlossarioRoute: Route$10.update({
		id: "/glossario",
		path: "/glossario",
		getParentRoute: () => Route$12
	}),
	LoginRoute: Route$9.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$12
	}),
	PainelRoute: Route$8.update({
		id: "/painel",
		path: "/painel",
		getParentRoute: () => Route$12
	}),
	PerfilRoute: Route$7.update({
		id: "/perfil",
		path: "/perfil",
		getParentRoute: () => Route$12
	}),
	PraticaRoute: Route$6.update({
		id: "/pratica",
		path: "/pratica",
		getParentRoute: () => Route$12
	}),
	RecuperarSenhaRoute: Route$14.update({
		id: "/recuperar-senha",
		path: "/recuperar-senha",
		getParentRoute: () => Route$12
	}),
	RegistroRoute: Route$5.update({
		id: "/registro",
		path: "/registro",
		getParentRoute: () => Route$12
	}),
	TermosRoute: Route$4.update({
		id: "/termos",
		path: "/termos",
		getParentRoute: () => Route$12
	}),
	TriagemRoute: Route$3.update({
		id: "/triagem",
		path: "/triagem",
		getParentRoute: () => Route$12
	}),
	TrilhaRoute: Route$2.update({
		id: "/trilha",
		path: "/trilha",
		getParentRoute: () => Route$12
	}),
	AdminConteudoRoute: Route$1.update({
		id: "/admin/conteudo",
		path: "/admin/conteudo",
		getParentRoute: () => Route$12
	}),
	AdminSistemaRoute: Route.update({
		id: "/admin/sistema",
		path: "/admin/sistema",
		getParentRoute: () => Route$12
	}),
	LicaoLessonIdRoute: Route$13.update({
		id: "/licao/$lessonId",
		path: "/licao/$lessonId",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
function createRouter() {
	const queryClient = new QueryClient();
	return createRouter$1({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
}
var getRouter = createRouter;
//#endregion
export { createRouter, getRouter };
