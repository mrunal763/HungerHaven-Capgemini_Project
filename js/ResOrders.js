function G() {
	const restaurantID = sessionStorage.getItem("userId");

	if (!restaurantID) {
		window.location.href = "../Project/login.html";
		return;
	}

	const pendingOrdersEl = document.getElementById("pendingOrders");
	const completedOrdersEl = document.getElementById("completedOrders");
	const searchInput = document.getElementById("searchInput");

	let orders = [];
	let users = [];

	fetchData().then(() => {
		displayOrders();

		// Attach search directly if needed (can be called via oninput in HTML too)
		searchInput.oninput = debounce(function () {
			searchOrders(this.value);
		}, 300);
	});

	function fetchData() {
		return Promise.all([
			fetch("http://localhost:3000/Orders"),
			fetch("http://localhost:3000/Users"),
		])
			.then(([ordersRes, usersRes]) => Promise.all([ordersRes.json(), usersRes.json()]))
			.then(([ordersData, usersData]) => {
				orders = ordersData;
				users = usersData;
			});
	}

	function displayOrders(filtered = orders) {
		pendingOrdersEl.innerHTML = "";
		completedOrdersEl.innerHTML = "";

		const relevantOrders = filtered.filter((o) => o.RestaurantID === restaurantID);

		if (relevantOrders.length === 0) {
			pendingOrdersEl.innerHTML = `<tr><td colspan="4" class="text-center">No pending orders</td></tr>`;
			completedOrdersEl.innerHTML = `<tr><td colspan="4" class="text-center">No completed orders</td></tr>`;
			return;
		}

		relevantOrders.forEach((order) => {
			const user = users.find((u) => u.id === order.UserID);
			const userName = user?.Name || "Unknown";

			const row = `
				<tr>
					<td>${new Date(order.OrderDate).toLocaleDateString()}</td>
					<td>${userName}</td>
					<td>₹${order.TotalAmount}</td>
					<td>
						${order.Status === "pending"
							? `
							<button class="btn btn-success btn-sm" onclick="markCompleted('${order.id}')">Complete</button>
							<button class="btn btn-danger btn-sm" onclick="deleteOrder('${order.id}')">Delete</button>
						` : ""}
						<button class="btn btn-primary btn-sm" onclick='generatePDF(${JSON.stringify(order)}, "${userName}")'>Bill</button>
					</td>
				</tr>
			`;

			if (order.Status === "completed") {
				completedOrdersEl.innerHTML += row;
			} else {
				pendingOrdersEl.innerHTML += row;
			}
		});
	}

	window.searchOrders = function (keyword) {
		const filtered = orders.filter((order) => {
			const user = users.find((u) => u.id === order.UserID);
			return (
				order.RestaurantID === restaurantID &&
				(user?.Name.toLowerCase().includes(keyword.toLowerCase()) ||
					order.OrderDate.toLowerCase().includes(keyword.toLowerCase()))
			);
		});
		displayOrders(filtered);
	};

	window.markCompleted = function (id) {
		const order = orders.find((o) => o.id === id);
		if (!order) return;

		order.Status = "completed";
		fetch(`http://localhost:3000/Orders/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		})
			.then(() => fetchData())
			.then(() => displayOrders());
	};

	window.deleteOrder = function (id) {
		if (!confirm("Are you sure you want to delete this order?")) return;
		fetch(`http://localhost:3000/Orders/${id}`, { method: "DELETE" })
			.then(() => fetchData())
			.then(() => displayOrders());
	};

	window.generatePDF = function (order, userName) {
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		doc.setFontSize(18);
		doc.text("HungerHaven - Order Bill", 20, 20);

		doc.setFontSize(12);
		doc.text(`Order ID: ${order.id}`, 20, 40);
		doc.text(`Date: ${new Date(order.OrderDate).toLocaleDateString()}`, 20, 50);
		doc.text(`Customer: ${userName}`, 20, 60);
		doc.text(`Restaurant ID: ${order.RestaurantID}`, 20, 70);
		doc.text(`Total Amount: ₹${order.TotalAmount}`, 20, 80);
		doc.text(`Status: ${order.Status}`, 20, 90);

		doc.save(`Order_Bill_${order.id}.pdf`);
	};

	function debounce(func, delay) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), delay);
		};
	}
}

G();
