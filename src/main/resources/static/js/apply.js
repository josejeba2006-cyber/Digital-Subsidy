const schemeName =
    document.getElementById("schemeName");

const schemeDescription =
    document.getElementById("schemeDescription");

const schemeBenefits =
    document.getElementById("schemeBenefits");

const ageLimit =
    document.getElementById("ageLimit");

const occupation =
    document.getElementById("occupation");

const requiredDocuments =
    document.getElementById("requiredDocuments");

const applicationForm =
    document.getElementById("applicationForm");

const eligibleGrantMessage =
    document.getElementById("eligibleGrantMessage");

const grantSlabs =
    document.getElementById("grantSlabs");

const schemeId =
    new URLSearchParams(window.location.search)
        .get("schemeId");

const userEmail =
    localStorage.getItem("userEmail");

let currentScheme = null;
let currentUser = null;


// ================= LOAD APPLICATION =================

async function loadApplication() {

    try {

        if (!userEmail) {

            window.location.href =
                "login.html";

            return;
        }


        if (!schemeId) {

            window.location.href =
                "schemes.html";

            return;
        }


        // ================= GET USER =================

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


        currentUser =
            users.find(
                user =>
                    user.emailId &&
                    userEmail &&
                    user.emailId
                        .trim()
                        .toLowerCase() ===
                    userEmail
                        .trim()
                        .toLowerCase()
            );


        if (!currentUser) {

            window.location.href =
                "profile.html";

            return;
        }


        // ================= GET SCHEME =================

        const schemeResponse =
            await fetch(
                `http://localhost:8081/schemes/${schemeId}`,
                {
                    credentials: "include"
                }
            );


        if (!schemeResponse.ok) {

            throw new Error(
                "Unable to load scheme"
            );

        }


        currentScheme =
            await schemeResponse.json();


        // ================= DISPLAY SCHEME =================

        displayScheme();


        // ================= GET ALL GRANT SLABS =================

        const slabResponse =
            await fetch(
                `http://localhost:8081/grant-slabs/scheme/${schemeId}`,
                {
                    credentials: "include"
                }
            );


        const slabs =
            slabResponse.ok
                ? await slabResponse.json()
                : [];
        displayGrantSlabs(slabs);



        // ================= DISPLAY ALL GRANT SLABS =================




        // ================= DISPLAY AGE & OCCUPATION =================

        ageLimit.textContent =
            `${currentScheme.minimumAge || "-"} - ${currentScheme.maximumAge || "-"}`;


        occupation.textContent =
            currentScheme.eligibleOccupation || "ALL";


        // ================= CHECK OCCUPATION =================

        const userOccupation =
            currentUser.occupation
                ? currentUser.occupation
                    .trim()
                    .toLowerCase()
                : "";


        const schemeOccupation =
            currentScheme.eligibleOccupation
                ? currentScheme.eligibleOccupation
                    .trim()
                    .toLowerCase()
                : "";


        /*
         * Occupation is checked FIRST.
         */

        if (
            schemeOccupation &&
            schemeOccupation !== "all" &&
            userOccupation !== schemeOccupation
        ) {

            showNotEligible(
                "Occupation not eligible",
                `This scheme is available only for ${currentScheme.eligibleOccupation}. Your occupation is ${currentUser.occupation || "not specified"}.`
            );

            return;
        }


        // ================= CHECK AGE =================

        const userAge =
            Number(currentUser.age);


        const minimumAge =
            Number(currentScheme.minimumAge);


        const maximumAge =
            Number(currentScheme.maximumAge);


        if (
            userAge &&
            (
                userAge < minimumAge ||
                userAge > maximumAge
            )
        ) {

            showNotEligible(
                "Age not eligible",
                `This scheme is available for applicants between ${minimumAge} and ${maximumAge} years. Your age is ${userAge}.`
            );

            return;
        }


        // ================= CHECK INCOME =================

        const userIncome =
            Number(
                currentUser.annualIncome ||
                currentUser.income ||
                0
            );


        const matchingSlab =
            slabs.find(
                slab =>
                    userIncome >= Number(slab.minimumIncome) &&
                    userIncome <= Number(slab.maximumIncome)
            );

        displayGrantSlabs(slabs, matchingSlab);


        if (!matchingSlab) {

            showNotEligible(
                "Income not eligible",
                `Your annual income of ₹${userIncome.toLocaleString("en-IN")} does not fall within any eligible income range for this scheme.`
            );

            return;
        }


        // ================= ELIGIBLE =================

        showEligibleApplication(
            matchingSlab
        );

    }

    catch (error) {

        console.error(error);

        document.querySelector(
            ".apply-layout"
        ).innerHTML = `

            <div class="empty-state">

                <h2>
                    Unable to load application
                </h2>

                <p>
                    Please try again later.
                </p>

                <a
                    href="schemes.html"
                    class="auth-submit">
                    Back to Schemes
                </a>

            </div>

        `;
    }
}


// ================= DISPLAY SCHEME =================

function displayScheme() {

    schemeName.textContent =
        currentScheme.schemeName || "Scheme";


    schemeDescription.textContent =
        currentScheme.description ||
        "Financial support for eligible beneficiaries.";


    schemeBenefits.textContent =
        currentScheme.benefits ||
        currentScheme.description ||
        "This scheme provides financial assistance to eligible beneficiaries.";
}


