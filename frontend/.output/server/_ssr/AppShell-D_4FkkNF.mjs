import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ROLE_LABEL, r as useLinus } from "./LinusContext-DAkHNv3o.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { _ as Navigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as lib_exports } from "../_libs/@dicebear/avataaars+[...].mjs";
import { t as createAvatar } from "../_libs/dicebear__core.mjs";
import { t as lib_exports$1 } from "../_libs/dicebear__bottts.mjs";
import { A as LoaderCircle, D as LogOut, R as Flame, U as Circle, X as Check, _ as Send, f as Sparkles, g as Settings, q as ChevronRight, t as X } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-D_4FkkNF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LinusLogo({ size = 40 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 64 64",
		role: "img",
		"aria-label": "Logotipo Linus: Lira e Clave de Sol integradas com Teclas de Piano",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "linus-gold",
				x1: "0%",
				y1: "0%",
				x2: "100%",
				y2: "100%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "#FFD700"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "#D4AF37"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "linus-blue",
				x1: "0%",
				y1: "0%",
				x2: "100%",
				y2: "100%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "#1E3A8A"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "#0F172A"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 4 C 45 4, 54 12, 54 26 C 54 42, 44 52, 32 60 C 20 52, 10 42, 10 26 C 10 12, 19 4, 32 4 Z",
				fill: "url(#linus-blue)",
				stroke: "url(#linus-gold)",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "20",
				y1: "20",
				x2: "20",
				y2: "44",
				stroke: "#FFD700",
				strokeWidth: "1",
				opacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "18",
				x2: "24",
				y2: "44",
				stroke: "#FFD700",
				strokeWidth: "1",
				opacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "40",
				y1: "18",
				x2: "40",
				y2: "44",
				stroke: "#FFD700",
				strokeWidth: "1",
				opacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "44",
				y1: "20",
				x2: "44",
				y2: "44",
				stroke: "#FFD700",
				strokeWidth: "1",
				opacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: "translate(18, 44)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "0",
						y: "0",
						width: "5.5",
						height: "12",
						rx: "1",
						fill: "#F8FAFC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "6",
						y: "0",
						width: "5.5",
						height: "12",
						rx: "1",
						fill: "#F8FAFC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "12",
						y: "0",
						width: "5.5",
						height: "12",
						rx: "1",
						fill: "#F8FAFC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "18",
						y: "0",
						width: "5.5",
						height: "12",
						rx: "1",
						fill: "#F8FAFC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "24",
						y: "0",
						width: "5.5",
						height: "12",
						rx: "1",
						fill: "#F8FAFC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "4",
						y: "0",
						width: "3.5",
						height: "7",
						rx: "0.5",
						fill: "#0F172A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "10",
						y: "0",
						width: "3.5",
						height: "7",
						rx: "0.5",
						fill: "#0F172A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "22",
						y: "0",
						width: "3.5",
						height: "7",
						rx: "0.5",
						fill: "#0F172A"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 14c-2.5 0-4.5 2-4.5 4.5 0 2.8 1.8 4.5 3.5 6.2 1.5 1.4 2.5 2.4 2.5 4 0 1.7-1.3 2.8-2.8 2.8-1.3 0-2.3-.7-2.6-1.8 1.2.3 2.4-.3 2.4-1.6 0-1-.8-1.8-1.8-1.8-1.4 0-2.5 1.2-2.5 2.8 0 2.2 1.9 4 4.5 4 3 0 5-2 5-4.8 0-2.2-1.3-3.7-3.2-5.4-1.6-1.5-2.8-2.5-2.8-4.2 0-1.7 1-3 2.2-3 1.1 0 1.9.8 1.9 2 0 1-.5 1.8-1.2 2.7l1.2 1.2c1.5-1.4 2.2-2.8 2.2-4.5 0-2.8-2-4.5-4.5-4.5z",
				fill: "url(#linus-gold)"
			})
		]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var SUGESTOES = ["O que é uma pauta?", "Para que serve a clave de Sol?"];
