const apiUrl = "http://localhost:3000/Users";


const loginForm = document.querySelector("form");
const emailInput = loginForm.querySelector("input[type='email']");
const passwordInput = loginForm.querySelector("input[type='password']");
const errorDisplay = document.createElement("div");
errorDisplay.id = "error";
errorDisplay.style.color = "red";
loginForm.appendChild(errorDisplay);

emailInput.addEventListener("blur", () => validateEmail(emailInput));
passwordInput.addEventListener("blur", () => validatePassword(passwordInput));

loginForm.addEventListener("submit", function (e) {
	e.preventDefault();

	const isEmailValid = validateEmail(emailInput);
	const isPasswordValid = validatePassword(passwordInput);

	if (isEmailValid && isPasswordValid) {
		verifyLogin();
	}
});

// Email Validation
function validateEmail(input) {
	const emailVal = input.value.trim();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (emailRegex.test(emailVal)) {
		input.classList.add("is-valid");
		input.classList.remove("is-invalid");
		return true;
	} else {
		input.classList.add("is-invalid");
		input.classList.remove("is-valid");
		return false;
	}
}

// Password Validation
function validatePassword(input) {
	const passwordVal = input.value;
	const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

	if (passRegex.test(passwordVal)) {
		input.classList.add("is-valid");
		input.classList.remove("is-invalid");
		return true;
	} else {
		input.classList.add("is-invalid");
		input.classList.remove("is-valid");
		return false;
	}
}

// Verify credentials and login
function verifyLogin() {
	const email = emailInput.value.trim();
	const password = passwordInput.value.trim();

	fetch(apiUrl)
		.then(res => res.json())
		.then(users => {
			const user = users.find(u => u.Email === email && u.Password === password);

			if (user) {
				sessionStorage.setItem("userId", user.id);
				sessionStorage.setItem("userName", user.Name);
				sessionStorage.setItem("userEmail",user.Email);
				sessionStorage.setItem("userType", user.UserType);
				sessionStorage.setItem("restaurantId",user.id);
				sessionStorage.setItem("adminName", user.Name);


				switch (user.UserType) {
					case "Admin":
						window.location.href = "Admin.html";
						break;
					case "Customer":
						window.location.href = "User.html";
						break;
					case "Restaurant":
						window.location.href = "Restaurant.html";
						break;
					default:
						window.location.href = "User.html";
				}
			} else {
				errorDisplay.textContent = "Invalid email or password.";
			}
		})
		.catch(err => {
			console.error("Login failed:", err);
			errorDisplay.textContent = "Login failed. Please try again later.";
		});
}

function getUserId() {
	return sessionStorage.getItem("userId");
}

function getUserName() {
	return sessionStorage.getItem("userName");
}

function getUserType() {
	return sessionStorage.getItem("userType");
}

