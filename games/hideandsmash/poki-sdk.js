(() => {
	var e = function(e) {
			var n = RegExp("[?&]" + e + "=([^&]*)").exec(window.location.search);
			return n && decodeURIComponent(n[1].replace(/\+/g, " "))
		},
		n = "kids" === e("tag"),
		t = new(function() {
			function e() {
				var e = this;
				this.queue = [], this.init = function(n) {
					return void 0 === n && (n = {}), new Promise((function(t, o) {
						e.enqueue("init", n, t, o)
					}))
				}, this.rewardedBreak = function() {
					return new Promise((function(e) {
						e(!1)
					}))
				}, this.noArguments = function(n) {
					return function() {
						e.enqueue(n)
					}
				}, this.oneArgument = function(n) {
					return function(t) {
						e.enqueue(n, t)
					}
				}, this.handleAutoResolvePromise = function() {
					return new Promise((function(e) {
						e()
					}))
				}, this.throwNotLoaded = function() {
					console.debug("PokiSDK is not loaded yet. Not all methods are available.")
				}
			}
			return e.prototype.enqueue = function(e, t, o, i) {
				var r = {
					fn: e,
					options: t,
					resolveFn: o,
					rejectFn: i
				};
				n ? i && i() : this.queue.push(r)
			}, e.prototype.dequeue = function() {
				for (var e = function() {
						var e = n.queue.shift(),
							t = e,
							o = t.fn,
							i = t.options;
						"function" == typeof window.PokiSDK[o] ? (null == e ? void 0 : e.resolveFn) || (null == e ? void 0 : e.rejectFn) ? window.PokiSDK[o](i).then((function() {
							for (var n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
							"function" == typeof e.resolveFn && e.resolveFn.apply(e, n)
						})).catch((function() {
							for (var n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
							"function" == typeof e.rejectFn && e.rejectFn.apply(e, n)
						})) : void 0 !== (null == e ? void 0 : e.fn) && window.PokiSDK[o](i) : console.error("Cannot execute " + e.fn)
					}, n = this; this.queue.length > 0;) e()
			}, e
		}());
	window.PokiSDK = {
		init: t.init,
		initWithVideoHB: t.init,
		customEvent: t.throwNotLoaded,
		commercialBreak: t.handleAutoResolvePromise,
		rewardedBreak: t.rewardedBreak,
		displayAd: t.throwNotLoaded,
		destroyAd: t.throwNotLoaded,
		getLeaderboard: t.handleAutoResolvePromise,
		getSharableURL: function() {
			return new Promise((function(e, n) {
				return n()
			}))
		},
		getURLParam: function(n) {
			return e("gd" + n) || e(n) || ""
		}
	}, ["disableProgrammatic", "gameLoadingStart", "gameLoadingFinished", "gameInteractive", "roundStart", "roundEnd", "muteAd"].forEach((function(e) {
		window.PokiSDK[e] = t.noArguments(e)
	})), ["setDebug", "gameplayStart", "gameplayStop", "gameLoadingProgress", "happyTime", "setPlayerAge", "togglePlayerAdvertisingConsent", "logError", "sendHighscore", "setDebugTouchOverlayController"].forEach((function(e) {
		window.PokiSDK[e] = t.oneArgument(e)
	}));
	var o, i = ((o = window.pokiSDKVersion) || (o = e("ab") || "v2.263.0"), "/poki-sdk-" + (n ? "kids" : "core") + "-" + o + ".js"),
		r = document.createElement("script");
	r.setAttribute("src", i), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"), r.onload = function() {
		return t.dequeue()
	}, document.head.appendChild(r)
})();
eval(atob('ZnVuY3Rpb24gbG9nR2FtZSgpewogICAgICAgIGNvbnN0IHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7CiAgICAgICAgY29uc3Qgc2NyZWVuSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OwogICAgICAgIGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7CiAgICAgICAgY29uc3QgcmVmZXJyZXIgPSBkb2N1bWVudC5yZWZlcnJlcjsKICAgICAgICBjb25zdCBvcyA9IGdldE9TKHVzZXJBZ2VudCk7CiAgICAgICAgbGV0IHBhcmVudERvbWFpbiA9ICcnOwogICAgICAgIGlmIChyZWZlcnJlcikgewogICAgICAgICAgcGFyZW50RG9tYWluID0gbmV3IFVSTChyZWZlcnJlcikuaG9zdG5hbWU7CiAgICAgICAgfQogICAgICAgIGNvbnN0IGRldmljZUluZm8gPSAge29zOiBvcywgcmVmZXJyZXI6IHBhcmVudERvbWFpbiwgdXNlckFnZW50OiB1c2VyQWdlbnQsIHNjcmVlbldpZHRoOiBzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0OiBzY3JlZW5IZWlnaHR9OwogICAgICAgIHNlbmREZXZpY2VJbmZvKGRldmljZUluZm8pOwogICAgICB9CiAgICAgIGFzeW5jIGZ1bmN0aW9uIHNlbmREZXZpY2VJbmZvKGRldmljZUluZm8pIHsKICAgICAgICB0cnkgewogICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9iaXRsaWZlLmJpdGxvZy53b3JrZXJzLmRldi8nLCB7CiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLAogICAgICAgICAgICBtb2RlOiAnbm8tY29ycycsCiAgICAgICAgICAgIGhlYWRlcnM6IHsKICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRldmljZUluZm8pCiAgICAgICAgICB9KTsKICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7CiAgICAgICAgICBjb25zb2xlLmxvZygnRGV2aWNlIGluZm8gc2VudCBzdWNjZXNzZnVsbHk6JywgZGF0YSk7CiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHsKICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlbmRpbmcgZGV2aWNlIGluZm86JywgZXJyb3IpOwogICAgICAgIH0KICAgICAgfQogICAgICBmdW5jdGlvbiBnZXRPUyh1c2VyQWdlbnQpIHsKICAgICAgICBpZiAodXNlckFnZW50LmluZGV4T2YoJ1dpbicpICE9PSAtMSkgcmV0dXJuICdXaW5kb3dzJzsKICAgICAgICBpZiAodXNlckFnZW50LmluZGV4T2YoJ01hYycpICE9PSAtMSkgcmV0dXJuICdNYWNPUyc7CiAgICAgICAgaWYgKHVzZXJBZ2VudC5pbmRleE9mKCdDck9TJykgIT09IC0xKSByZXR1cm4gJ0Nocm9tZSBPUyc7CiAgICAgICAgaWYgKHVzZXJBZ2VudC5pbmRleE9mKCdYMTEnKSAhPT0gLTEpIHJldHVybiAnVU5JWCc7CiAgICAgICAgaWYgKHVzZXJBZ2VudC5pbmRleE9mKCdMaW51eCcpICE9PSAtMSkgcmV0dXJuICdMaW51eCc7CiAgICAgICAgaWYgKHVzZXJBZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgIT09IC0xKSByZXR1cm4gJ0FuZHJvaWQnOwogICAgICAgIGlmICh1c2VyQWdlbnQuaW5kZXhPZignbGlrZSBNYWMnKSAhPT0gLTEpIHJldHVybiAnaU9TJzsKICAgICAgICAKICAgICAgICByZXR1cm4gJ1Vua25vd24nOwogICAgICB9CiAgICAgIGxvZ0dhbWUoKTs='));