function AiAssistant({ open, onOpenChange }) {
	const [msgs, setMsgs] = (0, import_react.useState)([{
		from: "linus",
		text: "Olá! Meu caro aluno, sou o Linus. Como posso te auxiliar com os mistérios da Teoria Musical hoje?"
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	async function enviar(texto) {
		const t = texto.trim();
		if (!t || isLoading) return;
		setMsgs((m) => [...m, {
			from: "aluno",
			text: t
		}]);
		setInput("");
		setIsLoading(true);
		try {
			const response = await fetch("${API_BASE_URL}/api/v1/ai/chat/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: t })
			});
			if (!response.ok) throw new Error("Erro na comunicação com o servidor.");
			const data = await response.json();
			setMsgs((m) => [...m, {
				from: "linus",
				text: data.reply
			}]);
		} catch (error) {
			console.error("Erro ao falar com o assistente:", error);
			setMsgs((m) => [...m, {
				from: "linus",
				text: "Ah, meu caro, ocorreu um pequeno contratempo ao consultar minhas antigas partituras. Tente novamente em instantes."
			}]);
		} finally {
			setIsLoading(false);
		}
	}
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col rounded-2xl bg-card shadow-2xl border border-border/60 animate-in fade-in slide-in-from-bottom-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border p-4 bg-background/50 rounded-t-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "size-5 text-gold",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-bold text-foreground",
						children: "Assistente Linus"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenChange(false),
					className: "text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto p-4 text-sm",
				"aria-live": "polite",
				children: [msgs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap shadow-neu-sm", m.from === "linus" ? "bg-background text-foreground border border-border/40" : "ml-auto bg-primary text-primary-foreground"),
					children: m.text
				}, i)), isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs bg-background text-muted-foreground border border-border/40 shadow-neu-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Linus está refletindo..." })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-3 bg-background/30 rounded-b-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex flex-wrap gap-1.5",
					children: SUGESTOES.slice(0, 2).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => enviar(s),
						disabled: isLoading,
						className: "rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50 truncate max-w-[170px] cursor-pointer",
						children: s
					}, s))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-1.5",
					onSubmit: (e) => {
						e.preventDefault();
						enviar(input);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Digite sua dúvida...",
						"aria-label": "Sua dúvida",
						disabled: isLoading,
						className: "h-9 rounded-lg text-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						"aria-label": "Enviar pergunta",
						disabled: isLoading,
						className: "flex items-center justify-center h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-foreground shadow-neu-sm active:translate-y-0.5 disabled:opacity-50 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							className: "size-3.5",
							"aria-hidden": true
						})
					})]
				})]
			})
		]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var NAV = [
	{
		to: "/trilha",
		label: "Trilha",
		roles: ["estudante", "usuario"]
	},
	{
		to: "/pratica",
		label: "Prática Livre",
		roles: ["estudante", "usuario"]
	},
	{
		to: "/glossario",
		label: "Glossário",
		roles: [
			"estudante",
			"usuario",
			"admin-conteudo",
			"admin-sistema",
			"conteudo",
			"sistema"
		]
	},
	{
		to: "/painel",
		label: "Meu Painel",
		roles: ["estudante", "usuario"]
	},
	{
		to: "/admin/conteudo",
		label: "Conteúdo",
		roles: ["admin-conteudo", "conteudo"]
	},
	{
		to: "/admin/sistema",
		label: "Sistema",
		roles: ["admin-sistema", "sistema"]
	}
];
function getHomeByRole(role) {
	if (role === "admin-conteudo" || role === "conteudo") return "/admin/conteudo";
	if (role === "admin-sistema" || role === "sistema") return "/admin/sistema";
	return "/painel";
}
function AppShell({ children }) {
	const { state, ready, logout } = useLinus();
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const [avatarOptions, setAvatarOptions] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const fetchAvatar = async () => {
			if (!state.loggedIn) return;
			try {
				const token = localStorage.getItem("access_token");
				if (!token) return;
				const response = await fetch("${API_BASE_URL}/api/v1/auth/me/", { headers: { Authorization: `Bearer ${token}` } });
				if (response.ok) {
					const data = await response.json();
					if (data.avatar_options && Object.keys(data.avatar_options).length > 0) setAvatarOptions(data.avatar_options);
				}
			} catch (error) {
				console.error("Erro ao buscar avatar", error);
			}
		};
		fetchAvatar();
	}, [state.loggedIn]);
	const avatarUri = (0, import_react.useMemo)(() => {
		try {
			const options = avatarOptions || {
				seed: state.name || "linus",
				collection: "bottts"
			};
			const selectedCollection = options.collection === "avataaars" ? lib_exports : lib_exports$1;
			return createAvatar(selectedCollection, {
				...options,
				accessories: options.accessories?.[0] === "none" ? [] : options.accessories,
				accessoriesProbability: options.accessories?.[0] === "none" ? 0 : 100,
				size: 48,
				radius: 50,
				backgroundColor: ["e2e8f0"]
			}).toDataUri();
		} catch (error) {
			console.error("Erro ao gerar avatar no Header:", error);
			return createAvatar(lib_exports$1, {
				seed: "erro",
				size: 32,
				backgroundColor: ["e2e8f0"]
			}).toDataUri();
		}
	}, [avatarOptions, state.name]);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-background" });
	const isPublicRoute = [
		"/",
		"/triagem",
		"/registro",
		"/login",
		"/recuperar-senha",
		"/termos"
	].includes(pathname);
	if (!state.loggedIn && !isPublicRoute) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		replace: true
	});
	const currentRole = state.role || "usuario";
	const homeRoute = getHomeByRole(currentRole);
	if (state.loggedIn) {
		if (pathname === "/" || pathname === "/login" || pathname === "/registro") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: homeRoute,
			replace: true
		});
		if (pathname === "/painel" && [
			"admin-conteudo",
			"conteudo",
			"admin-sistema",
			"sistema"
		].includes(currentRole)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: homeRoute,
			replace: true
		});
		if (pathname.startsWith("/admin/conteudo") && !["admin-conteudo", "conteudo"].includes(currentRole)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: homeRoute,
			replace: true
		});
		if (pathname.startsWith("/admin/sistema") && !["admin-sistema", "sistema"].includes(currentRole)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: homeRoute,
			replace: true
		});
	}
	if (pathname.startsWith("/licao")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	if (!state.loggedIn && isPublicRoute) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "focus-ring flex items-center gap-2 rounded-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinusLogo, { size: 32 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl font-bold text-primary hidden sm:inline",
						children: "Linus"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "focus-ring rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/5",
						children: "Login"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/registro",
						className: "focus-ring rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm transition-transform active:translate-y-0.5",
						children: "Criar conta"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children })]
	});
	const items = NAV.filter((n) => n.roles.includes(currentRole));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: homeRoute,
							className: "focus-ring flex items-center gap-2 rounded-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinusLogo, { size: 38 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl leading-none text-primary",
								children: "Linus"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"aria-label": "Navegação principal",
							className: "order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:ml-4",
							children: items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								className: "focus-ring whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted",
								activeProps: { className: "bg-primary-soft text-primary" },
								children: n.label
							}, n.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								(currentRole === "estudante" || currentRole === "usuario") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mr-2 hidden items-center gap-3 sm:flex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "neu-sm flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold",
										title: "Ofensiva diária",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
											className: "size-3.5 text-gold",
											"aria-hidden": true
										}), state.streak || 0]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setAiOpen(true),
									className: "focus-ring flex items-center gap-1.5 rounded-lg bg-gold px-3 py-2 text-sm font-bold text-gold-foreground shadow-neu-sm active:translate-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										className: "size-4",
										"aria-hidden": true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Assistente"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1 ml-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
										className: "focus-ring flex items-center gap-2 rounded-lg p-1.5 outline-none transition-colors hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hidden flex-col items-end md:flex",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase text-primary/70",
												children: currentRole === "usuario" ? "ALUNO" : ROLE_LABEL?.[currentRole] || currentRole.replace("-", " ")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold leading-tight truncate max-w-[120px]",
												children: state.name ? state.name.split(" ")[0] : "Usuário"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: avatarUri,
											alt: "Avatar",
											className: "size-16 rounded-full border border-primary/20 bg-background shadow-sm"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "end",
										className: "w-56 font-sans",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
												className: "font-bold",
												children: "Minha Conta"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/perfil",
													className: "flex cursor-pointer items-center gap-2 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "Perfil e Privacidade"
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: logout,
												className: "flex cursor-pointer items-center gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: "Sair do sistema"
												})]
											})
										]
									})] })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-16 border-t border-border py-8 text-center text-xs text-muted-foreground",
				children: "Linus — teoria musical para todas as idades."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiAssistant, {
				open: aiOpen,
				onOpenChange: setAiOpen
			})
		]
	});
}
function SectionTitle({ eyebrow, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8",
		children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-sm font-bold uppercase tracking-wide text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: cn("font-display text-3xl sm:text-4xl"),
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { Input as n, SectionTitle as r, AppShell as t };
