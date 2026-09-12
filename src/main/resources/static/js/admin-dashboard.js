const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


// ================= CHECK ADMIN LOGIN =================

if (!staffEmail || staffRole !== "ADMIN") {

    window.location.href =
        "staff-login.html";

}


// ================= PROFILE =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");

const staffEmailElement =
    document.getElementById("staffEmail");

const dropdownStaffEmail =
    document.getElementById(
        "dropdownStaffEmail"
    );


if (staffEmailElement) {

    staffEmailElement.textContent =
        staffEmail;

}


if (dropdownStaffEmail) {

    dropdownStaffEmail.textContent =
        staffEmail;

}


// ================= DROPDOWN =================

if (profileButton && profileDropdown) {

    profileButton.addEventListener(
        "click",
        function () {

            profileDropdown.classList.toggle(
                "show"
            );

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

            localStorage.removeItem(
                "staffEmail"
            );

            localStorage.removeItem(
                "staffRole"
            );


            window.location.href =
                "staff-login.html";

        }
    );

}