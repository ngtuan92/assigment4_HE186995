const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const attendanceSchema = new Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    date: { type: Date, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
