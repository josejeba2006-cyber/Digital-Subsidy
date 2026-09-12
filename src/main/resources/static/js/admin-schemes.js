const API_URL =
    "http://localhost:8081/schemes";

const tableBody =
    document.getElementById("schemesTableBody");

const schemeFormCard =
    document.getElementById("schemeFormCard");

const schemeForm =
    document.getElementById("schemeForm");

const showFormBtn =
    document.getElementById("showFormBtn");

const cancelFormBtn =
    document.getElementById("cancelFormBtn");

const formTitle =
    document.getElementById("formTitle");

let editingSchemeId = null;


// ================= CHECK ADMIN =================

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


if (!staffEmail || staffRole !== "ADMIN") {

    window.location.href =
        "staff-login.html";

}


// ================= LOAD SCHEMES =================

async function loadSchemes() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load schemes"
            );

        }

        const schemes =
            await response.json();

        tableBody.innerHTML = "";


        if (schemes.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No schemes found.
                    </td>
                </tr>
            `;

            return;
        }

        schemes.forEach(function(scheme) {

            const statusClass =
                scheme.status === "ACTIVE"
                    ? "status-active"
                    : "status-inactive";


            const row =
                document.createElement("tr");


            row.innerHTML = `

        <td>
            ${scheme.id}
        </td>

        <td>
            ${scheme.schemeName}
        </td>

        

        <td>
            ${scheme.minimumAge}
            -
            ${scheme.maximumAge}
        </td>

        <td>
            <span class="${statusClass}">
                ${scheme.status || "ACTIVE"}
            </span>
        </td>

        <td class="scheme-actions">

            <button
                class="action-btn edit-scheme-btn"
                onclick="editScheme(${scheme.id})">

                ✏ Edit

            </button>

            <button
                class="action-btn delete-scheme-btn"
                onclick="deleteScheme(${scheme.id})">

                🗑 Delete

            </button>

        </td>

    `;


            tableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load schemes.
                </td>
            </tr>
        `;

    }

}


// ================= SHOW ADD FORM =================

showFormBtn.addEventListener(
    "click",
    function() {

        editingSchemeId = null;

        schemeForm.reset();

        formTitle.textContent =
            "Add New Scheme";

        schemeFormCard.style.display =
            "block";

    }
);


// ================= CANCEL FORM =================

cancelFormBtn.addEventListener(
    "click",
    function() {

        schemeFormCard.style.display =
            "none";

        schemeForm.reset();

        editingSchemeId = null;

    }
);


// ================= SAVE SCHEME =================

schemeForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const selectedCategories =
            Array.from(
                document.querySelectorAll(
                    'input[name="beneficiaryCategory"]:checked'
                )
            ).map(function (checkbox) {
                return checkbox.value;
            });
        const scheme = {

            schemeName:
            document.getElementById(
                "schemeName"
            ).value,

            description:
            document.getElementById(
                "description"
            ).value,

                      minimumAge:
                Number(
                    document.getElementById(
                        "minimumAge"
                    ).value
                ),

            maximumAge:
                Number(
                    document.getElementById(
                        "maximumAge"
                    ).value
                ),

            eligibleOccupation:
            document.getElementById(
                "eligibleOccupation"
            ).value,
            eligibleGender:
            document.getElementById(
                "eligibleGender"
            ).value,
            requiredDocuments:
            document.getElementById(
                "requiredDocuments"
            ).value,
            eligibleBeneficiaryCategory:
                selectedCategories.join(","),

            startDate:
            document.getElementById(
                "startDate"
            ).value,

            endDate:
            document.getElementById(
                "endDate"
            ).value,
            status:
            document.getElementById("status").value,
            eligibleLocation:
            document.getElementById(
                "eligibleLocation"
            ).value,

            benefits:
            document.getElementById(
                "benefits"
            ).value
        };


        let url = API_URL;
        let method = "POST";


        // EDIT MODE

        if (editingSchemeId !== null) {

            url =
                `${API_URL}/${editingSchemeId}`;

            method = "PUT";

        }


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(scheme)
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to save scheme"
                );

            }
            const savedScheme = await response.json();
            const schemeId = savedScheme.id;

            await saveSlabs(
                schemeId,
                editingSchemeId !== null
            );


            alert(
                editingSchemeId !== null
                    ? "Scheme updated successfully."
                    : "Scheme created successfully."
            );


            schemeForm.reset();

            schemeFormCard.style.display =
                "none";

            editingSchemeId = null;


            loadSchemes();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to save scheme."
            );

        }

    }
);


// ================= EDIT SCHEME =================

