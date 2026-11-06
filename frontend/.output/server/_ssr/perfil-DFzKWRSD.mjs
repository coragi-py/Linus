import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as jwtDecode } from "../_libs/jwt-decode.mjs";
import { r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { t as lib_exports } from "../_libs/@dicebear/avataaars+[...].mjs";
import { t as createAvatar } from "../_libs/dicebear__core.mjs";
import { B as Eye, V as EyeOff, h as ShieldAlert, i as User, k as Lock, o as TriangleAlert, y as Save, z as FileText } from "../_libs/lucide-react.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as blacklistNicknames } from "./blacklist-BJ_VOC_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-DFzKWRSD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Avatar() {
	const [seed] = (0, import_react.useState)("linus");
	const [options, setOptions] = (0, import_react.useState)({
		skinColor: ["ffdbb4"],
		hairColor: ["2c1b18"],
		top: ["shortCurly"],
		accessories: ["none"],
		mouth: ["smile"],
		eyes: ["default"]
	});
	const avatarUri = (0, import_react.useMemo)(() => {
		try {
			return createAvatar(lib_exports, {
				seed,
				skinColor: options.skinColor,
				hairColor: options.hairColor,
				top: options.top,
				accessories: options.accessories[0] === "none" ? [] : options.accessories,
				accessoriesProbability: options.accessories[0] === "none" ? 0 : 100,
				mouth: options.mouth,
				eyes: options.eyes,
				size: 160,
				radius: 20,
				backgroundColor: ["e2e8f0"]
			}).toDataUri();
		} catch (error) {
			console.error("Erro ao gerar avatar:", error);
			return "";
		}
	}, [seed, options]);
	const handleOptionChange = (key, value) => {
		setOptions((prev) => ({
			...prev,
			[key]: [value]
		}));
	};
	const handleSave = async () => {
		const finalJson = {
			seed,
			...options,
			collection: "avataaars"
		};
		try {
			const token = localStorage.getItem("access_token") || localStorage.getItem("token");
			if ((await fetch("${API_BASE_URL}/api/v1/auth/me/", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ avatar_options: finalJson })
			})).ok) alert("Avatar salvo com sucesso! Atualize a página para ver as mudanças.");
			else alert("Erro ao salvar o avatar.");
		} catch (error) {
			alert("Erro de comunicação com o servidor.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-bold text-foreground mb-1",
				children: "Personalize seu Avatar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-6",
				children: "Escolha como você quer aparecer na plataforma."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-8 items-start bg-muted/30 p-6 rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-shrink-0 w-full md:w-auto flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: avatarUri,
						alt: "Avatar gerado",
						className: "w-48 h-48 rounded-2xl shadow-sm border border-border bg-white"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 w-full space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-muted-foreground mb-2",
								children: "Tom de Pele"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("skinColor", "ffdbb4"),
										className: "w-8 h-8 rounded-full bg-[#ffdbb4] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("skinColor", "edb98a"),
										className: "w-8 h-8 rounded-full bg-[#edb98a] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("skinColor", "d08b5b"),
										className: "w-8 h-8 rounded-full bg-[#d08b5b] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("skinColor", "ae5d29"),
										className: "w-8 h-8 rounded-full bg-[#ae5d29] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("skinColor", "614335"),
										className: "w-8 h-8 rounded-full bg-[#614335] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-muted-foreground mb-2",
								children: "Cor do Cabelo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("hairColor", "2c1b18"),
										className: "w-8 h-8 rounded-full bg-[#2c1b18] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("hairColor", "a55728"),
										className: "w-8 h-8 rounded-full bg-[#a55728] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("hairColor", "b58143"),
										className: "w-8 h-8 rounded-full bg-[#b58143] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("hairColor", "ecdcbf"),
										className: "w-8 h-8 rounded-full bg-[#ecdcbf] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOptionChange("hairColor", "e8e1e1"),
										className: "w-8 h-8 rounded-full bg-[#e8e1e1] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground mb-2",
									children: "Estilo do Cabelo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									onChange: (e) => handleOptionChange("top", e.target.value),
									value: options.top[0],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "shortCurly",
											children: "Curto Encaracolado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "shortFlat",
											children: "Curto Liso"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "shortWaved",
											children: "Curto Ondulado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "bob",
											children: "Corte Bob"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "curvy",
											children: "Longo Curvo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "dreads",
											children: "Dreads"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "frida",
											children: "Coque"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "hat",
											children: "Com Chapéu"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "hijab",
											children: "Hijab"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground mb-2",
									children: "Acessórios"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									onChange: (e) => handleOptionChange("accessories", e.target.value),
									value: options.accessories[0],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "none",
											children: "Nenhum"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "prescription01",
											children: "Óculos de Grau 1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "prescription02",
											children: "Óculos de Grau 2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "round",
											children: "Óculos Redondo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sunglasses",
											children: "Óculos de Sol"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "wayfarers",
											children: "Óculos Wayfarer"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground mb-2",
									children: "Olhos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									onChange: (e) => handleOptionChange("eyes", e.target.value),
									value: options.eyes[0],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "default",
											children: "Padrão"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "happy",
											children: "Feliz"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "surprised",
											children: "Surpreso"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "wink",
											children: "Piscando"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "squint",
											children: "Fechado/Semicerrado"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground mb-2",
									children: "Boca"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									onChange: (e) => handleOptionChange("mouth", e.target.value),
									value: options.mouth[0],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "default",
											children: "Padrão"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "smile",
											children: "Sorriso"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "twinkle",
											children: "Sorriso Largo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "serious",
											children: "Sério"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "screamOpen",
											children: "Surpreso / Grito"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "disbelief",
											children: "Incrédulo"
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSave,
								className: "rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors",
								children: "Salvar Avatar"
							})
						})
					]
				})]
			})
		]
	});
}
var validarNomeApropriado = (nome) => {
	const nomeLower = nome.toLowerCase().trim();
	return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};
