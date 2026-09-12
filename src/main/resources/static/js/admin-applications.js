const API_URL =
    "http://localhost:8081/applications";

const applicationsTableBody =
    document.getElementById(
        "applicationsTableBody"
    );

const applicationFormCard =
    document.getElementById(
        "applicationFormCard"
    );

const applicationForm =
    document.getElementById(
        "applicationForm"
    );

const applicationStatus =
    document.getElementById(
        "applicationStatus"
    );

const rejectionReasonGroup =
    document.getElementById(
        "rejectionReasonGroup"
    );

const rejectionReason =
    document.getElementById(
        "rejectionReason"
    );

let editingApplicationId = null;


// ================= LOAD APPLICATIONS =================

async function loadApplications() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load applications"
            );

        }

        const applications =
            await response.json();


        applicationsTableBody.innerHTML = "";


        if (applications.length === 0) {

            applicationsTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No applications found.
                    </td>
                </tr>
            `;

            return;

        }


        applications.forEach(function(application) {

            const row =
                document.createElement("tr");


            let applicantName = "-";

            if (application.user) {

                applicantName =
                    `${application.user.firstName || ""}
                     ${application.user.lastName || ""}`;

            }


            let schemeName = "-";

            if (application.scheme) {

                schemeName =
                    application.scheme.schemeName || "-";

            }


            row.innerHTML = `

                <td>
                    ${application.id}
                </td>

                <td>
                    ${applicantName}
                </td>

                <td>
                    ${schemeName}
                </td>

                <td>
                    ${application.applicationDate || "-"}
                </td>

                <td>
                    ${application.status || "PENDING"}
                </td>

                <td>

                    <button
                        class="action-btn edit-user-btn"
                        onclick="viewApplication(${application.id})">

                        View

                    </button>

                </td>

            `;


            applicationsTableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);


        applicationsTableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    Unable to load applications.
                </td>

            </tr>

        `;

    }

}


// ================= VIEW APPLICATION =================

async function viewApplication(id) {

    try {

        const response =
            await fetch(
                API_URL + "/" + id
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load application"
            );

        }


        const application =
            await response.json();


        editingApplicationId = id;


        document.getElementById(
            "applicantName"
        ).value =
            application.user
                ? `${application.user.firstName || ""}
                   ${application.user.lastName || ""}`
                : "";


        document.getElementById(
            "schemeName"
        ).value =
            application.scheme
                ? application.scheme.schemeName
                : "";


        applicationStatus.value =
            application.status || "PENDING";


        document.getElementById(
            "remarks"
        ).value =
            application.remarks || "";


        rejectionReason.value =
            application.rejectionReason || "";


        if (
            application.status === "REJECTED"
        ) {

            rejectionReasonGroup.style.display =
                "flex";

        }

        else {

            rejectionReasonGroup.style.display =
                "none";

        }


        applicationFormCard.style.display =
            "block";


        applicationFormCard.scrollIntoView({
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load application details."
        );

    }

}


// ================= STATUS CHANGE =================

applicationStatus.addEventListener(
    "change",
    function() {

        if (
            applicationStatus.value === "REJECTED"
        ) {

            rejectionReasonGroup.style.display =
                "flex";

        }

        else {

            rejectionReasonGroup.style.display =
                "none";

        }

    }
);


// ================= UPDATE APPLICATION =================

applicationForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (
            editingApplicationId === null
        ) {

            return;

        }


        try {

            let response;


            // APPROVE

            if (
                applicationStatus.value ===
                "APPROVED"
            ) {

                response =
                    await fetch(
                        API_URL +
                        "/" +
                        editingApplicationId +
                        "/approve",
                        {
                            method: "PUT"
                        }
                    );

            }


            // REJECT

            else if (
                applicationStatus.value ===
                "REJECTED"
            ) {

                const reason =
                    rejectionReason.value.trim();


                if (!reason) {

                    alert(
                        "Please enter rejection reason."
                    );

                    return;

                }


                response =
                    await fetch(
                        API_URL +
                        "/" +
                        editingApplicationId +
                        "/reject?remarks=" +
                        encodeURIComponent(reason),
                        {
                            method: "PUT"
                        }
                    );

            }


            else {

                alert(
                    "Only APPROVED or REJECTED status can be updated by admin."
                );

                return;

            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Unable to update application"
                );

            }


            alert(
                "Application updated successfully."
            );


            applicationFormCard.style.display =
                "none";


            editingApplicationId = null;


            loadApplications();

        }

        catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Unable to update application."
            );

        }

    }
);


// ================= CANCEL =================

document.getElementById(
    "cancelApplicationBtn"
).addEventListener(
    "click",
    function() {

        applicationForm.reset();

        applicationFormCard.style.display =
            "none";

        editingApplicationId = null;

    }
);


// ================= INITIAL LOAD =================

loadApplications();