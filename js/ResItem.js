(function () {
	const restaurantID = sessionStorage.getItem("userId");

	if (!restaurantID) {
		window.location.href = "../Project/login.html";
		return;
	}

	const itemForm = document.getElementById("itemForm");
	const itemIdInput = document.getElementById("ItemId");
	const nameInput = document.getElementById("Name");
	const priceInput = document.getElementById("Price");
	const searchInput = document.getElementById("globalSearch");
	const tableBody = document.getElementById("itemTableBody");

	let items = [];

	loadItems();

	searchInput.oninput = function () {
		const keyword = this.value.toLowerCase();
		const filtered = items.filter((item) =>
			item.Name.toLowerCase().includes(keyword)
		);
		renderItems(filtered);
	};

	itemForm.onsubmit = function (e) {
		e.preventDefault();

		const name = nameInput.value.trim();
		const price = parseFloat(priceInput.value);

		let valid = true;

		if (name.length < 3) {
			nameInput.classList.add("is-invalid");
			valid = false;
		} else {
			nameInput.classList.remove("is-invalid");
		}

		if (isNaN(price) || price <= 0) {
			priceInput.classList.add("is-invalid");
			valid = false;
		} else {
			priceInput.classList.remove("is-invalid");
		}

		if (!valid) return;

		const item = {
			Name: name,
			Price: price,
			RestaurantID: restaurantID,
		};

		const id = itemIdInput.value;

		if (id) {
			// Update existing item
			item.id = id;
			fetch(`http://localhost:3000/FoodItems/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			})
				.then(() => {
					itemForm.reset();
					loadItems();
				});
		} else {
			// Add new item
			fetch("http://localhost:3000/FoodItems", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			})
				.then(() => {
					itemForm.reset();
					loadItems();
				});
		}
	};

	window.editItem = function (id) {
		const item = items.find((i) => i.id === id);
		if (!item) return;

		itemIdInput.value = item.id;
		nameInput.value = item.Name;
		priceInput.value = item.Price;
	};

	window.deleteItem = function (id) {
		if (!confirm("Are you sure you want to delete this item?")) return;

		fetch(`http://localhost:3000/FoodItems/${id}`, { method: "DELETE" })
			.then(() => loadItems());
	};

	function loadItems() {
		fetch("http://localhost:3000/FoodItems")
			.then(res => res.json())
			.then(data => {
				items = data.filter((item) => item.RestaurantID === restaurantID);
				renderItems(items);
			});
	}

	function renderItems(itemList) {
		tableBody.innerHTML = "";

		if (itemList.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No items found.</td></tr>`;
			return;
		}

		itemList.forEach(item => {
			const row = document.createElement("tr");

			row.innerHTML = `
				<td>${item.Name}</td>
				<td>₹${item.Price}</td>
				<td>
					<button class="btn btn-primary btn-sm" onclick="editItem('${item.id}')">Edit</button>
					<button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">Delete</button>
				</td>
			`;

			tableBody.appendChild(row);
		});
	}
})();
