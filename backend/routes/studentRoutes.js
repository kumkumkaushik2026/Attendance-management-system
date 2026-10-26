const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const allowRoles =
    require("../middleware/roleMiddleware");


const {

    getStudentProfile,

    getStudentAttendance,

    getAttendancePercentage,

    getSubjectWiseAttendance,

    getAllStudents

} = require("../controllers/studentController");


const router = express.Router();



// ========================================
// STUDENT PROFILE
// ========================================

router.get(
    "/profile",
    protect,
    allowRoles("student"),
    getStudentProfile
);



// ========================================
// STUDENT ATTENDANCE
// ========================================

router.get(
    "/attendance",
    protect,
    allowRoles("student"),
    getStudentAttendance
);



// ========================================
// OVERALL ATTENDANCE PERCENTAGE
// ========================================

router.get(
    "/percentage",
    protect,
    allowRoles("student"),
    getAttendancePercentage
);



// ========================================
// SUBJECT-WISE ATTENDANCE
// ========================================

router.get(
    "/subject-wise",
    protect,
    allowRoles("student"),
    getSubjectWiseAttendance
);



// ========================================
// GET ALL STUDENTS
// STAFF ONLY
// ========================================

router.get(
    "/all",
    protect,
    allowRoles("staff"),
    getAllStudents
);



module.exports = router;