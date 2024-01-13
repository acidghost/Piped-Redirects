"use strict";

const optionsForm = document.getElementById("optionsForm");

window.browser = window.browser || window.chrome;

browser.storage.local.get(["host", "port"], (data) => {
	optionsForm.host.value = data.host;
	optionsForm.port.value = data.port;
});

optionsForm.host.addEventListener("change", (event) => {
	browser.storage.local.set({ host: event.target.value });
});

optionsForm.port.addEventListener("change", (event) => {
	browser.storage.local.set({ port: event.target.value });
});
