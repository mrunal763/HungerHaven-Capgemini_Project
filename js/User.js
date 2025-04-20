function A() {
    const apiUrl = "http://localhost:3000/Users";
    const form = document.getElementById("userForm");
    const Name = document.getElementById("Name");
    const Email = document.getElementById("Email");
    const Address = document.getElementById("Address");
    const Password = document.getElementById("Password");
    const Phone = document.getElementById("Phone");
    const UserType = document.getElementById("UserType");
    const submitBtn = document.querySelector("button[type='submit']");
    const searchInput = document.createElement("input");
    let editId = null;
    let allUsers = [];
    let sortDirection = 1;

    // Initialize search input
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search by Name...");
    searchInput.classList.add("form-control", "mb-3");
    document
        .querySelector(".table")
        .parentNode.insertBefore(searchInput, document.querySelector(".table"));

    // Search functionality
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = allUsers.filter((user) =>
            user.Name.toLowerCase().includes(searchTerm)
        );
        renderUsers(filtered);
    });

    // Form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const valid =
            validateEmail() &&
            validateName() &&
            validatePassword() &&
            validatePhone() &&
            validateUserType() &&
            validateAddress();

        const user = {
            Name: Name.value.trim(),
            Email: Email.value.trim(),
            Phone: Phone.value.trim(),
            Password: Password.value.trim(),
            Address: Address.value.trim(),
            UserType: UserType.value.trim(),
        };

        if (valid) {
            if (editId) {
                // Update existing user
                fetch(`${apiUrl}/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                })
                    .then(() => {
                        fetchAndRenderUsers();
                        form.reset();
                        clearValidation();
                        editId = null;
                        submitBtn.textContent = "Save";
                        showSuccessMessage("User updated successfully!");
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        showErrorMessage("Failed to update user.");
                    });
            } else {
                // Create new user
                fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                })
                    .then(() => {
                        fetchAndRenderUsers();
                        form.reset();
                        clearValidation();
                        showSuccessMessage("User registered successfully!");
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        showErrorMessage("Failed to register user.");
                    });
            }
        } else {
            showErrorMessage("Please, enter valid data.");
        }
    });

    // Fetch and render users
    function fetchAndRenderUsers() {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                allUsers = data;
                renderUsers(data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                showErrorMessage("Failed to load users.");
            });
    }

    // Render users in the table
    function renderUsers(users) {
        const tbody = document.getElementById("RestaurantTableBody");
        tbody.innerHTML = "";

        users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.Name}</td>
                <td>${user.Email}</td>
                <td>${maskPassword(user.Password)}</td>
                <td>${user.Phone}</td>
                <td>${user.Address}</td>
                <td>${user.UserType}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${user.id}">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to edit buttons
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                loadUserForEdit(id);
            });
        });

        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                deleteUser(id);
            });
        });
    }

    // Load user data for editing
    function loadUserForEdit(id) {
        fetch(`${apiUrl}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                Name.value = data.Name;
                Email.value = data.Email;
                Phone.value = data.Phone;
                Password.value = data.Password;
                Address.value = data.Address;
                UserType.value = data.UserType;
                editId = id;
                submitBtn.textContent = "Update";
            })
            .catch((error) => {
                console.error("Error loading user for edit:", error);
                showErrorMessage("Failed to load user data.");
            });
    }

    // Delete user
    function deleteUser(id) {
        if (confirm("Are you sure you want to delete this user?")) {
            fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            })
                .then(() => {
                    fetchAndRenderUsers();
                    showSuccessMessage("User deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    showErrorMessage("Failed to delete user.");
                });
        }
    }

    // Helper function to mask password
    function maskPassword(password) {
        return password ? '••••••••' : '';
    }

    // Show success message
    function showSuccessMessage(message) {
        // You can replace this with a more sophisticated notification system
        alert(message);
    }

    // Show error message
    function showErrorMessage(message) {
        // You can replace this with a more sophisticated notification system
        alert(message);
    }

    // Clear validation classes
    function clearValidation() {
        Name.classList.remove("is-valid", "is-invalid");
        Email.classList.remove("is-valid", "is-invalid");
        Password.classList.remove("is-valid", "is-invalid");
        Phone.classList.remove("is-valid", "is-invalid");
        Address.classList.remove("is-valid", "is-invalid");
        UserType.classList.remove("is-valid", "is-invalid");
    }

    // Validation functions
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

    function validateAddress() {
        if (Address.value.trim().length >= 5) {
            Address.classList.add("is-valid");
            Address.classList.remove("is-invalid");
            return true;
        } else {
            Address.classList.add("is-invalid");
            Address.classList.remove("is-valid");
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
        const passVal = Password.value;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (passRegex.test(passVal)) {
            Password.classList.add("is-valid");
            Password.classList.remove("is-invalid");
            return true;
        } else {
            Password.classList.add("is-invalid");
            Password.classList.remove("is-valid");
            return false;
        }
    }

    function validatePhone() {
        const mobileRegex = /^[789]\d{9}$/;
        if (mobileRegex.test(Phone.value.trim())) {
            Phone.classList.add("is-valid");
            Phone.classList.remove("is-invalid");
            return true;
        } else {
            Phone.classList.add("is-invalid");
            Phone.classList.remove("is-valid");
            return false;
        }
    }

    function validateUserType() {
        if (UserType.value.trim() === "") {
            UserType.classList.add("is-invalid");
            UserType.classList.remove("is-valid");
            return false;
        } else {
            UserType.classList.add("is-valid");
            UserType.classList.remove("is-invalid");
            return true;
        }
    }

    // Initialize
    fetchAndRenderUsers();
}
A();