import express from "express";
import { createStudent, markAttendance } from "../database.js";

const router = express.Router();

router.post("/registration", (req, res) => {
    const { id: student_id, name, subteam } = req.body;

    try {
        createStudent(student_id, name, subteam);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Couldn't register user"
        })
    }

    try {
        markAttendance(student_id);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to record attendance"
        });
    }

    res.json({
        success: true
    });
});

export default router;