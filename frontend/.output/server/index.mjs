globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/blacklist-B9AJ5w_k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc7-qdxMnQpmGB6OcpwBn4mulX8WMk4\"",
		"mtime": "2026-11-06T23:14:30.653Z",
		"size": 3527,
		"path": "../public/assets/blacklist-B9AJ5w_k.js"
	},
	"/assets/book-open-DQFG8xvM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-JmkBWFyYk8LK1XTbRkOSs+Ra+2Y\"",
		"mtime": "2026-11-06T23:14:30.653Z",
		"size": 279,
		"path": "../public/assets/book-open-DQFG8xvM.js"
	},
	"/assets/AppShell-oGG2USM8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"261dc-BXl8Vywy1HVZ0j7Yh4uyQjujRLg\"",
		"mtime": "2026-11-06T23:14:30.651Z",
		"size": 156124,
		"path": "../public/assets/AppShell-oGG2USM8.js"
	},
	"/assets/check-ywTr2UK0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-GMpEH4be+0Rp3v7ThZkE2/6jC9Y\"",
		"mtime": "2026-11-06T23:14:30.654Z",
		"size": 124,
		"path": "../public/assets/check-ywTr2UK0.js"
	},
	"/assets/card-CzoIl4bL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c75c-4U48UYC6G/M+PrtPhoPHimlQOrg\"",
		"mtime": "2026-11-06T23:14:30.654Z",
		"size": 51036,
		"path": "../public/assets/card-CzoIl4bL.js"
	},
	"/assets/constants-BLEwNEpA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"166-x8TeMaM+pN9qCCxGhOOJqjQixyk\"",
		"mtime": "2026-11-06T23:14:30.654Z",
		"size": 358,
		"path": "../public/assets/constants-BLEwNEpA.js"
	},
	"/assets/button-B_W2-pyB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7aa-hOXfsrFYKi6Cirmw9e06jJrF+u0\"",
		"mtime": "2026-11-06T23:14:30.653Z",
		"size": 1962,
		"path": "../public/assets/button-B_W2-pyB.js"
	},
	"/assets/circle-check-C6VETZJi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-ahdV6RhOue1kuXcDsTpyUAyka58\"",
		"mtime": "2026-11-06T23:14:30.654Z",
		"size": 178,
		"path": "../public/assets/circle-check-C6VETZJi.js"
	},
	"/assets/createLucideIcon-BZ5eRbaK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d7-g/26xvi/vWue4XqxziOynuKv2qM\"",
		"mtime": "2026-11-06T23:14:30.655Z",
		"size": 1239,
		"path": "../public/assets/createLucideIcon-BZ5eRbaK.js"
	},
	"/assets/dist-BaW_fFVi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b74-pR8NRrZz36mRGuwVg2Mx2Yglwc4\"",
		"mtime": "2026-11-06T23:14:30.655Z",
		"size": 19316,
		"path": "../public/assets/dist-BaW_fFVi.js"
	},
	"/assets/dist-COxC0gSI2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b68-od0polQ4UzN7Uu6XQHRO/scjQ8A\"",
		"mtime": "2026-11-06T23:14:30.656Z",
		"size": 2920,
		"path": "../public/assets/dist-COxC0gSI2.js"
	},
	"/assets/dist-BKe0KUZp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"833d-DpNyqr8iHF+cziXUuyMpNUeCDxM\"",
		"mtime": "2026-11-06T23:14:30.655Z",
		"size": 33597,
		"path": "../public/assets/dist-BKe0KUZp.js"
	},
	"/assets/eye-off-DWTt8e6X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae-EapQWGUMOEtigC29OK9XZzk+9Eg\"",
		"mtime": "2026-11-06T23:14:30.657Z",
		"size": 430,
		"path": "../public/assets/eye-off-DWTt8e6X.js"
	},
	"/assets/eye-C3tyjqVz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-Zo4swAd+Cki2PM3dpElhD9k89iU\"",
		"mtime": "2026-11-06T23:14:30.656Z",
		"size": 256,
		"path": "../public/assets/eye-C3tyjqVz.js"
	},
	"/assets/glossario-JchIhScY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f71-6iMdn4zOjCGhjqfNIj4jndHAz9Y\"",
		"mtime": "2026-11-06T23:14:30.657Z",
		"size": 3953,
		"path": "../public/assets/glossario-JchIhScY.js"
	},
	"/assets/file-text-C_uR6ZKF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-MTXvJMtSOPu+nYDmzMH4Yie+z0A\"",
		"mtime": "2026-11-06T23:14:30.657Z",
		"size": 385,
		"path": "../public/assets/file-text-C_uR6ZKF.js"
	},
	"/assets/admin.sistema-BrGaG6Ir.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61315-HhFR5xyL/kfYKDs1LHe18igA9rI\"",
		"mtime": "2026-11-06T23:14:30.652Z",
		"size": 398101,
		"path": "../public/assets/admin.sistema-BrGaG6Ir.js"
	},
	"/assets/GlossaryDiagram-CrAADoyr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"79f-TYN18diwt/56VImRMhAnWmkOtpg\"",
		"mtime": "2026-11-06T23:14:30.651Z",
		"size": 1951,
		"path": "../public/assets/GlossaryDiagram-CrAADoyr.js"
	},
	"/assets/index.esm-D7k8IpLH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d4-7fl5lo4jtwqU9uXUk+KPfT/xKhw\"",
		"mtime": "2026-11-06T23:14:30.657Z",
		"size": 2260,
		"path": "../public/assets/index.esm-D7k8IpLH.js"
	},
	"/assets/jsx-runtime-DE3RlOCf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1edb-++aNIhyKgQeSqFVy8og9djQ1xvw\"",
		"mtime": "2026-11-06T23:14:30.658Z",
		"size": 7899,
		"path": "../public/assets/jsx-runtime-DE3RlOCf.js"
	},
	"/assets/esm-CVYciYkw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"530df-aw9jAzrblqDUjtExums0tq9zik0\"",
		"mtime": "2026-11-06T23:14:30.656Z",
		"size": 340191,
		"path": "../public/assets/esm-CVYciYkw.js"
	},
	"/assets/key-round-Bjv450Z1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"163-7i+Opy/Ey/d7JnXJxfRAax5s5DU\"",
		"mtime": "2026-11-06T23:14:30.658Z",
		"size": 355,
		"path": "../public/assets/key-round-Bjv450Z1.js"
	},
	"/assets/index-B1ObYisf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5775d-rbO0PnG2u/+tdvOacJBaHOXm7NU\"",
		"mtime": "2026-11-06T23:14:30.650Z",
		"size": 358237,
		"path": "../public/assets/index-B1ObYisf.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-18T14:36:27.395Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/layers-DpVgcOAP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a5-Gw0sb1EiFQh9tL5zlxKT0+DZddw\"",
		"mtime": "2026-11-06T23:14:30.658Z",
		"size": 421,
		"path": "../public/assets/layers-DpVgcOAP.js"
	},
	"/assets/lazyRouteComponent-CSVYUyts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e9-2YsCmPMVBjotSqEe6bzSDLU/CFQ\"",
		"mtime": "2026-11-06T23:14:30.658Z",
		"size": 4585,
		"path": "../public/assets/lazyRouteComponent-CSVYUyts.js"
	},
	"/assets/lib-BNvfDXs_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fbe4-1KK24AYziTl3Bw/D4A5zSLO3Z0A\"",
		"mtime": "2026-11-06T23:14:30.659Z",
		"size": 130020,
		"path": "../public/assets/lib-BNvfDXs_.js"
	},
	"/assets/link-DuxlRtFe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5941-oLYXTmcC9i+Ya54dWsb/IjQpHUQ\"",
		"mtime": "2026-11-06T23:14:30.660Z",
		"size": 22849,
		"path": "../public/assets/link-DuxlRtFe.js"
	},
	"/assets/licao._lessonId-Daz-bTg6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"409-ftkjQIyPmFuwqKcw8G+B3KMHTvw\"",
		"mtime": "2026-11-06T23:14:30.659Z",
		"size": 1033,
		"path": "../public/assets/licao._lessonId-Daz-bTg6.js"
	},
	"/assets/licao._lessonId-Dehs1YgJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30f8-tA/bdjKtdNUPhUwCDv8J2QvPdkA\"",
		"mtime": "2026-11-06T23:14:30.659Z",
		"size": 12536,
		"path": "../public/assets/licao._lessonId-Dehs1YgJ.js"
	},
	"/assets/lock-CqFbcApH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-ZHwxOCCeQE6ukt3nyv/tGE67Vx8\"",
		"mtime": "2026-11-06T23:14:30.660Z",
		"size": 206,
		"path": "../public/assets/lock-CqFbcApH.js"
	},
	"/assets/mail-DxqoHGj1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-uNEXo/N2YmDWb8C9xJkbmxAs3pw\"",
		"mtime": "2026-11-06T23:14:30.661Z",
		"size": 213,
		"path": "../public/assets/mail-DxqoHGj1.js"
	},
	"/assets/login-gGWjuYzS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34a8-jFtV7KuNDkAZvvUH0nSTxipH8g0\"",
		"mtime": "2026-11-06T23:14:30.660Z",
		"size": 13480,
		"path": "../public/assets/login-gGWjuYzS.js"
	},
	"/assets/LinusContext-Df1x9a8q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33a1-aCcRiNf7qfmYzu4naLYKIx5XGfM\"",
		"mtime": "2026-11-06T23:14:30.651Z",
		"size": 13217,
		"path": "../public/assets/LinusContext-Df1x9a8q.js"
	},
	"/assets/music-Dqk1GDtg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-rlbKYdcS/BQshhqfQ7CBvOo5VvY\"",
		"mtime": "2026-11-06T23:14:30.661Z",
		"size": 219,
		"path": "../public/assets/music-Dqk1GDtg.js"
	},
	"/assets/painel-kd2CDjGi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146a-8Ej/hq7cAX4v/1dF/mQc6O7m01o\"",
		"mtime": "2026-11-06T23:14:30.661Z",
		"size": 5226,
		"path": "../public/assets/painel-kd2CDjGi.js"
	},
	"/assets/perfil-DUWyuLxl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5133-Zw2m4jwwivWQUOk+yR7RA8ZUGeA\"",
		"mtime": "2026-11-06T23:14:30.662Z",
		"size": 20787,
		"path": "../public/assets/perfil-DUWyuLxl.js"
	},
	"/assets/play-CvG8FuIy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-o+nFlTe62MA18f0UOYIhzD9L6Qc\"",
		"mtime": "2026-11-06T23:14:30.662Z",
		"size": 190,
		"path": "../public/assets/play-CvG8FuIy.js"
	},
	"/assets/pratica-CJe78LnM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2976-Hnot/p1f9d1dto6Eb56nzbVNNB8\"",
		"mtime": "2026-11-06T23:14:30.662Z",
		"size": 10614,
		"path": "../public/assets/pratica-CJe78LnM.js"
	},
	"/assets/react-dom-DzXIxXX_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e06-FEx/L2SrLmibNv61H6cxo7Y71lM\"",
		"mtime": "2026-11-06T23:14:30.663Z",
		"size": 3590,
		"path": "../public/assets/react-dom-DzXIxXX_.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-11-06T23:14:30.662Z",
		"size": 1196,
		"path": "../public/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/recuperar-senha-DGfDUNLM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1539-58cQo1PmYci3m0aLwE7pbquZ750\"",
		"mtime": "2026-11-06T23:14:30.663Z",
		"size": 5433,
		"path": "../public/assets/recuperar-senha-DGfDUNLM.js"
	},
	"/assets/recuperar-senha-DwE_SAB7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56a-MFvsISQ5wlyalVvQGU0DKBJTfNc\"",
		"mtime": "2026-11-06T23:14:30.663Z",
		"size": 1386,
		"path": "../public/assets/recuperar-senha-DwE_SAB7.js"
	},
	"/assets/registro-BJEnkX1u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2be9-q/t2LfOEIxo6P4KhS1qVdaDcFzY\"",
		"mtime": "2026-11-06T23:14:30.664Z",
		"size": 11241,
		"path": "../public/assets/registro-BJEnkX1u.js"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-11-06T23:14:30.664Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/routes-gOks-NhR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a8-AZ3CSyZqcWbCRkIBzKFATf0kiv4\"",
		"mtime": "2026-11-06T23:14:30.664Z",
		"size": 1960,
		"path": "../public/assets/routes-gOks-NhR.js"
	},
	"/assets/save-zysGQ9Y7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-1AJBUC6Y0p73uoTiZjNkjtwFZkw\"",
		"mtime": "2026-11-06T23:14:30.664Z",
		"size": 327,
		"path": "../public/assets/save-zysGQ9Y7.js"
	},
	"/assets/search-D1qQq2Eb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-zjl5gHv8f4EJNtZL89BJ1o90rD0\"",
		"mtime": "2026-11-06T23:14:30.665Z",
		"size": 174,
		"path": "../public/assets/search-D1qQq2Eb.js"
	},
	"/assets/shield-alert-CRSnUvDJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"161-VBij+39LF8BYdjD6/tKTh05Cjx0\"",
		"mtime": "2026-11-06T23:14:30.665Z",
		"size": 353,
		"path": "../public/assets/shield-alert-CRSnUvDJ.js"
	},
	"/assets/tabs-IR7MrHgT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dcc-5RrrYxyN0i9XrHP03H3R1Kaot3Y\"",
		"mtime": "2026-11-06T23:14:30.665Z",
		"size": 3532,
		"path": "../public/assets/tabs-IR7MrHgT.js"
	},
	"/assets/Stave-BquqP0k6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"660-LGko8Zmbrrm1GJLI9aFJ2I11dgQ\"",
		"mtime": "2026-11-06T23:14:30.652Z",
		"size": 1632,
		"path": "../public/assets/Stave-BquqP0k6.js"
	},
	"/assets/styles-BsmY9E9i.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18207-jBXU6TKwZqijlin2d1cFjr0fxIM\"",
		"mtime": "2026-11-06T23:14:30.671Z",
		"size": 98823,
		"path": "../public/assets/styles-BsmY9E9i.css"
	},
	"/assets/trash-2-C4Yh15xY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-UrEBe7UUgWlScN/6ayA5NKtd2S0\"",
		"mtime": "2026-11-06T23:14:30.666Z",
		"size": 328,
		"path": "../public/assets/trash-2-C4Yh15xY.js"
	},
	"/assets/termos-CmuNPXha.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c0f-XeeXE9MiSqbMAuKoe9UYpVdG8kY\"",
		"mtime": "2026-11-06T23:14:30.666Z",
		"size": 11279,
		"path": "../public/assets/termos-CmuNPXha.js"
	},
	"/assets/triagem-Coec5uPc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eaf-P8v0YtMndAikFCmbVZfPwdh9yGI\"",
		"mtime": "2026-11-06T23:14:30.667Z",
		"size": 3759,
		"path": "../public/assets/triagem-Coec5uPc.js"
	},
	"/assets/triangle-alert-DUuOWzrj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-3rbOYeCLYx0VQrLb8yndKROcWlA\"",
		"mtime": "2026-11-06T23:14:30.667Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-DUuOWzrj.js"
	},
	"/assets/trilha-B9Svv0ci.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c79-FIo7CwMY9SuwliJ7b9lTvcWrLTM\"",
		"mtime": "2026-11-06T23:14:30.667Z",
		"size": 3193,
		"path": "../public/assets/trilha-B9Svv0ci.js"
	},
	"/assets/tslib.es6-BbIzMmoM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57e-FhFPM3PeUbEY+kGsD4OWAgrOzb4\"",
		"mtime": "2026-11-06T23:14:30.667Z",
		"size": 1406,
		"path": "../public/assets/tslib.es6-BbIzMmoM.js"
	},
	"/assets/types-I8JoawWo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dbf5-1KwAtzPGQDe84ThvnKf8Mx97eI4\"",
		"mtime": "2026-11-06T23:14:30.668Z",
		"size": 56309,
		"path": "../public/assets/types-I8JoawWo.js"
	},
	"/assets/useMatch-D31RVta7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c1-HhryBHB2Z7Z0OVDMVFvBRpM7clU\"",
		"mtime": "2026-11-06T23:14:30.668Z",
		"size": 705,
		"path": "../public/assets/useMatch-D31RVta7.js"
	},
	"/assets/user-CDnJwOiM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-DnzIzcMd9+9u1s6DAwuIFUyCs5k\"",
		"mtime": "2026-11-06T23:14:30.669Z",
		"size": 196,
		"path": "../public/assets/user-CDnJwOiM.js"
	},
	"/assets/useNavigate-BrsYiHQO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c4-pQilYYwIjKATfuWxJNSW3+bMWrg\"",
		"mtime": "2026-11-06T23:14:30.668Z",
		"size": 964,
		"path": "../public/assets/useNavigate-BrsYiHQO.js"
	},
	"/assets/utils-B6KiDbIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7d-iNkBSvaSyIjvZOzWoTvEa49qwcI\"",
		"mtime": "2026-11-06T23:14:30.669Z",
		"size": 27261,
		"path": "../public/assets/utils-B6KiDbIe.js"
	},
	"/assets/x-BseqGY2W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-qJpDqJ+m5SEwIYtGzCYyYTNylc8\"",
		"mtime": "2026-11-06T23:14:30.670Z",
		"size": 154,
		"path": "../public/assets/x-BseqGY2W.js"
	},
	"/assets/VirtualPiano-BeLx4GeW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1234-RR/crOrtra+ctcZurr9cqXrnGhM\"",
		"mtime": "2026-11-06T23:14:30.652Z",
		"size": 4660,
		"path": "../public/assets/VirtualPiano-BeLx4GeW.js"
	},
	"/assets/zod-PNQoqBGf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7dc9-IJHAAEGfHCC6lVVTgmTzVu1EWEo\"",
		"mtime": "2026-11-06T23:14:30.670Z",
		"size": 32201,
		"path": "../public/assets/zod-PNQoqBGf.js"
	},
	"/assets/vexflow-CcGTPe2B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"111578-0m2NKmokm+xVVfQ6DObLFSfXcRk\"",
		"mtime": "2026-11-06T23:14:30.670Z",
		"size": 1119608,
		"path": "../public/assets/vexflow-CcGTPe2B.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"2871e-j5wdFoKP5k02JbaOKilyK/rOcM0\"",
		"mtime": "2026-10-18T14:36:27.395Z",
		"size": 165662,
		"path": "../public/favicon.ico"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_PAZn8B = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_PAZn8B
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
