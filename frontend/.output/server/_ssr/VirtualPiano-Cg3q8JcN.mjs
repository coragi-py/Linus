import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VirtualPiano-Cg3q8JcN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NOTE_NAMES_PT = {
	C: "Dó",
	"C#": "Dó sustenido",
	D: "Ré",
	"D#": "Ré sustenido",
	E: "Mi",
	F: "Fá",
	"F#": "Fá sustenido",
	G: "Sol",
	"G#": "Sol sustenido",
	A: "Lá",
	"A#": "Lá sustenido",
	B: "Si"
};
var CHROMATIC = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];
/** Mapeamento de teclas físicas: Q=C3 ... até a segunda oitava */
var KEY_ROW = [
	"q",
	"2",
	"w",
	"3",
	"e",
	"r",
	"5",
	"t",
	"6",
	"y",
	"7",
	"u",
	"i",
	"9",
	"o",
	"0",
	"p",
	"z",
	"s",
	"x",
	"d",
	"c",
	"v",
	"g"
];
/** Teclado de 2 oitavas: C3 até B4 */
var PIANO_KEYS = Array.from({ length: 24 }, (_, i) => {
	const pitch = CHROMATIC[i % 12];
	const octave = 3 + Math.floor(i / 12);
	return {
		note: `${pitch}${octave}`,
		vex: `${pitch.toLowerCase()}/${octave}`,
		label: NOTE_NAMES_PT[pitch],
		keyboard: KEY_ROW[i],
		isBlack: pitch.includes("#"),
		octave
	};
});
var KEY_TO_NOTE = PIANO_KEYS.reduce((acc, k) => {
	acc[k.keyboard] = k.note;
	return acc;
}, {});
function noteLabelPt(note) {
	const pitch = note.slice(0, -1);
	return NOTE_NAMES_PT[pitch] ?? pitch;
}
var tone = null;
var synth = null;
var starting = null;
async function initAudio() {
	if (typeof window === "undefined") return;
	if (synth) {
		if (tone && tone.getContext().state !== "running") await tone.start();
		return;
	}
	if (starting) return starting;
	starting = (async () => {
		tone = await import("../_libs/tone.mjs").then((n) => n.t);
		tone.getContext().lookAhead = .01;
		await tone.start();
		synth = new tone.PolySynth(tone.Synth, {
			oscillator: { type: "triangle" },
			envelope: {
				attack: .005,
				decay: .15,
				sustain: .35,
				release: .6
			}
		}).toDestination();
		synth.volume.value = -8;
	})();
	return starting;
}
function noteOn(note) {
	if (!synth) return;
	try {
		synth.triggerAttackRelease(note, "8n");
	} catch (e) {
		console.warn("Falha ao acionar nota:", e);
	}
}
function noteOff(note) {
	if (!synth) return;
	try {
		synth.triggerRelease(note);
	} catch (_e) {}
}
async function playNote(note, duration = "8n") {
	await initAudio();
	synth?.triggerAttackRelease(note, duration);
}
async function playSequence(notes, gap = .45) {
	await initAudio();
	if (!tone || !synth) return;
	const now = tone.now();
	notes.forEach((n, i) => synth.triggerAttackRelease(n, gap * .9, now + i * gap));
}
async function playFeedback(correct) {
	await initAudio();
	if (!tone || !synth) return;
	const now = tone.now();
	(correct ? [
		"E5",
		"G5",
		"C6"
	] : ["E3", "C3"]).forEach((n, i) => synth.triggerAttackRelease(n, .14, now + i * .08));
}
/** Piano virtual de 2 oitavas (C3–B4) com mapeamento de teclado físico. */
function VirtualPiano({ onNoteOn, highlight = [], showKeyboardHints = true, compact = false }) {
	const [active, setActive] = (0, import_react.useState)([]);
	const press = (0, import_react.useCallback)((note) => {
		setActive((a) => a.includes(note) ? a : [...a, note]);
		initAudio().then(() => noteOn(note));
		onNoteOn?.(note);
	}, [onNoteOn]);
	const release = (0, import_react.useCallback)((note) => {
		setActive((a) => a.filter((n) => n !== note));
		noteOff(note);
	}, []);
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
			const target = e.target;
			if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
			const note = KEY_TO_NOTE[e.key.toLowerCase()];
			if (note) {
				e.preventDefault();
				press(note);
			}
		};
		const up = (e) => {
			const note = KEY_TO_NOTE[e.key.toLowerCase()];
			if (note) release(note);
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, [press, release]);
	const whites = PIANO_KEYS.filter((k) => !k.isBlack);
	const whiteW = 100 / whites.length;
	const h = compact ? 130 : 180;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "neu-inset w-full p-3 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full select-none",
			style: { height: h },
			children: [whites.map((k, i) => {
				const isActive = active.includes(k.note);
				const isHint = highlight.includes(k.note);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-label": `${k.label} ${k.octave}`,
					onPointerDown: () => press(k.note),
					onPointerUp: () => release(k.note),
					onPointerCancel: () => release(k.note),
					onPointerLeave: () => isActive && release(k.note),
					className: cn("focus-ring absolute bottom-0 top-0 flex flex-col items-center justify-end gap-1 rounded-b-lg border border-border bg-card pb-2 transition-[transform,background-color] duration-75", isActive && "translate-y-[3px] bg-primary-soft", isHint && !isActive && "bg-accent"),
					style: {
						left: `${i * whiteW}%`,
						width: `calc(${whiteW}% - 3px)`
					},
					children: [showKeyboardHints && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground",
						children: k.keyboard
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold text-muted-foreground sm:text-xs",
						children: k.label.split(" ")[0]
					})]
				}, k.note);
			}), PIANO_KEYS.filter((k) => k.isBlack).map((k) => {
				const whiteIndex = whites.findIndex((w) => w.octave === k.octave && w.note[0] === k.note[0]);
				const isActive = active.includes(k.note);
				const isHint = highlight.includes(k.note);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `${k.label} ${k.octave}`,
					onPointerDown: () => press(k.note),
					onPointerUp: () => release(k.note),
					onPointerCancel: () => release(k.note),
					onPointerLeave: () => isActive && release(k.note),
					className: cn("focus-ring absolute top-0 z-10 flex items-end justify-center rounded-b-lg bg-foreground pb-1.5 transition-[transform,background-color] duration-75", isActive && "translate-y-[3px] bg-primary", isHint && !isActive && "bg-primary/80"),
					style: {
						left: `calc(${(whiteIndex + 1) * whiteW}% - ${whiteW * .3}%)`,
						width: `${whiteW * .6}%`,
						height: h * .62
					},
					children: showKeyboardHints && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] font-bold uppercase text-background",
						children: k.keyboard
					})
				}, k.note);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center text-xs text-muted-foreground",
			"aria-live": "polite",
			children: active.length > 0 ? `Tocando: ${active.map((n) => `${noteLabelPt(n)} ${n.slice(-1)}`).join(", ")}` : "Use o mouse ou o teclado do computador para tocar."
		})]
	});
}
//#endregion
export { playSequence as a, playNote as i, noteLabelPt as n, playFeedback as r, VirtualPiano as t };
