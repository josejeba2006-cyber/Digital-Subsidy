const API_BASE_URL = 'http://localhost:8081/regional-allocations';
const SCHEME_API_URL = 'http://localhost:8081/schemes';


// ================= INITIAL LOAD =================

document.addEventListener('DOMContentLoaded', () => {

    loadSchemes();
    fetchAllocations();

    document
        .getElementById('allocationForm')
        .addEventListener(
            'submit',
            handleFormSubmit
        );


    // ================= PROFILE =================

    const staffEmail =
        localStorage.getItem('staffEmail');

    const staffRole =
        localStorage.getItem('staffRole');


    if (
        !staffEmail ||
        staffRole !== 'ADMIN'
    ) {
        window.location.href =
            'staff-login.html';

        return;
    }


    const staffEmailElement =
        document.getElementById('staffEmail');

    const dropdownStaffEmail =
        document.getElementById(
            'dropdownStaffEmail'
        );


    if (staffEmailElement) {
        staffEmailElement.textContent =
            staffEmail;
    }


    if (dropdownStaffEmail) {
        dropdownStaffEmail.textContent =
            staffEmail;
    }


    // ================= PROFILE DROPDOWN =================

    const profileButton =
        document.getElementById(
            'profileButton'
        );

    const profileDropdown =
        document.getElementById(
            'profileDropdown'
        );


    if (
        profileButton &&
        profileDropdown
    ) {

        profileButton.addEventListener(
            'click',
            function () {

                profileDropdown.classList.toggle(
                    'show'
                );

            }
        );

    }


    // ================= MY PROFILE =================

    const myProfileBtn =
        document.getElementById(
            'myProfileBtn'
        );


    if (myProfileBtn) {

        myProfileBtn.addEventListener(
            'click',
            function () {

                window.location.href =
                    'profile.html';

            }
        );

    }


    // ================= LOGOUT =================

    const logoutBtn =
        document.getElementById(
            'logoutBtn'
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            'click',
            function () {

                localStorage.removeItem(
                    'staffEmail'
                );

                localStorage.removeItem(
                    'staffRole'
                );

                window.location.href =
                    'staff-login.html';

            }
        );

    }

});


// ================= LOAD SCHEMES =================

async function loadSchemes() {

    try {

        const response =
            await fetch(
                SCHEME_API_URL
            );


        if (!response.ok) {
            throw new Error(
                'Failed to load schemes'
            );
        }


        const schemes =
            await response.json();


        const schemeSelect =
            document.getElementById(
                'schemeSelect'
            );

        const filterSelect =
            document.getElementById(
                'filterSchemeSelect'
            );


        schemes.forEach(scheme => {

            const schemeName =
                scheme.name ||
                scheme.schemeName ||
                '';


            const opt1 =
                new Option(
                    `Scheme ${scheme.id} - ${schemeName}`,
                    scheme.id
                );


            const opt2 =
                new Option(
                    `Scheme ${scheme.id} - ${schemeName}`,
                    scheme.id
                );


            schemeSelect.add(opt1);
            filterSelect.add(opt2);

        });


    } catch (error) {

        console.warn(
            'Could not load scheme list.',
            error
        );

    }

}


// ================= FETCH ALLOCATIONS =================

async function fetchAllocations() {

    try {

        const response =
            await fetch(
                API_BASE_URL
            );


        if (!response.ok) {

            throw new Error(
                'Failed to load data'
            );

        }


        const allocations =
            await response.json();


        renderTable(allocations);


    } catch (error) {

        console.error(
            'Error fetching allocations:',
            error
        );

    }

}


// ================= FILTER BY SCHEME =================

