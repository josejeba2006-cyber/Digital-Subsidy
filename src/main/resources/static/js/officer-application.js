const documentsContainer =
    document.getElementById("documentsContainer");


// ================= GET APPLICATION ID =================

const params = new URLSearchParams(window.location.search);

const applicationId = params.get("applicationId");

const staffRole =
    localStorage.getItem("staffRole");

const staffEmail =
    localStorage.getItem("staffEmail");

if (!staffEmail || !staffRole) {
    window.location.href = "staff-login.html";
}

if (!applicationId) {
    alert("Invalid application.");
    window.location.href = "staff-login.html";
}
// ================= APPLICATION DECISION =================

const approveApplicationBtn =
    document.getElementById("approveApplicationBtn");

const rejectApplicationBtn =
    document.getElementById("rejectApplicationBtn");

const confirmRejectBtn =
    document.getElementById("confirmRejectBtn");

const cancelRejectBtn =
    document.getElementById("cancelRejectBtn");

const rejectionSection =
    document.getElementById("rejectionSection");

const rejectionReason =
    document.getElementById("rejectionReason");

const otherReasonSection =
    document.getElementById("otherReasonSection");

const otherReason =
    document.getElementById("otherReason");

// ================= LOAD APPLICATION =================

if (!applicationId) {

    if (documentsContainer) {
        documentsContainer.innerHTML =
            "<p>Invalid application.</p>";
    }

} else {

    loadApplication();
    loadApplicationDetails();
    loadDocuments();

}


// ================= LOAD APPLICATION DETAILS =================

async function loadApplication() {

    try {

        console.log(
            "Loading application:",
            applicationId
        );


        const response =
            await fetch(
                `http://localhost:8081/applications/${applicationId}`,
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load application"
            );

        }


        const application =
            await response.json();


        console.log(
            "Application:",
            application
        );


        // ================= APPLICANT =================

        const applicantEmail =
            document.getElementById("applicantEmail");

        if (applicantEmail) {

            applicantEmail.textContent =
                application.user
                    ? application.user.emailId
                    : "Not available";

        }


        // ================= SCHEME =================

        const schemeName =
            document.getElementById("schemeName");

        if (schemeName) {

            schemeName.textContent =
                application.scheme
                    ? application.scheme.schemeName
                    : "Not available";

        }


        // ================= APPLICATION DATE =================

        const applicationDate =
            document.getElementById("applicationDate");

        if (applicationDate) {

            if (application.applicationDate) {

                const date =
                    new Date(
                        application.applicationDate
                    );

                applicationDate.textContent =
                    date.toLocaleDateString("en-IN");

            } else {

                applicationDate.textContent =
                    "Date not available";

            }

        }


        // ================= STATUS =================

        const applicationStatus =
            document.getElementById("applicationStatus");

        if (applicationStatus) {

            applicationStatus.textContent =
                application.status || "SUBMITTED";

        }


        // ================= GRANT AMOUNT =================

        const grantAmount =
            document.getElementById("grantAmount");

        if (grantAmount) {

            let amount =
                application.grantAmount;


            /*
             * If grantAmount is not directly stored
             * in Application, try to get it from
             * the application object.
             */

            if (
                amount === null ||
                amount === undefined
            ) {

                amount =
                    application.eligibleGrantAmount;

            }


            if (
                amount !== null &&
                amount !== undefined
            ) {

                grantAmount.textContent =
                    "₹" +
                    Number(amount)
                        .toLocaleString("en-IN");

            } else {

                grantAmount.textContent =
                    "Grant amount not available";

            }

        }


    } catch (error) {

        console.error(
            "Application loading error:",
            error
        );

    }

}
// ================= LOAD APPLICATION DETAILS =================

