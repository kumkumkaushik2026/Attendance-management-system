const Attendance = require("../models/Attendance");



// ========================================
// MARK ATTENDANCE
// ========================================

const markAttendance = async (req, res) => {

    try {

        const {
            student,
            subject,
            date,
            status
        } = req.body;


        // Check required fields
        if (
            !student ||
            !subject ||
            !date ||
            !status
        ) {

            return res.status(400).json({

                message:
                    "All fields are required"

            });

        }


        // Check valid status
        if (
            !["Present", "Absent"].includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid attendance status"

            });

        }


        // ========================================
        // CHECK STUDENT
        // ========================================

        const User = require("../models/User");

        const studentExists =
            await User.findById(student);


        if (!studentExists) {

            return res.status(404).json({

                message:
                    "Student not found"

            });

        }


        // Make sure selected user is actually a student
        if (studentExists.role !== "student") {

            return res.status(400).json({

                message:
                    "Selected user is not a student"

            });

        }


        // ========================================
        // CHECK SUBJECT
        // ========================================

        const Subject =
            require("../models/Subject");

        const subjectExists =
            await Subject.findById(subject);


        if (!subjectExists) {

            return res.status(404).json({

                message:
                    "Subject not found"

            });

        }


        // ========================================
        // CREATE ATTENDANCE
        // ========================================

        const attendance =
            await Attendance.create({

                student,

                subject,

                date,

                status,

                markedBy:
                    req.user.id

            });


        // ========================================
        // SUCCESS RESPONSE
        // ========================================

        res.status(201).json({

            message:
                "Attendance marked successfully",

            attendance

        });


    } catch (error) {

        console.error(error);


        // ========================================
        // DUPLICATE ATTENDANCE
        // ========================================

        if (error.code === 11000) {

            return res.status(409).json({

                message:
                    "Attendance already exists for this student, subject and date"

            });

        }


        // ========================================
        // SERVER ERROR
        // ========================================

        res.status(500).json({

            message:
                "Unable to mark attendance",

            error:
                error.message

        });

    }

};



// ========================================
// GET ALL ATTENDANCE
// STAFF ONLY
// ========================================

const getAttendance = async (req, res) => {

    try {

        const attendance =
            await Attendance.find()

                .populate(
                    "student",
                    "name email rollNumber department semester"
                )

                .populate(
                    "subject",
                    "name code"
                )

                .populate(
                    "markedBy",
                    "name email"
                )

                .sort({
                    date: -1
                });


        res.json(attendance);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to fetch attendance",

            error:
                error.message

        });

    }

};



// ========================================
// DELETE ATTENDANCE
// STAFF ONLY
// ========================================

const deleteAttendance = async (req, res) => {

    try {

        const attendance =
            await Attendance.findById(
                req.params.id
            );


        if (!attendance) {

            return res.status(404).json({

                message:
                    "Attendance record not found"

            });

        }


        await Attendance.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:
                "Attendance deleted successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to delete attendance",

            error:
                error.message

        });

    }

};



// ========================================
// UPDATE ATTENDANCE
// STAFF ONLY
// ========================================

const updateAttendance = async (req, res) => {

    try {

        const {
            date,
            status
        } = req.body;


        const attendance =
            await Attendance.findById(
                req.params.id
            );


        if (!attendance) {

            return res.status(404).json({

                message:
                    "Attendance record not found"

            });

        }


        // ========================================
        // UPDATE DATE
        // ========================================

        if (date) {

            attendance.date = date;

        }


        // ========================================
        // UPDATE STATUS
        // ========================================

        if (status) {

            if (
                !["Present", "Absent"].includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid attendance status"

                });

            }


            attendance.status = status;

        }


        // ========================================
        // SAVE
        // ========================================

        await attendance.save();


        res.json({

            message:
                "Attendance updated successfully",

            attendance

        });


    } catch (error) {

        console.error(error);


        // ========================================
        // DUPLICATE AFTER UPDATE
        // ========================================

        if (error.code === 11000) {

            return res.status(409).json({

                message:
                    "Another attendance record already exists for this student, subject and date"

            });

        }


        res.status(500).json({

            message:
                "Unable to update attendance",

            error:
                error.message

        });

    }

};
// ========================================
// GET MY ATTENDANCE
// STUDENT ONLY
// ========================================

