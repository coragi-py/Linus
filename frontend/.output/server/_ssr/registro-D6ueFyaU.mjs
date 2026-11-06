import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as jwtDecode } from "../_libs/jwt-decode.mjs";
import { r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Eye, E as Mail, V as EyeOff, Z as Calendar, i as User, k as Lock, m as ShieldCheck, w as Music } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as GoogleLogin } from "../_libs/react-oauth__google.mjs";
import { i as stringType, n as numberType, r as objectType, t as booleanType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as blacklistNicknames } from "./blacklist-BJ_VOC_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registro-D6ueFyaU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var manualSchema = objectType({
	email: stringType().email("E-mail inválido"),
	senha: stringType().min(8, "A senha deve ter pelo menos 8 caracteres").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
	confirmaSenha: stringType().min(1, "Confirme sua senha"),
	...regrasBase
}).refine((data) => data.senha === data.confirmaSenha, {
	message: "As senhas não coincidem",
	path: ["confirmaSenha"]
});
var googleSchema = objectType({
	email: stringType().optional(),
	senha: stringType().optional(),
	confirmaSenha: stringType().optional(),
	...regrasBase
});
function RegistroComponent() {
	const navigate = useNavigate();
	const { login, setRole } = useLinus();
	const [termosLidos, setTermosLidos] = (0, import_react.useState)(false);
	const [fluxoGooglePendente, setFluxoGooglePendente] = (0, import_react.useState)(false);
	const [googleIdTokenTemp, setGoogleIdTokenTemp] = (0, import_react.useState)(null);
	const [mostrarSenha, setMostrarSenha] = (0, import_react.useState)(false);
	const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = (0, import_react.useState)(false);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
		resolver: u(fluxoGooglePendente ? googleSchema : manualSchema),
		mode: "onChange",
		defaultValues: { aceiteTermos: false }
	});
	const handleLerTermos = () => {
		setTermosLidos(true);
		toast.info("Termos de Uso visualizados. O aceite foi desbloqueado.");
	};
	const finalizarLogin = (access, refresh, nomeFormulario) => {
		localStorage.setItem("access_token", access);
		if (refresh) localStorage.setItem("refresh_token", refresh);
		const decoded = jwtDecode(access);
		setRole(decoded.role || "estudante");
		login(decoded.nome || nomeFormulario);
		window.location.href = "/painel";
	};
	const handleGoogleSuccess = async (credentialResponse) => {
		const idToken = credentialResponse.credential;
		try {
			const response = await fetch("${API_BASE_URL}/api/v1/auth/google/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id_token: idToken,
					terms_accepted: false,
					terms_version: ""
				})
			});
			const result = await response.json();
			if (response.status === 403 && result.status === "registration_required") {
				setGoogleIdTokenTemp(idToken);
				setFluxoGooglePendente(true);
				toast.warning("Complete as informações de LGPD para finalizar seu cadastro com o Google.");
				return;
			}
			if (response.status === 202 && result.status === "2fa_required") {
				toast.info("Você já possui uma conta com 2FA. Redirecionando para o login...");
				navigate({ to: "/login" });
				return;
			}
			if (response.status === 403 && result.status === "terms_required") {
				toast.warning("Sua conta está suspensa (LGPD). Redirecionando para o login...");
				navigate({ to: "/login" });
				return;
			}
			if (!response.ok) throw new Error(result.error || "Erro na autenticação com Google.");
			if (result.access) {
				toast.success("Login com Google efetuado com sucesso!");
				finalizarLogin(result.access, result.refresh, "Usuário");
			}
		} catch (error) {
			toast.error(error.message || "Erro no processo do Google OAuth.");
		}
	};
	const onSubmit = async (data) => {
		try {
			let response;
			let result = null;
			if (fluxoGooglePendente && googleIdTokenTemp) response = await fetch("${API_BASE_URL}/api/v1/auth/google/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id_token: googleIdTokenTemp,
					name: data.nome,
					ano_nascimento: data.anoNascimento,
					terms_accepted: data.aceiteTermos,
					terms_version: "1.0"
				})
			});
			else response = await fetch("${API_BASE_URL}/api/v1/auth/register/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: data.nome,
					email: data.email,
					password: data.senha,
					ano_nascimento: data.anoNascimento,
					terms_accepted: data.aceiteTermos,
					terms_version: "1.0"
				})
			});
			result = await response.json();
			if (!response.ok) throw new Error(result.error || result.detail || result.email?.[0] || "Erro ao realizar cadastro.");
			if (result.access) {
				toast.success("Cadastro realizado com sucesso! Bem-vindo ao Linus.");
				finalizarLogin(result.access, result.refresh, data.nome);
			}
		} catch (error) {
			toast.error(error.message || "Falha na comunicação com o servidor.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-2xl font-bold text-foreground",
							children: "Criar sua conta no Linus"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Aprenda teoria musical de forma prática e interativa"
						})
					]
				}),
				!fluxoGooglePendente ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleLogin, {
						onSuccess: handleGoogleSuccess,
						onError: () => toast.error("Falha ao conectar com o Google"),
						useOneTap: false
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex py-2 items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-grow border-t border-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-shrink mx-4 text-xs uppercase text-muted-foreground",
							children: "ou cadastro manual"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-grow border-t border-border" })
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-amber-500/10 p-4 border border-amber-500/30 text-sm text-amber-600 dark:text-amber-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Quase lá!" }), " Identificamos sua conta Google, mas precisamos do seu nome, ano de nascimento e aceite dos Termos."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit(onSubmit),
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-muted-foreground",
								children: "Nome de Exibição"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									...register("nome"),
									className: "w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
									placeholder: "Seu nome"
								})]
							}),
							errors.nome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-destructive",
								children: errors.nome.message
							})
						] }),
						!fluxoGooglePendente && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground",
									children: "E-mail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										...register("email"),
										className: "w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
										placeholder: "seu@email.com"
									})]
								}),
								errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.email.message
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground",
									children: "Senha"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: mostrarSenha ? "text" : "password",
											...register("senha"),
											className: "w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
											placeholder: "••••••••"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setMostrarSenha(!mostrarSenha),
											className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground",
											tabIndex: -1,
											children: mostrarSenha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})
									]
								}),
								errors.senha && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.senha.message
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground",
									children: "Confirmar Senha"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: mostrarConfirmaSenha ? "text" : "password",
											...register("confirmaSenha"),
											className: "w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
											placeholder: "••••••••"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setMostrarConfirmaSenha(!mostrarConfirmaSenha),
											className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground",
											tabIndex: -1,
											children: mostrarConfirmaSenha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})
									]
								}),
								errors.confirmaSenha && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.confirmaSenha.message
								})
							] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-muted-foreground",
								children: "Ano de Nascimento"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									...register("anoNascimento", { valueAsNumber: true }),
									className: "w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
									placeholder: "Ex: 2005"
								})]
							}),
							errors.anoNascimento && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-destructive",
								children: errors.anoNascimento.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-muted/40 p-4 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Para prosseguir com o cadastro, você deve ler os nossos",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "/termos",
												onClick: handleLerTermos,
												className: "font-medium text-primary underline hover:text-primary/80",
												target: "_blank",
												rel: "noreferrer",
												children: "Termos de Uso e Política de Privacidade"
											}),
											"."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "aceiteTermos",
										disabled: !termosLidos,
										...register("aceiteTermos"),
										className: "h-4 w-4 rounded border-input text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "aceiteTermos",
										className: `text-xs ${!termosLidos ? "text-muted-foreground/50 cursor-not-allowed" : "text-foreground cursor-pointer"}`,
										children: "Li e concordo com os Termos de Uso (LGPD)"
									})]
								}),
								errors.aceiteTermos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-destructive",
									children: errors.aceiteTermos.message
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isSubmitting,
							className: "w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50",
							children: isSubmitting ? "Processando..." : "Concluir Cadastro"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center text-sm text-muted-foreground",
					children: [
						"Já tem uma conta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-medium text-primary hover:underline",
							children: "Faça login"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RegistroComponent as component };
