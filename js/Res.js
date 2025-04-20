function V() {
	const apiUrl = "http://localhost:3000/Restaurants";
	const form = document.getElementById("RestaurantForm");
	const RestaurantID = document.getElementById("RestaurantID");
	const Name = document.getElementById("Name");
	const Location = document.getElementById("Location");
	const Contact = document.getElementById("Contact");
	const submitBtn = document.getElementById("submitBtn");
	const searchInput = document.createElement("input");
	let editId = null;
	let allRestaurant = [];
	let sortDirection = 1;

	searchInput.setAttribute("type", "text");
	searchInput.setAttribute("placeholder", "Search by Restaurant Name...");
	searchInput.classList.add("form-control", "mb-3");
	document
		.querySelector(".table")
		.parentNode.insertBefore(searchInput, document.querySelector(".table"));

	searchInput.addEventListener("input", () => {
		const searchTerm = searchInput.value.toLowerCase();
		const filtered = allRestaurant.filter((cat) =>
			cat.Name.toLowerCase().includes(searchTerm)
		);
		renderRestaurant(filtered);
	});

	form.addEventListener("submit", function (e) {
		e.preventDefault();
		//if (!validateForm()) return;
		const valid = validateContact() & validateLocation() & validateName();
		const restaurant = {
			Name: Name.value.trim(),
			Location: Location.value.trim(),
			Contact: Contact.value.trim(),
		};
		if (valid) {
			if (editId) {
				fetch(`${apiUrl}/${editId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(restaurant),
				}).then(() => {
					fetchAndRenderRestaurant();
					form.reset();
					editId = null;
					submitBtn.textContent = "Add Restaurant";
					clearValidation();
				});
			} else {
				fetch(apiUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(restaurant),
				}).then(() => {
					fetchAndRenderRestaurant();
					form.reset();
					clearValidation();
				});
			}
		}
	});

	function fetchAndRenderRestaurant() {
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => {
				allRestaurant = data;
				renderRestaurant(data);
			});
	}
	// Sorting logic on Category Name
	document.querySelector("th:nth-child(2)").style.cursor = "pointer";
	document.querySelector("th:nth-child(2)").addEventListener("click", () => {
		const sorted = [...allRestaurant].sort(
			(a, b) => a.Name.localeCompare(b.Name) * sortDirection
		);
		sortDirection *= -1;
		renderRestaurant(sorted);
	});

	function renderRestaurant(restaurant) {
		const tbody = document.getElementById("RestaurantTableBody");
		tbody.innerHTML = "";

		restaurant.forEach((cat) => {
			const row = document.createElement("tr");
			row.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.Name}</td>
      <td>${cat.Location}</td>
      <td>${cat.Contact}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${cat.id}">
          Edit
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${cat.id}">
          Delete
        </button>
      </td>
    `;
			tbody.appendChild(row);
		});

		document.querySelectorAll(".edit-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const id = btn.getAttribute("data-id");
				loadRestaurantForEdit(id);
			});
		});

		document.querySelectorAll(".delete-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const id = btn.getAttribute("data-id");
				deleteRestaurant(id);
			});
		});
	}

	function loadRestaurantForEdit(id) {
		fetch(`${apiUrl}/${id}`)
			.then((res) => res.json())
			.then((data) => {
				Name.value = data.Name;
				Contact.value = data.Contact;
				Location.value = data.Location;
				editId = id;
				submitBtn.textContent = "Update Category";
			});
	}
	Name.addEventListener("blur", validateName);
	Location.addEventListener("blur", validateLocation);
	Contact.addEventListener("blur", validateContact);
	function deleteRestaurant(id) {
		if (confirm("Are you sure you want to delete this restaurant?")) {
			fetch(`${apiUrl}/${id}`, {
				method: "DELETE",
			}).then(() => fetchAndRenderRestaurant());
		}
		[];
	}
	function validateName() {
		if (Name.value.trim().length >= 2) {
			Name.classList.add("is-valid");
			Name.classList.remove("is-invalid");
			return true;
		} else {
			Name.classList.add("is-invalid");
			Name.classList.remove("is-valid");
			return false;
		}
	}
	function validateLocation() {
		if (Location.value.trim().length >= 5) {
			Location.classList.add("is-valid");
			Location.classList.remove("is-invalid");
			return true;
		} else {
			Location.classList.add("is-invalid");
			Location.classList.remove("is-valid");
			return false;
		}
	}
	function validateContact() {
		const mobileRegex = /^[789]\d{9}$/;
		if (mobileRegex.test(Contact.value.trim())) {
			Contact.classList.add("is-valid");
			Contact.classList.remove("is-invalid");
			return true;
		} else {
			Contact.classList.add("is-invalid");
			Contact.classList.remove("is-valid");
			return false;
		}
	}

	fetchAndRenderRestaurant();
}
V();
