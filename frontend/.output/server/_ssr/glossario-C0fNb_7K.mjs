import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { V as EyeOff, v as Search } from "../_libs/lucide-react.mjs";
import { n as Input, r as SectionTitle } from "./AppShell-D_4FkkNF.mjs";
import { t as GlossaryDiagram } from "./GlossaryDiagram-AwwHRgox.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glossario-C0fNb_7K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIAS = [
	"Todas",
	"Pautas",
	"Figuras",
	"Acidentes"
];
function Dicionario() {
	const [busca, setBusca] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("Todas");
	const [dadosGlossario, setDadosGlossario] = (0, import_react.useState)([]);
	const [carregando, setCarregando] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const token = localStorage.getItem("access_token");
		fetch("http://127.0.0.1:8000/api/v1/glossary/", {
			method: "GET",
			headers: {
				Authorization: token ? `Bearer ${token}` : "",
				"Content-Type": "application/json"
			}
		}).then((resposta) => {
			if (!resposta.ok) throw new Error(`Erro do servidor: ${resposta.status}`);
			return resposta.json();
		}).then((dados) => {
			const normalizado = (Array.isArray(dados) ? dados : dados.results || []).map((item) => ({
				id: item.id,
				term: item.term || item.termo || "",
				definition: item.definition || item.definicao || "",
				diagram: item.diagram || item.figura_svg || "",
				category: item.category || item.categoria || ""
			}));
			setDadosGlossario(normalizado);
			setCarregando(false);
		}).catch((erro) => {
			console.error("Erro ao carregar o glossário:", erro);
			setCarregando(false);
		});
	}, []);
	const resultados = (0, import_react.useMemo)(() => {
		const q = busca.trim().toLowerCase();
		return dadosGlossario.filter((t) => {
			const termoCat = t.category.toLowerCase();
			const categoriaValida = cat === "Todas" || cat === "Pautas" && (termoCat.includes("pauta") || termoCat.includes("clave")) || cat === "Figuras" && (termoCat.includes("figura") || termoCat.includes("nota") || termoCat.includes("compasso") || termoCat.includes("pausa")) || cat === "Acidentes" && termoCat.includes("acidente") || termoCat.includes(cat.toLowerCase());
			const buscaValida = q === "" || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
			return categoriaValida && buscaValida;
		});
	}, [
		busca,
		cat,
		dadosGlossario
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Glossário visual",
				title: "Termos e símbolos da música",
				description: "Busque um conceito e veja a definição junto do desenho do símbolo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
					className: "size-4",
					"aria-hidden": true
				}), "Esta seção é apenas texto e imagem — nenhum som é reproduzido aqui."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: busca,
						onChange: (e) => setBusca(e.target.value),
						placeholder: "Buscar termo ou símbolo...",
						"aria-label": "Buscar no glossário",
						className: "rounded-lg pl-10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					role: "group",
					"aria-label": "Filtrar por categoria",
					children: CATEGORIAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": cat === c,
						onClick: () => setCat(c),
						className: cn("focus-ring shrink-0 rounded-xl px-3 py-2 text-sm font-bold transition-colors", cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-neu-sm"),
						children: c
					}, c))
				})]
			}),
			carregando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "neu p-8 text-center text-muted-foreground",
				children: " Carregando termos musicais... "
			}) : resultados.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "neu p-8 text-center text-muted-foreground",
				children: [
					"Nenhum termo encontrado para “",
					busca,
					"”."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: resultados.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "neu flex flex-col p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "neu-inset mb-4 flex min-h-24 items-center justify-center p-3",
							children: t.diagram?.trim().startsWith("<svg") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-full flex items-center justify-center [&>svg]:size-full [&>svg]:max-h-20",
								dangerouslySetInnerHTML: { __html: t.diagram }
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlossaryDiagram, { diagram: t.diagram })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-wide text-primary",
							children: t.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-lg",
							children: t.term
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: t.definition
						})
					]
				}, t.id))
			})
		]
	});
}
//#endregion
export { Dicionario as component };
