import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as CircleCheck, R as Flame, S as Play, k as Lock } from "../_libs/lucide-react.mjs";
import { r as SectionTitle } from "./AppShell-D_4FkkNF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trilha-Q11SyVga.js
var import_jsx_runtime = require_jsx_runtime();
function Trilha() {
	const { state, units, recommendedUnitId, progressPercent } = useLinus();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Sua jornada",
				title: "Trilha de Aprendizado",
				description: "Cada nó é uma lição curta. Complete uma para liberar a próxima."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10 flex flex-wrap items-center gap-6 rounded-lg bg-card p-6 shadow-neu-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Progresso geral"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-2xl",
							children: [progressPercent, "% concluído"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-3 min-w-40 flex-1 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-success transition-all",
							style: { width: `${Math.max(progressPercent, 3)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5 font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
								className: "size-4 text-gold",
								"aria-hidden": true
							}),
							" ",
							state.streak,
							" dias"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-12",
				children: units.map((unit, ui) => {
					const recomendada = unit.id === recommendedUnitId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": `u-${unit.id}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("mb-6 rounded-lg p-5", recomendada ? "bg-primary text-primary-foreground shadow-neu" : "bg-card shadow-neu-sm"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-bold uppercase tracking-wide opacity-80",
									children: [
										"Nível ",
										unit.level,
										recomendada && " · recomendada para você"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: `u-${unit.id}`,
									className: "font-display text-xl",
									children: unit.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm opacity-90",
									children: unit.description
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
							children: unit.lessons.map((lesson, li) => {
								const isCompleted = state.completedLessons.includes(lesson.id);
								const prevLesson = unit.lessons[li - 1] || units[ui - 1]?.lessons.slice(-1)[0];
								const isLocked = Boolean(!isCompleted && prevLesson && !state.completedLessons.includes(prevLesson.id));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "group relative",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/licao/$lessonId",
										params: { lessonId: lesson.id },
										disabled: isLocked,
										className: cn("focus-ring flex h-full items-center gap-4 rounded-lg p-4 transition-all active:scale-95", isLocked ? "cursor-not-allowed opacity-60 grayscale" : "bg-card shadow-neu-sm hover:shadow-neu", isCompleted && "ring-2 ring-success ring-offset-2 ring-offset-background"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("flex size-14 shrink-0 items-center justify-center rounded-lg", isLocked ? "bg-muted text-muted-foreground" : isCompleted ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"),
											children: isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-6" }) : isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-1 size-7" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-lg leading-snug",
												children: lesson.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 line-clamp-2 text-sm text-muted-foreground",
												children: lesson.subtitle
											})]
										})]
									})
								}, lesson.id);
							})
						})]
					}, unit.id);
				})
			})
		]
	});
}
//#endregion
export { Trilha as component };