// ================= DISPLAY ALL GRANT SLABS =================
function displayGrantSlabs(slabs, matchingSlab = null) {

    if (!grantSlabs) {
        return;
    }

    grantSlabs.innerHTML = "";

    if (!slabs || slabs.length === 0) {

        grantSlabs.innerHTML = `
            <p class="no-grant-slab">
                Grant details are not available.
            </p>
        `;

        return;
    }


    slabs.forEach(function (slab) {

        const slabCard =
            document.createElement("div");


        const isEligible =
            matchingSlab &&
            String(slab.id) === String(matchingSlab.id);


        slabCard.className =
            isEligible
                ? "grant-slab-card eligible-slab"
                : "grant-slab-card";


        const minimumIncome =
            Number(slab.minimumIncome || 0);

        const maximumIncome =
            Number(slab.maximumIncome || 0);

        const grantAmount =
            Number(slab.grantAmount || 0);


        slabCard.innerHTML = `

            <div class="slab-item">

                <span>
                    Income Range
                </span>

                <strong>
                    ₹${minimumIncome.toLocaleString("en-IN")}
                    -
                    ₹${maximumIncome.toLocaleString("en-IN")}
                </strong>

            </div>


            <div class="slab-item">

                <span>
                    Grant Amount
                </span>

                <strong>
                    ₹${grantAmount.toLocaleString("en-IN")}
                </strong>

            </div>

        `;


        grantSlabs.appendChild(slabCard);

    });
}

// ================= NOT ELIGIBLE =================

function showNotEligible(title, reason) {

    const applicationCard =
        document.querySelector(".application-card");


    if (!applicationCard) {
        return;
    }


    applicationCard.innerHTML = `

        <div class="not-eligible-card">

            <div class="status-icon">
                !
            </div>


            <p class="status-label">
                APPLICATION STATUS
            </p>


            <h2>
                Application Not Eligible
            </h2>


            <div class="eligibility-reason">

                <strong>
                    ${title}
                </strong>

                <p>
                    ${reason}
                </p>

            </div>


            <div class="not-eligible-action">

                <a
                    href="schemes.html"
                    class="other-schemes-btn">

                    View Other Schemes

                </a>

            </div>

        </div>

    `;
}


// ================= ELIGIBLE =================

function showEligibleApplication(matchingSlab) {

    if (!matchingSlab) {
        return;
    }


    const eligibleAmount =
        Number(matchingSlab.grantAmount || 0);


    if (!eligibleGrantMessage) {
        return;
    }


    eligibleGrantMessage.innerHTML = `

        <div class="eligible-grant-box">

            <span>
                Your Eligible Grant Amount
            </span>

            <strong>
                ₹${eligibleAmount.toLocaleString("en-IN")}
            </strong>

        </div>

    `;


    loadRequiredDocuments();
}
// ================= LOAD REQUIRED DOCUMENTS =================

// ======================================================
function loadRequiredDocuments() {

    requiredDocuments.innerHTML = "";


    if (!currentScheme.requiredDocuments) {

        requiredDocuments.innerHTML = `

            <div class="document-empty">

                <span class="document-empty-icon">
                    ✓
                </span>

                <div>
                    <strong>No documents required</strong>

                    <p>
                        No documents are required for this scheme.
                    </p>
                </div>

            </div>

        `;

        return;
    }


    const documents =
        currentScheme.requiredDocuments
            .split(",")
            .map(
                documentName =>
                    documentName.trim()
            )
            .filter(
                documentName =>
                    documentName !== ""
            );


    documents.forEach(
        function (documentName, index) {

            const documentDiv =
                document.createElement("div");


            documentDiv.className =
                "required-document";


            documentDiv.innerHTML = `

                <div class="document-number">
                   
                </div>


                <div class="document-content">

                    <div class="document-title">

                        <span class="document-icon">
                            
                        </span>

                        <strong>
                            ${documentName}
                        </strong>

                    </div>


                    <p>
                        Upload a clear PDF copy of this document.
                    </p>


                    <input
                        type="file"
                        class="document-file"
                        data-document-type="${documentName}"
                        accept=".pdf"   required              
                    >

                </div>

            `;

            requiredDocuments.appendChild(
                documentDiv
            );

        }
    );

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
// ================= SUBMIT APPLICATION =================

applicationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ================= CHECK DOCUMENTS =================

        const fileInputs =
            document.querySelectorAll(".document-file");


        for (const input of fileInputs) {

            if (!input.files || !input.files[0]) {

                alert(
                    "Please upload " +
                    input.dataset.documentType
                );

                input.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                return;
            }


            // PDF validation
            const file =
                input.files[0];

            if (
                file.type !== "application/pdf" &&
                !file.name.toLowerCase().endsWith(".pdf")
            ) {

                alert(
                    "Please upload a PDF file for " +
                    input.dataset.documentType
                );

                input.value = "";

                input.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                return;
            }
        }


        // ================= CONFIRM =================

        const confirmed =
            confirm(
                "Are you sure you want to submit this application?"
            );


        if (!confirmed) {
            return;
        }


        // ================= SUBMIT =================

        try {

            const response =
                await fetch(
                    "http://localhost:8081/applications",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            user: {
                                id: currentUser.id
                            },

                            scheme: {
                                id: currentScheme.id
                            },

                            status: "SUBMITTED"

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to submit application"
                );
            }


            const application =
                await response.json();
            const fileInputs =
                document.querySelectorAll(".document-file");

            for (const input of fileInputs) {

                const file = input.files[0];

                const formData = new FormData();

                formData.append("file", file);
                formData.append(
                    "documentType",
                    input.dataset.documentType
                );
                formData.append(
                    "applicationId",
                    application.id
                );

                await fetch(
                    "http://localhost:8081/documents/upload",
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData
                    }
                );
            }


            // ================= SUCCESS =================

            alert(
                "Application submitted successfully!"
            );


            window.location.href =
                "my-applications.html";


        } catch (error) {

            console.error(error);

            alert(
                "Unable to submit application. Please try again."
            );
        }

    }
);
// ================= START =================

loadApplication();