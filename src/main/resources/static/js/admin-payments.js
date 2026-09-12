const paymentsContainer =
    document.getElementById("paymentsContainer");

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


// ================= ADMIN LOGIN CHECK =================

// ================= ADMIN / FINANCE OFFICER LOGIN CHECK =================

// ================= NAVBAR ACCESS =================

if (staffRole === "FINANCE_OFFICER") {
    document
        .querySelectorAll(".admin-only")
        .forEach(item => {
            item.style.display = "none";
        });
}


// ================= LOAD PAYMENTS =================

async function loadPayments() {

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


        const applications =
            await response.json();


        paymentsContainer.innerHTML = "";

        let paymentFound = false;


        // ================= LOOP APPLICATIONS =================

        for (const application of applications) {


            // Only APPROVED applications

            if (application.status !== "APPROVED") {
                continue;
            }


            // ================= BANK DETAILS =================

            let bankDetails = null;

            try {

                const bankResponse =
                    await fetch(
                        "http://localhost:8081/bank-details/application/"
                        + application.id,
                        {
                            credentials: "include"
                        }
                    );


                if (bankResponse.ok) {

                    const bankText =
                        await bankResponse.text();


                    if (bankText.trim() !== "") {

                        bankDetails =
                            JSON.parse(bankText);
                    }
                }

            } catch (error) {

                console.error(
                    "Unable to load bank details:",
                    error
                );

                continue;
            }


            // Only VERIFIED bank details

            if (
                bankDetails?.verificationStatus !==
                "VERIFIED"
            ) {
                continue;
            }
            // ================= COMPLIANCE MILESTONES =================
            let complianceMilestones = [];

            try {
                const complianceResponse =
                    await fetch(
                        "http://localhost:8081/compliance-milestones/application/"
                        + application.id,
                        {
                            credentials: "include"
                        }
                    );

                if (complianceResponse.ok) {
                    complianceMilestones =
                        await complianceResponse.json();
                }

            } catch (error) {
                console.error(
                    "Unable to load compliance milestones:",
                    error
                );
            }
            // ================= UTILIZATION PROOF DOCUMENTS =================
            let documents = [];

            try {

                const documentResponse =
                    await fetch(
                        "http://localhost:8081/documents/application/"
                        + application.id,
                        {
                            credentials: "include"
                        }
                    );

                if (documentResponse.ok) {

                    documents =
                        await documentResponse.json();

                }

            } catch (error) {

                console.error(
                    "Unable to load documents:",
                    error
                );
            }

            // ================= INSTALLMENT PLANS =================

            let installmentPlans = [];

            try {

                const installmentResponse =
                    await fetch(
                        "http://localhost:8081/installment-plans/application/"
                        + application.id,
                        {
                            credentials: "include"
                        }
                    );


                if (installmentResponse.ok) {

                    installmentPlans =
                        await installmentResponse.json();
                }

            } catch (error) {

                console.error(
                    "Unable to load installment plans:",
                    error
                );
            }


            if (installmentPlans.length === 0) {

                continue;
            }


            // ================= DISBURSEMENTS =================

            let disbursements = [];

            try {

                const disbursementResponse =
                    await fetch(
                        "http://localhost:8081/disbursements",
                        {
                            credentials: "include"
                        }
                    );


                if (disbursementResponse.ok) {

                    const allDisbursements =
                        await disbursementResponse.json();


                    disbursements =
                        allDisbursements.filter(
                            d =>
                                d.application &&
                                Number(d.application.id) ===
                                Number(application.id)
                        );
                }

            } catch (error) {

                console.error(
                    "Unable to load disbursements:",
                    error
                );
            }


            paymentFound = true;


            // ================= APPLICATION DATA =================

            const schemeName =
                application.scheme
                    ? application.scheme.schemeName
                    : "Unknown Scheme";


            const applicant =
                application.user
                    ? application.user.emailId
                    : "Unknown User";


            // ================= ACCOUNT NUMBER =================

            const accountNumber =
                bankDetails.accountNumber || "";


            const maskedAccount =
                accountNumber.length >= 4
                    ? "XXXXXX" +
                    accountNumber.slice(-4)
                    : accountNumber;


            // ================= TOTAL GRANT =================

            const totalGrant =
                installmentPlans.reduce(
                    (total, installment) =>
                        total +
                        Number(
                            installment.amount || 0
                        ),
                    0
                );


            // ================= SORT INSTALLMENTS =================

            installmentPlans.sort(
                (a, b) =>
                    a.installmentNumber -
                    b.installmentNumber
            );


            // ================= CREATE CARD =================

            const card =
                document.createElement("div");

            card.className =
                "payment-card";


            card.innerHTML = `

                <div class="payment-card-header">

                    <div>

                        <p class="hero-tag">
                            APPLICATION #${application.id}
                        </p>

                        <h3>
                            ${schemeName}
                        </h3>

                        <p>
                            Applicant:
                            ${applicant}
                        </p>

                    </div>

                    <span class="payment-status">
                        BANK VERIFIED
                    </span>

                </div>


                <div class="payment-details">

                    <div class="payment-detail">

                        <small>
                            Bank Name
                        </small>

                        <strong>
                            ${bankDetails.bankName}
                        </strong>

                    </div>


                    <div class="payment-detail">

                        <small>
                            Account Number
                        </small>

                        <strong>
                            ${maskedAccount}
                        </strong>

                    </div>


                    <div class="payment-detail">

                        <small>
                            IFSC Code
                        </small>

                        <strong>
                            ${bankDetails.ifscCode}
                        </strong>

                    </div>

                </div>


                <div class="payment-detail total-grant">

                    <small>
                        Total Grant
                    </small>

                    <strong>
                        ₹${Number(
                totalGrant
            ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div class="admin-installments">

                    <h4>
                        💰 Installment Plan
                    </h4>

                    <div class="admin-installment-list">

                        ${
                installmentPlans
                    .map(
                        installment =>
                            createInstallmentHTML(
                                installment,
                                complianceMilestones,
                                documents,
                                disbursements,
                                application.id
                            )
                    )
                    .join("")
            }

                    </div>

                </div>

            `;


            paymentsContainer.appendChild(card);


            // ================= BUTTON EVENTS =================

            const buttons =
                card.querySelectorAll(
                    ".process-installment-btn"
                );
            // ============================================================
// UTILIZATION PROOF VERIFY
// ============================================================
            // ============================================================
// VERIFY UTILIZATION PROOF
// ============================================================

            const verifyButtons =
                card.querySelectorAll(".verify-proof-btn");

            verifyButtons.forEach(button => {

                button.addEventListener(
                    "click",
                    async function () {

                        const documentId =
                            this.dataset.documentId;

                        const milestoneId =
                            this.dataset.milestoneId;

                        const proofPath =
                            this.dataset.proofPath;


                        const confirmed =
                            confirm(
                                "Verify this utilization proof?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            // ===============================
                            // VERIFY DOCUMENT
                            // ===============================

                            const documentResponse =
                                await fetch(
                                    "http://localhost:8081/documents/"
                                    + documentId
                                    + "/verify",
                                    {
                                        method: "PUT",
                                        credentials: "include"
                                    }
                                );


                            if (!documentResponse.ok) {

                                const error =
                                    await documentResponse.text();

                                alert(
                                    error ||
                                    "Unable to verify document."
                                );

                                return;
                            }


                            // ===============================
                            // COMPLETE MILESTONE
                            // ===============================

                            const milestoneResponse =
                                await fetch(
                                    "http://localhost:8081/compliance-milestones/"
                                    + milestoneId
                                    + "/complete?utilizationProof="
                                    + encodeURIComponent(proofPath),
                                    {
                                        method: "PUT",
                                        credentials: "include"
                                    }
                                );


                            if (!milestoneResponse.ok) {

                                const error =
                                    await milestoneResponse.text();

                                alert(
                                    error ||
                                    "Unable to complete milestone."
                                );

                                return;
                            }


                            alert(
                                "Utilization proof verified successfully!"
                            );


                            // Reload UI

                            loadPayments();

                        } catch (error) {

                            console.error(
                                "Verification error:",
                                error
                            );

                            alert(
                                "Unable to connect to server."
                            );
                        }

                    }
                );
            });


            buttons.forEach(button => {

                button.addEventListener(
                    "click",
                    async function () {

                        const applicationId =
                            Number(
                                this.dataset.applicationId
                            );

                        const installmentNumber =
                            Number(
                                this.dataset.installmentNumber
                            );

                        const amount =
                            Number(
                                this.dataset.amount
                            );


                        // Check application ID

                        if (!applicationId || applicationId <= 0) {

                            alert(
                                "Invalid application ID"
                            );

                            console.error(
                                "Invalid application ID:",
                                this.dataset.applicationId
                            );

                            return;
                        }


                        // Check installment

                        if (!installmentNumber ||
                            installmentNumber <= 0) {

                            alert(
                                "Invalid installment number"
                            );

                            return;
                        }


                        // Check amount

                        if (!amount || amount <= 0) {

                            alert(
                                "Invalid installment amount"
                            );

                            return;
                        }


                        const confirmed =
                            confirm(
                                "Process Installment "
                                + installmentNumber
                                + " payment of ₹"
                                + amount.toLocaleString("en-IN")
                                + "?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        // ================= DISBURSEMENT =================

                        const disbursement = {

                            application: {

                                id: applicationId

                            },

                            amount: amount,

                            installmentNumber:
                            installmentNumber,

                            paymentStatus:
                                "PAID"
                        };


                        console.log(
                            "Sending disbursement:",
                            disbursement
                        );


                        try {

                            const paymentResponse =
                                await fetch(
                                    "http://localhost:8081/disbursements",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        credentials:
                                            "include",

                                        body:
                                            JSON.stringify(
                                                disbursement
                                            )
                                    }
                                );


                            if (!paymentResponse.ok) {

                                const error =
                                    await paymentResponse.text();

                                console.error(
                                    "Payment error:",
                                    error
                                );

                                alert(
                                    error ||
                                    "Payment processing failed"
                                );

                                return;
                            }


                            alert(
                                "Installment "
                                + installmentNumber
                                + " processed successfully!"
                            );


                            // Reload payments UI

                            loadPayments();


                        } catch (error) {

                            console.error(
                                "Payment request failed:",
                                error
                            );

                            alert(
                                "Unable to connect to server"
                            );
                        }

                    }
                );

            });

        }


        // ================= NO PAYMENTS =================

        if (!paymentFound) {

            paymentsContainer.innerHTML = `

                <div class="empty-state">

                    <div>
                        💳
                    </div>

                    <h3>
                        No payments pending
                    </h3>

                    <p>
                        There are no approved applications
                        with verified bank details and
                        installment plans.
                    </p>

                </div>

            `;
        }


    } catch (error) {

        console.error(error);


        paymentsContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load payments
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;
    }
}


