import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { H as Eraser, P as Keyboard, S as Play, T as Music2, c as Trash2, f as Sparkles, j as ListMusic, k as Lock, t as X, y as Save } from "../_libs/lucide-react.mjs";
import { r as SectionTitle } from "./AppShell-D_4FkkNF.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Stave$1 } from "./Stave-CK4aE8Y8.mjs";
import { n as noteLabelPt, t as VirtualPiano } from "./VirtualPiano-Cg3q8JcN.mjs";
import { a as start, i as Synth, n as now, r as PolySynth } from "../_libs/tone.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pratica-D_2-zTCb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API_MUSIC_URL = "${API_BASE_URL}/api/v1/music/musicas/";
function getAuthHeaders() {
	const token = localStorage.getItem("access_token");
	const headers = { "Content-Type": "application/json" };
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}
function Pratica() {
	const [current, setCurrent] = (0, import_react.useState)([]);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [clef, setClef] = (0, import_react.useState)("treble");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [musicTitle, setMusicTitle] = (0, import_react.useState)("");
	const [savedMusics, setSavedMusics] = (0, import_react.useState)([]);
	const [isPlayingId, setIsPlayingId] = (0, import_react.useState)(null);
	const activeSynthRef = (0, import_react.useRef)(null);
	const activeTimeoutsRef = (0, import_react.useRef)([]);
	const fetchSavedMusics = async () => {
		try {
			const response = await fetch(API_MUSIC_URL, {
				method: "GET",
				headers: getAuthHeaders()
			});
			if (response.ok) {
				const data = await response.json();
				setSavedMusics(Array.isArray(data) ? data : data.results || []);
			}
		} catch (error) {
			console.error("Erro ao buscar músicas salvas:", error);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchSavedMusics();
		return () => {
			if (activeSynthRef.current) activeSynthRef.current.dispose();
		};
	}, []);
	const recentNotes = history.slice(-8);
	const notas = recentNotes.length === 0 ? "B4/w/r" : [...recentNotes.map((n) => `${n}/8`), ...Array(8 - recentNotes.length).fill("B4/8/r")].join(", ");
	const handleOpenSaveModal = () => {
		if (history.length === 0) return;
		setMusicTitle(`Minha Gravação - ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`);
		setIsModalOpen(true);
	};
	const handleConfirmSave = async () => {
		if (!musicTitle.trim()) {
			toast.warning("Por favor, digite um nome para a música.");
			return;
		}
		setIsSaving(true);
		try {
			if (!(await fetch(API_MUSIC_URL, {
				method: "POST",
				headers: getAuthHeaders(),
				body: JSON.stringify({
					nome_musica: musicTitle.trim(),
					notas: history
				})
			})).ok) throw new Error("Erro ao salvar no backend.");
			toast.success("Gravação salva na sua biblioteca privada!");
			setHistory([]);
			setIsModalOpen(false);
			fetchSavedMusics();
		} catch (error) {
			console.error("Erro na requisição:", error);
			toast.error("Não foi possível salvar a gravação.");
		} finally {
			setIsSaving(false);
		}
	};
	const handleDeleteMusic = async (id_musica, nome) => {
		if (!window.confirm(`Deseja realmente excluir a sua gravação "${nome}"?`)) return;
		try {
			if (!(await fetch(`${API_MUSIC_URL}${id_musica}/`, {
				method: "DELETE",
				headers: getAuthHeaders()
			})).ok) throw new Error("Erro ao excluir a música.");
			setSavedMusics((prev) => prev.filter((m) => m.id_musica !== id_musica));
			toast.success("Gravação excluída com sucesso!");
		} catch (error) {
			console.error("Erro na exclusão:", error);
			toast.error("Não foi possível excluir a gravação.");
		}
	};
	const playSavedMusic = async (musica) => {
		if (!musica.notas || musica.notas.length === 0) return;
		setHistory(musica.notas);
		setCurrent([]);
		if (activeSynthRef.current) {
			activeSynthRef.current.dispose();
			activeSynthRef.current = null;
		}
		activeTimeoutsRef.current.forEach((t) => clearTimeout(t));
		activeTimeoutsRef.current = [];
		setIsPlayingId(musica.id_musica);
		await start();
		const synth = new PolySynth(Synth).toDestination();
		activeSynthRef.current = synth;
		const now$1 = now();
		musica.notas.forEach((note, index) => {
			synth.triggerAttackRelease(note, "8n", now$1 + index * .3);
		});
		const totalDurationMs = musica.notas.length * 300 + 200;
		const timeoutId = setTimeout(() => {
			if (activeSynthRef.current === synth) {
				setIsPlayingId(null);
				activeSynthRef.current = null;
			}
		}, totalDurationMs);
		activeTimeoutsRef.current.push(timeoutId);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Playground",
				title: "Piano virtual e partitura em tempo real",
				description: "Ouça as amostras públicas para se inspirar ou crie e salve suas próprias melodias privadas."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "neu p-5 sm:p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "neu-inset mb-5 flex flex-col items-center gap-3 p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 self-end",
										role: "group",
										"aria-label": "Escolher clave",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, {
												className: "size-4 text-primary",
												"aria-hidden": true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setClef("treble"),
												"aria-pressed": clef === "treble",
												className: clef === "treble" ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground" : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground",
												children: "Clave de Sol"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setClef("bass"),
												"aria-pressed": clef === "bass",
												className: clef === "bass" ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground" : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground",
												children: "Clave de Fá"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, { data: {
										clef,
										timeSignature: "4/4",
										notes: notas,
										width: 520,
										height: 190
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-primary",
										"aria-live": "polite",
										children: current.length > 0 ? current.map((n) => `${noteLabelPt(n)} ${n.slice(-1)}`).join(" · ") : "Toque uma tecla para escrever na pauta"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualPiano, { onNoteOn: (note) => {
								setCurrent([note]);
								setHistory((h) => [...h, note]);
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, {
										className: "size-4",
										"aria-hidden": true
									}), "Teclas: Q=Dó, 2=Dó#, W=Ré, 3=Ré#, E=Mi, R=Fá..."]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setCurrent([]);
										setHistory([]);
									},
									className: "focus-ring ml-auto flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold text-primary shadow-neu-sm active:translate-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, {
										className: "size-4",
										"aria-hidden": true
									}), " Limpar"]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-xl",
								children: [
									"Últimas notas tocadas (",
									history.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleOpenSaveModal,
								disabled: history.length === 0 || isSaving,
								className: "flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
									className: "size-4",
									"aria-hidden": true
								}), "Salvar Minha Gravação"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-2",
							children: [history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nada ainda por aqui."
							}), history.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "neu-sm px-3 py-1.5 text-sm font-bold text-foreground",
								children: [
									noteLabelPt(n),
									" ",
									n.slice(-1)
								]
							}, `${n}-${i}`))]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "neu flex h-full flex-col p-5 sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border/50 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg",
								children: "Biblioteca do Playground"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 max-h-[500px] flex-1 space-y-3 overflow-y-auto pr-1",
							children: savedMusics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Nenhuma música disponível no momento."
							}) : savedMusics.map((musica) => {
								const isPublicSample = musica.is_publica === true || musica.id_usuario == null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "neu-inset flex items-center justify-between gap-3 rounded-xl bg-background/50 p-3.5 transition-all hover:border-primary/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-1 flex items-center gap-1.5",
												children: isPublicSample ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-2.5" }), " Amostra Pública"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-2.5" }), " Minha Gravação"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "truncate text-sm font-bold text-foreground",
												title: musica.nome_musica,
												children: musica.nome_musica
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-0.5 text-xs text-muted-foreground",
												children: [
													musica.notas?.length || 0,
													" notas",
													!isPublicSample && ` · ${new Date(musica.data_criacao).toLocaleDateString()}`
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void playSavedMusic(musica),
											title: "Ouvir e ver na partitura",
											className: "flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: `size-3.5 ${isPlayingId === musica.id_musica ? "animate-pulse" : ""}` })
										}), !isPublicSample && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void handleDeleteMusic(musica.id_musica, musica.nome_musica),
											title: "Excluir minha gravação",
											className: "flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive shadow-sm hover:bg-destructive/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
										})]
									})]
								}, musica.id_musica);
							})
						})]
					})
				})]
			}),
			isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "neu w-full max-w-md rounded-2xl bg-card p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: "Salvar Minha Gravação"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsModalOpen(false),
								className: "text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Esta gravação ficará visível apenas na sua conta. Digite um título para identificá-la:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: musicTitle,
							onChange: (e) => setMusicTitle(e.target.value),
							placeholder: "Digite o nome da música",
							className: "mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsModalOpen(false),
								className: "rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void handleConfirmSave(),
								disabled: isSaving,
								className: "rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50",
								children: isSaving ? "Salvando..." : "Confirmar e Salvar"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Pratica as component };