async function filterByScheme(
    schemeId
) {

    if (
        schemeId === 'ALL' ||
        schemeId === ''
    ) {

        fetchAllocations();

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/scheme/${schemeId}`
            );


        if (!response.ok) {

            throw new Error(
                'Failed to load filtered data'
            );

        }


        const allocations =
            await response.json();


        renderTable(allocations);


    } catch (error) {

        console.error(
            'Error filtering allocations:',
            error
        );

    }

}


// ================= RENDER TABLE =================

function renderTable(
    allocations
) {

    const tbody =
        document.getElementById(
            'allocationTableBody'
        );


    tbody.innerHTML = '';


    if (
        allocations.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;">
                    No allocations found
                </td>
            </tr>
        `;

        return;
    }


    allocations.forEach(
        alloc => {

            const row =
                document.createElement(
                    'tr'
                );


            // ================= CURRENCY =================

            const formattedAllocated =
                '₹' +
                Number(
                    alloc.allocatedBudget || 0
                ).toLocaleString('en-IN');


            const formattedUsed =
                '₹' +
                Number(
                    alloc.usedBudget || 0
                ).toLocaleString('en-IN');
            const remainingBudget =
                Number(alloc.allocatedBudget || 0) -
                Number(alloc.usedBudget || 0);

            const formattedRemaining =
                '₹' +
                remainingBudget.toLocaleString('en-IN');
            row.innerHTML = `
    <td>${alloc.id}</td>

    <td>
        <strong>
            ${alloc.scheme ? alloc.scheme.id : 'N/A'}
        </strong>
    </td>

    <td>${alloc.region}</td>

    <td>${formattedAllocated}</td>

    <td>${formattedUsed}</td>

    <td>${formattedRemaining}</td>

    <td>
        <button
            class="btn-edit"
            onclick='setupEdit(${JSON.stringify(alloc)})'>
            Edit
        </button>

        <button
            class="btn-delete"
            onclick="deleteAllocation(${alloc.id})">
            Delete
        </button>
    </td>
`;

            tbody.appendChild(row);

        }
    );

}


// ================= FORM SUBMIT =================

async function handleFormSubmit(
    event
) {

    event.preventDefault();


    const id =
        document.getElementById(
            'allocationId'
        ).value;


    const schemeId =
        document.getElementById(
            'schemeSelect'
        ).value;


    const region =
        document.getElementById(
            'location'
        ).value;


    const allocatedBudget =
        parseFloat(
            document.getElementById(
                'allocatedBudget'
            ).value
        );


    const usedBudgetInput =
        document.getElementById(
            'usedBudget'
        ).value;


    const usedBudget =
        usedBudgetInput !== ''
            ? parseFloat(usedBudgetInput)
            : 0.0;


    const payload = {

        region: region,

        allocatedBudget:
        allocatedBudget,

        usedBudget:
        usedBudget

    };


    try {

        let response;


        // ================= UPDATE =================

        if (id) {

            response =
                await fetch(
                    `${API_BASE_URL}/${id}`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

        }


        // ================= CREATE =================

        else {

            response =
                await fetch(
                    `${API_BASE_URL}/scheme/${schemeId}`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

        }


        if (response.ok) {

            alert(
                id
                    ? 'Allocation updated successfully!'
                    : 'Allocation added successfully!'
            );


            resetForm();

            fetchAllocations();

        }


        else {

            const errorMsg =
                await response.text();


            alert(
                'Failed: ' +
                errorMsg
            );

        }


    } catch (error) {

        console.error(
            'Error submitting form:',
            error
        );


        alert(
            'Server Error!'
        );

    }

}


// ================= EDIT =================

function setupEdit(
    alloc
) {

    document.getElementById(
        'allocationId'
    ).value =
        alloc.id;


    document.getElementById(
        'schemeSelect'
    ).value =
        alloc.scheme
            ? alloc.scheme.id
            : '';


    document.getElementById(
        'schemeSelect'
    ).disabled = true;


    document.getElementById(
        'location'
    ).value =
        alloc.region;


    document.getElementById(
        'allocatedBudget'
    ).value =
        alloc.allocatedBudget;


    document.getElementById(
        'usedBudget'
    ).value =
        alloc.usedBudget;


    document.getElementById(
        'saveBtn'
    ).textContent =
        'Update Allocation';


    document.getElementById(
        'cancelBtn'
    ).style.display =
        'inline-block';

}


// ================= DELETE =================

async function deleteAllocation(
    id
) {

    if (
        !confirm(
            `Are you sure you want to delete allocation record #${id}?`
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/${id}`,
                {
                    method: 'DELETE'
                }
            );


        if (response.ok) {

            alert(
                'Allocation record deleted.'
            );


            fetchAllocations();

        }


        else {

            alert(
                'Delete failed.'
            );

        }


    } catch (error) {

        console.error(
            'Error deleting record:',
            error
        );


        alert(
            'Server Connection Error!'
        );

    }

}


// ================= RESET FORM =================

function resetForm() {

    document.getElementById(
        'allocationForm'
    ).reset();


    document.getElementById(
        'allocationId'
    ).value = '';


    document.getElementById(
        'schemeSelect'
    ).disabled = false;


    document.getElementById(
        'saveBtn'
    ).textContent =
        'Save Allocation';


    document.getElementById(
        'cancelBtn'
    ).style.display =
        'none';

}