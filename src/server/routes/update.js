import express from "express";
import { syncAttendance } from "../services/googleSheets.js";

const router = express.Router();

router.post("/update", async (req, res) => {

    try {
        const result = await syncAttendance();

        return res.json({
            success: true,
            numSynced: result.synced
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