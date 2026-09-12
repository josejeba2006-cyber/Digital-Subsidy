const bankDetailsForm =
    document.getElementById("bankDetailsForm");

const bankMessage =
    document.getElementById("bankMessage");


// Get application ID from URL

const params =
    new URLSearchParams(
        window.location.search
    );

const applicationId =
    params.get("applicationId");


if (!applicationId) {

    alert("Application not found");

    window.location.href =
        "my-applications.html";
}


// Submit bank details

bankDetailsForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Get values

        const accountHolderName =
            document
                .getElementById(
                    "accountHolderName"
                )
                .value
                .trim();


        const bankName =
            document
                .getElementById(
                    "bankName"
                )
                .value;


        const accountNumber =
            document
                .getElementById(
                    "accountNumber"
                )
                .value
                .trim();


        const confirmAccountNumber =
            document
                .getElementById(
                    "confirmAccountNumber"
                )
                .value
                .trim();


        const ifscCode =
            document
                .getElementById(
                    "ifscCode"
                )
                .value
                .trim()
                .toUpperCase();


        const branchName =
            document
                .getElementById(
                    "branchName"
                )
                .value
                .trim();


        // ================= ACCOUNT NUMBER VALIDATION =================

        if (accountNumber !== confirmAccountNumber) {

            bankMessage.className =
                "message error";

            bankMessage.textContent =
                "Account numbers do not match.";

            return;
        }


        // Account number validation
        // Allows 9 to 18 digits

        const accountPattern =
            /^\d{9,18}$/;


        if (!accountPattern.test(accountNumber)) {

            bankMessage.className =
                "message error";

            bankMessage.textContent =
                "Enter a valid account number.";

            return;
        }


        // ================= IFSC VALIDATION =================

        const ifscPattern =
            /^[A-Z]{4}0[A-Z0-9]{6}$/;


        if (!ifscPattern.test(ifscCode)) {

            bankMessage.className =
                "message error";

            bankMessage.textContent =
                "Enter a valid IFSC code.";

            return;
        }


        // ================= BANK DETAILS OBJECT =================

        const bankDetails = {

            application: {
                id: Number(applicationId)
            },

            accountHolderName:
            accountHolderName,

            bankName:
            bankName,

            accountNumber:
            accountNumber,

            ifscCode:
            ifscCode,

            branchName:
            branchName
        };


        try {

            const response =
                await fetch(
                    "http://localhost:8081/bank-details",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body:
                            JSON.stringify(
                                bankDetails
                            )
                    }
                );


            if (response.ok) {

                bankMessage.className =
                    "message success";

                bankMessage.textContent =
                    "Bank details submitted successfully! Waiting for verification.";


                setTimeout(
                    function () {

                        window.location.href =
                            "my-applications.html";

                    },
                    1500
                );

            } else {

                const error =
                    await response.text();


                bankMessage.className =
                    "message error";

                bankMessage.textContent =
                    error ||
                    "Unable to submit bank details.";

            }

        } catch (error) {

            console.error(error);


            bankMessage.className =
                "message error";

            bankMessage.textContent =
                "Unable to connect to the server.";

        }

    }
);