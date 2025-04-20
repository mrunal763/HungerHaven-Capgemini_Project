function P() {
	console.log("kjhg");

	const restaurantId = sessionStorage.getItem("userId");
	console.log(restaurantId);
	console.log("kjhghh");

	if (!restaurantId) {
		alert("Please log in to access the dashboard.");
		window.location.href = "../login.html";
		return;
	}

	const baseURL = "http://localhost:3000";

	// DOM Elements
	const restaurantNameEl = document.getElementById("restaurantName");
	const totalOrdersEl = document.getElementById("totalOrders");
	const totalRevenueEl = document.getElementById("totalRevenue");
	const menuItemCountEl = document.getElementById("menuItemCount");

	// 1. Fetch restaurant details
	fetch(`${baseURL}/Restaurants/${restaurantId}`)
		.then(res => res.json())
		.then(restaurant => {
			restaurantNameEl.textContent = restaurant.Name || "Restaurant";

			// 2. Fetch orders of this restaurant
			return fetch(`${baseURL}/Orders?RestaurantID=${restaurantId}`);
		})
		.then(res => res.json())
		.then(orders => {
			totalOrdersEl.textContent = orders.length;

			// 3. Calculate total revenue
			const revenue = orders.reduce((acc, order) => {
				return acc + parseFloat(order.TotalAmount || 0);
			}, 0);
			totalRevenueEl.textContent = `₹${revenue.toFixed(2)}`;

			// 4. Fetch menu items uploaded by this restaurant
			return fetch(`${baseURL}/FoodItems?RestaurantID=${restaurantId}`);
		})
		.then(res => res.json())
		.then(items => {
			menuItemCountEl.textContent = items.length;
		});
}

P();

// === Optional: Sidebar Toggle ===
function toggleSidebar() {
	const sidebar = document.getElementById("sidebar");
	const btn = document.querySelector(".toggle-sidebar-btn");
	const mainContent = document.getElementById("main-content");

	if (!sidebar || !btn || !mainContent) return;

	if (
		sidebar.style.display === "none" ||
		sidebar.classList.contains("d-none")
	) {
		sidebar.style.display = "block";
		sidebar.classList.remove("d-none");
		btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
		mainContent.classList.remove("full-width");
	} else {
		sidebar.style.display = "none";
		sidebar.classList.add("d-none");
		btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
		mainContent.classList.add("full-width");
	}
}
