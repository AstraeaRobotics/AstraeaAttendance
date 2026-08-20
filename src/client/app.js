const submitSignIn = document.querySelector("#sign-in-submit");
const idSignIn = document.querySelector("#sign-in-id");
const statusSignIn = document.querySelector("#status-sign-in")

const submitSignOut = document.querySelector("#sign-out-submit");
const idSignOut = document.querySelector("#sign-out-id");
const statusSignOut = document.querySelector("#status-sign-out")

const submitNewStudent = document.querySelector("#new-student-submit");
const idNewStudent = document.querySelector("#new-student-id");
const nameNewStudent = document.querySelector("#new-student-name");
const subteamNewStudent = document.querySelector("#new-student-subteam");
const statusNewStudent = document.querySelector("#status-new-student");

const recentCheckins = document.querySelector("#recent-checkins");

function addCheckin(id, name, type) {
    const entry = document.createElement("li");
    entry.textContent = `${name} - ${id} (${type})`;
    recentCheckins.prepend(entry);
    setTimeout(() => {
        entry.classList.add("fade-out")
        setTimeout(() => {
            entry.remove();
        }, 500);
    }, 7500);
}

function validID(id) {
    return (id.length === 6 && (/^\d+$/.test(id)));
}

function resetAllFields() {
    idSignIn.value = "";
    statusSignIn.textContent = "";
    statusSignIn.classList.remove("status");
    idSignOut.value = "";
    statusSignOut.textContent = "";
    statusSignOut.classList.remove("status");
    idNewStudent.value = "";
    nameNewStudent.value = "";
    subteamNewStudent.value = "";
    statusNewStudent.textContent = "";
    statusNewStudent.classList.remove("status");
}

submitSignIn.addEventListener("click", async () => {
    const id = idSignIn.value;
    if (!validID(id)) {
        statusSignIn.textContent = "INVALID ID: please try again!";
        statusSignIn.classList.add("status");
        return;
    }

    const get_response = await fetch(`/api/attendance?studentId=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const get_data = await get_response.json();
    const { success: get_success } = get_data;

    if (!get_success) {
        statusSignIn.textContent = get_data.error;
        statusSignIn.classList.add("status")
        return;
    }

    if (get_data.signInTime) {
        statusSignIn.textContent = `You were already signed in at ${get_data.signInTime}... silly`;
        statusSignIn.classList.add("status")
        return;
    }

    const post_response = await fetch(`/api/attendance?studentId=${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const post_data = await post_response.json();
    const { success: post_success } = post_data;

    if (post_success) {
        addCheckin(id, post_data.name, "Welcome Back!")
        resetAllFields();

    } else {
        statusSignIn.textContent = post_data.error;
        statusSignIn.classList.add("status");
    }
});

submitSignOut.addEventListener("click", async () => {


    console.log("Submit Sign Out Button Clicked");

    const id = idSignOut.value;
    if (!validID(id)) {
        statusSignOut.textContent = "INVALID ID: please try again!";
        statusSignOut.classList.add("status");
        return;
    }

    const get_response = await fetch(`/api/attendance?studentId=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const get_data = await get_response.json();
    const { success: get_success } = get_data;

    if (!get_success) {
        console.log("Get Request failed?");
        statusSignOut.textContent = get_data.error;
        statusSignOut.classList.add("status");
        return;
    }

    console.log("Get Request Checkpoint");

    if (!get_data.signInTime) {
        statusSignOut.textContent = "You haven't even signed in yet... and you are trying to leave?";
        statusSignOut.classList.add("status")
        return;
    }

    console.log("sent post req");

    const post_response = await fetch(`/api/attendance?studentId=${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })

    const post_data = await post_response.json();
    const { success: post_success } = post_data;

    if (!post_success) {
        statusSignOut.textContent = post_data.error;
        console.error("POST DATA ERROR");
        statusSignOut.classList.add("status");
        return;
    }

    addCheckin(id, post_data.name, "Goodbye, Have a nice day!")
    resetAllFields();
});


submitNewStudent.addEventListener("click", async () => {
    const id = idNewStudent.value;
    const name = nameNewStudent.value;
    const subteam = subteamNewStudent.value;


    if (!validID(id)) {
        statusNewStudent.textContent = "INVALID ID: please try again!";
        statusNewStudent.classList.add("status")
        return;
    }

    if (!name) {
        statusNewStudent.textContent = "Name field is blank";
        statusNewStudent.classList.add("status");
        return;
    }

    const response = await fetch("api/registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            name: name,
            subteam: subteam
        })
    });

    const data = await response.json();
    const { success } = data

    if (success) {
        addCheckin(id, data.name, "New Student Added")
        resetAllFields();
    } else {
        statusNewStudent.textContent = data.error;
        statusNewStudent.classList.add("status");
    }
})