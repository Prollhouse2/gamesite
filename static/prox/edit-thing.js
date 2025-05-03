const iframe = document.querySelector(".tab-iframe.active");
const observer = new MutationObserver((mutationsList) => {
	mutationsList.forEach((mutation) => {
		if (mutation.type === "attributes" && mutation.attributeName === "src") {
			iframe.addEventListener(
				"load",
				() => {
					const initialUrl = iframe.contentWindow.location.href;
					updateGointospace2(initialUrl);
					startURLMonitoring();
				},
				{ once: true },
			);
		}
	});
});

if (iframe) {
	observer.observe(iframe, {
		attributes: true,
		attributeFilter: ["src"],
	});
}

let devToggle = false;
let erudaScriptLoaded = false;
let erudaScriptInjecting = false;

function injectErudaScript(iframeDocument) {
	return new Promise((resolve, reject) => {
		if (erudaScriptLoaded) {
			resolve();
			return;
		}

		if (erudaScriptInjecting) {
			console.warn("Eruda script is already being injected.");
			resolve();
			return;
		}

		erudaScriptInjecting = true;

		const script = iframeDocument.createElement("script");
		script.type = "text/javascript";
		script.src = "https://cdn.jsdelivr.net/npm/eruda";
		script.onload = () => {
			erudaScriptLoaded = true;
			erudaScriptInjecting = false;
			resolve();
		};
		script.onerror = (event) => {
			erudaScriptInjecting = false;
			reject(new Error("Failed to load Eruda script:", event));
		};
		iframeDocument.body.appendChild(script);
	});
}

function injectShowScript(iframeDocument) {
	return new Promise((resolve) => {
		const script = iframeDocument.createElement("script");
		script.type = "text/javascript";
		script.textContent = `
      eruda.init({
        defaults: {
          displaySize: 50,
          transparency: 1,
          theme: 'Material Deep Ocean'
        }
      });
      eruda.show();
      document.currentScript.remove();
    `;
		iframeDocument.body.appendChild(script);
		resolve();
	});
}

function injectHideScript(iframeDocument) {
	return new Promise((resolve) => {
		const script = iframeDocument.createElement("script");
		script.type = "text/javascript";
		script.textContent = `
      eruda.hide();
      document.currentScript.remove();
    `;
		iframeDocument.body.appendChild(script);
		resolve();
	});
}

function inspectelement() {
	const iframe = document.querySelector(".tab-iframe.active");
	if (!iframe || !iframe.contentWindow) {
		console.error(
			"Iframe not found or inaccessible. \\(°□°)/ (This shouldn't happen btw)",
		);
		return;
	}

	const iframeDocument = iframe.contentWindow.document;

	const forbiddenSrcs = ["about:blank", null, "a%60owt8bnalk", "a`owt8bnalk"];
	if (iframe.contentWindow.location.href.includes(forbiddenSrcs)) {
		console.warn("Iframe src is forbidden, skipping.");
		return;
	}

	if (iframe.contentWindow.document.readyState == "loading") {
		console.warn(
			"Iframe has not finished loading, skipping Eruda injection. Be patient, jesus fuck.",
		);
		return;
	}

	injectErudaScript(iframeDocument)
		.then(() => {
			if (!devToggle) {
				injectShowScript(iframeDocument);
			} else {
				injectHideScript(iframeDocument);
			}

			devToggle = !devToggle;
		})
		.catch((error) => {
			console.error("Error injecting Eruda script:", error);
		});

	iframe.contentWindow.addEventListener("unload", () => {
		devToggle = false;
		erudaScriptLoaded = false;
		erudaScriptInjecting = false;
		console.log("Iframe navigation detected, Eruda toggle reset.");
	});
}

inspectelement();
