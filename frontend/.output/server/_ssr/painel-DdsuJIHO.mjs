import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { R as Flame, a as Trophy, et as Award, l as Target, s as TrendingUp, u as Star } from "../_libs/lucide-react.mjs";
import { r as SectionTitle } from "./AppShell-D_4FkkNF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel-DdsuJIHO.js
var import_jsx_runtime = require_jsx_runtime();
function Painel() {
	const { state, allLessons, progressPercent } = useLinus();
	const completedCount = state.completedLessons.filter((id) => allLessons.some((l) => l.id === id)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Painel pessoal",
				title: `Bem-vindo de volta, ${state.name.split(" ")[0]}`,
				description: "Confira como está o seu ritmo de estudos e quais são os próximos passos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "neu p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
									className: "size-4 text-gold",
									"aria-hidden": true
								}), " Ofensiva diária"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-display text-4xl",
								children: [state.streak, " dias"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Continue praticando para não perder!"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "neu p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
									className: "size-4 text-success",
									"aria-hidden": true
								}), " Conclusão de lições"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-display text-4xl",
								children: [progressPercent, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									completedCount,
									" de ",
									allLessons.length,
									" lições concluídas"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "neu p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}), " Conquistas"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-4xl",
								children: state.badges.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Medalhas desbloqueadas"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "neu p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 font-display text-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
							className: "size-5 text-gold",
							"aria-hidden": true
						}), " Conquistas Recentes"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-4",
						children: state.badges.length > 0 ? state.badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 rounded-lg bg-muted/30 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold capitalize",
								children: b.replace(/-/g, " ")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Conquistado recentemente"
							})] })]
						}, b)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground italic",
							children: "Complete lições para ganhar medalhas."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "neu p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 font-display text-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
							className: "size-5 text-primary",
							"aria-hidden": true
						}), " Foco de Estudo"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-4",
						children: Object.entries(state.errorsByTopic).map(([topic, stats]) => {
							const total = stats?.total || 0;
							const erros = stats?.erros || 0;
							const temRegistros = total > 0;
							const acertos = Math.max(0, total - erros);
							const precisao = temRegistros ? Math.round(acertos / total * 100) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-bold uppercase tracking-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: topic }), temRegistros ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [precisao, "% precisão"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-muted px-2 py-0.5 text-[11px] font-normal normal-case text-muted-foreground italic",
									children: "Sem registros no momento"
								})]
							}), temRegistros && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary transition-all",
									style: { width: `${precisao}%` }
								})
							})] }, topic);
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { Painel as component };
