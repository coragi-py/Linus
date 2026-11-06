import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as jwtDecode } from "../_libs/jwt-decode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LinusContext-DAkHNv3o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UNITS = [
	{
		id: "u1",
		index: 1,
		title: "Unidade 1: Leitura de Partituras",
		description: "Pauta, clave de Sol, notas e figuras de duração.",
		level: "Iniciante",
		lessons: [{
			id: "u1-l1",
			title: "As notas na clave de Sol",
			subtitle: "Reconheça as notas nas linhas e espaços",
			exercises: [
				{
					id: "u1-l1-e1",
					kind: "note-reading",
					prompt: "Qual nota está escrita na pauta?",
					stave: ["C4"],
					options: [
						"Dó",
						"Ré",
						"Mi",
						"Fá"
					],
					answer: "Dó",
					explanation: "Dó central fica na linha suplementar abaixo da pauta, na clave de Sol."
				},
				{
					id: "u1-l1-e2",
					kind: "note-reading",
					prompt: "Qual nota está escrita na pauta?",
					stave: ["G4"],
					options: [
						"Fá",
						"Sol",
						"Lá",
						"Si"
					],
					answer: "Sol",
					explanation: "A clave de Sol envolve a segunda linha, que é justamente o Sol."
				},
				{
					id: "u1-l1-e3",
					kind: "keyboard",
					prompt: "Toque no piano a nota mostrada na pauta.",
					stave: ["E4"],
					answer: "E4",
					targetNote: "E4",
					explanation: "Mi fica no primeiro espaço da pauta, entre a primeira e a segunda linha."
				}
			]
		}, {
			id: "u1-l2",
			title: "Figuras de duração",
			subtitle: "Semibreve, mínima, semínima e colcheia",
			exercises: [
				{
					id: "u1-l2-e1",
					kind: "multiple-choice",
					prompt: "Quantos tempos vale uma mínima em compasso 4/4?",
					options: [
						"1 tempo",
						"2 tempos",
						"3 tempos",
						"4 tempos"
					],
					answer: "2 tempos",
					explanation: "A mínima vale metade da semibreve: 2 tempos em 4/4."
				},
				{
					id: "u1-l2-e2",
					kind: "multiple-choice",
					prompt: "Qual figura vale meio tempo em 4/4?",
					options: [
						"Semibreve",
						"Semínima",
						"Colcheia",
						"Mínima"
					],
					answer: "Colcheia",
					explanation: "A colcheia é metade da semínima, portanto meio tempo em 4/4."
				},
				{
					id: "u1-l2-e3",
					kind: "note-reading",
					prompt: "Qual nota está escrita na pauta?",
					stave: ["A4"],
					options: [
						"Sol",
						"Lá",
						"Si",
						"Dó"
					],
					answer: "Lá",
					explanation: "Lá ocupa o segundo espaço da pauta na clave de Sol."
				}
			]
		}]
	},
	{
		id: "u2",
		index: 2,
		title: "Unidade 2: Intervalos e Escalas",
		description: "Distâncias entre notas e a escala maior.",
		level: "Iniciante",
		lessons: [{
			id: "u2-l1",
			title: "Intervalos básicos",
			subtitle: "Terças, quartas e quintas",
			exercises: [
				{
					id: "u2-l1-e1",
					kind: "note-reading",
					prompt: "Qual é o intervalo entre as duas notas da pauta?",
					stave: ["C4", "E4"],
					options: [
						"Terça maior",
						"Terça menor",
						"Quarta justa",
						"Quinta justa"
					],
					answer: "Terça maior",
					explanation: "De Dó a Mi há 4 semitons, formando uma terça maior."
				},
				{
					id: "u2-l1-e2",
					kind: "note-reading",
					prompt: "Qual é o intervalo entre as duas notas da pauta?",
					stave: ["C4", "G4"],
					options: [
						"Quarta justa",
						"Quinta justa",
						"Sexta maior",
						"Oitava"
					],
					answer: "Quinta justa",
					explanation: "De Dó a Sol há 7 semitons: quinta justa, base dos acordes."
				},
				{
					id: "u2-l1-e3",
					kind: "builder",
					prompt: "Monte a escala de Dó maior ascendente.",
					sequence: [
						"C4",
						"D4",
						"E4",
						"F4",
						"G4",
						"A4",
						"B4"
					],
					answer: "C4,D4,E4,F4,G4,A4,B4",
					explanation: "Dó maior segue tom-tom-semitom-tom-tom-tom-semitom, sem acidentes."
				}
			]
		}]
	},
	{
		id: "u3",
		index: 3,
		title: "Unidade 3: Modos Gregos",
		description: "Jônio, dórico, frígio, lídio, mixolídio, eólio e lócrio.",
		level: "Intermediário",
		lessons: [{
			id: "u3-l1",
			title: "Os sete modos",
			subtitle: "Cada grau da escala maior gera um modo",
			exercises: [
				{
					id: "u3-l1-e1",
					kind: "multiple-choice",
					prompt: "Qual modo começa no segundo grau da escala maior?",
					options: [
						"Jônio",
						"Dórico",
						"Frígio",
						"Lídio"
					],
					answer: "Dórico",
					explanation: "O dórico parte do 2º grau: em Dó maior, de Ré a Ré."
				},
				{
					id: "u3-l1-e2",
					kind: "multiple-choice",
					prompt: "Qual modo tem a quarta aumentada como característica?",
					options: [
						"Lídio",
						"Mixolídio",
						"Eólio",
						"Lócrio"
					],
					answer: "Lídio",
					explanation: "O lídio (4º grau) tem #4, som luminoso e flutuante."
				},
				{
					id: "u3-l1-e3",
					kind: "builder",
					prompt: "Monte o modo dórico de Ré (só notas naturais).",
					sequence: [
						"D4",
						"E4",
						"F4",
						"G4",
						"A4",
						"B4"
					],
					answer: "D4,E4,F4,G4,A4,B4",
					explanation: "O dórico de Ré usa apenas notas naturais, com terça e sétima menores."
				}
			]
		}]
	},
	{
		id: "u4",
		index: 4,
		title: "Unidade 4: Acordes e Campos Harmônicos",
		description: "Tríades, tétrades e a harmonização da escala.",
		level: "Praticante Empírico",
		lessons: [{
			id: "u4-l1",
			title: "Tríades maiores e menores",
			subtitle: "A construção do acorde em terças",
			exercises: [
				{
					id: "u4-l1-e1",
					kind: "multiple-choice",
					prompt: "Quais notas formam o acorde de Dó maior?",
					options: [
						"Dó, Mi, Sol",
						"Dó, Mi bemol, Sol",
						"Dó, Fá, Lá",
						"Dó, Ré, Sol"
					],
					answer: "Dó, Mi, Sol",
					explanation: "Tríade maior = tônica + terça maior + quinta justa."
				},
				{
					id: "u4-l1-e2",
					kind: "builder",
					prompt: "Monte a tríade de Lá menor ascendente.",
					sequence: [
						"A3",
						"C4",
						"E4"
					],
					answer: "A3,C4,E4",
					explanation: "Lá menor = Lá + Dó (terça menor) + Mi (quinta justa)."
				},
				{
					id: "u4-l1-e3",
					kind: "multiple-choice",
					prompt: "No campo harmônico de Dó maior, qual é o acorde do V grau?",
					options: [
						"Fá maior",
						"Sol maior",
						"Lá menor",
						"Si diminuto"
					],
					answer: "Sol maior",
					explanation: "O V grau de Dó maior é Sol maior, o acorde dominante."
				}
			]
		}]
	}
];
UNITS.flatMap((u) => u.lessons.map((l) => ({
	...l,
	unitId: u.id
})));
[
	{
		id: "p1",
		topic: "Experiência prática",
		prompt: "Como você descreveria sua experiência tocando um instrumento?",
		options: [
			"Nunca toquei",
			"Toco algumas músicas de ouvido",
			"Toco há mais de um ano, sem estudar teoria",
			"Toco e já estudei teoria musical"
		],
		answer: "Toco e já estudei teoria musical",
		weight: 1
	},
	{
		id: "p2",
		topic: "Leitura de notas",
		prompt: "Na clave de Sol, qual nota fica na segunda linha da pauta?",
		stave: ["G4"],
		options: [
			"Ré",
			"Fá",
			"Sol",
			"Si"
		],
		answer: "Sol",
		weight: 1
	},
	{
		id: "p3",
		topic: "Intervalos",
		prompt: "Quantos semitons tem uma quinta justa?",
		options: [
			"5",
			"6",
			"7",
			"8"
		],
		answer: "7",
		weight: 2
	},
	{
		id: "p4",
		topic: "Escalas e modos",
		prompt: "A escala menor natural equivale a qual modo grego?",
		options: [
			"Dórico",
			"Eólio",
			"Frígio",
			"Mixolídio"
		],
		answer: "Eólio",
		weight: 2
	},
	{
		id: "p5",
		topic: "Harmonia",
		prompt: "No campo harmônico de Dó maior, qual acorde é o V grau?",
		options: [
			"Fá maior",
			"Sol maior",
			"Lá menor",
			"Si diminuto"
		],
		answer: "Sol maior",
		weight: 3
	}
].reduce((s, q) => s + q.weight, 0);
var RECOMMENDED_UNIT = {
	Iniciante: "u1",
	Intermediário: "u2",
	"Praticante Empírico": "u3"
};
var ROLE_LABEL = {
	estudante: "Estudante",
	usuario: "Estudante",
	conteudo: "Administrador de Conteúdo",
	"admin-conteudo": "Administrador de Conteúdo",
	sistema: "Administrador de Sistemas",
	"admin-sistema": "Administrador de Sistemas"
};
var STORAGE_KEY = "linus.state.v1";
var API_BASE = "${API_BASE_URL}/api/v1";
var EMPTY_TOPICS = {
	"Leitura de Partituras": {
		erros: 0,
		total: 0
	},
	"Intervalos e Escalas": {
		erros: 0,
		total: 0
	},
	"Modos Gregos": {
		erros: 0,
		total: 0
	},
	"Acordes e Campos Harmônicos": {
		erros: 0,
		total: 0
	}
};
var INITIAL = {
	name: "Aluno Linus",
	role: "estudante",
	loggedIn: false,
	placement: null,
	placementDone: false,
	streak: 0,
	hearts: 5,
	completedLessons: [],
	badges: [],
	errorsByTopic: { ...EMPTY_TOPICS }
};
function getAuthFromToken() {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) return { loggedIn: false };
		const decoded = jwtDecode(token);
		return {
			loggedIn: true,
			role: decoded.role,
			name: decoded.nome
		};
	} catch {
		return { loggedIn: false };
	}
}
var LinusContext = (0, import_react.createContext)(null);
function LinusProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(INITIAL);
	const [units, setUnits] = (0, import_react.useState)(UNITS);
	const [ready, setReady] = (0, import_react.useState)(false);
	const update = (0, import_react.useCallback)((patch) => {
		setState((s) => {
			const next = {
				...s,
				...patch
			};
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {}
			return next;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const parsed = raw ? JSON.parse(raw) : {};
			const tokenAuth = getAuthFromToken();
			setState({
				...INITIAL,
				...parsed,
				loggedIn: tokenAuth.loggedIn || Boolean(parsed.loggedIn),
				role: tokenAuth.role || parsed.role || INITIAL.role,
				name: tokenAuth.name || parsed.name || INITIAL.name,
				errorsByTopic: {
					...EMPTY_TOPICS,
					...parsed.errorsByTopic || {}
				}
			});
		} catch {}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {}
	}, [state, ready]);
	const refreshCurriculum = (0, import_react.useCallback)(async () => {
		try {
			const res = await fetch(`${API_BASE}/learning/modulos/`);
			if (!res.ok) return;
			const data = await res.json();
			if (Array.isArray(data) && data.length > 0) {
				const mappedUnits = data.filter((m) => m.ativo !== false).map((m) => ({
					id: String(m.id),
					index: m.index ?? m.ordem ?? 1,
					title: m.title ?? m.titulo ?? "",
					description: m.description ?? m.descricao ?? "",
					level: m.level ?? m.categoria ?? "Iniciante",
					lessons: (m.lessons ?? m.aulas ?? []).map((l) => ({
						id: String(l.id),
						title: l.title ?? l.titulo ?? "",
						subtitle: l.subtitle ?? l.conteudo_teorico ?? "",
						theory: l.conteudo_teorico ?? l.subtitle ?? "",
						partitura_dados: l.partitura_dados ?? null,
						exercises: (l.exercises ?? l.exercicios ?? []).map((e) => ({
							id: String(e.id),
							kind: e.kind ?? e.tipo ?? "multiple-choice",
							prompt: e.prompt ?? e.enunciado ?? "",
							stave: e.stave ?? void 0,
							options: e.options ?? void 0,
							answer: e.answer ?? "",
							targetNote: e.targetNote ?? void 0,
							sequence: e.sequence ?? void 0,
							explanation: e.explanation ?? ""
						}))
					}))
				}));
				setUnits(mappedUnits);
			}
		} catch (err) {
			console.error("Erro ao carregar trilha do backend, mantendo currículo local:", err);
		}
	}, []);
	const syncUserProgress = (0, import_react.useCallback)(async () => {
		const token = localStorage.getItem("access_token");
		if (!token) return;
		try {
			const tokenAuth = getAuthFromToken();
			const res = await fetch(`${API_BASE}/learning/progresso/`, { headers: { Authorization: `Bearer ${token}` } });
			if (!res.ok) return;
			const data = await res.json();
			setState((s) => ({
				...s,
				loggedIn: true,
				name: tokenAuth.name || data.nome || s.name,
				role: tokenAuth.role || s.role,
				streak: typeof data.streak === "number" ? data.streak : 0,
				completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
				badges: Array.isArray(data.badges) ? data.badges : [],
				errorsByTopic: {
					...EMPTY_TOPICS,
					...data.errorsByTopic || {}
				},
				placement: data.placement || s.placement,
				placementDone: Boolean(data.placement || s.placementDone)
			}));
		} catch (err) {
			console.error("Falha ao sincronizar progresso com o backend:", err);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refreshCurriculum();
		syncUserProgress();
	}, [
		refreshCurriculum,
		syncUserProgress,
		state.loggedIn
	]);
	const allLessons = (0, import_react.useMemo)(() => units.flatMap((u) => u.lessons.map((l) => ({
		...l,
		unitId: u.id
	}))), [units]);
	const findLessonById = (0, import_react.useCallback)((lessonId) => {
		for (const unit of units) {
			const lesson = unit.lessons.find((l) => l.id === lessonId);
			if (lesson) return {
				unit,
				lesson
			};
		}
		return null;
	}, [units]);
	const value = (0, import_react.useMemo)(() => {
		const rate = (t) => t.total ? t.erros / t.total : 0;
		const entries = Object.entries(state.errorsByTopic).map(([topic, v]) => ({
			topic,
			rate: rate(v)
		}));
		entries.sort((a, b) => b.rate - a.rate);
		const weakest = entries[0] && entries[0].rate > .3 ? entries[0] : null;
		const placementLevel = state.placement || "Iniciante";
		const matchedUnit = units.find((u) => u.level === placementLevel) ?? units.find((u) => u.id === RECOMMENDED_UNIT[placementLevel]) ?? units[0];
		const recommendedUnitId = matchedUnit ? matchedUnit.id : "u1";
		const totalCount = Math.max(allLessons.length, 1);
		const completedValidCount = state.completedLessons.filter((id) => allLessons.some((l) => l.id === id)).length;
		return {
			state,
			ready,
			units,
			allLessons,
			findLessonById,
			refreshCurriculum,
			login: (name) => {
				const tokenAuth = getAuthFromToken();
				update({
					name: name || tokenAuth.name || "Aluno Linus",
					role: tokenAuth.role || state.role,
					loggedIn: true,
					streak: 0,
					completedLessons: [],
					badges: [],
					errorsByTopic: { ...EMPTY_TOPICS }
				});
			},
			logout: async () => {
				try {
					const accessToken = localStorage.getItem("access_token");
					const refreshToken = localStorage.getItem("refresh_token");
					if (accessToken && refreshToken) await fetch(`${API_BASE}/auth/logout/`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`
						},
						body: JSON.stringify({ refresh: refreshToken })
					});
				} catch (error) {
					console.error("Falha ao registrar logout no servidor:", error);
				} finally {
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					localStorage.removeItem("linus.state.v2");
					localStorage.removeItem(STORAGE_KEY);
					setState(INITIAL);
					window.location.href = "/";
				}
			},
			setRole: (role) => update({ role }),
			finishPlacement: (placement) => update({
				placement,
				placementDone: true
			}),
			completeLesson: (lessonId, stats) => {
				setState((s) => ({
					...s,
					completedLessons: s.completedLessons.includes(lessonId) ? s.completedLessons : [...s.completedLessons, lessonId],
					badges: s.completedLessons.length + 1 >= 3 && !s.badges.includes("tres-licoes") ? [...s.badges, "tres-licoes"] : s.badges
				}));
				const token = localStorage.getItem("access_token");
				if (token) fetch(`${API_BASE}/learning/aulas/${lessonId}/concluir/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						acertos: stats?.acertos,
						total: stats?.total
					})
				}).then(async (res) => {
					if (!res.ok) return;
					const data = await res.json();
					setState((s) => ({
						...s,
						streak: typeof data.streak === "number" ? data.streak : s.streak,
						completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : s.completedLessons,
						badges: Array.isArray(data.badges) ? data.badges : s.badges
					}));
				}).catch((err) => console.error("Erro ao persistir conclusão da lição:", err));
			},
			registerAnswer: (topic, correct, meta) => {
				setState((s) => {
					const cur = s.errorsByTopic[topic] ?? {
						erros: 0,
						total: 0
					};
					return {
						...s,
						errorsByTopic: {
							...s.errorsByTopic,
							[topic]: {
								erros: cur.erros + (correct ? 0 : 1),
								total: cur.total + 1
							}
						}
					};
				});
				const token = localStorage.getItem("access_token");
				if (token && meta?.exercicioId) fetch(`${API_BASE}/learning/tentativas/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						exercicio: meta.exercicioId,
						acertou: correct,
						resposta: meta.resposta,
						tempo_resposta_ms: meta.tempoRespostaMs ?? 0
					})
				}).then(async (res) => {
					if (!res.ok) return;
					const data = await res.json();
					if (data.errorsByTopic) setState((s) => ({
						...s,
						errorsByTopic: {
							...EMPTY_TOPICS,
							...data.errorsByTopic
						}
					}));
				}).catch((err) => console.error("Erro ao registrar tentativa:", err));
			},
			loseHeart: () => setState((s) => ({
				...s,
				hearts: Math.max(0, s.hearts - 1)
			})),
			refillHearts: () => update({ hearts: 5 }),
			awardBadge: (badge) => setState((s) => s.badges.includes(badge) ? s : {
				...s,
				badges: [...s.badges, badge]
			}),
			resetProgress: () => setState({
				...INITIAL,
				loggedIn: state.loggedIn,
				name: state.name,
				role: state.role
			}),
			recommendedUnitId,
			progressPercent: Math.round(completedValidCount / totalCount * 100),
			weakestTopic: weakest
		};
	}, [
		state,
		ready,
		units,
		allLessons,
		findLessonById,
		refreshCurriculum,
		update
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinusContext.Provider, {
		value,
		children
	});
}
function useLinus() {
	const ctx = (0, import_react.useContext)(LinusContext);
	if (!ctx) throw new Error("useLinus precisa estar dentro de LinusProvider");
	return ctx;
}
//#endregion
export { ROLE_LABEL as n, useLinus as r, LinusProvider as t };
