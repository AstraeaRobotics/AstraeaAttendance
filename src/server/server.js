import express from "express";
import attendanceRoutes from "./routes/attendance.js";
import studentRoutes from "./routes/registration.js";
import { initializeAttendance } from "./database.js";

const app = express();

initializeAttendance()

app.use(express.json());

app.use("/api", attendanceRoutes);
app.use("/api", studentRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});