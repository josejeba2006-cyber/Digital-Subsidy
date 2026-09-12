const schemeContainer =
    document.getElementById("schemeContainer");


const schemeuserEmail =
    localStorage.getItem("userEmail");


// ================= LOAD SCHEMES =================

async function loadSchemes() {

    try {

        if (!schemeuserEmail) {

            window.location.href = "login.html";

            return;
        }


        // ================= GET USERS =================

        const userResponse =
            await fetch(
                "http://localhost:8081/users",
                {
                    credentials: "include"
                }
            );


        if (!userResponse.ok) {

            throw new Error(
                "Unable to load users"
            );

        }


        const users =
            await userResponse.json();


        // ================= FIND CURRENT USER =================

        const currentUser =
            users.find(
                user =>
                    user.emailId &&
                    user.emailId
                        .trim()
                        .toLowerCase() ===
                    schemeuserEmail
                        .trim()
                        .toLowerCase()
            );


        if (!currentUser) {

            window.location.href =
                "profile.html";

            return;
        }


        // ================= GET SCHEMES =================

        const response =
            await fetch(
                "http://localhost:8081/schemes",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load schemes"
            );

        }


        const schemes =
            await response.json();


        // ================= GET APPLICATIONS =================

        const applicationResponse =
            await fetch(
                "http://localhost:8081/applications",
                {
                    credentials: "include"
                }
            );


        if (!applicationResponse.ok) {

            throw new Error(
                "Unable to load applications"
            );

        }


        const applications =
            await applicationResponse.json();


        schemeContainer.innerHTML = "";


        // ================= NO SCHEMES =================

        if (schemes.length === 0) {

            schemeContainer.innerHTML = `

                <div class="empty-state">

                    <h3>
                        No schemes available
                    </h3>

                    <p>
                        Currently, no subsidy schemes are available.
                    </p>

                </div>

            `;

            return;
        }


        // ================= DISPLAY SCHEMES =================

        for (const scheme of schemes) {


            // ================= GET GRANT SLABS =================

            const slabResponse =
                await fetch(
                    `http://localhost:8081/grant-slabs/scheme/${scheme.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            let slabs = [];


            if (slabResponse.ok) {

                slabs =
                    await slabResponse.json();

            }


            // ================= FIND HIGHEST GRANT =================

            const maximumGrant =
                slabs.length > 0
                    ? Math.max(
                        ...slabs.map(
                            slab =>
                                Number(
                                    slab.grantAmount
                                )
                        )
                    )
                    : 0;


            // ================= CREATE CARD =================

            const card =
                document.createElement("div");

            card.className =
                "scheme-card";


            // ================= CHECK APPLICATION =================

            const existingApplication =
                applications.find(
                    application =>
                        application.user &&
                        application.scheme &&
                        application.user.id ===
                        currentUser.id &&
                        application.scheme.id ===
                        scheme.id &&
                        ![
                            "WITHDRAWN",
                            "REJECTED"
                        ].includes(
                            application.status
                        )
                );


            // ================= BUTTON =================

            let buttonHTML;


            if (existingApplication) {

                buttonHTML = `

                    <button
                        class="scheme-btn"
                        disabled>

                        Already Applied

                    </button>

                `;

            } else {

                buttonHTML = `

                    <button
                        class="scheme-btn"
                        onclick="applyForScheme(${scheme.id})">

                        Apply Now

                    </button>

                `;

            }


            // ================= CARD =================

            card.innerHTML = `

                <div class="scheme-top">

                    <span class="scheme-badge">

                        ${scheme.status}

                    </span>

                </div>


                <h3>

                    ${scheme.schemeName}

                </h3>


                <p class="scheme-description">

                    ${scheme.description ||
            "No description available"}

                </p>


                <!-- ================= GRANT ================= -->

                <div class="scheme-grant">

                    <small>
                        Grant up to
                    </small>

                    <strong>
                        ₹${maximumGrant.toLocaleString("en-IN")}
                    </strong>

                </div>


                <!-- ================= ELIGIBLE FOR ================= -->

                <div class="scheme-eligible">

                    <strong>
                        Eligible for:
                    </strong>

                    ${scheme.eligibleOccupation ||
            "All applicants"}

                </div>


                <!-- ================= BUTTON ================= -->

                ${buttonHTML}

            `;


            schemeContainer.appendChild(card);

        }


    } catch (error) {

        console.error(error);


        schemeContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load schemes
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ================= APPLY =================

function applyForScheme(schemeId) {

    window.location.href =
        "apply.html?schemeId=" + schemeId;

}


// ================= VIEW APPLICATION =================

function viewApplication() {

    window.location.href =
        "my-applications.html";

}


// ================= LOGOUT =================

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


// ================= LOAD =================

loadSchemes();