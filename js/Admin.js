function N() {
	function toggleSidebar() {
		const sidebar = document.getElementById("sidebar");
		const btn = document.querySelector(".toggle-sidebar-btn");
		const mainContent = document.getElementById("main-content");

		if (sidebar.style.display === "none") {
			sidebar.style.display = "block";
			btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
			mainContent.classList.remove("full-width");
		} else {
			sidebar.style.display = "none";
			btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
			mainContent.classList.add("full-width");
		}
	}

	// Load Page and set active nav link
	function loadPage(page, element) {
		const contentArea = document.getElementById("main-content");

		fetch(page)
			.then((response) => response.text())
			.then((data) => {
				contentArea.innerHTML = data;

				// Remove 'active' from all nav-links
				document.querySelectorAll(".nav-link").forEach((link) => {
					link.classList.remove("active");
				});

				// Add 'active' to the clicked link
				if (element) {
					element.classList.add("active");
				}

				document.getElementById("adminName").innerText =
					sessionStorage.getItem("adminName") || "Admin";
			});
	}

	// Initial Setup

	document.getElementById("adminName").innerHTML =
		sessionStorage.getItem("adminName") || "Admin";

	// Logout logic
	document.getElementById("logoutBtn").addEventListener("click", function (e) {
		e.preventDefault();
		sessionStorage.clear();
		sessionStorage.setItem("loggedOut", "true");
		window.location.href = "login.html";
	});

	// Fetch stats
	const ordersURL = "http://localhost:3000/Orders";
	const usersURL = "http://localhost:3000/Users";

	fetch(ordersURL)
		.then((res) => res.json())
		.then((orders) => {
			document.getElementById("totalOrders").textContent = orders.length;
			const revenue = orders.reduce(
				(sum, order) => sum + (order.TotalAmount || 0),
				0
			);
			document.getElementById("totalRevenue").textContent = `₹${revenue}`;
		})
		.catch(() => {
			document.getElementById("totalOrders").textContent = "Error";
			document.getElementById("totalRevenue").textContent = "Error";
		});

	fetch(usersURL)
		.then((res) => res.json())
		.then((users) => {
			const activeUsers = users.filter((user) => user.UserType === "Customer");
			document.getElementById("activeUsers").textContent = activeUsers.length;
		})
		.catch(() => {
			document.getElementById("activeUsers").textContent = "Error";
		});

	const navLinks = document.querySelectorAll(".sidebar .nav-link");

	navLinks.forEach((link) => {
		link.addEventListener("click", function () {
			// Remove active class from all links
			navLinks.forEach((nav) => nav.classList.remove("active"));
			this.style.color = "";

			// Add active class to clicked link
			this.classList.add("active");

			this.style.color = "white";
		});
	});
}
N();

function toggleSidebar() {
	const sidebar = document.getElementById("sidebar");
	const btn = document.querySelector(".toggle-sidebar-btn");
	const mainContent = document.getElementById("main-content");

	if (sidebar.style.display === "none") {
		sidebar.style.display = "block";
		btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
		mainContent.classList.remove("full-width");
	} else {
		sidebar.style.display = "none";
		btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
		mainContent.classList.add("full-width");
	}
}
