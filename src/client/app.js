import { BarcodeFormat } from "@zxing/library";
import { BrowserMultiFormatReader } from "@zxing/browser";

const video = document.querySelector("#webcam");
const submit = document.querySelector("#submit-id");
const idEntry = document.querySelector("#student-id-entry");
const recentCheckins = document.querySelector("#recent-checkins");
const manualEntryStatus = document.querySelector("#status-manual-entry")

const reader = new BrowserMultiFormatReader();
reader.possibleFormats = [BarcodeFormat.AZTEC];

async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 400,
            height: 200
        }
    });
    video.srcObject = stream;
} startCamera();



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

reader.decodeFromVideoDevice(
    undefined,
    video,
    (result, error) => {
        if (result) {
            addCheckin(result.getText(), "Scanned");
        }
    }
);