const getMyAttendance = async (req, res) => {

    try {

        const attendance =
            await Attendance.find({
                student: req.user.id
            })

            .populate(
                "subject",
                "name code"
            )

            .sort({
                date: -1
            });


        res.json({

            message:
                "Attendance fetched successfully",

            attendance

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to fetch your attendance",

            error:
                error.message

        });

    }

};

// ========================================
// GET MY ATTENDANCE PERCENTAGE
// STUDENT ONLY
// ========================================

const getMyAttendancePercentage = async (req, res) => {

    try {

        const attendance =
            await Attendance.find({
                student: req.user.id
            })
            .populate(
                "subject",
                "name code"
            );


        // No attendance found
        if (attendance.length === 0) {

            return res.json({

                message:
                    "No attendance records found",

                attendance: []

            });

        }


        // Store subject-wise attendance
        const subjectAttendance = {};


        attendance.forEach(record => {

            const subjectId =
                record.subject._id.toString();


            if (!subjectAttendance[subjectId]) {

                subjectAttendance[subjectId] = {

                    subject:
                        record.subject.name,

                    code:
                        record.subject.code,

                    total:
                        0,

                    present:
                        0

                };

            }


            subjectAttendance[subjectId].total++;


            if (record.status === "Present") {

                subjectAttendance[subjectId].present++;

            }

        });


        // Calculate percentage
        const result =
            Object.values(subjectAttendance)
            .map(subject => {

                const percentage =
                    (
                        subject.present /
                        subject.total
                    ) * 100;


                return {

                    subject:
                        subject.subject,

                    code:
                        subject.code,

                    totalClasses:
                        subject.total,

                    present:
                        subject.present,

                    absent:
                        subject.total -
                        subject.present,

                    percentage:
                        Number(
                            percentage.toFixed(2)
                        )

                };

            });


        res.json({

            message:
                "Attendance percentage calculated successfully",

            attendance:
                result

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to calculate attendance percentage",

            error:
                error.message

        });

    }

};
// ========================================
// GET OVERALL ATTENDANCE PERCENTAGE
// STUDENT ONLY
// ========================================

const getOverallAttendancePercentage = async (req, res) => {

    try {

        const attendance = await Attendance.find({
            student: req.user.id
        });

        // No attendance found
        if (attendance.length === 0) {

            return res.json({

                message: "No attendance records found",

                totalClasses: 0,

                present: 0,

                absent: 0,

                percentage: 0

            });

        }

        // Total classes
        const totalClasses = attendance.length;

        // Count present
        const present = attendance.filter(
            record => record.status === "Present"
        ).length;

        // Count absent
        const absent = attendance.filter(
            record => record.status === "Absent"
        ).length;

        // Calculate percentage
        const percentage =
            (present / totalClasses) * 100;

        res.json({

            message:
                "Overall attendance percentage calculated successfully",

            totalClasses,

            present,

            absent,

            percentage:
                Number(percentage.toFixed(2))

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to calculate overall attendance percentage",

            error:
                error.message

        });

    }

};
// ========================================
// STAFF DASHBOARD
// STAFF ONLY
// ========================================

const getDashboardStats = async (req, res) => {

    try {

        const User = require("../models/User");
        const Subject = require("../models/Subject");

        // Count total students
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        // Count total subjects
        const totalSubjects = await Subject.countDocuments();

        // Count total attendance records
        const totalAttendance =
            await Attendance.countDocuments();

        // Count present records
        const presentCount =
            await Attendance.countDocuments({
                status: "Present"
            });

        // Count absent records
        const absentCount =
            await Attendance.countDocuments({
                status: "Absent"
            });

        res.json({

            message:
                "Dashboard statistics fetched successfully",

            totalStudents,

            totalSubjects,

            totalAttendance,

            presentCount,

            absentCount

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to fetch dashboard statistics",

            error:
                error.message

        });

    }

};
// ========================================
// EXPORTS
// ========================================

module.exports = {

    markAttendance,

    getAttendance,
 getMyAttendance,
    deleteAttendance,
 getMyAttendancePercentage,
   getOverallAttendancePercentage,
    updateAttendance,
       getDashboardStats

};