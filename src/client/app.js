const submitID = document.querySelector("#submit-id");
const submitNewStudent = document.querySelector("#new-student-submit")
const idNewStudent = document.querySelector("#new-student-id")
const nameNewStudent = document.querySelector("#new-student-name")
const statusNewStudent = document.querySelector("#status-new-student")
const idEntry = document.querySelector("#student-id-entry");
const recentCheckins = document.querySelector("#recent-checkins");
const manualEntryStatus = document.querySelector("#status-manual-entry")

function addCheckin(id, type) {
    const entry = document.createElement("li");
    entry.textContent = `ID: ${id} (${type})`;
    recentCheckins.prepend(entry);
    setTimeout(() => {
        entry.classList.add("fade-out")
        setTimeout(() => {
            entry.remove();
        }, 500);
    }, 4500)
}

function validID(id) {
    return (id.length === 6 && (/^\d+$/.test(id)))
}

submitID.addEventListener("click", async () => {
    const id = idEntry.value;
    if (!validID(id)) {
        manualEntryStatus.textContent = "INVALID ID: please try again!";
        manualEntryStatus.classList.add("status");
        return;
    }

    const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    });

    const data = await response.json();
    console.log(data);

    addCheckin(id, "Success")
    idEntry.value = "";
    manualEntryStatus.textContent = "";
    manualEntryStatus.classList.remove("status");
});

submitNewStudent.addEventListener("click", async () => {
    const id = idNewStudent.value;
    const name = nameNewStudent.value;

    if (!validID(id)) {
        statusNewStudent.textContent = "INVALID ID: please try again!";
        statusNewStudent.classList.add("status")
        return;
    }

    if (!name) {
        statusNewStudent.textContent = "Name field is blank";
        statusNewStudent.classList.add("status")
        return;
    }

    const response = await fetch("api/registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            name: name
        })
    });

    const data = await response.json();
    console.log(data);

    addCheckin(id, "New Student Added")
    idNewStudent.value = "";
    nameNewStudent.value = "";
    statusNewStudent.textContent = "";
    statusNewStudent.classList.remove("status");
})