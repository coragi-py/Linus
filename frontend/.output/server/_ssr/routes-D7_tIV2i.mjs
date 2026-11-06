import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as VirtualPiano } from "./VirtualPiano-Cg3q8JcN.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D7_tIV2i.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	const handleStartTrail = () => {
		navigate({ to: "/triagem" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F4F7F6] flex flex-col relative overflow-x-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none",
			style: { backgroundImage: "url('/hero-bg.jpg')" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 flex flex-col items-center pt-20 pb-24 px-4 relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-4xl mx-auto mb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-5xl font-extrabold text-[#2D3748] mb-8 leading-tight",
						children: "Aprenda teoria musical na prática com o Linus!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl text-gray-700 mb-6 max-w-2xl mx-auto",
						children: "Explore partituras, escalas e modos gregos com exercícios interativos, piano virtual e feedback imediato."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-gray-500 mb-10 max-w-2xl mx-auto",
						children: "Descubra seu nível, avance no seu ritmo e transforme conceitos musicais em prática."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleStartTrail,
						className: "rounded-lg bg-[#06D6A0] hover:bg-[#06D6A0]/90 text-[#2D3748] text-xl font-bold px-10 py-7 shadow-lg transition-transform hover:scale-105",
						children: "Descobrir meu nível"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "w-full max-w-5xl mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-extrabold text-[#2D3748]",
						children: "Experimente a prática livre"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-500 mt-2 text-lg",
						children: "Use o teclado do seu computador ou clique nas teclas virtuais."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualPiano, {})
				})]
			})]
		})]
	});
}
//#endregion
export { Home as component };
