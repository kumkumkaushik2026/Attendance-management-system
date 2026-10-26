const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const allowRoles =
    require("../middleware/roleMiddleware");


const {

   markAttendance,

    getAttendance,
      getMyAttendance,
    deleteAttendance,
 getMyAttendancePercentage,
     getOverallAttendancePercentage,
    updateAttendance,
        getDashboardStats

} = require("../controllers/attendanceController");


const router = express.Router();



// ========================================
// MARK ATTENDANCE
// STAFF ONLY
// ========================================

router.post(
    "/mark",
    protect,
    allowRoles("staff"),
    markAttendance
);



// ========================================
// GET ALL ATTENDANCE
// STAFF ONLY
// ========================================

router.get(
    "/",
    protect,
    allowRoles("staff"),
    getAttendance
);

// ========================================
// GET MY ATTENDANCE
// STUDENT ONLY
// ========================================

router.get(
    "/my",
    protect,
    allowRoles("student"),
    getMyAttendance
);
// ========================================
// GET MY ATTENDANCE PERCENTAGE
// STUDENT ONLY
// ========================================

router.get(
    "/my/percentage",
    protect,
    allowRoles("student"),
    getMyAttendancePercentage
);
router.get(
    "/my/overall-percentage",
    protect,
    allowRoles("student"),
    getOverallAttendancePercentage
);

// ========================================
// STAFF DASHBOARD
// STAFF ONLY
// ========================================

router.get(
    "/dashboard",
    protect,
    allowRoles("staff"),
    getDashboardStats
);
// ========================================
// UPDATE ATTENDANCE
// STAFF ONLY
// ========================================

router.put(
    "/:id",
    protect,
    allowRoles("staff"),
    updateAttendance
);


router.delete(
    "/:id",
    protect,
    allowRoles("staff"),
    deleteAttendance
);



module.exports = router;