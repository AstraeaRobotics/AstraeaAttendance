import express from "express";
import { syncAttendance } from "../services/googleSheets.js";

const router = express.Router();

router.post("/update", (req, res) => {

    try {
        const synced = syncAttendance();

        return res.json({
            success: true,
            numSynced: synced.number
        });

    } catch (error) {
        console.error("Failed to sync attendance:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to sync attendance"
        });
    }

});

export default router;