const apiUrl = "http://localhost:3000/Users";
const restaurantApi = "http://localhost:3000/Restaurants";

// === Form Elements ===
const form = document.getElementById("userForm");
const Name = document.getElementById("Name");
const Email = document.getElementById("Email");
const Address = document.getElementById("Address");
const Password = document.getElementById("Password");
const Phone = document.getElementById("Phone");
const UserType = document.getElementById("UserType");
const RestaurantName = document.getElementById("RestaurantName");

const nameField = document.getElementById("nameField");
const restaurantField = document.getElementById("restaurantNameField");

const submitBtn = document.getElementById("submitBtn");

let editId = null;
let allUsers = [];

// === User Type Toggle ===
document.getElementById("selectCustomer").addEventListener("click", () => {
	UserType.value = "Customer";
	form.style.display = "flex";
	nameField.style.display = "block";
	restaurantField.style.display = "none";
	setActive("selectCustomer");
});

document.getElementById("selectRestaurant").addEventListener("click", () => {
	UserType.value = "Restaurant";
	form.style.display = "flex";
	nameField.style.display = "none";
	restaurantField.style.display = "block";
	setActive("selectRestaurant");
});

function setActive(id) {
	document.getElementById("selectCustomer").classList.remove("active-type");
	document.getElementById("selectRestaurant").classList.remove("active-type");
	document.getElementById(id).classList.add("active-type");
}

// === Form Submission ===
form.addEventListener("submit", function (e) {
	e.preventDefault();

	const userType = UserType.value.trim();
	const emailValue = Email.value.trim().toLowerCase();

	if (!validateForm()) return;

	const emailExists = allUsers.some(
		(user) => user && user.Email && user.Email.toLowerCase() === emailValue
	);

	if (emailExists && !editId) {
		Email.classList.add("is-invalid");
		alert("Email already exists. Try a different one.");
		return;
	}

	const user = {
		Name:
			userType === "Customer" ? Name.value.trim() : RestaurantName.value.trim(),
		Email: emailValue,
		Phone: Phone.value.trim(),
		Password: Password.value.trim(),
		Address: Address.value.trim(),
		UserType: userType,
	};

	if (editId) {
		// === PUT update ===
		fetch(`${apiUrl}/${editId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		})
			.then(() => {
				fetchAndRenderUsers();
				form.reset();
				editId = null;
				submitBtn.textContent = "Register";
				clearValidation();
			})
			.catch((err) => console.error("Update failed", err));
	} else {
		// === POST new user ===
		fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((newUser) => {
				// If Restaurant, also insert into Restaurants table
				if (userType === "Restaurant") {
					const restaurantEntry = {
						RestaurantName: RestaurantName.value.trim(),
						Email: emailValue,
						Contact: Phone.value.trim()
					};

					return fetch(restaurantApi, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(restaurantEntry)
					});
				}
			})
			.then(() => A())
			.catch((err) => {
				console.error("Error during registration:", err);
			});
	}
});

// === Validation ===
function validateForm() {
	let isValid = true;

	const validators = [
		UserType.value === "Customer" ? validateName() : validateRestaurantName(),
		validateEmail(),
		validatePassword(),
		validatePhone(),
		validateAddress(),
		validateUserType(),
	];

	validators.forEach((valid) => {
		if (!valid) isValid = false;
	});

	return isValid;
}

function validateName() {
	return validateInput(Name, 2);
}

function validateRestaurantName() {
	return validateInput(RestaurantName, 2);
}

function validateInput(input, minLen) {
	if (input.value.trim().length >= minLen) {
		input.classList.add("is-valid");
		input.classList.remove("is-invalid");
		return true;
	} else {
		input.classList.add("is-invalid");
		input.classList.remove("is-valid");
		return false;
	}
}

function validateEmail() {
	if (Email.value && Email.checkValidity()) {
		Email.classList.add("is-valid");
		Email.classList.remove("is-invalid");
		return true;
	} else {
		Email.classList.add("is-invalid");
		Email.classList.remove("is-valid");
		return false;
	}
}

function validatePassword() {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
	return validateRegex(Password, regex);
}

function validatePhone() {
	const regex = /^[789]\d{9}$/;
	return validateRegex(Phone, regex);
}

function validateAddress() {
	return validateInput(Address, 5);
}

function validateUserType() {
	if (UserType.value.trim() !== "") {
		UserType.classList.add("is-valid");
		UserType.classList.remove("is-invalid");
		return true;
	} else {
		UserType.classList.add("is-invalid");
		UserType.classList.remove("is-valid");
		return false;
	}
}

function validateRegex(input, regex) {
	if (regex.test(input.value.trim())) {
		input.classList.add("is-valid");
		input.classList.remove("is-invalid");
		return true;
	} else {
		input.classList.add("is-invalid");
		input.classList.remove("is-valid");
		return false;
	}
}

// === Clear Validation States ===
function clearValidation() {
	[Name, RestaurantName, Email, Password, Phone, Address, UserType].forEach(
		(input) => {
			input.classList.remove("is-valid", "is-invalid");
		}
	);
}

// === On Blur Validations ===
Name.addEventListener("blur", validateName);
RestaurantName.addEventListener("blur", validateRestaurantName);
Email.addEventListener("blur", validateEmail);
Password.addEventListener("blur", validatePassword);
Phone.addEventListener("blur", validatePhone);
Address.addEventListener("blur", validateAddress);
UserType.addEventListener("blur", validateUserType);

// === Fetch Existing Users ===
function fetchAndRenderUsers() {
	fetch(apiUrl)
		.then((res) => res.json())
		.then((data) => {
			allUsers = data;
			console.log("Fetched Users:", allUsers);
		})
		.catch((err) => console.error("Error fetching users:", err));
}

fetchAndRenderUsers();

function A() {
	window.location.href = "login.html";
}
