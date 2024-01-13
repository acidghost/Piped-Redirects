window.browser = window.browser || window.chrome;

const redirectHostDefault = "piped.video";
let host = redirectHostDefault;
let port = undefined;

browser.storage.local.get(["host", "port"], (result) => {
	host = result.host || redirectHostDefault;
	port = result.port;
	if (!result.host) {
		browser.storage.local.set({ host });
	}
});

browser.storage.onChanged.addListener((changes) => {
	if (changes.host) {
		host = changes.host.newValue || redirectHostDefault;
		if (!changes.host.newValue) {
			browser.storage.local.set({ host: redirectHostDefault });
		}
	}
	if (changes.port) {
		port = changes.port.newValue;
	}
});

browser.webRequest.onBeforeRequest.addListener(
	(details) => {
		const url = new URL(details.url);
		if (url.hostname.endsWith("youtu.be") && url.pathname.length > 1) {
			let port = port ? `:${port}` : "";
			return { redirectUrl: `https://${host}${port}/watch?v=${url.pathname.substr(1)}` };
		}
		if (
			url.hostname.endsWith("youtube.com") ||
			url.hostname.endsWith("youtube-nocookie.com")
		) {
			// TODO: write in a cleaner way
			if (url.pathname.endsWith("/feed/trending")) {
				url.pathname = url.pathname.replace(/\/feed\/trending$/, "/trending");
			}
			if (url.pathname.endsWith("/featured")) {
				url.pathname = url.pathname.replace(/\/featured$/, "");
			}
			if (url.pathname.endsWith("/videos")) {
				url.pathname = url.pathname.replace(/\/videos$/, "");
				url.searchParams.set("tab", "videos");
			}
			if (url.pathname.endsWith("/shorts")) {
				url.pathname = url.pathname.replace(/\/shorts$/, "");
				url.searchParams.set("tab", "shorts");
			}
			if (url.pathname.endsWith("/streams")) {
				url.pathname = url.pathname.replace(/\/streams$/, "");
				url.searchParams.set("tab", "livestreams");
			}
			if (url.pathname.endsWith("/playlists")) {
				url.pathname = url.pathname.replace(/\/playlists$/, "");
				url.searchParams.set("tab", "playlists");
			}
			url.hostname = host;
			if (port) {
				url.port = port;
			}
			return { redirectUrl: url.href };
		}
	},
	{
		urls: ["<all_urls>"],
	},
	["blocking"],
);
