const staffEmail = localStorage.getItem("staffEmail");
const staffRole = localStorage.getItem("staffRole");

if (!staffEmail || staffRole !== "FIELD_OFFICER") {
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


// Display logged-in email

if (staffEmailElement) {
    staffEmailElement.textContent = staffEmail;
}

if (dropdownStaffEmail) {
    dropdownStaffEmail.textContent = staffEmail;
}


// Profile dropdown

if (profileButton && profileDropdown) {

    profileButton.addEventListener(
        "click",
        function () {

            profileDropdown.classList.toggle("show");

        }
    );

}
const applicationsContainer =
    document.getElementById("applicationsContainer");

async function loadApplications() {

    try {

        const response = await fetch(
            "http://localhost:8080/applications",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load applications.");
        }

        const applications = await response.json();

        // Field Officer handles only SUBMITTED applications
        const fieldApplications =
            applications.filter(application =>
                application.status === "SUBMITTED"
            );

        if (fieldApplications.length === 0) {

            applicationsContainer.innerHTML = `
                <tr>
                    <td colspan="7" class="empty">
                        <h3>No applications available</h3>
                        <p>
                            There are no submitted applications
                            waiting for field verification.
                        </p>
                    </td>
                </tr>
            `;

            return;
        }

        applicationsContainer.innerHTML =
            fieldApplications.map(application => {

                const user = application.user || {};
                const scheme = application.scheme || {};

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
                            <span class="score">
                                ${application.eligibilityScore ?? "N/A"}
                            </span>
                        </td>

                        <td>
                            <span class="routing-badge">
                                ${application.routingStatus || "NORMAL"}
                            </span>
                        </td>

                        <td>
                            <span class="status-badge submitted">
                                ${application.status}
                            </span>
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

            }).join("");

    } catch (error) {

        console.error(error);

        applicationsContainer.innerHTML = `
            <tr>
                <td colspan="7" class="empty">

                    <h3>Unable to load applications</h3>

                    <p>
                        ${error.message}
                    </p>

                </td>
            </tr>
        `;
    }
}


// ================= REVIEW APPLICATION =================

function reviewApplication(applicationId) {

    window.location.href =
        `officer-application.html?applicationId=${applicationId}`;
}


// ================= LOGOUT =================
// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("staffEmail");
        localStorage.removeItem("staffRole");

        window.location.href = "staff-login.html";

    });

}


loadApplications();