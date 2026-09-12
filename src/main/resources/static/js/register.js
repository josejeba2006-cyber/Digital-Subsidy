const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");


// Password eye
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁";
    }

});


// Confirm password eye
const confirmPassword = document.getElementById("confirmPassword");
const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirmPassword.textContent = "🙈";
    } else {
        confirmPassword.type = "password";
        toggleConfirmPassword.textContent = "👁";
    }

});


// Register
registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    registerMessage.className = "message";
    registerMessage.textContent = "";


    // Check passwords
    if (passwordValue !== confirmPasswordValue) {

        registerMessage.className = "message error";
        registerMessage.textContent = "Passwords do not match.";

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:8081/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email: email,
                    password: passwordValue,
                    role: "USER"
                })
            }
        );


        if (response.ok) {

            registerMessage.className = "message success";
            registerMessage.textContent =
                "Account created successfully!";

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1000);

        } else {

            const error = await response.json();

            registerMessage.className = "message error";

            registerMessage.textContent =
                error.message || "Registration failed.";

        }

    } catch (error) {

        console.error(error);

        registerMessage.className = "message error";

        registerMessage.textContent =
            "Unable to connect to the server.";
    }

});