// ============================================================
// CREATE INSTALLMENT UI
// ============================================================

function createInstallmentHTML(
    installment,
    complianceMilestones,
    documents,
    disbursements,
    applicationId
) {

    const installmentNumber =
        Number(installment.installmentNumber);

    const amount =
        Number(installment.amount || 0);


    // ========================================================
    // CHECK PAYMENT ALREADY EXISTS
    // ========================================================

    const alreadyDisbursed =
        disbursements.some(
            d =>
                Number(d.installmentNumber) ===
                installmentNumber
        );


    // ========================================================
    // FIND PREVIOUS INSTALLMENT
    // ========================================================

    const previousInstallment =
        installmentNumber - 1;


    // ========================================================
    // FIND PREVIOUS MILESTONE
    // ========================================================

    const previousMilestone =
        complianceMilestones.find(
            milestone =>
                Number(milestone.installmentNumber) ===
                previousInstallment
        );


    // ========================================================
    // FIND PREVIOUS UTILIZATION PROOF
    // ========================================================

    const previousProofs =
        documents.filter(
            document =>
                document.documentType ===
                "UTILIZATION_PROOF_" +
                previousInstallment
        );


    // Get latest proof
    const previousProof =
        previousProofs.length > 0
            ? previousProofs[
            previousProofs.length - 1
                ]
            : null;


    let proofHTML = "";
    let statusHTML = "";
    let buttonHTML = "";


    // ========================================================
    // PAID
    // ========================================================

    if (
        installment.status === "PAID" ||
        alreadyDisbursed
    ) {

        statusHTML = `
            <div class="installment-admin-status paid">
                ✅ <strong>PAID</strong>
            </div>
        `;
    }


        // ========================================================
        // INSTALLMENT 1 AVAILABLE
    // ========================================================

    else if (
        installmentNumber === 1 &&
        installment.status === "AVAILABLE"
    ) {

        statusHTML = `
            <div class="installment-admin-status available">
                🟢 <strong>AVAILABLE</strong>
            </div>
        `;

        buttonHTML = `
            <button
                class="process-installment-btn"
                data-application-id="${applicationId}"
                data-installment-number="${installmentNumber}"
                data-amount="${amount}"
            >
                💳 Process Installment ${installmentNumber}
            </button>
        `;
    }


        // ========================================================
        // INSTALLMENT 2 / 3 AVAILABLE
    // ========================================================

    else if (
        installment.status === "AVAILABLE"
    ) {


        // ====================================================
        // PREVIOUS PROOF VERIFIED
        // ====================================================

        if (
            previousMilestone &&
            previousMilestone.status === "COMPLETED"
        ) {

            proofHTML = `
                <div class="utilization-proof-admin verified">

                    <strong>
                        📄 Utilization Proof ${previousInstallment}
                    </strong>

                    ${
                previousProof
                    ? `
                                <a
                                    href="http://localhost:8081/documents/${previousProof.id}/file"
                                    target="_blank"
                                    class="view-utilization-btn"
                                >
                                    View PDF
                                </a>
                              `
                    : ""
            }

                </div>
            `;


            statusHTML = `
                <div class="installment-admin-status available">
                    🟢 <strong>AVAILABLE</strong>
                </div>
            `;


            buttonHTML = `
                <button
                    class="process-installment-btn"
                    data-application-id="${applicationId}"
                    data-installment-number="${installmentNumber}"
                    data-amount="${amount}"
                >
                    💳 Process Installment ${installmentNumber}
                </button>
            `;
        }


            // ====================================================
            // PROOF SUBMITTED - WAITING FOR VERIFICATION
        // ====================================================

        else if (
            previousProof &&
            previousProof.verificationStatus === "PENDING"
        ) {

            proofHTML = `
                <div class="utilization-proof-admin">

                    <strong>
                        📄 Utilization Proof ${previousInstallment}
                    </strong>

                    <a
                        href="http://localhost:8081/documents/${previousProof.id}/file"
                        target="_blank"
                        class="view-utilization-btn"
                    >
                        View PDF
                    </a>

                    <div class="proof-actions">

                        <button
                            class="verify-proof-btn"
                            data-document-id="${previousProof.id}"
                            data-milestone-id="${previousMilestone.id}"
                            data-proof-path="${previousProof.documentPath}"
                        >
                            ✅ Verify
                        </button>

                        <button
                            class="reject-proof-btn"
                            data-document-id="${previousProof.id}"
                        >
                            ❌ Reject
                        </button>

                    </div>

                </div>
            `;


            statusHTML = `
                <div class="installment-admin-status waiting">
                    🔒 WAITING FOR PROOF VERIFICATION
                </div>
            `;


            buttonHTML = `
                <button
                    class="process-installment-btn"
                    disabled
                >
                    💳 Process Installment ${installmentNumber}
                </button>
            `;
        }


            // ====================================================
            // PROOF REJECTED
        // ====================================================

        else if (
            previousProof &&
            previousProof.verificationStatus === "REJECTED"
        ) {

            proofHTML = `
                <div class="utilization-proof-admin rejected">

                    <strong>
                        📄 Utilization Proof ${previousInstallment}
                    </strong>

                    <span class="proof-status">
                        ❌ Rejected
                    </span>

                    <a
                        href="http://localhost:8081/documents/${previousProof.id}/file"
                        target="_blank"
                        class="view-utilization-btn"
                    >
                        View PDF
                    </a>

                </div>
            `;


            statusHTML = `
                <div class="installment-admin-status waiting">
                    🔒 WAITING FOR RESUBMISSION
                </div>
            `;


            buttonHTML = `
                <button
                    class="process-installment-btn"
                    disabled
                >
                    💳 Process Installment ${installmentNumber}
                </button>
            `;
        }


            // ====================================================
            // NO PROOF
        // ====================================================

        else {

            proofHTML = `
                <div class="utilization-proof-admin missing">

                    <strong>
                        📄 Utilization Proof ${previousInstallment}
                    </strong>

                    <small>
                        Not submitted
                    </small>

                </div>
            `;


            statusHTML = `
                <div class="installment-admin-status waiting">
                    🔒 WAITING FOR PROOF
                </div>
            `;


            buttonHTML = `
                <button
                    class="process-installment-btn"
                    disabled
                >
                    💳 Process Installment ${installmentNumber}
                </button>
            `;
        }

    }


        // ========================================================
        // LOCKED
    // ========================================================

    else {

        statusHTML = `
            <div class="installment-admin-status locked">
                🔒 LOCKED
            </div>
        `;
    }


    // ========================================================
    // RETURN CARD
    // ========================================================

    return `
        <div class="admin-installment-card">

            <!-- INSTALLMENT -->
            <div class="admin-installment-left">

                <span class="admin-installment-number">
                    INSTALLMENT ${installmentNumber}
                </span>

                <h4>
                    Installment ${installmentNumber}
                </h4>

                <p class="admin-installment-percentage">
                    ${installment.percentage}%
                </p>

            </div>


            <!-- AMOUNT -->
            <div class="admin-installment-amount">

                <strong>
                    ₹${amount.toLocaleString("en-IN")}
                </strong>

            </div>


            <!-- PROOF -->
            <div class="admin-installment-proof">

                ${proofHTML}

            </div>


            <!-- STATUS + BUTTON -->
            <div class="admin-installment-action">

                ${statusHTML}

                ${buttonHTML}

            </div>

        </div>
    `;
}

