import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as BookOpen, C as PartyPopper, I as Heart, n as Volume2, t as X, tt as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Stave$1 } from "./Stave-CK4aE8Y8.mjs";
import { t as Route } from "./licao._lessonId-Dx6o9dNr.mjs";
import { a as playSequence, i as playNote, n as noteLabelPt, r as playFeedback, t as VirtualPiano } from "./VirtualPiano-Cg3q8JcN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/licao._lessonId-DNwdNkTQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LessonPage() {
	const { lessonId } = Route.useParams();
	const navigate = useNavigate();
	const { state, findLessonById, completeLesson, loseHeart, refillHearts, registerAnswer } = useLinus();
	const found = (0, import_react.useMemo)(() => findLessonById(lessonId), [findLessonById, lessonId]);
	const [etapaAula, setEtapaAula] = (0, import_react.useState)("teoria");
	const [index, setIndex] = (0, import_react.useState)(0);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [built, setBuilt] = (0, import_react.useState)([]);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const [acertos, setAcertos] = (0, import_react.useState)(0);
	const startTimeRef = (0, import_react.useRef)(Date.now());
	(0, import_react.useEffect)(() => {
		refillHearts();
		setEtapaAula("teoria");
		setIndex(0);
		setStatus("idle");
		setSelected(null);
		setBuilt([]);
		setFinished(false);
		setAcertos(0);
		startTimeRef.current = Date.now();
	}, [lessonId]);
	(0, import_react.useEffect)(() => {
		if (etapaAula === "pratica") startTimeRef.current = Date.now();
	}, [index, etapaAula]);
	if (!found || found.lesson.exercises.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Lição não encontrada"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/trilha",
			className: "mt-4 inline-block font-bold text-primary underline",
			children: "Voltar para a trilha"
		})]
	});
	const { lesson, unit } = found;
	const topic = unit.title.replace(/^Unidade \d+: /, "");
	const ex = lesson.exercises[index];
	const progress = etapaAula === "teoria" ? 5 : (index + (status !== "idle" ? 1 : 0)) / lesson.exercises.length * 100;
	const paragrafosTeoria = (lesson.theory || lesson.subtitle || "").split("\n\n").map((p) => p.trim()).filter(Boolean);
	const demoNotes = Array.isArray(lesson.partitura_dados?.notes) ? lesson.partitura_dados.notes : ex.stave || [
		"C4",
		"D4",
		"E4",
		"F4",
		"G4"
	];
	const demoClef = lesson.partitura_dados?.clef || "treble";
	const demoCaption = lesson.partitura_dados?.caption || "Ouça e observe as notas de referência na pauta antes de iniciar os exercícios.";
	function validar(resposta) {
		if (status !== "idle") return;
		const ok = resposta === ex.answer;
		const elapsedMs = Math.max(0, Date.now() - startTimeRef.current);
		setSelected(resposta);
		setStatus(ok ? "correct" : "wrong");
		registerAnswer(topic, ok, {
			exercicioId: ex.id,
			resposta,
			tempoRespostaMs: elapsedMs
		});
		playFeedback(ok);
		if (ok) setAcertos((a) => a + 1);
		else loseHeart();
	}
	function avancar() {
		if (index + 1 >= lesson.exercises.length) {
			completeLesson(lesson.id, {
				acertos,
				total: lesson.exercises.length
			});
			setFinished(true);
			return;
		}
		setIndex(index + 1);
		setStatus("idle");
		setSelected(null);
		setBuilt([]);
	}
	if (finished) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-lg px-4 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "neu animate-pop p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-gold text-gold-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, {
						className: "size-8",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Lição concluída!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted-foreground",
					children: [
						"Você acertou ",
						acertos,
						" de ",
						lesson.exercises.length,
						" exercícios práticos nesta aula."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/trilha",
						className: "focus-ring rounded-lg bg-success px-6 py-3.5 font-display text-lg text-success-foreground shadow-neu-sm active:translate-y-0.5",
						children: "Voltar à trilha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/painel",
						className: "focus-ring rounded-lg bg-card px-6 py-3.5 font-display text-lg text-primary shadow-neu-sm active:translate-y-0.5",
						children: "Ver meu painel"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-background/90 px-4 py-3 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-3xl items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Sair da lição",
							onClick: () => navigate({ to: "/trilha" }),
							className: "focus-ring rounded-xl p-2 text-muted-foreground hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-5",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-4 flex-1 overflow-hidden rounded-full bg-muted",
							role: "progressbar",
							"aria-valuenow": Math.round(progress),
							"aria-valuemin": 0,
							"aria-valuemax": 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-success transition-[width] duration-500",
								style: { width: `${Math.max(progress, 5)}%` }
							})
						}),
						etapaAula === "pratica" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setEtapaAula("teoria"),
							className: "focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }), " Rever Teoria"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "flex items-center gap-1",
							"aria-label": `${state.hearts} vidas restantes`,
							children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: cn("size-5", i < state.hearts ? "fill-destructive text-destructive" : "text-muted"),
								"aria-hidden": true
							}, i))
						})
					]
				})
			}),
			etapaAula === "teoria" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-8 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "neu rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }),
								" Guia Teórico da Aula · ",
								unit.title
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-2xl sm:text-3xl text-foreground",
							children: lesson.title
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 text-base leading-relaxed text-foreground/90",
							children: paragrafosTeoria.map((paragrafo, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn(idx === 0 && "font-medium text-foreground", paragrafo.startsWith("💡") && "rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium text-foreground"),
								children: paragrafo
							}, idx))
						}),
						demoNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "neu-inset flex flex-col items-center gap-3 rounded-xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-primary",
									children: "Exemplo Visual e Sonoro na Pauta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, {
									notes: demoNotes,
									sequential: demoNotes.length > 1,
									width: 460,
									height: 170,
									scale: 1.35,
									clef: demoClef
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-xs text-muted-foreground",
									children: demoCaption
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void (demoNotes.length > 1 ? playSequence(demoNotes) : playNote(demoNotes[0], "2n")),
										className: "focus-ring flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-neu-sm active:translate-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
											className: "size-4",
											"aria-hidden": true
										}), " Ouvir Exemplo Completo"]
									}), demoNotes.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void playNote(n, "4n"),
										className: "focus-ring rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted",
										children: [
											"♪ ",
											noteLabelPt(n),
											" (",
											n,
											")"
										]
									}, `${n}-${i}`))]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"A seguir: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [lesson.exercises.length, " exercícios práticos"] }),
									" para fixar este conteúdo."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setEtapaAula("pratica"),
								className: "focus-ring flex items-center gap-2 rounded-xl bg-success px-6 py-3.5 font-display text-lg text-success-foreground shadow-neu-sm transition-transform active:translate-y-0.5",
								children: [
									"Iniciar Prática (",
									lesson.exercises.length,
									" desafios)",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-5" })
								]
							})]
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-8 pb-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold uppercase tracking-wide text-primary",
						children: [
							lesson.title,
							" · Exercício ",
							index + 1,
							" de ",
							lesson.exercises.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-2xl sm:text-3xl",
						children: ex.prompt
					}),
					ex.stave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "neu-inset mt-6 flex flex-col items-center gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, {
							notes: ex.stave,
							sequential: ex.stave.length > 1,
							width: 420,
							height: 180,
							scale: 1.45,
							clef: "treble"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void (ex.stave.length > 1 ? playSequence(ex.stave) : playNote(ex.stave[0], "2n")),
							className: "focus-ring flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold text-primary shadow-neu-sm active:translate-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-4",
								"aria-hidden": true
							}), " Ouvir"]
						})]
					}),
					ex.options && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-3 sm:grid-cols-2",
						children: ex.options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => validar(opt),
							disabled: status !== "idle",
							className: cn("focus-ring rounded-lg bg-background p-4 text-left font-bold shadow-neu-sm transition-transform hover:bg-primary-soft active:translate-y-0.5", selected === opt && status === "correct" && "bg-success text-success-foreground", selected === opt && status === "wrong" && "animate-shake bg-destructive text-destructive-foreground"),
							children: opt
						}, opt))
					}),
					ex.kind === "keyboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: "Toque a tecla correspondente no piano abaixo (mouse ou teclado do computador)."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualPiano, {
							onNoteOn: (note) => validar(note),
							compact: true
						})]
					}),
					ex.kind === "builder" && ex.sequence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "neu-inset flex min-h-24 flex-wrap items-center gap-2 p-4",
								children: [built.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Clique nas notas na ordem correta para montar a sequência."
								}), built.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-pop rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground",
									children: noteLabelPt(n)
								}, `${n}-${i}`))]
							}),
							built.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "neu-inset flex justify-center p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, {
									notes: built,
									sequential: true,
									width: 420,
									height: 150
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [...ex.sequence].sort((a, b) => a.localeCompare(b)).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: status !== "idle",
									onClick: () => {
										playNote(n);
										setBuilt((b) => [...b, n]);
									},
									className: "focus-ring rounded-lg bg-card px-4 py-3 text-sm font-bold shadow-neu-sm active:translate-y-0.5",
									children: [
										noteLabelPt(n),
										" ",
										n.slice(-1)
									]
								}, n))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setBuilt([]),
									className: "focus-ring rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted",
									children: "Limpar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: status !== "idle" || built.length === 0,
									onClick: () => validar(built.join(",")),
									className: "focus-ring rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm disabled:opacity-50",
									children: "Conferir sequência"
								})]
							})
						]
					})
				]
			}),
			etapaAula === "pratica" && status !== "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("fixed bottom-0 left-0 right-0 border-t-2 p-5", status === "correct" ? "border-success bg-accent" : "border-destructive bg-destructive/10"),
				role: "status",
				"aria-live": "assertive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-3xl flex-wrap items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("font-display text-xl", status === "correct" ? "text-success-foreground" : "text-destructive"),
							children: status === "correct" ? "Muito bem!" : `Ainda não. Resposta: ${ex.answer}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-foreground",
							children: ex.explanation
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: avancar,
						className: cn("focus-ring rounded-lg px-8 py-3.5 font-display text-lg shadow-neu-sm active:translate-y-0.5", status === "correct" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"),
						children: "Continuar"
					})]
				})
			})
		]
	});
}
//#endregion
export { LessonPage as component };
