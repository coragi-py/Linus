import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Renderer, n as Formatter, o as StaveNote, r as Stave, s as Accidental } from "../_libs/vexflow.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlossaryDiagram-AwwHRgox.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlossaryDiagram({ diagram }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!containerRef.current) return;
		containerRef.current.innerHTML = "";
		const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
		renderer.resize(200, 100);
		const context = renderer.getContext();
		context.scale(1.4, 1.4);
		context.setFillStyle("#2B6CB0");
		context.setStrokeStyle("#2B6CB0");
		const stave = new Stave(15, -25, 120);
		stave.setContext(context);
		stave.getContext()?.setFillStyle("#2B6CB0").setStrokeStyle("#2B6CB0");
		if ([
			"treble",
			"bass",
			"alto",
			"tenor",
			"percussion"
		].includes(diagram)) stave.addClef(diagram).draw();
		else if (diagram.startsWith("time-")) stave.addTimeSignature({
			"time-4/4": "4/4",
			"time-3/4": "3/4",
			"time-2/4": "2/4",
			"time-6/8": "6/8",
			"time-c": "C",
			"time-cut": "C|"
		}[diagram]).draw();
		else if ([
			"whole",
			"half",
			"quarter",
			"eighth",
			"sixteenth",
			"thirtysecond",
			"sixtyfourth"
		].includes(diagram)) {
			stave.draw();
			const note = new StaveNote({
				keys: ["b/4"],
				duration: {
					whole: "w",
					half: "h",
					quarter: "q",
					eighth: "8",
					sixteenth: "16",
					thirtysecond: "32",
					sixtyfourth: "64"
				}[diagram]
			});
			note.setStyle({
				fillStyle: "#2B6CB0",
				strokeStyle: "#2B6CB0"
			});
			Formatter.FormatAndDraw(context, stave, [note]);
		} else if ([
			"whole-rest",
			"half-rest",
			"quarter-rest",
			"eighth-rest",
			"sixteenth-rest",
			"thirtysecond-rest",
			"sixtyfourth-rest"
		].includes(diagram)) {
			stave.draw();
			const note = new StaveNote({
				keys: ["b/4"],
				duration: {
					"whole-rest": "wr",
					"half-rest": "hr",
					"quarter-rest": "qr",
					"eighth-rest": "8r",
					"sixteenth-rest": "16r",
					"thirtysecond-rest": "32r",
					"sixtyfourth-rest": "64r"
				}[diagram]
			});
			note.setStyle({
				fillStyle: "#2B6CB0",
				strokeStyle: "#2B6CB0"
			});
			Formatter.FormatAndDraw(context, stave, [note]);
		} else if ([
			"sharp",
			"flat",
			"natural",
			"doublesharp",
			"doubleflat"
		].includes(diagram)) {
			stave.draw();
			const note = new StaveNote({
				keys: ["b/4"],
				duration: "q"
			}).addModifier(new Accidental({
				sharp: "#",
				flat: "b",
				natural: "n",
				doublesharp: "##",
				doubleflat: "bb"
			}[diagram]));
			note.setStyle({
				fillStyle: "#2B6CB0",
				strokeStyle: "#2B6CB0"
			});
			Formatter.FormatAndDraw(context, stave, [note]);
		} else stave.draw();
	}, [diagram]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "flex h-32 w-full items-center justify-center"
	});
}
//#endregion
export { GlossaryDiagram as t };
