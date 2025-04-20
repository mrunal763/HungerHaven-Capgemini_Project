function C() {
	const user1 = sessionStorage.getItem("userId");

	fetch(`http://localhost:3000/Users/${user1}`)
		.then((response) => {
			console.log("Response status:", response.status);
			return response.json();
		})
		.then((user) => {
			console.log("User object:", user);
			document.getElementById("profileUsername").innerHTML = user.Name;
			document.getElementById("profileEmail").innerHTML = user.Email;
			document.getElementById("profileLocation").innerHTML = user.Address;
			document.getElementById("profilePhone").innerHTML = user.Phone;
			document.getElementById("profilePassword").innerHTML = user.Password;
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
}
C();
