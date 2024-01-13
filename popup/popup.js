"use strict";

let redirectHostDOM = document.getElementById("redirectHost");

window.browser = window.browser || window.chrome;

browser.storage.local.get(["redirectHost"]).then((result) => {
	redirectHostDOM.setAttribute("value", result.redirectHost);
});

browser.storage.onChanged.addListener((changes) => {
	if (changes?.redirectHost?.newValue) {
		redirectHostDOM.setAttribute("value", changes.redirectHost.newValue);
	}
});

redirectHostDOM.addEventListener("blur", (event) => {
	browser.storage.local.set({ redirectHost: event.target.value });
});
