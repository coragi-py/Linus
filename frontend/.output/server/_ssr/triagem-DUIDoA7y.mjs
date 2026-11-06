import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as Check } from "../_libs/lucide-react.mjs";
import { t as Stave$1 } from "./Stave-CK4aE8Y8.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as CardContent, t as Card } from "./card-BXjpJ96D.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/triagem-DUIDoA7y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Triagem() {
	const navigate = useNavigate();
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [result, setResult] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const fetchQuestions = async () => {
			try {
				const response = await axios.get("http://127.0.0.1:8000/api/v1/placement/questions/");
				setQuestions(response.data.results || response.data);
			} catch (error) {
				console.error("Erro ao buscar perguntas da triagem:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchQuestions();
	}, []);
	const handleAnswer = async (optionId) => {
		const currentQ = questions[currentIndex];
		const newAnswers = {
			...answers,
			[currentQ.id]: optionId
		};
		setAnswers(newAnswers);
		if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
		else try {
			const response = await axios.post("http://127.0.0.1:8000/api/v1/placement/submit/", { respostas: newAnswers });
			setResult(response.data);
		} catch (error) {
			console.error("Erro ao processar triagem:", error);
		}
	};
	const handleCreateAccount = () => {
		navigate({
			to: "/registro",
			search: { placement_session: result?.sessionKey }
		});
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-[#F4F7F6]",
		children: "Carregando avaliação..."
	});
	if (questions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-[#F4F7F6] p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-bold text-[#2D3748] mb-4",
			children: "Nenhuma pergunta ativa"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => navigate({ to: "/" }),
			variant: "outline",
			children: "Voltar"
		})]
	});
	if (result) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-xl shadow-sm border border-gray-100 rounded-2xl text-center p-8 bg-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 bg-[#06D6A0] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "w-10 h-10 text-[#1E2A38]",
						strokeWidth: 3
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-3xl font-extrabold text-[#2D3748] mb-2",
					children: ["Seu nível: ", result.nivel]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#F8F9FA] border border-gray-200 rounded-xl p-6 text-left mb-8 shadow-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-[#2B6CB0] text-xs font-bold uppercase tracking-wider mb-2",
							children: "Comece por aqui"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold text-[#2D3748] mb-1",
							children: result.modulo_recomendado.titulo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-500 text-sm",
							children: result.modulo_recomendado.descricao
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleCreateAccount,
					className: "w-full rounded-lg bg-[#2B6CB0] hover:bg-[#2B6CB0]/90 text-white text-lg font-bold py-6 shadow-md transition-transform hover:scale-[1.02]",
					children: "Criar conta agora"
				})
			]
		})
	});
	const currentQuestion = questions[currentIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm font-medium text-[#2B6CB0] mb-4 text-center",
				children: [
					"Pergunta ",
					currentIndex + 1,
					" de ",
					questions.length
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-md border-0 rounded-2xl p-6 md:p-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold text-[#2D3748] mb-8 text-center",
							children: currentQuestion.enunciado
						}),
						currentQuestion.tipo === "partitura" && currentQuestion.dados_partitura && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center items-center w-full my-6 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stave$1, {
								data: currentQuestion.dados_partitura,
								className: "w-full max-w-sm mx-auto"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-4",
							children: currentQuestion.opcoes.map((opcao) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => handleAnswer(opcao.id),
								className: "w-full justify-start text-left h-auto py-4 px-6 text-lg rounded-xl border-gray-200 hover:border-[#2B6CB0] hover:bg-[#2B6CB0]/5 whitespace-normal text-gray-700",
								children: opcao.texto
							}, opcao.id))
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { Triagem as component };
