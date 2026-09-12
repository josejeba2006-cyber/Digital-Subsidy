(function () {

    const loggedInEmail =
        localStorage.getItem("userEmail");

    const staffEmail =
        localStorage.getItem("staffEmail");

    const staffRole =
        localStorage.getItem("staffRole");


    // ================= LOGIN CHECK =================

    if (!loggedInEmail && !staffEmail) {
        window.location.href = "login.html";
        return;
    }


    // ================= EMAIL =================

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const navUserEmail =
        document.getElementById("navUserEmail");

    const dropdownEmail =
        document.getElementById("dropdownEmail");

    const logoutBtn =
        document.getElementById("logoutBtn");


    const email =
        staffEmail || loggedInEmail;


    if (navUserEmail) {
        navUserEmail.textContent = email;
    }

    if (dropdownEmail) {
        dropdownEmail.textContent = email;
    }


    // ================= FINANCE OFFICER =================
    // Hide admin-only navbar items

    if (staffRole === "FINANCE_OFFICER") {

        document
            .querySelectorAll(".admin-only")
            .forEach(item => {
                item.style.display = "none";
            });

    }


    // ================= DROPDOWN =================

    if (profileButton && profileDropdown) {

        profileButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                profileDropdown.classList.toggle("show");

            }
        );

    }


    // Close when clicking outside

    document.addEventListener(
        "click",
        function (event) {

            if (
                profileDropdown &&
                profileButton &&
                !profileButton.contains(event.target) &&
                !profileDropdown.contains(event.target)
            ) {

                profileDropdown.classList.remove("show");

            }

        }
    );


    // ================= LOGOUT =================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                localStorage.removeItem("userEmail");
                localStorage.removeItem("staffEmail");
                localStorage.removeItem("staffRole");

                window.location.href =
                    "staff-login.html";

            }
        );

    }

})();