const express = require('express');

const studentsController = require('../controllers/students.controller');

const router = express.Router();

router.get('/:studentId/attendances', studentsController.getStudentAttendances);

module.exports = router;
