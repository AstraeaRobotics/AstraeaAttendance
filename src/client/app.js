const submit = document.querySelector("#submit-id");
const idEntry = document.querySelector("#student-id-entry");
const recentCheckins = document.querySelector("#recent-checkins");
const manualEntryStatus = document.querySelector("#status-manual-entry")

function addCheckin(id, type) {
    const entry = document.createElement("li");
    entry.textContent = `ID: ${id} (${type})`;
    recentCheckins.prepend(entry);
}

function validID(id) {
    return (id.length === 6 && (/^\d+$/.test(id)))
}

submit.addEventListener("click", () => {
    const id = idEntry.value;
    if (validID(id)) {
        addCheckin(id, "manual");
        idEntry.value = "";
        manualEntryStatus.textContent = "";
    } else {
        manualEntryStatus.textContent = "INVALID ID: please try again!"
    }
})