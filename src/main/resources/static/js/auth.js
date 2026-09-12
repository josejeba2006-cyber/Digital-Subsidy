const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


// ================= PASSWORD EYE BUTTON =================

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        password.type = "password";
        togglePassword.textContent = "👁";

    }

});


// ================= LOGIN =================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;

    loginMessage.className = "message";
    loginMessage.textContent = "";

    try {

        const response = await fetch("http://localhost:8081/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                email: email,
                password: passwordValue
            })
        });


        if (response.ok) {

            const user = await response.json();

            // Remove previous staff/admin login
            localStorage.removeItem("staffEmail");
            localStorage.removeItem("staffRole");

            // Store normal user login
            localStorage.setItem("userEmail", user.email);

            window.location.href = "dashboard.html";

        }

         else {

            let message = "Invalid email or password.";

            try {

                const error = await response.json();

                if (error.message) {
                    message = error.message;
                }

            } catch (e) {

                // Backend did not return JSON
                message = "Invalid email or password.";

            }

            loginMessage.className = "message error";
            loginMessage.textContent = message;
        }

    } catch (error) {

        console.error(error);

        loginMessage.className = "message error";

        loginMessage.textContent =
            "Unable to connect to the server.";
    }

});