const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

// =========================
// DATABASE
// =========================

connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "Attendance Management System API is running"
    });
});

// =========================
// AUTH ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/subjects", subjectRoutes);

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});