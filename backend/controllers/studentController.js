const User = require("../models/User");
const Attendance = require("../models/Attendance");


// ========================================
// GET STUDENT PROFILE
// ========================================

const getStudentProfile = async (req, res) => {

    try {

        const student =
            await User.findById(req.user.id)
                .select("-password");


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.json(student);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};



// ========================================
// GET STUDENT ATTENDANCE
// ========================================

const getStudentAttendance = async (req, res) => {

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
// GET OVERALL ATTENDANCE PERCENTAGE
// ========================================

const getAttendancePercentage = async (req, res) => {

    try {

        const attendance =
            await Attendance.find({
                student: req.user.id
            });


        const totalClasses =
            attendance.length;


        const presentClasses =
            attendance.filter(
                item => item.status === "Present"
            ).length;


        const absentClasses =
            totalClasses - presentClasses;


        const percentage =
            totalClasses === 0
                ? 0
                : (
                    presentClasses /
                    totalClasses
                ) * 100;


        res.json({

            totalClasses,

            presentClasses,

            absentClasses,

            attendancePercentage:
                Number(
                    percentage.toFixed(2)
                )

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to calculate attendance",

            error:
                error.message

        });

    }

};



// ========================================
// GET SUBJECT-WISE ATTENDANCE
// ========================================

const getSubjectWiseAttendance = async (req, res) => {

    try {

        const attendance =
            await Attendance.find({
                student: req.user.id
            })

            .populate(
                "subject",
                "name code"
            );


        const subjectData = {};


        attendance.forEach(item => {

            if (!item.subject) {
                return;
            }


            const subjectId =
                item.subject._id.toString();


            if (!subjectData[subjectId]) {

                subjectData[subjectId] = {

                    subjectName:
                        item.subject.name,

                    subjectCode:
                        item.subject.code,

                    totalClasses: 0,

                    presentClasses: 0,

                    absentClasses: 0

                };

            }


            subjectData[subjectId]
                .totalClasses++;


            if (item.status === "Present") {

                subjectData[subjectId]
                    .presentClasses++;

            } else {

                subjectData[subjectId]
                    .absentClasses++;

            }

        });


        const result =
            Object.values(subjectData)
                .map(subject => {

                    const percentage =
                        subject.totalClasses === 0
                            ? 0
                            : (
                                subject.presentClasses /
                                subject.totalClasses
                            ) * 100;


                    return {

                        ...subject,

                        attendancePercentage:
                            Number(
                                percentage.toFixed(2)
                            )

                    };

                });


        res.json(result);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to calculate subject-wise attendance",

            error:
                error.message

        });

    }

};



// ========================================
// GET ALL STUDENTS
// STAFF ONLY
// ========================================

const getAllStudents = async (req, res) => {

    try {

        const students =
            await User.find({
                role: "student"
            })
            .select("-password");


        res.json(students);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Unable to fetch students",

            error:
                error.message

        });

    }

};



// ========================================
// EXPORTS
// ========================================

module.exports = {

    getStudentProfile,

    getStudentAttendance,

    getAttendancePercentage,

    getSubjectWiseAttendance,

    getAllStudents

};