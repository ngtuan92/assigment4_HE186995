const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const studentSchema = new Schema(
  {
    studentCode: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
