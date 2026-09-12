const staffEmail = localStorage.getItem("staffEmail");
const staffRole = localStorage.getItem("staffRole");


// Only District Officer can access
if (
    !staffEmail ||
    staffRole !== "DISTRICT_OFFICER"
) {
    window.location.href = "staff-login.html";
}


// ================= PROFILE =================

const staffEmailElement =
    document.getElementById("staffEmail");

const dropdownStaffEmail =
    document.getElementById("dropdownStaffEmail");

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");


if (staffEmailElement) {
    staffEmailElement.textContent = staffEmail;
}

if (dropdownStaffEmail) {
    dropdownStaffEmail.textContent = staffEmail;
}


if (profileButton && profileDropdown) {

    profileButton.addEventListener(
        "click",
        function () {

            profileDropdown.classList.toggle("show");

        }
    );

}


// ================= MY PROFILE =================

const myProfileBtn =
    document.getElementById("myProfileBtn");

if (myProfileBtn) {

    myProfileBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );

}


// ================= APPLICATIONS =================

const applicationsContainer =
    document.getElementById(
        "applicationsContainer"
    );


async function loadApplications() {

    try {

        const response = await fetch(
            "http://localhost:8081/applications",
            {
                credentials: "include"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Unable to load applications."
            );
        }


        const applications =
            await response.json();


        // Only FIELD_VERIFIED applications

        const applicationsForDistrict =
            applications.filter(
                application =>
                    application.status ===
                    "FIELD_VERIFIED"
            );


        // No applications

        if (!applicationsForDistrict.length) {

            applicationsContainer.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">

                        <h3>
                            No applications available
                        </h3>

                        <p>
                            There are no field-verified
                            applications waiting for
                            district review.
                        </p>

                    </td>
                </tr>
            `;

            return;
        }


        // Display applications

        applicationsContainer.innerHTML =
            applicationsForDistrict
                .map(application => {

                    const user =
                        application.user || {};

                    const scheme =
                        application.scheme || {};


                    return `
                        <tr>

                            <td>
                                #${application.id}
                            </td>

                            <td>
                                ${scheme.schemeName || "N/A"}
                            </td>

                            <td>
                                ${user.firstName || ""}
                                ${user.lastName || ""}
                            </td>

                            <td>
                                ${application.eligibilityScore ?? "N/A"}
                            </td>

                            <td>
                                ${application.routingStatus || "NORMAL"}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="review-btn"
                                    onclick="reviewApplication(${application.id})">

                                    Review

                                </button>

                            </td>

                        </tr>
                    `;

                })
                .join("");


    } catch (error) {

        console.error(error);


        applicationsContainer.innerHTML = `
            <tr>

                <td colspan="6" class="empty">

                    <h3>
                        Unable to load applications
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </td>

            </tr>
        `;

    }

}


// ================= REVIEW =================

function reviewApplication(applicationId) {

    window.location.href =
        `officer-application.html?applicationId=${applicationId}`;

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


// ================= START =================

loadApplications();