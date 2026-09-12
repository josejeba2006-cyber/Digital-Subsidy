// ================= GET STAFF DATA =================

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


// ================= ACCESS CHECK =================

if (
    !staffEmail ||
    (staffRole !== "ADMIN" &&
        staffRole !== "FINANCE_OFFICER")
) {

    window.location.href =
        "staff-login.html";

    // Stop execution
    throw new Error("Unauthorized access");
}


// ================= TABLE =================

const bankDetailsBody =
    document.getElementById(
        "bankDetailsBody"
    );


// ================= LOAD BANK DETAILS =================

async function loadBankDetails() {

    try {

        const response =
            await fetch(
                "http://localhost:8081/bank-details",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load bank details"
            );

        }


        const bankDetailsList =
            await response.json();


        bankDetailsBody.innerHTML = "";


        if (bankDetailsList.length === 0) {

            bankDetailsBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No bank details submitted yet.
                    </td>
                </tr>
            `;

            return;
        }


        bankDetailsList.forEach(
            function (bank) {

                const row =
                    document.createElement("tr");


                let actionHTML = "";


                // ================= ACTIONS =================

                if (
                    bank.verificationStatus ===
                    "PENDING"
                ) {

                    actionHTML = `

                        <button
                            class="verify-btn"
                            data-id="${bank.id}">

                            Verify

                        </button>

                        <button
                            class="reject-btn"
                            data-id="${bank.id}">

                            Reject

                        </button>

                    `;

                } else {

                    actionHTML =
                        "No action";
                }


                // ================= TABLE ROW =================

                row.innerHTML = `

                    <td>
                        ${bank.application.id}
                    </td>

                    <td>
                        ${bank.accountHolderName}
                    </td>

                    <td>
                        ${bank.bankName}
                    </td>

                    <td>
                        ******${bank.accountNumber.slice(-4)}
                    </td>

                    <td>
                        ${bank.ifscCode}
                    </td>

                    <td class="status-${bank.verificationStatus.toLowerCase()}">

                        ${bank.verificationStatus}

                    </td>

                    <td>

                        ${actionHTML}

                    </td>

                `;


                bankDetailsBody.appendChild(row);

            }
        );


        // ================= VERIFY BUTTONS =================

        document
            .querySelectorAll(".verify-btn")
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            await verifyBank(
                                this.dataset.id
                            );

                        }
                    );

                }
            );


        // ================= REJECT BUTTONS =================

        document
            .querySelectorAll(".reject-btn")
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            const reason =
                                prompt(
                                    "Enter rejection reason:"
                                );


                            if (!reason) {

                                return;

                            }


                            await rejectBank(
                                this.dataset.id,
                                reason
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(error);


        bankDetailsBody.innerHTML = `

            <tr>

                <td colspan="7">

                    Unable to load bank details.

                </td>

            </tr>

        `;

    }

}


// ================= VERIFY BANK =================

async function verifyBank(id) {

    try {

        const response =
            await fetch(
                "http://localhost:8081/bank-details/"
                + id
                + "/verify",
                {
                    method: "PUT",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to verify bank details"
            );

            return;
        }


        alert(
            "Bank details verified successfully"
        );


        loadBankDetails();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server"
        );

    }

}


// ================= REJECT BANK =================

async function rejectBank(id, reason) {

    try {

        const response =
            await fetch(
                "http://localhost:8081/bank-details/"
                + id
                + "/reject?reason="
                + encodeURIComponent(reason),
                {
                    method: "PUT",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to reject bank details"
            );

            return;
        }


        alert(
            "Bank details rejected successfully"
        );


        loadBankDetails();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server"
        );

    }

}


// ================= PROFILE =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ================= EMAIL =================

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


        // ================= ROLE =================

        const staffRoleText =
            document.getElementById(
                "staffRoleText"
            );


        if (staffRoleText) {

            staffRoleText.textContent =
                staffRole === "ADMIN"
                    ? "Administrator"
                    : "Finance Officer";

        }


        // ================= PROFILE DROPDOWN =================

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


        // ================= LOGOUT =================

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
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

        }

    }
);


// ================= LOAD WHEN PAGE OPENS =================

loadBankDetails();