function P() {
	const userId = sessionStorage.getItem("userId");

	if (!userId) {
		window.location.href = "../Project/login.html";
	}

	const userNameEl = document.getElementById("userName");
	const userOrderCountEl = document.getElementById("userOrderCount");
	const userTotalSpentEl = document.getElementById("userTotalSpent");
	const restaurantCountEl = document.getElementById("restaurantCount");
	const recentOrdersTable = document.getElementById("recentOrdersTable");

	const baseURL = "http://localhost:3000";

	async function loadUserDashboard() {
		try {
			// Fetch user info
			const userRes = await fetch(`${baseURL}/Users/${userId}`);
			const user = await userRes.json();
			userNameEl.textContent = user.name;

			// Fetch orders
			const ordersRes = await fetch(
				`${baseURL}/Orders?UserID=${userId}&_sort=OrderDate&_order=desc`
			);
			const orders = await ordersRes.json();

			userOrderCountEl.textContent = orders.length;

			let totalSpent = 0;
			orders.forEach((o) => (totalSpent += parseFloat(o.TotalAmount)));
			userTotalSpentEl.textContent = `₹${totalSpent.toFixed(2)}`;

			// Load recent orders (limit 5)
			recentOrdersTable.innerHTML = "";
			const recentOrders = orders.slice(0, 5);

			for (let i = 0; i < recentOrders.length; i++) {
				const order = recentOrders[i];

				// Fetch restaurant name
				const restRes = await fetch(
					`${baseURL}/Restaurants/${order.RestaurantID}`
				);
				const restaurant = await restRes.json();

				const row = document.createElement("tr");
				row.innerHTML = `
            <td>${i + 1}</td>
            <td>${restaurant.Name}</td>
            <td>${new Date(order.OrderDate).toLocaleDateString()}</td>
            <td>₹${order.TotalAmount}</td>
          `;
				recentOrdersTable.appendChild(row);
			}

			if (recentOrders.length === 0) {
				recentOrdersTable.innerHTML = `<tr><td colspan="4" class="text-center">No recent orders</td></tr>`;
			}

			// Count total restaurants
			const restData = await fetch(`${baseURL}/Restaurants`);
			const restaurants = await restData.json();
			restaurantCountEl.textContent = restaurants.length;
		} catch (err) {
			console.error("Error loading dashboard:", err);
			recentOrdersTable.innerHTML = `<tr><td colspan="4" class="text-danger">Failed to load data</td></tr>`;
		}
	}

	loadUserDashboard();
}
P();

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
