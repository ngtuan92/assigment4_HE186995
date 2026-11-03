const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const classeSchema = new Schema(
  {
    className: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    lecturerName: { type: String, required: true },
    status: { type: String, required: true },
    enrollments: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        status: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Class = mongoose.model("Class", classeSchema);

module.exports = Class;
