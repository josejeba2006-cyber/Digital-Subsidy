const historyBody =
    document.getElementById("historyBody");


const API_URL =
    "http://localhost:8081/applications";


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


const remarks =
    document.getElementById(
        "remarks"
    );


const cancelApplicationBtn =
    document.getElementById(
        "cancelApplicationBtn"
    );


let editingApplicationId = null;


// =====================================
// LOAD HISTORY
// =====================================

async function loadHistory() {

    try {

        const response =
            await fetch(
                API_URL + "/history",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load history"
            );

        }


        const applications =
            await response.json();


        historyBody.innerHTML = "";


        if (applications.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No application records found.
                    </td>
                </tr>
            `;

            return;

        }


        applications.forEach(
            function (application) {

                const row =
                    document.createElement(
                        "tr"
                    );


                let applicantName =
                    "-";


                if (application.user) {

                    applicantName =
                        `
                        ${application.user.firstName || ""}
                        ${application.user.lastName || ""}
                        `;

                }


                let schemeName =
                    "-";


                if (application.scheme) {

                    schemeName =
                        application.scheme.schemeName
                        || "-";

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
                        ${application.status || "-"}
                    </td>


                    <td>

                        <button
                            class="view-btn"
                            onclick="viewApplication(${application.id})"
                        >

                            View

                        </button>

                    </td>

                `;


                historyBody.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(error);


        historyBody.innerHTML = `

            <tr>

                <td colspan="6">

                    Unable to load application records.

                </td>

            </tr>

        `;

    }

}


// =====================================
// VIEW APPLICATION
// =====================================

async function viewApplication(id) {

    try {

        const response =
            await fetch(
                API_URL + "/" + id,
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


        editingApplicationId =
            id;


        // APPLICANT NAME

        document.getElementById(
            "applicantName"
        ).value =

            application.user

                ? (
                    (application.user.firstName || "")
                    + " "
                    + (application.user.lastName || "")
                )

                : "";


        // SCHEME NAME

        document.getElementById(
            "schemeName"
        ).value =

            application.scheme

                ? (
                    application.scheme.schemeName
                    || ""
                )

                : "";


        // STATUS

        applicationStatus.value =
            application.status
            || "SUBMITTED";


        // REMARKS

        remarks.value =
            application.remarks
            || "";


        // REJECTION REASON

        rejectionReason.value =
            application.rejectionReason
            || "";


        // SHOW REJECTION BOX

        if (
            application.status ===
            "REJECTED"
        ) {

            rejectionReasonGroup.style.display =
                "block";

        }

        else {

            rejectionReasonGroup.style.display =
                "none";

        }


        // SHOW FORM

        applicationFormCard.style.display =
            "block";


        applicationFormCard.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

    catch (error) {

        console.error(error);


        alert(
            "Unable to load application details."
        );

    }

}


// =====================================
// STATUS CHANGE
// =====================================

applicationStatus.addEventListener(
    "change",
    function () {

        if (
            applicationStatus.value ===
            "REJECTED"
        ) {

            rejectionReasonGroup.style.display =
                "block";

        }

        else {

            rejectionReasonGroup.style.display =
                "none";


            rejectionReason.value =
                "";

        }

    }
);


// =====================================
// UPDATE APPLICATION
// =====================================

applicationForm.addEventListener(
    "submit",

    async function (event) {

        event.preventDefault();


        if (
            editingApplicationId === null
        ) {

            alert(
                "Please select an application."
            );

            return;

        }


        try {

            let response;


            // =====================
            // APPROVE
            // =====================

            if (
                applicationStatus.value ===
                "APPROVED"
            ) {

                response =
                    await fetch(

                        API_URL
                        + "/"
                        + editingApplicationId
                        + "/approve",

                        {
                            method: "PUT",

                            credentials: "include"
                        }

                    );

            }


                // =====================
                // REJECT
            // =====================

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

                    rejectionReason.focus();

                    return;

                }


                response =
                    await fetch(

                        API_URL
                        + "/"
                        + editingApplicationId
                        + "/reject?remarks="
                        + encodeURIComponent(reason),

                        {
                            method: "PUT",

                            credentials: "include"
                        }

                    );

            }


                // =====================
                // SUBMITTED
            // =====================

            else {

                alert(
                    "Please select APPROVED or REJECTED."
                );

                return;

            }


            // =====================
            // ERROR CHECK
            // =====================

            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(

                    errorText
                    || "Unable to update application."

                );

            }


            alert(
                "Application updated successfully."
            );


            // HIDE FORM

            applicationFormCard.style.display =
                "none";


            // RESET FORM

            applicationForm.reset();


            rejectionReasonGroup.style.display =
                "none";


            editingApplicationId =
                null;


            // RELOAD HISTORY

            await loadHistory();

        }

        catch (error) {

            console.error(error);


            alert(

                error.message
                || "Unable to update application."

            );

        }

    }
);


// =====================================
// CANCEL BUTTON
// =====================================

cancelApplicationBtn.addEventListener(
    "click",

    function () {

        applicationForm.reset();


        applicationFormCard.style.display =
            "none";


        rejectionReasonGroup.style.display =
            "none";


        editingApplicationId =
            null;

    }
);


// =====================================
// INITIAL LOAD
// =====================================

loadHistory();