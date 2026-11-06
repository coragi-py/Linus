import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { $ as BookOpen, G as CircleCheck, J as ChevronLeft, L as Funnel, N as Layers, k as Lock, m as ShieldCheck, o as TriangleAlert, q as ChevronRight, r as Users, rt as Activity, v as Search } from "../_libs/lucide-react.mjs";
import { n as Input, r as SectionTitle } from "./AppShell-D_4FkkNF.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart, u as Legend } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/constants-ChsxNvZ6.js
var API_BASE_URL = "http://localhost:8000";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/admin.sistema-N9jYcoJ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_OPTIONS = [
	{
		value: "estudante",
		label: "Estudante"
	},
	{
		value: "conteudo",
		label: "Administrador de Conteúdo"
	},
	{
		value: "sistema",
		label: "Administrador de Sistemas"
	}
];
var ITEMS_PER_PAGE = 25;
function AdminSistema() {
	const [usuarios, setUsuarios] = (0, import_react.useState)([]);
	const [metricas, setMetricas] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [buscaTexto, setBuscaTexto] = (0, import_react.useState)("");
	const [filtroStatus, setFiltroStatus] = (0, import_react.useState)("todos");
	const [filtroRole, setFiltroRole] = (0, import_react.useState)("todos");
	const [paginaAtual, setPaginaAtual] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		const fetchData = async () => {
			try {
				const headers = { Authorization: `Bearer ${localStorage.getItem("access_token")}` };
				const [resUsers, resMetrics] = await Promise.all([fetch("${API_BASE_URL}/api/v1/auth/admin/users/", { headers }), fetch("${API_BASE_URL}/api/v1/auth/admin/metrics/", { headers })]);
				if (!resUsers.ok || !resMetrics.ok) throw new Error("Falha de permissão ou comunicação.");
				const dataUsers = await resUsers.json();
				const dataMetrics = await resMetrics.json();
				const listaUsuarios = Array.isArray(dataUsers) ? dataUsers : Array.isArray(dataUsers?.results) ? dataUsers.results : [];
				setUsuarios(listaUsuarios);
				setMetricas(dataMetrics);
			} catch (error) {
				console.error("Erro na comunicação:", error);
				toast.error("Não foi possível carregar os dados do sistema.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	(0, import_react.useEffect)(() => {
		setPaginaAtual(1);
	}, [
		buscaTexto,
		filtroStatus,
		filtroRole
	]);
	const usuariosFiltrados = (0, import_react.useMemo)(() => {
		const termo = buscaTexto.trim().toLowerCase();
		return usuarios.filter((u) => {
			const matchTexto = !termo || (u.nome || "").toLowerCase().includes(termo) || (u.email || "").toLowerCase().includes(termo);
			const matchStatus = filtroStatus === "todos" || filtroStatus === "ativos" && u.ativo || filtroStatus === "suspensos" && !u.ativo;
			const normalizedRole = u.role === "admin-conteudo" ? "conteudo" : u.role === "admin-sistema" ? "sistema" : u.role === "usuario" ? "estudante" : u.role;
			return matchTexto && matchStatus && (filtroRole === "todos" || normalizedRole === filtroRole);
		});
	}, [
		usuarios,
		buscaTexto,
		filtroStatus,
		filtroRole
	]);
	const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE));
	const usuariosPaginados = (0, import_react.useMemo)(() => {
		const inicio = (paginaAtual - 1) * ITEMS_PER_PAGE;
		return usuariosFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
	}, [usuariosFiltrados, paginaAtual]);
	const handleUpdateRole = async (userId, newRole) => {
		try {
			const token = localStorage.getItem("access_token");
			const res = await fetch(`${API_BASE_URL}/api/v1/auth/admin/users/${userId}/`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ role: newRole })
			});
			const contentType = res.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) throw new Error("O servidor falhou ao processar a rota.");
			const result = await res.json();
			if (!res.ok) throw new Error(result.error || "Erro interno do servidor");
			toast.success("Permissões atualizadas com sucesso.");
			setUsuarios((prev) => prev.map((u) => u.id === userId ? {
				...u,
				role: newRole
			} : u));
		} catch (error) {
			toast.error(error.message || "Falha ao atualizar papel do usuário.");
		}
	};
	const handleToggleStatus = async (userId, currentStatus) => {
		try {
			const token = localStorage.getItem("access_token");
			const res = await fetch(`${API_BASE_URL}/api/v1/auth/admin/users/${userId}/`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ ativo: !currentStatus })
			});
			const contentType = res.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) throw new Error("O servidor falhou ao processar a rota.");
			const result = await res.json();
			if (!res.ok) throw new Error(result.error || "Erro interno do servidor");
			toast.success(`Conta ${!currentStatus ? "reativada" : "suspensa"} com sucesso.`);
			setUsuarios((prev) => prev.map((u) => u.id === userId ? {
				...u,
				ativo: !currentStatus
			} : u));
		} catch (error) {
			toast.error(error.message || "Falha ao alterar status.");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[50vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "animate-pulse font-bold text-muted-foreground",
			children: "Sincronizando telemetria e base de usuários..."
		})
	});
	const totais = metricas?.totais || {};
	const acervo = metricas?.acervo || {};
	const papeis = metricas?.distribuicao_papeis || {};
	const taxaAtivos = totais.usuarios > 0 ? Math.round(totais.ativos / totais.usuarios * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-screen max-w-6xl px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "Administração Central e Observabilidade",
			title: "Painel de Controle do Sistema",
			description: "Monitore indicadores globais (Big Numbers), telemetria pedagógica, trilha de auditoria e controle de acesso (RBAC)."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "dashboard",
			className: "mt-6 w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "mb-8 grid h-12 w-full max-w-md grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "dashboard",
						className: "flex items-center gap-2 text-sm font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4" }), " Dashboard & Métricas"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "usuarios",
						className: "flex items-center gap-2 text-sm font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
							" Gestão de Usuários (",
							usuarios.length,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "dashboard",
					className: "space-y-8 animate-in fade-in-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
									icon: Users,
									label: "Total de Contas Registradas",
									value: totais.usuarios ?? 0,
									subtitle: `${papeis.estudantes ?? 0} estudantes · ${papeis.admins_conteudo ?? 0} conteúdo · ${papeis.admins_sistema ?? 0} sistema`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
									icon: CircleCheck,
									label: "Contas Ativas vs. Suspensas",
									value: `${totais.ativos ?? 0} (${taxaAtivos}%)`,
									subtitle: `${totais.suspensos ?? 0} contas suspensas no momento`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
									icon: BookOpen,
									label: "Lições Concluídas na Trilha",
									value: totais.licoes ?? 0,
									subtitle: `${acervo.unidades ?? 0} unidades e ${acervo.aulas ?? 0} lições publicadas`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
									icon: Activity,
									label: "Exercícios Resolvidos (Global)",
									value: totais.tentativas_exercicios ?? 0,
									subtitle: `Precisão média global dos alunos: ${totais.precisao_global ?? 0}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
									icon: ShieldCheck,
									label: "Eventos Auditados (7 dias)",
									value: totais.eventos_auditoria_7d ?? 0,
									subtitle: `${totais.falhas_autenticacao_7d ?? 0} tentativas de login barradas (7d)`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
									icon: Lock,
									label: "Segurança (2FA) & LGPD",
									value: `${totais.usuarios_2fa ?? 0} com 2FA`,
									subtitle: `${totais.anonimizados_lgpd ?? 0} contas anonimizadas via LGPD`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "neu rounded-2xl border border-border bg-card p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-base font-bold",
										children: "Inventário de Conteúdo Ativo no Banco"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-3 text-xs font-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-lg bg-muted px-3 py-1.5",
											children: ["Unidades: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-primary",
												children: acervo.unidades ?? 0
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-lg bg-muted px-3 py-1.5",
											children: ["Lições: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-primary",
												children: acervo.aulas ?? 0
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-lg bg-muted px-3 py-1.5",
											children: ["Exercícios: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-primary",
												children: acervo.exercicios ?? 0
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-lg bg-muted px-3 py-1.5",
											children: [
												"Termos no Glossário:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-primary",
													children: acervo.glossario ?? 0
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-lg bg-muted px-3 py-1.5",
											children: [
												"Gravações no Playground:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-primary",
													children: acervo.gravacoes_playground ?? 0
												})
											]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "neu rounded-2xl border border-border bg-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg",
										children: "Acessos Ativos vs. Novos Cadastros (7 dias)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Volume diário de estudantes com login registrado e novas contas criadas."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 h-64",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
												data: metricas?.grafico || [],
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
														strokeDasharray: "4 4",
														vertical: false,
														stroke: "var(--border)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														dataKey: "dia",
														stroke: "var(--muted-foreground)",
														fontSize: 11
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
														stroke: "var(--muted-foreground)",
														fontSize: 11,
														allowDecimals: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
														borderRadius: 8,
														border: "none"
													} }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
														type: "monotone",
														dataKey: "ativos",
														name: "Logins no Dia",
														stroke: "var(--success)",
														strokeWidth: 3,
														dot: { r: 4 }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
														type: "monotone",
														dataKey: "novos_registros",
														name: "Novos Cadastros",
														stroke: "var(--primary)",
														strokeWidth: 2.5,
														dot: { r: 3 }
													})
												]
											})
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "neu rounded-2xl border border-border bg-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg",
										children: "Engajamento Pedagógico: Aulas & Exercícios (7 dias)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Quantidade de lições finalizadas e exercícios submetidos diariamente."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 h-64",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
												data: metricas?.grafico || [],
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
														strokeDasharray: "4 4",
														vertical: false,
														stroke: "var(--border)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														dataKey: "dia",
														stroke: "var(--muted-foreground)",
														fontSize: 11
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
														stroke: "var(--muted-foreground)",
														fontSize: 11,
														allowDecimals: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
														borderRadius: 8,
														border: "none"
													} }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "exercicios",
														name: "Exercícios Submetidos",
														fill: "var(--primary)",
														radius: [
															6,
															6,
															0,
															0
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "licoes",
														name: "Lições Concluídas",
														fill: "var(--success)",
														radius: [
															6,
															6,
															0,
															0
														]
													})
												]
											})
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 lg:grid-cols-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "neu rounded-2xl border border-border bg-card p-6 lg:col-span-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg",
										children: "Taxa de Acerto Global por Tópico"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Consolidação das tentativas de todos os estudantes por unidade temática."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-5 space-y-4",
										children: (metricas?.desempenho_topicos || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "py-8 text-center text-xs italic text-muted-foreground",
											children: "Ainda não há tentativas de exercícios registradas no banco."
										}) : metricas.desempenho_topicos.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-xs font-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.topico }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [
														item.precisao,
														"% acerto (",
														item.total,
														" resp.)"
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2.5 overflow-hidden rounded-full bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full bg-primary transition-all",
													style: { width: `${item.precisao}%` }
												})
											})]
										}, item.topico))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "neu rounded-2xl border border-border bg-card p-6 lg:col-span-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg",
										children: "Últimos Eventos de Auditoria (Imutáveis)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Rastreabilidade em tempo real de auditoria."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 text-gold" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-border text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-2 font-bold",
													children: "Evento / Ação"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-2 font-bold",
													children: "Usuário"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-2 font-bold",
													children: "IP Origem"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-2 text-right font-bold",
													children: "Data/Hora"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border",
											children: (metricas?.ultimos_logs || []).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/30",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 font-mono font-bold text-primary",
														children: log.action
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 text-foreground",
														children: log.usuario
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 font-mono text-muted-foreground",
														children: log.ip_address
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 text-right text-muted-foreground",
														children: log.timestamp
													})
												]
											}, log.id))
										})]
									})
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "usuarios",
					className: "space-y-4 animate-in fade-in-50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "neu overflow-hidden rounded-2xl border border-border bg-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-border p-6 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg",
										children: "Controle de Contas e Papéis (RBAC)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Pesquise por nome ou e-mail e filtre por status ou nível de permissão."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground",
										children: [
											"Exibindo ",
											usuariosFiltrados.length,
											" de ",
											usuarios.length,
											" conta(s)"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-3 md:grid-cols-12",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative md:col-span-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: buscaTexto,
												onChange: (e) => setBuscaTexto(e.target.value),
												placeholder: "Filtrar por nome ou endereço de e-mail...",
												className: "pl-9 text-sm"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 md:col-span-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: filtroStatus,
												onChange: (e) => setFiltroStatus(e.target.value),
												className: "h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: "todos",
														children: [
															"Status: Todos (",
															usuarios.length,
															")"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: "ativos",
														children: [
															"Apenas Ativos (",
															usuarios.filter((u) => u.ativo).length,
															")"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: "suspensos",
														children: [
															"Apenas Suspensos (",
															usuarios.filter((u) => !u.ativo).length,
															")"
														]
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "md:col-span-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: filtroRole,
												onChange: (e) => setFiltroRole(e.target.value),
												className: "h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "todos",
														children: "Papel: Todos os Perfis"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "estudante",
														children: "Estudantes"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "conteudo",
														children: "Administradores de Conteúdo"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "sistema",
														children: "Administradores de Sistema"
													})
												]
											})
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[800px] text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-bold",
												children: "Nome"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-bold",
												children: "E-mail"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-bold",
												children: "Nível de Acesso (Papel)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-bold",
												children: "Status da Conta"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 text-right font-bold",
												children: "Ação Rápida"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: usuariosPaginados.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 5,
										className: "p-8 text-center text-muted-foreground",
										children: "Nenhum usuário encontrado para os filtros selecionados."
									}) }) : usuariosPaginados.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border transition-colors hover:bg-muted/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 font-bold",
												children: u.nome
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-muted-foreground",
												children: u.email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: u.role === "admin-conteudo" ? "conteudo" : u.role === "admin-sistema" ? "sistema" : u.role === "usuario" ? "estudante" : u.role,
													onChange: (e) => handleUpdateRole(u.id, e.target.value),
													className: "focus-ring h-9 cursor-pointer rounded-lg border border-border bg-background px-3 py-1 text-xs font-bold transition-all hover:bg-muted",
													children: ROLE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: opt.value,
														children: opt.label
													}, opt.value))
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", u.ativo ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", u.ativo ? "bg-success" : "bg-destructive") }), u.ativo ? "Ativo" : "Suspenso"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: cn("rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors", u.ativo ? "border-destructive/30 text-destructive hover:bg-destructive hover:text-white" : "border-success/30 text-success hover:bg-success hover:text-white"),
													onClick: () => handleToggleStatus(u.id, u.ativo),
													children: u.ativo ? "Suspender" : "Reativar"
												})
											})
										]
									}, u.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/20 px-6 py-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-muted-foreground",
									children: [
										"Página ",
										paginaAtual,
										" de ",
										totalPaginas,
										" · Mostrando",
										" ",
										usuariosFiltrados.length === 0 ? 0 : (paginaAtual - 1) * ITEMS_PER_PAGE + 1,
										"–",
										Math.min(paginaAtual * ITEMS_PER_PAGE, usuariosFiltrados.length),
										" de",
										" ",
										usuariosFiltrados.length,
										" registros"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: paginaAtual <= 1,
											onClick: () => setPaginaAtual(1),
											className: "rounded-lg border border-border bg-card px-2.5 py-1.5 font-bold hover:bg-muted disabled:opacity-40",
											children: "« Primeira"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: paginaAtual <= 1,
											onClick: () => setPaginaAtual((p) => Math.max(1, p - 1)),
											className: "flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Anterior"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 font-bold text-foreground",
											children: [
												paginaAtual,
												" / ",
												totalPaginas
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: paginaAtual >= totalPaginas,
											onClick: () => setPaginaAtual((p) => Math.min(totalPaginas, p + 1)),
											className: "flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40",
											children: ["Próxima ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: paginaAtual >= totalPaginas,
											onClick: () => setPaginaAtual(totalPaginas),
											className: "rounded-lg border border-border bg-card px-2.5 py-1.5 font-bold hover:bg-muted disabled:opacity-40",
											children: "Última »"
										})
									]
								})]
							})
						]
					})
				})
			]
		})]
	});
}
function MetricCard({ icon: Icon, label, value, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "neu flex items-start gap-4 rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "size-6",
				"aria-hidden": true
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-3xl font-bold text-foreground",
					children: value
				}),
				subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: subtitle
				})
			]
		})]
	});
}
//#endregion
export { AdminSistema as component };