// ============================================================
// PROFILE
// ============================================================

const staffEmailElement =
    document.getElementById(
        "staffEmail"
    );


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
document.addEventListener("click", async function(event) {

    if (
        event.target.classList.contains(
            "reject-proof-btn"
        )
    ) {

        const documentId =
            event.target.dataset.documentId;


        const reason =
            prompt(
                "Enter rejection reason:"
            );


        if (
            reason === null ||
            reason.trim() === ""
        ) {

            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:8081/documents/${documentId}/reject?reason=${encodeURIComponent(reason)}`,
                    {
                        method: "PUT",
                        credentials: "include"
                    }
                );


            if (response.ok) {

                alert(
                    "Utilization proof rejected. Email sent to the user."
                );

                location.reload();

            } else {

                const error =
                    await response.text();

                alert(
                    error ||
                    "Failed to reject utilization proof."
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );
        }
    }

});


// ============================================================
// PROFILE DROPDOWN
// ============================================================

const profileButton =
    document.getElementById(
        "profileButton"
    );


const profileDropdown =
    document.getElementById(
        "profileDropdown"
    );


if (
    profileButton &&
    profileDropdown
) {

    profileButton.addEventListener(
        "click",
        function () {

            profileDropdown.classList.toggle(
                "show"
            );

        }
    );
}


// ============================================================
// LOGOUT
// ============================================================

document
    .getElementById("logoutBtn")
    .addEventListener(
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



// ============================================================
// START
// ============================================================

loadPayments();