var nomeSchema = objectType({ nome: stringType().min(3, "O nome deve ter pelo menos 3 caracteres").refine(validarNomeApropriado, "O nome escolhido contém termos não permitidos.") });
var senhaSchema = objectType({
	senhaAtual: stringType().min(1, "A senha atual é obrigatória"),
	novaSenha: stringType().min(8, "A senha deve ter pelo menos 8 caracteres").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
	confirmaSenha: stringType().min(1, "Confirme sua nova senha")
}).refine((data) => data.novaSenha === data.confirmaSenha, {
	message: "As senhas não coincidem",
	path: ["confirmaSenha"]
});
function PerfilComponent() {
	const { state, login, setRole, logout } = useLinus();
	const [mostrarSenhaAtual, setMostrarSenhaAtual] = (0, import_react.useState)(false);
	const [mostrarNovaSenha, setMostrarNovaSenha] = (0, import_react.useState)(false);
	const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = (0, import_react.useState)(false);
	const [privacyData, setPrivacyData] = (0, import_react.useState)(null);
	const { register: registerNome, handleSubmit: handleNomeSubmit, formState: { errors: nomeErrors, isSubmitting: isNomeSubmitting } } = useForm({
		resolver: u(nomeSchema),
		defaultValues: { nome: state.name }
	});
	const { register: registerSenha, handleSubmit: handleSenhaSubmit, reset: resetSenha, formState: { errors: senhaErrors, isSubmitting: isSenhaSubmitting } } = useForm({
		resolver: u(senhaSchema),
		mode: "onChange"
	});
	(0, import_react.useEffect)(() => {
		const fetchPrivacyData = async () => {
			try {
				const token = localStorage.getItem("access_token");
				const response = await fetch("${API_BASE_URL}/api/v1/auth/privacy/data/", { headers: { Authorization: `Bearer ${token}` } });
				if (response.ok) {
					const data = await response.json();
					setPrivacyData(data);
				}
			} catch (error) {
				console.error("Erro ao buscar dados de privacidade", error);
			}
		};
		fetchPrivacyData();
	}, []);
	const onUpdateNome = async (data) => {
		try {
			const token = localStorage.getItem("access_token");
			const response = await fetch("${API_BASE_URL}/api/v1/auth/profile/update/", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ nome: data.nome })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "Erro ao atualizar perfil.");
			localStorage.setItem("access_token", result.tokens.access);
			const decoded = jwtDecode(result.tokens.access);
			setRole(decoded.role || "estudante");
			login(decoded.nome || data.nome);
			toast.success("Nome atualizado com sucesso!");
		} catch (error) {
			toast.error(error.message);
		}
	};
	const onChangePassword = async (data) => {
		try {
			const token = localStorage.getItem("access_token");
			const response = await fetch("${API_BASE_URL}/api/v1/auth/password/change/", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					old_password: data.senhaAtual,
					new_password: data.novaSenha
				})
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "Erro ao trocar a senha.");
			toast.success("Senha atualizada com segurança.");
			resetSenha();
		} catch (error) {
			toast.error(error.message);
		}
	};
	const onRevokeConsent = async () => {
		if (!window.confirm("Atenção! Ao revogar seu consentimento, sua conta será suspensa e você será desconectado. Deseja continuar?")) return;
		try {
			const token = localStorage.getItem("access_token");
			if (!(await fetch("${API_BASE_URL}/api/v1/auth/privacy/revoke-consent/", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` }
			})).ok) throw new Error("Falha ao revogar consentimento.");
			toast.info("Consentimento revogado. Sua sessão será encerrada.");
			logout();
		} catch (error) {
			toast.error(error.message);
		}
	};
	const onDeleteAccount = async () => {
		if (!window.confirm("AÇÃO IRREVERSÍVEL! Todo o seu progresso será perdido e seus dados pessoais serão anonimizados. Deseja realmente excluir sua conta?")) return;
		try {
			const token = localStorage.getItem("access_token");
			if (!(await fetch("${API_BASE_URL}/api/v1/auth/privacy/delete-account/", {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` }
			})).ok) throw new Error("Falha ao excluir conta.");
			toast.success("Conta e dados pessoais excluídos com sucesso.");
			logout();
		} catch (error) {
			toast.error(error.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
				children: "Configurações da Conta"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Gerencie seus dados pessoais, configurações de segurança e preferências de privacidade."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "geral",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-3 mb-8 h-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "geral",
								className: "flex items-center gap-2 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 hidden sm:block" }), " Perfil"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "seguranca",
								className: "flex items-center gap-2 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 hidden sm:block" }), " Segurança"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "privacidade",
								className: "flex items-center gap-2 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 hidden sm:block" }), " LGPD"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "geral",
						className: "space-y-6 max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: "Informações Pessoais"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mb-6",
								children: "Atualize o nome como você quer ser chamado na plataforma."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleNomeSubmit(onUpdateNome),
								className: "space-y-4 max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold uppercase text-muted-foreground",
										children: "Nome de Exibição"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											...registerNome("nome"),
											className: "w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
										})]
									}),
									nomeErrors.nome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: nomeErrors.nome.message
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: isNomeSubmitting,
									className: "flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
										" ",
										isNomeSubmitting ? "Salvando..." : "Salvar Alterações"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-6 mt-6 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "seguranca",
						className: "space-y-6 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-foreground",
							children: "Alterar Senha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-6",
							children: "Mantenha sua conta segura utilizando uma senha forte."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSenhaSubmit(onChangePassword),
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold uppercase text-muted-foreground",
										children: "Senha Atual"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: mostrarSenhaAtual ? "text" : "password",
												...registerSenha("senhaAtual"),
												className: "w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setMostrarSenhaAtual(!mostrarSenhaAtual),
												className: "absolute right-3 top-2.5 text-muted-foreground",
												children: mostrarSenhaAtual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})
										]
									}),
									senhaErrors.senhaAtual && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: senhaErrors.senhaAtual.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold uppercase text-muted-foreground",
										children: "Nova Senha"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: mostrarNovaSenha ? "text" : "password",
												...registerSenha("novaSenha"),
												className: "w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setMostrarNovaSenha(!mostrarNovaSenha),
												className: "absolute right-3 top-2.5 text-muted-foreground",
												children: mostrarNovaSenha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})
										]
									}),
									senhaErrors.novaSenha && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: senhaErrors.novaSenha.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold uppercase text-muted-foreground",
										children: "Confirmar Nova Senha"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: mostrarConfirmaSenha ? "text" : "password",
												...registerSenha("confirmaSenha"),
												className: "w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setMostrarConfirmaSenha(!mostrarConfirmaSenha),
												className: "absolute right-3 top-2.5 text-muted-foreground",
												children: mostrarConfirmaSenha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})
										]
									}),
									senhaErrors.confirmaSenha && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: senhaErrors.confirmaSenha.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: isSenhaSubmitting,
									className: "flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
										" ",
										isSenhaSubmitting ? "Atualizando..." : "Atualizar Senha"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "privacidade",
						className: "space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: "Direitos do Titular (LGPD)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "De acordo com o Art. 18 da Lei Geral de Proteção de Dados (13.709/2018), você possui total controle sobre as suas informações."
							})] }),
							privacyData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/30 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "flex items-center gap-2 font-bold text-foreground mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), " Registro de Consentimento"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 text-sm sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-semibold uppercase text-muted-foreground",
											children: "E-mail Vinculado"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: privacyData.email
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-semibold uppercase text-muted-foreground",
											children: "Termos Aceitos"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: ["Versão ", privacyData.termos_de_uso.versao]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-semibold uppercase text-muted-foreground",
											children: "Data do Consentimento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: new Intl.DateTimeFormat("pt-BR", {
												dateStyle: "short",
												timeStyle: "short"
											}).format(new Date(privacyData.termos_de_uso.data_aceite))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-semibold uppercase text-muted-foreground",
											children: "IP de Origem"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: privacyData.termos_de_uso.ip_consentimento
										})] })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-6 space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "font-bold text-amber-600 dark:text-amber-400",
										children: "Revogar Consentimento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 max-w-lg",
										children: "Suspende temporariamente o seu acesso à plataforma. Os seus dados continuarão salvos, mas você não poderá fazer login até aceitar os termos novamente."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: onRevokeConsent,
										className: "shrink-0 rounded-lg border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white px-4 py-2 text-sm font-bold transition-colors",
										children: "Revogar Acesso"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
										className: "font-bold text-destructive flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), " Excluir Conta Definitivamente"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 max-w-lg",
										children: "Ação irreversível. Seu progresso será apagado e seus dados pessoais (nome e e-mail) serão anonimizados permanentemente no banco de dados."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: onDeleteAccount,
										className: "shrink-0 rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors",
										children: "Excluir Minha Conta"
									})]
								})]
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { PerfilComponent as component };
