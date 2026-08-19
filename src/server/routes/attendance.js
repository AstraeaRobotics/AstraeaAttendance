import express from "express";
import { markAttendance } from "../database.js";
import e from "express";

const router = express.Router();

router.post("/attendance", (req, res) => {
    const { id: studentId } = req.body;
    try {
        markAttendance(studentId);

        res.json({
            success: true
        });

    } catch (error) {

        console.error("Failed to add attendance:", error);

        if (error.code = 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            res.status(500).json({
                success: false,
                error: "Couldn't find ID in database. Did you make a typo? Do you need to Register?"
            })
        } else {
            res.status(500).json({
                success: false,
                error: "Failed to record attendance"
            });
        }
    }
});

export default router;