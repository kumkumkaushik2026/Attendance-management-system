const Subject = require("../models/Subject");

// CREATE SUBJECT
const createSubject = async (req, res) => {
    try {
        const {
            name,
            code,
            department,
            semester
        } = req.body;

        if (!name || !code || !department || !semester) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingSubject = await Subject.findOne({ code });

        if (existingSubject) {
            return res.status(400).json({
                message: "Subject with this code already exists"
            });
        }

        const subject = await Subject.create({
            name,
            code,
            department,
            semester,
            staff: req.user.id
        });

        res.status(201).json({
            message: "Subject created successfully",
            subject
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to create subject",
            error: error.message
        });
    }
};


// GET STAFF SUBJECTS
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({
            staff: req.user.id
        }).sort({ createdAt: -1 });

        res.json(subjects);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch subjects",
            error: error.message
        });
    }
};


module.exports = {
    createSubject,
    getSubjects
};