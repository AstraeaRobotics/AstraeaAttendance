import express from "express";
import { createStudent, signIn } from "../database.js";

const router = express.Router();

router.post("/registration", (req, res) => {
    const { id: student_id, name, subteam } = req.body;

    try {
        createStudent(student_id, name, subteam);
    } catch (error) {
        console.error(error);

        if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
            res.status(500).json({
                success: false,
                error: "Student ID already exists"
            })
        }

        res.status(500).json({
            success: false,
            error: "Couldn't register user"
        })
    }

    try {
        signIn(student_id);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to record attendance"
        });
    }

    res.json({
        success: true,
        name: name
    });
});

export default router;