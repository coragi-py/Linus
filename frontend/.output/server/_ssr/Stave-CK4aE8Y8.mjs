import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Voice, i as Renderer, n as Formatter, o as StaveNote, r as Stave, s as Accidental, t as Factory } from "../_libs/vexflow.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Stave-CK4aE8Y8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toVexKey(note) {
	const match = /^([A-Ga-g])([#b]?)(\d)$/.exec(note.trim());
	if (!match) return {
		key: "c/4",
		accidental: null
	};
	const [, letter, acc, octave] = match;
	return {
		key: `${letter.toLowerCase()}${acc || ""}/${octave}`,
		accidental: acc ? acc : null
	};
}
function Stave$1({ data, notes, sequential = true, width = 400, height = 150, scale = 1, clef = "treble", className = "" }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = containerRef.current;
		if (!el) return;
		el.innerHTML = "";
		try {
			if (data) {
				const vf = new Factory({ renderer: {
					elementId: el,
					width: data.width || 400,
					height: data.height || 150
				} });
				const score = vf.EasyScore();
				vf.System().addStave({ voices: [score.voice(score.notes(data.notes))] }).addClef(data.clef).addTimeSignature(data.timeSignature);
				vf.draw();
				return;
			}
			if (notes && notes.length > 0) {
				const renderer = new Renderer(el, Renderer.Backends.SVG);
				renderer.resize(width, height);
				const context = renderer.getContext();
				context.scale(scale, scale);
				const scaledWidth = Math.max(220, Math.floor(width / scale) - 24);
				const stave = new Stave(10, 10, scaledWidth);
				stave.addClef(clef);
				stave.setContext(context).draw();
				const duration = notes.length === 1 ? "w" : "q";
				const staveNotes = [];
				if (sequential) for (const rawNote of notes) {
					const { key, accidental } = toVexKey(rawNote);
					const sn = new StaveNote({
						clef,
						keys: [key],
						duration
					});
					if (accidental) sn.addModifier(new Accidental(accidental), 0);
					staveNotes.push(sn);
				}
				else {
					const parsed = notes.map(toVexKey);
					const sn = new StaveNote({
						clef,
						keys: parsed.map((p) => p.key),
						duration: "w"
					});
					parsed.forEach((p, idx) => {
						if (p.accidental) sn.addModifier(new Accidental(p.accidental), idx);
					});
					staveNotes.push(sn);
				}
				const voice = new Voice({
					numBeats: Math.max(staveNotes.length, 1),
					beatValue: 4
				});
				voice.setStrict(false);
				voice.addTickables(staveNotes);
				new Formatter().joinVoices([voice]).format([voice], Math.max(120, scaledWidth - 70));
				voice.draw(context, stave);
			}
		} catch (error) {
			console.error("Erro ao desenhar a partitura no VexFlow:", error);
		}
	}, [
		data,
		notes,
		sequential,
		width,
		height,
		scale,
		clef
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: `flex justify-center ${className}`
	});
}
//#endregion
export { Stave$1 as t };
