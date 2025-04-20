function loadPage(url) {
	fetch(url)
		.then((res) => res.text())
		.then((html) => {
			document.getElementById("main-content").innerHTML = html;

			const scripts = document
				.getElementById("main-content")
				.querySelectorAll("script");
			scripts.forEach((script) => {
				const newScript = document.createElement("script");
				if (script.src) {
					newScript.src = script.src;
				} else {
					newScript.innerHTML = script.innerHTML;
				}
				document.body.appendChild(newScript);
			});
		})
		.catch((err) => {
			document.getElementById(
				"main-content"
			).innerHTML = `<p>Error loading page</p>`;
			console.error("Failed to load page:", err);
		});
}
