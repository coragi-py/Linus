import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recuperar-senha-CtrFUi8g.js
var $$splitComponentImporter = () => import("./recuperar-senha-BtIdXeC1.mjs");
var searchSchema = objectType({
	token: stringType().catch(""),
	email: stringType().catch("")
});
var Route = createFileRoute("/recuperar-senha")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
objectType({
	novaSenha: stringType().min(8, "A senha deve ter pelo menos 8 caracteres").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
	confirmaSenha: stringType().min(1, "Confirme sua senha")
}).refine((data) => data.novaSenha === data.confirmaSenha, {
	message: "As senhas não coincidem",
	path: ["confirmaSenha"]
});
//#endregion
export { Route as t };
