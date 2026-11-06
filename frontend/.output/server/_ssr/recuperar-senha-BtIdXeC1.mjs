import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Eye, F as KeyRound, V as EyeOff, h as ShieldAlert, k as Lock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as Route } from "./recuperar-senha-CtrFUi8g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recuperar-senha-BtIdXeC1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var novaSenhaSchema = objectType({
	novaSenha: stringType().min(8, "A senha deve ter pelo menos 8 caracteres").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
	confirmaSenha: stringType().min(1, "Confirme sua senha")
}).refine((data) => data.novaSenha === data.confirmaSenha, {
	message: "As senhas não coincidem",
	path: ["confirmaSenha"]
});
function RecuperarSenhaComponent() {
	const { token, email } = Route.useSearch();
	const navigate = useNavigate();
	const [mostrarSenha, setMostrarSenha] = (0, import_react.useState)(false);
	const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = (0, import_react.useState)(false);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
		resolver: u(novaSenhaSchema),
		mode: "onChange"
	});
	if (!token || !email) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mx-auto h-12 w-12 text-destructive" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-2xl font-bold text-foreground",
					children: "Link de Segurança Inválido"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Este link de recuperação está incompleto ou inválido. Por favor, solicite a redefinição de senha novamente."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/login" }),
					className: "mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90",
					children: "Voltar para o Login"
				})
			]
		})
	});
	const onSubmit = async (data) => {
		try {
			const response = await fetch("${API_BASE_URL}/api/v1/auth/password-reset/confirm/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					token,
					new_password: data.novaSenha
				})
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || result.detail || "Erro ao redefinir a senha.");
			toast.success("Senha redefinida com sucesso! Faça login para continuar.");
			navigate({ to: "/login" });
		} catch (error) {
			toast.error(error.message || "Falha na comunicação com o servidor.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-2xl font-bold text-foreground",
						children: "Definir Nova Senha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Crie uma nova senha forte para a conta associada a ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: email
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit(onSubmit),
				className: "space-y-4",
				children: [
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
									type: mostrarSenha ? "text" : "password",
									...register("novaSenha"),
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
						errors.novaSenha && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.novaSenha.message
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
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: isSubmitting,
						className: "w-full rounded-lg bg-primary py-2.5 mt-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50",
						children: isSubmitting ? "Redefinindo..." : "Salvar Nova Senha"
					})
				]
			})]
		})
	});
}
//#endregion
export { RecuperarSenhaComponent as component };