async function loadApplicationDetails() {

    try {

        console.log(
            "Loading application:",
            applicationId
        );


        const response =
            await fetch(
                `http://localhost:8081/applications/${applicationId}`,
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load application"
            );

        }


        const application =
            await response.json();


        console.log(
            "Application:",
            application
        );


        // ================= APPLICATION DETAILS =================

        const applicationIdElement =
            document.getElementById("applicationId");

        const applicantNameElement =
            document.getElementById("applicantName");

        const applicantEmailElement =
            document.getElementById("applicantEmail");

        const applicantAgeElement =
            document.getElementById("applicantAge");

        const applicantOccupationElement =
            document.getElementById("applicantOccupation");

        const annualIncomeElement =
            document.getElementById("annualIncome");

        const applicationDateElement =
            document.getElementById("applicationDate");

        const applicationStatusElement =
            document.getElementById("applicationStatus");


        if (applicationIdElement) {

            applicationIdElement.textContent =
                application.id || "-";

        }


        if (applicantEmailElement) {

            applicantEmailElement.textContent =
                application.user?.emailId || "-";

        }


        if (applicantNameElement) {

            const firstName =
                application.user?.firstName || "";

            const lastName =
                application.user?.lastName || "";

            applicantNameElement.textContent =
                `${firstName} ${lastName}`.trim() || "-";

        }


        if (applicantAgeElement) {

            const dob = application.user?.dateofbirth;

            if (dob) {
                const [year, month, day] = dob.split("-");

                applicantAgeElement.textContent =
                    `${Number(day)}/${Number(month)}/${year}`;
            } else {
                applicantAgeElement.textContent = "-";
            };

        }


        if (applicantOccupationElement) {

            applicantOccupationElement.textContent =
                application.user?.occupation || "-";

        }


        if (annualIncomeElement) {

            const income =
                application.user?.annualIncome;

            annualIncomeElement.textContent =
                income != null
                    ? "₹" + Number(income).toLocaleString("en-IN")
                    : "-";

        }


        if (applicationDateElement) {

            applicationDateElement.textContent =
                application.applicationDate
                    ? new Date(
                        application.applicationDate
                    ).toLocaleDateString("en-IN")
                    : "Date not available";

        }


        if (applicationStatusElement) {

            applicationStatusElement.textContent =
                application.status || "-";

        }


        // ================= SCHEME DETAILS =================
        const scheme =
            application.scheme;
        if (scheme?.id) {
            loadGrantDetails(scheme.id,application);
        }


        const schemeNameElement =
            document.getElementById("schemeName");

        const schemeDescriptionElement =
            document.getElementById("schemeDescription");

        const eligibleOccupationElement =
            document.getElementById("schemeOccupation");

        const ageLimitElement =
            document.getElementById("schemeAgeLimit");


        if (schemeNameElement) {

            schemeNameElement.textContent =
                scheme?.schemeName || "-";

        }


        if (schemeDescriptionElement) {

            schemeDescriptionElement.textContent =
                scheme?.description || "-";

        }
        if (eligibleOccupationElement) {
            eligibleOccupationElement.textContent =
                scheme?.eligibleOccupation || "-";
        }

        if (ageLimitElement) {

            if (
                scheme?.minimumAge != null &&
                scheme?.maximumAge != null
            ) {

                ageLimitElement.textContent =
                    `${scheme.minimumAge} - ${scheme.maximumAge} `;

            } else {

                ageLimitElement.textContent = "-";

            }
        }

    } catch (error) {

        console.error(
            "Application loading error:",
            error
        );

    }

}
async function loadGrantDetails(schemeId,application) {

    const grantTable =
        document.getElementById("grantDetailsTable");

    const applicableRange =
        document.getElementById("applicableIncomeRange");

    const applicableAmount =
        document.getElementById("applicableGrantAmount");


    if (!grantTable) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:8081/grant-slabs/scheme/${schemeId}`,
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {
            throw new Error("Unable to load grant details");
        }


        const slabs =
            await response.json();
        const annualIncome =
            Number(application.user?.annualIncome || 0);

        const applicableSlab =
            slabs.find(function(slab) {

                return annualIncome >= Number(slab.minimumIncome) &&
                    annualIncome <= Number(slab.maximumIncome);

            });


        if (applicableSlab) {

            if (applicableRange) {

                applicableRange.textContent =
                    `₹${Number(
                        applicableSlab.minimumIncome
                    ).toLocaleString("en-IN")}
            - ₹${Number(
                        applicableSlab.maximumIncome
                    ).toLocaleString("en-IN")}`;

            }


            if (applicableAmount) {

                applicableAmount.textContent =
                    `₹${Number(
                        applicableSlab.grantAmount
                    ).toLocaleString("en-IN")}`;

            }

        } else {

            if (applicableRange) {
                applicableRange.textContent = "--";
            }

            if (applicableAmount) {
                applicableAmount.textContent = "--";
            }

        }


        grantTable.innerHTML = "";


        if (slabs.length === 0) {

            grantTable.innerHTML = `
                <tr>
                    <td colspan="2">
                        No grant details available.
                    </td>
                </tr>
            `;

            return;
        }


        slabs.forEach(function(slab) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ₹${Number(
                slab.minimumIncome
            ).toLocaleString("en-IN")}
                    -
                    ₹${Number(
                slab.maximumIncome
            ).toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${Number(
                slab.grantAmount
            ).toLocaleString("en-IN")}
                </td>

            `;


            grantTable.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Grant details error:",
            error
        );

        grantTable.innerHTML = `
            <tr>
                <td colspan="2">
                    Unable to load grant details.
                </td>
            </tr>
        `;

    }
}


// ================= LOAD DOCUMENTS =================

