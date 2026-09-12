const userEmail = localStorage.getItem("userEmail");


// ================= LOGIN CHECK =================

if (!userEmail) {

    window.location.href = "login.html";

} else {

    // ================= PROFILE DROPDOWN =================

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const navUserEmail =
        document.getElementById("navUserEmail");

    const dropdownEmail =
        document.getElementById("dropdownEmail");


    // Display logged-in user's email

    if (navUserEmail) {

        navUserEmail.textContent = userEmail;

    }

    if (dropdownEmail) {

        dropdownEmail.textContent = userEmail;

    }


    // Profile dropdown toggle

    if (profileButton && profileDropdown) {

        profileButton.addEventListener("click", function () {

            profileDropdown.classList.toggle("show");

        });

    }


    // ================= CHECK PROFILE =================

    async function checkUserProfile() {

        try {

            const response = await fetch(
                "http://localhost:8081/users",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


            if (!response.ok) {

                console.log("Unable to get users");

                return;

            }


            const users = await response.json();


            const currentUser = users.find(
                user =>
                    user.emailId &&
                    user.emailId.trim().toLowerCase() ===
                    userEmail.trim().toLowerCase()
            );


            console.log("LOGIN EMAIL:", userEmail);

            console.log("MATCHED USER:", currentUser);


            if (!currentUser) {

                alert("Please complete your profile first.");

                window.location.href = "profile.html";

                return;

            }


            console.log(
                "User profile found:",
                currentUser
            );

        }
        catch (error) {

            console.error(
                "Profile check failed:",
                error
            );

        }

    }


    // ================= MY PROFILE =================

    const myProfileBtn =
        document.getElementById("myProfileBtn");

    if (myProfileBtn) {

        myProfileBtn.addEventListener(
            "click",
            function () {

                window.location.href = "profile.html";

            }
        );

    }


    // ================= LOGOUT =================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                localStorage.removeItem("userEmail");

                window.location.href = "login.html";

            }
        );

    }


    // ================= START PROFILE CHECK =================

    checkUserProfile();

}