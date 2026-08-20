import { google } from "googleapis";
import "dotenv/config";
import { getUnsyncedAttendance, markAttendanceSynced } from "../database.js";

function createSheetsClient() {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const credentials = serviceAccountKey
        ? JSON.parse(serviceAccountKey)
        : {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
        };

    if (!credentials.client_email || !credentials.private_key) {
        throw new Error("Google Sheets service account credentials are not configured");
    }

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    return google.sheets({ version: "v4", auth });
}

export async function syncAttendance() {
    const records = getUnsyncedAttendance();

    if (!records.length) {
        return { synced: 0 };
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE || "RAW_DATA!A:H";

    if (!spreadsheetId) {
        throw new Error("GOOGLE_SHEETS_ID is not configured");
    }

    const sheets = createSheetsClient();

    // Get existing primary keys from the sheet
    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "RAW_DATA!A:A"
    });

    const rows = existing.data.values || [];

    // Map primary_key -> Google Sheets row number
    const rowMap = new Map();

    rows.forEach((row, index) => {
        const primaryKey = row[0];

        if (primaryKey) {
            // +1 because Google Sheets rows start at 1
            rowMap.set(String(primaryKey), index + 1);
        }
    });

    const newRows = [];
    const updateRequests = [];

    for (const record of records) {
        const values = [
            record.primary_key,
            record.student_id,
            record.name,
            record.subteam,
            record.date,
            record.sign_in,
            record.sign_out,
            record.status
        ];

        const rowNumber = rowMap.get(String(record.primary_key));

        if (rowNumber) {
            // Existing record → update it
            updateRequests.push({
                range: `RAW_DATA!A${rowNumber}:H${rowNumber}`,
                values: [values]
            });
        } else {
            // New record → append it
            newRows.push(values);
        }
    }

    // Update existing rows
    if (updateRequests.length > 0) {
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            requestBody: {
                valueInputOption: "USER_ENTERED",
                data: updateRequests
            }
        });
    }

    // Append new rows
    if (newRows.length > 0) {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: newRows
            }
        });
    }

    // Only mark as synced if all Google operations succeeded
    const synced = markAttendanceSynced(
        records.map((record) => record.primary_key)
    );

    return { synced };
}