async function editScheme(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Scheme not found"
            );

        }


        const scheme =
            await response.json();


        editingSchemeId = id;


        formTitle.textContent =
            "Edit Scheme";


        schemeFormCard.style.display =
            "block";


        document.getElementById(
            "schemeName"
        ).value =
            scheme.schemeName || "";


        document.getElementById(
            "description"
        ).value =
            scheme.description || "";


        document.getElementById(
            "minimumAge"
        ).value =
            scheme.minimumAge || "";


        document.getElementById(
            "maximumAge"
        ).value =
            scheme.maximumAge || "";

        document.getElementById(
            "eligibleLocation"
        ).value =
            scheme.eligibleLocation || "ALL";
        const categories =
            (scheme.eligibleBeneficiaryCategory || "ALL")
                .split(",")
                .map(category => category.trim());

        document.querySelectorAll(
            'input[name="beneficiaryCategory"]'
        ).forEach(function (checkbox) {

            checkbox.checked =
                categories.includes(checkbox.value);

        });

        document.getElementById(
            "eligibleOccupation"
        ).value =
            scheme.eligibleOccupation || "";

        document.getElementById(
            "eligibleGender"
        ).value =
            scheme.eligibleGender || "ALL";

        document.getElementById(
            "requiredDocuments"
        ).value =
            scheme.requiredDocuments || "";


        document.getElementById(
            "startDate"
        ).value =
            scheme.startDate || "";


        document.getElementById(
            "endDate"
        ).value =
            scheme.endDate || "";
        document.getElementById("benefits").value =
            scheme.benefits || "";
        document.getElementById("status").value =
            scheme.status || "ACTIVE";
        document.getElementById("eligibleGender").value =
            scheme.eligibleGender || "ALL";
        document.getElementById("status").value =
            scheme.status || "ACTIVE";
        await loadSlabs(id);


    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load scheme details."
        );

    }

}


// ================= DELETE SCHEME =================

async function deleteScheme(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this scheme?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete scheme"
            );

        }


        alert(
            "Scheme deleted successfully."
        );


        loadSchemes();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete scheme."
        );

    }

}


// ================= PROFILE =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");


document.getElementById(
    "staffEmail"
).textContent =
    staffEmail;


document.getElementById(
    "dropdownStaffEmail"
).textContent =
    staffEmail;


profileButton.addEventListener(
    "click",
    function() {

        profileDropdown.classList.toggle(
            "show"
        );

    }
);


