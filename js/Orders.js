function N() {
	const ordersApi = "http://localhost:3000/Orders";
	const usersApi = "http://localhost:3000/Users";
	const restaurantsApi = "http://localhost:3000/Restaurants";

	let allOrders = [];
	let sortField = null;
	let sortAsc = true;

	fetchAllData();

	document.getElementById("searchOrder").addEventListener("input", (e) => {
		const term = e.target.value.toLowerCase();
		const filtered = allOrders.filter((order) =>
			Object.values(order).join(" ").toLowerCase().includes(term)
		);
		renderOrders(filtered);
	});

	// ✅ Move this outside the search event!
	const headers = document.querySelectorAll("thead th.sortable");
	headers.forEach((th) => {
		th.addEventListener("click", () => {
			const field = th.dataset.field;
			sortAsc = sortField === field ? !sortAsc : true;
			sortField = field;
			sortOrders();
			renderOrders(allOrders);
		});
	});

	function fetchAllData() {
		Promise.all([
			fetch(ordersApi).then((res) => res.json()),
			fetch(usersApi).then((res) => res.json()),
			fetch(restaurantsApi).then((res) => res.json()),
		])
			.then(([orders, users, restaurants]) => {
				allOrders = orders.map((order) => {
					const user = users.find((u) => u.id === order.UserID);
					const rest = restaurants.find((r) => r.id === order.RestaurantID);
					return {
						OrderID: order.OrderID,
						UserName: user ? user.Name : "Unknown",
						RestaurantName: rest ? rest.Name : "Unknown",
						Location: rest ? rest.Location : "Unknown",
						Contact: rest ? rest.Contact : "Unknown",
						OrderDate: order.OrderDate,
						TotalAmount: order.TotalAmount,
					};
				});
				sortOrders(); // Initial sort if needed
				renderOrders(allOrders);
			})
			.catch((err) => {
				console.error("Data loading error:", err);
				document.getElementById("ordersTableBody").innerHTML = `
        <tr><td colspan="7" class="text-danger">Failed to load orders.</td></tr>`;
			});
	}

	function sortOrders() {
		if (!sortField) return;
		allOrders.sort((a, b) => {
			let valA = a[sortField];
			let valB = b[sortField];
			if (!isNaN(valA) && !isNaN(valB)) {
				valA = parseFloat(valA);
				valB = parseFloat(valB);
			} else {
				valA = valA.toString().toLowerCase();
				valB = valB.toString().toLowerCase();
			}
			return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
		});
	}

	function renderOrders(orders) {
		const tbody = document.getElementById("ordersTableBody");
		tbody.innerHTML = "";
		if (orders.length === 0) {
			tbody.innerHTML = `<tr><td colspan="7" class="text-warning">No matching orders found.</td></tr>`;
			return;
		}

		orders.forEach((order) => {
			const row = document.createElement("tr");
			row.innerHTML = `
			<td>${order.OrderID}</td>
			<td>${order.UserName}</td>
			<td>${order.RestaurantName}</td>
			<td>${order.Location}</td>
			<td>${order.Contact}</td>
			<td>${order.OrderDate}</td>
			<td>₹${order.TotalAmount}</td>
		`;
			tbody.appendChild(row);
		});
	}
}
N();
