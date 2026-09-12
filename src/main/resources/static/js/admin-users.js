const userFormCard =
    document.getElementById("userFormCard");

const userForm =
    document.getElementById("userForm");

let editingUserId = null;


const API_URL =
    "http://localhost:8081/users";

const usersTableBody =
    document.getElementById("usersTableBody");


// ================= LOAD USERS =================

async function loadUsers() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load users"
            );

        }

        const users =
            await response.json();


        usersTableBody.innerHTML = "";


        if (users.length === 0) {

            usersTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="empty-users">

                        No users found.

                    </td>
                </tr>
            `;

            return;

        }


        users.forEach(function(user) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${user.id}
                </td>


                <td class="user-name">
                    ${user.firstName || ""}
                    ${user.lastName || ""}
                </td>


                <td>
                    ${user.emailId || "-"}
                </td>


                <td>
                    ${user.phone || "-"}
                </td>


                <td>
                    ${user.gender || "-"}
                </td>


                <td>
                    ${user.occupation || "-"}
                </td>


                <td>

                    <button
                        class="action-btn edit-user-btn"
                        onclick="editUser(${user.id})">

                        ✏ Edit

                    </button>


                    <button
                        class="action-btn delete-user-btn"
                        onclick="deleteUser(${user.id})">

                        🗑 Delete

                    </button>

                </td>

            `;


            usersTableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);


        usersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-users">

                    Unable to load users.

                </td>

            </tr>

        `;

    }

}


// ================= EDIT USER =================

async function editUser(id) {

    try {

        const response =
            await fetch(API_URL + "/" + id);

        if (!response.ok) {

            throw new Error(
                "Unable to load user"
            );

        }

        const user =
            await response.json();


        editingUserId = id;


        document.getElementById(
            "firstName"
        ).value =
            user.firstName || "";


        document.getElementById(
            "lastName"
        ).value =
            user.lastName || "";


        document.getElementById(
            "emailId"
        ).value =
            user.emailId || "";


        document.getElementById(
            "phone"
        ).value =
            user.phone || "";


        document.getElementById(
            "gender"
        ).value =
            user.gender || "";


        document.getElementById(
            "dateofbirth"
        ).value =
            user.dateofbirth || "";


        document.getElementById(
            "annualIncome"
        ).value =
            user.annualIncome || "";


        document.getElementById(
            "occupation"
        ).value =
            user.occupation || "";


        document.getElementById(
            "location"
        ).value =
            user.location || "";


        userFormCard.style.display =
            "block";

        userFormCard.scrollIntoView({
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load user details."
        );

    }

}


// ================= DELETE USER =================

async function deleteUser(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this user?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL + "/" + id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete user"
            );

        }


        alert(
            "User deleted successfully."
        );


        loadUsers();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete user."
        );

    }

}
userForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const user = {

            firstName:
            document.getElementById(
                "firstName"
            ).value,

            lastName:
            document.getElementById(
                "lastName"
            ).value,

            emailId:
            document.getElementById(
                "emailId"
            ).value,

            phone:
            document.getElementById(
                "phone"
            ).value,

            gender:
            document.getElementById(
                "gender"
            ).value,

            dateofbirth:
            document.getElementById(
                "dateofbirth"
            ).value,

            annualIncome:
                Number(
                    document.getElementById(
                        "annualIncome"
                    ).value
                ),

            occupation:
            document.getElementById(
                "occupation"
            ).value,

            location:
            document.getElementById(
                "location"
            ).value

        };


        try {

            const response =
                await fetch(
                    API_URL + "/" +
                    editingUserId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(user)
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to update user"
                );

            }


            alert(
                "User updated successfully."
            );


            userFormCard.style.display =
                "none";


            editingUserId = null;


            loadUsers();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to update user."
            );

        }

    }
);
document.getElementById("cancelEditBtn")
    .addEventListener(
        "click",
        function() {

            userForm.reset();

            userFormCard.style.display =
                "none";

            editingUserId = null;

        }
    );

// ================= LOAD PAGE =================

loadUsers();