// ================= LOGOUT =================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    function() {

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
async function saveSlabs(schemeId, isEditing) {

    // If editing, remove old slabs first
    if (isEditing) {

        await deleteSlabsForScheme(schemeId);

    }


    const rows =
        document.querySelectorAll(".slab-row");


    for (const row of rows) {

        const minimumIncome =
            Number(
                row.querySelector(
                    '[name="minimumIncome"]'
                ).value
            );

        const maximumIncome =
            Number(
                row.querySelector(
                    '[name="maximumIncome"]'
                ).value
            );

        const grantAmount =
            Number(
                row.querySelector(
                    '[name="grantAmount"]'
                ).value
            );


        if (minimumIncome > maximumIncome) {

            throw new Error(
                "Minimum income cannot be greater than maximum income."
            );

        }


        const slab = {

            minimumIncome:
            minimumIncome,

            maximumIncome:
            maximumIncome,

            grantAmount:
            grantAmount,

            scheme: {
                id: Number(schemeId)
            }

        };


        const response =
            await fetch(
                "http://localhost:8081/grant-slabs",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(slab)
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to save grant slab"
            );

        }

    }
}
async function deleteSlabsForScheme(schemeId) {

    const response =
        await fetch(
            `http://localhost:8081/grant-slabs/scheme/${schemeId}`
        );

    if (!response.ok) {
        throw new Error(
            "Unable to load existing slabs"
        );
    }

    const slabs =
        await response.json();


    for (const slab of slabs) {

        await fetch(
            `http://localhost:8081/grant-slabs/${slab.id}`,
            {
                method: "DELETE"
            }
        );

    }
}
function addSlab(slab = null) {

    const container =
        document.getElementById("slabContainer");


        const minIncome = slab
            ? Number(slab.minimumIncome)
            : null;

    const row =
        document.createElement("div");

    row.className = "slab-row";

    row.dataset.slabId =
        slab ? slab.id : "";

    row.style.cssText = `
        display:grid;
        grid-template-columns:1fr 1fr 1fr auto;
        gap:12px;
        align-items:center;
        padding:16px;
        margin-bottom:12px;
        background:#f8fafc;
        border:1px solid #dbe3ec;
        border-radius:10px;
    `;

    /*
     * IMPORTANT:
     * Support both possible API names.
     * Existing slabs will use the value returned by backend.
     */

    const maxIncome =
        slab?.maximumIncome ?? "";

    const grantAmount =
        slab?.grantAmount ?? "";


    row.innerHTML = `

        <!-- MINIMUM INCOME -->

        <select name="minimumIncome" required>

            <option value="">
                Min Income
            </option>

            <option value="0"
                ${minIncome == 0 ? "selected" : ""}>
                ₹0
            </option>

            <option value="100001"
                ${minIncome == 100001 ? "selected" : ""}>
                ₹1,00,001
            </option>

            <option value="200001"
                ${minIncome == 200001 ? "selected" : ""}>
                ₹2,00,001
            </option>

            <option value="300001"
                ${minIncome == 300001 ? "selected" : ""}>
                ₹3,00,001
            </option>

            <option value="400001"
                ${minIncome == 400001 ? "selected" : ""}>
                ₹4,00,001
            </option>

            <option value="500001"
                ${minIncome == 500001 ? "selected" : ""}>
                ₹5,00,001
            </option>

            <option value="600001"
                ${minIncome == 600001 ? "selected" : ""}>
                ₹6,00,001
            </option>

            <option value="700001"
                ${minIncome == 700001 ? "selected" : ""}>
                ₹7,00,001
            </option>

        </select>


        <!-- MAXIMUM INCOME -->

        <select name="maximumIncome" required>

            <option value="">
                Max Income
            </option>

            <option value="100000"
                ${maxIncome == 100000 ? "selected" : ""}>
                ₹1,00,000
            </option>

            <option value="200000"
                ${maxIncome == 200000 ? "selected" : ""}>
                ₹2,00,000
            </option>

            <option value="300000"
                ${maxIncome == 300000 ? "selected" : ""}>
                ₹3,00,000
            </option>

            <option value="400000"
                ${maxIncome == 400000 ? "selected" : ""}>
                ₹4,00,000
            </option>

            <option value="500000"
                ${maxIncome == 500000 ? "selected" : ""}>
                ₹5,00,000
            </option>

            <option value="600000"
                ${maxIncome == 600000 ? "selected" : ""}>
                ₹6,00,000
            </option>

            <option value="700000"
                ${maxIncome == 700000 ? "selected" : ""}>
                ₹7,00,000
            </option>

            <option value="800000"
                ${maxIncome == 800000 ? "selected" : ""}>
                ₹8,00,000
            </option>

            <option value="900000"
                ${maxIncome == 900000 ? "selected" : ""}>
                ₹9,00,000
            </option>

            <option value="1000000"
                ${maxIncome == 1000000 ? "selected" : ""}>
                ₹10,00,000
            </option>

        </select>


        <!-- GRANT AMOUNT -->

        <select name="grantAmount" required>

            <option value="">
                Grant Amount
            </option>

            <option value="20000"
                ${grantAmount == 20000 ? "selected" : ""}>
                ₹20,000
            </option>

            <option value="30000"
                ${grantAmount == 30000 ? "selected" : ""}>
                ₹30,000
            </option>

            <option value="50000"
                ${grantAmount == 50000 ? "selected" : ""}>
                ₹50,000
            </option>

            <option value="75000"
                ${grantAmount == 75000 ? "selected" : ""}>
                ₹75,000
            </option>

            <option value="100000"
                ${grantAmount == 100000 ? "selected" : ""}>
                ₹1,00,000
            </option>
            <option value="200000"
                ${grantAmount == 200000 ? "selected" : ""}>
                ₹2,00,000
            </option>

        </select>


        <!-- REMOVE -->

        <button
            type="button"
            onclick="removeSlab(this)"
            style="
                padding:10px 14px;
                border:1px solid #fecaca;
                border-radius:8px;
                background:#fff1f2;
                color:#dc2626;
                font-weight:600;
                cursor:pointer;
            "
        >
            Remove
        </button>

    `;

    container.appendChild(row);
}

async function loadSlabs(schemeId) {

    const container =
        document.getElementById("slabContainer");

    container.innerHTML = "";

    try {

        const response =
            await fetch(
                `http://localhost:8081/grant-slabs/scheme/${schemeId}`
            );

        if (!response.ok) {
            throw new Error("Unable to load slabs");
        }

        const slabs =
            await response.json();

        console.log("GRANT SLABS FROM API:", slabs);

        slabs.forEach(function(slab) {

            console.log("INDIVIDUAL SLAB:", slab);

            addSlab(slab);

        });

    }
    catch (error) {

        console.error(error);

        alert("Unable to load grant slabs.");

    }
}

function removeSlab(button) {
    button.parentElement.remove();
}


// ================= START =================

loadSchemes();