import express from "express";
import { isPresent, getStudent, signIn, getAttendance, signOut } from "../database.js";

const router = express.Router();
const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
}).format(new Date());

router.post("/attendance", (req, res) => {
    const { studentId } = req.query;
    const student = getStudent(studentId);

    if (!student.studentExists) {
        return res.status(500).json({
            success: false,
            error: "This ID doesn't exist in the database, go register or fix your typo!"
        });
    }

    if (isPresent(studentId, today)) {
        try {
            signOut(studentId, today);

            console.log("Sign Out Successful " + studentId);
            return res.json({
                success: true,
                name: student.name
            });

        } catch (error) {
            console.error(error.message);

            return res.status(500).json({
                success: false,
                error: "Failed to Sign Out"
            });
        }

    }

    try {
        signIn(studentId);

        console.log("Sign In Successful " + studentId);
        return res.json({
            success: true,
            name: student.name
        });

    } catch (error) {

        console.error("Failed to record attendance:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to Sign In"
        });
    }
});

router.get("/attendance", (req, res) => {
    const { studentId } = req.query;
    const student = getStudent(studentId);

    if (!student.studentExists) {
        return res.status(500).json({
            success: false,
            error: "This ID doesn't exist in the database"
        });
    }

    try {
        const record = getAttendance(studentId, today);
        console.log("Get Request Successful ", record);
        return res.json({
            success: true,
            signInTime: record.sign_in,
            signOutTime: record.sign_out,
            date: today,
            status: record.status
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

export default router;