const express = require("express");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createSubject,
    getSubjects
} = require("../controllers/subjectController");

const router = express.Router();


// Create Subject - Staff Only
router.post(
    "/",
    protect,
    allowRoles("staff"),
    createSubject
);


// Get Subjects - Staff Only
router.get(
    "/",
    protect,
    allowRoles("staff"),
    getSubjects
);


module.exports = router;