async function loadDocuments() {

    try {

        console.log(
            "Loading documents for application:",
            applicationId
        );


        const response =
            await fetch(
                `http://localhost:8081/documents/application/${applicationId}`,
                {
                    credentials: "include"
                }
            );


        console.log(
            "Document response:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load documents"
            );

        }


        const documents =
            await response.json();


        console.log(
            "Documents:",
            documents
        );


        if (!documentsContainer) {

            console.error(
                "documentsContainer not found"
            );

            return;

        }


        documentsContainer.innerHTML = "";


        if (documents.length === 0) {

            documentsContainer.innerHTML = `

                <p>
                    No documents uploaded.
                </p>

            `;

            return;

        }


        documents.forEach(function(doc) {

            const status =
                doc.verificationStatus ||
                "PENDING";


            const card =
                document.createElement("div");


            card.className =
                "document-card";
            card.innerHTML = `

    <div class="document-name">

        <span class="document-icon">
            📄
        </span>

        <div class="document-info">

            <strong>
                ${doc.documentType}
            </strong>

            <small>
                ${doc.documentName}
            </small>

            <span class="
                verification-status
                ${status.toLowerCase()}
            ">
                ${status}
            </span>

        </div>

    </div>


    <div class="document-actions">

        <button
            class="view-pdf-btn"
            onclick="viewPDF(${doc.id})">

            View PDF

        </button>

    </div>

`;
            documentsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Document loading error:",
            error
        );


        if (documentsContainer) {

            documentsContainer.innerHTML = `

                <p>
                    Unable to load documents.
                </p>

            `;

        }

    }

}


// ================= APPLICATION DECISION =================



// ================= APPROVE APPLICATION =================

if (approveApplicationBtn) {

    approveApplicationBtn.addEventListener(
        "click",
        async function () {

            try {

                const verificationLevel =
                    staffRole === "FIELD_OFFICER"
                        ? "field"
                        : staffRole === "DISTRICT_OFFICER"
                            ? "district"
                            : staffRole === "FINANCE_OFFICER"
                                ? "finance"
                                : "";

                if (!verificationLevel) {
                    alert("Invalid officer role.");
                    return;
                }

                const response = await fetch(
                    `http://localhost:8081/api/verifications/${verificationLevel}/${applicationId}?decision=APPROVED`,
                    {
                        method: "PUT",
                        credentials: "include"
                    }
                );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    alert(
                        errorText ||
                        "Unable to approve application."
                    );

                    return;
                }


                await response.json();


                alert(
                    "Application approved successfully."
                );
                window.location.href =
                    staffRole === "FIELD_OFFICER"
                        ? "field-officer.html"
                        : staffRole === "DISTRICT_OFFICER"
                            ? "district-officer.html"
                            : "finance-officer.html";

            }
            catch (error) {

                console.error(error);

                alert(
                    "Unable to connect to server."
                );

            }

        }
    );

}
// ================= REJECT APPLICATION =================

if (rejectApplicationBtn) {

    rejectApplicationBtn.addEventListener(
        "click",
        function () {

            rejectionSection.style.display =
                "block";

        }
    );

}
// ================= OTHER REASON =================

if (rejectionReason) {

    rejectionReason.addEventListener(
        "change",
        function () {

            if (this.value === "Other") {

                otherReasonSection.style.display =
                    "block";

            }
            else {

                otherReasonSection.style.display =
                    "none";

                otherReason.value = "";

            }

        }
    );

}
// ================= CANCEL REJECTION =================

if (cancelRejectBtn) {

    cancelRejectBtn.addEventListener(
        "click",
        function () {

            rejectionSection.style.display =
                "none";

            rejectionReason.value =
                "";

            otherReason.value =
                "";

            otherReasonSection.style.display =
                "none";

        }
    );

}
// ================= CONFIRM REJECTION =================

if (confirmRejectBtn) {

    confirmRejectBtn.addEventListener(
        "click",
        async function () {

            let reason =
                rejectionReason.value;


            // No reason selected
            if (!reason) {

                alert(
                    "Please select a rejection reason."
                );

                return;

            }


            // Other reason
            if (reason === "Other") {

                reason =
                    otherReason.value.trim();


                if (!reason) {

                    alert(
                        "Please enter the rejection reason."
                    );

                    return;

                }

            }


            try {

                const verificationLevel =
                    staffRole === "FIELD_OFFICER"
                        ? "field"
                        : staffRole === "DISTRICT_OFFICER"
                            ? "district"
                            : "";

                if (!verificationLevel) {
                    alert("Invalid officer role.");
                    return;
                }

                const response =
                    await fetch(
                        `http://localhost:8081/api/verifications/${verificationLevel}/${applicationId}?decision=REJECTED&remarks=${encodeURIComponent(reason)}`,
                        {
                            method: "PUT",
                            credentials: "include"
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    alert(
                        errorText ||
                        "Unable to reject application."
                    );

                    return;

                }


                await response.json();


                alert(
                    "Application rejected successfully."
                );


                window.location.href =
                    staffRole === "FIELD_OFFICER"
                        ? "field-officer.html"
                        : staffRole === "DISTRICT_OFFICER"
                            ? "district-officer.html"
                            : "finance-officer.html";

            }
            catch (error) {

                console.error(error);

                alert(
                    "Unable to connect to server."
                );

            }

        }
    );

}


// ================= VIEW PDF =================

function viewPDF(documentId) {

    window.open(
        `http://localhost:8080/documents/${documentId}/file`,
        "_blank"
    );

}


// ================= LOGOUT =================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("staffEmail");
            localStorage.removeItem("staffRole");

            window.location.href =
                "staff-login.html";

        }
    );

}