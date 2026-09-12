const container =
    document.getElementById("eligibleSchemeContainer");

const userEmail =
    localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "login.html";
}


const navUserEmail =
    document.getElementById("navUserEmail");

const dropdownEmail =
    document.getElementById("dropdownEmail");

if (navUserEmail) {
    navUserEmail.textContent = userEmail;
}

if (dropdownEmail) {
    dropdownEmail.textContent = userEmail;
}


async function loadEligibleSchemes() {

    try {

        // Get all users
        const userResponse = await fetch(
            "http://localhost:8081/users",
            {
                credentials: "include"
            }
        );

        if (!userResponse.ok) {
            throw new Error("Unable to load user");
        }

        const users = await userResponse.json();


        // Find logged-in user's profile
        const currentUser = users.find(
            user =>
                user.emailId &&
                userEmail &&
                user.emailId.trim().toLowerCase() ===
                userEmail.trim().toLowerCase()
        );


        if (!currentUser) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>Profile not found</h3>

                    <p>
                        Please complete your profile first.
                    </p>

                    <a href="profile.html"
                       class="btn primary-btn">
                        Complete Profile
                    </a>
                </div>
            `;

            return;
        }


        // Get eligible schemes
        const response = await fetch(
            "http://localhost:8081/schemes/eligible/" +
            currentUser.id,
            {
                credentials: "include"
            }
        );


        if (!response.ok) {
            throw new Error("Unable to load eligible schemes");
        }


        const schemes = await response.json();


        // Get all applications
        const applicationResponse = await fetch(
            "http://localhost:8081/applications",
            {
                credentials: "include"
            }
        );

        if (!applicationResponse.ok) {
            throw new Error("Unable to load applications");
        }

        const applications =
            await applicationResponse.json();


        // Get all disbursements
        const disbursementResponse = await fetch(
            "http://localhost:8081/disbursements",
            {
                credentials: "include"
            }
        );

        if (!disbursementResponse.ok) {
            throw new Error("Unable to load disbursements");
        }

        const disbursements =
            await disbursementResponse.json();


        container.innerHTML = "";


        if (schemes.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div>📋</div>

                    <h3>No eligible schemes</h3>

                    <p>
                        Currently, no subsidy schemes match
                        your profile.
                    </p>

                </div>
            `;

            return;
        }
        schemes.forEach(function (item) {

            const scheme = item.scheme;
            const grantSlab = item.grantSlab;
            const eligibilityScore =
                item.eligibilityScore;

            const card = document.createElement("div");

            card.className = "scheme-card";


            const existingApplication =
                applications.find(
                    application =>
                        application.user &&
                        application.scheme &&
                        application.user.id === currentUser.id &&
                        application.scheme.id === scheme.id &&
                        ![
                            "WITHDRAWN",
                            "REJECTED"
                        ].includes(application.status)
                );


// Check whether payment has already been completed
            const alreadyDisbursed =
                disbursements.some(
                    disbursement =>
                        disbursement.application &&
                        Number(disbursement.application.user?.id) === Number(currentUser.id) &&
                        Number(disbursement.application.scheme?.id) === Number(scheme.id)
                );


            let buttonHtml;


            if (existingApplication || alreadyDisbursed) {

                buttonHtml = `
            <button
                class="scheme-btn"
                disabled>
                Already Applied
            </button>
        `;

            } else {

                buttonHtml = `
            <button
                class="scheme-btn"
                onclick="applyForScheme(${scheme.id})">
                Apply Now
            </button>
        `;
            }


            card.innerHTML = `

        <div class="scheme-top">

            <span class="scheme-badge">
                ELIGIBLE
            </span>

        </div>


        <h3>
            ${scheme.schemeName}
        </h3>


        <p>
            ${scheme.description || ""}
        </p>


        <div class="scheme-info">

            <div>
                <small>Eligible Grant</small>
                <strong>
                    ₹${grantSlab ? grantSlab.grantAmount : 0}
                </strong>
            </div>


            <div>
                <small>Income Slab</small>
                <strong>
                    ₹${grantSlab ? grantSlab.minimumIncome : 0}
                    -
                    ₹${grantSlab ? grantSlab.maximumIncome : 0}
                </strong>
            </div>

        </div>


        <div class="scheme-details">
        <p>
            <strong>Category:</strong>
            ${scheme.eligibleBeneficiaryCategory || "ALL"}
        </p>


            <p>
                <strong>Location:</strong>
                ${scheme.eligibleLocation || "ALL"}
            </p>


            <p>
                <strong>Age:</strong>
                ${scheme.minimumAge} - ${scheme.maximumAge}
            </p>


            <p>
                <strong>Occupation:</strong>
                ${scheme.eligibleOccupation}
            </p>

        </div>


        ${buttonHtml}

    `;


            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load eligible schemes
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;
    }
}


async function applyForScheme(schemeId) {

    try {

        // Get users
        const userResponse =
            await fetch(
                "http://localhost:8081/users",
                {
                    credentials: "include"
                }
            );


        if (!userResponse.ok) {
            throw new Error("Unable to load user");
        }


        const users =
            await userResponse.json();


        // Find current user
        const currentUser =
            users.find(
                user =>
                    user.emailId &&
                    userEmail &&
                    user.emailId.trim().toLowerCase() ===
                    userEmail.trim().toLowerCase()
            );


        if (!currentUser) {

            alert(
                "Please complete your profile first."
            );

            return;
        }


        // Get all applications
        const applicationResponse =
            await fetch(
                "http://localhost:8081/applications",
                {
                    credentials: "include"
                }
            );


        if (!applicationResponse.ok) {

            throw new Error(
                "Unable to check applications"
            );
        }


        const applications =
            await applicationResponse.json();
        const disbursementResponse =
            await fetch(
                "http://localhost:8081/disbursements",
                {
                    credentials: "include"
                }
            );

        if (!disbursementResponse.ok) {
            throw new Error(
                "Unable to check disbursements"
            );
        }

        const disbursements =
            await disbursementResponse.json();


        // Check existing ACTIVE application
        const alreadyDisbursed =
            disbursements.some(
                disbursement =>
                    disbursement.application &&
                    Number(disbursement.application.user?.id) === Number(currentUser.id) &&
                    Number(disbursement.application.scheme?.id) === Number(schemeId)
            );

        if (alreadyDisbursed) {

            alert(
                "You have already received the subsidy for this scheme."
            );

            return;
        }




        // Allow application if:
        // No previous application
        // OR previous status = WITHDRAWN
        // OR previous status = REJECTED

        window.location.href =
            "apply.html?schemeId=" + schemeId;

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to check your application status."
        );
    }
}


// Logout
document.getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "userEmail"
            );

            window.location.href =
                "login.html";

        }
    );


// Load schemes
loadEligibleSchemes();