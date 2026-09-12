const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");

const userEmail = localStorage.getItem("userEmail");

let currentUserId = null;


// ================= LOAD EXISTING PROFILE =================

async function loadProfile() {

    if (!userEmail) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("emailId").value =
        userEmail || "";

    try {

        const response = await fetch(
            "http://localhost:8081/users",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load users");
        }

        const users = await response.json();

        const currentUser = users.find(
            user =>
                user.emailId &&
                user.emailId.trim().toLowerCase() ===
                userEmail.trim().toLowerCase()
        );

        if (currentUser) {

            // Store ID for PUT update
            currentUserId = currentUser.id;


            // ================= USER DETAILS =================

            document.getElementById("firstName").value =
                currentUser.firstName || "";

            document.getElementById("lastName").value =
                currentUser.lastName || "";

            document.getElementById("phone").value =
                currentUser.phone || "";


            // ================= EMAIL =================

            document.getElementById("emailId").value =
                currentUser.emailId || userEmail;


            // ================= GENDER =================

            document.getElementById("gender").value =
                currentUser.gender || "";


            // ================= DATE OF BIRTH =================

            document.getElementById("dateofbirth").value =
                currentUser.dateofbirth || "";


            // ================= BENEFICIARY CATEGORY =================

            document.getElementById("beneficiaryCategory").value =
                currentUser.beneficiaryCategory || "";


            // ================= ANNUAL INCOME =================

            document.getElementById("annualIncome").value =
                currentUser.annualIncome || "";


            // ================= OCCUPATION =================

            document.getElementById("occupation").value =
                currentUser.occupation || "";


            // ================= LOCATION =================

            document.getElementById("location").value =
                currentUser.location || "";


            // ================= BUTTON =================

            document.querySelector(".auth-submit").textContent =
                "Update Details";


            // ================= PROFILE HEADER =================

            document.getElementById("profileName").textContent =
                currentUser.firstName +
                " " +
                currentUser.lastName;

            document.getElementById("profileEmail").textContent =
                currentUser.emailId;

        }

    } catch (error) {

        console.error(
            "Profile loading failed:",
            error
        );

    }
}
// ================= SAVE / UPDATE PROFILE =================

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const user = {

            firstName:
            document.getElementById("firstName").value,

            lastName:
            document.getElementById("lastName").value,

            phone:
            document.getElementById("phone").value,
            gender: document.getElementById("gender").value,

            emailId: userEmail,

            dateofbirth:
            document.getElementById("dateofbirth").value,
            beneficiaryCategory:
            document.getElementById("beneficiaryCategory").value,

            annualIncome:
                Number(
                    document.getElementById("annualIncome").value
                ),

            occupation:
            document.getElementById("occupation").value,

            location:
            document.getElementById("location").value
        };


        try {

            let response;


            // Existing profile → UPDATE
            if (currentUserId) {

                response = await fetch(
                    "http://localhost:8081/users/" + currentUserId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify(user)
                    }
                );

            }

            // No profile → CREATE
            else {

                response = await fetch(
                    "http://localhost:8081/users",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify(user)
                    }
                );

            }


            if (response.ok) {

                profileMessage.className =
                    "message success";

                profileMessage.textContent =
                    currentUserId
                        ? "Profile updated successfully!"
                        : "Profile saved successfully!";


                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 1000);

            } else {

                profileMessage.className =
                    "message error";

                profileMessage.textContent =
                    "Unable to save profile.";

            }

        } catch (error) {

            console.error(error);

            profileMessage.className =
                "message error";

            profileMessage.textContent =
                "Unable to connect to the server.";

        }

    }
);


// ================= LOGOUT =================

document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("userEmail");

        window.location.href = "login.html";

    });


// Load profile when page opens
loadProfile();