console.log("OFFICER DASHBOARD JS LOADED");
console.log(document.getElementById("applicationsContainer"));
console.log(document.getElementById("totalCount"));
const container =
    document.getElementById("applicationsContainer");

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


// ================= CHECK STAFF LOGIN =================

if (!staffEmail || staffRole !== "OFFICER") {

    window.location.href = "staff-login.html";

}


// ================= LOAD APPLICATIONS =================

async function loadApplications() {

    try {

        const response =
            await fetch(
                "http://localhost:8081/applications",
                {
                    credentials: "include"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load applications"
            );

        }
        const applications = await response.json();
        const totalCount =
            applications.filter(
                application =>
                    application.status !== "WITHDRAWN"
            ).length;


        const pendingCount =
            applications.filter(
                application =>
                    application.status === "SUBMITTED" ||
                    application.status === "PENDING"
            ).length;


        const rejectedCount =
            applications.filter(
                application =>
                    application.status === "REJECTED"
            ).length;


        document.getElementById("totalCount").textContent =
            totalCount;

        document.getElementById("pendingCount").textContent =
            pendingCount;

        document.getElementById("rejectedCount").textContent =
            rejectedCount;

        const reviewApplications = applications.filter(
            application =>
                application.status === "SUBMITTED" ||
                application.status === "PENDING"
        );

        container.innerHTML = "";


        if (reviewApplications.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <div>📋</div>

                    <h3>
                        No applications
                    </h3>

                    <p>
                        There are no applications to review.
                    </p>

                </div>

            `;

            return;
        }


        reviewApplications.forEach(
            function(application) {

                const card =
                    document.createElement("div");

                card.className = "officer-application-card";


                const schemeName =
                    application.scheme
                        ? application.scheme.schemeName
                        : "Unknown Scheme";


                const applicant =
                    application.user
                        ? application.user.emailId
                        : "Unknown User";


                const status =
                    application.status ||
                    "SUBMITTED";


                card.innerHTML = `

    <div class="officer-card-header">

        <div>

            <p class="hero-tag">
                APPLICATION #${application.id}
            </p>

            <h3>
                ${schemeName}
            </h3>

            <p class="officer-applicant">
                Applicant: ${applicant}
            </p>

        </div>

        <span class="officer-status ${status.toLowerCase()}">
            ${status}
        </span>

    </div>


    <div class="officer-details">

        <div class="officer-detail">

            <small>
                Application Date
            </small>

            <strong>
                ${application.applicationDate}
            </strong>

        </div>


        

    </div>


    <div class="officer-action">

        <button
            class="btn primary-btn"
            onclick="viewApplication(${application.id})">

            View Application

        </button>

    </div>

`;


                container.appendChild(card);

            }
        );


    } catch(error) {

        console.error(error);

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ================= VIEW APPLICATION =================

function viewApplication(applicationId) {

    window.location.href =
        "officer-application.html?id="
        + applicationId;

}


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function() {

            localStorage.removeItem("staffEmail");
            localStorage.removeItem("staffRole");

            window.location.href =
                "staff-login.html";

        }
    );
// ================= PROFILE DROPDOWN =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");

const staffEmailElement =
    document.getElementById("staffEmail");

const dropdownStaffEmail =
    document.getElementById("dropdownStaffEmail");


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

loadApplications();