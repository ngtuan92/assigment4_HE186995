const express = require('express');

const studentsController = require('../controllers/students.controller');
const attendancesController = require('../controllers/attendances.controller');

const router = express.Router();

router.get('/:classId/students', studentsController.getStudentsByClass);
router.get('/:classId/attendance-summary', attendancesController.getAttendanceSummary);

module.exports = router;
