const mongoose = require('mongoose');
const Class = require('../models/classes.model');
const Attendance = require('../models/attendances.model');
require('../models/students.model');

const WARNING_THRESHOLD = 80;

const getAttendanceSummary = async (req, res) => {
    try {
        const { classId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: 'Invalid classId'
            });
        }

        const foundClass = await Class.findById(classId)
            .populate('enrollments.studentId', 'studentCode fullName');

        if (!foundClass) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        const enrolledStudents = foundClass.enrollments
            .filter(enrollment => enrollment.status.toLowerCase() === 'enrolled' && enrollment.studentId)
            .map(enrollment => enrollment.studentId);

        const attendances = await Attendance.find({
            classId,
            studentId: { $in: enrolledStudents.map(student => student._id) }
        });

        const summary = enrolledStudents.map(student => {
            const records = attendances.filter(
                record => record.studentId.toString() === student._id.toString()
            );

            const totalSession = records.length;
            const present = records.filter(record => record.status.toUpperCase() === 'PRESENT').length;
            const absent = records.filter(record => record.status.toUpperCase() === 'ABSENT').length;
            const attendanceRate = totalSession === 0
                ? 0
                : Math.round((present / totalSession) * 100 * 100) / 100;

            return {
                studentId: student._id,
                studentCode: student.studentCode,
                fullName: student.fullName,
                totalSession,
                present,
                absent,
                attendanceRate,
                warning: attendanceRate < WARNING_THRESHOLD
            };
        });

        return res.status(200).json(summary);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAttendanceSummary
};
