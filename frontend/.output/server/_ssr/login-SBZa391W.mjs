import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as jwtDecode } from "../_libs/jwt-decode.mjs";
import { r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Mail, F as KeyRound, O as LogIn, h as ShieldAlert, k as Lock, m as ShieldCheck, nt as ArrowLeft, w as Music } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as GoogleLogin } from "../_libs/react-oauth__google.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-SBZa391W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var loginSchema = objectType({
	email: stringType().email("E-mail inválido"),
	password: stringType().min(1, "A senha é obrigatória")
});
var otpSchema = objectType({ otp: stringType().length(6, "O código de segurança deve ter exatamente 6 dígitos") });
var esqueciSenhaSchema = objectType({ email: stringType().email("E-mail inválido") });
function LoginComponent() {
	const navigate = useNavigate();
	const { login, setRole } = useLinus();
	const [etapa, setEtapa] = (0, import_react.useState)("login");
	const [loginTemporario, setLoginTemporario] = (0, import_react.useState)(null);
	const [termosLidos, setTermosLidos] = (0, import_react.useState)(false);
	const [aceiteTermos, setAceiteTermos] = (0, import_react.useState)(false);
	const [isTermosSubmitting, setIsTermosSubmitting] = (0, import_react.useState)(false);
	const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors, isSubmitting: isLoginSubmitting } } = useForm({ resolver: u(loginSchema) });
	const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors, isSubmitting: isOtpSubmitting } } = useForm({ resolver: u(otpSchema) });
	const { register: registerEsqueciSenha, handleSubmit: handleEsqueciSenhaSubmit, reset: resetEsqueciSenha, formState: { errors: esqueciSenhaErrors, isSubmitting: isEsqueciSenhaSubmitting } } = useForm({ resolver: u(esqueciSenhaSchema) });
	const finalizarLoginComSucesso = (access, refresh) => {
		localStorage.setItem("access_token", access);
		if (refresh) localStorage.setItem("refresh_token", refresh);
		const decoded = jwtDecode(access);
		const userRole = decoded.role || "estudante";
		setRole(userRole);
		login(decoded.nome || "Usuário");
		toast.success("Acesso liberado com sucesso!");
		if (userRole === "admin-conteudo" || userRole === "conteudo") window.location.href = "/admin/conteudo";
		else if (userRole === "admin-sistema" || userRole === "sistema") window.location.href = "/admin/sistema";
		else window.location.href = "/painel";
	};
	const handleLerTermos = () => {
		setTermosLidos(true);
		toast.info("Termos de Uso visualizados. O aceite foi desbloqueado.");
	};
	const onLogin = async (data) => {
		try {
			const response = await fetch("${API_BASE_URL}/api/v1/auth/login/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: data.email,
					password: data.password,
					terms_accepted: false,
					terms_version: ""
				})
			});
			const result = await response.json();
			if (response.status === 403 && result.status === "terms_required") {
				setLoginTemporario({
					email: data.email,
					password: data.password
				});
				setEtapa("termos");
				toast.warning("Sua conta está suspensa devido à revogação dos termos.");
				return;
			}
			if (response.status === 202 && result.status === "2fa_required") {
				setLoginTemporario({ email: data.email });
				setEtapa("2fa");
				toast.info("Código de segurança enviado para o seu e-mail.");
				return;
			}
			if (!response.ok) throw new Error(result.error || result.detail || "Credenciais inválidas.");
			finalizarLoginComSucesso(result.access, result.refresh);
		} catch (error) {
			toast.error(error.message || "Falha na comunicação com o servidor.");
		}
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
				navigate({ to: "/registro" });
				return;
			}
			if (response.status === 403 && result.status === "terms_required") {
				setLoginTemporario({ googleToken: idToken });
				setEtapa("termos");
				toast.warning("Sua conta está suspensa devido à revogação dos termos.");
				return;
			}
			if (response.status === 202 && result.status === "2fa_required") {
				const decodedGoogle = jwtDecode(idToken);
				setLoginTemporario({ email: decodedGoogle.email });
				setEtapa("2fa");
				toast.info("Código de segurança enviado para o e-mail Google.");
				return;
			}
			if (!response.ok) throw new Error(result.error || "Falha na autenticação com o Google.");
			finalizarLoginComSucesso(result.access, result.refresh);
		} catch (error) {
			toast.error(error.message || "Erro ao processar o login com o Google.");
		}
	};
	const onReaceitarTermos = async (e) => {
		e.preventDefault();
		if (!termosLidos || !aceiteTermos) {
			toast.error("Você deve ler e concordar com os Termos de Uso.");
			return;
		}
		setIsTermosSubmitting(true);
		try {
			let response;
			if (loginTemporario?.googleToken) response = await fetch("${API_BASE_URL}/api/v1/auth/google/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id_token: loginTemporario.googleToken,
					terms_accepted: true,
					terms_version: "1.0"
				})
			});
			else response = await fetch("${API_BASE_URL}/api/v1/auth/login/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: loginTemporario?.email,
					password: loginTemporario?.password,
					terms_accepted: true,
					terms_version: "1.0"
				})
			});
			const result = await response.json();
			if (response.status === 202 && result.status === "2fa_required") {
				setEtapa("2fa");
				toast.info("Código de segurança enviado para o seu e-mail.");
				return;
			}
			if (!response.ok) throw new Error(result.error || "Erro ao reativar conta.");
			finalizarLoginComSucesso(result.access, result.refresh);
		} catch (error) {
			toast.error(error.message || "Falha ao reativar acesso.");
		} finally {
			setIsTermosSubmitting(false);
		}
	};
	const onVerify2FA = async (data) => {
		try {
			const response = await fetch("${API_BASE_URL}/api/v1/auth/verify-2fa/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: loginTemporario?.email,
					otp: data.otp
				})
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "Código inválido ou expirado.");
			finalizarLoginComSucesso(result.access, result.refresh);
		} catch (error) {
			toast.error(error.message || "Falha ao verificar código de segurança.");
		}
	};
	const onEsqueciSenha = async (data) => {
		try {
			const response = await fetch("${API_BASE_URL}/api/v1/auth/password-reset/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: data.email })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || result.detail || "Erro ao solicitar recuperação.");
			toast.success(result.message || "Link enviado com sucesso.");
			setEtapa("login");
			resetEsqueciSenha();
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
							children: [
								etapa === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-6 w-6" }),
								etapa === "2fa" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" }),
								etapa === "esqueci_senha" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-6 w-6" }),
								etapa === "termos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 font-display text-2xl font-bold text-foreground",
							children: [
								etapa === "login" && "Acesse sua conta",
								etapa === "2fa" && "Autenticação em Duas Etapas",
								etapa === "esqueci_senha" && "Recuperar Senha",
								etapa === "termos" && "Conta Suspensa (LGPD)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								etapa === "login" && "Continue sua jornada musical no Linus",
								etapa === "2fa" && `Enviamos um código de 6 dígitos para o e-mail associado.`,
								etapa === "esqueci_senha" && "Digite seu e-mail para receber instruções.",
								etapa === "termos" && "Como você revogou o consentimento anteriormente, precisamos que você concorde com os Termos de Uso novamente para restaurar seu acesso."
							]
						})
					]
				}),
				etapa === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleLogin, {
							onSuccess: handleGoogleSuccess,
							onError: () => toast.error("Falha"),
							useOneTap: false
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-grow border-t border-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-4 flex-shrink text-xs uppercase text-muted-foreground",
								children: "ou login manual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-grow border-t border-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleLoginSubmit(onLogin),
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold uppercase text-muted-foreground",
									children: "E-mail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										...registerLogin("email"),
										className: "w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary",
										placeholder: "seu@email.com"
									})]
								}),
								loginErrors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: loginErrors.email.message
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold uppercase text-muted-foreground",
										children: "Senha"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setEtapa("esqueci_senha"),
										className: "text-xs font-medium text-primary hover:underline",
										children: "Esqueceu a senha?"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										...registerLogin("password"),
										className: "w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary",
										placeholder: "••••••••"
									})]
								}),
								loginErrors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: loginErrors.password.message
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isLoginSubmitting,
								className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
								children: isLoginSubmitting ? "Autenticando..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), " Entrar"] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center text-sm text-muted-foreground",
						children: [
							"Ainda não tem uma conta?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/registro",
								className: "font-medium text-primary hover:underline",
								children: "Cadastre-se grátis"
							})
						]
					})
				] }),
				etapa === "termos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onReaceitarTermos,
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/40 p-4 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Para restaurar seu acesso, leia nossos",
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								id: "aceiteTermos",
								disabled: !termosLidos,
								checked: aceiteTermos,
								onChange: (e) => setAceiteTermos(e.target.checked),
								className: "h-4 w-4 rounded border-input text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "aceiteTermos",
								className: `text-xs ${!termosLidos ? "text-muted-foreground/50 cursor-not-allowed" : "text-foreground cursor-pointer"}`,
								children: "Li e concordo novamente com os Termos de Uso (LGPD)"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isTermosSubmitting || !aceiteTermos,
							className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50",
							children: isTermosSubmitting ? "Processando..." : "Reativar Minha Conta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEtapa("login"),
							className: "w-full rounded-lg border border-input bg-background py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted",
							children: "Voltar para o Login"
						})]
					})]
				}),
				etapa === "2fa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleOtpSubmit(onVerify2FA),
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-center text-xs font-semibold uppercase text-muted-foreground",
							children: "Código de Segurança"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-2 flex justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "absolute left-4 top-3 h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								maxLength: 6,
								autoComplete: "one-time-code",
								...registerOtp("otp"),
								className: "w-full rounded-lg border border-input bg-background py-3 pl-12 pr-4 text-center text-xl font-bold tracking-[0.5em] text-foreground focus:ring-2 focus:ring-primary",
								placeholder: "000000"
							})]
						}),
						otpErrors.otp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-xs text-destructive",
							children: otpErrors.otp.message
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isOtpSubmitting,
							className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50",
							children: isOtpSubmitting ? "Verificando..." : "Validar Código"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEtapa("login"),
							className: "w-full rounded-lg border border-input bg-background py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted",
							children: "Cancelar"
						})]
					})]
				}),
				etapa === "esqueci_senha" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleEsqueciSenhaSubmit(onEsqueciSenha),
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase text-muted-foreground",
							children: "E-mail cadastrado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								...registerEsqueciSenha("email"),
								className: "w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary",
								placeholder: "seu@email.com"
							})]
						}),
						esqueciSenhaErrors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: esqueciSenhaErrors.email.message
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isEsqueciSenhaSubmitting,
							className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50",
							children: isEsqueciSenhaSubmitting ? "Processando..." : "Enviar link de recuperação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setEtapa("login");
								resetEsqueciSenha();
							},
							className: "flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar para o Login"]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { LoginComponent as component };
