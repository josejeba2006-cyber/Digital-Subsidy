const detailsContainer =
    document.getElementById("applicationDetails");

const userEmail =
    localStorage.getItem("userEmail");

const params =
    new URLSearchParams(window.location.search);

const applicationId =
    params.get("applicationId");


function formatAmount(amount) {
    return Number(amount || 0).toLocaleString("en-IN");
}


function statusClass(status) {
    return String(status || "")
        .toLowerCase()
        .replaceAll(" ", "-");
}


async function getCurrentUser() {

    const response = await fetch(
        "http://localhost:8080/users",
        {
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Unable to load users.");
    }

    const users = await response.json();

    const currentUser = users.find(
        user =>
            user.emailId &&
            user.emailId.trim().toLowerCase() ===
            userEmail.trim().toLowerCase()
    );

    if (!currentUser) {
        throw new Error("User profile not found.");
    }

    return currentUser;
}


async function getApplication() {

    const response = await fetch(
        "http://localhost:8081/applications",
        {
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Unable to load applications.");
    }

    const applications = await response.json();

    const application =
        applications.find(
            item =>
                Number(item.id) === Number(applicationId)
        );

    if (!application) {
        throw new Error("Application not found.");
    }

    return application;
}


async function getDocuments() {

    try {

        const response = await fetch(
            `http://localhost:8081/documents/application/${applicationId}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            return [];
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Unable to load documents:",
            error
        );

        return [];
    }
}


async function getGrant(currentUser, application) {

    try {

        if (!application.scheme) {
            return null;
        }

        const response = await fetch(
            `http://localhost:8081/grant-slabs/scheme/${application.scheme.id}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        const slabs = await response.json();

        const income = currentUser.annualIncome;

        if (
            income === null ||
            income === undefined
        ) {
            return null;
        }

        return slabs.find(
            slab =>
                income >= slab.minimumIncome &&
                income <= slab.maximumIncome
        ) || null;

    } catch (error) {

        console.error(
            "Unable to load grant:",
            error
        );

        return null;
    }
}


async function getBankDetails() {

    try {

        const response = await fetch(
            `http://localhost:8081/bank-details/application/${applicationId}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        const text = await response.text();

        if (!text || !text.trim()) {
            return null;
        }

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Unable to load bank details:",
            error
        );

        return null;
    }
}


async function getInstallments() {

    try {

        const response = await fetch(
            `http://localhost:8081/installment-plans/application/${applicationId}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            return [];
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Unable to load installment plans:",
            error
        );

        return [];
    }
}


async function getMilestones() {

    try {

        const response = await fetch(
            `http://localhost:8081/compliance-milestones/application/${applicationId}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            return [];
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Unable to load compliance milestones:",
            error
        );

        return [];
    }
}


function renderDocuments(documents) {

    if (!documents.length) {

        return `
            <p class="empty-message">
                No documents uploaded.
            </p>
        `;
    }

    return documents.map(document => `

        <div class="document-row">

            <div class="document-name">

                <strong>
                    📄 ${document.documentType || "Document"}
                </strong>

                <small>
                    ${document.documentName || ""}
                </small>

            </div>

            <a
                href="http://localhost:8081/documents/${document.id}/file"
                target="_blank"
                class="view-pdf-btn"
            >
                View PDF
            </a>

        </div>

    `).join("");
}

function renderBankDetails(bankDetails, application) {

    if (application.status !== "DISTRICT_APPROVED") {
        return "";
    }

    // No bank details submitted
    if (!bankDetails) {
        return `
            <div class="details-card bank-details-card">

                <div class="details-header">

                    <div>
                        <h3 class="section-title">
                            🏦 Bank Details
                        </h3>

                        <p class="empty-message">
                            Add your bank account details to receive
                            the approved subsidy.
                        </p>
                    </div>

                    <a
                        href="bank-details.html?applicationId=${application.id}"
                        class="bank-details-btn"
                    >
                        Add Bank Details
                    </a>

                </div>

            </div>
        `;
    }

    const status =
        bankDetails.verificationStatus || "PENDING";

    if (status === "REJECTED") {

        return `
            <div class="details-card bank-details-card">

                <div class="details-header">

                    <div>
                        <h3 class="section-title">
                            🏦 Bank Details
                        </h3>

                        <p class="empty-message">
                            Your bank details were rejected.
                            Please submit them again.
                        </p>
                    </div>

                    <div>

                        <span class="
                            status-badge
                            status-rejected
                        ">
                            REJECTED
                        </span>

                        <br>

                        <a
                            href="bank-details.html?applicationId=${application.id}"
                            class="bank-details-btn"
                            style="margin-top: 10px;"
                        >
                            Resubmit Bank Details
                        </a>

                    </div>

                </div>

            </div>
        `;
    }

    return `
        <div class="details-card bank-details-card">

            <div class="details-header">

                <div>
                    <h3 class="section-title">
                        🏦 Bank Details
                    </h3>

                    <p class="empty-message">
                        Bank details submitted.
                    </p>
                </div>

                <span class="
                    status-badge
                    status-${statusClass(status)}
                ">
                    ${status}
                </span>

            </div>

        </div>
    `;
}

function renderInstallments(
    installments,
    milestones
) {

    if (!installments.length) {

        return `
            <p class="empty-message">
                No installment plan available.
            </p>
        `;
    }

    return installments
        .sort(
            (a, b) =>
                a.installmentNumber -
                b.installmentNumber
        )
        .map(installment => {

            const milestone =
                milestones.find(
                    item =>
                        item.installmentNumber ===
                        installment.installmentNumber
                );

            let proofHtml = "";

            /*
             * USER FLOW:
             * PAID installment -> utilization proof
             *
             * No Approve/Reject buttons here.
             * Admin handles verification separately.
             */

            if (
                installment.status === "PAID" &&
                milestone
            ) {

                // ==============================
                // PROOF VERIFIED
                // ==============================

                if (
                    milestone.status === "COMPLETED"
                ) {

                    proofHtml = `
            <div class="proof-box verified">

                <strong>
                    ✅ Utilization Proof Verified
                </strong>

            </div>
        `;

                }

                    // ==============================
                    // PROOF SUBMITTED - WAITING
                // ==============================

                else if (
                    milestone.status === "PENDING" &&
                    milestone.utilizationProof
                ) {

                    proofHtml = `
            <div class="proof-box">

                <strong>
                    📄 Utilization Proof Submitted
                </strong>

                <p>
                    Your utilization proof has been submitted
                    and is waiting for verification.
                </p>

                <span class="installment-status status-pending">
                    PENDING VERIFICATION
                </span>

            </div>
        `;

                }

                    // ==============================
                    // NO PROOF SUBMITTED
                // ==============================

                else {

                    proofHtml = `
            <div class="proof-box">

                <strong>
                    📋 Utilization Proof
                </strong>

                <p>
                    Upload a clear PDF copy of the work completed
                    for Installment ${installment.installmentNumber}.
                </p>

                <input
                    type="file"
                    id="proofFile-${milestone.id}"
                    accept="application/pdf,.pdf"
                    class="proof-file-input"
                >

                <button
                    class="proof-button"
                    onclick="submitUtilizationProof(${milestone.id})"
                >
                    📤 Submit Proof
                </button>

            </div>
        `;
                }
            }

            return `

                <div class="installment-row">

                    <div class="installment-name">

                        <strong>
                            Installment
                            ${installment.installmentNumber}
                        </strong>

                        <small>
                            ₹${formatAmount(installment.amount)}
                            (${installment.percentage}%)
                        </small>

                        ${
                milestone
                    ?
                    `
                            <small>
                                Milestone:
                                ${milestone.milestoneName || "Utilization"}
                            </small>

                            <small>
                                Due:
                                ${milestone.dueDate || "Not specified"}
                            </small>
                            `
                    :
                    ""
            }

                    </div>

                    <div>

                        <span class="
                            installment-status
                            status-${statusClass(installment.status)}
                        ">
                            ${installment.status}
                        </span>

                    </div>

                </div>

                ${proofHtml}

            `;
        })
        .join("");
}


function renderApplication(
    application,
    currentUser,
    documents,
    grant,
    bankDetails,
    installments,
    milestones
) {

    const schemeName =
        application.scheme
            ? application.scheme.schemeName
            : "Unknown Scheme";

    const status =
        application.status || "SUBMITTED";

    detailsContainer.innerHTML = `

        <div class="details-card">

            <div class="details-header">

                <div>

                    <p class="hero-tag">
                        APPLICATION #${application.id}
                    </p>

                    <h2>
                        ${schemeName}
                    </h2>

                </div>

                <span class="
                    status-badge
                    status-${statusClass(status)}
                ">
                    ${status}
                </span>

            </div>


            <div class="info-grid">

                <div class="info-item">
                    <small>Application ID</small>
                    <strong>#${application.id}</strong>
                </div>

                <div class="info-item">
                    <small>Application Date</small>
                    <strong>
                     ${application.applicationDate
        ? application.applicationDate.split("-").reverse().join("/")
        : "N/A"}
                    </strong>
                </div>

               <div class="info-item">
    <small>Name</small>
    <strong>
        ${currentUser.firstName || ""} ${currentUser.lastName || ""}
    </strong>
</div>

                <div class="info-item">
                    <small>Email</small>
                    <strong>
                        ${currentUser.emailId || "N/A"}
                    </strong>
                </div>

                <div class="info-item">
                    <small>Annual Income</small>
                    <strong>
                        ₹${formatAmount(currentUser.annualIncome)}
                    </strong>
                </div>

            </div>
            ${
        bankDetails &&
        bankDetails.verificationStatus === "VERIFIED"
            ? ""
            : renderWorkflow(application, bankDetails)
    }

</div>

${renderBankDetails(bankDetails, application)}
        <div class="details-card">

            <h3 class="section-title">
                💰 Grant Details
            </h3>

            <div class="grant-box">

                <small>
                    Applicable Grant Amount
                </small>

                <strong>
                    ₹${formatAmount(
        grant
            ? grant.grantAmount
            : 0
    )}
                </strong>

            </div>

        </div>

        <div class="verification-instruction">
    <h3>📋 Document Verification</h3>

    <p>
        Please review all uploaded documents and verify or reject each document.
        Update the verification status before processing the application.
    </p>
</div>
        <div class="details-card">

            <h3 class="section-title">
                📄 Uploaded Documents
            </h3>

            ${renderDocuments(documents)}

        </div>


        <div class="details-card">

            <h3 class="section-title">
                💳 Payment & Compliance
            </h3>

            ${renderInstallments(
        installments,
        milestones
    )}

        </div>

    `;
}
function renderWorkflow(application, bankDetails) {

    const status =
        application.status || "SUBMITTED";

    let fieldStatus = "PENDING";
    let districtStatus = "PENDING";
    let financeStatus = "PENDING";

    // FIELD VERIFICATION
    if (
        status === "FIELD_VERIFIED" ||
        status === "DISTRICT_APPROVED" ||
        status === "APPROVED"
    ) {
        fieldStatus = "VERIFIED";
    }

    // DISTRICT REVIEW
    if (
        status === "DISTRICT_APPROVED" ||
        status === "APPROVED"
    ) {
        districtStatus = "VERIFIED";
    }

    // FINANCE APPROVAL
    if (status === "APPROVED") {
        financeStatus = "VERIFIED";
    }

    return `
        <div class="workflow-box">

            <h3>Application Verification</h3>

            <div class="workflow-row">

                <span>
                    Field Verification
                </span>

                <span class="
                    status-badge
                    status-${statusClass(fieldStatus)}
                ">
                    ${fieldStatus}
                </span>

            </div>


            <div class="workflow-row">

                <span>
                    District Review
                </span>

                <span class="
                    status-badge
                    status-${statusClass(districtStatus)}
                ">
                    ${districtStatus}
                </span>

            </div>


            <div class="workflow-row">

                <span>
                    Finance Approval
                </span>

                <span class="
                    status-badge
                    status-${statusClass(financeStatus)}
                ">
                    ${financeStatus}
                </span>

            </div>

        </div>
    `;
}
async function submitUtilizationProof(milestoneId) {

    const fileInput =
        document.getElementById(
            `proofFile-${milestoneId}`
        );

    if (!fileInput || !fileInput.files.length) {

        alert("Please select a PDF file.");

        return;
    }

    const file =
        fileInput.files[0];


    if (file.type !== "application/pdf") {

        alert("Please select a PDF file.");

        return;
    }


    const confirmed =
        confirm(
            "Submit this utilization proof?"
        );

    if (!confirmed) {
        return;
    }


    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    try {

        const response =
            await fetch(
                `http://localhost:8081/documents/utilization-proof/${milestoneId}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to upload utilization proof."
            );

            return;
        }


        alert(
            "Utilization proof submitted successfully."
        );


        await loadApplicationDetails();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}
async function loadApplicationDetails() {

    if (!userEmail) {

        window.location.href =
            "login.html";

        return;
    }


    if (!applicationId) {

        detailsContainer.innerHTML = `
            <div class="empty-state">
                <h3>
                    Application not found
                </h3>
                <p>
                    No application ID was provided.
                </p>
            </div>
        `;

        return;
    }


    try {

        const currentUser =
            await getCurrentUser();

        const application =
            await getApplication();


        /*
         * Security check on the frontend:
         * show only the logged-in user's application.
         * Backend authorization should still remain the real security layer.
         */

        const belongsToUser =
            application.user &&
            (
                Number(application.user.id) ===
                Number(currentUser.id)

                ||

                (
                    application.user.emailId &&
                    currentUser.emailId &&
                    application.user.emailId
                        .trim()
                        .toLowerCase() ===
                    currentUser.emailId
                        .trim()
                        .toLowerCase()
                )
            );


        if (!belongsToUser) {

            throw new Error(
                "You are not authorized to view this application."
            );
        }


        const [
            documents,
            grant,
            bankDetails,
            installments,
            milestones
        ] = await Promise.all([
            getDocuments(),
            getGrant(currentUser, application),
            getBankDetails(),
            getInstallments(),
            getMilestones()
        ]);


        renderApplication(
            application,
            currentUser,
            documents,
            grant,
            bankDetails,
            installments,
            milestones
        );


    } catch (error) {

        console.error(error);

        detailsContainer.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load application
                </h3>

                <p>
                    ${error.message || "Please try again later."}
                </p>

                <a
                    href="my-applications.html"
                    class="btn primary-btn"
                >
                    Back to My Applications
                </a>

            </div>
        `;
    }
}


loadApplicationDetails();
