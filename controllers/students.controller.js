const mongoose = require('mongoose');
const Class = require('../models/classes.model');
const Student = require('../models/students.model');
const Attendance = require('../models/attendances.model');
require('../models/subjects.model');

const VALID_STATUSES = ['enrolled', 'dropped'];

const getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { status } = req.query;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: 'Invalid classId'
            });
        }

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`
            });
        }

        const foundClass = await Class.findById(classId)
            .populate('enrollments.studentId', 'studentCode fullName email');

        if (!foundClass) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        const students = foundClass.enrollments
            .filter(enrollment => enrollment.status === status && enrollment.studentId)
            .map(enrollment => ({
                studentId: enrollment.studentId._id,
                studentCode: enrollment.studentId.studentCode,
                fullName: enrollment.studentId.fullName,
                email: enrollment.studentId.email
            }));

        return res.status(200).json(students);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getStudentAttendances = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: 'Invalid studentId'
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        const attendances = await Attendance.find({ studentId })
            .sort({ date: -1 })
            .populate({
                path: 'classId',
                select: 'className subjectId',
                populate: { path: 'subjectId', select: 'name' }
            });

        const records = attendances.map(record => ({
            className: record.classId ? record.classId.className : null,
            subjectName: record.classId && record.classId.subjectId ? record.classId.subjectId.name : null,
            date: record.date,
            status: record.status
        }));

        return res.status(200).json(records);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getStudentsByClass,
    getStudentAttendances
};
